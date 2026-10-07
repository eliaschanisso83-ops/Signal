import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuditSessionProvider, useAuditSession } from './state/session';
import { AuthProvider } from './state/auth';
import { AppShell } from './components/layout/AppShell';
import { RequireAnonymous, RequireAuth, RequireDraft, RequireReport } from './components/layout/Guards';
import { ReportShell } from './components/layout/ReportShell';
import { LandingPage } from './pages/LandingPage';
import { NewAuditPage } from './pages/NewAuditPage';
import { ProductProfilePage } from './pages/ProductProfilePage';
import { IntentsPage } from './pages/IntentsPage';
import { PromptsPage } from './pages/PromptsPage';
import { AuditProgressPage } from './pages/AuditProgressPage';
import { AuditReportPage } from './pages/report/AuditReportPage';
import { EvidencePage } from './pages/report/EvidencePage';
import { OpportunitiesPage } from './pages/report/OpportunitiesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';

/** /audit/:auditId → progress ou report conforme o status. */
function AuditIndexRedirect() {
  const { auditId } = useParams();
  const { draft, status } = useAuditSession();
  if (!draft || draft.audit.id !== auditId) return <Navigate to="/audit/new" replace />;
  return <Navigate to={`/audit/${auditId}/${status === 'COMPLETED' ? 'report' : 'progress'}`} replace />;
}

export default function App() {
  return (
    <AuditSessionProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<RequireAnonymous><LoginPage /></RequireAnonymous>} />
              <Route path="/register" element={<RequireAnonymous><RegisterPage /></RequireAnonymous>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/audit/new" element={<RequireAuth><NewAuditPage /></RequireAuth>} />
              <Route
                path="/audit/:auditId"
                element={
                  <RequireAuth>
                    <AuditIndexRedirect />
                  </RequireAuth>
                }
              />
              <Route
                path="/audit/:auditId/profile"
                element={
                  <RequireAuth>
                    <RequireDraft>
                      <ProductProfilePage />
                    </RequireDraft>
                  </RequireAuth>
                }
              />
              <Route
                path="/audit/:auditId/intents"
                element={
                  <RequireAuth>
                    <RequireDraft>
                      <IntentsPage />
                    </RequireDraft>
                  </RequireAuth>
                }
              />
              <Route
                path="/audit/:auditId/prompts"
                element={
                  <RequireAuth>
                    <RequireDraft>
                      <PromptsPage />
                    </RequireDraft>
                  </RequireAuth>
                }
              />
              <Route
                path="/audit/:auditId/progress"
                element={
                  <RequireAuth>
                    <RequireDraft>
                      <AuditProgressPage />
                    </RequireDraft>
                  </RequireAuth>
                }
              />
              <Route
                path="/audit/:auditId/report"
                element={
                  <RequireAuth>
                    <RequireReport>
                      <ReportShell />
                    </RequireReport>
                  </RequireAuth>
                }
              >
                <Route index element={<AuditReportPage />} />
                <Route path="evidence" element={<EvidencePage />} />
                <Route path="opportunities" element={<OpportunitiesPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AuditSessionProvider>
  );
}
