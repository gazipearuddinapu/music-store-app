#!/bin/bash

# 🚀 Music Store Application - Automated Setup Script
# This script sets up and starts the complete project

set -e  # Stop on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🎵 Music Store Application Setup 🎵   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed!${NC}"
    echo "Download: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is required but not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm $NPM_VERSION found${NC}"

# Step 2: Install server dependencies
echo ""
echo -e "${YELLOW}[2/5] Installing server dependencies...${NC}"
cd server
npm install
echo -e "${GREEN}✅ Server dependencies installed${NC}"
cd ..

# Step 3: Install client dependencies
echo ""
echo -e "${YELLOW}[3/5] Installing client dependencies...${NC}"
cd client
npm install
echo -e "${GREEN}✅ Client dependencies installed${NC}"
cd ..

# Step 4: Verify setup
echo ""
echo -e "${YELLOW}[4/5] Verifying setup...${NC}"
if [ -f "server/server.js" ] && [ -f "client/src/App.js" ]; then
    echo -e "${GREEN}✅ Project structure looks correct${NC}"
else
    echo -e "${RED}❌ Some required files are missing!${NC}"
    exit 1
fi

# Step 5: Start the application
echo ""
echo -e "${YELLOW}[5/5] Starting the application...${NC}"
echo ""

./start.sh
