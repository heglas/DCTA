/**
 * MAB Acervo Loader — Script de Embed para Joomla
 * 
 * Uso em artigo Joomla:
 * <div id="mab-acervo" data-id="S33"></div>
 * <script src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js"></script>
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

  // Função para limpar HTML (remover scripts maliciosos, manter model-viewer e lucide)
  function sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remover scripts inline (exceto os que inicializam componentes)
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src === '') {
        // Manter script se inicializa lucide ou model-viewer
        const content = script.textContent;
        if (!content.includes('lucide.createIcons') && !content.includes('model-viewer')) {
          script.remove();
        }
      }
    });

    // Remover event listeners perigosos
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      // Copiar atributos seguros
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    return doc.body.innerHTML;
  }

  // Função para carregar e injetar acervo
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

    // Mostrar loader
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
      const url = `https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`;
      
      // Tentar fetch com timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: { 'Accept': 'text/html' }
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      let html = await response.text();
      
      // Sanitizar HTML
      html = sanitizeHTML(html);
      
      // Injetar no container
      container.innerHTML = html;

      // Re-carregar lucide icons
      if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 100);
      } else {
        // Carregar lucide se não disponível
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
        script.onload = function() {
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        };
        document.head.appendChild(script);
      }

      // Carregar model-viewer se houver elementos model-viewer
      if (container.querySelector('model-viewer') && typeof ModelViewerElement === 'undefined') {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
      }

      // Carregar fontes do Google se houver
      if (html.includes('fonts.googleapis.com')) {
        const linkExists = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (!linkExists) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = 'https://fonts.googleapis.com';
          document.head.appendChild(link);
          
          const link2 = document.createElement('link');
          link2.rel = 'preconnect';
          link2.href = 'https://fonts.gstatic.com';
          link2.crossOrigin = 'anonymous';
          document.head.appendChild(link2);
          
          const link3 = document.createElement('link');
          link3.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap';
          link3.rel = 'stylesheet';
          document.head.appendChild(link3);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar acervo:', error);
      
      let errorMsg = error.message;
      if (error.name === 'AbortError') {
        errorMsg = 'Timeout - servidor não respondeu';
      }
      
      container.innerHTML = `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 1.5rem; text-align: center;">
          <h3 style="color: #721c24; margin-bottom: 0.5rem;">❌ Erro ao Carregar</h3>
          <p style="color: #721c24; font-size: 0.9rem; margin-bottom: 0.5rem;">ID: <strong>${id}</strong></p>
          <p style="color: #721c24; font-size: 0.85rem;">${errorMsg}</p>
          <p style="color: #721c24; font-size: 0.75rem; margin-top: 1rem;">Arquivo: ${filename}</p>
        </div>
      `;
    }
  }

  // Inicializar quando DOM estiver pronto
  function init() {
    // Procurar por elementos com data-id
    const containers = document.querySelectorAll('[data-mab-acervo]');
    
    if (containers.length === 0) {
      // Fallback: procurar por ID na URL
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

  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exportar função para uso manual
  window.MABLoadAcervo = function(containerId, id) {
    const container = document.getElementById(containerId);
    if (container) {
      loadAcervo(container, id);
    }
  };

})();
