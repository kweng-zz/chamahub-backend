@echo off
REM ChamaHub Backend - Pre-Deployment Validation Script (Windows)
REM This script checks if your backend is ready for production deployment

setlocal enabledelayedexpansion

echo.
echo ChamaHub Backend - Pre-Deployment Validation
echo ================================================
echo.

set PASSED=0
set FAILED=0
set WARNINGS=0

REM 1. Check Node version
echo 1. Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [OK] Node.js installed: !NODE_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not installed
    set /a FAILED+=1
)
echo.

REM 2. Check npm
echo 2. Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [OK] npm installed: !NPM_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] npm not installed
    set /a FAILED+=1
)
echo.

REM 3. Check dependencies
echo 3. Checking dependencies...
if exist "package.json" (
    echo [OK] package.json exists
    set /a PASSED+=1
    if exist "node_modules" (
        echo [OK] node_modules directory exists
        set /a PASSED+=1
    ) else (
        echo [WARN] node_modules not installed (run: npm install)
        set /a WARNINGS+=1
    )
) else (
    echo [FAIL] package.json not found
    set /a FAILED+=1
)
echo.

REM 4. Check environment files
echo 4. Checking environment configuration...
if exist ".env" (
    echo [OK] .env file exists
    set /a PASSED+=1
) else (
    echo [WARN] .env file not found (needed for local development)
    set /a WARNINGS+=1
)

if exist ".env.example" (
    echo [OK] .env.example file exists
    set /a PASSED+=1
) else (
    echo [FAIL] .env.example file not found
    set /a FAILED+=1
)

if exist ".env.production" (
    echo [OK] .env.production file exists
    set /a PASSED+=1
) else (
    echo [WARN] .env.production file not found (template for production)
    set /a WARNINGS+=1
)
echo.

REM 5. Check .gitignore
echo 5. Checking .gitignore...
if exist ".gitignore" (
    findstr /M "\.env" .gitignore >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo [OK] .env is in .gitignore
        set /a PASSED+=1
    ) else (
        echo [FAIL] .env is NOT in .gitignore (security risk!)
        set /a FAILED+=1
    )
) else (
    echo [FAIL] .gitignore not found
    set /a FAILED+=1
)
echo.

REM 6. Check source files
echo 6. Checking source files...
if exist "src\main.ts" (
    echo [OK] src\main.ts exists
    set /a PASSED+=1
) else (
    echo [FAIL] src\main.ts not found
    set /a FAILED+=1
)

if exist "src\app.module.ts" (
    echo [OK] src\app.module.ts exists
    set /a PASSED+=1
) else (
    echo [FAIL] src\app.module.ts not found
    set /a FAILED+=1
)

if exist "src\infrastructure\database\data-source.ts" (
    echo [OK] Database data-source configured
    set /a PASSED+=1
) else (
    echo [FAIL] Database data-source not found
    set /a FAILED+=1
)
echo.

REM 7. Check build configuration
echo 7. Checking build configuration...
if exist "tsconfig.json" (
    echo [OK] tsconfig.json exists
    set /a PASSED+=1
) else (
    echo [FAIL] tsconfig.json not found
    set /a FAILED+=1
)

if exist "nest-cli.json" (
    echo [OK] nest-cli.json exists
    set /a PASSED+=1
) else (
    echo [FAIL] nest-cli.json not found
    set /a FAILED+=1
)
echo.

REM 8. Check Render configuration
echo 8. Checking Render configuration...
if exist "Procfile" (
    echo [OK] Procfile exists
    set /a PASSED+=1
) else (
    echo [WARN] Procfile not found (optional for Render)
    set /a WARNINGS+=1
)

if exist "render.yaml" (
    echo [OK] render.yaml exists
    set /a PASSED+=1
) else (
    echo [WARN] render.yaml not found (optional, for IaC)
    set /a WARNINGS+=1
)
echo.

REM 9. Check documentation
echo 9. Checking documentation...
if exist "PRODUCTION_DEPLOYMENT.md" (
    echo [OK] PRODUCTION_DEPLOYMENT.md exists
    set /a PASSED+=1
) else (
    echo [FAIL] PRODUCTION_DEPLOYMENT.md not found
    set /a FAILED+=1
)

if exist "RENDER_DEPLOYMENT.md" (
    echo [OK] RENDER_DEPLOYMENT.md exists
    set /a PASSED+=1
) else (
    echo [FAIL] RENDER_DEPLOYMENT.md not found
    set /a FAILED+=1
)

if exist "PRODUCTION_CHECKLIST.md" (
    echo [OK] PRODUCTION_CHECKLIST.md exists
    set /a PASSED+=1
) else (
    echo [FAIL] PRODUCTION_CHECKLIST.md not found
    set /a FAILED+=1
)
echo.

REM 10. Check Git
echo 10. Checking Git...
where git >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Git installed
    set /a PASSED+=1
    if exist ".git" (
        echo [OK] Git repository initialized
        set /a PASSED+=1
    ) else (
        echo [FAIL] Not a Git repository
        set /a FAILED+=1
    )
) else (
    echo [FAIL] Git not installed
    set /a FAILED+=1
)
echo.

REM Summary
echo ================================================
echo Summary
echo ================================================
echo Passed: !PASSED!
echo Warnings: !WARNINGS!
echo Failed: !FAILED!
echo.

if !FAILED! equ 0 (
    if !WARNINGS! equ 0 (
        echo [SUCCESS] All checks passed! Ready for deployment.
        exit /b 0
    ) else (
        echo [WARNING] Checks passed with warnings. Review above.
        exit /b 0
    )
) else (
    echo [ERROR] Some checks failed. Please fix the issues above.
    exit /b 1
)
