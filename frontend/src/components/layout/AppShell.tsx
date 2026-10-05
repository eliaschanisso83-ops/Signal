import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuditSession } from '../../state/session';
import { Button, LinkButton } from '../../design-system/components';

/**
 * Shell global: barra superior, banner de demonstração, conteúdo e rodapé.
 * A marca do produto: Signal — signal.biz-flow.cloud
 */
export function AppShell() {
  const { draft, status, resetSession } = useAuditSession();
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      topbar.classList.remove('is-scrolled');
    };
  }, []);

  /* links âncora vindos de outras rotas (ex.: footer → /#metricas) */
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(raf);
  }, [location]);

  function startNew() {
    resetSession();
    navigate('/audit/new');
  }

  return (
    <div className={onLanding ? 'lp-chrome' : undefined}>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
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
            {onLanding && (
              <>
                <a className="nav-link lp-anchor" href="#problema">
                  Problema
                </a>
                <a className="nav-link lp-anchor" href="#como-funciona">
                  Como funciona
                </a>
                <a className="nav-link lp-anchor" href="#metricas">
                  Métricas
                </a>
              </>
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
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="brand" aria-label="Signal — página inicial">
                <img src="/mark.svg" alt="" width={24} height={24} className="brand-icon" aria-hidden="true" />
                <span className="brand-mark">Signal</span>
                <span className="brand-domain">signal.biz-flow.cloud</span>
              </Link>
              <p className="footer-desc">
                Software Discoverability Intelligence — audite como assistentes de IA, busca e marketplaces recomendam o
                seu produto, com evidências rastreáveis e ações priorizadas.
              </p>
              <LinkButton to="/audit/new" size="sm">
                Iniciar auditoria
              </LinkButton>
            </div>

            <nav className="footer-col" aria-label="Produto">
              <h2 className="footer-title">Produto</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/#problema">O problema</Link>
                </li>
                <li>
                  <Link to="/#como-funciona">Como funciona</Link>
                </li>
                <li>
                  <Link to="/#metricas">Métricas e evidências</Link>
                </li>
              </ul>
            </nav>

            <nav className="footer-col" aria-label="Demonstração">
              <h2 className="footer-title">Demonstração</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/audit/new">Nova auditoria</Link>
                </li>
                {cont && (
                  <li>
                    <Link to={cont}>{completed ? 'Meu relatório' : 'Continuar auditoria'}</Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Signal — signal.biz-flow.cloud</span>
            <span>Metodologia v1.0 · demonstração com dados simulados</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
