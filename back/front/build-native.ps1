# PowerShell script for Windows

Write-Host "🚀 Starting Native App Build Process..." -ForegroundColor Green

# 1. Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android\app\src\main\assets\public" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Build web app
Write-Host "📦 Building web app..." -ForegroundColor Yellow
npm run build

# 3. Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed! dist folder not found." -ForegroundColor Red
    exit 1
}

# 4. Check if tarot_card_back.jpg exists in dist
if (-not (Test-Path "dist\assets\images\tarot_card_back.jpg")) {
    Write-Host "⚠️  Warning: tarot_card_back.jpg not found in dist!" -ForegroundColor Yellow
    Write-Host "📂 Checking dist\assets\images\ contents:" -ForegroundColor Cyan
    Get-ChildItem "dist\assets\images\" -ErrorAction SilentlyContinue | Format-Table Name, Length
} else {
    Write-Host "✅ tarot_card_back.jpg found in dist" -ForegroundColor Green
}

# 5. Sync with Capacitor
Write-Host "🔄 Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 6. Open Android Studio
Write-Host "📱 Opening Android Studio..." -ForegroundColor Yellow
npx cap open android

Write-Host "✨ Build process completed!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. In Android Studio, select 'Release' build variant"
Write-Host "   2. Enable Chrome Remote Debugging to check console logs"
Write-Host "   3. Test the app on a real device"


