#!/bin/bash

echo "🚀 Starting Native App Build Process..."

# 1. Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist
rm -rf android/app/src/main/assets/public

# 2. Build web app
echo "📦 Building web app..."
npm run build

# 3. Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist folder not found."
    exit 1
fi

# 4. Check if tarot_card_back.jpg exists in dist
if [ ! -f "dist/assets/images/tarot_card_back.jpg" ]; then
    echo "⚠️  Warning: tarot_card_back.jpg not found in dist!"
    echo "📂 Checking dist/assets/images/ contents:"
    ls -la dist/assets/images/ || echo "dist/assets/images/ folder not found"
else
    echo "✅ tarot_card_back.jpg found in dist"
fi

# 5. Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# 6. Open Android Studio
echo "📱 Opening Android Studio..."
npx cap open android

echo "✨ Build process completed!"
echo "📝 Next steps:"
echo "   1. In Android Studio, select 'Release' build variant"
echo "   2. Enable Chrome Remote Debugging to check console logs"
echo "   3. Test the app on a real device"


