# Guia de operação — Áurea3D Premium

## Visão geral

A aplicação pública apresenta a capacidade técnica da Áurea3D, a galeria de portfolio e o formulário de consultoria. O formulário público cria um lead no CRM sem exigir login. A área privada usa exclusivamente Manus OAuth e é limitada ao papel `admin`.

## Rotas principais

| Rota | Acesso | Função |
| --- | --- | --- |
| `/` | Público | Home premium, idioma ES/EN e formulário de consultoria |
| `/portfolio` | Público | Galeria de peças com filtros e assets visuais persistentes |
| `/dashboard` | Admin | CRM de leads, estado legal e módulos financeiros |
| `/automations` | Admin | AutomationPanel com fluxos persistidos |

## Gestão de leads

Para receber um prospecto, o visitante preenche empresa, contacto, email, telefone, setor e descrição na Home. No Dashboard, o administrador pode listar os leads, exportar CSV e alterar o estado comercial. Os estados apresentados são `prospectado`, `reunion_tecnica`, `cotizacion_enviada`, `cerrado` e `rechazado`.

## AutomationPanel

No painel, o administrador pode criar um fluxo com nome, descrição, disparador e ação. Cada fluxo pode ser editado, ativado ou desativado e eliminado após confirmação. As alterações são persistidas na base de dados e a interface invalida a lista após cada mutação.

## Desenvolvimento e entrega

Use `pnpm check` para validar TypeScript, `pnpm test` para executar os testes Vitest e `pnpm build` para preparar o build de produção. A publicação deve ser iniciada pelo botão Publish da interface de gestão após rever o checkpoint. Não publique automaticamente a partir do terminal.

## Próxima iteração

A próxima sessão pode substituir os visuais abstratos por fotografias reais, ampliar o storytelling do portfolio, completar a tradução inglesa das áreas privadas e refinar a direção visual sem alterar o backend funcional.

## Configuração

As credenciais e configurações são injetadas pela gestão do projeto; não crie um `.env` no repositório. A aplicação utiliza `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_ANALYTICS_ENDPOINT` e `VITE_ANALYTICS_WEBSITE_ID`. Os valores devem ser administrados pela secção de Secrets da interface.

O build atual termina com sucesso. O aviso de chunk JavaScript superior a 500 kB é não bloqueante e fica registado para uma futura divisão de bundles caso o trabalho visual continue.
