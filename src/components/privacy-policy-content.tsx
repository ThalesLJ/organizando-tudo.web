import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe, FaArrowLeft, FaShieldAlt, FaEnvelope } from "react-icons/fa";
import { PolicyDocument } from "@/lib/policy-content";

interface PrivacyPolicyContentProps {
  document: PolicyDocument;
}

export function PrivacyPolicyContent({ document }: PrivacyPolicyContentProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Top Navigation Bar */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)]/30 pb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] transition hover:opacity-80 !select-text"
          >
            <FaArrowLeft className="text-xs" />
            <span>{document.backToAppLabel}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={document.alternateRoute.path}
              title={document.alternateRoute.description}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)]/40 bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/80 !select-text"
            >
              <FaGlobe className="text-xs" />
              <span>{document.alternateRoute.label}</span>
            </Link>
          </div>
        </header>

        {/* Main Document Shell */}
        <main className="rounded-2xl border border-[var(--border-color)]/40 bg-[var(--bg-secondary)] p-6 sm:p-10 shadow-lg !select-text">
          {/* Header Section */}
          <div className="mb-10 border-b border-[var(--border-color)]/20 pb-8 !select-text">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)]/40 bg-[var(--bg-primary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              <FaShieldAlt className="text-xs" />
              <span>{document.appName} · Official Policy</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl !select-text">
              {document.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] !select-text">
              <p>
                <span className="font-semibold">{document.lastUpdatedLabel}:</span> {document.effectiveDate}
              </p>
              <p>
                <span className="font-semibold">Publisher:</span> {document.publisherName}
              </p>
              <p>
                <span className="font-semibold">Maintainer:</span> {document.developerName}
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 !select-text">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-3 !select-text">
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl !select-text">
                  {section.title}
                </h2>

                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="leading-relaxed text-[var(--text-primary)]/90 text-sm sm:text-base !select-text"
                  >
                    {paragraph.includes("https://github.com") ? (
                      <>
                        {paragraph.split("https://github.com/ThalesLJ/organizando-tudo.web")[0]}
                        <a
                          href="https://github.com/ThalesLJ/organizando-tudo.web"
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline hover:opacity-80 !select-text"
                        >
                          https://github.com/ThalesLJ/organizando-tudo.web
                        </a>
                        {paragraph.split("https://github.com/ThalesLJ/organizando-tudo.web")[1]}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base text-[var(--text-primary)]/90 !select-text">
                    {section.bulletPoints.map((point, idx) => (
                      <li key={idx} className="leading-relaxed !select-text">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <div className="mt-3 rounded-xl border border-[var(--border-color)]/50 bg-[var(--bg-primary)]/60 p-4 text-sm leading-relaxed text-[var(--text-primary)] !select-text">
                    <p className="font-medium !select-text">
                      <span className="font-bold">Note: </span>
                      {section.note}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Contact Section Card */}
            <section
              id="contact"
              className="mt-10 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-primary)]/40 p-6 sm:p-8 space-y-4 !select-text"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl !select-text">
                {document.contact.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-primary)]/90 leading-relaxed !select-text">
                {document.contact.description}
              </p>

              <div className="grid gap-2 text-sm sm:text-base text-[var(--text-primary)] !select-text">
                <p className="!select-text">
                  <strong>{document.contact.publisher}</strong>
                </p>
                <p className="!select-text">
                  <strong>{document.contact.developer}</strong>
                </p>
                <p className="inline-flex items-center gap-2 !select-text">
                  <FaEnvelope className="text-xs text-[var(--text-secondary)]" />
                  <span>
                    <a
                      href="mailto:thaleslimadejesus@gmail.com"
                      className="underline hover:opacity-80 !select-text"
                    >
                      thaleslimadejesus@gmail.com
                    </a>
                  </span>
                </p>
                <p className="inline-flex items-center gap-2 !select-text">
                  <FaGithub className="text-xs text-[var(--text-secondary)]" />
                  <span>
                    <a
                      href="https://github.com/ThalesLJ/organizando-tudo.web"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:opacity-80 !select-text"
                    >
                      github.com/ThalesLJ/organizando-tudo.web
                    </a>
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* Footer Social & Copyright */}
          <footer className="mt-12 border-t border-[var(--border-color)]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)] !select-text">
            <p className="!select-text">
              © {new Date().getFullYear()} {document.appName} · {document.publisherName}. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-lg text-[var(--text-secondary)]">
              <Link
                href="https://github.com/ThalesLJ/organizando-tudo.web"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="transition hover:text-[var(--text-primary)] !select-text"
              >
                <FaGithub />
              </Link>
              <Link
                href="https://www.linkedin.com/in/thaleslj"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="transition hover:text-[var(--text-primary)] !select-text"
              >
                <FaLinkedin />
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
