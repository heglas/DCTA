/**
 * MAB Acervo Loader — Versão com múltiplos proxies
 * 
 * Uso em Joomla:
 * <div data-mab-acervo="S33"></div>
 * <script src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed-proxy.js"></script>
 * 
 * Ou com proxy local PHP:
 * <div data-mab-acervo="S33"></div>
 * <script src="/acervo-proxy.php?id=S33"></script>
 */

(function() {
  'use strict';

  // Mapeamento de IDs para nomes de arquivo
  const acervoMap = {
    'S33': 'MAB_T_004_S33@ACERVO.html',
    'BAFG120': 'MAB_D_002_BAFG120@ACERVO.html',
    'SBAT70': 'MAB_D_003_SBAT70@ACERVO.html',
    'SMA1': 'MAB_D_001_SMA1@ACERVO.html',
    'EMB01': 'MAB_A_001_EMB01@ACERVO.html',
    'SONDAIV': 'MAB_E_001_SONDAIV@ACERVO.html'
  };

  // Lista de CDNs e proxies alternativos (em ordem de preferência)
  function getUrlVariants(filename) {
    return [
      // CDN jsDelivr (mais rápido e confiável)
      `https://cdn.jsdelivr.net/gh/heglas/DCTA@main/01.MAB/${filename}`,
      
      // GitHub raw (oficial, pode bloquear)
      `https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`,
      
      // Ghproxy (proxy chinês, bom fallback)
      `https://ghproxy.com/https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`,
      
      // Statically CDN
      `https://cdn.statically.io/gh/heglas/DCTA/main/01.MAB/${filename}`,
      
      // Fastly CDN
      `https://fastly.jsdelivr.net/gh/heglas/DCTA@main/01.MAB/${filename}`,
      
      // Espaço alternativo (mattar.me)
      `https://cdn.jsdelivr.net/npm/dcta-acervo/${filename}`,
    ];
  }

  function sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remover scripts inline perigosos
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src === '') {
        const content = script.textContent;
        if (!content.includes('lucide.createIcons') && !content.includes('model-viewer')) {
          script.remove();
        }
      }
    });

    // Remover event listeners perigosos
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    return doc.body.innerHTML;
  }

  async function loadAcervo(container, id) {
    const id_upper = id.toUpperCase();
    const filename = acervoMap[id_upper];

    if (!filename) {
      container.innerHTML = `
        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1.5rem; text-align: center;">
          <h3 style="color: #856404; margin-bottom: 0.5rem;">⚠️ ID Inválido</h3>
          <p style="color: #856404; font-size: 0.9rem;">Disponíveis: ${Object.keys(acervoMap).join(', ')}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 2rem; min-height: 300px;">
        <div style="width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #1a73c5; border-radius: 50%; animation: mab-spin 1s linear infinite;"></div>
        <span style="color: #666;">Carregando acervo...</span>
      </div>
      <style>
        @keyframes mab-spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    try {
      const urls = getUrlVariants(filename);
      let html = null;
      let lastError = null;

      for (const url of urls) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);

          const response = await fetch(url, { 
            signal: controller.signal,
            headers: { 'Accept': 'text/html' }
          });
          
          clearTimeout(timeout);

          if (response.ok) {
            html = await response.text();
            console.log(`✓ Carregado de: ${url}`);
            break;
          }
        } catch (error) {
          lastError = error;
          console.log(`✗ Falhou [${error.name}]: ${url.substring(0, 50)}...`);
        }
      }

      if (!html) {
        throw lastError || new Error('Todas as URLs falharam');
      }

      html = sanitizeHTML(html);
      container.innerHTML = html;

      // Carregar Lucide dinamicamente
      if (!window.lucide) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
        script.onload = function() {
          if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
          }
        };
        document.head.appendChild(script);
      } else {
        setTimeout(() => {
          if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
          }
        }, 100);
      }

      // Carregar model-viewer se necessário
      if (container.querySelector('model-viewer') && !window.ModelViewerElement) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
      }

      // Carregar fontes do Google
      if (html.includes('Barlow')) {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

    } catch (error) {
      console.error('Erro ao carregar acervo:', error);
      
      let errorMsg = error.message;
      if (error.name === 'AbortError') {
        errorMsg = 'Timeout - Servidor não respondeu (tente novamente)';
      }
      
      container.innerHTML = `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 1.5rem; text-align: center;">
          <h3 style="color: #721c24; margin-bottom: 0.5rem;">❌ Erro ao Carregar</h3>
          <p style="color: #721c24; font-size: 0.9rem; margin-bottom: 1rem;">
            <strong>ID:</strong> ${id}<br>
            <strong>Arquivo:</strong> ${filename}
          </p>
          <p style="color: #721c24; font-size: 0.85rem; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0;">
            ${errorMsg}
          </p>
          <p style="color: #721c24; font-size: 0.75rem; margin-top: 1rem;">
            <strong>Dicas:</strong><br>
            • Verifique sua conexão com a internet<br>
            • Recarregue a página<br>
            • O GitHub pode estar lento (tente em 5 min)<br>
            • Peça a hospedagem local do arquivo
          </p>
        </div>
      `;
    }
  }

  function init() {
    const containers = document.querySelectorAll('[data-mab-acervo]');
    
    if (containers.length === 0) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('mab') || params.get('acervo');
      
      if (id) {
        const container = document.createElement('div');
        container.id = 'mab-acervo-embed';
        document.body.appendChild(container);
        loadAcervo(container, id);
      }
    } else {
      containers.forEach(container => {
        const id = container.getAttribute('data-mab-acervo');
        if (id) {
          loadAcervo(container, id);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MABLoadAcervo = function(containerId, id) {
    const container = document.getElementById(containerId);
    if (container) {
      loadAcervo(container, id);
    }
  };

})();
