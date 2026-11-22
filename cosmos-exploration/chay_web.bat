@echo off
chcp 65001 >nul
title Tự Động Mở 20 Profile Chrome - Cosmic Explorer
echo ============================================================
echo   ĐANG TỰ ĐỘNG MỞ 20 PROFILE CHROME ĐỂ TĂNG LƯỢNG TRUY CẬP
echo ============================================================
echo.

set "URL=https://cosmic-explorer-vn.vercel.app/"

:: Tim duong dan trinh duyet Chrome
set "CHROME_BIN=chrome"
where chrome >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe"
    ) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    ) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    )
)

echo [1/20] Đang mở User Chính (Chrome của bạn - Default)...
start "" "%CHROME_BIN%" --profile-directory="Default" "%URL%"
timeout /t 1 /nobreak >nul

for /L %%i in (1,1,19) do (
    echo [%%i+1/20] Đang mở User %%i (Profile %%i)...
    start "" "%CHROME_BIN%" --profile-directory="Profile %%i" "%URL%"
    timeout /t 1 /nobreak >nul
)

echo.
echo ============================================================
echo   ✓ ĐÃ MỞ THÀNH CÔNG TẤT CẢ 20 PROFILES!
echo.
echo   Mẹo: Bạn cứ để các cửa sổ mở khoảng 45 - 60 giây.
echo   Sau đó chuột phải vào biểu tượng Chrome dưới thanh Taskbar
echo   và chọn "Close all windows" (Đóng tất cả cửa sổ).
echo ============================================================
echo.
pause
