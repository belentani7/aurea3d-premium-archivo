import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

/**
 * Admin Dashboard - Dark Tech CRM
 * Uses trpc.crm.* endpoints
 * Includes: Leads, Legal Compliance Checklist, Financial Modules
 */

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [tab, setTab] = useState<"leads" | "legal" | "finance">("leads");

  // CRM Queries
  const leadsQuery = trpc.crm.getLeads.useQuery();
  const legalQuery = trpc.crm.getLegalCompliance.useQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const updateLegal = trpc.crm.updateLegalCompliance.useMutation();
  const updateLeadStatus = trpc.crm.updateLeadStatus.useMutation();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [isAuthenticated, user, loading, setLocation]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "#F5F1E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14 }}>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  if (leadsQuery.isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "#F5F1E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14 }}>Cargando CRM...</p>
      </div>
    );
  }

  if (leadsQuery.isError) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "#F5F1E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color: "#f0b6b6" }}>No se pudo cargar el CRM.</p>
        <button onClick={() => void leadsQuery.refetch()} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.3)", borderRadius: 20, padding: "8px 18px", color: "#C9A96E", cursor: "pointer" }}>Reintentar</button>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!leadsQuery.data) return;
    const headers = ["ID", "Empresa", "Contacto", "Email", "Sector", "Estado", "Fecha"];
    const rows = leadsQuery.data.map((l: any) => [
      l.id, l.companyName, l.contactName, l.email, l.sector, l.status,
      l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [headers, ...rows].map((r: any[]) => r.map((c: any) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleLegalToggle = async (field: string, value: boolean) => {
    try {
      await updateLegal.mutateAsync({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        [field]: value,
      });
      legalQuery.refetch();
      toast.success("Actualizado");
    } catch {
      toast.error("Error");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateLeadStatus.mutateAsync({ leadId: id, status: status as any });
      leadsQuery.refetch();
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error");
    }
  };

  // Financial calculations
  const anticipoMax = 1000; // Art. 76 Ley Cooperativas
  const dietaDiaria = 53.34; // RD 439/2007
  const cesionPct = 45; // % deducible

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#F5F1E8", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
        .adm-tab{padding:10px 20px;border:1px solid rgba(201,169,110,.15);border-radius:30px;background:transparent;color:rgba(245,241,232,.5);font-size:13px;cursor:pointer;transition:all .3s}
        .adm-tab.active{background:rgba(201,169,110,.12);color:#C9A96E;border-color:rgba(201,169,110,.3)}
        .adm-card{background:rgba(10,10,10,.7);backdrop-filter:blur(16px);border:1px solid rgba(201,169,110,.1);border-radius:14px;padding:24px}
        .adm-check{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid rgba(201,169,110,.08);border-radius:10px;margin-bottom:8px;cursor:pointer;transition:all .3s}
        .adm-check:hover{border-color:rgba(201,169,110,.2)}
        .adm-check.done{background:rgba(201,169,110,.06);border-color:rgba(201,169,110,.2)}
        .adm-stat{text-align:center;padding:20px}
        .adm-stat-num{font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:#C9A96E}
        .adm-stat-label{font-size:11px;color:rgba(245,241,232,.4);margin-top:4px;font-family:'JetBrains Mono',monospace}
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(201,169,110,.1)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "#C9A96E" }}>ÁUREA 3D — Admin</h1>
            <button onClick={() => setLocation("/automations")} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.2)", borderRadius: 20, padding: "6px 16px", color: "#C9A96E", fontSize: 12, cursor: "pointer" }}>
              AutomationPanel
            </button>
            <button type="button" onClick={toggleLanguage} aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.2)", borderRadius: 20, padding: "6px 12px", color: "rgba(245,241,232,.65)", fontSize: 11, cursor: "pointer" }}>
              {language.toUpperCase()}
            </button>
          </div>
          <button onClick={() => setLocation("/")} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.2)", borderRadius: 20, padding: "6px 16px", color: "rgba(245,241,232,.5)", fontSize: 12, cursor: "pointer" }}>
            ← Volver al sitio
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <button className={`adm-tab ${tab === "leads" ? "active" : ""}`} onClick={() => setTab("leads")}>Leads CRM</button>
          <button className={`adm-tab ${tab === "legal" ? "active" : ""}`} onClick={() => setTab("legal")}>Estado Legal</button>
          <button className={`adm-tab ${tab === "finance" ? "active" : ""}`} onClick={() => setTab("finance")}>Financiero</button>
        </div>

        {/* LEADS TAB */}
        {tab === "leads" && (
          <div>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              <div className="adm-card adm-stat">
                <div className="adm-stat-num">{leadsQuery.data?.length || 0}</div>
                <div className="adm-stat-label">Total Leads</div>
              </div>
              <div className="adm-card adm-stat">
                <div className="adm-stat-num">{leadsQuery.data?.filter((l: any) => l.status === "prospectado").length || 0}</div>
                <div className="adm-stat-label">Prospectados</div>
              </div>
              <div className="adm-card adm-stat">
                <div className="adm-stat-num">{leadsQuery.data?.filter((l: any) => l.status === "cotizacion_enviada").length || 0}</div>
                <div className="adm-stat-label">Cotizados</div>
              </div>
              <div className="adm-card adm-stat">
                <div className="adm-stat-num">{leadsQuery.data?.filter((l: any) => l.status === "cerrado").length || 0}</div>
                <div className="adm-stat-label">Cerrados</div>
              </div>
            </div>

            {/* Export Button */}
            <div style={{ marginBottom: 16 }}>
              <button onClick={handleExportCSV} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.2)", borderRadius: 20, padding: "8px 20px", color: "#C9A96E", fontSize: 12, cursor: "pointer" }}>
                ↓ Exportar CSV
              </button>
            </div>

            {/* Leads Table */}
            <div className="adm-card" style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(201,169,110,.1)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#C9A96E", fontWeight: 500, fontSize: 11, fontFamily: "JetBrains Mono" }}>Empresa</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#C9A96E", fontWeight: 500, fontSize: 11, fontFamily: "JetBrains Mono" }}>Contacto</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#C9A96E", fontWeight: 500, fontSize: 11, fontFamily: "JetBrains Mono" }}>Sector</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#C9A96E", fontWeight: 500, fontSize: 11, fontFamily: "JetBrains Mono" }}>Estado</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#C9A96E", fontWeight: 500, fontSize: 11, fontFamily: "JetBrains Mono" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsQuery.data?.map((lead: any) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid rgba(201,169,110,.05)" }}>
                      <td style={{ padding: "12px" }}>{lead.companyName}</td>
                      <td style={{ padding: "12px", color: "rgba(245,241,232,.6)" }}>{lead.contactName}</td>
                      <td style={{ padding: "12px", color: "rgba(245,241,232,.5)", fontFamily: "JetBrains Mono", fontSize: 11 }}>{lead.sector}</td>
                      <td style={{ padding: "12px" }}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          style={{ background: "rgba(10,10,10,.8)", border: "1px solid rgba(201,169,110,.15)", borderRadius: 8, padding: "4px 8px", color: "#C9A96E", fontSize: 11 }}
                        >
                          <option value="prospectado">Prospectado</option>
                          <option value="reunion_tecnica">Reunión Técnica</option>
                          <option value="cotizacion_enviada">Cotización Enviada</option>
                          <option value="cerrado">Cerrado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </td>
                      <td style={{ padding: "12px", fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(245,241,232,.3)" }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                  {(!leadsQuery.data || leadsQuery.data.length === 0) && (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "rgba(245,241,232,.3)" }}>Sin leads registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEGAL TAB */}
        {tab === "legal" && (
          <div>
            <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Estado Legal del Mes</h2>
            <p style={{ color: "rgba(245,241,232,.4)", fontSize: 13, marginBottom: 24, fontFamily: "JetBrains Mono" }}>
              {new Date().toLocaleString("es", { month: "long", year: "numeric" }).toUpperCase()}
            </p>

            <div className="adm-card">
              <p style={{ fontSize: 12, color: "rgba(245,241,232,.4)", marginBottom: 16 }}>Checklist de Cumplimiento Cooperativa</p>

              {[
                { key: "actaConsejoRector", label: "Acta Consejo Rector" },
                { key: "calendarioActividades", label: "Calendario de Actividades" },
                { key: "libroKilometraje", label: "Libro de Kilometraje" },
                { key: "fotosTaller", label: "Fotos del Taller" },
              ].map((item) => {
                const checked = legalQuery.data?.[item.key as keyof typeof legalQuery.data] as boolean || false;
                return (
                  <div
                    key={item.key}
                    className={`adm-check ${checked ? "done" : ""}`}
                    onClick={() => handleLegalToggle(item.key, !checked)}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${checked ? "#C9A96E" : "rgba(201,169,110,.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "rgba(201,169,110,.15)" : "transparent" }}>
                      {checked && <span style={{ color: "#C9A96E", fontSize: 12 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 14, color: checked ? "#C9A96E" : "rgba(245,241,232,.7)" }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {tab === "finance" && (
          <div>
            <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Módulos Financieros</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {/* Anticipos */}
              <div className="adm-card">
                <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 600, color: "#C9A96E", marginBottom: 8 }}>Anticipos</h3>
                <p style={{ fontSize: 12, color: "rgba(245,241,232,.4)", marginBottom: 16 }}>Art. 76 Ley Cooperativas</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: "#F5F1E8" }}>€{anticipoMax}</span>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "rgba(245,241,232,.4)" }}>LÍMITE MENSUAL</span>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(201,169,110,.05)", borderRadius: 8, border: "1px solid rgba(201,169,110,.08)" }}>
                  <p style={{ fontSize: 11, color: "rgba(245,241,232,.5)" }}>Devolución: Deducción mensual del 10% sobre facturación neta</p>
                </div>
              </div>

              {/* Dietas */}
              <div className="adm-card">
                <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 600, color: "#C9A96E", marginBottom: 8 }}>Dietas de Prospección</h3>
                <p style={{ fontSize: 12, color: "rgba(245,241,232,.4)", marginBottom: 16 }}>RD 439/2007</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: "#F5F1E8" }}>€{dietaDiaria}</span>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "rgba(245,241,232,.4)" }}>POR DÍA</span>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(201,169,110,.05)", borderRadius: 8, border: "1px solid rgba(201,169,110,.08)" }}>
                  <p style={{ fontSize: 11, color: "rgba(245,241,232,.5)" }}>Exenta IRPF. Requiere: justificante desplazamiento + actividad</p>
                </div>
              </div>

              {/* Cesión de Espacio */}
              <div className="adm-card">
                <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 600, color: "#C9A96E", marginBottom: 8 }}>Cesión de Espacio</h3>
                <p style={{ fontSize: 12, color: "rgba(245,241,232,.4)", marginBottom: 16 }}>Deducción alquiler taller</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: "#F5F1E8" }}>{cesionPct}%</span>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "rgba(245,241,232,.4)" }}>DEDUCIBLE</span>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(201,169,110,.05)", borderRadius: 8, border: "1px solid rgba(201,169,110,.08)" }}>
                  <p style={{ fontSize: 11, color: "rgba(245,241,232,.5)" }}>Ej: Alquiler €500 → €225 deducibles por cooperativa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
