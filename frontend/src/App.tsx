import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuditSessionProvider, useAuditSession } from './state/session';
import { AppShell } from './components/layout/AppShell';
import { RequireDraft, RequireReport } from './components/layout/Guards';
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
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit/new" element={<NewAuditPage />} />
            <Route path="/audit/:auditId" element={<AuditIndexRedirect />} />
            <Route
              path="/audit/:auditId/profile"
              element={
                <RequireDraft>
                  <ProductProfilePage />
                </RequireDraft>
              }
            />
            <Route
              path="/audit/:auditId/intents"
              element={
                <RequireDraft>
                  <IntentsPage />
                </RequireDraft>
              }
            />
            <Route
              path="/audit/:auditId/prompts"
              element={
                <RequireDraft>
                  <PromptsPage />
                </RequireDraft>
              }
            />
            <Route
              path="/audit/:auditId/progress"
              element={
                <RequireDraft>
                  <AuditProgressPage />
                </RequireDraft>
              }
            />
            <Route
              path="/audit/:auditId/report"
              element={
                <RequireReport>
                  <ReportShell />
                </RequireReport>
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
    </AuditSessionProvider>
  );
}
