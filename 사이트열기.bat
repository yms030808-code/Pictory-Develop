@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [안내] Node.js가 없습니다. https://nodejs.org 에서 설치한 뒤 다시 실행하세요.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo 패키지 설치 중... 잠시만요.
  call npm install
  if errorlevel 1 (
    echo npm install 실패
    pause
    exit /b 1
  )
)

REM 이 폴더를 작업 디렉터리로 서버 실행(최소화 창)
start "PictoryServer" /MIN /D "%~dp0" node server.js
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:3000/"

echo.
echo 브라우저에서 사이트를 열었습니다.
echo 서버를 끄려면 작업 표시줄의 "PictoryServer" 창을 닫으세요.
echo.
pause
