import type { Metadata } from "next";
import { portuguesePolicyDocument } from "@/lib/policy-content";
import { PrivacyPolicyContent } from "@/components/privacy-policy-content";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade oficial do Organizando Tudo - plataforma open-source de organização pessoal desenvolvida pela Delius Tech.",
  alternates: {
    canonical: "/politica",
    languages: {
      "en-US": "/policy",
      "pt-BR": "/politica",
    },
  },
};

export default function PoliticaPage() {
  return <PrivacyPolicyContent document={portuguesePolicyDocument} />;
}
