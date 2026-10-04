# DOCUMENTO 3

## METODOLOGIA DE DISCOVERABILITY INTELLIGENCE

**Produto:** Software Discoverability Intelligence  
**Versão:** 1.0  
**Status:** Metodologia conceitual  
**Relação:** Documento 3 da arquitetura do produto

---

# 1. OBJETIVO

Este documento define como o produto deve:

- identificar intenções;
- gerar e selecionar prompts;
- executar observações de descoberta;
- medir recomendações;
- comparar concorrentes;
- analisar evidências;
- identificar gaps;
- calcular confiança;
- priorizar oportunidades;
- acompanhar mudanças;
- distinguir fatos de hipóteses;
- transformar dados em decisões.

A metodologia deve ser suficientemente rigorosa para que o produto não se torne apenas um:

> "dashboard de opiniões de IA."

---

# 2. PRINCÍPIO METODOLÓGICO CENTRAL

O produto deve separar quatro níveis:

```text
OBSERVAÇÃO
↓
EVIDÊNCIA
↓
HIPÓTESE
↓
AÇÃO
```

Essa separação é obrigatória.

---

# 3. OBSERVAÇÃO

Observação é aquilo que o sistema efetivamente registrou.

Exemplo:

> "O produto apareceu em 18 de 100 respostas analisadas para determinado intent."

Isso é uma observação.

Não devemos imediatamente concluir:

> "O produto tem baixa qualidade."

A observação apenas informa o que ocorreu.

---

# 4. EVIDÊNCIA

Evidência é o conjunto de dados que sustenta uma observação.

Exemplo:

**Intent:**

"melhor app para controlar despesas"

**Prompts analisados:**

100

**Produto apareceu:**

18

**Concorrente A:**

57

**Concorrente B:**

43

**Fontes associadas às respostas:**

- App Store
- Google Play
- Website
- Reddit
- Artigos

Esses dados constituem evidência.

---

# 5. HIPÓTESE

A hipótese tenta explicar uma diferença observada.

Exemplo:

> "O concorrente pode estar sendo recomendado com maior frequência porque possui maior cobertura de conteúdo diretamente relacionada ao intent."

Isso é uma hipótese.

Não é uma conclusão causal.

---

# 6. AÇÃO

A ação é um experimento ou alteração recomendada para testar a hipótese.

Exemplo:

> "Criar uma página específica demonstrando como o produto resolve o problema associado ao intent."

Depois:

```text
ALTERAÇÃO
↓
OBSERVAÇÃO
↓
COMPARAÇÃO
↓
APRENDIZADO
```

---

# 7. UNIDADE FUNDAMENTAL: INTENT

A metodologia deve utilizar intent como unidade estratégica principal.

Um intent representa:

> "uma necessidade, objetivo ou problema que o usuário tenta resolver."

---

# 8. INTENT ≠ PROMPT

Um intent pode possuir muitos prompts.

Exemplo:

**INTENT**

"Controlar despesas de uma pequena empresa"

**PROMPT 1**

"Qual o melhor app para controlar despesas de uma pequena empresa?"

**PROMPT 2**

"Que software posso usar para acompanhar os gastos do meu negócio?"

**PROMPT 3**

"Existe uma ferramenta simples para registrar despesas empresariais?"

Os três prompts expressam essencialmente a mesma necessidade.

---

# 9. ESTRUTURA DE UM INTENT

Cada intent deve possuir:

- ID
- Nome
- Descrição
- Categoria
- Problema
- Público
- Contexto
- País
- Idioma
- Plataforma
- Intenção comercial
- Prioridade

---

# 10. CLASSIFICAÇÃO DE INTENTS

Os intents podem ser classificados como:

**Informacional**

O usuário quer aprender.

**Exploratório**

O usuário está procurando alternativas.

**Comercial**

O usuário está avaliando soluções.

**Transacional**

O usuário está pronto para executar uma ação.

**Comparativo**

O usuário quer comparar produtos.

**Problema-específico**

O usuário possui uma necessidade muito específica.

---

# 11. INTENT RELEVANCE

Nem todo intent relacionado semanticamente ao produto é comercialmente importante.

Por isso, cada intent deve receber uma avaliação de relevância.

Exemplo:

**Relevância 5**

Problema central do produto.

**Relevância 4**

Caso de uso importante.

**Relevância 3**

Caso de uso secundário.

**Relevância 2**

Relacionamento indireto.

**Relevância 1**

Relação fraca.

O produto deve priorizar intents de maior relevância.

---

# 12. INTENT DISCOVERY

Os intents podem ser encontrados a partir de:

- descrição do produto;
- funcionalidades;
- categoria;
- store listing;
- website;
- concorrentes;
- reviews;
- perguntas dos usuários;
- pesquisas;
- comunidades;
- dados históricos;
- modelos de linguagem.

Mas a geração automática deve ser seguida por:

> **"normalização + classificação + validação."**

---

# 13. PRINCÍPIO CONTRA ALUCINAÇÃO DE INTENTS

O sistema não deve simplesmente criar dezenas de necessidades porque uma IA conseguiu imaginar relações semânticas.

Um intent deve possuir:

**Evidência de relevância**

ou

**Justificativa explícita de hipótese.**

---

# 14. INTENT SCORE

Um score conceitual pode combinar:

```text
Intent Score =
Relevância
×
Demanda potencial
×
Valor comercial
×
Adequação ao produto
```

No MVP, a fórmula pode ser simplificada.

O importante é impedir que intents irrelevantes dominem o diagnóstico.

---

# 15. PROMPTS

Prompts são diferentes formas linguísticas de expressar um intent.

A metodologia deve gerar diversidade suficiente para representar diferentes formas de perguntar.

---

# 16. DIMENSÕES DE VARIAÇÃO

Os prompts devem variar em:

**Linguagem**

- natural;
- curta;
- detalhada;
- coloquial;
- profissional.

**Perspectiva**

- "qual é o melhor..."
- "existe algum..."
- "preciso de..."
- "compare..."
- "o que você recomenda..."

**Contexto**

- iniciante;
- profissional;
- empresa pequena;
- empresa grande;
- orçamento limitado;
- necessidade específica.

**Localização**

- país;
- idioma;
- moeda;
- contexto cultural;
- disponibilidade regional.

---

# 17. PROMPT NÃO DEVE SER DUPLICAÇÃO

Dez prompts quase idênticos não equivalem a dez evidências independentes.

Exemplo:

- Qual o melhor app para X?
- Qual é o melhor aplicativo para X?
- Que app é melhor para X?
- Qual aplicativo é melhor para X?

Esses prompts possuem baixa diversidade.

A metodologia deve reconhecer essa redundância.

---

# 18. PROMPT DIVERSITY

O conjunto de prompts deve buscar:

> **"diversidade semântica e contextual."**

Não simplesmente quantidade.

---

# 19. TAMANHO DA AMOSTRA

Não existe um número universal de prompts correto para todos os produtos.

A amostra deve depender de:

- número de intents;
- variabilidade do produto;
- número de concorrentes;
- mercados;
- custo de execução;
- frequência de atualização.

---

# 20. PRINCÍPIO DE AMOSTRAGEM

Para o MVP:

> **"começar com uma amostra pequena, controlada e interpretável."**

Por exemplo:

```text
10–20 intents prioritários
×
5–10 prompts por intent
```

Isso produz aproximadamente:

**50–200 observações de prompt por auditoria**

O número final deve ser validado empiricamente.

---

# 21. POR QUE NÃO USAR MILHARES DE PROMPTS NO MVP?

Porque o objetivo inicial não é competir em volume.

É descobrir:

> **"se a análise produz uma decisão valiosa."**

Mais dados não corrigem uma metodologia ruim.

---

# 22. EXECUÇÃO DA DESCOBERTA

Cada prompt executado deve registrar:

- Prompt
- Data
- Hora
- Modelo
- Versão disponível
- Mercado
- Idioma
- Contexto
- Resposta
- Produtos mencionados
- Ordem
- Sentimento/caracterização
- Fontes

Quando disponível, também:

- consultas secundárias;
- fontes consultadas;
- links;
- referências;
- contexto da sessão.

---

# 23. SNAPSHOT

Cada execução deve ser tratada como um:

> **"Snapshot de descoberta."**

Exemplo:

```text
Snapshot #001
Data: 04/10/2026
Mercado: US
Idioma: English
Modelo: X
```

Isso é importante porque respostas de sistemas de IA podem mudar.

---

# 24. NÃO TRATAR UMA RESPOSTA COMO VERDADE ABSOLUTA

Uma única resposta não deve determinar o score de um produto.

Exemplo:

**Prompt:**

"melhor app para X"

**Execução 1:**

Produto A

**Execução 2:**

Produto B

**Execução 3:**

Produto A

**Execução 4:**

Produto C

A metodologia deve trabalhar com distribuição de resultados.

---

# 25. RECOMMENDATION EVENT

Cada menção relevante deve ser registrada como:

## Recommendation Event

Com:

- Produto
- Intent
- Prompt
- Posição
- Contexto
- Resposta
- Data
- Modelo
- Fontes
- Caracterização

---

# 26. O QUE É "APARECER"?

A metodologia deve diferenciar:

**Menção**

O produto foi citado.

**Recomendação**

O produto foi apresentado como solução relevante.

**Destaque**

O produto recebeu posição ou justificativa favorável.

**Comparação**

O produto foi citado apenas como alternativa ou contraponto.

Isso é fundamental.

Uma simples menção não equivale a uma recomendação.

---

# 27. CLASSIFICAÇÃO DE MENÇÃO

Exemplo:

```text
RECOMENDADO
"Eu recomendo A para..."

ALTERNATIVA
"Outra opção é A."

COMPARADO
"A é melhor que B em..."

NEGATIVO
"A possui limitações..."

CONTEXTO
"A é conhecida por..."

IRRELEVANTE
"Aparece apenas incidentalmente."
```

---

# 28. RECOMMENDATION SHARE

Uma métrica básica:

```text
Recommendation Share =
respostas em que o produto foi recomendado
÷
respostas relevantes
```

Exemplo:

- 20 recomendações
- 100 respostas relevantes

**Recommendation Share = 20%**

---

# 29. INTENT COVERAGE

Mede a amplitude.

```text
Intent Coverage =
intents relevantes onde o produto aparece
÷
total de intents relevantes analisados
```

Exemplo:

- 8 intents cobertos
- 20 intents relevantes

**Coverage = 40%**

---

# 30. NÃO CONFUNDIR SHARE COM COVERAGE

Um produto pode ter:

```text
Coverage baixo
+
Share alto
```

Ou:

```text
Coverage alto
+
Share baixo
```

Isso gera diagnósticos diferentes.

**Coverage baixo**

O produto aparece em poucos problemas.

**Share baixo**

O produto disputa mal os problemas onde está presente.

---

# 31. POSITION

A posição indica onde o produto aparece na resposta.

Exemplo:

- 1º
- 2º
- 3º
- ...

Mas posição deve ser interpretada com cuidado.

Uma resposta pode listar três produtos.

Outra pode mencionar quinze.

Portanto, posição absoluta não deve ser usada isoladamente.

---

# 32. POSITION WEIGHT

Uma possibilidade:

```text
Position Weight = 1 / posição
```

Assim:

- 1º = 1.00
- 2º = 0.50
- 3º = 0.33
- 4º = 0.25

Outras funções poderão ser testadas posteriormente.

---

# 33. COMPETITIVE SHARE

Para cada intent:

- Produto A
- Produto B
- Produto C
- Produto D

Calcular:

- frequência;
- posição;
- cobertura;
- recomendação;
- caracterização.

---

# 34. COMPETITIVE GAP

Um gap competitivo ocorre quando:

```text
Concorrente aparece
+
Produto não aparece
+
Intent relevante
```

Mas o sistema deve adicionar:

```text
Confiança
+
Relevância
+
Tamanho da oportunidade
```

---

# 35. EVIDENCE EXTRACTION

Para cada resposta, o sistema deve identificar:

**Fontes citadas**

Quais URLs/domínios aparecem.

**Tipo da fonte**

- App Store;
- Google Play;
- website;
- review;
- Reddit;
- fórum;
- notícia;
- blog;
- YouTube;
- documentação;
- outro.

**Relação com o produto**

A fonte fala diretamente sobre:

- produto;
- funcionalidade;
- problema;
- categoria;
- comparação.

---

# 36. IMPORTANTE: EVIDÊNCIA NÃO É CAUSA

Se uma fonte aparece em uma recomendação:

> **"isso não prova que essa fonte causou a recomendação."**

Ela apenas mostra que:

> "a fonte estava presente no contexto de evidência observado."

Essa distinção deve estar presente na metodologia e na interface.

---

# 37. SOURCE RELEVANCE

Cada fonte pode ser classificada segundo:

- Relevância para intent
- Relevância para produto
- Autoridade
- Atualidade
- Especificidade
- Independência

---

# 38. SOURCE CONTROL

As fontes também podem ser classificadas por controle:

**Owned**

Controlada pelo produto.

Exemplo:

- website;
- documentação;
- store listing.

**Earned**

Obtida externamente.

Exemplo:

- artigo;
- review;
- notícia.

**Community**

Criada por usuários/comunidade.

Exemplo:

- Reddit;
- fórum.

**Platform**

Fonte institucional da plataforma.

---

# 39. EVIDENCE COVERAGE

Uma métrica candidata:

> **"Quanto dos intents importantes possui evidência relevante associada ao produto?"**

Exemplo:

- 20 intents importantes
- 12 possuem evidências fortes
- 8 possuem evidências fracas ou inexistentes

**Evidence Coverage = 60%**

---

# 40. EVIDENCE GAP

Para um determinado intent:

```text
Evidence Strength do produto
versus
Evidence Strength dos concorrentes
```

O objetivo não é simplesmente contar links.

É avaliar:

> **"quão diretamente as evidências sustentam a associação entre produto e necessidade."**

---

# 41. EVIDENCE QUALITY

A qualidade de uma evidência pode considerar:

```text
Relevância
+
Especificidade
+
Credibilidade
+
Atualidade
+
Independência
+
Consistência
```

Não necessariamente em uma fórmula fixa no MVP.

---

# 42. SEMANTIC ALIGNMENT

O sistema deve comparar:

**O que o produto afirma fazer**

com:

**O que os sistemas de descoberta parecem entender que ele faz.**

---

# 43. EXEMPLO

Produto afirma:

> "Ferramenta simples para pequenas empresas controlarem fluxo de caixa."

IA descreve:

> "Aplicativo de controle pessoal de gastos."

Existe potencial:

## SEMANTIC ALIGNMENT GAP

O produto pode estar sendo compreendido de maneira diferente da intenção estratégica.

---

# 44. CHARACTERIZATION

Além de sentimento positivo/negativo, devemos observar:

> **"como o produto é caracterizado."**

Exemplo:

- Produto A: "simples"
- Produto B: "profissional"
- Produto C: "barato"
- Produto D: "completo"

Isso é mais útil que simplesmente:

> "sentimento = 0.82"

---

# 45. CHARACTERIZATION MAP

Para cada produto:

```text
Produto
↓
Características associadas
↓
Intents
↓
Concorrentes
```

Isso permite descobrir:

> **"Qual imagem mental o sistema de descoberta possui deste produto?"**

---

# 46. DISCOVERABILITY SCORE

O score geral deve ser composto por várias dimensões.

Proposta inicial:

```text
Discoverability Score

= Coverage
+ Recommendation
+ Position
+ Semantic Alignment
+ Evidence
+ Competitive Strength
```

Mas:

> **"não devemos fixar os pesos definitivamente nesta versão."**

Os pesos devem ser validados.

---

# 47. POR QUE NÃO DEFINIR A FÓRMULA AGORA?

Porque um score aparentemente preciso pode produzir:

> **"falsa precisão."**

Exemplo:

```text
Discoverability = 73.42
```

Isso parece científico.

Mas se os pesos foram arbitrários:

> "73.42 não significa realmente nada."

---

# 48. SCORE COM EXPLICAÇÃO

A interface deve preferir:

```text
Discoverability
72 / 100

FORÇAS
+ Boa cobertura de intents
+ Forte posicionamento em X

FRAQUEZAS
- Baixa presença em Y
- Evidência externa limitada em Z

CONFIANÇA
Média
```

Em vez de apresentar apenas:

> "72."

---

# 49. CONFIDENCE SCORE

Toda conclusão importante deve possuir confiança.

Proposta:

- Alta
- Média
- Baixa

Baseada em:

- tamanho da amostra;
- consistência;
- diversidade dos prompts;
- estabilidade;
- qualidade das fontes;
- clareza da classificação.

---

# 50. EXEMPLO

**Alta confiança**

Produto apareceu em 68 de 100 prompts diversos.

**Média**

Produto apareceu em 12 de 30.

**Baixa**

Produto apareceu em 1 de 5.

---

# 51. STABILITY

Também devemos medir estabilidade.

Exemplo:

- Semana 1: 30%
- Semana 2: 31%
- Semana 3: 29%
- Semana 4: 32%

Resultado:

> "relativamente estável."

Outro:

- Semana 1: 10%
- Semana 2: 45%
- Semana 3: 12%
- Semana 4: 38%

Resultado:

> "altamente variável."

---

# 52. VARIABILITY INDEX

Uma métrica futura pode medir:

> **"quanto a presença do produto varia entre execuções."**

Isso evita interpretar um resultado extremamente instável como tendência permanente.

---

# 53. MODEL EFFECT

A descoberta deve ser segmentada por sistema quando necessário.

Exemplo:

- ChatGPT
- Gemini
- Perplexity
- Google AI

Não devemos misturar tudo imediatamente.

Cada sistema possui:

- modelo;
- mecanismos de busca;
- fontes;
- comportamento;
- atualização;
- contexto.

---

# 54. CROSS-MODEL SCORE

Um score agregado pode existir posteriormente.

Mas o dado bruto deve permanecer separado.

```text
ChatGPT
↓
Resultado

Gemini
↓
Resultado

Perplexity
↓
Resultado

Somente depois:

Aggregate Discoverability
```

---

# 55. MARKET / LANGUAGE

Os resultados também devem ser separados por:

- país;
- idioma;
- região;
- contexto cultural.

Uma recomendação nos Estados Unidos não deve ser tratada automaticamente como equivalente a uma recomendação em Moçambique, França ou Brasil.

---

# 56. TEMPORALITY

Toda observação deve possuir:

- timestamp
- model
- market
- language
- prompt version

Isso permite distinguir:

> "mudança real"

de:

> "mudança causada pelo ambiente de medição."

---

# 57. BEFORE / AFTER

Quando o usuário fizer uma alteração:

```text
ANTES
↓
Alteração
↓
Período de observação
↓
DEPOIS
```

O produto pode comparar:

- Recommendation Share;
- Coverage;
- Position;
- Characterization;
- Evidence;
- Competitors.

---

# 58. EXPERIMENT DESIGN

Idealmente:

```text
Hipótese
↓
Alteração
↓
Período
↓
Medição
↓
Comparação
↓
Conclusão
```

A conclusão deve usar linguagem proporcional à evidência.

---

# 59. LINGUAGEM PERMITIDA

**Forte evidência**

> "Observamos aumento consistente após a alteração."

**Evidência moderada**

> "Há associação temporal entre a alteração e o aumento observado."

**Evidência fraca**

> "O resultado é compatível com a hipótese, mas a amostra ainda é insuficiente."

---

# 60. LINGUAGEM A EVITAR

Evitar:

> "Esta alteração fez a IA recomendar seu app."

quando não existe experimento causal adequado.

Também evitar:

> "O algoritmo prefere seu concorrente porque ele tem mais backlinks."

sem evidência suficiente.

---

# 61. ACTION PRIORITY

Cada oportunidade deve receber:

- Impacto potencial
- Relevância
- Confiança
- Esforço

---

# 62. OPPORTUNITY SCORE

Conceitualmente:

```text
Opportunity Score =
Impacto
×
Relevância
×
Confiança
÷
Esforço
```

Novamente:

> **"a fórmula é uma hipótese metodológica, não uma verdade definitiva."**

---

# 63. TIPOS DE AÇÃO

As ações podem ser classificadas em:

**Positioning**

Melhorar clareza da proposta.

**Store**

Melhorar listing.

**Website**

Criar/reforçar conteúdo.

**Evidence**

Construir evidência externa.

**Community**

Aumentar presença comunitária relevante.

**Product**

Corrigir funcionalidade ou experiência.

**Distribution**

Aumentar presença em canais de descoberta.

---

# 64. ACTION TRACEABILITY

Toda recomendação deve apontar para:

```text
AÇÃO
↓
PROBLEMA
↓
EVIDÊNCIA
↓
HIPÓTESE
```

Exemplo:

> "Ação: criar conteúdo específico para X."

> "Problema: baixa presença no intent X."

> "Evidência: concorrentes aparecem em 58% das respostas; produto em 9%."

> "Hipótese: associação semântica e evidência externa de X são insuficientes."

Isso torna a recomendação auditável.

---

# 65. AUDIT TRAIL

O sistema deve preservar:

- prompt;
- resposta;
- classificação;
- fonte;
- cálculo;
- score;
- recomendação.

Assim o usuário pode perguntar:

> **"Por que vocês chegaram a essa conclusão?"**

E o produto consegue responder.

---

# 66. HIERARQUIA DE DADOS

A metodologia pode ser organizada assim:

```text
RAW DATA
↓
OBSERVATIONS
↓
METRICS
↓
INTERPRETATION
↓
OPPORTUNITIES
↓
ACTIONS
↓
EXPERIMENTS
↓
LEARNING
```

---

# 67. PRINCÍPIO DE TRANSPARÊNCIA

Quanto mais importante for uma conclusão, mais facilmente o usuário deve conseguir rastreá-la até os dados.

Portanto:

> **"Nenhuma recomendação crítica deve existir sem evidência rastreável."**

---

# 68. EVIDENCE GRAPH — MODELO METODOLÓGICO

O grafo pode ser representado como:

```text
INTENT
 │
 ├── PROMPTS
 │
 ├── PRODUCTS
 │      │
 │      └── CHARACTERIZATIONS
 │
 ├── COMPETITORS
 │
 ├── RESPONSES
 │
 └── SOURCES
        │
        ├── OWNED
        ├── EARNED
        ├── COMMUNITY
        └── PLATFORM
```

Com o tempo:

```text
INTENT
↓
EVIDENCE
↓
RECOMMENDATION
↓
OUTCOME
```

---

# 69. O QUE A METODOLOGIA DEVE EVITAR

**1. Falsa precisão**

Scores excessivamente exatos sem fundamento.

**2. Confundir menção com recomendação**

Uma citação não significa preferência.

**3. Confundir correlação com causalidade**

Uma fonte citada não significa que causou a recomendação.

**4. Supervalorizar uma resposta**

Uma execução isolada não representa o mercado.

**5. Supervalorizar volume**

Mais prompts não significam automaticamente melhor inteligência.

**6. Misturar mercados**

Países e idiomas diferentes devem ser tratados separadamente.

**7. Misturar modelos**

Diferenças entre sistemas precisam ser preservadas.

**8. Ignorar temporalidade**

Resultados mudam.

**9. Ignorar concorrência**

Discoverability é relativa.

**10. Produzir recomendações genéricas**

Toda recomendação deve possuir evidência e contexto.

---

# 70. MÉTODO MÍNIMO DO MVP

Para o primeiro produto, a metodologia pode ser simplificada:

```text
1. INPUT DO PRODUTO
↓
2. 10–20 INTENTS
↓
3. 5–10 PROMPTS / INTENT
↓
4. EXECUÇÃO CONTROLADA
↓
5. CLASSIFICAÇÃO DAS RESPOSTAS
↓
6. COMPARAÇÃO COM CONCORRENTES
↓
7. EXTRAÇÃO DE FONTES
↓
8. IDENTIFICAÇÃO DE GAPS
↓
9. PRIORIZAÇÃO
↓
10. RELATÓRIO
```

---

# 71. SAÍDA MÍNIMA DO MVP

O relatório deve responder:

- Onde apareço?
- Onde não apareço?
- Quem aparece no meu lugar?
- Como sou descrito?
- Quais evidências aparecem associadas?
- Onde existe um gap relevante?
- Quais são as 5 principais oportunidades?
- O que devo testar primeiro?

---

# 72. O QUE A METODOLOGIA AINDA NÃO DEVE PROMETER

Não devemos prometer:

> "Vamos prever exatamente como a IA irá responder."

Nem:

> "Vamos garantir que seu software será recomendado."

Nem:

> "Vamos descobrir o algoritmo secreto do ChatGPT."

Nem:

> "Vamos provar exatamente por que uma IA escolheu determinado produto."

A proposta deve ser:

> **"observar, comparar, reunir evidências, formular hipóteses e orientar experimentos."**

---

# 73. DIFERENCIAL METODOLÓGICO

A diferença pretendida não está em simplesmente medir:

"Você apareceu?"

Mas em construir uma cadeia:

```text
VOCÊ APARECEU?
↓
EM QUAL INTENT?
↓
COM QUAL FREQUÊNCIA?
↓
EM QUAL POSIÇÃO?
↓
COM QUAL CARACTERIZAÇÃO?
↓
CONTRA QUAIS CONCORRENTES?
↓
COM QUAIS FONTES?
↓
QUE EVIDÊNCIAS ESTÃO PRESENTES?
↓
QUAL É O GAP?
↓
QUAL HIPÓTESE EXPLICA O GAP?
↓
QUAL AÇÃO VALE TESTAR?
↓
O QUE ACONTECEU DEPOIS?
```

---

# 74. PRINCÍPIO FUNDAMENTAL DA METODOLOGIA

> **"Dados não são inteligência."**

**Dados:**

> "O produto apareceu 18 vezes."

**Informação:**

> "O produto possui 18% de Recommendation Share."

**Inteligência:**

> "O produto possui baixa presença no intent X apesar de alta relevância comercial, enquanto dois concorrentes aparecem consistentemente. As respostas frequentemente citam fontes específicas que não cobrem o produto. Isso constitui uma oportunidade de investigação."

**Ação:**

> "Testar uma intervenção direcionada a X e acompanhar o resultado."

---

# 75. MODELO FINAL

A metodologia completa pode ser resumida em:

```text
                    DATA
                     ↓
                 OBSERVATION
                     ↓
                   METRIC
                     ↓
                  CONTEXT
                     ↓
                 COMPARISON
                     ↓
                  EVIDENCE
                     ↓
                INTERPRETATION
                     ↓
                 HYPOTHESIS
                     ↓
                 OPPORTUNITY
                     ↓
                   ACTION
                     ↓
                EXPERIMENT
                     ↓
                  RESULT
                     ↓
                 LEARNING
                     ↓
                  HISTORY
```

---

# 76. PRINCÍPIO DE EVOLUÇÃO

A metodologia não deve ser congelada.

A versão 1.0 deve ser considerada:

> **"uma hipótese metodológica testável."**

Os pesos, métricas e classificações deverão evoluir conforme forem obtidos dados reais.

---

# 77. DECISÃO METODOLÓGICA DESTA VERSÃO

A primeira versão deve priorizar:

**Alta prioridade**

- Intent;
- Prompt;
- Recommendation Event;
- Coverage;
- Recommendation Share;
- Position;
- Competitor Gap;
- Source Extraction;
- Evidence Gap;
- Characterization;
- Confidence;
- Action Prioritization.

**Média prioridade**

- Stability;
- Historical analysis;
- Experiment tracking;
- Cross-model comparison;
- Cross-market comparison.

**Longo prazo**

- Evidence Graph completo;
- Forecast;
- causal inference;
- predictive models;
- outcome attribution.

---

# 78. CONCLUSÃO

A metodologia define o produto como uma máquina de transformação:

```text
DADOS
→
EVIDÊNCIA
→
INTELIGÊNCIA
→
DECISÃO
→
EXPERIMENTO
→
APRENDIZADO
```

O objetivo não é produzir o maior número possível de métricas.

O objetivo é produzir conclusões úteis, rastreáveis e metodologicamente honestas.

O produto deve saber dizer:

> **"Isto observamos."**

> **"Isto conseguimos sustentar."**

> **"Isto é uma hipótese."**

> **"Isto recomendamos testar."**

Essa separação deve ser uma característica central da plataforma.

---

# 79. PRÓXIMO DOCUMENTO

Com o Documento 3 concluído, temos agora:

```text
DOCUMENTO 1
VALOR
↓
Por que existe?

DOCUMENTO 2
CAPACIDADES
↓
O que precisa fazer?

DOCUMENTO 3
METODOLOGIA
↓
Como mede e interpreta?

DOCUMENTO 4
MVP / PRD
↓
O que vamos construir primeiro?

DOCUMENTO 5
VALIDAÇÃO
↓
Como saberemos se vale a pena?

DOCUMENTO 6
IMPLEMENTAÇÃO
↓
Como construir tecnicamente?
```

O próximo documento deverá ser o Documento 4 — MVP / PRD, no qual vamos pegar tudo que foi definido até agora e fazer uma coisa muito mais difícil:

> **"cortar."**

Precisaremos decidir exatamente o que entra no primeiro produto, o que fica fora, quais são as telas, fluxo do usuário, entradas, saídas, funcionalidades, critérios de sucesso e limites técnicos.

A regra será:

> **"O MVP não deve demonstrar que conseguimos construir uma plataforma. Deve demonstrar que conseguimos entregar uma inteligência pela qual alguém pagaria."**
