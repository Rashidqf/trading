@echo off
SET "PS_COMMAND=powershell -NoProfile -ExecutionPolicy Bypass -Command"
%PS_COMMAND% "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"

choco install python310 --version 3.10.11 -y
choco install nodejs-lts --version 18.17.0 -y
choco install git -y
choco install yarn -y


REM Get the current directory and store it in a variable
set "current_directory=%~dp0%"

REM Add a custom path to the current directory
set "requirements_path=copy-trade-bot\requirements.txt"
set "frontend=copy-trade-frontend"
set "api=copy-trade-api"

cd /d "%current_directory%"
set "requirements_file_path=%current_directory%\%requirements_path%"
set "frontend_path=%current_directory%\%frontend%"
set "api_path=%current_directory%\%api%"

REM replacing the backslash path
set "requirements_file_path=%requirements_file_path:\\=\%"
set "frontend_path=%frontend_path:\\=\%"
set "api_path=%api_path:\\=\%"



REM Display the combined path
echo Combined Path: %requirements_file_path%

pip install -r %requirements_file_path%

REM going to backend dir
cd /d "%api_path%"
echo Combined Path: %api_path%


call yarn install

REM going to fronend dir
cd /d "%frontend_path%"
echo Combined Path: %frontend_path%

REM installing backend depencdencies
call yarn install

pause