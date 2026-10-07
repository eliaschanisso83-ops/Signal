import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuditSession } from '../../state/session';
import { useAuth } from '../../state/auth';
import { isAuthEnabled, signOut } from '../../services/auth';
import { Button, LinkButton } from '../../design-system/components';
import { LanguageSwitcher } from '../LanguageSwitcher';

/**
 * Shell global: barra superior, banner de demonstração, conteúdo e rodapé.
 * A marca do produto: Signal — signal.biz-flow.cloud
 */
export function AppShell() {
  const { draft, status, resetSession } = useAuditSession();
  const { status: authStatus, email, displayName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const [signingOut, setSigningOut] = useState(false);
  const authOn = isAuthEnabled();

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

  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      resetSession();
      navigate('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className={onLanding ? 'lp-chrome' : 'app-chrome'}>
      <a className="skip-link" href="#main">
        {t('skipToContent')}
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label={t('brand.home')}>
            <img src="/mark.svg" alt="" width={24} height={24} className="brand-icon" aria-hidden="true" />
            <span className="brand-mark">Signal</span>
            <span className="brand-domain">signal.biz-flow.cloud</span>
          </Link>
          <nav className="topnav" aria-label={t('nav.main')}>
            {cont && (
              <Link className="nav-link" to={cont}>
                {completed ? t('nav.myReport') : t('nav.continueAudit')}
              </Link>
            )}
            {onLanding && (
              <>
                <a className="nav-link lp-anchor" href="#problema">
                  {t('nav.problem')}
                </a>
                <a className="nav-link lp-anchor" href="#como-funciona">
                  {t('nav.howItWorks')}
                </a>
                <a className="nav-link lp-anchor" href="#metricas">
                  {t('nav.metrics')}
                </a>
              </>
            )}
            {authOn && (
              authStatus === 'authenticated' ? (
                <>
                  <span className="nav-user" title={email ?? undefined}>
                    {displayName}
                  </span>
                  <Button variant="ghost" size="sm" onClick={onSignOut} loading={signingOut}>
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <Link className="nav-link" to="/login">
                  {t('nav.login')}
                </Link>
              )
            )}
            <LanguageSwitcher id="lang-topbar" />
            {onLanding ? (
              <Button onClick={startNew}>{t('nav.startAudit')}</Button>
            ) : (
              <Button variant="ghost" onClick={startNew}>
                {t('nav.newAudit')}
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
              <Link to="/" className="brand" aria-label={t('brand.home')}>
                <img src="/mark.svg" alt="" width={24} height={24} className="brand-icon" aria-hidden="true" />
                <span className="brand-mark">Signal</span>
                <span className="brand-domain">signal.biz-flow.cloud</span>
              </Link>
              <p className="footer-desc">{t('footer.description')}</p>
              <LinkButton to="/audit/new" size="sm">
                {t('footer.startAudit')}
              </LinkButton>
            </div>

            <nav className="footer-col" aria-label={t('footer.product.title')}>
              <h2 className="footer-title">{t('footer.product.title')}</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/#problema">{t('footer.product.problem')}</Link>
                </li>
                <li>
                  <Link to="/#como-funciona">{t('footer.product.howItWorks')}</Link>
                </li>
                <li>
                  <Link to="/#metricas">{t('footer.product.metrics')}</Link>
                </li>
              </ul>
            </nav>

            <nav className="footer-col" aria-label={t('footer.demo.title')}>
              <h2 className="footer-title">{t('footer.demo.title')}</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/audit/new">{t('footer.demo.newAudit')}</Link>
                </li>
                {cont && (
                  <li>
                    <Link to={cont}>{completed ? t('footer.demo.myReport') : t('footer.demo.continueAudit')}</Link>
                  </li>
                )}
              </ul>
            </nav>

            <nav className="footer-col" aria-label={t('footer.legal.title')}>
              <h2 className="footer-title">{t('footer.legal.title')}</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/privacy">{t('footer.legal.privacy')}</Link>
                </li>
                <li>
                  <Link to="/terms">{t('footer.legal.terms')}</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>{t('footer.copyright')}</span>
            <span className="footer-meta">
              <span>{t('footer.bottom')}</span>
              <LanguageSwitcher id="lang-footer" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
