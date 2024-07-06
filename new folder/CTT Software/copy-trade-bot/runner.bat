@echo off

REM Get the current directory and store it in a variable
set "current_directory=%~dp0%"

REM Add a custom path to the current directory
set "bot=copy-trade-bot"
set "frontend=copy-trade-frontend"
set "api=copy-trade-api"

cd /d "%current_directory%"
set "bot_path=%current_directory%\%bot%"
set "frontend_path=%current_directory%\%frontend%"
set "api_path=%current_directory%\%api%"


REM replacing the backslash path
set "bot_path=%bot_path:\\=\%"
set "frontend_path=%frontend_path:\\=\%"
set "api_path=%api_path:\\=\%"




cd /d "%frontend_path%"
start yarn start


cd /d "%api_path%"
start yarn dev

cd /d "%bot_path%"
start uvicorn server:app

