import os

store_path = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\frontend\src\store\projectStore.ts"
types_path = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\frontend\src\store\types.ts"

with open(store_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

types_start = 11  # line 12 is index 11
types_end = 466   # line 467 is index 466

types_content = "".join(lines[types_start:types_end])
imports = "".join(lines[2:11])

new_types_file = imports + "\n" + types_content

with open(types_path, 'w', encoding='utf-8') as f:
    f.write(new_types_file)

new_store_lines = lines[:11]
new_store_lines.append("import { ProjectState, DocumentInfo, BarrierFreeChecklist, FloorZoning, Room, BuildingUse, KakaoAddressResult, ParcelData, MOCK_PARCELS, TypologyType, MassingWing, MassingResult, SiteContext } from './types';\n")
new_store_lines.append("import { ZONE_REGULATIONS } from '@/services/regulationEngine';\n")
new_store_lines.extend(lines[types_end:])

with open(store_path, 'w', encoding='utf-8') as f:
    f.writelines(new_store_lines)

print("Python split successful!")
