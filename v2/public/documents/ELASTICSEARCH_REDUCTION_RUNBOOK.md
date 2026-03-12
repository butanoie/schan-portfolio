# Elasticsearch Cluster Disk Reduction Runbook

## Overview

This document details the procedures to optimize disk costs on two Elasticsearch clusters. Both use RAID 0 (mdadm) with Azure managed disks. All work must be performed **one node at a time** to maintain cluster availability.

| Cluster    | Nodes | Current Disks                | Target Disks                  | Changes                   |
| ---------- | ----- | ---------------------------- | ----------------------------- | ------------------------- |
| CA Cluster | 6     | 6 × 1TB Premium SSD per node | 4 × 1TB Standard SSD per node | Reduce disks + SKU change |
| US Cluster | 3     | 3 × 1TB Premium SSD per node | 3 × 1TB Standard SSD per node | SKU change only           |

---

# CA Cluster — 6 × 1TB → 4 × 1TB

## CA Cluster Details

| Property               | Value                                |
| ---------------------- | ------------------------------------ |
| Nodes                  | 6 (ca-node-00 through ca-node-05)    |
| Current disks per node | 6 × 1TB Standard SSD (E30) in RAID 0 |
| Target disks per node  | 4 × 1TB Standard SSD (E30) in RAID 0 |
| RAID type              | RAID 0 (mdadm)                       |
| Elasticsearch version  | 7.x (latest)                         |
| Replicas               | 1                                    |

## Prerequisites

- Azure CLI installed and authenticated
- SSH access to all nodes
- Cluster health must be **green** before starting
- Confirm the resource group and VM names for all nodes
- Schedule a maintenance window — expect **1–2 days** for the full process (~3–4 hours per node)

## Important Warnings

> **RAID 0 has no redundancy.** Recreating the array destroys all data on the node. Elasticsearch replicas will repopulate the data once the node rejoins the cluster. **Never have two nodes down simultaneously** — with 1 replica, this risks permanent data loss.

> **Always verify cluster health is green** before moving to the next node.

---

## Procedure (Repeat for Each Node)

The following steps use `ca-node-00` as an example. Replace the node name, VM name, and disk names as appropriate for each subsequent node.

### Step 1: Verify Cluster Health

Before starting work on any node, confirm the cluster is healthy.

```bash
curl -s 'http://localhost:9200/_cluster/health?pretty'
```

Confirm `"status": "green"` and `"unassigned_shards": 0`.

### Step 2: Exclude the Node from Shard Allocation

Tell Elasticsearch to move all shards off the target node.

```bash
curl -X PUT 'http://localhost:9200/_cluster/settings' \
  -H 'Content-Type: application/json' \
  -d '{
    "transient": {
      "cluster.routing.allocation.exclude._name": "ca-node-00"
    }
  }'
```

### Step 3: Wait for Shard Migration to Complete

Monitor until no shards remain on the node. This will take some time depending on how much data needs to move (~1–1.2 TB).

```bash
# Check remaining shards on the node
curl -s 'http://localhost:9200/_cat/shards?v&h=index,shard,prirep,state,node' | grep ca-node-00

# Monitor overall cluster health
curl -s 'http://localhost:9200/_cat/health?v'
```

**Do not proceed until the grep command returns empty and cluster status is green.**

### Step 4: Stop Elasticsearch

SSH into the target node and stop the Elasticsearch service.

```bash
sudo systemctl stop elasticsearch
```

Verify the process is no longer running:

```bash
ps aux | grep elasticsearch
```

### Step 5: Unmount and Stop the RAID Array

```bash
sudo umount /path/to/es/data
sudo mdadm --stop /dev/md0
```

> **Note:** Replace `/path/to/es/data` with the actual Elasticsearch data mount point (check `/etc/fstab` or `elasticsearch.yml` for `path.data`).

### Step 6: Identify Disks to Remove

From your local machine (or Azure Cloud Shell), list the data disks attached to the VM:

```bash
az vm show \
  -g <resource-group> \
  -n <vm-name> \
  --query "storageProfile.dataDisks[].{Name:name, Lun:lun, Size:diskSizeGb}" \
  -o table
```

Select **2 disks** to detach (typically the last two by LUN number).

### Step 7: Detach the Disks from the VM

```bash
az vm disk detach \
  --resource-group <resource-group> \
  --vm-name <vm-name> \
  --name <disk-name-1>

az vm disk detach \
  --resource-group <resource-group> \
  --vm-name <vm-name> \
  --name <disk-name-2>
```

### Step 7a: Change Disk SKU to Standard SSD (if needed)

While the RAID array is stopped and the disks are not in use, this is the safest time to change the SKU of the **remaining disks** on the VM. List the remaining attached disks and update each one:

```bash
# List remaining disks on the VM
az vm show \
  -g <resource-group> \
  -n <vm-name> \
  --query "storageProfile.dataDisks[].{Name:name, Lun:lun}" \
  -o table

# Update each remaining disk to Standard SSD
az disk update --sku StandardSSD_LRS --name <remaining-disk-1> --resource-group <resource-group>
az disk update --sku StandardSSD_LRS --name <remaining-disk-2> --resource-group <resource-group>
az disk update --sku StandardSSD_LRS --name <remaining-disk-3> --resource-group <resource-group>
az disk update --sku StandardSSD_LRS --name <remaining-disk-4> --resource-group <resource-group>
```

> **Note:** This step only needs to be performed if the disks are not already on the Standard SSD (StandardSSD_LRS) SKU. You can check the current SKU with:
>
> ```bash
> az disk show --name <disk-name> --resource-group <resource-group> --query "sku.name" -o tsv
> ```

### Step 8: Recreate the RAID 0 Array with 4 Disks

SSH back into the node. First, identify the remaining disk devices:

```bash
lsblk
```

Then create the new array with the 4 remaining disks:

```bash
sudo mdadm --create /dev/md0 --level=0 --raid-devices=4 /dev/sd<X> /dev/sd<Y> /dev/sd<Z> /dev/sd<W>
```

> **Note:** Replace `/dev/sd<X>` etc. with the actual device names shown by `lsblk`. These may change after detaching disks, so always verify.

### Step 9: Create Filesystem and Mount

```bash
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /path/to/es/data
```

Set ownership for Elasticsearch:

```bash
sudo chown -R elasticsearch:elasticsearch /path/to/es/data
```

### Step 10: Update mdadm Configuration

```bash
sudo mdadm --detail --scan | sudo tee /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

Verify `/etc/fstab` references the correct device or UUID:

```bash
sudo blkid /dev/md0
cat /etc/fstab
```

Update the UUID in `/etc/fstab` if it has changed.

### Step 11: Start Elasticsearch

```bash
sudo systemctl start elasticsearch
```

Monitor the logs to confirm the node joins the cluster:

```bash
sudo journalctl -u elasticsearch -f
```

### Step 12: Re-enable Shard Allocation to the Node

Once the node has joined the cluster:

```bash
curl -X PUT 'http://localhost:9200/_cluster/settings' \
  -H 'Content-Type: application/json' \
  -d '{
    "transient": {
      "cluster.routing.allocation.exclude._name": null
    }
  }'
```

### Step 13: Wait for Cluster to Rebalance

Monitor until the cluster is fully green and all shards are allocated:

```bash
# Watch cluster health
curl -s 'http://localhost:9200/_cat/health?v'

# Watch shard recovery progress
curl -s 'http://localhost:9200/_cat/recovery?v&active_only=true'

# Verify node allocation
curl -s 'http://localhost:9200/_cat/allocation?v'
```

**Do not proceed to the next node until the cluster is green.**

### Step 14: Delete the Detached Disks

Once the node is healthy and the cluster is green, delete the detached disks to stop billing:

```bash
az disk delete --resource-group <resource-group> --name <disk-name-1> --yes
az disk delete --resource-group <resource-group> --name <disk-name-2> --yes
```

---

## Node Checklist

Use this checklist to track progress across all nodes.

| Node       | Shards Drained | ES Stopped | Disks Detached | RAID Rebuilt | ES Started | Cluster Green | Disks Deleted |
| ---------- | -------------- | ---------- | -------------- | ------------ | ---------- | ------------- | ------------- |
| ca-node-00 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |
| ca-node-01 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |
| ca-node-02 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |
| ca-node-03 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |
| ca-node-04 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |
| ca-node-05 | ☐              | ☐          | ☐              | ☐            | ☐          | ☐             | ☐             |

---

## CA Cluster Rollback Plan

If issues occur during the procedure:

1. If Elasticsearch fails to start after RAID rebuild — check logs with `journalctl -u elasticsearch -f` and verify filesystem permissions and mount point.
2. If the cluster does not return to green within a reasonable time — check for unassigned shards with `curl -s 'http://localhost:9200/_cat/shards?v' | grep UNASSIGNED` and investigate with `curl -s 'http://localhost:9200/_cluster/allocation/explain?pretty'`.
3. If a node is lost entirely — the cluster can function with 5 nodes and replicas will cover the missing data. Rebuild the VM if necessary.

## CA Cluster Expected Cost Savings

### Full Optimization Journey

| Phase                  | Configuration                           | USD/Month  | CAD/Month  |
| ---------------------- | --------------------------------------- | ---------- | ---------- |
| Original               | 10 nodes × 6 Premium SSD (60 disks)     | $7,005     | $9,527     |
| After node reduction   | 6 nodes × 6 Premium SSD (36 disks)      | $4,203     | $5,716     |
| **After this runbook** | **6 nodes × 4 Standard SSD (24 disks)** | **$1,950** | **$2,652** |

### Detailed Breakdown (Current → Target)

| Metric                     | Current (36 Premium SSD, 1-yr Reserved) | Target (24 Standard SSD, Pay-as-you-go) | Savings (USD) | Savings (CAD) |
| -------------------------- | --------------------------------------- | --------------------------------------- | ------------- | ------------- |
| Disk provisioning          | 36 × $116.75 = $4,203                   | 24 × $76.80 = $1,843                    | $2,360        | $3,210        |
| Transactions (8.5 ops/s)\* | $0 (no tx cost)                         | ~$107                                   | -$107         | -$146         |
| **Total**                  | **$4,203**                              | **$1,950**                              | **~$2,253**   | **~$3,064**   |

### Total Savings from Original Baseline

|                                             | Monthly (USD) | Monthly (CAD) | Annual (USD) | Annual (CAD) |
| ------------------------------------------- | ------------- | ------------- | ------------ | ------------ |
| Node reduction (60 → 36 disks)              | $2,802        | $3,811        | $33,624      | $45,729      |
| Disk reduction + SKU change (36 → 24 disks) | $2,253        | $3,064        | $27,036      | $36,769      |
| **Total savings vs. original**              | **$5,055**    | **$6,875**    | **$60,660**  | **$82,498**  |

\*Premium SSDs have no transaction costs. Standard SSDs charge $0.002 per 10,000 transactions, adding a small cost.

> **Note on reservation:** The "current" cost uses the 1-year reserved P30 price of ~$116.75/disk/month (~14% discount vs. $135.17 pay-as-you-go). If the reservation has not yet expired, the remaining committed months are a sunk cost — savings will only be realized from the expiration date onward. Standard SSDs do not support reservations.

---

# US Cluster — Premium SSD → Standard SSD (SKU Change Only)

## US Cluster Details

| Property                   | Value                                  |
| -------------------------- | -------------------------------------- |
| Nodes                      | 3 (us-node-00, us-node-01, us-node-02) |
| Current disks per node     | 3 × 1TB Premium SSD (P30) in RAID 0    |
| Target disks per node      | 3 × 1TB Standard SSD (E30) in RAID 0   |
| RAID type                  | RAID 0 (mdadm)                         |
| Current disk used per node | Varies — check with `df -h`            |
| Current disk utilization   | Low (well under 50%)                   |
| Post-change utilization    | Unchanged — same disk count            |

## US Cluster Prerequisites

- Azure CLI installed and authenticated
- SSH access to all US cluster nodes
- Cluster health must be **green** before starting
- Confirm the resource group and VM names for all nodes
- Schedule a maintenance window — expect **~2–3 hours per node** (~6–9 hours total)

## Important Warnings

> **RAID 0 has no redundancy.** Recreating the array destroys all data on the node. Elasticsearch replicas will repopulate the data once the node rejoins the cluster. **Never have two nodes down simultaneously.**

> **With only 3 nodes**, draining a node means the remaining 2 nodes must absorb all shards. During migration, each remaining node will temporarily hold ~50% more data, increasing utilization. Verify your cluster has sufficient headroom before proceeding.

> **Always verify cluster health is green** before moving to the next node.

---

## US Cluster Procedure (Repeat for Each Node)

The following steps use `us-node-00` as an example. Replace the node name, VM name, and disk names for each subsequent node.

### Step 1: Verify Cluster Health

```bash
curl -s 'http://localhost:9200/_cluster/health?pretty'
```

Confirm `"status": "green"` and `"unassigned_shards": 0`.

### Step 2: Exclude the Node from Shard Allocation

```bash
curl -X PUT 'http://localhost:9200/_cluster/settings' \
  -H 'Content-Type: application/json' \
  -d '{
    "transient": {
      "cluster.routing.allocation.exclude._name": "us-node-00"
    }
  }'
```

### Step 3: Wait for Shard Migration to Complete

```bash
# Check remaining shards on the node
curl -s 'http://localhost:9200/_cat/shards?v&h=index,shard,prirep,state,node' | grep us-node-00

# Monitor overall cluster health
curl -s 'http://localhost:9200/_cat/health?v'
```

**Do not proceed until the grep command returns empty and cluster status is green.**

### Step 4: Stop Elasticsearch

```bash
sudo systemctl stop elasticsearch
```

Verify the process is no longer running:

```bash
ps aux | grep elasticsearch
```

### Step 5: Unmount and Stop the RAID Array

```bash
sudo umount /path/to/es/data
sudo mdadm --stop /dev/md0
```

> **Note:** Replace `/path/to/es/data` with the actual Elasticsearch data mount point (check `/etc/fstab` or `elasticsearch.yml` for `path.data`).

### Step 6: Change Disk SKU to Standard SSD

List all data disks attached to the VM and update each one:

```bash
# List all data disks on the VM
az vm show \
  -g <resource-group> \
  -n <vm-name> \
  --query "storageProfile.dataDisks[].{Name:name, Lun:lun, Size:diskSizeGb}" \
  -o table

# Update all 3 disks to Standard SSD
az disk update --sku StandardSSD_LRS --name <disk-1> --resource-group <resource-group>
az disk update --sku StandardSSD_LRS --name <disk-2> --resource-group <resource-group>
az disk update --sku StandardSSD_LRS --name <disk-3> --resource-group <resource-group>
```

Verify the SKU change:

```bash
az disk show --name <disk-1> --resource-group <resource-group> --query "sku.name" -o tsv
```

### Step 7: Recreate the RAID 0 Array with 3 Disks

SSH back into the node. Identify the disk devices:

```bash
lsblk
```

Then recreate the array with all 3 disks:

```bash
sudo mdadm --create /dev/md0 --level=0 --raid-devices=3 /dev/sd<X> /dev/sd<Y> /dev/sd<Z>
```

> **Note:** Replace `/dev/sd<X>` etc. with the actual device names shown by `lsblk`.

### Step 8: Create Filesystem and Mount

```bash
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /path/to/es/data
```

Set ownership for Elasticsearch:

```bash
sudo chown -R elasticsearch:elasticsearch /path/to/es/data
```

### Step 9: Update mdadm Configuration

```bash
sudo mdadm --detail --scan | sudo tee /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

Verify `/etc/fstab` references the correct device or UUID:

```bash
sudo blkid /dev/md0
cat /etc/fstab
```

Update the UUID in `/etc/fstab` if it has changed.

### Step 10: Start Elasticsearch

```bash
sudo systemctl start elasticsearch
```

Monitor the logs to confirm the node joins the cluster:

```bash
sudo journalctl -u elasticsearch -f
```

### Step 11: Re-enable Shard Allocation to the Node

Once the node has joined the cluster:

```bash
curl -X PUT 'http://localhost:9200/_cluster/settings' \
  -H 'Content-Type: application/json' \
  -d '{
    "transient": {
      "cluster.routing.allocation.exclude._name": null
    }
  }'
```

### Step 12: Wait for Cluster to Rebalance

```bash
# Watch cluster health
curl -s 'http://localhost:9200/_cat/health?v'

# Watch shard recovery progress
curl -s 'http://localhost:9200/_cat/recovery?v&active_only=true'

# Verify node allocation
curl -s 'http://localhost:9200/_cat/allocation?v'
```

**Do not proceed to the next node until the cluster is green.**

---

## US Cluster Node Checklist

| Node       | Shards Drained | ES Stopped | SKU Changed | RAID Rebuilt | ES Started | Cluster Green |
| ---------- | -------------- | ---------- | ----------- | ------------ | ---------- | ------------- |
| us-node-00 | ☐              | ☐          | ☐           | ☐            | ☐          | ☐             |
| us-node-01 | ☐              | ☐          | ☐           | ☐            | ☐          | ☐             |
| us-node-02 | ☐              | ☐          | ☐           | ☐            | ☐          | ☐             |

## US Cluster Rollback Plan

If issues occur during the procedure:

1. If Elasticsearch fails to start after RAID rebuild — check logs with `journalctl -u elasticsearch -f` and verify filesystem permissions and mount point.
2. If the cluster does not return to green within a reasonable time — check for unassigned shards with `curl -s 'http://localhost:9200/_cat/shards?v' | grep UNASSIGNED` and investigate with `curl -s 'http://localhost:9200/_cluster/allocation/explain?pretty'`.
3. If a node is lost entirely — the cluster can still function with 2 nodes and replicas will cover the missing data. However, with only 2 remaining nodes, **do not proceed with any further changes** until the third node is restored.

## US Cluster Expected Cost Savings

### Full Optimization Journey

| Phase                  | Configuration                          | USD/Month | CAD/Month |
| ---------------------- | -------------------------------------- | --------- | --------- |
| Original               | 4 nodes × 3 Premium SSD (12 disks)     | $1,401    | $1,905    |
| After node reduction   | 3 nodes × 3 Premium SSD (9 disks)      | $1,051    | $1,429    |
| **After this runbook** | **3 nodes × 3 Standard SSD (9 disks)** | **$731**  | **$994**  |

### Detailed Breakdown (Current → Target)

| Metric                     | Current (9 Premium SSD, 1-yr Reserved) | Target (9 Standard SSD, Pay-as-you-go) | Savings (USD) | Savings (CAD) |
| -------------------------- | -------------------------------------- | -------------------------------------- | ------------- | ------------- |
| Disk provisioning          | 9 × $116.75 = $1,051                   | 9 × $76.80 = $691                      | $360          | $490          |
| Transactions (8.5 ops/s)\* | $0 (no tx cost)                        | ~$40                                   | -$40          | -$54          |
| **Total**                  | **$1,051**                             | **$731**                               | **~$320**     | **~$435**     |

### Total Savings from Original Baseline

|                                 | Monthly (USD) | Monthly (CAD) | Annual (USD) | Annual (CAD) |
| ------------------------------- | ------------- | ------------- | ------------ | ------------ |
| Node reduction (12 → 9 disks)   | $350          | $476          | $4,200       | $5,712       |
| SKU change (Premium → Standard) | $320          | $435          | $3,840       | $5,222       |
| **Total savings vs. original**  | **$670**      | **$911**      | **$8,040**   | **$10,934**  |

\*Premium SSDs have no transaction costs. Standard SSDs charge $0.002 per 10,000 transactions, adding a small cost.

> **Note on reservation:** The "current" cost uses the 1-year reserved P30 price of ~$116.75/disk/month (~14% discount vs. $135.17 pay-as-you-go). If the reservation has not yet expired, the remaining committed months are a sunk cost — savings will only be realized from the expiration date onward. Standard SSDs do not support reservations.

---

## Combined Savings Summary

### End-to-End Optimization (Original → Target)

| Cluster                       | Original (USD/mo) | Target (USD/mo) | Savings (USD/mo) | Savings (CAD/mo) | Savings (USD/yr) | Savings (CAD/yr) |
| ----------------------------- | ----------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| CA (60 Premium → 24 Standard) | $7,005            | $1,950          | ~$5,055          | ~$6,875          | ~$60,660         | ~$82,498         |
| US (12 Premium → 9 Standard)  | $1,401            | $731            | ~$670            | ~$911            | ~$8,040          | ~$10,934         |
| **Total**                     | **$8,406**        | **$2,681**      | **~$5,725**      | **~$7,786**      | **~$68,700**     | **~$93,432**     |

### Savings by Phase

| Phase                                      | Combined (USD/mo) | Combined (CAD/mo) | Combined (USD/yr) | Combined (CAD/yr) |
| ------------------------------------------ | ----------------- | ----------------- | ----------------- | ----------------- |
| Node reduction (completed)                 | $3,152            | $4,287            | $37,824           | $51,441           |
| Disk reduction + SKU change (this runbook) | $2,573            | $3,499            | $30,876           | $41,991           |
| **Total**                                  | **$5,725**        | **$7,786**        | **$68,700**       | **$93,432**       |

> **Note:** "Original" and "current" prices use the 1-year reserved P30 rate of ~$116.75 USD/disk/month. "Target" prices use Standard SSD E30 pay-as-you-go at ~$76.80 USD/disk/month plus transaction costs. Standard SSDs do not offer reservation pricing. Actual prices may vary by region — verify current pricing at the [Azure Managed Disks pricing page](https://azure.microsoft.com/en-us/pricing/details/managed-disks/).
>
> **CAD conversion:** All CAD figures use an exchange rate of 1 USD = 1.36 CAD (verify current rate). Actual Azure billing currency may differ.
>
> **Important:** If the Premium SSD reservation has not yet expired, the committed amount is a sunk cost and cannot be recovered. Plan the migration to coincide with reservation expiry for maximum savings. Unused reserved capacity on removed disks is forfeited (use-it-or-lose-it).
