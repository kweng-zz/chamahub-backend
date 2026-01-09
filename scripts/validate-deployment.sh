#!/bin/bash

# ChamaHub Backend - Pre-Deployment Validation Script
# This script checks if your backend is ready for production deployment

echo "🔍 ChamaHub Backend - Pre-Deployment Validation"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 1. Check Node version
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not installed"
fi
echo ""

# 2. Check npm
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not installed"
fi
echo ""

# 3. Check dependencies
echo "3️⃣  Checking dependencies..."
if [ -f "package.json" ]; then
    check_pass "package.json exists"
    if [ -d "node_modules" ]; then
        check_pass "node_modules directory exists"
    else
        check_warn "node_modules not installed (run: npm install)"
    fi
else
    check_fail "package.json not found"
fi
echo ""

# 4. Check environment files
echo "4️⃣  Checking environment configuration..."
if [ -f ".env" ]; then
    check_pass ".env file exists"
else
    check_warn ".env file not found (needed for local development)"
fi

if [ -f ".env.example" ]; then
    check_pass ".env.example file exists"
else
    check_fail ".env.example file not found"
fi

if [ -f ".env.production" ]; then
    check_pass ".env.production file exists"
else
    check_warn ".env.production file not found (template for production)"
fi
echo ""

# 5. Check .gitignore
echo "5️⃣  Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore; then
        check_pass ".env is in .gitignore"
    else
        check_fail ".env is NOT in .gitignore (security risk!)"
    fi
else
    check_fail ".gitignore not found"
fi
echo ""

# 6. Check source files
echo "6️⃣  Checking source files..."
if [ -f "src/main.ts" ]; then
    check_pass "src/main.ts exists"
else
    check_fail "src/main.ts not found"
fi

if [ -f "src/app.module.ts" ]; then
    check_pass "src/app.module.ts exists"
else
    check_fail "src/app.module.ts not found"
fi

if [ -f "src/infrastructure/database/data-source.ts" ]; then
    check_pass "Database data-source configured"
else
    check_fail "Database data-source not found"
fi
echo ""

# 7. Check build configuration
echo "7️⃣  Checking build configuration..."
if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json exists"
else
    check_fail "tsconfig.json not found"
fi

if [ -f "nest-cli.json" ]; then
    check_pass "nest-cli.json exists"
else
    check_fail "nest-cli.json not found"
fi
echo ""

# 8. Check Render configuration
echo "8️⃣  Checking Render configuration..."
if [ -f "Procfile" ]; then
    check_pass "Procfile exists"
    PROCFILE_CONTENT=$(cat Procfile)
    if [[ $PROCFILE_CONTENT == *"npm run start:prod"* ]]; then
        check_pass "Procfile has correct start command"
    else
        check_warn "Procfile start command may need updating"
    fi
else
    check_warn "Procfile not found (optional for Render)"
fi

if [ -f "render.yaml" ]; then
    check_pass "render.yaml exists"
else
    check_warn "render.yaml not found (optional, for IaC)"
fi
echo ""

# 9. Check documentation
echo "9️⃣  Checking documentation..."
if [ -f "PRODUCTION_DEPLOYMENT.md" ]; then
    check_pass "PRODUCTION_DEPLOYMENT.md exists"
else
    check_fail "PRODUCTION_DEPLOYMENT.md not found"
fi

if [ -f "RENDER_DEPLOYMENT.md" ]; then
    check_pass "RENDER_DEPLOYMENT.md exists"
else
    check_fail "RENDER_DEPLOYMENT.md not found"
fi

if [ -f "PRODUCTION_CHECKLIST.md" ]; then
    check_pass "PRODUCTION_CHECKLIST.md exists"
else
    check_fail "PRODUCTION_CHECKLIST.md not found"
fi
echo ""

# 10. Check Git
echo "🔟 Checking Git..."
if command -v git &> /dev/null; then
    check_pass "Git installed"
    if [ -d ".git" ]; then
        check_pass "Git repository initialized"
        if git remote get-url origin &> /dev/null; then
            REMOTE=$(git remote get-url origin)
            check_pass "Git remote configured: $REMOTE"
        else
            check_fail "Git remote not configured"
        fi
    else
        check_fail "Not a Git repository"
    fi
else
    check_fail "Git not installed"
fi
echo ""

# 11. Check for console.log in production code
echo "1️⃣1️⃣  Checking for debug statements..."
if grep -r "console\.log" src/ --include="*.ts" | grep -v "\.spec\.ts" > /dev/null; then
    check_warn "Found console.log statements in source code"
else
    check_pass "No console.log statements found"
fi
echo ""

# 12. Check for hardcoded secrets
echo "1️⃣2️⃣  Checking for hardcoded secrets..."
if grep -r "sk_test\|pk_test\|password\|secret" src/ --include="*.ts" | grep -v "\.spec\.ts" | grep -v "config" > /dev/null; then
    check_warn "Possible hardcoded secrets found (review manually)"
else
    check_pass "No obvious hardcoded secrets found"
fi
echo ""

# Summary
echo "================================================"
echo "📊 Summary"
echo "================================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Checks passed with warnings. Review above.${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
