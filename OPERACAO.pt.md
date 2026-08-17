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
