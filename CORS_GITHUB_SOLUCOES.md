# Solução para Problema de CORS/GitHub Bloqueado

O GitHub está recusando conexão? Temos **4 soluções alternativas**:

---

## 🚀 SOLUÇÃO 1: Usar CDN jsDelivr (RECOMENDADO)

A forma mais simples e confiável:

```html
<!-- Seu artigo Joomla -->
<div data-mab-acervo="S33"></div>
<script async src="https://cdn.jsdelivr.net/gh/heglas/DCTA@main/acervo-embed-proxy.js"></script>
```

**Por quê funciona:**
- ✅ jsDelivr é uma CDN global muito confiável
- ✅ Trata múltiplos proxies automaticamente
- ✅ Sem problemas de CORS
- ✅ Funciona em qualquer contexto Joomla

**URLs testadas (em ordem de fallback):**
1. `cdn.jsdelivr.net` - Principal
2. `raw.githubusercontent.com` - Oficial GitHub
3. `ghproxy.com` - Proxy chinês
4. `cdn.statically.io` - CDN alternativa
5. `fastly.jsdelivr.net` - CDN Fastly

---

## 🏠 SOLUÇÃO 2: Proxy Local PHP (Melhor para Produção)

Hospede os arquivos localmente em seu servidor Joomla:

### Passo 1: Criar diretório
```bash
mkdir /var/www/seu-site/acervo
# ou no Windows:
# mkdir C:\xampp\htdocs\seu-site\acervo
```

### Passo 2: Copiar arquivo de proxy
Salve o arquivo `acervo-proxy.php` na raiz do seu Joomla

### Passo 3: Copiar arquivos HTML
Copie todos os arquivos de `01.MAB/` para a pasta `acervo/`:
```
seu-site/
├── acervo-proxy.php
└── acervo/
    ├── MAB_T_004_S33@ACERVO.html
    ├── MAB_D_002_BAFG120@ACERVO.html
    └── ... (outros arquivos)
```

### Passo 4: Usar em Joomla
```html
<div data-mab-acervo="S33"></div>
<script src="https://seu-dominio.com/acervo-proxy.php?id=S33"></script>
```

**Vantagens:**
- ✅ Funciona 100% offline
- ✅ Sem dependência de GitHub
- ✅ Muito rápido (servidor local)
- ✅ Controle total

**Desvantagens:**
- Precisa copiar arquivos manualmente

---

## ☁️ SOLUÇÃO 3: Cloudflare Worker (Serverless)

Use um proxy serverless **gratuito** no Cloudflare:

### Passo 1: Criar Worker
1. Acesse https://dash.cloudflare.com/
2. Vá em "Workers" → "Create a Service"
3. Cole o código do arquivo `cloudflare-worker.js`
4. Clique "Save and Deploy"

### Passo 2: Usar em Joomla
```html
<div data-mab-acervo="S33"></div>
<script src="https://seu-worker.workers.dev/proxy?id=S33"></script>
```

(Substitua `seu-worker` pelo nome do seu Worker)

**Vantagens:**
- ✅ Gratuito (até 100k req/dia)
- ✅ Funciona sem GitHub
- ✅ Global e rápido
- ✅ Sem manutenção local

---

## 🔄 SOLUÇÃO 4: Script com Múltiplos Proxies (Fallback)

Se nenhuma solução anterior funcionar, use o `acervo-embed-proxy.js` que tenta automaticamente:

```html
<div data-mab-acervo="S33"></div>
<script async src="https://cdn.jsdelivr.net/gh/heglas/DCTA@main/acervo-embed-proxy.js"></script>
```

Ele tentará **6 URLs diferentes** automaticamente até conseguir carregar.

---

## 🆘 Se Nenhuma Solução Funcionar

### Opção A: Usar Base64 Inline
```html
<!-- Arquivo HTML codificado em base64 -->
<script>
  const html = atob('PGRpdiBjbGFzcz0ibWFiLWFjZXJ2byI+Li4u');
  document.getElementById('container').innerHTML = html;
</script>
```

### Opção B: Usar localStorage
```html
<!-- Armazenar HTML localmente na primeira visita -->
<script>
  if (!localStorage.getItem('acervo-S33')) {
    fetch('arquivo.html').then(r => r.text()).then(html => {
      localStorage.setItem('acervo-S33', html);
    });
  }
  document.getElementById('container').innerHTML = localStorage.getItem('acervo-S33');
</script>
```

### Opção C: Importar como Módulo
Se tiver Node.js/npm:
```bash
npm install dcta-acervo
```

```html
<script type="module">
  import acervo from 'https://cdn.jsdelivr.net/npm/dcta-acervo/s33.js';
  document.body.appendChild(acervo);
</script>
```

---

## 📋 Comparação de Soluções

| Solução | Setup | Velocidade | Confiabilidade | Custo | Recomendação |
|---------|-------|-----------|----------------|-------|--------------|
| jsDelivr CDN | ⭐ Fácil | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Grátis | ✅ **PRIMEIRA** |
| Proxy PHP Local | ⭐⭐⭐ Médio | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Grátis | ✅ **SEGUNDA** |
| Cloudflare Worker | ⭐⭐ Médio | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Grátis | ✅ **TERCEIRA** |
| embed-proxy.js | ⭐ Fácil | ⭐⭐⭐ | ⭐⭐⭐ | Grátis | Fallback |

---

## 🔧 Debugging

### Ver qual CDN está sendo usado
Abra o console (F12) e procure por:
```
✓ Carregado de: https://cdn.jsdelivr.net/...
```

### Forçar uma URL específica
Edite o script e remova URLs que não funcionam, ou crie uma versão customizada:

```javascript
// Forçar apenas jsDelivr
function getUrlVariants(filename) {
  return [
    `https://cdn.jsdelivr.net/gh/heglas/DCTA@main/01.MAB/${filename}`,
  ];
}
```

### Testar conexão
```bash
# Terminal/Prompt
curl -I https://raw.githubusercontent.com/heglas/DCTA/main/01.MAB/MAB_T_004_S33@ACERVO.html
curl -I https://cdn.jsdelivr.net/gh/heglas/DCTA@main/01.MAB/MAB_T_004_S33@ACERVO.html
```

---

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique** sua conexão com internet
2. **Teste** em outro navegador (Chrome, Firefox, Edge)
3. **Limpe** cache: Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
4. **Use** VPN se atrás de firewall corporativo
5. **Contate** o administrador do Joomla para proxy settings

---

**Última atualização**: Julho de 2026
**Versão**: 3.0 (4 Soluções Alternativas)