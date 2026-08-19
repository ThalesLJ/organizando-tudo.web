export type PolicyLocale = "en" | "pt-BR";

export interface PolicySectionItem {
  id: string;
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
  note?: string;
}

export interface PolicyDocument {
  locale: PolicyLocale;
  title: string;
  lastUpdatedLabel: string;
  effectiveDate: string;
  appName: string;
  publisherName: string;
  developerName: string;
  repositoryUrl: string;
  alternateRoute: {
    path: string;
    label: string;
    description: string;
  };
  backToAppLabel: string;
  sections: PolicySectionItem[];
  contact: {
    title: string;
    description: string;
    publisher: string;
    developer: string;
    email: string;
    repository: string;
  };
}

export const englishPolicyDocument: PolicyDocument = {
  locale: "en",
  title: "Privacy Policy",
  lastUpdatedLabel: "Last Updated",
  effectiveDate: "August 18, 2026",
  appName: "Organizando Tudo",
  publisherName: "Delius Tech",
  developerName: "Thales Lima",
  repositoryUrl: "https://github.com/ThalesLJ/organizando-tudo.web",
  alternateRoute: {
    path: "/politica",
    label: "Português (Brasil)",
    description: "Leia a versão em Português do Brasil",
  },
  backToAppLabel: "Back to Organizando Tudo",
  sections: [
    {
      id: "overview",
      title: "1. Overview & Open-Source Philosophy",
      paragraphs: [
        "Welcome to Organizando Tudo, an open-source personal organization platform designed to help you manage your notes, track finances, and structure daily activities with privacy, simplicity, and full transparency.",
        "Organizando Tudo is developed by Delius Tech and maintained by Thales Lima. Because the project is open source, its source code is publicly accessible and auditable on GitHub at https://github.com/ThalesLJ/organizando-tudo.web.",
        "Your privacy is our core priority. We operate under a strict minimal-data philosophy: the system only collects and stores the information that you explicitly provide to use the services. We do not engage in surveillance, behavioral tracking, advertising, or selling user information under any circumstance.",
      ],
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      paragraphs: [
        "We only collect information directly submitted by you during account registration and regular usage of the application:",
      ],
      bulletPoints: [
        "Account Information: When you create an account, we collect your first name, email address, username, and password. Your password is automatically hashed using cryptographic algorithms before storage.",
        "User-Generated Content: Any notes you compose, formatted rich text, note categories, financial budget records, expense entries (amounts, categories, descriptions, dates), and organizational tags that you create within the platform.",
        "Interface Preferences: Non-sensitive user configuration preferences, such as selected language (English, Portuguese, Spanish) and custom UI color theme values.",
        "Authentication Session Tokens: Temporary session tokens stored in secure, HttpOnly cookies solely to keep you signed in securely across requests.",
      ],
      note: "We do NOT access or collect your device location, contact books, microphone, camera, photos, or files outside of the content you directly enter into the application.",
    },
    {
      id: "data-usage",
      title: "3. How We Use Your Information",
      paragraphs: [
        "The information you submit is used exclusively to operate, maintain, and deliver the functional features of Organizando Tudo, including:",
      ],
      bulletPoints: [
        "Authenticating your identity and maintaining secure access to your account.",
        "Storing, rendering, and managing your personal notes and financial records.",
        "Applying your personalized interface themes and language preferences.",
        "Facilitating password recovery workflows when requested by you via email verification.",
      ],
    },
    {
      id: "third-parties-advertising",
      title: "4. Third Parties & Advertising",
      paragraphs: [
        "We do NOT sell, rent, lease, or trade your personal data with any third-party companies, data brokers, or advertisers.",
        "Organizando Tudo contains no third-party tracking scripts, no behavioral analytics SDKs (such as Google Analytics or Facebook Pixel), and no advertising networks.",
        "The application communicates directly and securely with its dedicated Backend-for-Frontend (BFF) and API servers to fulfill application requests.",
      ],
    },
    {
      id: "storage-security",
      title: "5. Data Storage & Security Measures",
      paragraphs: [
        "We implement robust technical and organizational security measures to protect your personal information against unauthorized access, loss, alteration, or disclosure:",
      ],
      bulletPoints: [
        "Encryption in Transit: All network communications between your browser and our servers are encrypted using Transport Layer Security (HTTPS/TLS).",
        "Cryptographic Password Protection: Passwords are never stored in plain text and are hashed using industry-standard one-way cryptographic functions.",
        "Secure Session Management: Authentication tokens are stored exclusively in HttpOnly, SameSite=Lax cookies, preventing malicious client-side scripts from reading session credentials.",
        "Isolated Data Tenancy: Your notes, budgets, and expenses are strictly isolated and accessible only through authenticated requests tied to your user identity.",
      ],
    },
    {
      id: "user-rights",
      title: "6. User Rights & Data Control (GDPR & LGPD Compliance)",
      paragraphs: [
        "In compliance with international data protection regulations (including the General Data Protection Regulation - GDPR and the Brazilian General Data Protection Law - LGPD), you retain complete sovereignty over your data:",
      ],
      bulletPoints: [
        "Right of Access & Modification: You can view, edit, or update your personal details, notes, and financial records at any time directly through the application interface.",
        "Right of Erasure (Deletion): You can delete individual notes, budgets, or expenses directly. Furthermore, you may request full account deletion and complete erasure of all associated data by contacting our support team.",
        "Right to Data Portability: You may request a copy or export of your submitted data.",
        "Right to Withdraw Consent: You can discontinue using the application and close your account at any time.",
      ],
    },
    {
      id: "children-privacy",
      title: "7. Children's Privacy",
      paragraphs: [
        "Organizando Tudo is not directed at children under the age of 13. We do not knowingly collect or solicit personal information from children. If you become aware that a child has provided us with personal data, please contact us so that we can promptly remove the information.",
      ],
    },
    {
      id: "policy-changes",
      title: "8. Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect improvements in our system or modifications in legal requirements. When changes occur, the 'Last Updated' date at the top of this page will be revised.",
        "Significant modifications will be communicated through the open-source repository and within the application interface.",
      ],
    },
  ],
  contact: {
    title: "9. Contact & Support Information",
    description:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please contact us through any of the channels below:",
    publisher: "Publisher: Delius Tech",
    developer: "Maintainer: Thales Lima (@ThalesLJ)",
    email: "Email: thaleslimadejesus@gmail.com",
    repository: "GitHub Repository: https://github.com/ThalesLJ/organizando-tudo.web",
  },
};

export const portuguesePolicyDocument: PolicyDocument = {
  locale: "pt-BR",
  title: "Política de Privacidade",
  lastUpdatedLabel: "Última Atualização",
  effectiveDate: "18 de agosto de 2026",
  appName: "Organizando Tudo",
  publisherName: "Delius Tech",
  developerName: "Thales Lima",
  repositoryUrl: "https://github.com/ThalesLJ/organizando-tudo.web",
  alternateRoute: {
    path: "/policy",
    label: "English (US)",
    description: "Read the English version of the Privacy Policy",
  },
  backToAppLabel: "Voltar para o Organizando Tudo",
  sections: [
    {
      id: "overview",
      title: "1. Visão Geral e Filosofia Open-Source",
      paragraphs: [
        "Bem-vindo ao Organizando Tudo, uma plataforma open-source de organização pessoal projetada para ajudá-lo a gerenciar suas notas, controlar finanças e estruturar suas atividades diárias com total privacidade, simplicidade e transparência.",
        "O Organizando Tudo é desenvolvido pela Delius Tech e mantido por Thales Lima. Por ser um projeto de código aberto, seu código-fonte é público e auditável no GitHub através do link https://github.com/ThalesLJ/organizando-tudo.web.",
        "Sua privacidade é nossa prioridade fundamental. Operamos sob uma política rigorosa de coleta mínima de dados: o sistema apenas armazena as informações que você voluntariamente e explicitamente fornece para utilizar os recursos. Não realizamos rastreamento comportamental, vigilância, exibição de anúncios ou venda de dados sob nenhuma circunstância.",
      ],
    },
    {
      id: "information-collected",
      title: "2. Informações que Coletamos",
      paragraphs: [
        "Coletamos unicamente informações fornecidas diretamente por você durante o cadastro e a utilização regular da aplicação:",
      ],
      bulletPoints: [
        "Informações de Conta: Ao criar sua conta, coletamos seu primeiro nome, endereço de e-mail, nome de usuário e senha. Sua senha é protegida por hash criptográfico seguro antes de qualquer armazenamento.",
        "Conteúdo Criado pelo Usuário: Todas as notas que você redige, textos formatados, categorias de notas, registros de orçamentos financeiros, lançamentos de despesas (valores, categorias, descrições e datas) e configurações que você cria na plataforma.",
        "Preferências de Interface: Configurações não sensíveis de uso, como o idioma selecionado (Inglês, Português, Espanhol) e as cores personalizadas do tema da interface.",
        "Tokens de Sessão de Autenticação: Tokens temporários armazenados em cookies seguros do tipo HttpOnly exclusivamente para manter sua sessão conectada com segurança entre requisições.",
      ],
      note: "NÃO acessamos nem coletamos sua localização geográfica, lista de contatos, microfone, câmera, fotos ou arquivos do dispositivo fora daqueles explicitamente inseridos por você.",
    },
    {
      id: "data-usage",
      title: "3. Como Utilizamos Suas Informações",
      paragraphs: [
        "As informações fornecidas são utilizadas exclusivamente para operar, manter e disponibilizar as funcionalidades do Organizando Tudo, incluindo:",
      ],
      bulletPoints: [
        "Autenticar sua identidade e manter o acesso seguro à sua conta.",
        "Armazenar, exibir e permitir a edição de suas notas e registros financeiros pessoais.",
        "Aplicar suas preferências de idioma e cores personalizadas do tema visual.",
        "Possibilitar fluxos de recuperação de senha quando solicitados por você via verificação por e-mail.",
      ],
    },
    {
      id: "third-parties-advertising",
      title: "4. Terceiros e Publicidade",
      paragraphs: [
        "NÃO vendemos, alugamos, comercializamos ou compartilhamos seus dados pessoais com empresas terceiras, intermediários de dados ou anunciantes.",
        "O Organizando Tudo não contém scripts de rastreamento de terceiros, SDKs de análise comportamental (como Google Analytics ou Facebook Pixel) e nenhuma rede de publicidade.",
        "A aplicação comunica-se direta e seguramente com seus servidores dedicados de Backend-for-Frontend (BFF) e API para atender às requisições do sistema.",
      ],
    },
    {
      id: "storage-security",
      title: "5. Armazenamento e Medidas de Segurança",
      paragraphs: [
        "Implementamos medidas técnicas e organizacionais rígidas para proteger suas informações pessoais contra acessos não autorizados, perdas, alterações ou divulgação indevida:",
      ],
      bulletPoints: [
        "Criptografia em Trânsito: Todas as comunicações entre seu navegador e nossos servidores são criptografadas com Transport Layer Security (HTTPS/TLS).",
        "Proteção Criptográfica de Senhas: As senhas nunca são armazenadas em texto simples e utilizam funções hash criptográficas unidirecionais de padrão da indústria.",
        "Gestão Segura de Sessão: Tokens de autenticação são gravados estritamente em cookies HttpOnly com flag SameSite=Lax, impedindo o acesso por scripts maliciosos no cliente.",
        "Isolamento de Dados: Suas notas, orçamentos e despesas são estritamente isolados e acessíveis somente mediante requisições autenticadas vinculadas à sua conta.",
      ],
    },
    {
      id: "user-rights",
      title: "6. Direitos do Usuário e Controle de Dados (LGPD e GDPR)",
      paragraphs: [
        "Em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e normas internacionais (GDPR), você possui pleno controle sobre seus dados pessoais:",
      ],
      bulletPoints: [
        "Direito de Acesso e Correção: Você pode visualizar, editar ou atualizar seus dados cadastrais, notas e registros financeiros a qualquer momento diretamente na interface do sistema.",
        "Direito de Exclusão: Você pode excluir individualmente notas, orçamentos ou despesas a qualquer instante. Além disso, pode solicitar o encerramento da conta e a exclusão definitiva de todos os seus dados entrando em contato com nosso suporte.",
        "Direito à Portabilidade: Você pode solicitar a exportação ou cópia dos dados fornecidos por você.",
        "Direito de Revogação do Consentimento: Você pode interromper a utilização da plataforma e desativar sua conta quando desejar.",
      ],
    },
    {
      id: "children-privacy",
      title: "7. Privacidade de Crianças e Menores",
      paragraphs: [
        "O Organizando Tudo não é direcionado a crianças menores de 13 anos. Não coletamos intencionalmente dados de menores. Caso tome conhecimento de que uma criança forneceu informações pessoais, entre em contato conosco para realizarmos a remoção imediata dos dados.",
      ],
    },
    {
      id: "policy-changes",
      title: "8. Alterações Nesta Política de Privacidade",
      paragraphs: [
        "Podemos atualizar esta Política de Privacidade periodicamente para refletir aprimoramentos no sistema ou adequações legais. Sempre que houver alterações, a data de 'Última Atualização' no topo desta página será revisada.",
        "Modificações relevantes serão comunicadas no repositório open-source e na interface da plataforma.",
      ],
    },
  ],
  contact: {
    title: "9. Informações de Contato e Suporte",
    description:
      "Caso tenha dúvidas, comentários ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados, entre em contato através dos canais abaixo:",
    publisher: "Publicador: Delius Tech",
    developer: "Mantenedor: Thales Lima (@ThalesLJ)",
    email: "E-mail: thaleslimadejesus@gmail.com",
    repository: "Repositório GitHub: https://github.com/ThalesLJ/organizando-tudo.web",
  },
};

export function getPolicyDocument(locale: "en" | "pt" | "pt-BR"): PolicyDocument {
  if (locale === "pt" || locale === "pt-BR") {
    return portuguesePolicyDocument;
  }
  return englishPolicyDocument;
}
