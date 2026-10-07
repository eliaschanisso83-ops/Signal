import type { ReactNode } from 'react';
import { usePageMeta } from '../../i18n/seo';

export type LegalBlock = { kind: 'p'; text: ReactNode } | { kind: 'ul'; items: ReactNode[] };

export interface LegalSubsection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalSectionData {
  id: string;
  title: string;
  blocks?: LegalBlock[];
  subsections?: LegalSubsection[];
}

export interface LegalPageData {
  /** Título do documento (aba + SEO), no formato exigido: "Página | Signal". */
  metaTitle: string;
  description: string;
  /** Rota da página — origem da canonical (ex.: `/privacy`). */
  path: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSectionData[];
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'ul') {
    return (
      <ul>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

function TocList({ sections }: { sections: LegalSectionData[] }) {
  return (
    <ol className="legal-toc-list">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`}>{s.title}</a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Layout compartilhado das páginas legais (/privacy e /terms):
 * coluna de leitura + índice das seções (fixo à direita no desktop,
 * lista recolhível no mobile). Não é uma página com abas — cada
 * documento tem sua própria URL e conteúdo.
 */
export function LegalPageLayout({ page }: { page: LegalPageData }) {
  usePageMeta({ title: page.metaTitle, description: page.description, path: page.path });

  return (
    <div className="shell legal-shell">
      <header className="page-head legal-head">
        <div className="page-eyebrow">Legal</div>
        <h1>{page.title}</h1>
        <p className="muted">{page.subtitle}</p>
      </header>

      <div className="legal-grid">
        <details className="legal-toc-mobile">
          <summary>Índice de seções</summary>
          <nav aria-label="Índice das seções">
            <TocList sections={page.sections} />
          </nav>
        </details>

        <article className="legal-doc">
          {page.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              {s.blocks?.map((b, i) => (
                <Block key={i} block={b} />
              ))}
              {s.subsections?.map((sub) => (
                <div className="legal-subsection" key={sub.id}>
                  <h3 id={sub.id}>{sub.title}</h3>
                  {sub.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </div>
              ))}
            </section>
          ))}
          <p className="legal-updated">Última atualização: {page.updatedAt}</p>
        </article>

        <aside className="legal-aside">
          <nav className="legal-toc" aria-label="Índice das seções">
            <div className="legal-toc-label">Índice</div>
            <TocList sections={page.sections} />
          </nav>
        </aside>
      </div>
    </div>
  );
}
