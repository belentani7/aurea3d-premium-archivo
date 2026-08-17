# Notas de verificación

La Home premium reutilizada desde el zip carga correctamente en el preview restaurado. Se observan el header fijo, navegación a Capacidades/Proceso/Consultoría, selector ES, hero de manufactura aditiva, CTA de consultoría y formulario conectado a CRM. El contenido visible está en español y la página incluye estructura bilingüe ES/EN en el componente original. El preview muestra un aviso de modo preview del entorno, no un error de la aplicación.

La primera captura mostró una pantalla blanca transitoria; al actualizar la vista, el DOM y el contenido se montaron correctamente. El servidor local responde HTTP 200 y `pnpm check`/`pnpm build` terminan sin errores.

Pendiente de verificación en la siguiente iteración: `/portfolio`, `/dashboard` y `/automations`, especialmente el acceso protegido de las dos últimas rutas cuando no hay sesión.

La ruta `/portfolio` carga la galería original con filtros y seis piezas visuales; sus imágenes actuales son placeholders externos (`via.placeholder.com`), por lo que deben sustituirse por assets reales en la iteración visual. La ruta `/dashboard` sin sesión vuelve a la Home premium, evitando exponer el panel privado. Esto confirma la protección básica de ruta, aunque el flujo de login OAuth debe probarse con una sesión real.

La ruta `/automations` sin sesión también vuelve a la Home y no expone datos privados. El selector ES/EN funciona en la Home reutilizada: tras pulsarlo, el hero, navegación, capacidades, proceso y formulario cambian a inglés. El cambio conserva el contenido y la estructura visual premium.

Tras integrar GSAP/ScrollTrigger, `pnpm check` y `pnpm build` siguen correctos. La navegación Home→Portfolio se añadió como enlace visible y el dashboard incorpora acceso a AutomationPanel; AutomationPanel incorpora retorno al dashboard y al sitio. La comprobación visual del navegador quedó en una pestaña about:blank tras la actualización, por lo que la validación final de rutas se apoya en el preview HTTP 200 y en las verificaciones previas; se debe repetir una captura visual si el entorno vuelve a exponer el preview.

La nueva captura de `/portfolio` confirma que los placeholders externos fueron sustituidos: la galería muestra visuales SVG persistentes de escultura, sistemas náuticos y precisión industrial, sin iconos de imagen rota. La captura conjunta de rutas también confirma Home, dashboard y AutomationPanel renderizando en preview; el dashboard muestra un registro existente del CRM y AutomationPanel muestra estado vacío gestionable.

La revisión móvil a 390x844 confirma que Portfolio se apila correctamente y los assets se mantienen visibles. La Home ahora organiza el header en dos filas y muestra Portfolio/ES sin overflow de navegación. AutomationPanel apila métricas y formulario; el título se divide en dos líneas para evitar recorte. Queda un refinamiento visual menor pendiente en el tamaño del hero móvil, sin bloqueo funcional.

La captura móvil final de Home a 390x844 muestra el hero centrado sin recorte: el encabezado se distribuye en dos filas, Portfolio queda accesible y el CTA permanece visible. `pnpm check` y `pnpm build` vuelven a finalizar correctamente; se mantiene únicamente el warning no bloqueante de chunk JS grande.

Medición rápida por curl: Home respondió HTTP 200 con 368415 bytes y 0.052 s; cada SVG persistente respondió mediante redirección HTTP 307 del storage, con 541–548 bytes de respuesta inicial y ~0.054–0.069 s. Los archivos fuente SVG pesan 1.5–1.7 KB, por lo que son assets ligeros para la entrega funcional.

La revisión de logs finales muestra Vite conectado, OAuth inicializado y servidor estable. No aparecen errores de TypeScript ni excepciones de runtime en browserConsole; las entradas visibles son mensajes DEBUG de conexión y el aviso informativo de React DevTools. El log registra únicamente el `Missing session cookie` esperado al probar una ruta privada sin sesión.

Se añadió `LanguageContext` compartido con persistencia local ES/EN y se integró en App, Home, Portfolio, AdminDashboard y AutomationPanel. Portfolio ahora consume `portfolio.list` y los seis proyectos editoriales persistidos en `portfolioProjects`, usando fallback solo si la consulta no devuelve registros. La suite final pasó 8/8 tests; la limpieza posterior dejó sin filas de prueba en leads, automations y portfolio QA.
