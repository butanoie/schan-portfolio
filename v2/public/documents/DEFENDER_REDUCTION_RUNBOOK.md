# Microsoft Defender for Storage - PowerShell Scripts Documentation

## Table of Contents

1. [Overview](#overview)
2. [Important Background](#important-background)
3. [Prerequisites](#prerequisites)
4. [Script Descriptions](#script-descriptions)
5. [Usage Instructions](#usage-instructions)
6. [File Format Requirements](#file-format-requirements)
7. [Troubleshooting](#troubleshooting)
8. [Editing Guide](#editing-guide)
9. [Cost Information](#cost-information)
10. [References](#references)

---

## Overview

These PowerShell scripts are designed to bulk disable Microsoft Defender for Storage on specific storage accounts and verify the configuration. This is necessary for the **new Defender for Storage plan** ($10 per account pricing model).

**Key Scripts:**

- `Disable-DefenderForStorage.ps1` - Disables Defender on multiple storage accounts
- `Verify-DefenderForStorage.ps1` - Verifies the Defender status after changes

---

## Important Background

### Why These Scripts Are Needed

The **AzDefenderPlanAutoEnable** tag method **DOES NOT WORK** for the new Defender for Storage plan. The tag only works for the legacy "classic" plan.

For the new plan (launched March 28, 2023), you must:

1. Use the Azure REST API to disable Defender at the storage account level
2. Set the `overrideSubscriptionLevelSettings` flag to `true` to prevent Azure policies from re-enabling protection

### New Plan vs Classic Plan

| Feature              | Classic Plan                               | New Plan                                                        |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| **Pricing**          | $0.02 per 10K transactions                 | $10/account + $0.1492 per 1M transactions over 73M              |
| **Exclusion Method** | AzDefenderPlanAutoEnable tag               | API override settings                                           |
| **Availability**     | Deprecated (unavailable after Feb 5, 2025) | Current recommended plan                                        |
| **Features**         | Basic threat detection                     | Enhanced monitoring, malware scanning, sensitive data detection |

---

## Prerequisites

### Required Software

- **Azure PowerShell Module** (Az module)
  ```powershell
  Install-Module -Name Az -AllowClobber -Force
  ```

### Required Permissions

- **Security Admin** OR **Contributor** role on the Azure subscription
- Minimum: **Reader** role for verification script only

### Azure Subscription Requirements

- Storage accounts must exist in the specified subscription
- Defender for Storage must be enabled at the subscription level (to override it at account level)

---

## Script Descriptions

### 1. Disable-DefenderForStorage.ps1

**Purpose:** Bulk disable Microsoft Defender for Storage on storage accounts listed in a text file.

**What it does:**

- Reads storage account names from a text file
- Searches for each account across all resource groups in the subscription
- Calls the Azure REST API to disable Defender for Storage
- Sets the override flag to prevent re-enablement
- Generates a CSV report with results

**Parameters:**

- `FilePath` (Required) - Path to text file with storage account names
- `SubscriptionId` (Required) - Azure subscription ID (GUID format)
- `DisableClassicPlan` (Optional) - Switch to also disable classic Defender for Storage (ATP)

**Output:**

- Console output with color-coded status
- CSV file: `DefenderDisableResults-YYYYMMDD-HHMMSS.csv`

**Example Usage:**

```powershell
# Disable NEW Defender plan only
.\Disable-DefenderForStorage.ps1 -FilePath ".\exclude-list.txt" -SubscriptionId "12345678-1234-1234-1234-123456789012"

# Disable BOTH NEW and CLASSIC plans
.\Disable-DefenderForStorage.ps1 -FilePath ".\exclude-list.txt" -SubscriptionId "12345678-1234-1234-1234-123456789012" -DisableClassicPlan
```

---

### 2. Verify-DefenderForStorage.ps1

**Purpose:** Verify that Defender for Storage is properly disabled on specified accounts.

**What it does:**

- Reads storage account names from the same text file
- Queries the Azure REST API for current Defender status on BOTH plans:
  - **NEW Defender for Storage plan** (2023+ with $10/account pricing)
  - **CLASSIC Defender for Storage plan** (legacy ATP - Advanced Threat Protection)
- Displays whether each plan is enabled/disabled and if override is set
- Optionally shows detailed configuration (malware scanning, sensitive data detection)
- Generates a comprehensive verification report showing both plans

**Parameters:**

- `FilePath` (Required) - Path to text file with storage account names
- `SubscriptionId` (Required) - Azure subscription ID (GUID format)
- `DetailedOutput` (Optional) - Switch to show additional configuration details

**Output:**

- Console output with color-coded verification for both NEW and CLASSIC plans
- CSV file: `DefenderVerifyResults-YYYYMMDD-HHMMSS.csv`
  - Includes columns for both NewPlanEnabled and ClassicPlanEnabled

**Example Usage:**

```powershell
# Basic verification
.\Verify-DefenderForStorage.ps1 -FilePath ".\exclude-list.txt" -SubscriptionId "12345678-1234-1234-1234-123456789012"

# Detailed verification
.\Verify-DefenderForStorage.ps1 -FilePath ".\exclude-list.txt" -SubscriptionId "12345678-1234-1234-1234-123456789012" -DetailedOutput
```

---

## Usage Instructions

### Step-by-Step Process

#### Step 1: Create Your Storage Account List

Create a text file (e.g., `storage-accounts-to-exclude.txt`) with one storage account name per line:

```text
storageaccount1
storageaccount2
prodstorageacct
devstoragetest

# You can add comments with # symbol
# testaccount123
```

**Important:**

- Use only the storage account name (not the full resource ID)
- One account per line
- Lines starting with `#` are treated as comments and ignored
- Blank lines are ignored

#### Step 2: Run the Disable Script

```powershell
# Navigate to script directory
cd C:\Scripts\DefenderForStorage

# Run the disable script (NEW plan only)
.\Disable-DefenderForStorage.ps1 -FilePath ".\storage-accounts-to-exclude.txt" -SubscriptionId "YOUR-SUBSCRIPTION-ID"

# OR: Run to disable BOTH NEW and CLASSIC plans
.\Disable-DefenderForStorage.ps1 -FilePath ".\storage-accounts-to-exclude.txt" -SubscriptionId "YOUR-SUBSCRIPTION-ID" -DisableClassicPlan
```

**Which option should you use?**

- **Without `-DisableClassicPlan`**: Use this if you only have the NEW plan enabled (recommended for most cases)
- **With `-DisableClassicPlan`**: Use this if:
  - You're migrating from the classic plan to the new plan
  - You have both plans enabled on some accounts
  - You want to ensure both are disabled

The script will:

1. Connect to Azure (prompt for login if needed)
2. Display the list of accounts to process
3. Ask for confirmation before proceeding
4. Process each account and show results
5. Generate a summary report
6. Export results to CSV

#### Step 3: Wait for Propagation

**Wait 24 hours** for changes to fully propagate across Azure infrastructure.

#### Step 4: Verify the Changes

```powershell
# Run the verification script
.\Verify-DefenderForStorage.ps1 -FilePath ".\storage-accounts-to-exclude.txt" -SubscriptionId "YOUR-SUBSCRIPTION-ID"
```

**Expected Results:**

- ✓ Green = Both Defender plans are disabled (or only NEW plan if not using classic)
- ✗ Red = One or both Defender plans are still enabled (needs attention)
- ⚠ Yellow = Account not found or error

**Understanding the Output:**

- **NEW Plan**: The current $10/account pricing model (launched March 2023)
- **CLASSIC Plan (ATP)**: Legacy per-transaction pricing model (being phased out)

If both show "DISABLED" - you're good!
If CLASSIC shows "Not Configured" - this is normal if you never used the classic plan.

#### Step 5: Monitor Costs

1. Navigate to **Cost Management + Billing** in Azure Portal
2. Check **Cost Analysis**
3. Filter by:
   - Service: "Microsoft Defender for Cloud"
   - Resource: Your storage accounts
4. Compare costs before and after changes (wait at least 1 week for accurate data)

---

## File Format Requirements

### Input Text File Format

**Correct Format:**

```text
storageaccount1
storageaccount2
storageaccount3
```

**With Comments (also valid):**

```text
# Production accounts
storageaccount1
storageaccount2

# Dev/Test accounts
devstorageacct1
devstorageacct2
```

**Invalid Formats:**

```text
# DO NOT USE THESE FORMATS:

# Full resource IDs (too much information)
/subscriptions/xxxx/resourceGroups/rg1/providers/Microsoft.Storage/storageAccounts/storage1

# URLs
https://storageaccount1.blob.core.windows.net

# With resource groups
rg1/storageaccount1
```

### Output CSV File Format

Both scripts generate CSV files with the following structure:

**Disable Script CSV:**

```csv
StorageAccount,ResourceGroup,Status,Message,Timestamp
storageaccount1,rg-production,Success,Defender disabled successfully (HTTP 200),2026-01-19 14:30:15
storageaccount2,rg-dev,Failed,HTTP 403 - Insufficient permissions,2026-01-19 14:30:20
```

**Verify Script CSV:**

```csv
StorageAccount,ResourceGroup,NewPlanEnabled,ClassicPlanEnabled,OverrideEnabled,MalwareScanning,SensitiveData,Status,Timestamp
storageaccount1,rg-production,DISABLED,Not Configured,ENABLED,N/A,N/A,Verified,2026-01-20 10:15:30
storageaccount2,rg-dev,ENABLED,DISABLED,DISABLED,ENABLED,DISABLED,Verified,2026-01-20 10:15:35
storageaccount3,rg-test,DISABLED,DISABLED,ENABLED,N/A,N/A,Verified,2026-01-20 10:15:40
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Storage account not found in subscription"

**Cause:** Storage account doesn't exist or is in a different subscription.

**Solution:**

1. Verify the storage account name is correct (case-sensitive)
2. Check that you're using the correct subscription ID
3. Run this command to list all storage accounts:
   ```powershell
   Get-AzStorageAccount | Select-Object StorageAccountName, ResourceGroupName
   ```

---

#### Issue 2: "HTTP 403 - Insufficient permissions"

**Cause:** Your account doesn't have required permissions.

**Solution:**

1. Verify you have **Security Admin** or **Contributor** role
2. Check role assignments:
   ```powershell
   Get-AzRoleAssignment -SignInName your-email@domain.com
   ```
3. Contact your Azure administrator to grant necessary permissions

---

#### Issue 6: Defender re-enables automatically after disabling

**Cause:** Azure Policy is overriding your settings.

**Solution:**

1. Check for Azure Policies that might re-enable Defender:
   - "Configure Microsoft Defender for Storage to be enabled"
   - "Configure basic Microsoft Defender for Storage to be enabled"
2. Either:
   - **Option A:** Exclude your storage accounts from the policy
   - **Option B:** Disable or modify the policy
   - **Option C:** Set a higher-priority deny policy

---

#### Issue 4: "MissingSubscription" error or HTTP 404

**Error Message:**

```
✗ Failed - HTTP Status: 404
Response: {
  "error": {
    "code": "MissingSubscription",
    "message": "The request did not have a subscription or a valid tenant level resource provider."
  }
}
```

**Cause:** The API path is malformed or the subscription context is not set correctly.

**Solution:**

1. **Verify you're connected to the correct subscription:**

   ```powershell
   Get-AzContext
   # Should show your subscription ID and name

   # If wrong, set correct subscription:
   Set-AzContext -SubscriptionId "your-subscription-id"
   ```

2. **Check the resource ID format:**

   ```powershell
   # Get a storage account and check its ID format
   $sa = Get-AzStorageAccount -ResourceGroupName "your-rg" -Name "your-storage-account"
   Write-Host "Resource ID: $($sa.Id)"

   # Should look like:
   # /subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{name}
   ```

3. **Verify Microsoft.Security provider is registered:**

   ```powershell
   # Check registration status
   Get-AzResourceProvider -ProviderNamespace Microsoft.Security

   # If not registered, register it:
   Register-AzResourceProvider -ProviderNamespace Microsoft.Security

   # Wait for registration to complete (takes 1-2 minutes)
   while ((Get-AzResourceProvider -ProviderNamespace Microsoft.Security).RegistrationState -ne "Registered") {
       Write-Host "Waiting for Microsoft.Security provider registration..."
       Start-Sleep -Seconds 10
   }
   Write-Host "Microsoft.Security provider registered successfully"
   ```

4. **If the error persists**, this may indicate you're in Azure Government cloud. Check your cloud environment:

   ```powershell
   (Get-AzContext).Environment.Name

   # If it shows "AzureUSGovernment" or similar, you may need to use different endpoints
   # Connect to Azure Government:
   Connect-AzAccount -Environment AzureUSGovernment
   ```

5. **Ensure the script is using the updated version** with the corrected API path (not full URL).

---

#### Issue 5: Script fails with "Invoke-AzRestMethod not found"

**Cause:** Az PowerShell module is outdated or not installed.

**Solution:**

```powershell
# Update Az module
Update-Module -Name Az -Force

# Or reinstall
Uninstall-Module -Name Az -AllVersions
Install-Module -Name Az -AllowClobber -Force
```

---

#### Issue 7: Verification shows "No Configuration" (HTTP 404)

**Cause:** Storage account is using subscription-level default settings with no override.

**Solution:**

- This is expected if Defender was never explicitly configured at the account level
- Check subscription-level Defender settings in Azure Portal
- If subscription-level Defender is disabled, the account is protected by default

---

#### Issue 8: Classic Defender plan still shows as enabled

**Cause:** The NEW plan disable script only disables the NEW Defender for Storage plan by default. The classic plan needs to be disabled separately.

**Solution:**

**Option 1: Use the script with -DisableClassicPlan flag:**

```powershell
.\Disable-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx" -DisableClassicPlan
```

**Option 2: Manually disable via PowerShell:**

```powershell
# Get storage account
$storageAccount = Get-AzStorageAccount -ResourceGroupName "your-rg" -Name "your-storage-account"
$resourceId = $storageAccount.Id

# Disable classic Defender (ATP)
Disable-AzSecurityAdvancedThreatProtection -ResourceId $resourceId

# Verify it's disabled
Get-AzSecurityAdvancedThreatProtection -ResourceId $resourceId
```

**Option 3: Disable via Azure Portal:**

1. Navigate to your storage account
2. Go to **Security + networking** → **Microsoft Defender for Cloud**
3. Look for "Advanced Threat Protection" or "Classic plan"
4. Set to **Off**

**Note:** If you're on the subscription-level classic plan, you may need to:

1. Add the tag: `AzDefenderPlanAutoEnable=off` to the storage account
2. Then disable ATP on the account
3. This prevents the subscription policy from re-enabling it

---

### Debugging Tips

**Enable Verbose Output:**

```powershell
$VerbosePreference = "Continue"
.\Disable-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx" -Verbose
```

**Check Both Plan Statuses Manually:**

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "rg-name" -Name "storage-name"
$resourceId = $storageAccount.Id

# Check NEW plan
$newPlanPath = "$resourceId/providers/Microsoft.Security/DefenderForStorageSettings/current?api-version=2025-01-01"
$newResult = Invoke-AzRestMethod -Method GET -Path $newPlanPath
Write-Host "NEW Plan Response:" $newResult.Content

# Check CLASSIC plan (ATP)
$classicPlanPath = "$resourceId/providers/Microsoft.Security/advancedThreatProtectionSettings/current?api-version=2019-01-01"
$classicResult = Invoke-AzRestMethod -Method GET -Path $classicPlanPath
Write-Host "CLASSIC Plan Response:" $classicResult.Content
```

**Check API Response Details:**
Add this after the `Invoke-AzRestMethod` call in the script:

```powershell
Write-Host "API Response: $($result.Content)" -ForegroundColor Magenta
```

**Test Single Account:**
Create a test file with just one storage account name to isolate issues.

---

## Editing Guide

### How to Customize the Scripts

#### Common Customizations

**1. Change API Version**

If Microsoft updates the API again in the future, you may need to update the API version string:

```powershell
# Find this line in both scripts:
$apiVersion = "2025-01-01"  # Current latest stable version

# Update to new version if needed:
$apiVersion = "2025-XX-XX"  # Or newer version
```

**Note:** The scripts were updated in January 2026 from `2022-12-01-preview` to `2025-01-01` (the latest stable GA version). For future updates, check the Microsoft documentation for newer API versions.

---

**2. Modify Confirmation Prompt**

To skip the confirmation prompt (for automation):

In `Disable-DefenderForStorage.ps1`, comment out or remove:

```powershell
# $confirmation = Read-Host "Do you want to proceed...?"
# if ($confirmation -ne "yes") {
#     Write-ColorOutput "Operation cancelled by user." "Yellow"
#     exit 0
# }
```

---

**3. Change CSV Output Location**

To save CSV files to a specific directory:

```powershell
# Find this line:
$csvPath = Join-Path -Path $PSScriptRoot -ChildPath $csvFileName

# Change to:
$csvPath = Join-Path -Path "C:\Reports" -ChildPath $csvFileName
```

---

**4. Add Email Notifications**

Add this function to send email on completion:

```powershell
function Send-CompletionEmail {
    param([string]$Subject, [string]$Body)

    Send-MailMessage `
        -From "azure-scripts@company.com" `
        -To "admin@company.com" `
        -Subject $Subject `
        -Body $Body `
        -SmtpServer "smtp.company.com"
}

# Call at end of script:
Send-CompletionEmail -Subject "Defender Disable Complete" -Body "Processed $($storageAccountNames.Count) accounts"
```

---

**5. Add Logging to File**

Add this at the beginning of the script:

```powershell
$logFile = "DefenderScript-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
Start-Transcript -Path $logFile

# Your script content here...

Stop-Transcript
```

---

**6. Filter by Resource Group**

To only process storage accounts in specific resource groups:

```powershell
# After retrieving all storage accounts:
$allStorageAccounts = Get-AzStorageAccount | Where-Object {
    $_.ResourceGroupName -in @("rg-prod", "rg-dev", "rg-test")
}
```

---

**7. Add Retry Logic for Failed Accounts**

Add this function:

```powershell
function Invoke-WithRetry {
    param(
        [ScriptBlock]$ScriptBlock,
        [int]$MaxRetries = 3
    )

    $attempt = 1
    while ($attempt -le $MaxRetries) {
        try {
            return & $ScriptBlock
        }
        catch {
            if ($attempt -eq $MaxRetries) { throw }
            Write-Host "Attempt $attempt failed, retrying..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            $attempt++
        }
    }
}

# Use it like this:
$result = Invoke-WithRetry {
    Invoke-AzRestMethod -Method PUT -Path $uri -Payload $body
}
```

---

### Script Parameters Reference

#### Disable-DefenderForStorage.ps1 Parameters

| Parameter            | Type   | Required | Validation  | Description                          |
| -------------------- | ------ | -------- | ----------- | ------------------------------------ |
| `FilePath`           | string | Yes      | Must exist  | Path to text file with account names |
| `SubscriptionId`     | string | Yes      | GUID format | Azure subscription ID                |
| `DisableClassicPlan` | switch | No       | N/A         | Also disable classic Defender (ATP)  |

#### Verify-DefenderForStorage.ps1 Parameters

| Parameter        | Type   | Required | Validation  | Description                           |
| ---------------- | ------ | -------- | ----------- | ------------------------------------- |
| `FilePath`       | string | Yes      | Must exist  | Path to text file with account names  |
| `SubscriptionId` | string | Yes      | GUID format | Azure subscription ID                 |
| `DetailedOutput` | switch | No       | N/A         | Show additional configuration details |

---

### Key Variables to Understand

**In Disable-DefenderForStorage.ps1:**

```powershell
# Storage account counters
$successCount = 0      # Successfully disabled accounts
$failCount = 0         # Failed to disable
$notFoundCount = 0     # Accounts not found in subscription

# API configuration
$apiVersion = "2025-01-01"
$uri = "https://management.azure.com..."

# Request body - THIS IS CRITICAL
$body = @{
    properties = @{
        isEnabled = $false                          # Disable Defender
        overrideSubscriptionLevelSettings = $true   # Prevent re-enablement
    }
}
```

**In Verify-DefenderForStorage.ps1:**

```powershell
# Status counters
$disabledCount = 0     # Accounts with Defender disabled
$enabledCount = 0      # Accounts with Defender still enabled
$errorCount = 0        # Verification errors

# Settings from API response
$isEnabled = $settings.isEnabled                          # true/false
$overrideEnabled = $settings.overrideSubscriptionLevelSettings  # true/false
```

---

### API Request Body Explanation

The most critical part of the disable script is the API request body:

```powershell
$body = @{
    properties = @{
        isEnabled = $false                          # Line 1
        overrideSubscriptionLevelSettings = $true   # Line 2
    }
} | ConvertTo-Json
```

**Line 1:** `isEnabled = $false`

- Disables Microsoft Defender for Storage on this account

**Line 2:** `overrideSubscriptionLevelSettings = $true` ⚠️ **CRITICAL**

- Tells Azure to use THIS account's settings instead of subscription defaults
- Without this, Azure policies will re-enable Defender within 24 hours
- This is the equivalent of checking "Override subscription-level settings" in the Portal

**If you want to disable specific features only:**

```powershell
$body = @{
    properties = @{
        isEnabled = $true                           # Keep Defender enabled
        overrideSubscriptionLevelSettings = $true   # But use custom settings
        malwareScanning = @{
            onUpload = @{
                isEnabled = $false                  # Disable malware scanning
                capGBPerMonth = 0
            }
        }
        sensitiveDataDiscovery = @{
            isEnabled = $false                      # Disable sensitive data detection
        }
    }
} | ConvertTo-Json -Depth 10
```

---

## Cost Information

### Defender for Storage Pricing (New Plan)

**Base Cost:**

- $10 per storage account per month
- Includes up to 73 million transactions

**Additional Costs:**

- $0.1492 per 1 million transactions over 73M threshold
- Malware Scanning: $0.15 per GB scanned (optional add-on)
- Sensitive Data Detection: Included in base price

### Cost Comparison Example

**Scenario:** Storage account with 200M transactions per month

**Without Exclusion (Defender Enabled):**

```
Base cost:           $10.00
Overage (127M):      $18.95   (127 × $0.1492)
Total:               $28.95 per month
```

**With Exclusion (Defender Disabled):**

```
Total:               $0.00 per month
Savings:             $28.95 per month
Annual Savings:      $347.40
```

### Expected Savings Timeline

- **Day 1-2:** Changes propagate
- **Week 1:** Partial savings visible (prorated)
- **Month 2:** Full savings reflected in billing
- **3 months:** Confirm consistent cost reduction

---

## References

### Microsoft Documentation

- [What is Microsoft Defender for Storage](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-introduction)
- [Enable and configure Defender for Storage](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-classic-enable)
- [Migrate to new Defender for Storage plan](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-classic-migrate)
- [Advanced configurations for malware scanning](https://learn.microsoft.com/en-us/azure/defender-for-cloud/advanced-configurations-for-malware-scanning)
- [Defender for Storage FAQ](https://learn.microsoft.com/en-us/azure/defender-for-cloud/faq-defender-for-storage)

### API Documentation

- **API Version: `2025-01-01`** (Latest stable GA version - updated January 2026)
- Previous version: `2022-12-01-preview` (deprecated, use latest)
- Available versions: `2025-07-01-preview` (preview), `2025-06-01`, `2025-01-01` (stable), `2024-10-01-preview`
- Endpoint: `https://management.azure.com/{resourceId}/providers/Microsoft.Security/DefenderForStorageSettings/current`
- Methods: GET, PUT, DELETE

### PowerShell Resources

- [Az PowerShell Module](https://learn.microsoft.com/en-us/powershell/azure/install-azure-powershell)
- [Invoke-AzRestMethod](https://learn.microsoft.com/en-us/powershell/module/az.accounts/invoke-azrestmethod)

---

## Version History

| Version | Date         | Changes                                                                   |
| ------- | ------------ | ------------------------------------------------------------------------- |
| 1.2     | January 2026 | Added classic Defender for Storage (ATP) checking and disable capability  |
| 1.1     | January 2026 | Updated API version from 2022-12-01-preview to 2025-01-01 (latest stable) |
| 1.0     | January 2026 | Initial release with bulk disable and verify scripts                      |

---

## Support and Maintenance

**Script Maintenance:**

- Review quarterly for API updates
- Test after major Azure updates
- Update API version if Microsoft deprecates current version

**Contact:**

- For Azure questions: Contact your Azure administrator
- For script issues: Review troubleshooting section or contact IT Operations team

---

## Best Practices

1. **Always test with 1-2 storage accounts first** before processing large batches
2. **Keep a backup** of your storage account list file
3. **Run verification script** 24 hours after disabling
4. **Document exceptions** - keep notes on why specific accounts were excluded
5. **Review monthly costs** to ensure savings are realized
6. **Re-run verification quarterly** to catch any policy drift
7. **Version control** - keep script versions in source control
8. **Audit trail** - save CSV outputs for compliance and troubleshooting

---

## Quick Reference Commands

```powershell
# Install/Update Az Module
Install-Module -Name Az -AllowClobber -Force
Update-Module -Name Az -Force

# Login to Azure
Connect-AzAccount

# List all storage accounts
Get-AzStorageAccount | Select-Object StorageAccountName, ResourceGroupName

# Check your permissions
Get-AzRoleAssignment -SignInName your-email@domain.com

# Run disable script (NEW plan only)
.\Disable-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx"

# Run disable script (BOTH plans)
.\Disable-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx" -DisableClassicPlan

# Run verify script
.\Verify-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx"

# Run verify with details
.\Verify-DefenderForStorage.ps1 -FilePath ".\list.txt" -SubscriptionId "xxx" -DetailedOutput

# Check classic ATP status manually
Get-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/.../storageAccounts/..."
```

---

_Last Updated: January 2026_
_Script Version: 1.2_
_Documentation Version: 1.2_
