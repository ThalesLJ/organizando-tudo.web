import type { Metadata } from "next";
import { englishPolicyDocument } from "@/lib/policy-content";
import { PrivacyPolicyContent } from "@/components/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Official Privacy Policy for Organizando Tudo - open-source personal organization platform developed by Delius Tech.",
  alternates: {
    canonical: "/policy",
    languages: {
      "en-US": "/policy",
      "pt-BR": "/politica",
    },
  },
};

export default function PolicyPage() {
  return <PrivacyPolicyContent document={englishPolicyDocument} />;
}
