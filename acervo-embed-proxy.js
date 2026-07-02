/**
 * MAB Acervo Loader — Versão com Shadow DOM (Isolamento Total de Estilos)
 * 
 * Uso em Joomla:
 * <div data-mab-acervo="S33"></div>
 * <script async src="https://cdn.jsdelivr.net/gh/heglas/DCTA@main/acervo-embed-proxy.js"></script>
 */

(function() {
  'use strict';

  const acervoMap = {
    'S33': 'MAB_T_004_S33@ACERVO.html',
    'BAFG120': 'MAB_D_002_BAFG120@ACERVO.html',
    'SBAT70': 'MAB_D_003_SBAT70@ACERVO.html',
    'SMA1': 'MAB_D_001_SMA1@ACERVO.html',
    'EMB01': 'MAB_A_001_EMB01@ACERVO.html',
    'SONDAIV': 'MAB_E_001_SONDAIV@ACERVO.html'
  };

  function getUrlVariants(filename) {
    return [
      `https://cdn.jsdelivr.net/gh/heglas/DCTA@main/01.MAB/${filename}`,
      `https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`,
      `https://ghproxy.com/https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/${filename}`,
      `https://cdn.statically.io/gh/heglas/DCTA/main/01.MAB/${filename}`,
    ];
  }

  // Extrair estilos do HTML
  function extractStyles(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const styleTags = doc.querySelectorAll('style');
    
    let allCss = '';
    styleTags.forEach((styleTag) => {
      allCss += styleTag.textContent + '\n';
    });
    
    return allCss;
  }

  // Remover tags de estilo do HTML
  function removeStyleTagsFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remover tags <style>
    const styleTags = doc.querySelectorAll('style');
    styleTags.forEach(tag => tag.remove());
    
    // Remover tags <link> para fontes
    const linkTags = doc.querySelectorAll('link[rel="preconnect"], link[href*="fonts.googleapis"]');
    linkTags.forEach(tag => tag.remove());
    
    // Remover tags <script> externas
    const scriptTags = doc.querySelectorAll('script');
    scriptTags.forEach(tag => {
      if (tag.src) tag.remove();
    });
    
    // Extrair apenas o conteúdo de .mab-acervo se existir
    const mabContainer = doc.querySelector('.mab-acervo');
    if (mabContainer) {
      return mabContainer.innerHTML;
    }
    
    return doc.body.innerHTML;
  }

  function sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remover scripts inline perigosos
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src === '') {
        script.remove();
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
            console.log(`✓ HTML carregado com sucesso`);
            break;
          }
        } catch (error) {
          lastError = error;
        }
      }

      if (!html) {
        throw lastError || new Error('Todas as URLs falharam');
      }

      // PASSO 1: Extrair estilos CSS
      console.log('🎨 Extraindo estilos CSS...');
      const cssText = extractStyles(html);

      // PASSO 2: Remover tags de estilo do HTML
      html = removeStyleTagsFromHTML(html);

      // PASSO 3: Sanitizar HTML
      html = sanitizeHTML(html);

      // PASSO 4: Carregar Google Fonts globalmente (fora do Shadow DOM)
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap';
      link.rel = 'stylesheet';
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }

      // PASSO 5: Criar Shadow DOM para isolamento de estilos
      console.log('🎭 Criando Shadow DOM...');
      container.innerHTML = ''; // Limpar container
      
      let shadowRoot;
      try {
        shadowRoot = container.attachShadow({ mode: 'open' });
        console.log('✓ Shadow DOM criado com sucesso');
      } catch (e) {
        console.warn('⚠️ Shadow DOM não suportado, usando fallback');
        // Fallback: apenas injetar sem isolamento
        container.innerHTML = html;
        container.classList.add('mab-acervo');
        
        // Criar e injetar estilos no HEAD
        const styleEl = document.createElement('style');
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
        
        throw new Error('Shadow DOM fallback usado');
      }

      // PASSO 6: Injetar CSS no Shadow DOM
      const shadowStyle = document.createElement('style');
      shadowStyle.textContent = cssText;
      shadowRoot.appendChild(shadowStyle);
      console.log('✓ CSS injetado no Shadow DOM');

      // PASSO 7: Injetar HTML no Shadow DOM
      const shadowContent = document.createElement('div');
      shadowContent.innerHTML = html;
      shadowRoot.appendChild(shadowContent);
      console.log('✓ HTML injetado no Shadow DOM');

      // PASSO 8: Carregar Lucide
      setTimeout(() => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
          console.log('✓ Ícones lucide criados (global)');
        } else {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
          script.onload = function() {
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
              console.log('✓ Lucide carregado');
            }
          };
          document.head.appendChild(script);
        }
      }, 150);

      // PASSO 9: Carregar model-viewer se necessário
      if (html.includes('model-viewer') && !window.ModelViewerElement) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
        console.log('✓ model-viewer script carregado');
      }

      console.log(`✅ Acervo "${id}" carregado com Shadow DOM!`);

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
            • Recarregue a página (F5)<br>
            • O GitHub pode estar lento
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
