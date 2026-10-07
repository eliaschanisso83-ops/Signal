import { Link } from 'react-router-dom';
import { LegalPageLayout, type LegalPageData } from './LegalPageLayout';
import { CONTACT_EMAIL, LEGAL_UPDATED_AT } from './legalConfig';

const page: LegalPageData = {
  metaTitle: 'Política de Privacidade | Signal',
  description:
    'Política de Privacidade do Signal: como coletamos, utilizamos, armazenamos e protegemos dados pessoais, quais direitos você tem e como entrar em contato.',
  path: '/privacy',
  title: 'Política de Privacidade',
  subtitle: 'Como o Signal coleta, utiliza, armazena e protege os seus dados.',
  updatedAt: LEGAL_UPDATED_AT,
  sections: [
    {
      id: 'introducao',
      title: 'Introdução',
      blocks: [
        {
          kind: 'p',
          text:
            'Esta Política de Privacidade descreve como o Signal coleta, utiliza, armazena, compartilha e protege dados pessoais quando você navega pelo produto ou utiliza a plataforma, disponível em signal.biz-flow.cloud.',
        },
        {
          kind: 'p',
          text: (
            <>
              Ao utilizar o Signal, você declara ter lido e compreendido esta Política. O uso do
              produto também está sujeito aos nossos <Link to="/terms">Termos de Uso</Link>, que
              estabelecem as regras de utilização da plataforma.
            </>
          ),
        },
      ],
    },
    {
      id: 'quem-somos',
      title: 'Quem somos',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal é uma plataforma independente de Software Discoverability Intelligence: ela analisa como assistentes de IA, sistemas de busca e marketplaces recomendam produtos e apresenta notas, evidências e recomendações com base na metodologia do próprio produto.',
        },
        {
          kind: 'p',
          text: (
            <>
              O canal oficial de contato do serviço é o e-mail{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. O produto não publica
              endereço físico ou telefone de contato.
            </>
          ),
        },
      ],
    },
    {
      id: 'dados-que-coletamos',
      title: 'Dados que podemos coletar',
      blocks: [
        {
          kind: 'p',
          text: 'Os dados tratados dependem de como você usa o Signal: apenas navegando pelas páginas públicas ou com uma conta cadastrada.',
        },
      ],
      subsections: [
        {
          id: 'dados-conta',
          title: 'Dados de conta',
          blocks: [
            {
              kind: 'p',
              text: (
                <>
                  Ao criar uma conta, você informa um endereço de e-mail e uma senha. Esses dados
                  são usados para identificar você, manter o seu acesso e vincular as auditorias
                  que você executa. A senha é tratada pelo provedor de autenticação e não é
                  mantida em texto pelas aplicações do Signal.
                </>
              ),
            },
          ],
        },
        {
          id: 'nome-e-email',
          title: 'Nome e endereço de e-mail',
          blocks: [
            {
              kind: 'p',
              text:
                'O endereço de e-mail é o identificador principal da conta e é usado nas comunicações do serviço, como confirmação de cadastro, redefinição de senha e avisos operacionais.',
            },
            {
              kind: 'p',
              text:
                'Um nome de exibição não é obrigatório no cadastro. Quando você se autentica pelo Google, o Signal pode receber o seu nome de perfil e o e-mail associados à conta Google, conforme as permissões concedidas naquele momento.',
            },
          ],
        },
        {
          id: 'dados-autenticacao',
          title: 'Dados de autenticação',
          blocks: [
            {
              kind: 'p',
              text:
                'São tratados os dados necessários para realizar e manter o login: identificador da conta, e-mail, método de autenticação utilizado (e-mail e senha ou Google), horários de acesso e tokens de sessão. No login com Google, o Signal recebe apenas as informações básicas devolvidas pelo provedor para criar a sessão.',
            },
          ],
        },
        {
          id: 'dados-de-uso',
          title: 'Dados fornecidos durante o uso do Signal',
          blocks: [
            {
              kind: 'p',
              text:
                'Para executar uma auditoria, você informa dados do produto: endereço URL, plataforma, mercado, idioma, concorrentes, intenções de descoberta, prompts e os demais campos dos formulários do produto. Também ficam registradas as escolhas que você faz na interface durante a navegação.',
            },
          ],
        },
        {
          id: 'dados-auditorias',
          title: 'Informações relacionadas às auditorias realizadas',
          blocks: [
            {
              kind: 'p',
              text:
                'O Signal mantém registros das auditorias que você executa — entradas, andamento, notas, evidências, hipóteses, recomendações e relatórios — para que você possa retomar o trabalho, acessar o resultado depois e comparar execuções. Esses registros são armazenados na infraestrutura do serviço.',
            },
          ],
        },
        {
          id: 'dados-tecnicos',
          title: 'Dados técnicos básicos',
          blocks: [
            {
              kind: 'p',
              text:
                'Para operar com segurança, a infraestrutura do serviço pode registrar dados técnicos como endereço IP, data e hora das requisições, tipo de navegador e dispositivo, sistema operacional e registros de acesso e erro. Esses dados são utilizados para segurança, diagnóstico e funcionamento do produto.',
            },
          ],
        },
      ],
    },
    {
      id: 'como-utilizamos',
      title: 'Como utilizamos os dados',
      blocks: [
        { kind: 'p', text: 'Utilizamos os dados para:' },
        {
          kind: 'ul',
          items: [
            'Criar e administrar contas, incluindo cadastro, login, sessão e recuperação de senha;',
            'Fornecer as funcionalidades de auditoria, permitindo executar, salvar e retomar análises;',
            'Processar e apresentar resultados, calculando notas, gerando evidências e montando os relatórios;',
            'Melhorar o produto, entendendo como o serviço é utilizado para aprimorar interface, metodologia e funcionalidades;',
            'Garantir segurança, prevenção de abuso e fraude, protegendo contas e detectando usos indevidos;',
            'Enviar comunicação relacionada ao serviço, como confirmações, redefinições de senha e avisos operacionais.',
          ],
        },
      ],
    },
    {
      id: 'autenticacao',
      title: 'Autenticação',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              Você pode se autenticar pelo e-mail e senha e, quando disponível no produto, usando
              sua conta Google. A autenticação é processada por um provedor especializado de
              identidade — no Signal, o Supabase.
            </>
          ),
        },
        {
          kind: 'p',
          text:
            'No login com Google, o Signal recebe apenas as informações básicas necessárias para criar a sua sessão, como e-mail e nome de perfil. O Signal não solicita, não recebe e não armazena a sua senha do Google.',
        },
        {
          kind: 'p',
          text:
            'A sessão é mantida no seu navegador para que você não precise entrar novamente a cada visita. Você pode sair da conta a qualquer momento pelo menu do topo.',
        },
      ],
    },
    {
      id: 'terceiros',
      title: 'Dados de terceiros e integrações',
      blocks: [
        {
          kind: 'p',
          text: 'Parte do funcionamento do Signal depende de serviços externos contratados para operar a plataforma. Atualmente, esses serviços são:',
        },
        {
          kind: 'ul',
          items: [
            'Supabase — autenticação de usuários e armazenamento de dados do serviço;',
            'Vercel — hospedagem e entrega da aplicação.',
          ],
        },
        {
          kind: 'p',
          text:
            'Esses provedores tratam dados conforme as próprias políticas de privacidade e termos de uso, recomendados à consulta. O Signal não utiliza integrações de publicidade nem de rastreamento publicitário.',
        },
        {
          kind: 'p',
          text:
            'Se novas integrações forem incorporadas ao produto, esta seção será atualizada para refleti-las.',
        },
      ],
    },
    {
      id: 'armazenamento-e-seguranca',
      title: 'Armazenamento e segurança',
      blocks: [
        {
          kind: 'p',
          text:
            'Os dados são armazenados na infraestrutura do serviço, com acesso restrito por credenciais e com controles de permissão no nível do banco de dados. A comunicação entre o seu navegador e o serviço é criptografada em trânsito (HTTPS) e as chaves privadas de servidor não são expostas ao navegador.',
        },
        {
          kind: 'p',
          text:
            'Adotamos medidas de segurança compatíveis com a natureza dos dados tratados: controle de acesso, minimização de dados, separação de ambientes e boas práticas de desenvolvimento, para proteger as informações contra acesso não autorizado, perda ou alteração.',
        },
        {
          kind: 'p',
          text:
            'Nenhum método de transmissão ou armazenamento é totalmente seguro. Por isso, não prometemos segurança absoluta — mas trabalhamos para manter proteções adequadas e revisá-las periodicamente.',
        },
      ],
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de dados',
      blocks: [
        {
          kind: 'p',
          text: 'O Signal não vende dados pessoais. Os dados podem ser compartilhados somente quando necessário:',
        },
        {
          kind: 'ul',
          items: [
            'Com os provedores necessários à operação do serviço (hospedagem, autenticação e armazenamento), descritos na seção sobre terceiros;',
            'Quando exigido por lei, decisão judicial ou requisição de autoridade competente;',
            'Para proteger os direitos, a segurança e a integridade do Signal, dos usuários ou de terceiros, inclusive em casos de prevenção a fraude e abuso;',
            'Em caso de reorganização do serviço (fusão, aquisição ou transferência de ativos), com dados sujeitos a compromissos de privacidade compatíveis com esta Política.',
          ],
        },
      ],
    },
    {
      id: 'retencao',
      title: 'Retenção de dados',
      blocks: [
        {
          kind: 'p',
          text:
            'Os dados são mantidos pelo período necessário para fornecer o serviço, cumprir obrigações legais, resolver disputas e fazer cumprir os nossos termos.',
        },
        {
          kind: 'p',
          text:
            'Enquanto a conta estiver ativa, os dados vinculados a ela permanecem armazenados para que o serviço funcione. Após a exclusão da conta, os dados são removidos ou anonimizados dentro de um prazo razoável, ressalvadas as cópias de segurança (backups), mantidas por período limitado, e as informações que precisem ser retidas por obrigação legal ou para resolver disputas.',
        },
      ],
    },
    {
      id: 'direitos-do-usuario',
      title: 'Direitos do usuário',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              Conforme a legislação aplicável à sua jurisdição — como a Lei Geral de Proteção de
              Dados (LGPD), no Brasil —, você pode ter os seguintes direitos:
            </>
          ),
        },
        {
          kind: 'ul',
          items: [
            'Acesso — saber quais dados seus são tratados e obter uma cópia deles;',
            'Correção — solicitar a correção de dados incompletos, inexatos ou desatualizados;',
            'Exclusão — solicitar a exclusão dos seus dados, quando aplicável;',
            'Informação — pedir detalhes sobre o tratamento dos dados, como finalidade, compartilhamento e prazo de retenção;',
            'Outros direitos previstos na legislação da sua jurisdição, como portabilidade, oposição, revogação de consentimento e revisão de decisões automatizadas, quando aplicáveis.',
          ],
        },
        {
          kind: 'p',
          text: (
            <>
              Para exercer esses direitos, envie sua solicitação para{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> descrevendo o pedido.
              Podemos solicitar informações adicionais para confirmar a sua identidade antes de
              atender à requisição.
            </>
          ),
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies e tecnologias semelhantes',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal não utiliza cookies de publicidade nem ferramentas de terceiros para rastreamento publicitário, e não possui analytics de terceiros integrado ao produto.',
        },
        {
          kind: 'p',
          text:
            'Para o funcionamento do serviço, usamos armazenamento local no navegador (localStorage), que guarda o idioma escolhido, o andamento da auditoria em que você está trabalhando e a sessão de autenticação. Esses dados ficam no seu dispositivo e podem ser removidos a qualquer momento pelas configurações do navegador, ao apagar os dados do site.',
        },
        {
          kind: 'p',
          text: 'Se o produto passar a utilizar cookies não essenciais, esta Política será atualizada antes da mudança entrar em vigor.',
        },
      ],
    },
    {
      id: 'privacidade-de-criancas',
      title: 'Privacidade de crianças',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal é destinado a profissionais e organizações e não é voltado a crianças. Não coletamos intencionalmente dados de crianças.',
        },
        {
          kind: 'p',
          text: (
            <>
              Se você acreditar que uma criança forneceu dados pelo serviço, escreva para{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> para que a situação seja
              avaliada e, quando aplicável, os dados sejam removidos.
            </>
          ),
        },
      ],
    },
    {
      id: 'transferencias-internacionais',
      title: 'Transferências internacionais de dados',
      blocks: [
        {
          kind: 'p',
          text:
            'Os provedores que sustentam o serviço podem operar infraestrutura em países diferentes do seu, o que implica o tratamento de dados fora da sua jurisdição.',
        },
        {
          kind: 'p',
          text:
            'Nesses casos, as transferências ocorrem conforme as práticas dos provedores e as exigências da legislação aplicável, incluindo mecanismos de proteção reconhecidos. Ao utilizar o Signal, você entende que os dados podem ser processados em outros países, onde as leis de proteção de dados podem ser diferentes das do seu país.',
        },
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações nesta Política',
      blocks: [
        {
          kind: 'p',
          text:
            'Esta Política pode ser atualizada para refletir mudanças no serviço, na legislação ou nas práticas de tratamento de dados. A data da última revisão aparece no final da página. Alterações relevantes também podem ser comunicadas pelo produto ou por e-mail.',
        },
        {
          kind: 'p',
          text:
            'Recomendamos revisar esta página periodicamente. O uso continuado do Signal após a entrada em vigor de alterações indica a aceitação da versão atualizada.',
        },
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              Para dúvidas sobre esta Política, pedidos relacionados aos seus dados ou exercício de
              direitos, fale conosco pelo e-mail{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </>
          ),
        },
        {
          kind: 'p',
          text: 'Responderemos dentro de um prazo razoável, considerando a natureza da solicitação.',
        },
      ],
    },
  ],
};

export function PrivacyPage() {
  return <LegalPageLayout page={page} />;
}
