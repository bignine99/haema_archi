$root = 'c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch'

$toDelete = @(
    '{',
    "console.error('Error",
    'f.properties)',
    'r.status).then(console.log).catch(console.error)',
    'copy.bat',
    'copy.js',
    'copy2.bat',
    'copyFiles.js',
    'do_copy.js',
    'do_copy.ps1',
    'frontend_store_patch.js',
    'migrate_3d_mass.js',
    'migrate_3d_mass.py',
    'build_msa_skeleton.py',
    'deploy_phase1c.js',
    'search.js',
    'search.py',
    'trim_file.js',
    'test.js',
    'test_apis.js',
    'test_building_api.js',
    'test_kakao.js',
    'test_vworld.js',
    'test_vworld_2.js',
    'out.txt',
    'imsi.md',
    'copy_gisApi.py'
)

foreach ($f in $toDelete) {
    $full = Join-Path $root $f
    if (Test-Path -LiteralPath $full) {
        Remove-Item -LiteralPath $full -Force
        Write-Host "DELETED: $f"
    } else {
        Write-Host "NOT FOUND: $f"
    }
}

Write-Host "`nDone!"
