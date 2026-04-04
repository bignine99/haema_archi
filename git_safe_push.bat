@echo off
chcp 65001 > nul
echo ============================================
echo  HAEMA ARCH - 안전 Git 커밋 스크립트
echo ============================================
echo.

cd /d "c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch"

echo [1/6] 현재 브랜치 확인...
git branch --show-current
echo.

echo [2/6] 변경된 파일 목록 확인...
git status --short
echo.

echo [3/6] 보안 검사 - .env 파일 스테이징 여부 확인...
git status --short | findstr /i ".env"
if errorlevel 1 (
    echo [OK] .env 파일이 스테이징 대상에 없습니다.
) else (
    echo [경고] .env 파일이 감지되었습니다! 확인이 필요합니다.
)
echo.

echo [4/6] 안전한 파일 모두 스테이징...
git add .
echo 스테이징 완료
echo.

echo [5/6] 스테이징된 파일 최종 확인 (.env 파일 없는지 검증)...
git diff --cached --name-only | findstr /i ".env"
if errorlevel 1 (
    echo [OK] 스테이징된 파일 중 .env 없음. 안전합니다.
) else (
    echo [경고] .env 파일이 스테이징되었습니다! 커밋 중단.
    echo git reset HEAD 를 실행하여 스테이징을 초기화하세요.
    pause
    exit /b 1
)
echo.

echo [6/6] 커밋 실행...
git commit -m "feat: A-series 엔지니어링 패널 스킬 프레임워크 표준화 완료

- A-5 디자인 컨셉 제너레이터: Vibe 01~10 전체 구현 (2열x5행 그리드)
- A-5 신규 Vibe: 문화예술형, 자연치유형, 안전보호형, 교육혁신형, 지역융합형 추가
- A-1~A-5 패널 전체 12-Column Cyber-Dashboard 표준 준수 검증 완료
- Engineering Seal, PARSER ACTIVE, LAW INTELLIGENCE 뱃지 통일 적용
- SpecsAnalysisPanel: undergroundFloors 타입 안전 처리

Reviewed: A-1(Specs), A-2(Site), A-3(Regulation), A-4(Project), A-5(DesignConcept)"
echo.

echo [완료] 커밋이 완료되었습니다.
echo.
echo 이제 GitHub에 Push하겠습니까? (Y/N)
set /p choice=선택:
if /i "%choice%"=="Y" (
    echo Push 중...
    git push origin HEAD
    echo Push 완료!
) else (
    echo Push를 건너뜁니다.
)
echo.
pause
