import fs from 'fs';

// Read the file
let content = fs.readFileSync('src/data/schools.ts', 'utf8');

// Define the replacement for ENSA schools
const ensaBacTypes = `["Sciences Mathématiques A", "Sciences Mathématiques B", "Sciences Physiques", "Sciences de la Vie et de la Terre", "Bac Technique", "Bac Professionnel"]`;

const ensaSeuilEntree = `{
        "Sciences Mathématiques A": 12.00,
        "Sciences Mathématiques B": 12.00,
        "Sciences Physiques": 14.00,
        "Sciences de la Vie et de la Terre": 15.00,
        "Bac Technique": 15.00,
        "Bac Professionnel": 15.00
      }`;

// For all ENSA schools (except the first one we already updated), replace the bacTypes and seuilEntree
const ensaSchools = [
  'ENSA Al Hoceima',
  'ENSA Béni Mellal', 
  'ENSA Berrechid',
  'ENSA El Jadida',
  'ENSA Fès',
  'ENSA Kénitra',
  'ENSA Khouribga',
  'ENSA Marrakech',
  'ENSA Oujda',
  'ENSA Safi',
  'ENSA Tanger',
  'ENSA Tétouan'
];

ensaSchools.forEach(schoolName => {
  // Find the school and replace its bacTypes and seuilEntree
  const schoolRegex = new RegExp(`(name: "${schoolName}",[\\s\\S]*?bacTypes: )\\[[^\\]]*\\](,\\s*seuilEntree: )[^,]*,`, 'g');
  content = content.replace(schoolRegex, `$1${ensaBacTypes}$2${ensaSeuilEntree},`);
});

// Write the updated content back
fs.writeFileSync('src/data/schools.ts', content);
console.log('Updated all ENSA schools with specific seuil requirements');
