import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import { decode } from 'html-entities';

process.env.COUNTER = 1;

function gerarSlug(texto, id) {
	
 if (!texto || typeof texto !== 'string') texto = 'produto';

  let slug = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "")   // remove caracteres especiais
    .replace(/\s+/g, "-")           // troca espaços por "-"
    .replace(/-+/g, "-")            // remove hífens duplicados
    .replace(/^-|-$/g, "");         // remove hífen no início/fim

  // 🔹 Limita o slug a 100 caracteres (ajuste se quiser)
  if (slug.length > 200) {
    slug = slug.substring(0, 200)
  }

  // 🔹 Adiciona o ID no final para unicidade
 /* if (id) {
    slug = `${slug}-${id}`;
  }
*/
  return slug;
}

const pastaXML = path.join(process.cwd(), 'data', 'awin');
const pastaSaida = path.join(process.cwd(), 'public', 'data');
const pastaSaida2 = path.join(process.cwd(), 'data', 'awin');

if (!fs.existsSync(pastaSaida)) {
  fs.mkdirSync(pastaSaida, { recursive: true });
}
if (!fs.existsSync(pastaSaida2)) {
  fs.mkdirSync(pastaSaida2, { recursive: true });
}

async function converterTodosXMLs() {
  const arquivos = fs.readdirSync(pastaXML).filter(file => file.endsWith('.xml'));

  if (arquivos.length === 0) {
    console.warn('Nenhum arquivo .xml encontrado em data/awin');
    return;
  }

  const slugIndex = {}; // Aqui armazenamos os slugs gerados
  const slugsGlobais = new Set(); // Todos slugs já usados (global, todos jsons/lotes)

  for (const arquivo of arquivos) {
    const caminhoXML = path.join(pastaXML, arquivo);
    const nomeBase = path.basename(arquivo, '.xml');

    const caminhoJSON = path.join(pastaSaida, `${nomeBase}.json`);
    const caminhoJSON2 = path.join(pastaSaida2, `${nomeBase}.json`);

    console.log(`🔄 Convertendo ${arquivo} → ${nomeBase}.jsonl`);

    try {
      const xml = fs.readFileSync(caminhoXML, 'utf-8');
      const json = await parseStringPromise(xml, { explicitArray: false });

      let produtos = [];
      if (nomeBase == 'GALVIC') {
        produtos = json.rss?.channel?.item || [];
      } else if (nomeBase == 'CUPOM') {
            //ler cupons lomadee
        produtos = json.coupons?.coupon || [];
      } else if (nomeBase == 'PROMO') {
		   //ler cupons rakuten
        produtos = json.couponfeed?.link || [];
      } else {
		  // Garante que datafeed seja sempre um array
        const datafeeds = Array.isArray(json.cafProductFeed?.datafeed)
          ? json.cafProductFeed.datafeed
			  : [json.cafProductFeed?.datafeed].filter(Boolean); // Remove undefined/null se não existir

			// Agora junta os produtos de todos os datafeeds

        produtos = datafeeds.flatMap((df) => df?.prod || []);
      }

      const arr = Array.isArray(produtos) ? produtos : [produtos];

      // MODIFICADO: Garante unicidade de slug e IGNORA duplicados
      const produtosComSlugUnicos = [];
      for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];

        const nome = decode(
          p['g:title'] || p['text']?.['name'] || p['title'] || (p['advertisername'] + ' use este cupom ')
        );

        if (p['g:title']) p['g:title'] = decode(p['g:title']);
        if (p['g:description']) {
          p['g:description'] = '';
        }
        if (p['title']) p['title'] = decode(p['title']);
        if (p['text']) {
          if (p['text']['desc']) p['text']['desc'] = '';
          if (p['text']['name']) p['text']['name'] = decode(p['text']['name']);
        }
        if (p['advertisername']) p['advertisername'] = decode(p['advertisername']);

        const id = p['g:id'] || p['pId'] || i;
        const slug = gerarSlug(nome, id);

        // Se já existe esse slug, pula o produto!
        if (slugsGlobais.has(slug)) continue;

        slugsGlobais.add(slug);
        slugIndex[slug] = `${nomeBase}.json`;

        produtosComSlugUnicos.push({
          slug: slug,
          ...p,
        });
      }

      // Salva JSON completo (sem lotes)
      if (nomeBase != 'BELEZANAWEB' && nomeBase != 'CEA' && nomeBase != 'CENTAURO') {
        fs.writeFileSync(caminhoJSON, JSON.stringify(produtosComSlugUnicos), 'utf-8');
        console.log(`✅ Arquivo salvo: ${nomeBase}.json em public/data`);
      }

      fs.writeFileSync(caminhoJSON2, JSON.stringify(produtosComSlugUnicos), 'utf-8');
      console.log(`✅ Arquivo salvo: ${nomeBase}.json em data/awin`);

      // Gera os arquivos .jsonl em lotes exatos
      const loteTamanho = 10000;
      const totalLotes = Math.ceil(produtosComSlugUnicos.length / loteTamanho);
      for (let i = 0; i < totalLotes; i++) {
        const inicio = i * loteTamanho;
        const fim = Math.min(inicio + loteTamanho, produtosComSlugUnicos.length);
        const lote = produtosComSlugUnicos.slice(inicio, fim);

        if (lote.length === 0) break;

        const jsonlContent = lote.map(p => JSON.stringify(p)).join('\n');
        const nomeArquivo = path.join(process.cwd(), 'data', 'awin', `${nomeBase}_${process.env.COUNTER}.jsonl`);
        fs.writeFileSync(nomeArquivo, jsonlContent, 'utf-8');
        console.log(`✅ Arquivo salvo: ${nomeArquivo} (${lote.length} registros)`);

        process.env.COUNTER++;
      }

      // Gera também o .jsonl completo (legacy)
      const jsonlContentCompleto = produtosComSlugUnicos.map(p => JSON.stringify(p)).join('\n');
      fs.writeFileSync(caminhoJSON.replace('.json', '.jsonl'), jsonlContentCompleto, 'utf-8');
      fs.writeFileSync(caminhoJSON2.replace('.json', '.jsonl'), jsonlContentCompleto, 'utf-8');

    } catch (err) {
      console.error(`❌ Erro ao processar ${arquivo}:`, err.message);
    }
  }

  console.log('✅ Conversão concluída!');

  // Salva o índice de slugs
  const caminhoIndex = path.join(process.cwd(), 'public', 'slug-index.json');

  let slugIndexAnterior = {};
  if (fs.existsSync(caminhoIndex)) {
    try {
      const data = fs.readFileSync(caminhoIndex, 'utf-8');
      slugIndexAnterior = JSON.parse(data);
    } catch (e) {
      console.warn('⚠️ Não foi possível ler slug-index.json existente. Criando novo.');
    }
  }

  const slugIndexFinal = { ...slugIndexAnterior, ...slugIndex };
  fs.writeFileSync(caminhoIndex, JSON.stringify(slugIndexFinal), 'utf-8');

  console.log('📄 Índice atualizado em: public/slug-index.json');
}

converterTodosXMLs();