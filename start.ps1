# ResearchForge — One-Click Startup Script (Windows PowerShell)
# Run: .\start.ps1

Write-Host "🚀 Starting ResearchForge..." -ForegroundColor Cyan
Write-Host ""

# Check for .env
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️  .env not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env. Please update GOOGLE_API_KEY before continuing." -ForegroundColor Green
    Write-Host "   Get your free key at: https://aistudio.google.com/app/apikey" -ForegroundColor White
    exit 1
}

# Start backend in new window
Write-Host "🐍 Starting FastAPI backend on http://localhost:8000" -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PWD\backend'; pip install -r requirements/base.txt -q; uvicorn main:app --reload --port 8000"
)

Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "⚛️  Starting Vite frontend on http://localhost:5173" -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PWD\frontend'; npm install --silent; npm run dev"
)

Write-Host ""
Write-Host "✅ ResearchForge is starting!" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "📖 See README.md for setup instructions" -ForegroundColor Gray
