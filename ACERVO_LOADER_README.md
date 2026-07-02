# Acervo Digital — Loader para Joomla

Três soluções foram criadas para integração com Joomla, cada uma com diferentes abordagens para evitar problemas de CORS e conflitos de estilos.

## 📋 Arquivos

### 1. `acervo-embed.js` ⭐ **RECOMENDADO**
- **Modo**: Script de embed que injeta HTML dinamicamente
- **Uso**: Copie e cole 2 linhas no artigo Joomla
- **Vantagem**: Funciona em qualquer contexto, compatível com Joomla filtering
- **Desvantagem**: Nenhuma conhecida
- **CDNs alternativas**: Trata múltiplas URLs (raw.githubusercontent.com, jsDelivr, ghproxy)

**Como usar:**
```html
<!-- No seu artigo Joomla -->
<div data-mab-acervo="S33"></div>
<script src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js"></script>
```

### 2. `acervo-loader.html` (Secundária)
- **Modo**: Carregamento direto via fetch com múltiplas URLs
- **Uso**: Incorpora HTML na mesma página
- **Vantagem**: Estilos nativos funcionam sem isolamento
- **Desvantagem**: Pode ter conflitos com CSS do Joomla

**URL de uso:**
```
https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=S33
```

### 3. `acervo-loader-iframe.html` (Fallback)
- **Modo**: Carregamento via iframe
- **Uso**: Isolamento completo de estilos e scripts
- **Vantagem**: Sem conflitos de CSS com Joomla
- **Desvantagem**: Pode ter altura fixa ou redimensionamento complexo

**URL de uso:**
```
https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader-iframe.html?id=S33
```

---

## 🎯 IDs Disponíveis

| ID | Descrição | Arquivo |
|---|---|---|
| `S33` | Propulsor S-33 (Motor-foguete sólido) | MAB_T_004_S33@ACERVO.html |
| `BAFG120` | Bomba de Água FG-120 | MAB_D_002_BAFG120@ACERVO.html |
| `SBAT70` | Sistema de Armas SBAT-70 | MAB_D_003_SBAT70@ACERVO.html |
| `SMA1` | Míssil Ar-Ar MSA-1 | MAB_D_001_SMA1@ACERVO.html |
| `EMB01` | Embraer EMB-110 Bandeirante | MAB_A_001_EMB01@ACERVO.html |
| `SONDAIV` | Sonda IV (Injeção Secundária) | MAB_E_001_SONDAIV@ACERVO.html |

---

## 🚀 Como Usar em Joomla

### ✅ SOLUÇÃO 1: Script de Embed (Recomendado)

**Melhor para**: Artigos Joomla normais, sem conflitos

1. **Edite** o artigo Joomla
2. **Cole** no editor (HTML mode):

```html
<div data-mab-acervo="S33"></div>
<script async src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js"></script>
```

Pronto! O script carregará automaticamente o conteúdo.

---

### ✅ SOLUÇÃO 2: Iframe (Isolado)

**Melhor para**: Evitar conflitos de CSS

```html
<iframe 
  id="acervo-frame" 
  src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader-iframe.html?id=S33"
  style="width:100%; border:none; min-height:1200px;"
  title="Acervo Digital — Propulsor S-33">
</iframe>
```

---

### ✅ SOLUÇÃO 3: Loader Direto

**Melhor para**: Máximo controle

```html
<iframe 
  src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=S33"
  style="width:100%; border:none; min-height:1000px;">
</iframe>
```

---

## 🔧 Personalizações

### Mudar ID dinamicamente
```html
<script>
  // Passar via URL: article.php?acervo=S33
  const params = new URLSearchParams(window.location.search);
  const id = params.get('acervo') || 'S33';
  
  document.getElementById('acervo').setAttribute('data-mab-acervo', id);
  
  // Recarregar script
  const script = document.createElement('script');
  script.src = 'https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js';
  document.body.appendChild(script);
</script>
```

### Recarregar manualmente via JavaScript
```javascript
// Após carregar o script embed.js, use:
MABLoadAcervo('mab-container', 'S33');
```

### Customizar container
```html
<div id="meu-acervo" data-mab-acervo="SBAT70"></div>
<script src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js"></script>
```

---

## 🛠️ Adicionar Novo Acervo

1. **Crie** o arquivo HTML em `01.MAB/` (ex: `MAB_T_005_NOVO@ACERVO.html`)
2. **Edite** o loader JS/HTML e adicione ao mapeamento:

Em `acervo-embed.js`:
```javascript
const acervoMap = {
  'S33': 'MAB_T_004_S33@ACERVO.html',
  'NOVO': 'MAB_T_005_NOVO@ACERVO.html',  // ← Adicionar
};
```

3. **Use** em Joomla:
```html
<div data-mab-acervo="NOVO"></div>
<script src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-embed.js"></script>
```

---

## 🐛 Troubleshooting

### "Erro: Timeout — servidor não respondeu"
**Solução**: O GitHub pode estar lento. A solução embed.js tenta múltiplas URLs automaticamente (raw.githubusercontent, jsDelivr, ghproxy).

### Modelo 3D não aparece
**Solução**: 
- Verifique console (F12) para erros de CORS
- Certifique-se que URL do GLB está correta
- Tente usar `acervo-embed.js` em vez de iframe

### Estilos conflitando com Joomla
**Solução**:
- Use `acervo-loader-iframe.html` para isolamento completo
- Ou customize CSS no artigo Joomla

### Script bloqueado por Joomla filter
**Solução**:
- Use `data-mab-acervo` attribute (o `acervo-embed.js` é um script externo seguro)
- Ativa "Advanced Parameters" → "Xhtml validation" = Off

### GitHub bloqueando acesso (429/403)
**Solução**: O `acervo-embed.js` tenta automaticamente:
1. `raw.githubusercontent.com` (oficial)
2. `cdn.jsdelivr.net` (CDN espelhado)
3. `ghproxy.com` (proxy de GitHub)

---

## ⚙️ Características Técnicas

✅ **Múltiplas CDNs** — Fallback automático se uma URL falhar
✅ **Timeout** — Timeout de 10-15s para evitar travamentos
✅ **Sanitização** — Remove scripts maliciosos (mantém lucide e model-viewer)
✅ **Lazy loading** — Carrega lucide/model-viewer sob demanda
✅ **Responsivo** — 100% responsivo em mobile
✅ **Sem dependências** — Vanilla JavaScript puro
✅ **Joomla compatible** — Funciona com Joomla XP, K2, etc.

---

## 📦 Versões de Fallback

Se nenhuma solução funcionar em seu Joomla:

1. **Download** do arquivo HTML diretamente
2. **Hospede** localmente em seu servidor
3. **Aponte** para URL local em vez do GitHub

```html
<div data-mab-acervo="S33"></div>
<script>
  // Modificar URL base no script
  const url = 'https://seudominio.com/acervos/MAB_T_004_S33@ACERVO.html';
</script>
```

---

**Última atualização**: Julho de 2026  
**Versão**: 2.0 (Múltiplas CDNs + Embed Script)  
**Mantido por**: Tim de Desenvolvimento DCTA
