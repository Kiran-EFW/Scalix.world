# Scalix Server Stop Script
# This script stops all running Node.js servers

Write-Host "🛑 Stopping Scalix Servers..." -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Cyan

# Get all Node.js processes
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" }

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js processes running" -ForegroundColor Yellow
    
    foreach ($process in $nodeProcesses) {
        try {
            Write-Host "   🛑 Stopping process ID: $($process.Id)" -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
        }
        catch {
            Write-Host "   ❌ Failed to stop process $($process.Id): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "✅ No Node.js processes found running" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Server shutdown completed!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
