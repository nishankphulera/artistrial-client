#!/bin/bash
# Script to replace all hardcoded localhost:5001 with NEXT_PUBLIC_API_URL

echo "🔍 Finding all files with hardcoded localhost:5001..."

# Find all TypeScript/TSX files
find . -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" | while read file; do
  if grep -q "http://localhost:5001" "$file"; then
    echo "Updating: $file"
    # Use sed to replace, preserving the structure
    # Replace http://localhost:5001 with the env variable
    sed -i '' "s|http://localhost:5001|\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}|g" "$file"
  fi
done

echo ""
echo "✅ Done! All files updated."
echo ""
echo "📋 Summary of changes:"
echo "   - Replaced 'http://localhost:5001' with environment variable"
echo "   - Files will now use NEXT_PUBLIC_API_URL from .env.production"
echo ""
echo "⚠️  Next steps:"
echo "   1. Set NEXT_PUBLIC_API_URL in .env.production"
echo "   2. Run: npm run build"
echo "   3. Deploy to EC2"
