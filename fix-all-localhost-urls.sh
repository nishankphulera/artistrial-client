#!/bin/bash
# Script to replace all hardcoded localhost:5001 URLs with apiUrl() calls

echo "🔍 Finding all files with hardcoded localhost:5001..."

# Find all TypeScript/TSX files
find . -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" | while read file; do
  if grep -q "http://localhost:5001" "$file"; then
    echo "Found: $file"
  fi
done

echo ""
echo "⚠️  This script will need manual review for each file."
echo "   Use the apiUrl() function from @/utils/api instead."
echo ""
echo "Example replacement:"
echo "  OLD: fetch('http://localhost:5001/api/users')"
echo "  NEW: fetch(apiUrl('users'))"
echo ""
echo "Make sure to add: import { apiUrl } from '@/utils/api';"

