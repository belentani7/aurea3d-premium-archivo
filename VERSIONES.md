# Historial de versiones archivado

| Versión | Commit | Descripción |
| --- | --- | --- |
| Inicial | `f07aee7` | Bootstrap del proyecto web full-stack con React, Express, tRPC, Drizzle y Manus OAuth. |
| Funcional | `2d55a98` | Home premium, Portfolio, CRM, AutomationPanel, permisos admin, assets persistentes y primera entrega funcional. |
| Ampliada | `1948116` | Backend CRM/automatizaciones reforzado, portfolio dinámico, tests de flujo y mejoras responsive. |
| Actual | `db9fa67` | LanguageContext ES/EN, feedback accesible, lazy loading, guía portuguesa, QA final, build y tests verificados. |
| Archivo 1 | `f7b8516` | Informe de auditoría, resumen conversacional y primer manifiesto de archivo. |
| Archivo 2 | `4367cd7` | Manifiesto de archivo externo y creación del paquete archivado. |
| Archivo 3 | `54d4ff2` | Alcance de archivo corregido, exclusiones explícitas y todo.md actualizado. |

## Reproducción

El historial completo de commits queda conservado en el repositorio Git. La versión recomendada para revisión es `db9fa67`, correspondiente al checkpoint `db9fa676`. La versión recomendada para archivo externo es `54d4ff2`, publicada en el repositorio privado de archivo y usada para generar el paquete v2.

## Estado técnico de la versión actual

La rama `main` contiene el código de la versión actual. La verificación más reciente ejecutó `pnpm check`, `pnpm test` y `pnpm build`; los 8 tests pasaron y el build terminó correctamente. El empaquetado muestra un warning no bloqueante de tamaño de chunk, documentado para una futura optimización mediante code splitting.
