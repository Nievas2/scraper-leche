const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  try {
    const { data } = await axios.get('https://www.todolecheria.com.ar/mercados/');
    const $ = cheerio.load(data);
    const precios = [];

    // Buscamos las filas de la tabla (ajustá el selector inspeccionando la web)
    $('.entry-content table tr').each((_, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 2) {
        precios.push({
          producto: $(cols[0]).text().trim(),
          valor: $(cols[1]).text().trim(),
          fecha: new Date().toISOString().split('T')[0]
        });
      }
    });

    fs.writeFileSync('data/precios.json', JSON.stringify(precios, null, 2));
    console.log('¡Datos actualizados!');
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

scrape();