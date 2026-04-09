@echo off
echo Starting auto_push > push_log.txt
git add .
echo Checking env files in index >> push_log.txt
git diff --cached --name-only | findstr /i ".env" >> push_log.txt
if errorlevel 1 (
    echo .env file NOT staged. Safe to commit! >> push_log.txt
    git commit -m "feat: Standardization and UI/UX improvements for Phase C Engineering panels (C-6 to C-9) and Area logic fixes" >> push_log.txt
    git push origin main >> push_log.txt
    echo Push complete >> push_log.txt
) else (
    echo WARNING: .env file is staged! Aborting push. >> push_log.txt
    git reset HEAD
)
