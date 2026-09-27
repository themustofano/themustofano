// The optional SHARP_MODULE path lets the bundled Codex runtime run this without a project dependency.
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
async function run() {
  const report = [];
  // Exact crop from avatar node 4941:164: width 105%, height 145.33%, top -12.67%.
  await sharp(path.join(root,'design/figma/source-assets/intro-b0f2d.png')).resize(126,174,{fit:'fill'}).extract({left:0,top:15,width:120,height:120}).webp({lossless:true}).toFile(path.join(root,'public/assets/avatar.webp'));
  for (const [name,file] of Object.entries({selena:'9f69b',maria:'58f83',pierre:'fb09c',noah:'04309',parker:'0994a',john:'c1fe8'})) {
    await sharp(path.join(root,`design/figma/source-assets/voice-${file}.png`)).resize({width:160,withoutEnlargement:true}).webp({quality:96,effort:6}).toFile(path.join(root,`public/assets/participant-${name}.webp`));
  }
  for (const file of ['avatar.webp', ...['selena','maria','pierre','noah','parker','john'].map(name => `participant-${name}.webp`)]) {
    const image = path.join(root, 'public/assets', file);
    report.push({ file, bytes: (await fs.stat(image)).size });
  }
  await fs.writeFile(path.join(root,'design/figma/optimized-photos.json'),JSON.stringify(report,null,2)+'\n');
  console.log(report);
}
run().catch(error => { console.error(error); process.exitCode=1; });
