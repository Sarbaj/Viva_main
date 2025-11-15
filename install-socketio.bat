@echo off
echo 🚀 Installing Socket.IO for Viva Portal...

REM Check if we're in the right directory
if not exist "BACKEND" (
    echo ❌ BACKEND directory not found. Please run this script from the Viva_main directory
    pause
    exit /b 1
)

if not exist "viva-app" (
    echo ❌ viva-app directory not found. Please run this script from the Viva_main directory
    pause
    exit /b 1
)

echo ✅ Installing Socket.IO dependencies...

REM Install backend dependencies
echo 📦 Installing backend Socket.IO...
cd BACKEND
call npm install socket.io
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend Socket.IO
    pause
    exit /b 1
)
echo ✅ Backend Socket.IO installed successfully

REM Install frontend dependencies
echo 📦 Installing frontend Socket.IO client...
cd ..\viva-app
call npm install socket.io-client
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend Socket.IO client
    pause
    exit /b 1
)
echo ✅ Frontend Socket.IO client installed successfully

cd ..

echo.
echo ✅ Socket.IO installation completed!
echo.
echo 🔄 Real-time features now available:
echo    • Live viva status updates
echo    • Real-time student monitoring
echo    • Instant notifications
echo    • Live progress tracking
echo.
echo 📚 Next steps:
echo    1. Start the backend: cd BACKEND ^&^& npm run dev
echo    2. Start the frontend: cd viva-app ^&^& npm run dev
echo    3. Check the Socket.IO integration guide for usage details
echo.
echo ✅ Happy coding! 🎉
pause