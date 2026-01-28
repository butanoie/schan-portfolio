#!/bin/bash

# Migration script for portfolio images
# Migrates images from v1/img/gallery to v2/public/images/gallery
# Preserves directory structure and file names

set -e  # Exit on error

SOURCE_DIR="v1/img/gallery"
TARGET_DIR="v2/public/images/gallery"

echo "🖼️  Starting image migration..."
echo "   Source: $SOURCE_DIR"
echo "   Target: $TARGET_DIR"
echo ""

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Count total files
TOTAL_FILES=$(find "$SOURCE_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Found $TOTAL_FILES files to migrate"
echo ""

# Copy entire gallery structure
cp -R "$SOURCE_DIR"/* "$TARGET_DIR/" 2>/dev/null || {
  echo "❌ Source directory not found or empty: $SOURCE_DIR"
  exit 1
}

# Verify migration
TARGET_FILES=$(find "$TARGET_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$TOTAL_FILES" -eq "$TARGET_FILES" ]; then
  echo "✅ Migration successful!"
  echo "   Migrated: $TARGET_FILES files"
  echo ""

  # Show directory breakdown
  echo "📁 Project folders:"
  ls -1 "$TARGET_DIR" | while read folder; do
    if [ -d "$TARGET_DIR/$folder" ]; then
      count=$(find "$TARGET_DIR/$folder" -type f 2>/dev/null | wc -l | tr -d ' ')
      echo "   $folder: $count files"
    fi
  done
else
  echo "❌ Migration failed!"
  echo "   Expected: $TOTAL_FILES files"
  echo "   Found: $TARGET_FILES files"
  exit 1
fi

echo ""
echo "✅ Image migration complete!"
