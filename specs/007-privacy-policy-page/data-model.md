# Data Model: Privacy Policy and Brazilian Portuguese Policy Pages

## Entities

### PolicyDocument

Represents the full structured privacy policy document for a given language.

**Fields**:

- `locale`: Language identifier (`"en"` | `"pt-BR"`).
- `title`: Document main title (e.g., `"Privacy Policy"` / `"Política de Privacidade"`).
- `appName`: Application name (`"Organizando Tudo"`).
- `publisherName`: Registered publisher name (`"Delius Tech"`).
- `developerName`: Developer/maintainer name (`"Thales Lima"`).
- `effectiveDate`: Date of effect / last updated (e.g., `"2026-08-18"`).
- `openSourceRepoUrl`: URL of the open-source repository (`"https://github.com/ThalesLJ/organizando-tudo.web"`).
- `sections`: Ordered array of `PolicySection` entities.
- `alternateRoute`: Information linking to the alternate language version (e.g. path `/politica` from `/policy`, or `/policy` from `/politica`).

### PolicySection

Represents a thematic section of the privacy policy.

**Fields**:

- `id`: Section anchor slug (e.g., `"introduction"`, `"data-collection"`, `"data-use"`, `"data-security"`, `"user-rights"`, `"open-source"`, `"contact"`).
- `title`: Section heading.
- `paragraphs`: Array of explanatory strings.
- `bulletPoints`: Optional array of key points or bullet items.
- `note`: Optional callout note for specific legal or operational details.

### PolicyContactInfo

Represents official publisher and developer support channels.

**Fields**:

- `publisher`: Publisher entity name (`"Delius Tech"`).
- `developer`: Developer name (`"Thales Lima / ThalesLJ"`).
- `supportEmail`: Support/inquiry contact email or form.
- `repositoryUrl`: Public GitHub repository link.
- `privacyUrlEn`: `https://organizandotudo.thaleslj.com/policy`
- `privacyUrlPt`: `https://organizandotudo.thaleslj.com/politica`

### PolicyRoute

Represents the public routing parameters for privacy policy pages.

**Fields**:

- `path`: Current URL pathname (`"/policy"` or `"/politica"`).
- `locale`: Associated locale (`"en"` for `"/policy"`, `"pt"` for `"/politica"`).
- `alternatePath`: Path to the other locale counterpart.
- `alternateLabel`: Human-readable label for the alternate language switcher link.

## Relationships

- `PolicyDocument` contains 1..* `PolicySection` entities.
- `PolicyDocument` contains 1 `PolicyContactInfo` entity.
- `PolicyRoute` resolves to exactly 1 `PolicyDocument` based on the URL path.
- `PolicyDocument` links to an alternate `PolicyRoute` for bilingual switching.

## State Transitions & Navigation Flow

```mermaid
flowchart TD
    Visitor[Visitor / Microsoft Reviewer] -->|Navigates to /policy| EnglishPolicy[Render English Privacy Policy Document]
    Visitor -->|Navigates to /politica| PortuguesePolicy[Render Brazilian Portuguese Privacy Policy Document]
    EnglishPolicy -->|Click 'Português (Brasil)' /politica| PortuguesePolicy
    PortuguesePolicy -->|Click 'English' /policy| EnglishPolicy
    EnglishPolicy -->|Click 'Back to App' / Home| AppHome[Redirect to /dashboard or /login]
    PortuguesePolicy -->|Click 'Voltar ao App' / Início| AppHome
```
