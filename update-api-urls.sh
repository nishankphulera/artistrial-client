#!/bin/bash
# Script to replace hardcoded localhost:5001 with NEXT_PUBLIC_API_URL

# Find all TypeScript/TSX files with localhost:5001
find . -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" ! -path "*/.next/*" | while read file; do
  if grep -q "http://localhost:5001" "$file"; then
    echo "Updating: $file"
    # Replace http://localhost:5001 with environment variable
    sed -i '' "s|http://localhost:5001|\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}|g" "$file"
  fi
done

echo "✅ Done! All files updated."
