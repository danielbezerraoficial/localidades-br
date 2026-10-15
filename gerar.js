// Copia as respostas da API de localidades do IBGE para arquivos, sem mexer em nada:
// o arquivo guardado é exatamente o que o IBGE responde (mesmos campos, mesma ordem).
// Uso: node gerar.js [pasta-de-saida]   (padrão: a pasta deste arquivo)
//
// Em out/2026 o servidor do IBGE passou a mandar o certificado sem o intermediário da Sectigo.
// Enquanto for assim, o intermediário (sectigo-dv-r36.pem, ao lado deste arquivo) entra à mão.
const https = require('https');
const tls = require('tls');
const fs = require('fs');
const path = require('path');

const out = path.resolve(process.argv[2] || __dirname);
const extra = path.join(__dirname, 'sectigo-dv-r36.pem');
const ca = fs.existsSync(extra) ? [...tls.rootCertificates, fs.readFileSync(extra, 'utf8')] : undefined;
const BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades';

function get(rota) {
  return new Promise((resolve, reject) => {
    https.get(BASE + rota, { ca, timeout: 60000 }, (r) => {
      if (r.statusCode !== 200) return reject(new Error(`${rota} -> HTTP ${r.statusCode}`));
      let corpo = '';
      r.setEncoding('utf8');
      r.on('data', (c) => (corpo += c));
      r.on('end', () => {
        try { resolve({ corpo, dados: JSON.parse(corpo) }); } catch (e) { reject(new Error(`${rota} -> JSON inválido`)); }
      });
    }).on('error', reject);
  });
}

function salvar(arquivo, corpo) {
  const destino = path.join(out, arquivo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, corpo);
}

(async () => {
  const regioes = await get('/regioes');
  salvar('regioes.json', regioes.corpo);

  const estados = await get('/estados');
  salvar('estados.json', estados.corpo);

  let somados = 0;
  for (const e of estados.dados) {
    const um = await get(`/estados/${e.id}`);
    const cidades = await get(`/estados/${e.id}/municipios`);
    for (const chave of [e.id, e.sigla]) {
      salvar(`estados/${chave}.json`, um.corpo);
      salvar(`estados/${chave}/municipios.json`, cidades.corpo);
    }
    somados += cidades.dados.length;
    process.stdout.write(`${e.sigla}=${cidades.dados.length} `);
  }

  const todos = await get('/municipios');
  salvar('municipios.json', todos.corpo);
  console.log(`\nregiões: ${regioes.dados.length} | estados: ${estados.dados.length} | cidades somadas: ${somados} | todas: ${todos.dados.length}`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
