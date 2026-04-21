#!/bin/bash

# 🚀 Music Store Application - Quick Start Script
# Starts both the server and the client

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🎵 Music Store - Starting...          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check that server and client directories exist
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo -e "${YELLOW}❌ Error: Could not find 'server' and 'client' folders${NC}"
    exit 1
fi

# Install Node.js modules if needed
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

echo -e "${GREEN}✅ All ready!${NC}"
echo ""

# Port check helper
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use.${NC}"
    echo -e "${YELLOW}Continuing anyway...${NC}"
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use.${NC}"
    echo -e "${YELLOW}Will try a different port...${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Starting server... (port 5000)${NC}"
echo -e "${BLUE}🚀 Starting client... (port 3000)${NC}"
echo ""

# Start the server in the background
cd server
npm start > ../server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✅ Server PID: $SERVER_PID${NC}"
cd ..

sleep 2

# Start the client in the background
cd client
REACT_APP_API_URL=http://localhost:5000 npm start > ../client.log 2>&1 &
CLIENT_PID=$!
echo -e "${GREEN}✅ Client PID: $CLIENT_PID${NC}"
cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    ✅ Everything is running!           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}📍 Application is running at:${NC}"
echo -e "  🌐 Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "  🔌 Backend:  ${BLUE}http://localhost:5000${NC}"
echo ""

echo -e "${YELLOW}Log files:${NC}"
echo "  Server log: server.log"
echo "  Client log: client.log"
echo ""

echo -e "${YELLOW}To stop all processes:${NC}"
echo "  ${BLUE}./stop.sh${NC}"
echo ""

# Try to open browser
sleep 3
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null || true
elif command -v open &> /dev/null; then
    open http://localhost:3000 2>/dev/null || true
fi

echo -e "${YELLOW}Running... (Press Ctrl+C to stop)${NC}"
echo ""

trap 'kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit 0' SIGINT SIGTERM

wait
