// scripts/splitXmlStream.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const inputFile = process.argv[2];
const maxSize = 49 * 1024 * 1024; // limite ~50MB (ajuste se quiser)

if (!inputFile) {
  console.error('❌ Uso: node scripts/splitXmlStream.js caminho/arquivo.xml');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
const outputDir = path.join(process.cwd(), 'data', 'awin');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Cabeçalho fixo para cada parte
const header = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cafProductFeed SYSTEM "http://productdata.awin.com/DTD/affiliate/datafeed.1.5.dtd">
<cafProductFeed>
<datafeed id="53075" merchantId="17697" merchantName="Dafiti BR">
`;

// Rodapé fixo para cada parte
const footer = `</datafeed>
</cafProductFeed>`;

// Estado
let part = 1;
let currentSize = Buffer.byteLength(header + footer);
let currentContent = ''; // só produtos
let insideProd = false;
let prodBuffer = '';

const rl = readline.createInterface({
  input: fs.createReadStream(inputPath, { encoding: 'utf8' }),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // Ignora cabeçalho original e só pega os <prod>...</prod>
  if (line.includes('<prod')) {
    insideProd = true;
    prodBuffer = '';
  }

  if (insideProd) {
    prodBuffer += line + '\n';
  }

  if (line.includes('</prod>')) {
    insideProd = false;

    const prodSize = Buffer.byteLength(prodBuffer);

    // Se não couber, salva parte atual
    if (currentSize + prodSize > maxSize && currentContent !== '') {
      const outputPath = path.join(outputDir, `${path.basename(inputPath, '.xml')}${part}.xml`);
      fs.writeFileSync(outputPath, header + currentContent + footer, 'utf8');
      console.log(`✅ Criado: ${outputPath} (${(Buffer.byteLength(currentContent) / 1024 / 1024).toFixed(2)} MB)`);

      part++;
      currentContent = '';
      currentSize = Buffer.byteLength(header + footer);
    }

    currentContent += prodBuffer;
    currentSize += prodSize;
  }
});

rl.on('close', () => {
  if (currentContent !== '') {
    const outputPath = path.join(outputDir, `${path.basename(inputPath, '.xml')}${part}.xml`);
    fs.writeFileSync(outputPath, header + currentContent + footer, 'utf8');
    console.log(`✅ Criado: ${outputPath} (${(Buffer.byteLength(currentContent) / 1024 / 1024).toFixed(2)} MB)`);
  }
  console.log('🏁 Finalizado!');
});
