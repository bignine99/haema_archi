@echo off
chcp 65001 >nul
echo === Vercel Production Deploy ===
echo.
echo [INFO] Vercel 프로덕션 배포를 진행합니다. (네이버 클라우드 미사용)
npx vercel --prod --yes
echo.
echo === Deploy Complete ===
