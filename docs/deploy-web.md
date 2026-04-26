# Web Deploy Single Version

## Objetivo

Configurar deploy automatico do frontend Next.js no push para `master`, usando GitHub Actions com runner self-hosted Linux na VPS e PM2 para gerenciar uma unica versao ativa por vez.

## Fluxo

1. Runner recebe push da branch `master`.
2. Workflow sincroniza o codigo para `current`.
3. Workflow copia o `.env` da pasta compartilhada.
4. Workflow instala dependencias e executa build.
5. Workflow remove o processo anterior no PM2 pelo nome da aplicacao.
6. Workflow sobe a nova versao com PM2 na porta definida em `PORT` no `.env`.
7. Um segundo job no GitHub (`ubuntu-latest`) valida externamente o endpoint `https://organizandotudo.thaleslj.com/api/health`.

## Arquivos

- Workflow: `organizando-tudo.web/.github/workflows/deploy.yml`
- Health route: `organizando-tudo.web/src/app/api/health/route.ts`

## Health-check externo

Endpoint validado pelo GitHub fora da VPS:

- `https://organizandotudo.thaleslj.com/api/health`

Resposta esperada para deploy valido:

```json
{
  "status": "ok",
  "service": "web",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Variaveis obrigatorias no GitHub (Repository Variables)

- `WEB_DEPLOY_BASE_DIR`
- `WEB_ENV_FILE`
- `WEB_PM2_APP_NAME`

Valores recomendados para este projeto:

- `WEB_PM2_APP_NAME=organizandotudo-web`

## Pre-requisitos na VPS

- Runner self-hosted Linux ativo para o repositorio.
- Node.js 22 instalado.
- `pm2`, `rsync`, `curl`, `bash` instalados para o usuario `github-runner`.
- Arquivo de ambiente do web existente no caminho definido em `WEB_ENV_FILE` com `PORT` definido.
- Apache configurado para encaminhar trafego para a porta definida em `PORT` no `.env` do web.
- Nao ha uso de `sudo` no workflow.

## Estrutura de deploy na VPS (single version)

Diretorio base definido em `WEB_DEPLOY_BASE_DIR`:

- `current/`
- `logs/`
- Nao ha backup de versoes anteriores nesse modelo.
