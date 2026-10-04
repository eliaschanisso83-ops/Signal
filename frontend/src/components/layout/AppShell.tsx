import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuditSession } from '../../state/session';
import { Button } from '../../design-system/components';

/**
 * Shell global: barra superior, banner de demonstração, conteúdo e rodapé.
 * A marca do produto: Signal — signal.biz-flow.cloud
 */
export function AppShell() {
  const { draft, status, resetSession } = useAuditSession();
  const location = useLocation();
  const navigate = useNavigate();

  const hasDraft = Boolean(draft);
  const completed = status === 'COMPLETED';

  function continueUrl(): string | null {
    if (!draft) return null;
    const id = draft.audit.id;
    if (completed) return `/audit/${id}/report`;
    if (status === 'QUEUED' || status === 'RUNNING' || status === 'ANALYZING' || status === 'CANCELLED' || status === 'FAILED') {
      return `/audit/${id}/progress`;
    }
    return `/audit/${id}/profile`;
  }

  const cont = continueUrl();
  const onLanding = location.pathname === '/';

  function startNew() {
    resetSession();
    navigate('/audit/new');
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <div className="demo-banner" role="note">
        Ambiente de demonstração — todos os dados são simulados; nenhum provider externo está conectado nesta fase.
      </div>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Signal — página inicial">
            <img src="/mark.svg" alt="" width={24} height={24} className="brand-icon" aria-hidden="true" />
            <span className="brand-mark">Signal</span>
            <span className="brand-domain">signal.biz-flow.cloud</span>
          </Link>
          <nav className="topnav" aria-label="Navegação principal">
            {cont && (
              <Link className="nav-link" to={cont}>
                {completed ? 'Meu relatório' : 'Continuar auditoria'}
              </Link>
            )}
            {onLanding ? (
              <Button onClick={startNew}>Iniciar auditoria</Button>
            ) : (
              <Button variant="ghost" onClick={startNew}>
                Nova auditoria
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p style={{ margin: 0 }}>
          Signal — Software Discoverability Intelligence · Found → Understood → Evidenced → Recommended → Converted
          {hasDraft && ' · Dados simulados para demonstração'}
        </p>
      </footer>
    </>
  );
}
