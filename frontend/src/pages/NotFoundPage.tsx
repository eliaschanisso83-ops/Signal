import { Link } from 'react-router-dom';
import { Card, LinkButton } from '../design-system/components';
import { useAuditSession } from '../state/session';

export function NotFoundPage() {
  const { draft, status } = useAuditSession();
  const fallback = draft ? `/audit/${draft.audit.id}/${status === 'COMPLETED' ? 'report' : 'progress'}` : '/';

  return (
    <div className="shell">
      <Card>
        <div className="page-eyebrow">Erro 404</div>
        <h1>Página não encontrada</h1>
        <p className="muted">O endereço acessado não existe nesta demonstração.</p>
        <div className="page-actions">
          <LinkButton to={fallback}>
            {draft ? 'Voltar para a auditoria' : 'Voltar ao início'}
          </LinkButton>
          <Link to="/" className="small">
            Página inicial
          </Link>
        </div>
      </Card>
    </div>
  );
}
