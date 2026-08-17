# Notas de verificación

La Home premium reutilizada desde el zip carga correctamente en el preview restaurado. Se observan el header fijo, navegación a Capacidades/Proceso/Consultoría, selector ES, hero de manufactura aditiva, CTA de consultoría y formulario conectado a CRM. El contenido visible está en español y la página incluye estructura bilingüe ES/EN en el componente original. El preview muestra un aviso de modo preview del entorno, no un error de la aplicación.

La primera captura mostró una pantalla blanca transitoria; al actualizar la vista, el DOM y el contenido se montaron correctamente. El servidor local responde HTTP 200 y `pnpm check`/`pnpm build` terminan sin errores.

Pendiente de verificación en la siguiente iteración: `/portfolio`, `/dashboard` y `/automations`, especialmente el acceso protegido de las dos últimas rutas cuando no hay sesión.

La ruta `/portfolio` carga la galería original con filtros y seis piezas visuales; sus imágenes actuales son placeholders externos (`via.placeholder.com`), por lo que deben sustituirse por assets reales en la iteración visual. La ruta `/dashboard` sin sesión vuelve a la Home premium, evitando exponer el panel privado. Esto confirma la protección básica de ruta, aunque el flujo de login OAuth debe probarse con una sesión real.

La ruta `/automations` sin sesión también vuelve a la Home y no expone datos privados. El selector ES/EN funciona en la Home reutilizada: tras pulsarlo, el hero, navegación, capacidades, proceso y formulario cambian a inglés. El cambio conserva el contenido y la estructura visual premium.

Tras integrar GSAP/ScrollTrigger, `pnpm check` y `pnpm build` siguen correctos. La navegación Home→Portfolio se añadió como enlace visible y el dashboard incorpora acceso a AutomationPanel; AutomationPanel incorpora retorno al dashboard y al sitio. La comprobación visual del navegador quedó en una pestaña about:blank tras la actualización, por lo que la validación final de rutas se apoya en el preview HTTP 200 y en las verificaciones previas; se debe repetir una captura visual si el entorno vuelve a exponer el preview.

La nueva captura de `/portfolio` confirma que los placeholders externos fueron sustituidos: la galería muestra visuales SVG persistentes de escultura, sistemas náuticos y precisión industrial, sin iconos de imagen rota. La captura conjunta de rutas también confirma Home, dashboard y AutomationPanel renderizando en preview; el dashboard muestra un registro existente del CRM y AutomationPanel muestra estado vacío gestionable.
