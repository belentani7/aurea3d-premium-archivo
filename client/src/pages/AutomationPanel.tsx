import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2, Workflow, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TRIGGERS = ["new_lead", "lead_status_change", "form_submission", "scheduled"];
const ACTIONS = ["send_email", "create_task", "update_lead", "send_notification"];

type FormState = {
  name: string;
  description: string;
  trigger: string;
  action: string;
};

const emptyForm: FormState = { name: "", description: "", trigger: "", action: "" };

export default function AutomationPanel() {
  const { language, toggleLanguage } = useLanguage();
  const isEnglish = language === "en";
  const query = trpc.automations.list.useQuery();
  const utils = trpc.useUtils();
  const createMutation = trpc.automations.create.useMutation({
    onSuccess: () => {
      void utils.automations.list.invalidate();
      setForm(emptyForm);
      setStatusMessage("Automatización creada correctamente.");
      toast.success("Automatización creada");
    },
    onError: () => {
      setStatusMessage("No se pudo crear la automatización.");
      toast.error("No se pudo crear la automatización");
    },
  });
  const updateMutation = trpc.automations.update.useMutation({
    onSuccess: () => {
      void utils.automations.list.invalidate();
      setEditingId(null);
      setStatusMessage("Automatización actualizada correctamente.");
      toast.success("Automatización actualizada");
    },
    onError: () => {
      setStatusMessage("No se pudo actualizar la automatización.");
      toast.error("No se pudo actualizar la automatización");
    },
  });
  const deleteMutation = trpc.automations.delete.useMutation({
    onSuccess: () => {
      void utils.automations.list.invalidate();
      setStatusMessage("Automatización eliminada correctamente.");
      toast.success("Automatización eliminada");
    },
    onError: () => {
      setStatusMessage("No se pudo eliminar la automatización.");
      toast.error("No se pudo eliminar la automatización");
    },
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.trigger || !form.action) {
      toast.error("Completa nombre, disparador y acción");
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEdit = (automation: NonNullable<typeof query.data>[number]) => {
    setEditingId(automation.id);
    setForm({
      name: automation.name,
      description: automation.description ?? "",
      trigger: automation.trigger,
      action: automation.action,
    });
  };

  const toggle = (id: number, current: number) => {
    updateMutation.mutate({ id, isActive: current === 1 ? 0 : 1 });
  };

  const remove = (id: number) => {
    if (window.confirm("¿Eliminar esta automatización? Esta acción no se puede deshacer.")) {
      deleteMutation.mutate({ id });
    }
  };

  const automations = query.data ?? [];

  return (
    <DashboardLayout>
      <main className="space-y-8">
        <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 flex gap-3 text-sm">
            <a href="/dashboard" className="text-violet-200 transition hover:text-white">← Dashboard</a>
            <a href="/" className="text-white/45 transition hover:text-white">{isEnglish ? "Public site" : "Sitio público"}</a>
            <button type="button" onClick={toggleLanguage} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition hover:border-white/30 hover:text-white" aria-label={isEnglish ? "Switch to Spanish" : "Cambiar a inglés"}>{language.toUpperCase()}</button>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300/70">{isEnglish ? "Operations" : "Operaciones"}</p>
          <h1 className="mt-2 break-all text-3xl font-semibold text-white sm:text-4xl">AutomationPanel</h1>
          <p className="mt-2 max-w-2xl text-white/60">{isEnglish ? "Automate lead follow-up with persisted workflows you can control from this panel." : "Automatiza el seguimiento de leads con flujos persistidos y controlables desde este panel."}</p>
          <div aria-live="polite" className="mt-4 min-h-6 text-sm text-emerald-200">{statusMessage}</div>
        </motion.header>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            ["Flujos totales", automations.length],
            ["Activos", automations.filter((item) => item.isActive === 1).length],
            ["Inactivos", automations.filter((item) => item.isActive !== 1).length],
          ].map(([label, value], index) => (
            <motion.div key={String(label)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card className="border-white/10 bg-white/[0.06] p-5 text-white shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
                <p className="text-sm text-white/55">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-400/15 p-3"><Plus className="h-5 w-5 text-violet-200" /></div>
              <div>
                <h2 className="text-xl font-semibold">{editingId ? "Editar flujo" : "Nuevo flujo"}</h2>
                <p className="text-sm text-white/50">Define un disparador y una acción.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div><Label className="text-white/70">Nombre</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 border-white/10 bg-black/20 text-white" placeholder="Seguimiento de nuevos leads" /></div>
              <div><Label className="text-white/70">Descripción</Label><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 border-white/10 bg-black/20 text-white" placeholder="Qué debe ocurrir en este flujo" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="text-white/70">Disparador</Label><Select value={form.trigger} onValueChange={(value) => setForm({ ...form, trigger: value })}><SelectTrigger className="mt-2 border-white/10 bg-black/20 text-white"><SelectValue placeholder="Selecciona" /></SelectTrigger><SelectContent>{TRIGGERS.map((item) => <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-white/70">Acción</Label><Select value={form.action} onValueChange={(value) => setForm({ ...form, action: value })}><SelectTrigger className="mt-2 border-white/10 bg-black/20 text-white"><SelectValue placeholder="Selecciona" /></SelectTrigger><SelectContent>{ACTIONS.map((item) => <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="flex gap-3 pt-2"><Button onClick={submit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-violet-500 text-white hover:bg-violet-400">{editingId ? "Guardar cambios" : "Crear automatización"}</Button>{editingId && <Button variant="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-white/70">Cancelar</Button>}</div>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-cyan-400/15 p-3"><Workflow className="h-5 w-5 text-cyan-200" /></div><h2 className="text-xl font-semibold">Flujos configurados</h2></div><span className="text-xs text-white/45">{query.isLoading ? "Cargando" : `${automations.length} registros`}</span></div>
            {query.isError && <div className="rounded-xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">No se pudieron cargar las automatizaciones. Revisa la sesión y vuelve a intentarlo.</div>}
            {!query.isLoading && !query.isError && automations.length === 0 && <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/50"><Zap className="mx-auto mb-3 h-8 w-8 text-white/30" /><p>Aún no hay automatizaciones.</p></div>}
            <div className="space-y-3">{automations.map((automation) => <motion.article key={automation.id} layout className="rounded-2xl border border-white/10 bg-black/15 p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-medium text-white">{automation.name}</h3><p className="mt-1 text-sm text-white/50">{automation.description || "Sin descripción"}</p></div><button type="button" onClick={() => toggle(automation.id, automation.isActive)} className={`rounded-full px-3 py-1 text-xs transition ${automation.isActive === 1 ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-white/45"}`}>{automation.isActive === 1 ? "Activo" : "Inactivo"}</button></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55"><span className="rounded-full bg-white/10 px-3 py-1">{automation.trigger.replaceAll("_", " ")}</span><span className="rounded-full bg-white/10 px-3 py-1">{automation.action.replaceAll("_", " ")}</span></div><div className="mt-4 flex gap-2"><Button variant="ghost" size="sm" onClick={() => startEdit(automation)} className="text-violet-200 hover:bg-white/10"><Pencil className="mr-2 h-4 w-4" />Editar</Button><Button variant="ghost" size="sm" onClick={() => remove(automation.id)} className="text-red-200 hover:bg-red-400/10"><Trash2 className="mr-2 h-4 w-4" />Eliminar</Button></div></motion.article>)}</div>
          </Card>
        </section>
      </main>
    </DashboardLayout>
  );
}
