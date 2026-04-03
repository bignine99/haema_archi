const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'src', 'store', 'projectStore.ts');
const typesPath = path.join(__dirname, 'src', 'store', 'types.ts');

const content = fs.readFileSync(storePath, 'utf8');
const lines = content.split('\n');

// Find the boundaries
const typesStart = 11; // line 12 (0-indexed 11) is `// ─── 건축 용도 타입 ───`
const typesEnd = 466; // line 466 is `}` of ProjectState

const typesContent = lines.slice(typesStart, typesEnd).join('\n');
const imports = lines.slice(2, 11).join('\n'); // getting internal imports

const newTypesFile = `
${imports}

${typesContent}
`;

fs.writeFileSync(typesPath, newTypesFile, 'utf8');

// The new projectStore.ts without the types
const newStoreContent = [
  ...lines.slice(0, 11), // imports
  `import { ProjectState, DocumentInfo, BarrierFreeChecklist, FloorZoning, Room, BuildingUse, KakaoAddressResult, ParcelData, MOCK_PARCELS, TypologyType, MassingWing, MassingResult, SiteContext } from './types';`,
  `import { ZONE_REGULATIONS } from '@/services/regulationEngine';`, // ensure ZONE_REGULATIONS is imported
  ...lines.slice(typesEnd)
].join('\n');

fs.writeFileSync(storePath, newStoreContent, 'utf8');
console.log('Types extracted successfully');
