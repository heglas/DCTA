# MAB Catálogo de Acervo — Guia de Uso e Customização

## 📋 Visão Geral

O arquivo `Catalogo-Acervo.html` é uma página de catálogo/tabela responsiva com o mesmo tema visual das páginas de acervo. Pode ser:
- Visualizado diretamente no navegador
- Inserido como `<iframe>` no Joomla
- Customizado com novos items, categorias e cores

---

## 🎨 Design & Tema

O catálogo usa o mesmo sistema de cores das páginas de acervo:

| Elemento | Cor | Código |
|----------|-----|--------|
| Fundo | Dark Navy | `#0b0e14` |
| Superfície | Dark Blue | `#111520` |
| Texto | Cinza Claro | `#e8eaf0` |
| Destaque/Seção A | Ouro | `#c8a84b` |
| Categoria A | Azul | `#1a73c5` |
| Categoria D | Vermelho | `#e53935` |
| Status Ativo | Verde | `#4caf50` |

---

## 📱 Responsividade

A tabela se adapta automaticamente:

- **Desktop (> 768px):** Todas as 6 colunas visíveis
  - ID | Nome | Categoria | Período | Status | Acesso

- **Tablet (768px - 500px):** Coluna "Período" escondida
  - ID | Nome | Categoria | Status | Acesso

- **Mobile (< 500px):** Categorias e Período escondidas, nomes truncados
  - ID | Nome | Status | Acesso

---

## 🔧 Estrutura dos Dados

Cada item do acervo é um objeto JavaScript:

```javascript
{
  id: 'MAB_A_001_EMB01',              // Identificador único (formato: MAB_SECAO_NUM_NOME)
  nome: 'Embraer EMB-110 Bandeirante', // Nome do item
  secao: 'A',                          // Seção: A (Aeronáutica), D (Defesa), etc.
  categoria: 'Aeronave de Transporte', // Tipo/classificação
  periodo: '1968–1990',                // Período histórico
  status: 'Em exposição',              // Status (Em exposição, Projeto Encerrado, etc.)
  ativo: true,                         // true = verde, false = cinza
  link: '/index.php/acervo/embraer-emb-110' // URL da página de detalhe
}
```

---

## ➕ Como Adicionar Novos Items

Localize o array `acervoData` no JavaScript (por volta da linha 300):

```javascript
const acervoData = [
  // Items existentes...
  
  // NOVO ITEM:
  {
    id: 'MAB_A_004_NOVO_ITEM',
    nome: 'Nome do Novo Item',
    secao: 'A',
    categoria: 'Tipo de Aeronave',
    periodo: 'Ano–Ano',
    status: 'Em exposição',
    ativo: true,
    link: '/index.php/acervo/novo-item'
  }
];
```

**Campos obrigatórios:**
- `id` — Deve ser único, formato `MAB_SECAO_NUM_NOME`
- `nome` — Máx. 50 caracteres (em mobile aparecerá truncado)
- `secao` — Uma letra: `A`, `D`, ou outra que você definir
- `categoria` — Descrição do tipo (ex: Aeronave, Míssil, Equipamento)
- `periodo` — Com hífen ou traço: `1968–1990`
- `status` — Descrição do status atual
- `ativo` — `true` (verde) ou `false` (cinza)
- `link` — URL relativa ou absoluta para a página de detalhe

---

## 🏷️ Adicionar Novas Seções

Para adicionar uma nova seção (ex: Instrumentação "I"), siga 2 passos:

### Passo 1: Adicionar Badge no CSS

Encontre a seção de Badges (por volta da linha 180):

```css
.badge-d {
  color: var(--fab-red);
  border-color: var(--fab-red);
  background: var(--fab-red-bg);
}

/* NOVO: */
.badge-i {
  color: var(--fab-green);
  border-color: var(--fab-green);
  background: rgba(76, 175, 80, 0.12);
}
```

### Passo 2: Adicionar Botão de Filtro

Encontre os botões de filtro (por volta da linha 410):

```html
<button class="filter-btn" data-filter="D">
  <i data-lucide="target"></i> Defesa (D)
</button>

<!-- NOVO: -->
<button class="filter-btn" data-filter="I">
  <i data-lucide="gauge"></i> Instrumentação (I)
</button>
```

### Passo 3: Usar nos Items

```javascript
{
  id: 'MAB_I_001_ITEM',
  nome: 'Instrumento de Medição',
  secao: 'I',
  categoria: 'Equipamento de Teste',
  periodo: '1970–1995',
  status: 'Em exposição',
  ativo: true,
  link: '/index.php/acervo/instrumento'
}
```

---

## 🎯 Modificar Ícones de Filtro

Os ícones vêm da biblioteca **Lucide**. Acesse: https://lucide.dev/

Substitua os atributos `data-lucide`:

```html
<!-- Aeronáutica -->
<i data-lucide="plane"></i>          <!-- ✈ avião -->
<i data-lucide="navigation"></i>     <!-- navegação -->
<i data-lucide="airplay"></i>        <!-- transmissão -->

<!-- Defesa -->
<i data-lucide="target"></i>         <!-- 🎯 alvo -->
<i data-lucide="shield"></i>         <!-- escudo -->
<i data-lucide="zap"></i>            <!-- raio/energia -->

<!-- Outros -->
<i data-lucide="gauge"></i>          <!-- medidor -->
<i data-lucide="settings"></i>       <!-- engrenagem -->
<i data-lucide="box"></i>            <!-- caixa -->
```

---

## 🔗 Usar no Joomla (iframe)

### Opção 1: Inserir como Artigo HTML

1. No Joomla, crie um novo artigo
2. Mude para editor "HTML" (não Visual)
3. Insira o código HTML do `Catalogo-Acervo.html` diretamente no artigo
4. Salve e publique

### Opção 2: Usar iframe (Recomendado)

1. Coloque `Catalogo-Acervo.html` na pasta `/media/` do servidor Joomla
2. No artigo, adicione:

```html
<iframe 
  src="/media/Catalogo-Acervo.html" 
  style="width: 100%; height: 600px; border: none; border-radius: 8px;"
  title="Catálogo de Acervo">
</iframe>
```

**Ajuste a altura (`height`) conforme necessário:**
- Desktop: 600px–800px
- Tablets: 500px–700px
- Mobile: 400px–600px

---

## 📊 Customização Avançada

### Alterar Cores

Edite as variáveis CSS no `<style>` (linhas 30–60):

```css
:root {
  --fab-gold: #c8a84b;      /* Cor de destaque */
  --fab-blue: #1a73c5;      /* Categoria A */
  --fab-red: #e53935;       /* Categoria D */
  --fab-green: #4caf50;     /* Status ativo */
}
```

### Alterar Fontes

As fontes padrão vêm do Google Fonts:
- **Títulos:** Barlow Condensed (800, 700, 600, 400)
- **Corpo:** Barlow (400, 500, 600)

Para mudar, edite o `<link>` no `<head>` (linha 15).

### Alterar Padding/Espaçamentos

Ajuste em `<style>`:

```css
.mab-table thead th,
.mab-table td {
  padding: 1rem 1.2rem;  /* Espaço interno das células */
}

.mab-table {
  font-size: clamp(0.8rem, 0.75rem + 0.2vw, 0.95rem);
}
```

---

## 🚀 Funcionalities

### ✅ Implementado

- [x] Tabela responsiva com 6 colunas
- [x] Filtros por seção (Aeronáutica, Defesa, etc.)
- [x] Badges de categoria e status
- [x] Links para páginas de detalhe
- [x] Contadores de items (Total/Exibidos)
- [x] Icons dinâmicos via Lucide
- [x] Mobile-first design
- [x] Compatível com iframe Joomla
- [x] Hover effects e transições suaves
- [x] Tema dark com acessibilidade

### 🔮 Sugestões Futuras

- [ ] Busca/Filtro por texto (nome, categoria)
- [ ] Ordenação por coluna (clique no cabeçalho)
- [ ] Exportar para CSV/Excel
- [ ] Paginação (se > 50 items)
- [ ] Gráficos de distribuição por seção
- [ ] Integração com banco de dados (PHP/API)

---

## 📝 Checklist de Setup

- [ ] Arquivo criado/copiado: `Catalogo-Acervo.html`
- [ ] Items adicionados ao array `acervoData`
- [ ] Links verificados e funcionando
- [ ] Seções customizadas (se necessário)
- [ ] Cores personalizadas (se desejado)
- [ ] Testado em desktop, tablet e mobile
- [ ] Testado em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Inserido no Joomla (artigo ou iframe)
- [ ] Responsividade verificada
- [ ] Ícones renderizando corretamente

---

## 🐛 Troubleshooting

### Ícones não aparecem

**Problema:** Os ícones (lucide) aparecem como símbolos estranhos.

**Solução:** Verifique se a CDN de lucide está acessível. Substitua a linha:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

Por uma versão específica:
```html
<script src="https://unpkg.com/lucide@0.263.1/dist/umd/lucide.js"></script>
```

### Tabela não responsiva

**Problema:** Colunas não desaparecem em mobile.

**Solução:** Verifique se o atributo `viewport` está no `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Items não aparecem

**Problema:** Tabela vazia ou com "Nenhum item encontrado".

**Solução:** 
1. Verifique se `acervoData` tem items
2. Confirme que a seção no filtro coincide com `secao` dos items
3. Abra o console (F12) e procure por erros de sintaxe

### iframe com scroll excessivo

**Problema:** O iframe mostra scroll interno.

**Solução:** Ajuste a altura do iframe:
```html
<iframe src="..." style="height: 800px;"></iframe>
```

---

## 📞 Referências

- **Lucide Icons:** https://lucide.dev/
- **Google Fonts:** https://fonts.google.com/
- **Joomla iframe:** https://docs.joomla.org/

---

**Última atualização:** 30/06/2026  
**Compatibilidade:** Chrome, Firefox, Safari, Edge (últimas 2 versões)  
**Responsividade:** Desktop, Tablet, Mobile
