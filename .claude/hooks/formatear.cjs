const fs = require('fs');
const path = require('path');

const EXTENSIONES = new Set(['.ts', '.tsx', '.js', '.json', '.css']);

function leerStdin() {
  return new Promise((resolve, reject) => {
    let datos = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      datos += chunk;
    });
    process.stdin.on('end', () => resolve(datos));
    process.stdin.on('error', reject);
  });
}

async function main() {
  try {
    const bruto = await leerStdin();
    if (!bruto.trim()) {
      process.exit(0);
    }

    const evento = JSON.parse(bruto);
    const filePath = evento?.tool_input?.file_path;
    if (!filePath || typeof filePath !== 'string') {
      process.exit(0);
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!EXTENSIONES.has(extension)) {
      process.exit(0);
    }

    if (!fs.existsSync(filePath)) {
      process.exit(0);
    }

    const prettier = require('prettier');
    const fuente = fs.readFileSync(filePath, 'utf8');
    const config = (await prettier.resolveConfig(filePath)) || {};
    const formateado = await prettier.format(fuente, {
      ...config,
      filepath: filePath,
    });

    if (formateado !== fuente) {
      fs.writeFileSync(filePath, formateado, 'utf8');
    }
  } catch {
    // Si algo falla, termina sin bloquear.
  }

  process.exit(0);
}

main();
