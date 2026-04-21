#!/bin/bash

# 🛑 Stop running Music Store processes

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🛑 Stopping server and client...${NC}"
echo ""

# Kill process on port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PIDS=$(lsof -Pi :5000 -sTCP:LISTEN -t)
    echo -e "${GREEN}Stopping process on port 5000...${NC}"
    kill $PIDS 2>/dev/null || true
fi

# Kill process on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PIDS=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    echo -e "${GREEN}Stopping process on port 3000...${NC}"
    kill $PIDS 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}✅ All processes stopped!${NC}"
echo ""
