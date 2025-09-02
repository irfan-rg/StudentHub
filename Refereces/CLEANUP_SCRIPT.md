# Cleanup Script for TypeScript to JavaScript Migration

Run these commands in your project root to complete the cleanup:

## 1. Remove TypeScript Files
```bash
# Remove all TypeScript component files (keep only .jsx versions)
find ./components -name "*.tsx" -type f -delete

# Remove TypeScript utility files
rm -f ./components/ui/use-mobile.ts
rm -f ./components/ui/utils.ts

# Remove old TypeScript App file
rm -f ./App.tsx

# Note: Keep ImageWithFallback.jsx and remove the .tsx version
rm -f ./components/figma/ImageWithFallback.tsx

# Optional: Remove any TypeScript config files if they exist
rm -f tsconfig.json
rm -f tsconfig.*.json
```

## 2. Update Package.json Dependencies
Remove these TypeScript-related dependencies from your package.json:

```json
// Remove these from dependencies or devDependencies:
{
  "@types/react": "...",
  "@types/react-dom": "...",
  "typescript": "...",
  "@typescript-eslint/eslint-plugin": "...",
  "@typescript-eslint/parser": "..."
}
```

Add these MERN-specific dependencies:
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-router-dom": "^6.8.0", 
    "react-query": "^3.39.0",
    "socket.io-client": "^4.7.0",
    "date-fns": "^2.29.0",
    "js-cookie": "^3.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0"
  }
}
```

## 3. Install New Dependencies
```bash
npm install axios react-router-dom react-query socket.io-client date-fns js-cookie
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## 4. Update Import Statements (if needed)
Search and replace any remaining TypeScript imports in your components:

```bash
# Find any remaining .tsx imports and update to .jsx
grep -r "from.*\.tsx" ./components/
# Manually update any found instances to use .jsx extension
```

## 5. Verify Cleanup
```bash
# Check that no TypeScript files remain
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules

# The only results should be:
# - ./components/figma/ImageWithFallback.tsx (protected system file)
# - Any files in node_modules (ignore these)
```

## 6. Test the Application
```bash
# Start the development server to ensure everything works
npm start

# Check for any import errors or missing dependencies
```

## 7. Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your local development settings
```

After running these commands, your project will be completely JavaScript-based and ready for MERN stack development!