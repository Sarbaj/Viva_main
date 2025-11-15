#!/bin/bash

# Socket.IO Installation Script for Viva Portal
echo "🚀 Installing Socket.IO for Viva Portal..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "BACKEND" ] || [ ! -d "viva-app" ]; then
    print_error "Please run this script from the Viva_main directory"
    exit 1
fi

print_status "Installing Socket.IO dependencies..."

# Install backend dependencies
echo "📦 Installing backend Socket.IO..."
cd BACKEND
if npm install socket.io; then
    print_status "Backend Socket.IO installed successfully"
else
    print_error "Failed to install backend Socket.IO"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend Socket.IO client..."
cd ../viva-app
if npm install socket.io-client; then
    print_status "Frontend Socket.IO client installed successfully"
else
    print_error "Failed to install frontend Socket.IO client"
    exit 1
fi

cd ..

print_status "Socket.IO installation completed!"
echo ""
echo "🔄 Real-time features now available:"
echo "   • Live viva status updates"
echo "   • Real-time student monitoring"
echo "   • Instant notifications"
echo "   • Live progress tracking"
echo ""
echo "📚 Next steps:"
echo "   1. Start the backend: cd BACKEND && npm run dev"
echo "   2. Start the frontend: cd viva-app && npm run dev"
echo "   3. Check the Socket.IO integration guide for usage details"
echo ""
print_status "Happy coding! 🎉"