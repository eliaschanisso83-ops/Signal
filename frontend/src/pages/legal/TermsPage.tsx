import { Link } from 'react-router-dom';
import { LegalPageLayout, type LegalPageData } from './LegalPageLayout';
import { CONTACT_EMAIL, LEGAL_UPDATED_AT } from './legalConfig';

const page: LegalPageData = {
  metaTitle: 'Termos de Uso | Signal',
  description:
    'Termos de Uso do Signal: regras para utilização da plataforma, responsabilidades do usuário, uso permitido e proibido, resultados das auditorias e limitações do serviço.',
  path: '/terms',
  title: 'Termos de Uso',
  subtitle: 'Regras para utilização da plataforma Signal.',
  updatedAt: LEGAL_UPDATED_AT,
  sections: [
    {
      id: 'aceitacao',
      title: 'Aceitação dos Termos',
      blocks: [
        {
          kind: 'p',
          text:
            'Ao acessar ou utilizar o Signal, você concorda com estes Termos de Uso. Se não concordar com alguma disposição, não utilize o serviço.',
        },
        {
          kind: 'p',
          text: (
            <>
              A nossa <Link to="/privacy">Política de Privacidade</Link> descreve como os dados são
              tratados e integra estes Termos.
            </>
          ),
        },
      ],
    },
    {
      id: 'sobre-o-signal',
      title: 'Sobre o Signal',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal é uma plataforma de Software Discoverability Intelligence, disponível em signal.biz-flow.cloud. Ela analisa como assistentes de IA, sistemas de busca e marketplaces recomendam produtos e apresenta notas, evidências e recomendações com base na metodologia do próprio produto.',
        },
        {
          kind: 'p',
          text:
            'Quando o produto indicar uma execução em modo de demonstração, os números exibidos são simulados e servem para ilustrar o funcionamento da metodologia.',
        },
      ],
    },
    {
      id: 'elegibilidade',
      title: 'Elegibilidade para utilização',
      blocks: [
        { kind: 'p', text: 'Para utilizar o Signal, você precisa:' },
        {
          kind: 'ul',
          items: [
            'Ter capacidade legal para aceitar estes Termos — na dúvida, ser maior de idade conforme a legislação aplicável;',
            'Fornecer informações verdadeiras e atualizadas na criação da conta;',
            'Se estiver agindo em nome de uma organização, estar autorizado a representá-la;',
            'Utilizar o serviço em conformidade com a legislação aplicável.',
          ],
        },
      ],
    },
    {
      id: 'conta-e-seguranca',
      title: 'Criação e segurança da conta',
      blocks: [
        {
          kind: 'p',
          text:
            'O cadastro exige um endereço de e-mail válido e uma senha. Você é responsável por manter suas credenciais confidenciais e por todas as atividades realizadas a partir da sua conta.',
        },
        {
          kind: 'p',
          text: (
            <>
              Se detectar ou suspeitar de acesso não autorizado, avise imediatamente pelo e-mail{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Podemos suspender acessos
              enquanto investigamos incidentes de segurança.
            </>
          ),
        },
      ],
    },
    {
      id: 'uso-permitido',
      title: 'Uso permitido',
      blocks: [
        {
          kind: 'p',
          text: 'Você pode utilizar o Signal de forma lícita, para fins compatíveis com a finalidade da plataforma, por exemplo:',
        },
        {
          kind: 'ul',
          items: [
            'Criar e executar auditorias de discoverability sobre o seu produto ou sobre outros produtos, para fins de estudo e comparação;',
            'Analisar as notas, evidências e recomendações apresentadas nos relatórios;',
            'Usar os resultados para apoiar decisões internas de produto, marketing e estratégia;',
            'Avaliar a metodologia e o funcionamento do serviço.',
          ],
        },
      ],
    },
    {
      id: 'uso-proibido',
      title: 'Uso proibido',
      blocks: [
        { kind: 'p', text: 'É proibido utilizar o Signal para:' },
        {
          kind: 'ul',
          items: [
            'Fins ilegais ou que violem leis, regulamentos ou direitos de terceiros;',
            'Tentar comprometer a segurança da plataforma, inclusive mediante ataques, exploração de vulnerabilidades ou engenharia reversa, salvo autorização escrita;',
            'Abusar da infraestrutura, com uso automatizado ou em volume que prejudique a disponibilidade do serviço para outros usuários;',
            'Inserir conteúdo malicioso nos campos e formulários do produto, como vírus, códigos ofensivos ou links perigosos;',
            'Praticar fraude ou falsificar informações, inclusive na criação de contas ou na apresentação de dados de auditoria;',
            'Tentar obter acesso não autorizado a contas, dados ou sistemas do Signal ou de outros usuários;',
            'Utilizar o serviço de modo que prejudique outros usuários ou o funcionamento do serviço;',
            'Violar direitos de propriedade intelectual ou outros direitos de terceiros.',
          ],
        },
      ],
    },
    {
      id: 'auditorias-e-resultados',
      title: 'Auditorias e resultados',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal gera resultados — notas, classificações, evidências, hipóteses e recomendações — com base nos dados que você informa, nas fontes observadas e na metodologia disponível no produto.',
        },
        {
          kind: 'p',
          text:
            'Esses resultados são informações analíticas de apoio à sua tomada de decisão. Eles não constituem garantia de desempenho, de posicionamento em buscas, de aquisição de usuários, de visibilidade em mecanismos de busca ou de recomendação por sistemas de inteligência artificial.',
        },
        {
          kind: 'p',
          text:
            'O Signal não é garantia de resultado comercial. A aplicação das recomendações e seus efeitos dependem de fatores externos ao serviço, como mercado, concorrência, execução das ações e decisões de terceiros.',
        },
      ],
    },
    {
      id: 'conteudo-do-usuario',
      title: 'Conteúdo fornecido pelo usuário',
      blocks: [
        {
          kind: 'p',
          text:
            'Você permanece responsável por todo o conteúdo, dados, URLs, informações e materiais que fornece ao Signal. Você deve possuir os direitos necessários — ou a autorização do titular — para fornecer esses dados.',
        },
        {
          kind: 'p',
          text:
            'O envio de conteúdo não transfere a sua propriedade ao Signal. Concedemos ao serviço apenas os direitos necessários para armazenar, processar e exibir esse conteúdo para você, enquanto a relação estiver vigente.',
        },
      ],
    },
    {
      id: 'propriedade-intelectual',
      title: 'Propriedade intelectual',
      blocks: [
        {
          kind: 'p',
          text:
            'O Signal — incluindo marca, software, interface, código, elementos visuais, textos, metodologia e demais conteúdos próprios — é protegido pelos direitos de propriedade intelectual aplicáveis.',
        },
        {
          kind: 'p',
          text:
            'Estes Termos concedem apenas uma licença limitada, não exclusiva, não transferível e revogável para utilizar o serviço enquanto vigorarem. Nenhum outro direito é concedido: reprodução, distribuição ou exploração comercial do Signal sem autorização prévia é proibida.',
        },
      ],
    },
    {
      id: 'servicos-de-terceiros',
      title: 'Serviços de terceiros',
      blocks: [
        {
          kind: 'p',
          text:
            'Determinadas funcionalidades do Signal dependem de serviços externos, como hospedagem e autenticação (descritos na Política de Privacidade). Esses serviços possuem os seus próprios termos e políticas de privacidade.',
        },
        {
          kind: 'p',
          text:
            'Recomendamos consultar esses documentos. O uso do Signal implica o aceite do que for aplicável às integrações que você acionar, na medida em que forem necessárias ao funcionamento do serviço.',
        },
      ],
    },
    {
      id: 'disponibilidade',
      title: 'Disponibilidade do serviço',
      blocks: [
        {
          kind: 'p',
          text:
            'O serviço pode sofrer interrupções, manutenção (programada ou emergencial), alterações, erros ou indisponibilidade, total ou parcial, a qualquer momento.',
        },
        {
          kind: 'p',
          text:
            'Não garantimos disponibilidade contínua, ininterrupta ou livre de falhas. Podemos modificar, suspender ou descontinuar funcionalidades, total ou parcialmente, avisando de forma razoável sempre que possível.',
        },
      ],
    },
    {
      id: 'planos-e-pagamentos',
      title: 'Planos, pagamentos e funcionalidades',
      blocks: [
        {
          kind: 'p',
          text:
            'No momento, o Signal não oferece planos pagos nem cobra pelas funcionalidades disponíveis: o produto é utilizado gratuitamente nesta fase.',
        },
        {
          kind: 'p',
          text:
            'Como não há cobranças, não há política de reembolso aplicável. Caso funcionalidades pagas sejam introduzidas no futuro, preços, condições e eventuais regras de cancelamento serão informados previamente no produto, e aquelas funcionalidades passarão a obedecer a condições específicas.',
        },
      ],
    },
    {
      id: 'suspensao-e-encerramento',
      title: 'Suspensão ou encerramento de contas',
      blocks: [
        {
          kind: 'p',
          text:
            'Você pode solicitar o encerramento da sua conta a qualquer momento pelo e-mail de contato, e os dados serão tratados conforme a Política de Privacidade.',
        },
        {
          kind: 'p',
          text:
            'Podemos suspender ou encerrar contas em caso de violação destes Termos, uso indevido do serviço, risco de segurança, atividade fraudulenta ou quando exigido por lei. Você pode solicitar a revisão de uma suspensão pelo mesmo canal de contato.',
        },
      ],
    },
    {
      id: 'limitacao-de-responsabilidade',
      title: 'Limitação de responsabilidade',
      blocks: [
        {
          kind: 'p',
          text:
            'O serviço é fornecido "no estado em que se encontra". Na medida permitida pela legislação aplicável, o Signal não se responsabiliza por decisões tomadas exclusivamente com base nos resultados apresentados, por perda de lucros, receitas ou oportunidades, por interrupções do serviço, por atos de terceiros ou por conteúdo fornecido pelo próprio usuário.',
        },
        {
          kind: 'p',
          text:
            'Esta limitação não exclui responsabilidades que não possam ser afastadas pela lei, inclusive as decorrentes de dolo ou de obrigações impostas de forma imperativa pela legislação aplicável.',
        },
      ],
    },
    {
      id: 'indenizacao',
      title: 'Indenização',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              Na medida em que a lei aplicável permitir, você concorda em indenizar o Signal por
              reclamações, danos e despesas razoáveis decorrentes do uso indevido do serviço, da
              violação destes Termos ou do fornecimento de conteúdo que viole direitos de terceiros.
            </>
          ),
        },
      ],
    },
    {
      id: 'alteracoes-dos-termos',
      title: 'Alterações dos Termos',
      blocks: [
        {
          kind: 'p',
          text:
            'Estes Termos podem ser atualizados para refletir mudanças no serviço ou na legislação. A data da última revisão aparece no final da página; alterações relevantes serão comunicadas pelo produto ou por e-mail, com antecedência razoável quando possível.',
        },
        {
          kind: 'p',
          text:
            'O uso continuado do Signal após a vigência das alterações indica a aceitação da versão atualizada. Se não concordar, interrompa o uso do serviço e, quando aplicável, solicite o encerramento da conta.',
        },
      ],
    },
    {
      id: 'lei-applicavel',
      title: 'Lei aplicável e resolução de disputas',
      blocks: [
        {
          kind: 'p',
          text:
            'Este ponto ainda precisa ser fixado pelo responsável pelo serviço: a lei aplicável e o foro competente para resolver disputas decorrentes destes Termos não estão definidos até o momento, pois o projeto não possui uma jurisdição empresarial estabelecida.',
        },
        {
          kind: 'p',
          text:
            'Enquanto isso, qualquer discussão será tratada de boa-fé, mediante contato inicial pelo canal da seção Contato, na tentativa de solução consensual, sem prejuízo do foro e da legislação que venham a ser definidos ou que sejam aplicáveis de forma imperativa ao usuário.',
        },
        {
          kind: 'p',
          text:
            'Quando a jurisdição for definida, esta seção será atualizada com a lei aplicável, o foro competente e o procedimento de resolução de disputas.',
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
              Para dúvidas sobre estes Termos, solicitações ou questões relacionadas, fale conosco
              pelo e-mail <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </>
          ),
        },
      ],
    },
  ],
};

export function TermsPage() {
  return <LegalPageLayout page={page} />;
}
