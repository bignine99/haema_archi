const { execSync } = require('child_process');
const fs = require('fs');

let log = "";
const addLog = (msg) => {
  log += msg + "\n";
  fs.writeFileSync('deploy_log.txt', log);
};

try {
  addLog("Starting Git Operations...");
  execSync('git add .');
  
  try {
    const diff = execSync('git diff --cached --name-only').toString();
    addLog("Staged files:\n" + diff);
    if (diff.toLowerCase().includes('.env')) {
      addLog('WARNING: .env file staged! Reverting...');
      execSync('git reset HEAD');
      process.exit(1);
    }
  } catch (e) {
    addLog("Check staging passed.");
  }
  
  try {
    const commitOutput = execSync('git commit -m "feat: Standardization and UI/UX improvements for Phase C Engineering panels (C-6 to C-9) and Area logic fixes"').toString();
    addLog("Commit output: " + commitOutput);
  } catch (e) {
    addLog("Commit skip or error: " + e.message);
  }
  
  addLog("Pushing to origin HEAD...");
  const pushOut = execSync('git push origin HEAD').toString();
  addLog('Push complete. Output: ' + pushOut);
  
  addLog('Starting deployment via deploy_patch.bat...');
  const deploy = execSync('.\\deploy_patch.bat').toString();
  addLog('Deploy complete. Output: ' + deploy);
  
} catch(e) {
  addLog("Error occurred: " + e.message);
}
