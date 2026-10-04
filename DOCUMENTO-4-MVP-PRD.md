# DOCUMENTO 4

## MVP / PRD — SOFTWARE DISCOVERABILITY INTELLIGENCE

**Produto:** Software Discoverability Intelligence  
**Versão:** 1.0  
**Status:** PRD conceitual do MVP  
**Base:** Documentos 1, 2 e 3

---

# 1. OBJETIVO DO MVP

O objetivo do MVP não é construir a plataforma completa de Software Discoverability Intelligence.

O objetivo é provar uma hipótese:

> "Um proprietário de software consegue obter decisões significativamente úteis ao entender como seu produto é descoberto, recomendado, comparado e sustentado por evidências."

O MVP deverá responder:

> **"Consigo transformar dados de descoberta em um diagnóstico pelo qual alguém estaria disposto a pagar?"**

---

# 2. O QUE O MVP É

O MVP será inicialmente um:

## DISCOVERABILITY AUDIT

Um sistema que recebe um software e produz uma análise estruturada sobre sua capacidade de ser descoberto.

Fluxo:

```text
PRODUTO
↓
INTENTS
↓
PROMPTS
↓
DISCOVERY
↓
RECOMMENDATIONS
↓
COMPETITORS
↓
EVIDENCE
↓
GAPS
↓
ACTIONS
↓
AUDIT REPORT
```

---

# 3. O QUE O MVP NÃO É

O MVP não será inicialmente:

- uma plataforma completa de ASO;
- um concorrente direto de AppTweak;
- um gerador de metadata;
- um gerador de prompts;
- uma plataforma de publicação;
- um CRM;
- uma ferramenta de analytics tradicional;
- um sistema de automação de conteúdo;
- um marketplace;
- uma agência automatizada;
- uma previsão garantida de recomendações de IA.

---

# 4. USUÁRIO-ALVO INICIAL

O primeiro público a testar é:

**Prioridade 1**

Indie / micro-publisher com software já lançado

Características:

- possui um ou mais produtos;
- já lançou;
- possui algum tráfego, downloads ou usuários;
- não possui grande equipe de marketing;
- quer aumentar descoberta;
- não sabe exatamente por que concorrentes aparecem mais.

**Prioridade 2**

Pequenas empresas de software / SaaS

**Prioridade 3**

Agências ASO / Growth

Esse segmento pode posteriormente tornar-se um dos clientes mais valiosos porque pode utilizar a ferramenta para vários produtos.

---

# 5. PROBLEMA DO USUÁRIO

O usuário normalmente consegue descobrir:

> "quantos downloads possui."

Consegue descobrir:

> "algumas keywords."

Consegue observar:

> "algumas avaliações."

Mas tem dificuldade para responder:

> **"Quando alguém procura uma solução como a minha, quem é recomendado?"**

E principalmente:

> **"Por que meu concorrente está sendo considerado e eu não?"**

---

# 6. JOB TO BE DONE

O trabalho principal do produto é:

> **"Quando eu estiver tentando aumentar a descoberta do meu software, quero entender onde estou perdendo oportunidades e quais ações devo investigar primeiro."**

---

# 7. PROPOSTA DE VALOR DO MVP

**Entrada**

Um software.

**Saída**

Um diagnóstico de discoverability.

**Valor**

Transformar observações dispersas em:

- prioridades;
- hipóteses;
- oportunidades;
- ações.

---

# 8. FLUXO PRINCIPAL

```text
Landing Page
↓
Start Audit
↓
Product URL
↓
Product Analysis
↓
Intent Generation
↓
Intent Review
↓
Discovery Analysis
↓
Competitive Analysis
↓
Evidence Analysis
↓
Gap Detection
↓
Prioritization
↓
Audit Report
```

---

# 9. ETAPA 1 — PRODUCT INPUT

O usuário informa:

**Obrigatório**

- URL do produto.

**Opcional**

- nome;
- categoria;
- país;
- idioma;
- concorrentes;
- público-alvo.

---

# 10. TIPOS DE URL

O MVP pode aceitar inicialmente:

- Google Play;
- Apple App Store;
- website;
- página de produto SaaS.

Não é necessário suportar todas as plataformas no primeiro dia.

A primeira implementação deve escolher um conjunto controlado.

---

# 11. PRODUCT INTAKE

O sistema coleta:

- nome;
- descrição;
- categoria;
- funcionalidades;
- público;
- proposta;
- posicionamento;
- links;
- informações disponíveis.

Resultado:

**PRODUCT PROFILE**

---

# 12. PRODUCT PROFILE

Exemplo conceitual:

```text
Nome:
Produto X

Categoria:
Finanças

Público:
Pequenas empresas

Problema principal:
Controle financeiro

Principais funcionalidades:
- despesas
- receitas
- relatórios

Proposta:
Gestão financeira simples para pequenas empresas
```

---

# 13. ETAPA 2 — INTENT GENERATION

O sistema gera um primeiro conjunto de intents.

Exemplo:

1. controlar despesas
2. acompanhar fluxo de caixa
3. organizar finanças empresariais
4. registrar receitas
5. controlar pequenos negócios

---

# 14. REVISÃO DOS INTENTS

O usuário deve poder:

- aceitar;
- remover;
- editar;
- adicionar.

Isso é importante porque a IA pode gerar intents semanticamente relacionados, mas comercialmente irrelevantes.

---

# 15. LIMITE DO MVP

O MVP deve evitar uma árvore infinita de intents.

Sugestão inicial:

**10–20 intents prioritários.**

A quantidade deverá ser ajustada depois com dados reais de uso e custo.

---

# 16. PRIORIZAÇÃO DE INTENTS

O sistema pode sugerir:

**Alta prioridade**

Problema central + forte relação comercial.

**Média**

Caso de uso relevante.

**Baixa**

Relação secundária.

O usuário poderá alterar essa classificação.

---

# 17. ETAPA 3 — PROMPT GENERATION

Para cada intent:

**5–10 prompts**

Exemplo:

**INTENT:**

Controlar despesas de pequenas empresas

**PROMPTS:**

1. Qual o melhor app para controlar despesas de uma pequena empresa?
2. Que software posso usar para acompanhar gastos empresariais?
3. Existe uma ferramenta simples para registrar despesas de um negócio?
4. Qual aplicativo ajuda pequenos negócios a controlar gastos?
5. Como posso organizar as despesas da minha pequena empresa?

---

# 18. CONTROLE DE QUALIDADE DOS PROMPTS

O sistema deve verificar:

- duplicação;
- relevância;
- diversidade;
- linguagem natural;
- intenção comercial;
- contexto.

Prompts praticamente idênticos não devem ser tratados como evidências independentes.

---

# 19. ETAPA 4 — DISCOVERY EXECUTION

O sistema executa os prompts nos ambientes suportados.

Cada execução gera:

**Snapshot**

Contendo:

- prompt;
- data;
- modelo/sistema;
- mercado;
- idioma;
- resposta;
- produtos encontrados;
- posição;
- fontes.

---

# 20. PRINCÍPIO DE REPRODUTIBILIDADE

Cada auditoria deve registrar exatamente:

> **"o que foi perguntado, onde, quando e qual resposta foi obtida."**

Isso permite auditoria posterior.

---

# 21. ETAPA 5 — RECOMMENDATION CLASSIFICATION

O sistema classifica cada ocorrência do produto.

**Recomendação**

Produto indicado como solução.

**Alternativa**

Produto apresentado como opção secundária.

**Comparação**

Produto aparece em comparação.

**Menção**

Produto citado sem recomendação clara.

**Negativo**

Produto mencionado negativamente.

**Irrelevante**

Menção incidental.

---

# 22. MÉTRICAS DO MVP

O MVP deve começar com poucas métricas.

**1. Recommendation Share**

Percentual de respostas relevantes em que o produto foi recomendado.

**2. Intent Coverage**

Percentual dos intents relevantes em que o produto apareceu.

**3. Average Position**

Posição média quando o produto foi recomendado.

**4. Competitive Gap**

Diferença entre o produto e concorrentes.

**5. Evidence Coverage**

Cobertura de evidências relevantes.

**6. Discoverability Score**

Score agregado experimental.

---

# 23. NÃO EXAGERAR NAS MÉTRICAS

O MVP não deve possuir 30–50 métricas.

O usuário precisa entender:

> **"onde está o problema e o que fazer."**

Não estudar estatística para interpretar o produto.

---

# 24. DASHBOARD PRINCIPAL

A primeira tela do relatório deve mostrar:

```text
DISCOVERABILITY
72 / 100

Recommendation Share
24%

Intent Coverage
61%

Competitive Position
3 / 7

Evidence Coverage
48%

Confidence
MEDIUM
```

Os números devem ser acompanhados de explicações.

---

# 25. INTENT LANDSCAPE

Uma seção deve mostrar:

| Intent | Presença | Concorrente líder | Gap |
|---|---|---|---|
| Controlar despesas | Alta | Produto X | Baixo |
| Fluxo de caixa | Média | Produto Y | Médio |
| Relatórios | Baixa | Produto Z | Alto |
| Gestão de pequenos negócios | Baixa | Produto X | Alto |

O objetivo é revelar:

> **"onde existe oportunidade."**

---

# 26. COMPETITIVE LANDSCAPE

Para cada concorrente:

- Produto
- Recommendation Share
- Coverage
- Position
- Principais intents
- Principais caracterizações
- Fontes recorrentes

O usuário deve conseguir entender:

> **"Quem está ocupando o espaço que eu quero ocupar?"**

---

# 27. EVIDENCE LANDSCAPE

Mostrar:

**Fontes próprias**

- website;
- loja;
- documentação.

**Fontes externas**

- artigos;
- reviews;
- comunidades;
- vídeos;
- comparações.

---

# 28. EVIDENCE GAP

Exemplo:

```text
INTENT:
Fluxo de caixa

CONCORRENTE A
██████████
Forte evidência

PRODUTO
████
Evidência limitada
```

Depois:

> **"Gap detectado: Alto"**

E explicar por quê.

---

# 29. NÃO DIZER "A IA USA ESTA FONTE"

O relatório deve usar linguagem metodologicamente correta:

> **"Esta fonte aparece associada às respostas observadas."**

Não:

> "Esta fonte fez a IA recomendar o concorrente."

---

# 30. CHARACTERIZATION ANALYSIS

O relatório deve mostrar como o produto está sendo descrito.

Exemplo:

**Produto:**

- simples
- acessível
- básico
- pequeno negócio

**Concorrente:**

- profissional
- completo
- poderoso
- integrado

Isso pode revelar um problema de posicionamento.

---

# 31. SEMANTIC ALIGNMENT

O relatório deve comparar:

**O que o produto diz ser**

versus

**Como é descrito nas respostas observadas.**

Exemplo:

```text
POSICIONAMENTO DESEJADO
"gestão financeira para pequenas empresas"

CARACTERIZAÇÃO OBSERVADA
"app de controle de gastos pessoais"
```

Resultado:

> **"Potential Semantic Gap"**

---

# 32. TOP OPPORTUNITIES

Esta deve ser uma das partes mais importantes do relatório.

Exemplo:

```text
#1 — Fluxo de caixa
Prioridade: ALTA

Por quê?
- Intent altamente relevante
- Concorrente domina
- Produto aparece pouco
- Evidência específica limitada

Ação sugerida:
Investigar reforço da associação entre produto e fluxo de caixa.
```

---

# 33. ACTION CARD

Cada oportunidade deve possuir:

**Problema**

O que foi observado.

**Evidência**

Dados que sustentam a observação.

**Hipótese**

Possível explicação.

**Ação**

O que testar.

**Prioridade**

Alta / Média / Baixa.

**Confiança**

Alta / Média / Baixa.

---

# 34. RELATÓRIO FINAL

Estrutura:

1. Executive Summary
2. Discoverability Score
3. Intent Coverage
4. Recommendation Landscape
5. Competitive Landscape
6. Semantic Alignment
7. Evidence Landscape
8. Evidence Gaps
9. Top Opportunities
10. Recommended Actions
11. Methodology
12. Raw Evidence

---

# 35. EXECUTIVE SUMMARY

O resumo deve responder em poucos segundos:

- Como estamos?
- Onde perdemos?
- Quem ganha?
- Por quê?
- O que devemos investigar?

---

# 36. RAW EVIDENCE

O usuário deve poder abrir uma conclusão e chegar aos dados originais.

Exemplo:

```text
Opportunity #1
↓
Intent
↓
Prompts
↓
Respostas
↓
Produtos
↓
Fontes
```

Isso cria confiança.

---

# 37. EXPERIÊNCIA DO USUÁRIO

O produto deve ser orientado a:

> **"diagnóstico → explicação → ação"**

Não:

> "dashboard → dashboard → dashboard."

---

# 38. FLUXO DE INTERFACE

```text
HOME
│
├── New Audit
│
├── Previous Audits
│
└── Account

Ao criar:

NEW AUDIT
↓
PRODUCT
↓
MARKET
↓
INTENTS
↓
RUN

Depois:

AUDIT REPORT
│
├── Overview
├── Intents
├── Competitors
├── Evidence
├── Opportunities
└── Methodology
```

---

# 39. ESTADOS DO AUDIT

Cada auditoria terá:

```text
DRAFT
↓
QUEUED
↓
RUNNING
↓
ANALYZING
↓
COMPLETED
```

Em caso de erro:

**FAILED**

Com possibilidade de repetir.

---

# 40. TEMPO DE PROCESSAMENTO

O usuário não deve ficar olhando uma tela congelada.

O sistema deve mostrar progresso conceitual:

```text
✓ Product analyzed
✓ Intents generated
✓ Prompts prepared
● Discovery running
○ Evidence analysis
○ Report generation
```

---

# 41. LIMITES DE USO

O MVP precisa controlar custos.

Exemplo conceitual:

- **Free** — Mini audit.
- **Paid Audit** — Auditoria completa.
- **Pro** — Auditorias recorrentes.

Os valores ainda não são decisões definitivas.

---

# 42. FREE AUDIT

Pode mostrar:

- score resumido;
- poucos intents;
- poucos resultados;
- 1–2 oportunidades.

Objetivo:

> **"provar valor."**

---

# 43. FULL AUDIT

Pode desbloquear:

- intents completos;
- concorrentes;
- evidências;
- gaps;
- recomendações;
- relatório completo.

---

# 44. MODELO COMERCIAL INICIAL

Hipótese:

```text
FREE
↓
One-time Audit
↓
Subscription
```

O primeiro produto pago pode ser uma auditoria única.

Isso reduz a barreira de entrada.

---

# 45. POR QUE AUDITORIA ÚNICA?

Porque ainda não sabemos se os usuários querem:

> "monitoramento contínuo."

Primeiro devemos provar que eles valorizam:

> **"diagnóstico."**

Depois podemos testar:

> "monitoramento."

---

# 46. MONITORING NÃO É MVP

O monitoramento é importante, mas deve ficar fora da primeira versão comercial se aumentar muito a complexidade.

O MVP precisa primeiro provar:

> **"O diagnóstico é útil."**

---

# 47. AGENCY MODE

Não implementar inicialmente como produto separado.

Mas a arquitetura deve evitar bloquear:

```text
Agency
↓
Multiple products
↓
Multiple audits
↓
Shared workspace
```

---

# 48. API

Não construir API pública no MVP.

Internamente, porém, a arquitetura deve separar:

```text
Data Collection
Analysis
Business Logic
Presentation
```

Isso permite API posteriormente.

---

# 49. WHITE LABEL

Fora do MVP.

Pode ser P2.

---

# 50. BROWSER EXTENSION

Fora do MVP.

Pode ser interessante posteriormente para:

> "analisar uma página enquanto o usuário navega."

Mas não prova a hipótese principal.

---

# 51. MOBILE APP

Fora do MVP.

O produto é inicialmente melhor servido por uma aplicação web.

---

# 52. AUTOMAÇÃO DE PUBLICAÇÃO

Fora do MVP.

A plataforma deve recomendar ações.

Não precisa executá-las.

---

# 53. O QUE O MVP PRECISA PROVAR

Existem cinco hipóteses principais.

**H1 — Relevância**

Os usuários consideram o diagnóstico relevante.

**H2 — Clareza**

Os usuários entendem as conclusões.

**H3 — Utilidade**

As oportunidades ajudam a decidir o que fazer.

**H4 — Diferenciação**

O relatório oferece algo que ferramentas tradicionais de ASO/AI Visibility não oferecem suficientemente.

**H5 — WTP**

Alguns usuários estão dispostos a pagar.

---

# 54. CRITÉRIOS DE SUCESSO

Os valores abaixo são metas de validação, não fatos de mercado.

Exemplo:

- 10–20 usuários testam.
- 50%+ consideram o relatório claramente útil.
- 30%+ demonstram intenção de pagar.
- Alguns efetivamente pagam.
- Pelo menos parte dos usuários consegue citar uma ação concreta que pretende executar.

Se esses sinais não aparecerem:

> **"revisar o produto antes de aumentar a infraestrutura."**

---

# 55. MÉTRICA MAIS IMPORTANTE DO MVP

Não é:

> "número de auditorias."

Nem:

> "número de prompts."

Nem:

> "quantidade de usuários cadastrados."

A métrica central é:

## ACTIONABLE INSIGHT RATE

Percentual de auditorias que produzem pelo menos uma oportunidade considerada útil e acionável pelo usuário.

---

# 56. OUTRA MÉTRICA IMPORTANTE

**Paid Insight Rate**

Percentual de usuários que, depois de visualizar uma amostra do diagnóstico, demonstram disposição real para pagar pela análise completa.

---

# 57. EVENTO DE VALOR

O momento mais importante da experiência é:

> **"Agora entendi por que meu software está perdendo espaço."**

Esse deve ser o equivalente ao:

> **"aha moment."**

---

# 58. RISCO PRINCIPAL

O maior risco não é técnico.

É:

> **"produzir análises interessantes, mas que não mudam nenhuma decisão."**

Se o usuário disser:

> "Legal, mas o que eu faço com isso?"

o MVP falhou parcialmente.

---

# 59. SEGUNDO RISCO

Outro risco:

> **"o resultado parecer uma opinião da IA."**

Por isso:

- evidência rastreável;
- prompts visíveis;
- respostas originais;
- confiança;
- distinção entre observação e hipótese.

São essenciais.

---

# 60. TERCEIRO RISCO

Dependência excessiva de uma plataforma ou modelo.

Se o produto depender de um único sistema:

> "uma alteração externa pode quebrar a proposta."

A arquitetura deve permitir múltiplas fontes posteriormente.

---

# 61. QUARTO RISCO

Custos de execução.

Cada auditoria pode envolver:

- chamadas a modelos;
- buscas;
- scraping/API;
- processamento;
- armazenamento.

O MVP precisa controlar:

> **"custo por auditoria."**

---

# 62. UNIT ECONOMICS DESDE O INÍCIO

Cada auditoria deve registrar:

```text
Custo de coleta
+
Custo de IA
+
Custo de armazenamento
+
Custo de processamento
```

E produzir:

**Custo estimado por audit**

Sem isso, pode surgir um produto tecnicamente interessante e economicamente inviável.

---

# 63. ARCHITECTURE PRINCIPLE

Separar:

```text
INGESTION
↓
OBSERVATION
↓
ANALYSIS
↓
SCORING
↓
REPORTING
```

---

# 64. DADOS MÍNIMOS

O sistema deverá guardar, conceitualmente:

- Product
- Audit
- Intent
- Prompt
- Execution
- Response
- Mention
- Recommendation
- Competitor
- Source
- Evidence
- Gap
- Opportunity
- Action
- Score

---

# 65. RELAÇÃO ENTRE ENTIDADES

```text
PRODUCT
  ↓
AUDIT
  ↓
INTENT
  ↓
PROMPT
  ↓
EXECUTION
  ↓
RESPONSE
  ├── MENTION
  ├── RECOMMENDATION
  └── SOURCE
          ↓
       EVIDENCE
          ↓
         GAP
          ↓
     OPPORTUNITY
          ↓
        ACTION
```

---

# 66. O QUE DEVE SER REUTILIZÁVEL

O sistema deve reutilizar:

- Product Profile;
- Intent Library;
- Competitor Library;
- Source Records;
- histórico de prompts;
- classificações.

Isso reduz custos em auditorias futuras.

---

# 67. VERSIONAMENTO

Cada auditoria deve registrar:

- Methodology Version
- Prompt Set Version
- Model
- Market
- Language
- Date

Isso é importante para comparar auditorias futuras corretamente.

---

# 68. COMPARAÇÃO ENTRE AUDITORIAS

Quando uma nova auditoria for realizada:

```text
AUDIT 1
vs
AUDIT 2
```

O sistema poderá mostrar:

- novos intents;
- intents perdidos;
- mudança de share;
- concorrentes novos;
- novas fontes;
- novos gaps;
- mudanças de caracterização.

---

# 69. MAS ISSO AINDA NÃO É MONITORING

É apenas uma base para evolução.

O monitoramento contínuo será uma funcionalidade posterior.

---

# 70. ROADMAP DO PRODUTO

```text
MVP
Discoverability Audit

V1.1
Audit History

V1.2
Monitoring

V1.3
Experiments

V2
Evidence Graph

V2+
Discoverability Forecast
```

---

# 71. PRIORIDADE DE DESENVOLVIMENTO

**P0**

- Product Intake
- Intent Engine
- Prompt Engine
- Discovery
- Recommendation Classification
- Competitor Analysis
- Evidence Extraction
- Gap Detection
- Action Prioritization
- Audit Report

**P1**

- History
- Comparison
- Monitoring
- Experiments

**P2**

- Evidence Graph
- Forecast
- API
- Agency
- White-label

---

# 72. DEFINITION OF DONE — MVP

O MVP só deve ser considerado pronto quando:

**Produto**

- consegue analisar um software.

**Intents**

- consegue gerar e editar intents.

**Prompts**

- consegue gerar conjunto controlado.

**Discovery**

- consegue executar observações.

**Classification**

- consegue distinguir menção/recomendação.

**Competitors**

- consegue comparar concorrentes.

**Evidence**

- consegue extrair fontes.

**Gaps**

- consegue detectar oportunidades.

**Actions**

- consegue gerar ações rastreáveis.

**Report**

- consegue produzir relatório compreensível.

**Auditability**

- consegue mostrar evidências originais.

**Economics**

- consegue medir custo por auditoria.

---

# 73. O MVP NÃO ESTÁ PRONTO SE

Mesmo que tecnicamente funcione, não estará pronto se:

- o relatório for confuso;
- os scores não forem explicáveis;
- as recomendações forem genéricas;
- não houver evidência rastreável;
- o usuário não souber o que fazer;
- o custo por análise for inviável;
- os resultados forem inconsistentes demais.

---

# 74. CRITÉRIO DE QUALIDADE

O produto deve ser avaliado em três níveis:

**Nível 1 — Data Quality**

Os dados estão corretos?

**Nível 2 — Analytical Quality**

A interpretação é coerente?

**Nível 3 — Decision Quality**

A análise ajuda o usuário a tomar uma decisão melhor?

O terceiro é o mais importante.

---

# 75. PRINCÍPIO FINAL DO MVP

> **"Não construir uma plataforma grande para provar uma hipótese pequena."**

Construir uma experiência pequena que consiga provar uma hipótese grande:

> **"Existe valor comercial em compreender a discoverability de um software de forma mais profunda do que simplesmente medir sua presença."**

---

# 76. RESULTADO ESPERADO

Ao terminar uma auditoria, o usuário deve conseguir responder:

```text
ONDE ESTOU?
POR QUE ESTOU AQUI?
ONDE ESTOU PERDENDO?
QUEM ESTÁ GANHANDO?
QUE EVIDÊNCIAS EXISTEM?
QUAL É O MEU MAIOR GAP?
O QUE DEVO TESTAR PRIMEIRO?
```

Se o produto conseguir responder isso de maneira confiável e útil:

> **"o MVP cumpriu sua função."**

---

# 77. PRÓXIMO DOCUMENTO

Depois deste PRD, o próximo documento não deve ser imediatamente código.

O próximo passo é:

## DOCUMENTO 5 — PLANO DE VALIDAÇÃO

Ele deverá testar as hipóteses de:

- problema;
- segmento;
- valor;
- diferenciação;
- utilidade;
- disposição para pagar;
- preço;
- formato de auditoria;
- frequência de uso.

Somente depois da validação deveremos congelar:

> **"o escopo técnico da implementação."**

---

# 78. SEQUÊNCIA OFICIAL DO PROJETO

```text
DOCUMENTO 1
VALOR
        ↓
DOCUMENTO 2
CAPACIDADES
        ↓
DOCUMENTO 3
METODOLOGIA
        ↓
DOCUMENTO 4
MVP / PRD
        ↓
DOCUMENTO 5
VALIDAÇÃO
        ↓
DOCUMENTO 6
ARQUITETURA TÉCNICA
        ↓
DOCUMENTO 7
IMPLEMENTAÇÃO
```

A partir deste ponto, já não estamos apenas discutindo uma ideia.

Temos:

> **"uma proposta de valor + mapa de capacidades + metodologia + primeiro produto testável."**
