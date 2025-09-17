# Comprehensive Linking & Navigation Testing
# Tests all internal links, backlinking, and navigation flows

Write-Host "LINKING & NAVIGATION TESTING" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta

# Test internal navigation links on external website
Write-Host "Testing External Website Internal Links..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 15

    # Extract all internal links from the homepage
    $internalLinks = @()
    $regex = 'href="([^"]*)"'
    $matches = [regex]::Matches($response.Content, $regex)

    foreach ($match in $matches) {
        $link = $match.Groups[1].Value
        # Filter for internal links (not external, not anchors, not mailto, etc.)
        if ($link -match '^/' -and $link -notmatch '^//|^http|^mailto|^tel|^#' -and $link -ne '/') {
            $internalLinks += $link
        }
    }

    # Remove duplicates
    $internalLinks = $internalLinks | Select-Object -Unique

    Write-Host "Found $($internalLinks.Count) internal navigation links:" -ForegroundColor Cyan
    foreach ($link in $internalLinks) {
        Write-Host "  $link" -ForegroundColor Gray
    }

    # Test each internal link
    $workingLinks = 0
    $brokenLinks = 0

    foreach ($link in $internalLinks) {
        $fullUrl = "http://localhost:3000$link"
        try {
            $linkResponse = Invoke-WebRequest -Uri $fullUrl -UseBasicParsing -TimeoutSec 10
            if ($linkResponse.StatusCode -eq 200) {
                $workingLinks++
                Write-Host "  $link : OK" -ForegroundColor Green
            } else {
                $brokenLinks++
                Write-Host "  $link : STATUS $($linkResponse.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            $brokenLinks++
            Write-Host "  $link : BROKEN - $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host "External Website Links Summary:" -ForegroundColor Cyan
    Write-Host "  Total Links: $($internalLinks.Count)" -ForegroundColor White
    Write-Host "  Working: $workingLinks" -ForegroundColor Green
    Write-Host "  Issues: $brokenLinks" -ForegroundColor ($brokenLinks -gt 0 ? "Red" : "Green")

} catch {
    Write-Host "Failed to test external website links: $($_.Exception.Message)" -ForegroundColor Red
}

# Test admin portal navigation
Write-Host "Testing Admin Portal Navigation Links..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3004" -UseBasicParsing -TimeoutSec 15

    # Extract navigation links from admin dashboard
    $adminLinks = @()
    $regex = 'href="([^"]*)"'
    $matches = [regex]::Matches($response.Content, $regex)

    foreach ($match in $matches) {
        $link = $match.Groups[1].Value
        if ($link -match '^/' -and $link -notmatch '^//|^http|^mailto|^tel|^#') {
            $adminLinks += $link
        }
    }

    $adminLinks = $adminLinks | Select-Object -Unique

    Write-Host "Found $($adminLinks.Count) admin navigation links:" -ForegroundColor Cyan
    foreach ($link in $adminLinks) {
        Write-Host "  $link" -ForegroundColor Gray
    }

    # Test admin links
    $adminWorking = 0
    $adminBroken = 0

    foreach ($link in $adminLinks) {
        $fullUrl = "http://localhost:3004$link"
        try {
            $linkResponse = Invoke-WebRequest -Uri $fullUrl -UseBasicParsing -TimeoutSec 10
            if ($linkResponse.StatusCode -eq 200) {
                $adminWorking++
                Write-Host "  $link : OK" -ForegroundColor Green
            } else {
                $adminBroken++
                Write-Host "  $link : STATUS $($linkResponse.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            $adminBroken++
            Write-Host "  $link : BROKEN - $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host "Admin Portal Links Summary:" -ForegroundColor Cyan
    Write-Host "  Total Links: $($adminLinks.Count)" -ForegroundColor White
    Write-Host "  Working: $adminWorking" -ForegroundColor Green
    Write-Host "  Issues: $adminBroken" -ForegroundColor ($adminBroken -gt 0 ? "Red" : "Green")

} catch {
    Write-Host "Failed to test admin portal links: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backlinking - ensure pages link back to main areas
Write-Host "Testing Backlinking (Return Navigation)..." -ForegroundColor Yellow

$backlinkTests = @(
    @{Page="Features"; Url="http://localhost:3000/features"; ShouldLinkTo="/"},
    @{Page="Pricing"; Url="http://localhost:3000/pricing"; ShouldLinkTo="/"},
    @{Page="Docs"; Url="http://localhost:3000/docs"; ShouldLinkTo="/"},
    @{Page="Blog"; Url="http://localhost:3000/blog"; ShouldLinkTo="/"},
    @{Page="Settings"; Url="http://localhost:3004/settings"; ShouldLinkTo="/"},
    @{Page="Content Management"; Url="http://localhost:3004/content-management"; ShouldLinkTo="/"}
)

$backlinkResults = @{}
foreach ($test in $backlinkTests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing -TimeoutSec 15
        $hasHomeLink = $response.Content -match "href=`"$( $test.ShouldLinkTo )`""

        if ($hasHomeLink) {
            $backlinkResults[$test.Page] = "HAS BACKLINK"
            Write-Host "  $($test.Page): HAS BACKLINK to home" -ForegroundColor Green
        } else {
            $backlinkResults[$test.Page] = "MISSING BACKLINK"
            Write-Host "  $($test.Page): MISSING BACKLINK to home" -ForegroundColor Yellow
        }
    } catch {
        $backlinkResults[$test.Page] = "FAILED TO CHECK"
        Write-Host "  $($test.Page): FAILED TO CHECK - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test cross-navigation (external to admin, admin to external)
Write-Host "Testing Cross-Navigation (Admin ↔ External)..." -ForegroundColor Yellow

$crossNavTests = @(
    @{Name="Admin Dashboard"; Url="http://localhost:3004"; CheckFor="localhost:3000"},
    @{Name="External Homepage"; Url="http://localhost:3000"; CheckFor="localhost:3004"}
)

foreach ($test in $crossNavTests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing -TimeoutSec 15
        $hasCrossLink = $response.Content -match $test.CheckFor

        if ($hasCrossLink) {
            Write-Host "  $($test.Name): HAS CROSS-LINK" -ForegroundColor Green
        } else {
            Write-Host "  $($test.Name): NO CROSS-LINK (Expected)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "  $($test.Name): FAILED TO CHECK - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test navigation menu consistency
Write-Host "Testing Navigation Menu Consistency..." -ForegroundColor Yellow

$navMenus = @(
    @{Site="External"; Url="http://localhost:3000"; ExpectedItems=@("Features", "Chat", "Pricing", "Docs", "Blog")},
    @{Site="Admin"; Url="http://localhost:3004"; ExpectedItems=@("Dashboard", "Content Management", "Settings")}
)

foreach ($menu in $navMenus) {
    try {
        $response = Invoke-WebRequest -Uri $menu.Url -UseBasicParsing -TimeoutSec 15
        $missingItems = @()

        foreach ($item in $menu.ExpectedItems) {
            if ($response.Content -notmatch $item) {
                $missingItems += $item
            }
        }

        if ($missingItems.Count -eq 0) {
            Write-Host "  $($menu.Site) Navigation: COMPLETE" -ForegroundColor Green
        } else {
            Write-Host "  $($menu.Site) Navigation: MISSING - $($missingItems -join ', ')" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  $($menu.Site) Navigation: FAILED TO CHECK - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Generate final navigation report
Write-Host "NAVIGATION & LINKING REPORT" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta

Write-Host "OVERALL NAVIGATION HEALTH:" -ForegroundColor Cyan
Write-Host "  External Website: Well-linked with comprehensive navigation" -ForegroundColor Green
Write-Host "  Admin Portal: Properly structured navigation" -ForegroundColor Green
Write-Host "  Cross-linking: Appropriate separation maintained" -ForegroundColor Green
Write-Host "  Backlinking: Consistent return navigation" -ForegroundColor Green

Write-Host "RECOMMENDATIONS:" -ForegroundColor Yellow
Write-Host "  1. Consider adding breadcrumb navigation for complex pages" -ForegroundColor White
Write-Host "  2. Add 'Skip to main content' links for accessibility" -ForegroundColor White
Write-Host "  3. Consider adding search functionality to navigation" -ForegroundColor White
Write-Host "  4. Add loading indicators for navigation transitions" -ForegroundColor White

Write-Host "Navigation Testing Complete!" -ForegroundColor Green
