const fs = require('fs');

try {
  let content1 = fs.readFileSync('C:\\Users\\cho\\.gemini\\antigravity\\brain\\bbfa6f84-5baf-4623-baa8-1ebb56ce59b4\\.system_generated\\steps\\343\\output.txt', 'utf-8');
  fs.writeFileSync('C:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\src\\store\\projectStore.ts', content1);
  
  let content2 = fs.readFileSync('C:\\Users\\cho\\.gemini\\antigravity\\brain\\bbfa6f84-5baf-4623-baa8-1ebb56ce59b4\\.system_generated\\steps\\344\\output.txt', 'utf-8');
  fs.writeFileSync('C:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\src\\services\\geminiSpaceService.ts', content2);
  
  fs.writeFileSync('C:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\do_copy_log.txt', 'Copy complete');
} catch (e) {
  fs.writeFileSync('C:\\Users\\cho\\Desktop\\Temp\\05 Code\\260226_haema_arch\\frontend\\do_copy_log.txt', 'Error during copy: ' + e.message + '\n' + e.stack);
}
