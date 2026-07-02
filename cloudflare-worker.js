/**
 * Cloudflare Worker — Proxy para Acervo Digital
 * 
 * SETUP:
 * 1. Vá para https://dash.cloudflare.com/
 * 2. Vá para "Workers" → "Create a Service"
 * 3. Cole este código
 * 4. Deploy
 * 5. Use em Joomla:
 *    <div data-mab-acervo="S33"></div>
 *    <script src="https://seu-worker.workers.dev/proxy?id=S33"></script>
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id')?.toUpperCase();

    const acervoMap = {
      'S33': 'MAB_T_004_S33@ACERVO.html',
      'BAFG120': 'MAB_D_002_BAFG120@ACERVO.html',
      'SBAT70': 'MAB_D_003_SBAT70@ACERVO.html',
      'SMA1': 'MAB_D_001_SMA1@ACERVO.html',
      'EMB01': 'MAB_A_001_EMB01@ACERVO.html',
      'SONDAIV': 'MAB_E_001_SONDAIV@ACERVO.html'
    };

    if (!id || !acervoMap[id]) {
      return new Response('ID inválido', { status: 400 });
    }

    const filename = acervoMap[id];
    const githubUrl = `https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`;

    try {
      const response = await fetch(githubUrl);
      
      if (!response.ok) {
        throw new Error(`GitHub retornou ${response.status}`);
      }

      const html = await response.text();

      // Retornar como JavaScript que injeta no DOM
      const jsResponse = `
(function() {
  const html = ${JSON.stringify(html)};
  const container = document.querySelector('[data-mab-acervo="${id}"]');
  if (container) {
    container.innerHTML = html;
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }
})();
      `.trim();

      return new Response(jsResponse, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff'
        }
      });

    } catch (error) {
      return new Response(`console.error('Erro: ${error.message}');`, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
