const fs = require('fs');
try {
  fs.copyFileSync(
    'c:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\services\\04_3d_mass\\src\\store\\projectStore.ts',
    'c:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\src\\store\\projectStore.ts'
  );
  fs.copyFileSync(
    'c:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\services\\04_3d_mass\\src\\services\\geminiSpaceService.ts',
    'c:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\src\\services\\geminiSpaceService.ts'
  );
  console.log('Copy successful');
} catch (e) {
  console.error('Copy failed:', e);
}
