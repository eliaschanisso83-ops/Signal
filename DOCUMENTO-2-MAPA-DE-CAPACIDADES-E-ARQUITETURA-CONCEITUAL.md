# DOCUMENTO 2

## MAPA DE CAPACIDADES E ARQUITETURA CONCEITUAL

**Produto:** Software Discoverability Intelligence  
**Versão:** 1.0  
**Status:** Documento de definição conceitual  
**Relação:** Documento complementar ao Documento de Valor

---

# 1. OBJETIVO DESTE DOCUMENTO

O Documento de Valor definiu por que o produto deve existir.

Este documento define:

- o que o produto precisa ser capaz de fazer;
- quais capacidades formam o produto;
- como essas capacidades se relacionam;
- quais partes são commodities;
- onde existe espaço real de diferenciação;
- o que não deve ser construído inicialmente;
- qual conjunto mínimo pode formar o MVP;
- como o produto pode evoluir posteriormente.

Este documento não é ainda uma especificação técnica de implementação.

Também não é ainda o PRD do MVP.

Seu objetivo é estabelecer a arquitetura conceitual do produto, antes de decidir exatamente quais telas, APIs, bancos de dados ou tecnologias serão utilizados.

---

# 2. PRINCÍPIO CENTRAL

O produto não deve ser construído como:

> "Uma ferramenta que verifica se a IA recomenda seu software."

Isso já é insuficiente.

O mercado já possui ferramentas capazes de medir visibilidade em respostas de IA.

Por exemplo, soluções atuais já trabalham com:

- prompts;
- intents;
- recomendações;
- concorrentes;
- posição;
- sentimento;
- respostas brutas;
- fontes;
- fan-out queries;
- acompanhamento histórico.

O AppTweak, por exemplo, declara atualmente trabalhar com mais de 10.000 prompts e mais de 1.000 intents para descoberta de apps, além de comparação competitiva e análise das fontes utilizadas pelas respostas.

Portanto:

> **Medir visibilidade não pode ser o diferencial central.**

A pergunta mais importante passa a ser:

> **"O que conseguimos descobrir a partir dos dados de descoberta que outras ferramentas ainda não transformam suficientemente em inteligência acionável?"**

---

# 3. POSICIONAMENTO CONCEITUAL

## 3.1 Nome da categoria

Software Discoverability Intelligence

Categoria proposta:

> **Inteligência de Descoberta de Software**

O produto investiga como um software é encontrado, compreendido, sustentado por evidências, recomendado e convertido em uma opção real para o usuário.

---

# 4. MODELO FUNDAMENTAL

O produto deve organizar a descoberta em cinco etapas:

```text
FOUND
↓
UNDERSTOOD
↓
EVIDENCED
↓
RECOMMENDED
↓
CONVERTED
```

**FOUND**

O sistema consegue encontrar o software?

**UNDERSTOOD**

O sistema compreende corretamente o que o software faz?

**EVIDENCED**

Existem evidências suficientes e confiáveis que sustentam aquilo que o software afirma resolver?

**RECOMMENDED**

O software é considerado uma boa opção quando alguém procura uma solução?

**CONVERTED**

A recomendação consegue levar o usuário à próxima ação?

---

# 5. UNIDADE FUNDAMENTAL DO PRODUTO

A unidade fundamental não deve ser apenas:

> "keyword"

nem:

> "prompt"

nem:

> "app"

A unidade mais importante deve ser:

## INTENT

Uma intenção representa:

> "o que o usuário está tentando resolver ou alcançar."

Um mesmo intent pode ser expressado por dezenas ou centenas de prompts diferentes.

Exemplo conceitual:

**INTENT:**

"Encontrar uma ferramenta simples para controlar despesas de uma pequena empresa"

**PROMPTS:**

- Qual o melhor app para controlar despesas de uma pequena empresa?
- Existe algum software simples para registrar despesas?
- Que ferramenta posso usar para controlar os gastos do meu negócio?
- Qual aplicativo é bom para acompanhar despesas empresariais?

O produto deve agrupar essas manifestações em torno da necessidade real.

---

# 6. MAPA GERAL DE CAPACIDADES

A arquitetura conceitual inicial é:

```text
SOFTWARE DISCOVERABILITY INTELLIGENCE
│
├── 1. PRODUCT INTAKE
│
├── 2. INTENT ENGINE
│
├── 3. DISCOVERY ENGINE
│
├── 4. RECOMMENDATION INTELLIGENCE
│
├── 5. COMPETITOR INTELLIGENCE
│
├── 6. EVIDENCE INTELLIGENCE
│
├── 7. GAP ENGINE
│
├── 8. ACTION ENGINE
│
├── 9. MONITORING & HISTORY
│
└── 10. FORECAST & PRE-LAUNCH INTELLIGENCE
```

Essas dez áreas representam o mapa completo de capacidades.

Isso não significa que todas devem existir no MVP.

---

# 7. CAPACIDADE 1 — PRODUCT INTAKE

## Objetivo

Permitir que o sistema compreenda o software analisado.

## Entradas possíveis

Inicialmente:

- URL da App Store;
- URL do Google Play;
- URL do website;
- nome do produto;
- descrição do produto.

Posteriormente:

- SaaS;
- extensão;
- desktop software;
- API;
- produto B2B;
- ferramenta de desenvolvimento.

## O sistema deve extrair

**Identidade**

- nome;
- categoria;
- plataforma;
- desenvolvedor/empresa.

**Proposta**

- o que faz;
- para quem serve;
- problema resolvido;
- principais benefícios.

**Funcionalidades**

- funcionalidades principais;
- diferenciais declarados;
- limitações declaradas.

**Posicionamento**

- público;
- categoria;
- casos de uso;
- alternativas mencionadas.

**Evidências próprias**

- avaliações;
- screenshots;
- documentação;
- website;
- páginas de produto;
- casos de uso;
- artigos.

---

# 8. CAPACIDADE 2 — INTENT ENGINE

## Objetivo

Transformar o produto em um mapa de necessidades que ele potencialmente resolve.

O sistema deve perguntar:

> **"Em quais situações uma pessoa poderia procurar algo como este software?"**

## Estrutura conceitual

```text
Produto
↓
Problemas
↓
Necessidades
↓
Intents
↓
Prompts
```

## Exemplo

**PRODUTO**

Software de gestão financeira

**PROBLEMAS**

- dificuldade de controlar despesas
- falta de organização financeira
- dificuldade de acompanhar fluxo de caixa

**INTENTS**

- controlar despesas
- acompanhar fluxo de caixa
- organizar finanças empresariais

**PROMPTS**

- melhor app para controlar despesas
- ferramenta para fluxo de caixa
- software simples para pequenas empresas

## Funções possíveis

- geração de intents;
- agrupamento semântico;
- classificação;
- priorização;
- identificação de intents adjacentes;
- identificação de intents irrelevantes;
- expansão de prompts;
- localização por país/idioma;
- diferenciação entre intenção informacional e intenção comercial.

---

# 9. CAPACIDADE 3 — DISCOVERY ENGINE

## Objetivo

Investigar onde e como o software aparece quando usuários procuram soluções.

As fontes podem incluir:

- sistemas de IA;
- mecanismos de busca;
- lojas de aplicativos;
- websites;
- comunidades;
- fóruns;
- plataformas de conteúdo;
- reviews;
- comparações.

## Importante

O Discovery Engine não deve ser entendido como simplesmente:

> "fazer perguntas ao ChatGPT."

Ele deve funcionar como um sistema de observação de múltiplos ambientes de descoberta.

---

# 10. CAPACIDADE 4 — RECOMMENDATION INTELLIGENCE

## Objetivo

Medir e interpretar recomendações.

As perguntas fundamentais são:

- O software apareceu?
- Quantas vezes apareceu?
- Em quais intents?
- Em qual posição?
- Quais concorrentes apareceram?
- Como foi descrito?
- Em quais situações foi recomendado?
- Em quais situações deveria ter sido considerado, mas não apareceu?

## Métricas candidatas

**Recommendation Share**

Percentual das respostas relevantes em que o produto aparece.

**Recommendation Position**

Posição relativa dentro da recomendação.

**Recommendation Coverage**

Quantidade de intents relevantes nos quais o produto aparece.

**Recommendation Strength**

Combinação de:

- frequência;
- posição;
- relevância do intent;
- qualidade da caracterização.

---

# 11. CAPACIDADE 5 — COMPETITOR INTELLIGENCE

## Objetivo

Não basta saber:

> "Meu software aparece?"

É necessário saber:

> **"Quem está ocupando o espaço que eu poderia ocupar?"**

## O sistema deve identificar

- concorrentes diretos;
- concorrentes indiretos;
- alternativas;
- produtos substitutos;
- produtos frequentemente recomendados;
- produtos emergentes.

## Comparações

```text
INTENT
│
├── Produto analisado
├── Concorrente A
├── Concorrente B
├── Concorrente C
└── Alternativa D
```

## Opportunity Detection

Um dos sinais mais importantes:

```text
Concorrente aparece
+
Produto não aparece
+
Intent é relevante
=
OPORTUNIDADE
```

Mas isso deve ser tratado como:

> "sinal de oportunidade"

e não como prova de que determinada alteração fará o produto aparecer.

---

# 12. CAPACIDADE 6 — EVIDENCE INTELLIGENCE

Esta é uma das áreas potencialmente mais importantes do produto.

## Pergunta central

> **"Por que o sistema de descoberta tem informação suficiente para recomendar um produto?"**

Uma recomendação não nasce necessariamente apenas do produto.

Ela pode ser influenciada por:

- página oficial;
- loja de aplicativos;
- reviews;
- artigos;
- Reddit;
- fóruns;
- comparações;
- YouTube;
- documentação;
- websites especializados;
- outras fontes indexadas.

---

# 13. EVIDENCE GRAPH

O produto deve evoluir para um modelo de relações:

```text
INTENT
│
├── PRODUCT
│
├── COMPETITORS
│
├── SOURCES
│   ├── Website
│   ├── App Store
│   ├── Google Play
│   ├── Reddit
│   ├── Articles
│   ├── YouTube
│   └── Other
│
├── CLAIMS
│
├── FEATURES
│
└── RECOMMENDATIONS
```

Isso cria o conceito de:

## EVIDENCE GRAPH

O Evidence Graph representa a relação entre:

> **"necessidade → produto → afirmação → evidência → recomendação."**

---

# 14. EVIDENCE GAP

O sistema deve procurar situações como:

```text
INTENT:
"melhor ferramenta simples para X"

CONCORRENTE A
↓
Website explica X
↓
Reviews mencionam X
↓
Artigos mencionam X
↓
Comunidade discute X
↓
AI recomenda A

PRODUTO
↓
Website fala genericamente
↓
Poucas evidências externas
↓
AI raramente recomenda
```

O resultado não deve ser:

> "A falta de Reddit causou a perda."

Isso seria metodologicamente fraco.

O resultado deve ser:

> **"Existe uma diferença de evidência observável entre os produtos para este intent. Essa diferença é uma hipótese de explicação que merece investigação."**

---

# 15. PRINCÍPIO DE CAUSALIDADE

Esta regra deve ser incorporada ao produto desde o início.

O produto deve separar:

**OBSERVAÇÃO**

O que foi observado diretamente.

**EVIDÊNCIA**

Quais dados sustentam a observação.

**HIPÓTESE**

Qual explicação é plausível.

**AÇÃO**

O que vale a pena testar.

## Exemplo

**Observação**

O concorrente aparece em 42% dos prompts de determinado intent.

**Evidência**

O concorrente possui:

- páginas específicas;
- várias reviews;
- artigos externos;
- menções comunitárias.

**Hipótese**

A maior disponibilidade de informação relevante pode estar contribuindo para sua maior presença.

**Ação**

Criar ou fortalecer evidências específicas relacionadas ao intent.

---

# 16. CAPACIDADE 7 — GAP ENGINE

O Gap Engine transforma observações em lacunas.

Tipos de gap:

**Discovery Gap**

O produto não aparece.

**Intent Gap**

O produto não cobre determinadas necessidades.

**Semantic Gap**

O sistema não parece associar corretamente o produto à necessidade.

**Competitive Gap**

Concorrentes aparecem onde o produto não aparece.

**Evidence Gap**

Existem diferenças relevantes nas evidências disponíveis.

**Positioning Gap**

O produto aparece, mas é descrito de maneira inadequada.

**Source Gap**

O produto não está presente em fontes importantes para determinado contexto.

**Conversion Gap**

O produto é recomendado, mas a próxima etapa não apresenta uma experiência suficientemente convincente.

---

# 17. CAPACIDADE 8 — ACTION ENGINE

Esta camada transforma inteligência em decisão.

O sistema não deve produzir simplesmente:

> "Você precisa melhorar seu SEO."

Isso é genérico.

Deve produzir algo semelhante a:

```text
PROBLEMA
O produto aparece pouco no intent X.

EVIDÊNCIA
Concorrentes A e B aparecem frequentemente.

DIFERENÇA
A e B possuem fontes específicas relacionadas a X.
Seu produto possui poucas evidências diretamente relacionadas.

HIPÓTESE
Seu posicionamento para X pode estar sub-representado.

AÇÃO SUGERIDA
Criar uma página/conteúdo específico sobre X,
reforçando claramente a relação entre o problema e a funcionalidade Y.

PRIORIDADE
ALTA

VALIDAÇÃO
Monitorar o comportamento do intent após a alteração.
```

---

# 18. PRIORIZAÇÃO DE AÇÕES

Nem todo gap merece ser corrigido.

Cada oportunidade pode receber uma pontuação conceitual:

```text
PRIORIDADE =
Impacto potencial
×
Relevância do intent
×
Tamanho do gap
×
Confiança da evidência
÷
Custo estimado
```

Não é necessário implementar exatamente essa fórmula no início.

O princípio é:

> **"O produto deve ajudar o usuário a decidir o que fazer primeiro."**

---

# 19. CAPACIDADE 9 — MONITORING & HISTORY

Depois do diagnóstico inicial, surge uma necessidade natural:

> **"O que mudou?"**

O sistema pode acompanhar:

- Recommendation Share;
- intents;
- posição;
- concorrentes;
- sentimento/caracterização;
- fontes;
- evidence gaps;
- alterações no produto;
- alterações no website;
- alterações na loja;
- mudanças na presença externa.

---

# 20. CHANGE → DISCOVERY

Uma capacidade especialmente interessante é relacionar:

```text
ALTERAÇÃO
↓
PERÍODO DE OBSERVAÇÃO
↓
MUDANÇA DE DESCOBERTA
```

Exemplo:

```text
10/10
Nova página publicada

↓

17/10
Intent X começa a apresentar maior presença

↓

24/10
Produto aparece com maior frequência
```

Isso ainda não prova causalidade.

Mas permite:

> **"experimentos de discoverability."**

---

# 21. CAPACIDADE 10 — DISCOVERABILITY FORECAST

Esta é uma capacidade de longo prazo.

Pergunta:

> **"Antes de lançar, qual é a probabilidade de este produto ser descoberto e compreendido?"**

O sistema receberia:

- descrição;
- proposta;
- funcionalidades;
- público;
- categoria;
- concorrentes;
- mercado;
- país;
- plataforma.

E produziria:

```text
DISCOVERABILITY FORECAST

Problema reconhecido: ALTO
Clareza semântica: MÉDIA
Diferenciação: BAIXA
Cobertura de intents: MÉDIA
Competição: ALTA
Evidência externa: BAIXA
Potencial de recomendação: MÉDIO
```

---

# 22. PRÉ-LANÇAMENTO

O produto poderia então responder:

> **"Este software está sendo construído para resolver um problema que as pessoas realmente procuram?"**

e:

> **"Se for lançado exatamente como está descrito, haverá sinais suficientes para que mecanismos de descoberta o compreendam?"**

Isso transforma a ferramenta de:

**analytics pós-lançamento**

em:

**intelligence pré-produto.**

---

# 23. O QUE É COMMODITY

Estas funcionalidades não devem ser tratadas como grande diferencial:

| Capacidade | Avaliação |
|---|---|
| Monitorar prompts | Commodity |
| Mostrar resposta da IA | Commodity |
| Mostrar concorrentes | Commodity |
| Mostrar posição | Commodity |
| Mostrar sentimento | Commodity |
| Histórico básico | Commodity |
| Gerar prompts | Commodity |
| Sugestões de keywords | Commodity |
| Gerar descrição | Commodity |
| Recomendar alterações genéricas | Commodity |

Isso não significa que não devam existir.

Significa:

> **"Não devemos construir nossa identidade em torno delas."**

---

# 24. ONDE PODE ESTAR A DIFERENCIAÇÃO

| Capacidade | Potencial |
|---|---|
| Evidence Graph | Muito alto |
| Evidence Gap | Alto |
| Cross-source intelligence | Muito alto |
| Explicação de recomendações | Muito alto |
| Intent-level competitive intelligence | Alto |
| Discoverability experiments | Alto |
| Histórico contextual | Alto |
| Pre-launch Discoverability Forecast | Muito alto |
| Discovery → Conversion loop | Muito alto |
| Recommendation measurement | Médio |
| AI visibility pura | Baixo |
| ASO pura | Baixo |

---

# 25. ARQUITETURA CONCEITUAL DO SISTEMA

A arquitetura pode ser representada assim:

```text
                    INPUT LAYER
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       App Store      Google Play     Website
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                  PRODUCT INTAKE
                         ↓
                    NORMALIZATION
                         ↓
                    INTENT ENGINE
                         ↓
                 PROMPT GENERATION
                         ↓
                 DISCOVERY ENGINE
                         ↓
        ┌────────────────┼────────────────┐
        │                │                │
       AI             Search          Communities
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                 OBSERVATION LAYER
                         ↓
                EVIDENCE EXTRACTION
                         ↓
                  EVIDENCE GRAPH
                         ↓
                  ANALYSIS ENGINE
                         ↓
       ┌─────────────────┼──────────────────┐
       │                 │                  │
Recommendation      Competitor            Gap
 Intelligence       Intelligence         Engine
       │                 │                  │
       └─────────────────┼──────────────────┘
                         ↓
                    ACTION ENGINE
                         ↓
              PRIORITIZED OPPORTUNITIES
                         ↓
             REPORT / DASHBOARD / API
                         ↓
                  MONITORING
                         ↓
                    HISTORY
```

---

# 26. UMA REGRA ARQUITETURAL IMPORTANTE

O sistema não deve depender de um único modelo de IA.

A arquitetura deve separar:

```text
DATA COLLECTION
≠
AI INTERPRETATION
≠
BUSINESS LOGIC
```

Por exemplo:

```text
Coleta
↓
Dados brutos
↓
Normalização
↓
Análise
↓
Interpretação
↓
Recomendação
```

Isso permite trocar modelos posteriormente sem reconstruir o produto inteiro.

---

# 27. O MVP NÃO DEVE IMPLEMENTAR TUDO

A maior ameaça ao produto seria tentar construir:

- monitoramento;
- API;
- dashboard completo;
- extensão;
- integrações;
- forecast;
- Evidence Graph completo;
- múltiplos países;
- múltiplas plataformas;
- automações;
- publicação automática;

tudo ao mesmo tempo.

Isso aumentaria brutalmente o custo antes de provar a hipótese central.

---

# 28. MVP PROPOSTO

O MVP deve responder uma única pergunta:

> **"Conseguimos produzir uma análise de discoverability que um proprietário de software considera suficientemente útil para pagar por ela?"**

---

# 29. MVP — DISCOVERABILITY AUDIT

## Entrada

O usuário fornece:

- URL do produto;
- plataforma;
- país;
- idioma;
- categoria;
- até 3–5 concorrentes opcionais.

## Processo

```text
1. Ler produto
↓
2. Compreender posicionamento
↓
3. Gerar intents
↓
4. Gerar conjunto controlado de prompts
↓
5. Executar descoberta
↓
6. Identificar recomendações
↓
7. Identificar concorrentes
↓
8. Extrair fontes
↓
9. Identificar gaps
↓
10. Priorizar ações
↓
11. Produzir relatório
```

---

# 30. SAÍDA DO MVP

O relatório deve conter:

**1. Discoverability Score**

Resumo geral.

**2. Intent Coverage**

Onde o produto aparece.

**3. Recommendation Landscape**

Quem está sendo recomendado.

**4. Competitive Gaps**

Onde concorrentes aparecem e o produto não.

**5. Evidence Landscape**

Quais fontes sustentam as recomendações.

**6. Evidence Gaps**

Onde existem diferenças relevantes.

**7. Positioning Analysis**

Como o produto está sendo descrito.

**8. Top Opportunities**

As oportunidades mais importantes.

**9. Recommended Actions**

As 5–10 ações prioritárias.

---

# 31. O QUE O MVP NÃO PRECISA TER

Inicialmente não precisamos de:

- app mobile;
- extensão de navegador;
- API pública;
- white-label;
- dezenas de integrações;
- automação de publicação;
- centenas de dashboards;
- dezenas de métricas;
- suporte a todos os países;
- todos os mecanismos de IA.

O objetivo inicial é provar:

> **INTELLIGENCE → DECISION VALUE**

---

# 32. POSSÍVEL FUNIL COMERCIAL

```text
FREE
↓
Mini Discoverability Check
↓
Score + 2 oportunidades
↓
PAY
↓
Full Discoverability Audit
↓
Monitor
↓
Professional
↓
Agency / Enterprise
```

---

# 33. PRODUTO PÓS-MVP

Depois da validação:

```text
MVP
│
└── Discoverability Audit
        ↓
    Monitoring
        ↓
    Historical Intelligence
        ↓
    Experiment Tracking
        ↓
    Evidence Graph
        ↓
    Discoverability Forecast
        ↓
    API / Agency Platform
```

---

# 34. POSSÍVEL EVOLUÇÃO DO PRODUTO

**Fase 1 — Audit**

"Como meu software é descoberto hoje?"

**Fase 2 — Monitor**

"O que está mudando?"

**Fase 3 — Intelligence**

"Por que isso está acontecendo?"

**Fase 4 — Action**

"O que devo fazer?"

**Fase 5 — Experiment**

"O que aconteceu depois que fiz?"

**Fase 6 — Forecast**

"O que provavelmente acontecerá antes de eu lançar?"

---

# 35. O VERDADEIRO ATIVO DO PRODUTO

O maior ativo não deve ser apenas o dashboard.

Deve ser o dataset histórico:

```text
Intent
+
Prompt
+
Produto
+
Concorrente
+
Resposta
+
Posição
+
Fonte
+
Evidência
+
Data
+
Mercado
+
Alteração
+
Resultado
```

Com o tempo, isso pode formar uma base proprietária sobre:

> **"como software é descoberto e recomendado."**

---

# 36. POSSÍVEL MOAT

O moat não seria:

> "Temos IA."

Isso é facilmente replicável.

Também não seria:

> "Temos muitos prompts."

Concorrentes já possuem grandes conjuntos de prompts. O AppTweak, por exemplo, já declara mais de 10.000 prompts específicos para descoberta de apps.

O moat potencial seria:

**1. Histórico**

Como a descoberta mudou ao longo do tempo.

**2. Relações**

Como intents, produtos, fontes e recomendações se relacionam.

**3. Evidência**

Quais sinais aparecem associados a determinados resultados.

**4. Contexto**

País, idioma, categoria, plataforma e momento.

**5. Experimentos**

O que aconteceu depois de mudanças reais.

**6. Forecast**

Capacidade de utilizar o histórico para avaliar produtos antes do lançamento.

---

# 37. CRITÉRIO PARA ACEITAR UMA NOVA FUNCIONALIDADE

Toda nova funcionalidade deve responder:

**Pergunta 1**

Ela melhora a capacidade de descobrir?

**Pergunta 2**

Ela melhora a capacidade de explicar?

**Pergunta 3**

Ela melhora a capacidade de decidir?

**Pergunta 4**

Ela cria dados proprietários?

**Pergunta 5**

Ela aumenta o valor do histórico?

**Pergunta 6**

Ela aumenta a dificuldade de copiar o produto?

Se a resposta for "não" para praticamente todas:

> **"não construir."**

---

# 38. CRITÉRIO DE PRIORIZAÇÃO

Cada funcionalidade pode ser avaliada por:

```text
VALOR PARA O CLIENTE
+
DIFERENCIAÇÃO
+
DIFICULDADE DE COPIAR
+
DADOS GERADOS
+
POTENCIAL DE MONETIZAÇÃO
-
COMPLEXIDADE
-
DEPENDÊNCIA EXTERNA
```

Isso evita transformar o produto em uma coleção de funcionalidades.

---

# 39. O QUE NÃO DEVEMOS CONSTRUIR COMO PRIMEIRO PRODUTO

Não construir:

**"AppTweak barato"**

Posicionamento fraco.

**"AI Visibility Checker"**

Categoria já estabelecida.

**"Gerador de prompts"**

Facilmente copiável.

**"Gerador de ASO com IA"**

Mercado saturado.

**"Ferramenta que diz o que publicar"**

Valor limitado se não explicar o porquê.

**"Dashboard de 50 métricas"**

Complexidade sem necessariamente criar valor.

---

# 40. HIPÓTESE ESTRATÉGICA

A hipótese que merece ser testada é:

> **"Profissionais e proprietários de software não precisam apenas saber se aparecem em mecanismos de descoberta. Eles precisam entender por que aparecem, por que concorrentes aparecem em seu lugar, quais evidências sustentam essas recomendações e quais ações têm maior potencial de melhorar sua descoberta."**

Essa é uma hipótese.

Não deve ser tratada como fato antes da validação com usuários.

---

# 41. HIPÓTESE DE PRODUTO

O MVP deverá testar:

> **"Um relatório de Discoverability Intelligence, baseado em intents, recomendações, concorrentes e evidências, consegue gerar decisões mais úteis do que um simples relatório de AI Visibility?"**

Se sim:

→ continuar.

Se parcialmente:

→ ajustar a metodologia.

Se não:

→ reconsiderar o posicionamento antes de construir a plataforma.

---

# 42. HIPÓTESE DE MERCADO

O primeiro cliente ideal provavelmente não é:

> "uma pessoa que ainda nem lançou seu software."

Esse usuário possui problema potencial, mas pouca capacidade ou disposição para pagar.

O alvo inicial mais lógico é:

> **"software já lançado, com algum tráfego/downloads/usuários, mas sem uma equipe dedicada de growth/discovery."**

Esse cliente já possui algo a perder e algo a melhorar.

---

# 43. PRIMEIRO SEGMENTO A VALIDAR

Prioridade conceitual:

1. Indie / micro publishers
2. Pequenas empresas de software
3. Agências ASO / growth
4. Pequenos SaaS
5. Studios de jogos
6. Empresas maiores

Não significa que esse será definitivamente o mercado final.

É apenas a ordem mais racional para testar a hipótese.

---

# 44. MODELO DE VALOR

O cliente não compra:

> "prompts."

Não compra:

> "IA."

Não compra:

> "dashboard."

Não compra:

> "métricas."

Compra:

## REDUÇÃO DA INCERTEZA

A ferramenta deve ajudá-lo a responder:

> **"Por que meu software não está sendo descoberto?"**

> **"Quem está ganhando esse espaço?"**

> **"O que esses concorrentes têm que eu não tenho?"**

> **"Quais evidências estão sustentando essas recomendações?"**

> **"Qual é o maior gap?"**

> **"O que devo testar primeiro?"**

---

# 45. FRASE CENTRAL DO PRODUTO

> **"DESCUBRA POR QUE SEU SOFTWARE É — OU NÃO É — DESCOBERTO."**

Essa frase permanece compatível com toda a arquitetura proposta.

---

# 46. ARQUITETURA FINAL DE VALOR

A arquitetura completa pode ser resumida em:

```text
              SOFTWARE
                  ↓
             INTENTS
                  ↓
              PROMPTS
                  ↓
             DISCOVERY
                  ↓
          RECOMMENDATIONS
                  ↓
       ┌──────────┴──────────┐
       ↓                     ↓
 COMPETITORS              SOURCES
       ↓                     ↓
       └──────────┬──────────┘
                  ↓
            EVIDENCE GRAPH
                  ↓
              GAPS
                  ↓
          INTERPRETATION
                  ↓
             ACTIONS
                  ↓
            EXPERIMENTS
                  ↓
              RESULTS
                  ↓
              HISTORY
                  ↓
              FORECAST
```

---

# 47. VISÃO DE LONGO PRAZO

O produto começa perguntando:

> "Você é descoberto?"

Depois:

> "Onde você é descoberto?"

Depois:

> "Em quais necessidades?"

Depois:

> "Quem aparece em seu lugar?"

Depois:

> "Por que isso pode estar acontecendo?"

Depois:

> "Que evidências sustentam essa diferença?"

Depois:

> "O que você deveria testar?"

Depois:

> "O que aconteceu depois?"

Finalmente:

> **"Antes mesmo de lançar, qual é a capacidade de descoberta deste produto?"**

Essa evolução representa a transformação de:

**monitoramento**

em:

**inteligência.**

---

# 48. CONCLUSÃO

O produto não deve competir simplesmente pela quantidade de prompts, modelos de IA ou métricas.

O espaço estratégico está em transformar dados fragmentados de descoberta em uma explicação coerente sobre:

```text
NECESSIDADE
↓
DESCOBERTA
↓
RECOMENDAÇÃO
↓
EVIDÊNCIA
↓
CONCORRÊNCIA
↓
GAP
↓
AÇÃO
↓
RESULTADO
```

O produto deve ser construído para responder não apenas:

> "O que aconteceu?"

mas:

> **"O que podemos observar?"**

> **"Que evidências temos?"**

> **"Qual é a hipótese mais plausível?"**

> **"O que vale a pena testar?"**

E, posteriormente:

> **"O que aprendemos com o resultado?"**

---

# 49. DECISÃO DESTA VERSÃO

## Construir primeiro

**Discoverability Audit**

com:

- Product Intake;
- Intent Engine;
- Discovery Analysis;
- Recommendation Intelligence;
- Competitor Intelligence;
- Evidence Intelligence;
- Gap Detection;
- Action Prioritization;
- relatório acionável.

## Construir depois

- Monitoring;
- histórico;
- experimentos;
- Evidence Graph avançado;
- integrações;
- API;
- agência/white-label.

## Construir posteriormente

- Discoverability Forecast;
- pre-launch intelligence;
- modelos preditivos;
- intelligence baseada em histórico proprietário.

## Não priorizar

- competir por volume de prompts;
- competir apenas por AI Visibility;
- gerador genérico de ASO;
- dashboard excessivamente complexo;
- automação de publicação como proposta central.

---

# 50. PRÓXIMO DOCUMENTO

Com este mapa definido, o próximo passo lógico é:

## DOCUMENTO 3 — METODOLOGIA DE DISCOVERABILITY INTELLIGENCE

Esse documento deverá definir como o produto mede e calcula cada coisa.

Ele deverá responder, por exemplo:

- O que exatamente é um intent?
- Como um intent é criado?
- Como um prompt é selecionado?
- Quantos prompts são necessários?
- Como medir Recommendation Share?
- Como calcular Position?
- Como medir Coverage?
- Como comparar concorrentes?
- Como identificar Evidence Gap?
- Como avaliar a qualidade de uma fonte?
- Como separar observação de hipótese?
- Como calcular confiança?
- Como evitar resultados enganadores?
- Como tratar variações das respostas de IA?
- Como tratar mudanças de modelo?
- Como comparar países e idiomas?
- Como definir um Discoverability Score?
- Como determinar uma oportunidade de alta prioridade?

Esse documento será particularmente importante porque a metodologia poderá se tornar parte do verdadeiro diferencial do produto, enquanto a interface e boa parte da infraestrutura poderão ser reproduzidas por concorrentes.
