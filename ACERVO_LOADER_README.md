# Acervo Digital — Loader para Joomla

Dois arquivos carregadores foram criados para integração com Joomla. Eles permitem carregar qualquer artigo de acervo diretamente do GitHub usando um identificador simples.

## 📋 Arquivos

### 1. `acervo-loader.html` (Recomendado)
- **Modo**: Carregamento direto via fetch
- **Uso**: Incorpora o HTML do acervo na mesma página
- **Vantagem**: Estilos e scripts integrados funcionam perfeitamente
- **Desvantagem**: Estilos podem conflitar com CSS do Joomla

**URL de uso:**
```
https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=S33
```

### 2. `acervo-loader-iframe.html` (Alternativa)
- **Modo**: Carregamento via iframe
- **Uso**: Isolamento completo de estilos e scripts
- **Vantagem**: Sem conflitos de CSS/JS com Joomla
- **Desvantagem**: Altura do iframe pode precisar ajuste

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

### Opção A: Incorporar via Custom HTML Module

1. **Acesse** Admin → Extensions → Modules → New Module
2. **Tipo**: Custom HTML / Rich Text
3. **Código HTML**:
```html
<iframe 
  src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=S33"
  style="width:100%; border:none; min-height:800px;"
  title="Acervo Digital — Propulsor S-33">
</iframe>
```

### Opção B: Incorporar via Artigo Joomla

1. **Edite** o artigo Joomla
2. **Cole** no editor HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4/js/iframeResizer.min.js"></script>
<iframe 
  id="acervo-frame"
  src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=S33"
  style="width:100%; border:none; min-height:1200px;"
  onload="iFrameResize({log:false}, this)">
</iframe>
```

### Opção C: URL Dinâmica com Parâmetro Joomla

Se quiser passar o ID via URL (ex: `article.php?id=123&acervo=S33`):

```html
<script>
  const params = new URLSearchParams(window.location.search);
  const acervoId = params.get('acervo') || 'S33';
  document.write(`<iframe 
    src="https://raw.githubusercontent.com/heglas/DCTA/main/acervo-loader.html?id=${acervoId}"
    style="width:100%; border:none; min-height:1000px;">
  </iframe>`);
</script>
```

---

## 🔧 Adicionar Novo Acervo

Para adicionar um novo item de acervo:

1. **Crie** o arquivo HTML em `01.MAB/` com nome padrão (ex: `MAB_T_005_NOVO@ACERVO.html`)
2. **Edite** o loader e adicione ao mapeamento:
```javascript
const acervoMap = {
  'S33': 'MAB_T_004_S33@ACERVO.html',
  'NOVO': 'MAB_T_005_NOVO@ACERVO.html',  // ← Adicionar aqui
  // ...
};
```
3. **Use** em Joomla com `?id=NOVO`

---

## ⚙️ Características

✅ **Fetch automático** do GitHub (sem cache)
✅ **Spinner de carregamento** com feedback visual
✅ **Tratamento de erros** com mensagens claras
✅ **Re-inicialização** de lucide icons e model-viewer
✅ **Responsivo** e compatível com mobile
✅ **Sem dependências externas** (vanilla JS)

---

## 🐛 Troubleshooting

### "Erro HTTP 404"
- Verifique se o ID existe em `acervoMap`
- Confirme que o arquivo existe no GitHub

### Modelo 3D não carrega
- O `model-viewer` precisa de CORS ativo
- Verifique a URL do arquivo `.glb`

### Estilos conflitando
- Use `acervo-loader-iframe.html` para isolamento
- Ou ajuste `z-index` e prefixos de classe no HTML

---

**Última atualização**: Julho de 2026
**Mantido por**: Tim de Desenvolvimento DCTA
