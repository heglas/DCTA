# MAB ACERVO DIGITAL — Guia de Criação de Novos Arquivos

## Visão Geral

Este guia explica como criar um novo arquivo de acervo digital usando o template padrão `Acervo-Modelo-TEMPLATE.html`. O template foi desenvolvido com base no padrão do arquivo `MAB_A_001_EMB01@ACERVO.html` (Embraer EMB-110) e atualizado com as funcionalidades do `MAB_D_001_SMA1@ACERVO.html` (Míssil MSA-1).

---

## Estrutura do Template

O arquivo é dividido em 4 seções principais:

1. **① FONTES E LIBS EXTERNAS** — Carregamento de fonts, ícones e model-viewer
2. **② ESTILOS ESCOPADOS** — CSS customizado com tema dark e paleta de cores
3. **③ HTML DO ARTIGO** — Conteúdo estruturado em seções
4. **④ SCRIPTS** — JavaScript para interatividade (lightbox, progress bar, scroll animations)

---

## Temas de Cores

Escolha um tema baseado na categoria do acervo:

### Tema AZUL (Padrão — Aviação, Transporte)
- Cor primária: `--fab-blue` (#1a73c5)
- Cor de destaque: `--fab-gold` (#c8a84b)
- Barra de progresso: Gold
- Badge adicional: `badge-ok` (verde)

**Customize no CSS:**
```css
.model-wrap {
  background: radial-gradient(ellipse at center, #1c2440 0%, #080c14 100%);
  box-shadow: var(--fab-shadow), 0 0 60px rgba(26, 115, 197, .15);
}
.mab-acervo .tl::before {
  background: linear-gradient(to bottom, var(--fab-gold), var(--fab-blue), transparent);
}
```

### Tema VERMELHO (Armamento, Mísseis)
- Cor primária: `--fab-red` (#e53935)
- Cor de destaque: `--fab-gold` (#c8a84b)
- Barra de progresso: Red
- Badge adicional: `badge-red` (vermelho)

**Customize no CSS:**
```css
.model-wrap {
  background: radial-gradient(ellipse at center, #1c0a0a 0%, #08040a 100%);
  box-shadow: var(--fab-shadow), 0 0 60px rgba(229, 57, 53, .10);
}
.mab-acervo .model-badge { border-color: var(--fab-red); color: var(--fab-red); }
.mab-acervo .mdot { background: var(--fab-red); }
.mab-acervo .tl::before {
  background: linear-gradient(to bottom, var(--fab-red), var(--fab-gold), transparent);
}
.mab-acervo .tl-item::before { background: var(--fab-red); box-shadow: 0 0 8px var(--fab-red); }
.mab-acervo .tl-year { color: var(--fab-red); }
#mab-progress { background: var(--fab-red); }
```

---

## Passo-a-Passo de Preenchimento

### 1. Informações Básicas do Objeto

**Localizar no template:**
```html
<span>[[CATEGORIA DO ACERVO]]</span>
<span class="badge badge-era">[[PERÍODO HISTÓRICO, ex: 1968–1990]]</span>
<span class="badge badge-cat">[[TIPO/CLASSIFICAÇÃO]]</span>
<h1 class="piece-title">[[NOME DO OBJETO]]<br>[[DENOMINAÇÃO TÉCNICA]]</h1>
<p class="piece-sub">[[DESCRIÇÃO BREVE...]]</p>
```

**Exemplos:**
- **Aviação:** Categoria "Aviação Militar", Período "1968–1990", Tipo "Transporte Leve"
- **Armamento:** Categoria "Armamento e Mísseis", Período "1985–1994", Tipo "Míssil Solo-Ar"

---

### 2. Chips de Metadados (Meta-Chips)

Customize até 4 chips com informações importantes. Use ícones do [Lucide](https://lucide.dev/):

```html
<div class="mc">
  <i data-lucide="calendar" class="mc-icon"></i>
  <div>
    <span class="mc-l">Fabricação</span>
    <span class="mc-v">1972</span>
  </div>
</div>
```

**Ícones recomendados:**
- `calendar` — datas
- `map-pin` — localização
- `gauge` — velocidade/desempenho
- `move-horizontal` — dimensões
- `target` — alcance
- `radio` — comunicação/guiagem

---

### 3. Modelo 3D (model-viewer)

**Passo 1:** Localize o arquivo `.glb` no GitHub  
**Passo 2:** Converta a URL de `blob` para `raw`:

```
DE:   https://github.com/heglas/DCTA/blob/HASH/01.MAB/01.Acervo/ARQUIVO.glb
PARA: https://raw.githubusercontent.com/heglas/DCTA/HASH/01.MAB/01.Acervo/ARQUIVO.glb
```

**Passo 3:** Substitua no template:
```html
<model-viewer
  src="[[URL_RAW_GLB]]"
  alt="[[DESCRIÇÃO ALT DO MODELO 3D]]"
  ...>
```

**Nota:** Arquivos > 25 MB podem não ter URL raw. Use Google Drive, Sketchfab ou outro host.

---

### 4. Seções de Conteúdo

#### A) Contexto Histórico
```html
<h2>Contexto Histórico</h2>
<p>O <strong>Nome do Objeto</strong> foi...</p>
<p>Na <strong>Força Aérea Brasileira</strong>, operou...</p>
```

- **Parágrafo 1:** Origens, desenvolvimento, importância
- **Parágrafo 2:** Operação, impacto, eventos principais

#### B) Linha do Tempo
Preencha 5 eventos com ano/período e descrição:

```html
<div class="tl-item" role="listitem">
  <div class="tl-year">1968</div>
  <div class="tl-desc">Primeiro voo do protótipo...</div>
</div>
```

#### C) Especificações Técnicas
Customize 10 especificações em 2 colunas (5 linhas):

```html
<div class="spec">
  <div class="spec-l">Motores</div>
  <div class="spec-v">2× P&W Canada <small>PT6A-34</small></div>
</div>
```

#### D) Galeria Fotográfica
3 imagens com links públicos (Wikimedia, URL direta, etc.):

```html
<div class="gal-item" role="button" tabindex="0" aria-label="Ampliar foto: [[DESCRIÇÃO]]">
  <img src="[[URL_FOTO]]" alt="[[DESCRIÇÃO]]" width="400" height="300" loading="lazy">
</div>
```

---

### 5. Sidebar — Registro de Acervo

Customize 6 campos:

```html
<div class="pid-row">
  <span class="pid-l">Nº Tombamento</span>
  <span class="pid-v mono">MAB-1994-0017</span>
</div>
```

**Campos sugeridos:**
- Nº Tombamento / Identificação
- Categoria
- Subcategoria
- Conservação (com cor: green/red/orange)
- Localização / Origem
- Última vistoria / Incorporação / Data

---

### 6. QR Code

O template inclui um SVG genérico de QR code. Para gerar o QR code real:

1. Vá em: https://qr-code-generator.com/
2. Insira a URL do artigo (ex: `/index.php/acervo/embraer-emb-110`)
3. Customize tamanho: 110x110px
4. Customize cores: Fundo `#111520`, cor `#c8a84b` (gold) ou `#e53935` (red)
5. Copie o SVG gerado e substitua no template

---

## Badges Disponíveis

### Período Histórico
```html
<span class="badge badge-era">1968–1990</span>
```
Cor: Gold | Uso: Sempre incluir

### Categoria/Tipo
```html
<span class="badge badge-cat">Transporte Leve</span>
```
Cor: Blue | Uso: Sempre incluir

### Status Verde (Em Exposição)
```html
<span class="badge badge-ok">✦ Em exposição</span>
```
Cor: Green | Uso: Para itens ativos

### Status Vermelho (Projeto Encerrado, etc)
```html
<span class="badge badge-red">⬡ Projeto Encerrado</span>
```
Cor: Red | Uso: Para itens inativos/históricos

---

## Exemplo Prático Completo

### Passo 1: Duplicar o template
```
Acervo-Modelo-TEMPLATE.html → MAB_[SIGLA]_[NUM]@ACERVO.html
Exemplo: MAB_X_002_MAQUETE@ACERVO.html
```

### Passo 2: Preencher informações básicas
```html
<!-- Mudar de: -->
<span>[[CATEGORIA DO ACERVO]]</span>

<!-- Para: -->
<span>Aeronaves Experimentais</span>
```

### Passo 3: Adicionar conteúdo
```html
<!-- Mudar de: -->
<p>[[PARÁGRAFO 1: Descreva as origens...]]</p>

<!-- Para: -->
<p>O <strong>CTA-201 Ipanema</strong> foi o primeiro avião agrícola produzido em série no Brasil,
resultando da parceria entre o Centro Técnico Aeroespacial e a Empresa Brasileira de Aeronáutica.</p>
```

### Passo 4: Ajustar tema de cores (se necessário)
Se for armamento/míssil, customize o CSS para usar cores vermelhas.

### Passo 5: Validar no navegador
- [ ] Modelo 3D carrega?
- [ ] Galeria funciona (click, lightbox, ESC)?
- [ ] Animações de scroll funcionam?
- [ ] Responsivo em mobile?

---

## Checklist Final

- [ ] Nome e denominação técnica preenchidos
- [ ] Categoria, período e tipo corretos
- [ ] Descrição breve clara e concisa
- [ ] 4 meta-chips com ícones e valores
- [ ] URL do GLB convertida para raw
- [ ] 5 eventos na linha do tempo
- [ ] 10 especificações técnicas
- [ ] 3 imagens na galeria com descrições
- [ ] Sidebar com 6 informações de registro
- [ ] Tema de cores aplicado (azul/vermelho)
- [ ] QR code gerado e inserido
- [ ] Links funcionando
- [ ] Sem erros de console (inspecione no navegador)
- [ ] Responsivo em mobile (teste em diferentes tamanhos)

---

## Referências Úteis

- **Lucide Icons:** https://lucide.dev/
- **Model-viewer Docs:** https://modelviewer.dev/
- **GitHub Raw URLs:** `https://raw.githubusercontent.com/[user]/[repo]/[branch]/[path]`
- **QR Code Generator:** https://qr-code-generator.com/
- **Wikimedia Commons:** https://commons.wikimedia.org/ (fotos públicas)

---

## Suporte

Para dúvidas sobre estrutura, adicione comentários no arquivo ou consulte:
- `MAB_A_001_EMB01@ACERVO.html` (padrão com lightbox completo)
- `MAB_D_001_SMA1@ACERVO.html` (tema vermelho com funcionalidades completas)
