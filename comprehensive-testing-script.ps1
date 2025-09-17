# Comprehensive Scalix Testing Script
# Tests all features, linking, and navigation

Write-Host "Starting Comprehensive Scalix Testing..." -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Test 1: Check all servers are running
Write-Host "Testing Server Status..." -ForegroundColor Yellow
$servers = @(
    @{Name="External Web"; Url="http://localhost:3000"},
    @{Name="Admin Portal"; Url="http://localhost:3004"},
    @{Name="Cloud API"; Url="http://localhost:8080"}
)

$serverStatus = @{}
foreach ($server in $servers) {
    try {
        $response = Invoke-WebRequest -Uri $server.Url -UseBasicParsing -TimeoutSec 10
        $serverStatus[$server.Name] = @{
            Status = "RUNNING"
            Code = $response.StatusCode
            Color = "Green"
        }
        Write-Host "  $($server.Name): RUNNING (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $serverStatus[$server.Name] = @{
            Status = "DOWN"
            Code = "ERROR"
            Color = "Red"
        }
        Write-Host "  $($server.Name): DOWN - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 2: External Website Navigation
Write-Host "Testing External Website Navigation..." -ForegroundColor Yellow
$externalPages = @(
    @{Name="Homepage"; Url="http://localhost:3000"},
    @{Name="Features"; Url="http://localhost:3000/features"},
    @{Name="Chat"; Url="http://localhost:3000/chat"},
    @{Name="Pricing"; Url="http://localhost:3000/pricing"},
    @{Name="Docs"; Url="http://localhost:3000/docs"},
    @{Name="Blog"; Url="http://localhost:3000/blog"}
)

$externalResults = @{}
foreach ($page in $externalPages) {
    try {
        $response = Invoke-WebRequest -Uri $page.Url -UseBasicParsing -TimeoutSec 15
        $externalResults[$page.Name] = @{
            Status = "ACCESSIBLE"
            Code = $response.StatusCode
            Color = "Green"
        }
        Write-Host "  $($page.Name): ACCESSIBLE (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $externalResults[$page.Name] = @{
            Status = "FAILED"
            Code = "ERROR"
            Color = "Red"
        }
        Write-Host "  $($page.Name): FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Admin Portal Navigation
Write-Host "Testing Admin Portal Navigation..." -ForegroundColor Yellow
$adminPages = @(
    @{Name="Dashboard"; Url="http://localhost:3004"},
    @{Name="Settings"; Url="http://localhost:3004/settings"}
)

$adminResults = @{}
foreach ($page in $adminPages) {
    try {
        $response = Invoke-WebRequest -Uri $page.Url -UseBasicParsing -TimeoutSec 15
        $adminResults[$page.Name] = @{
            Status = "ACCESSIBLE"
            Code = $response.StatusCode
            Color = "Green"
        }
        Write-Host "  $($page.Name): ACCESSIBLE (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $adminResults[$page.Name] = @{
            Status = "FAILED"
            Code = "ERROR"
            Color = "Red"
        }
        Write-Host "  $($page.Name): FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Content Management Page
Write-Host "Testing Content Management..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3004/content-management" -UseBasicParsing -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Host "  Content Management: ACCESSIBLE (Status: $($response.StatusCode))" -ForegroundColor Green
        $contentStatus = "ACCESSIBLE"
        $contentColor = "Green"
    } else {
        Write-Host "  Content Management: ACCESSIBLE (Status: $($response.StatusCode))" -ForegroundColor Yellow
        $contentStatus = "ACCESSIBLE"
        $contentColor = "Yellow"
    }
} catch {
    Write-Host "  Content Management: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $contentStatus = "FAILED"
    $contentColor = "Red"
}

# Test 5: API Endpoints
Write-Host "Testing API Endpoints..." -ForegroundColor Yellow
$apiEndpoints = @(
    @{Name="Cloud API Root"; Url="http://localhost:8080"},
    @{Name="API Analytics"; Url="http://localhost:8080/v1/analytics"}
)

$apiResults = @{}
foreach ($endpoint in $apiEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -UseBasicParsing -TimeoutSec 10
        $apiResults[$endpoint.Name] = @{
            Status = "RESPONDING"
            Code = $response.StatusCode
            Color = "Green"
        }
        Write-Host "  $($endpoint.Name): RESPONDING (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $apiResults[$endpoint.Name] = @{
            Status = "FAILED"
            Code = "ERROR"
            Color = "Red"
        }
        Write-Host "  $($endpoint.Name): FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Generate Report
Write-Host "COMPREHENSIVE TESTING REPORT" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Magenta

Write-Host "SERVER STATUS SUMMARY:" -ForegroundColor Cyan
$serverStatus.GetEnumerator() | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value.Status)" -ForegroundColor $_.Value.Color
}

Write-Host "EXTERNAL WEBSITE SUMMARY:" -ForegroundColor Cyan
$externalResults.GetEnumerator() | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value.Status)" -ForegroundColor $_.Value.Color
}

Write-Host "ADMIN PORTAL SUMMARY:" -ForegroundColor Cyan
$adminResults.GetEnumerator() | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value.Status)" -ForegroundColor $_.Value.Color
}

Write-Host "CONTENT MANAGEMENT SUMMARY:" -ForegroundColor Cyan
Write-Host "  Content Management: $contentStatus" -ForegroundColor $contentColor

Write-Host "API ENDPOINTS SUMMARY:" -ForegroundColor Cyan
$apiResults.GetEnumerator() | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value.Status)" -ForegroundColor $_.Value.Color
}

Write-Host "Testing Complete!" -ForegroundColor Green
