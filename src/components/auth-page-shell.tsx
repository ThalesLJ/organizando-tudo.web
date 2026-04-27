import Link from "next/link";
import type { ReactNode } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

type AuthPageShellProps = {
  title: string;
  children: ReactNode;
  showSocialLinks?: boolean;
};

export function AuthPageShell({ title, children, showSocialLinks = false }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center pt-[7vh] sm:pt-[13vh]">
        <h1 className="mb-8 text-center text-3xl font-bold leading-none tracking-[-0.02em] text-white">
          {title}
        </h1>
        <div className="w-full rounded-2xl border border-white/15 bg-white/5 p-8 shadow-2xl shadow-black/60 backdrop-blur">
          {children}
        </div>
        {showSocialLinks ? (
          <div className="mt-7 flex items-center justify-center gap-5 text-white/70">
            <Link
              href="https://www.linkedin.com/in/thaleslj"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-2xl transition hover:text-white"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://github.com/ThalesLJ"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-2xl transition hover:text-white"
            >
              <FaGithub />
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
