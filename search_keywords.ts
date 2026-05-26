import fs from 'fs';

function findKeywordsInDrive() {
  if (!fs.existsSync('drive.html')) {
    console.log("No drive.html found");
    return;
  }
  const html = fs.readFileSync('drive.html', 'utf-8');
  console.log(`Searching drive.html (size: ${html.length} bytes)...`);

  const keywords = ['arso', 'logo', 'banner', 'bg', 'kente', 'medallion', 'assembly', 'assemblies', 'uganda'];
  
  keywords.forEach(kw => {
    let lastIndex = -1;
    let count = 0;
    while (true) {
      lastIndex = html.toLowerCase().indexOf(kw, lastIndex + 1);
      if (lastIndex === -1) break;
      count++;
      if (count <= 10) {
        console.log(`\nKeyword: "${kw}" found at index ${lastIndex}:`);
        console.log(html.substring(Math.max(0, lastIndex - 100), Math.min(html.length, lastIndex + 150)));
      }
    }
    console.log(`\nTotal occurrences for "${kw}": ${count}`);
  });
}

findKeywordsInDrive();
