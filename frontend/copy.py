import shutil
import sys

try:
    src1 = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\services\04_3d_mass\src\store\projectStore.ts"
    dst1 = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\frontend\src\store\projectStore.ts"
    shutil.copy2(src1, dst1)

    src2 = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\services\04_3d_mass\src\services\geminiSpaceService.ts"
    dst2 = r"c:\Users\cho\Desktop\Temp\05 Code\260226_haema_arch\frontend\src\services\geminiSpaceService.ts"
    shutil.copy2(src2, dst2)
    print("SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
