# DOCUMENTO 6

## ARQUITETURA TÉCNICA

**Produto:** Software Discoverability Intelligence  
**MVP:** Discoverability Audit  
**Versão:** 1.0  
**Estado:** Arquitetura de referência

---

# 1. Objetivo

Este documento define a arquitetura técnica necessária para transformar o conceito de Software Discoverability Intelligence em um sistema operacional capaz de:

1. receber um software;
2. compreender o produto;
3. identificar intenções relevantes;
4. gerar prompts representativos;
5. executar pesquisas em sistemas de descoberta;
6. registrar respostas e recomendações;
7. identificar concorrentes;
8. extrair fontes e evidências;
9. detectar gaps;
10. produzir oportunidades;
11. priorizar ações;
12. gerar um Discoverability Audit rastreável;
13. preservar histórico e versões.

A arquitetura deve permitir começar pequeno sem criar uma estrutura que impeça evolução futura.

---

# 2. Princípio arquitetural principal

A arquitetura deve separar claramente:

```text
DADOS → OBSERVAÇÕES → ANÁLISE → INTELIGÊNCIA → DECISÃO → APRESENTAÇÃO
```

Não permitir que uma única chamada de IA faça todo o processo.

O sistema deve conseguir responder:

> "De onde veio este resultado?"

> "Qual prompt produziu esta observação?"

> "Qual modelo foi utilizado?"

> "Qual resposta foi recebida?"

> "Como a recomendação foi classificada?"

> "Quais evidências foram encontradas?"

> "Qual hipótese foi derivada?"

> "Por que determinada ação foi recomendada?"

Essa rastreabilidade é parte do produto.

---

# 3. Arquitetura conceitual

```text
                    ┌──────────────────────┐
                    │      USER / CLIENT   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       WEB APP        │
                    │ Dashboard / Reports  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       API / BFF       │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Product Intake    Audit Manager     User/Auth
             │                 │
             │                 ▼
             │          ┌───────────────┐
             │          │ Job / Queue   │
             │          └───────┬───────┘
             │                  │
             ▼                  ▼
       ┌──────────────────────────────────────────┐
       │              ANALYSIS PIPELINE           │
       │                                          │
       │ Intent → Prompt → Discovery → Analysis   │
       │                    → Evidence → Gaps      │
       │                    → Opportunities        │
       └──────────────────────┬───────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │    DATA / STORAGE    │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ REPORT GENERATOR     │
                    └──────────────────────┘
```

---

# 4. Princípio de separação de responsabilidades

Cada componente deve possuir uma responsabilidade clara.

**Product Intake**

Compreender e normalizar o produto.

**Intent Engine**

Transformar o produto em intenções relevantes.

**Prompt Engine**

Transformar intenções em consultas/prompt sets.

**Discovery Engine**

Executar consultas nos sistemas de descoberta.

**Observation Layer**

Registrar exatamente o que foi observado.

**Recommendation Intelligence**

Determinar como o produto e concorrentes aparecem nas respostas.

**Evidence Intelligence**

Identificar fontes e evidências associadas.

**Gap Engine**

Identificar diferenças relevantes entre produto e concorrentes.

**Opportunity Engine**

Transformar gaps em oportunidades.

**Action Engine**

Priorizar ações.

**Reporting**

Transformar inteligência estruturada em relatório compreensível.

---

# 5. Arquitetura em camadas

A plataforma deve seguir aproximadamente:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Analysis / Intelligence
     ↓
Data
     ↓
External Providers
```

Nenhuma camada superior deve depender diretamente de detalhes específicos de um fornecedor quando isso puder ser evitado.

---

# 6. Presentation Layer

Responsável por:

- onboarding;
- criação de audit;
- estado do audit;
- resultados;
- gráficos;
- evidências;
- recomendações;
- ações;
- histórico.

A interface deve seguir:

**Diagnóstico → Explicação → Ação**

e não:

**Dashboard → Dashboard → Dashboard**

---

# 7. Application Layer

Orquestra casos de uso.

Exemplos:

- CreateProduct
- CreateAudit
- GenerateIntents
- ApproveIntentSet
- GeneratePromptSet
- RunAudit
- AnalyzeAudit
- GenerateReport
- GetAuditStatus
- GetAuditEvidence
- CreateAction

Essa camada não deve conter detalhes específicos de uma API externa.

---

# 8. Domain Layer

Representa os conceitos fundamentais do produto.

Entidades principais:

- Product
- ProductProfile
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
- Snapshot
- MethodologyVersion

Esses objetos devem permanecer relativamente independentes da interface.

---

# 9. Modelo de dados central

A relação fundamental é:

```text
Product
   │
   ├── Intent
   │      │
   │      └── Prompt
   │             │
   │             └── Execution
   │                    │
   │                    └── Response
   │                           │
   │                           ├── Recommendation
   │                           ├── Competitor
   │                           └── Source
   │                                  │
   │                                  └── Evidence
   │
   └── Audit
          │
          ├── Gap
          ├── Opportunity
          ├── Action
          └── Score
```

Essa estrutura deve permitir reconstruir o caminho completo:

```text
Intent → Prompt → Response → Recommendation → Evidence → Gap → Action
```

---

# 10. Product

Representa o software analisado.

Campos conceituais:

- id
- name
- url
- platform
- category
- description
- target_audience
- country
- language
- competitors
- created_at
- updated_at

Não assumir que um produto pertence apenas a uma plataforma.

No futuro, o mesmo produto pode possuir:

- Android;
- iOS;
- web;
- SaaS;
- desktop.

---

# 11. Product Profile

O Product Profile representa a interpretação normalizada do produto.

Pode conter:

- value_proposition
- features
- use_cases
- audiences
- problems_solved
- categories
- keywords
- semantic_entities
- competitors
- markets
- languages

Importante:

> **"O Product Profile não deve ser tratado como verdade absoluta."**

Ele é uma representação analítica que pode ser corrigida pelo utilizador.

---

# 12. Audit

Representa uma execução completa da metodologia.

Campos:

- id
- product_id
- methodology_version
- prompt_set_version
- market
- language
- status
- created_at
- started_at
- completed_at

Estados:

- DRAFT
- QUEUED
- RUNNING
- ANALYZING
- COMPLETED
- FAILED
- CANCELLED

---

# 13. Intent

Intent é a unidade fundamental da análise.

Estrutura:

- id
- audit_id
- name
- description
- problem
- audience
- context
- category
- commercial_intent
- priority
- source
- confidence

Tipos:

- INFORMATIONAL
- EXPLORATORY
- COMMERCIAL
- TRANSACTIONAL
- COMPARATIVE
- PROBLEM_SPECIFIC

---

# 14. Prompt

Prompt é uma representação operacional de uma intenção.

Campos:

- id
- intent_id
- text
- language
- market
- variation_type
- version
- active

Tipos de variação:

- DIRECT
- CONVERSATIONAL
- COMPARATIVE
- PROBLEM_BASED
- ROLE_BASED
- CONTEXTUAL

O sistema não deve confundir:

**Intent ≠ Prompt**

Uma intenção pode possuir vários prompts.

---

# 15. Execution

Cada execução deve ser registrada como um evento independente.

- id
- prompt_id
- audit_id
- provider
- model
- market
- language
- timestamp
- request_hash
- status
- latency
- cost

Isso permite comparar:

- modelos;
- datas;
- mercados;
- idiomas;
- execuções.

---

# 16. Response

Guardar a resposta original sempre que legalmente e tecnicamente permitido.

Campos:

- id
- execution_id
- raw_response
- normalized_response
- response_hash
- created_at

O sistema deve evitar destruir a resposta original durante processamento.

A resposta original é parte da evidência.

---

# 17. Recommendation Event

Uma resposta pode conter vários eventos.

Exemplo:

- Recommendation
- Alternative
- Comparison
- Mention
- Negative
- Irrelevant

Campos:

- id
- response_id
- product_id
- competitor_id
- event_type
- position
- context
- confidence

Isso evita o erro:

> **"Apareceu na resposta = foi recomendado."**

---

# 18. Competitor

Representa uma solução concorrente observada.

- id
- name
- canonical_url
- platform
- category

A plataforma deve permitir concorrentes:

- previamente conhecidos;
- descobertos automaticamente;
- confirmados pelo utilizador.

---

# 19. Source

Representa uma fonte identificada na resposta ou investigação.

Categorias:

- OWNED
- EARNED
- COMMUNITY
- PLATFORM
- OTHER

Exemplos:

- site oficial;
- review;
- Reddit;
- YouTube;
- publicação;
- comparação;
- marketplace;
- documentação.

---

# 20. Evidence

Evidence representa uma unidade de evidência relevante.

Campos conceituais:

- id
- source_id
- product_id
- competitor_id
- intent_id
- claim
- context
- relevance
- specificity
- credibility
- freshness
- independence
- consistency
- confidence

A evidência não deve ser apenas um URL.

Deve responder:

> **"Que informação essa fonte fornece que é relevante para esta análise?"**

---

# 21. Evidence Graph

A arquitetura deve ser preparada para uma evolução futura em direção ao Evidence Graph.

Modelo conceitual:

```text
INTENT
  │
  ▼
PROMPT
  │
  ▼
RESPONSE
  │
  ├──────────────► PRODUCT
  │
  ├──────────────► COMPETITOR
  │
  └──────────────► SOURCE
                         │
                         ▼
                      EVIDENCE
                         │
                         ▼
                        GAP
                         │
                         ▼
                    OPPORTUNITY
                         │
                         ▼
                       ACTION
```

No MVP, isso pode ser implementado com tabelas relacionais.

Não é necessário introduzir um banco de grafos prematuramente.

---

# 22. Gap

Gap representa uma diferença analiticamente relevante.

Exemplos:

- Recommendation Gap
- Coverage Gap
- Evidence Gap
- Semantic Gap
- Competitive Gap

Estrutura:

- id
- audit_id
- type
- product_id
- competitor_id
- intent_id
- description
- evidence
- impact
- confidence

---

# 23. Opportunity

Opportunity transforma um gap em uma possibilidade de ação.

- id
- gap_id
- title
- description
- impact
- relevance
- confidence
- effort
- priority

Prioridade conceitual:

```text
Impact × Relevance × Confidence / Effort
```

Os pesos devem permanecer configuráveis.

---

# 24. Action

Uma ação deve manter rastreabilidade.

```text
Action
  ↓
Opportunity
  ↓
Gap
  ↓
Evidence
  ↓
Observation
  ↓
Response
  ↓
Prompt
  ↓
Intent
```

Isso é essencial.

O sistema nunca deve produzir apenas:

> "Melhore seu posicionamento."

Deve conseguir explicar:

> **"Por que recomendamos isso?"**

---

# 25. Score Engine

Os scores devem ser derivados dos dados registrados.

Métricas iniciais:

- Recommendation Share
- Intent Coverage
- Average Position
- Competitive Gap
- Evidence Coverage
- Semantic Alignment
- Discoverability Score

O sistema deve guardar:

- metric
- value
- formula_version
- methodology_version
- confidence

Nunca armazenar apenas:

```text
discoverability_score = 72
```

sem saber como 72 foi calculado.

---

# 26. Versionamento

A metodologia deve ser versionada.

Exemplo:

```text
methodology_version = 1.0
prompt_set_version = 1.2
scoring_version = 1.0
```

Quando a fórmula mudar, resultados antigos não devem ser silenciosamente recalculados como se tivessem sido produzidos pelo novo método.

---

# 27. Por que versionamento é crítico

Imagine:

**Auditoria A:**

```text
Score = 62
```

Seis meses depois:

**Auditoria B:**

```text
Score = 74
```

O utilizador precisa saber se:

- o produto melhorou;
- o ambiente mudou;
- os concorrentes mudaram;
- os modelos mudaram;
- ou simplesmente a metodologia mudou.

Sem versionamento, histórico pode produzir conclusões falsas.

---

# 28. Pipeline de processamento

O pipeline principal:

```text
 1. Product Intake
        ↓
 2. Product Normalization
        ↓
 3. Intent Generation
        ↓
 4. Intent Review
        ↓
 5. Prompt Generation
        ↓
 6. Prompt Validation
        ↓
 7. Discovery Execution
        ↓
 8. Response Storage
        ↓
 9. Recommendation Extraction
        ↓
10. Competitor Detection
        ↓
11. Source Extraction
        ↓
12. Evidence Analysis
        ↓
13. Gap Detection
        ↓
14. Opportunity Generation
        ↓
15. Action Prioritization
        ↓
16. Score Calculation
        ↓
17. Report Generation
```

---

# 29. Processamento assíncrono

A execução de audits não deve depender de uma única requisição HTTP longa.

Usar arquitetura baseada em jobs:

```text
Audit Created
     ↓
Queue
     ↓
Worker
     ↓
Execution
     ↓
Analysis
     ↓
Report
```

Cada etapa deve poder:

- falhar;
- repetir;
- continuar;
- registrar erro.

---

# 30. Idempotência

Jobs precisam ser idempotentes sempre que possível.

Se uma execução falhar e for repetida:

> **"não deve duplicar silenciosamente os dados."**

Usar identificadores e hashes para controlar:

- prompts;
- executions;
- responses;
- fontes;
- análises.

---

# 31. Retry

Nem todas as falhas são iguais.

**Retry automático**

- timeout;
- erro temporário;
- rate limit;
- indisponibilidade temporária.

**Não repetir automaticamente**

- prompt inválido;
- configuração incorreta;
- URL inválida;
- autenticação inválida;
- resposta estruturalmente incompatível.

---

# 32. External Provider Layer

Os fornecedores externos devem ser abstraídos.

Conceito:

```text
DiscoveryProvider
       │
       ├── Provider A
       ├── Provider B
       ├── Provider C
       └── Provider D
```

O domínio não deve conhecer diretamente:

- OpenAI API
- Google API
- Anthropic API
- Perplexity API

Deve conhecer uma interface conceitual:

```text
execute(prompt, configuration)
```

Isso reduz lock-in.

---

# 33. Separar modelo de análise de modelo de descoberta

Uma IA utilizada para executar uma consulta não precisa ser a mesma utilizada para analisar a resposta.

Exemplo:

```text
Discovery Model
      ↓
Raw Response
      ↓
Analysis Model
      ↓
Structured Observation
```

Isso permite otimizar:

- custo;
- qualidade;
- velocidade.

---

# 34. Estrutura de custos

Registrar custo por execução.

- provider
- model
- input_tokens
- output_tokens
- estimated_cost
- currency
- timestamp

Depois calcular:

- Cost per Audit
- Cost per Intent
- Cost per Prompt
- Cost per Observation
- Cost per Report

A arquitetura deve permitir descobrir onde o custo está concentrado.

---

# 35. Cache

Nem toda execução precisa ser repetida imediatamente.

Pode existir cache para:

- respostas;
- páginas;
- fontes;
- embeddings;
- análises intermediárias.

Mas cache não deve destruir a capacidade de realizar snapshots reais.

Quando o objetivo for medir mudança temporal, deve existir uma execução nova.

---

# 36. Snapshot

Cada audit deve representar um estado do ecossistema naquele momento.

Um snapshot pode conter:

- date
- market
- language
- model
- methodology_version
- prompt_set_version
- competitors
- responses
- sources
- metrics

Isso cria a base para:

**Historical Discoverability Intelligence**

no futuro.

---

# 37. Banco de dados

Para o MVP, a preferência arquitetural deve ser:

**Banco relacional**

porque o domínio possui relações fortes entre:

- produto;
- audit;
- intenção;
- prompt;
- execução;
- resposta;
- recomendação;
- fonte;
- evidência;
- gap;
- ação.

Um banco relacional é suficiente para o início.

Não introduzir banco de grafos apenas porque o conceito futuro é um Evidence Graph.

---

# 38. Estrutura relacional conceitual

```text
users
products
product_profiles

audits
intents
prompts
executions
responses

recommendations
competitors
sources
evidence

gaps
opportunities
actions

scores
methodology_versions
prompt_set_versions

audit_events
cost_records
```

---

# 39. Audit Events

Registrar eventos importantes:

- audit.created
- audit.queued
- audit.started
- audit.intent_generated
- audit.prompts_generated
- audit.execution_started
- audit.execution_completed
- audit.analysis_started
- audit.analysis_completed
- audit.report_generated
- audit.completed
- audit.failed

Isso facilita:

- debugging;
- suporte;
- auditoria;
- métricas;
- análise de performance.

---

# 40. Observability

O sistema deve observar:

**Aplicação**

- erros;
- latência;
- throughput.

**Pipeline**

- tempo por etapa;
- falhas;
- retries;
- quantidade de prompts.

**IA**

- tokens;
- custo;
- tempo;
- erro;
- qualidade.

**Produto**

- audits criados;
- audits concluídos;
- audits abandonados;
- relatórios visualizados.

---

# 41. Segurança

Princípios:

- autenticação;
- autorização;
- isolamento por utilizador/organização;
- criptografia em trânsito;
- criptografia em repouso;
- gestão segura de secrets;
- logs sem dados sensíveis desnecessários;
- princípio do menor privilégio.

Nunca colocar chaves de API:

- no frontend;
- em código público;
- em logs;
- em prompts armazenados desnecessariamente.

---

# 42. Multi-tenancy

Mesmo que o MVP tenha utilizadores individuais, a arquitetura deve permitir posteriormente:

```text
User
   ↓
Workspace
   ↓
Products
   ↓
Audits
```

Isso permite futura expansão para:

- agências;
- equipas;
- empresas.

Não é necessário implementar todas as funcionalidades de organização no MVP.

---

# 43. Isolamento de dados

Todo objeto deve possuir uma relação verificável com o proprietário.

Exemplo:

- workspace_id
- user_id

A API nunca deve confiar apenas no ID enviado pelo cliente.

Deve verificar autorização no servidor.

---

# 44. API

A API deve ser orientada a recursos/casos de uso.

Exemplos conceituais:

```text
POST /products
GET  /products/:id

POST /audits
GET  /audits/:id
GET  /audits/:id/status
GET  /audits/:id/report

GET /audits/:id/intents
GET /audits/:id/evidence
GET /audits/:id/opportunities
GET /audits/:id/actions
```

Os endpoints finais podem mudar conforme a stack escolhida.

---

# 45. Report Engine

O relatório deve ser produzido a partir dos dados estruturados.

Não depender de uma única geração livre de IA.

Arquitetura:

```text
Structured Data
      ↓
Analysis Results
      ↓
Report Template
      ↓
Narrative Generation
      ↓
Validation
      ↓
Final Report
```

A IA pode ajudar a explicar resultados.

Mas não deve inventar os resultados.

---

# 46. Regra de geração do relatório

O relatório deve diferenciar visualmente:

**OBSERVADO**

O que foi efetivamente encontrado.

**EVIDÊNCIA**

O material que sustenta a observação.

**HIPÓTESE**

Interpretação possível.

**AÇÃO**

O que vale a pena testar.

Essa separação reduz o risco de transformar inferências em fatos.

---

# 47. Validação do output da IA

Toda saída estruturada de IA deve passar por validação.

Exemplo:

```text
AI Output
    ↓
Schema Validation
    ↓
Business Rules
    ↓
Confidence Check
    ↓
Persist
```

Nunca confiar cegamente em JSON gerado por modelo.

---

# 48. Schema-first

Quando uma etapa precisar produzir dados estruturados, definir primeiro o schema.

Exemplo conceitual:

```text
RecommendationEvent {
    product
    event_type
    position
    context
    confidence
}
```

O modelo deve preencher a estrutura.

Não produzir apenas texto livre e tentar interpretar tudo posteriormente.

---

# 49. Human-in-the-loop

No MVP, algumas etapas devem permitir intervenção humana.

Principalmente:

- aprovação de intents;
- correção de concorrentes;
- revisão de classificação;
- validação de evidências;
- revisão final do relatório.

O objetivo não é esconder a imperfeição do sistema.

É aprender onde a automação falha.

---

# 50. Arquitetura híbrida inicial

A primeira versão pode ser:

```text
              SOFTWARE
                  ↓
             Product Intake
                  ↓
             AI-assisted
                  ↓
              Intent Set
                  ↓
            HUMAN REVIEW
                  ↓
             Prompt Set
                  ↓
            Automated Run
                  ↓
             AI Analysis
                  ↓
            HUMAN REVIEW
                  ↓
              Report
```

Com o tempo:

```text
Human involvement
       ↓
       ↓
       ↓
       └──────────► Automation
```

---

# 51. O que deve ser determinístico

Sempre que possível, manter determinístico:

- cálculos;
- scores;
- agregações;
- contagens;
- posições;
- métricas;
- estados;
- permissões;
- billing;
- identificação de versões.

A IA deve ser utilizada principalmente onde existe:

- interpretação;
- classificação;
- síntese;
- geração semântica.

---

# 52. O que NÃO deve depender de IA

Não deixar uma LLM decidir sozinha:

> "O score final é 83."

O score deve ser calculado por regras reproduzíveis.

A IA pode ajudar a fornecer:

> "Esta evidência parece relevante."

Mas o sistema deve registrar:

- qual evidência;
- qual regra;
- qual confiança;
- qual versão metodológica.

---

# 53. Arquitetura de armazenamento

Separar:

**Raw**

Dados originais.

**Normalized**

Dados estruturados.

**Analytical**

Resultados calculados.

**Presentation**

Dados preparados para o relatório.

Conceitualmente:

```text
RAW
 ↓
NORMALIZED
 ↓
ANALYTICAL
 ↓
PRESENTATION
```

Isso permite reprocessar análises sem perder o dado original.

---

# 54. Reprocessamento

Se a metodologia mudar:

```text
Raw Response
      ↓
New Analyzer
      ↓
New Result
```

Não será necessário executar novamente todas as consultas externas.

Isso pode reduzir significativamente custo.

---

# 55. Histórico

O sistema deve guardar:

- auditorias anteriores;
- metodologia;
- prompts;
- modelos;
- mercados;
- idiomas;
- resultados.

Isso permite futuramente:

> **"Sua Recommendation Share aumentou 14 pontos desde o último audit."**

Mas somente quando houver comparabilidade metodológica suficiente.

---

# 56. Futuro: Monitoring

Depois do MVP:

```text
Audit
 ↓
Baseline
 ↓
Scheduled Snapshot
 ↓
Compare
 ↓
Detect Change
 ↓
Alert
```

Exemplos:

- novo concorrente;
- perda de recomendação;
- mudança de posição;
- nova fonte dominante;
- mudança de caracterização;
- alteração de evidence gap.

---

# 57. Futuro: Experiments

Arquitetura futura:

```text
Baseline
   ↓
Hypothesis
   ↓
Action
   ↓
Waiting Period
   ↓
New Snapshot
   ↓
Comparison
```

Isso permitirá testar:

> **"Depois desta alteração, o padrão de descoberta mudou?"**

Sem afirmar causalidade automaticamente.

---

# 58. Futuro: Discoverability Forecast

O sistema poderá futuramente combinar:

```text
Historical Data
+
Intent Patterns
+
Competitive Signals
+
Evidence
+
Market Changes
```

para produzir hipóteses de cenário.

Mas previsão não deve fazer parte do núcleo do MVP.

---

# 59. Escalabilidade

A arquitetura deve escalar horizontalmente os workers.

```text
             Queue
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
    Worker  Worker  Worker
       │       │       │
       └───────┼───────┘
               ▼
             DB
```

O frontend não deve ser o limitador da execução.

---

# 60. Controle de concorrência

O sistema precisa controlar:

- número de audits simultâneos;
- número de requests por provider;
- rate limits;
- custo máximo por audit;
- retries;
- jobs duplicados.

Pode existir:

- Audit Budget
- Token Budget
- Time Budget
- Request Budget

---

# 61. Limite de custo

Cada audit deve possuir um orçamento máximo.

Exemplo conceitual:

- max_requests
- max_tokens
- max_cost
- max_execution_time

Se o orçamento for excedido:

```text
RUNNING
   ↓
LIMIT_REACHED
```

Isso protege a economia do produto.

---

# 62. Qualidade dos dados

O sistema deve calcular sinais de qualidade.

Exemplos:

- Prompt Quality
- Response Completeness
- Classification Confidence
- Evidence Confidence
- Source Quality
- Analysis Confidence

O relatório deve poder dizer:

> **"Confiança moderada devido ao número limitado de observações."**

Isso é melhor do que apresentar precisão falsa.

---

# 63. Arquitetura de confiança

A confiança do sistema deve ser baseada em:

```text
Quantidade de observações
+
Consistência
+
Qualidade da fonte
+
Concordância
+
Estabilidade
```

Não simplesmente:

> "A IA disse que é 90% confiável."

---

# 64. Stack tecnológica

A escolha definitiva deve ser feita depois de considerar:

- custo;
- velocidade de desenvolvimento;
- familiaridade;
- disponibilidade de SDKs;
- execução assíncrona;
- banco;
- observabilidade;
- escalabilidade;
- facilidade de manutenção.

Uma arquitetura inicial pode ser implementada com:

- Web App
- API
- Relational Database
- Queue
- Workers
- Object Storage
- LLM / Discovery Providers
- Analytics / Monitoring

A stack específica deve ser escolhida pelo princípio:

> **"menos componentes necessários para validar o produto."**

Não introduzir Kubernetes, microservices ou infraestrutura distribuída complexa sem necessidade.

---

# 65. Monólito modular vs microservices

Para o MVP:

**Preferência: Monólito modular + workers assíncronos**

Em vez de:

10 microservices

usar:

```text
1 aplicação principal
+
workers especializados
+
queue
+
database
```

Isso reduz:

- complexidade;
- custo;
- debugging;
- DevOps;
- tempo de desenvolvimento.

---

# 66. Quando separar serviços

Extrair um serviço apenas quando existir uma razão concreta:

- escala independente;
- requisitos de segurança;
- custo;
- isolamento de falhas;
- necessidade operacional.

Não transformar cada módulo conceitual em um microservice.

---

# 67. Arquitetura MVP recomendada

```text
                 ┌─────────────────┐
                 │    WEB CLIENT   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   APPLICATION   │
                 │      API        │
                 └────────┬────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
          Database      Queue      Object Store
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           Worker      Worker      Worker
              │           │           │
              └───────────┼───────────┘
                          ▼
                 External Providers
```

---

# 68. Componentes do MVP

O MVP técnico deve conter somente:

**Core**

- autenticação;
- Product Intake;
- Product Profile;
- Audit Manager;
- Intent Engine;
- Prompt Engine;
- Discovery Engine;
- Response Storage;
- Recommendation Analysis;
- Competitor Analysis;
- Evidence Extraction;
- Gap Detection;
- Opportunity/Action Engine;
- Score Engine;
- Report Engine.

**Infrastructure**

- database;
- queue;
- worker;
- object storage;
- logging;
- monitoring.

---

# 69. Fora do MVP técnico

Não construir inicialmente:

- mobile app;
- browser extension;
- public API;
- white-label;
- enterprise SSO;
- complex organization management;
- automatic publishing;
- full ASO optimization suite;
- predictive engine;
- advanced graph database;
- complex recommendation model próprio;
- dozens of external integrations.

---

# 70. Segurança e privacidade por padrão

O produto pode processar informações potencialmente estratégicas de empresas.

Portanto:

- minimizar coleta;
- limitar acesso;
- separar tenants;
- registrar acesso administrativo;
- evitar exposição de dados em logs;
- definir retenção;
- permitir eliminação;
- proteger credenciais.

A arquitetura deve tratar os dados do cliente como propriedade operacionalmente sensível.

---

# 71. Compliance como arquitetura futura

Dependendo do mercado-alvo, futuramente poderão ser necessários:

- termos de serviço;
- política de privacidade;
- retenção configurável;
- exportação de dados;
- eliminação;
- consentimento;
- contratos empresariais;
- controles de processamento.

Não transformar isso em complexidade excessiva no MVP, mas não construir de forma que seja impossível adicionar posteriormente.

---

# 72. Observabilidade econômica

Além de monitorar servidores, monitorar o negócio:

- Cost / Audit
- Cost / Successful Audit
- Cost / Paid Customer
- Gross Margin / Audit
- Human Minutes / Audit
- Provider Cost / Audit

Um sistema tecnicamente saudável pode ainda ser economicamente inviável.

---

# 73. Observabilidade metodológica

Também medir:

- Intents / Audit
- Prompts / Intent
- Successful Executions
- Failed Executions
- Recommendations Detected
- Sources Detected
- Evidence Items
- Gaps
- Actions

Isso ajuda a identificar quando a metodologia está produzindo pouco sinal.

---

# 74. Testes

A arquitetura deve possuir quatro níveis.

**Unit Tests**

Para:

- scores;
- classificações;
- agregações;
- regras.

**Integration Tests**

Para:

- database;
- queue;
- providers;
- storage.

**Pipeline Tests**

Executar um audit controlado do início ao fim.

**Evaluation Tests**

Comparar resultados da IA contra conjuntos de casos avaliados por humanos.

---

# 75. Evaluation Dataset

Criar progressivamente um conjunto interno de exemplos:

- Prompt
- Response
- Expected Recommendation
- Expected Competitors
- Expected Sources
- Expected Evidence

Esse dataset será importante para detectar regressões.

Ele pode tornar-se parte do moat técnico/metodológico.

---

# 76. Testes de regressão

Sempre que mudar:

- modelo;
- prompt;
- parser;
- classificador;
- metodologia;

executar novamente o conjunto de avaliação.

Perguntar:

> **"O sistema ficou realmente melhor?"**

e não simplesmente:

> "O novo modelo parece mais inteligente?"

---

# 77. Disaster Recovery

O sistema deve conseguir recuperar:

- banco;
- respostas;
- relatórios;
- configurações;
- versões metodológicas.

Backups devem existir antes de qualquer escala significativa.

---

# 78. Princípio de portabilidade

Evitar dependência desnecessária de um único fornecedor.

Os componentes mais importantes devem possuir abstrações:

- Database
- Storage
- LLM Provider
- Discovery Provider
- Email
- Payments
- Analytics

Não é necessário suportar vários fornecedores no primeiro dia.

Mas a arquitetura não deve tornar a migração impossível.

---

# 79. Decisão arquitetural fundamental

A arquitetura não deve ser otimizada para:

> "Quantos milhões de audits conseguiremos executar?"

Deve ser otimizada inicialmente para:

> **"Como conseguimos executar um audit confiável, rastreável e economicamente viável para os primeiros clientes?"**

Escala vem depois da validação.

---

# 80. Arquitetura de evolução

**Fase A — Concierge**

```text
Manual
+
Scripts
+
AI
+
Relatório
```

**Fase B — MVP**

```text
Web
+
API
+
DB
+
Queue
+
Workers
```

**Fase C — Productized**

```text
Monitoring
+
History
+
Experiments
```

**Fase D — Intelligence Platform**

```text
Evidence Graph
+
Historical Dataset
+
Forecast
+
Cross-source Intelligence
```

---

# 81. Principal ativo técnico

O maior ativo futuro provavelmente não será o código.

Será o dataset estruturado:

```text
Intent
+
Prompt
+
Product
+
Competitor
+
Response
+
Recommendation
+
Source
+
Evidence
+
Gap
+
Action
+
Date
+
Market
+
Language
+
Model
+
Outcome
```

Quanto mais histórico de qualidade existir, mais difícil será reproduzir o sistema apenas copiando a interface.

---

# 82. Moat técnico

O possível moat evolui em camadas:

```text
Dados
  ↓
Histórico
  ↓
Normalização
  ↓
Relacionamentos
  ↓
Evidence Graph
  ↓
Avaliações
  ↓
Modelos próprios
  ↓
Intelligence
```

Não assumir que possuir dados automaticamente cria moat.

O valor vem da qualidade, estrutura, histórico e capacidade de gerar decisões melhores.

---

# 83. Princípio de arquitetura do produto

A arquitetura deve sempre preservar esta cadeia:

```text
OBSERVAÇÃO
     ↓
EVIDÊNCIA
     ↓
HIPÓTESE
     ↓
OPORTUNIDADE
     ↓
AÇÃO
     ↓
NOVO SNAPSHOT
     ↓
APRENDIZAGEM
```

Isso transforma o produto de um simples sistema de relatórios em um sistema de aprendizagem.

---

# 84. Critérios de qualidade técnica

Uma versão deve ser considerada tecnicamente aceitável quando:

**Confiabilidade**

- jobs podem falhar e ser repetidos;
- dados não são duplicados;
- estados são consistentes.

**Rastreabilidade**

- cada insight pode ser rastreado até sua origem.

**Reprodutibilidade**

- versões são registradas;
- métricas podem ser recalculadas.

**Economia**

- custo por audit é conhecido.

**Segurança**

- dados estão isolados;
- secrets não são expostos.

**Evolução**

- novos providers podem ser adicionados;
- metodologia pode evoluir;
- histórico não é destruído.

---

# 85. Definition of Done — Arquitetura

A arquitetura está suficientemente definida quando:

- o fluxo completo está documentado;
- entidades principais estão definidas;
- relações estão definidas;
- pipeline está definido;
- execução assíncrona está definida;
- external providers estão abstraídos;
- custos podem ser medidos;
- versionamento existe;
- observabilidade existe;
- segurança básica existe;
- estratégia de testes existe;
- limites do MVP estão claros;
- evolução futura não exige reescrever o núcleo.

---

# 86. Decisões que permanecem deliberadamente abertas

Não congelar prematuramente:

- fornecedor definitivo de LLM;
- fornecedor definitivo de pesquisa/discovery;
- linguagem de backend;
- framework frontend;
- banco específico;
- sistema de filas específico;
- fornecedor de pagamentos;
- sistema definitivo de analytics;
- fórmula definitiva do Discoverability Score.

Essas decisões devem ser tomadas conforme:

custo + qualidade + disponibilidade + velocidade + validação.

---

# 87. Regra contra overengineering

Qualquer componente novo deve responder:

1. Qual problema resolve?
2. É necessário no MVP?
3. Reduz custo?
4. Aumenta qualidade?
5. Reduz risco?
6. Permite uma evolução que realmente esperamos precisar?

Se nenhuma resposta for convincente:

> **"não adicionar."**

---

# 88. Arquitetura final resumida

```text
                        USER
                          │
                          ▼
                    WEB APPLICATION
                          │
                          ▼
                         API
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
       DATABASE          QUEUE         OBJECT STORAGE
                          │
                          ▼
                     JOB WORKERS
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
     INTENTS           DISCOVERY          ANALYSIS
        │                 │                  │
        │                 ▼                  ▼
        │             RESPONSES         RECOMMENDATIONS
        │                                    │
        └────────────────┬───────────────────┘
                         ▼
                      EVIDENCE
                         │
                         ▼
                        GAPS
                         │
                         ▼
                   OPPORTUNITIES
                         │
                         ▼
                       ACTIONS
                         │
                         ▼
                      SCORES
                         │
                         ▼
                       REPORT
                         │
                         ▼
                  HUMAN DECISION
                         │
                         ▼
                    NEW SNAPSHOT
```

---

# 89. Arquitetura estratégica

O sistema deve ser pensado em três níveis:

**Nível 1 — Measurement**

> "O que está acontecendo?"

**Nível 2 — Intelligence**

> "Por que isso pode estar acontecendo?"

**Nível 3 — Decision**

> "O que devemos investigar ou testar?"

A plataforma não deve saltar diretamente do dado para a recomendação.

---

# 90. Regra final da arquitetura

> **"O sistema deve ser capaz de mostrar não apenas a conclusão, mas o caminho que levou até ela."**

Esse princípio deve orientar:

- banco de dados;
- APIs;
- pipeline;
- IA;
- scoring;
- relatórios;
- histórico;
- testes;
- segurança;
- evolução futura.

---

# 91. Encerramento da primeira fase documental

Com este documento, a arquitetura conceitual está suficientemente definida para passar da pergunta:

> "O que queremos construir?"

para:

> **"Como podemos construir isso de forma simples, rastreável, econômica e evolutiva?"**

A sequência completa fica:

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
```

O princípio que conecta os seis documentos é:

> **"Não construir uma ferramenta que apenas mede visibilidade. Construir um sistema que transforma observações de descoberta em inteligência rastreável e, finalmente, em decisões melhores."**
