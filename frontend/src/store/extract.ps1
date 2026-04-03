$content = Get-Content "projectStore.ts" -Raw
$lines = $content -split "`n"
$imports = $lines[0..10] -join "`n"
$types = $lines[11..465] -join "`n"
$imports + "`n" + $types | Set-Content "types.ts" -Encoding UTF8

$remaining = $lines[0..10] + "import { ProjectState, DocumentInfo, BarrierFreeChecklist, FloorZoning, Room, BuildingUse, KakaoAddressResult, ParcelData, MOCK_PARCELS, TypologyType, MassingWing, MassingResult, SiteContext } from './types';" + "import { ZONE_REGULATIONS } from '@/services/regulationEngine';" + $lines[466..($lines.Length-1)]
$remaining -join "`n" | Set-Content "projectStore.ts" -Encoding UTF8
Write-Host "Success"
