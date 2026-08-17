import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Play, Pause, Plus, Zap } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  trigger: "new_lead" | "lead_updated" | "daily_report" | "weekly_summary";
  action: "send_email" | "create_task" | "post_social" | "update_sheet";
  status: "active" | "inactive" | "error";
  lastRun?: string;
  nextRun?: string;
}

const automationTemplates = [
  {
    id: "lead_email",
    name: "Email de Confirmación a Leads",
    trigger: "new_lead",
    action: "send_email",
    description: "Envía email automático cuando llega un nuevo lead",
  },
  {
    id: "lead_reminder",
    name: "Recordatorio de Seguimiento",
    trigger: "lead_updated",
    action: "create_task",
    description: "Crea recordatorio a los 3 días si no hay respuesta",
  },
  {
    id: "daily_summary",
    name: "Resumen Diario",
    trigger: "daily_report",
    action: "send_email",
    description: "Envía resumen de leads y proyectos cada mañana",
  },
  {
    id: "social_post",
    name: "Publicar en Redes",
    trigger: "new_lead",
    action: "post_social",
    description: "Publica proyecto completado en Instagram/LinkedIn",
  },
];

export default function AutomationPanel() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Email de Confirmación a Leads",
      trigger: "new_lead",
      action: "send_email",
      status: "active",
      lastRun: "2026-07-03 14:32",
      nextRun: "Próximo lead",
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger: "new_lead" as const,
    action: "send_email" as const,
  });

  const handleAddAutomation = () => {
    if (!newAutomation.name) return;

    const automation: Automation = {
      id: Date.now().toString(),
      ...newAutomation,
      status: "active",
      lastRun: new Date().toLocaleString(),
    };

    setAutomations([...automations, automation]);
    setNewAutomation({ name: "", trigger: "new_lead", action: "send_email" });
    setShowDialog(false);
  };

  const toggleStatus = (id: string) => {
    setAutomations(
      automations.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600/30 text-green-400";
      case "inactive":
        return "bg-gray-600/30 text-gray-400";
      case "error":
        return "bg-red-600/30 text-red-400";
      default:
        return "bg-gray-600/30 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-amber-500 mb-4 flex items-center gap-3">
            <Zap size={40} />
            Panel de Automatizaciones
          </h1>
          <p className="text-gray-300 text-lg">
            Configura flujos automáticos sin código. Integra con Zapier o Make.com
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-amber-600 hover:bg-amber-700 text-black font-bold flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Automatización
          </Button>
        </div>

        {/* Active Automations */}
        <div className="grid gap-6 mb-12">
          {automations.map((automation) => (
            <Card key={automation.id} className="bg-gray-900 border-amber-600/30 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-amber-400">{automation.name}</h3>
                    <Badge className={getStatusColor(automation.status)}>
                      {automation.status === "active" ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">Disparador</p>
                      <p className="text-white font-semibold capitalize">{automation.trigger.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Acción</p>
                      <p className="text-white font-semibold capitalize">{automation.action.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Última ejecución</p>
                      <p className="text-white font-semibold">{automation.lastRun || "Nunca"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Próxima ejecución</p>
                      <p className="text-white font-semibold">{automation.nextRun || "Pendiente"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => toggleStatus(automation.id)}
                    className={
                      automation.status === "active"
                        ? "bg-green-600/30 hover:bg-green-600/50 text-green-400"
                        : "bg-gray-600/30 hover:bg-gray-600/50 text-gray-400"
                    }
                  >
                    {automation.status === "active" ? (
                      <>
                        <Play size={16} className="mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Pause size={16} className="mr-1" />
                        Activar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Webhook URL for Zapier/Make */}
              <div className="mt-4 pt-4 border-t border-amber-600/20">
                <p className="text-sm text-gray-400 mb-2">Webhook URL (copiar en Zapier/Make):</p>
                <div className="bg-black/50 p-3 rounded border border-amber-600/30 font-mono text-xs text-amber-400 break-all">
                  {`https://aurea3d.manus.space/api/webhooks/${automation.id}`}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Plantillas Recomendadas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {automationTemplates.map((template) => (
              <Card key={template.id} className="bg-gray-900 border-amber-600/30 p-6 hover:border-amber-600/60 transition-all">
                <h3 className="text-lg font-bold text-amber-400 mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Disparador:</span>
                    <span className="text-white ml-2 font-semibold capitalize">{template.trigger.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Acción:</span>
                    <span className="text-white ml-2 font-semibold capitalize">{template.action.replace("_", " ")}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setNewAutomation({
                      name: template.name,
                      trigger: template.trigger as any,
                      action: template.action as any,
                    });
                    setShowDialog(true);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold"
                >
                  Usar Plantilla
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-gray-900 border-amber-600/30">
            <DialogHeader>
              <DialogTitle className="text-amber-500">Nueva Automatización</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-amber-500 mb-2">Nombre</label>
                <Input
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  className="bg-black border-amber-600/50 text-white"
                  placeholder="Ej: Email a nuevos leads"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-500 mb-2">Disparador</label>
                <Select
                  value={newAutomation.trigger}
                  onValueChange={(v) => setNewAutomation({ ...newAutomation, trigger: v as any })}
                >
                  <SelectTrigger className="bg-black border-amber-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-amber-600/50">
                    <SelectItem value="new_lead">Nuevo Lead</SelectItem>
                    <SelectItem value="lead_updated">Lead Actualizado</SelectItem>
                    <SelectItem value="daily_report">Reporte Diario</SelectItem>
                    <SelectItem value="weekly_summary">Resumen Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-500 mb-2">Acción</label>
                <Select
                  value={newAutomation.action}
                  onValueChange={(v) => setNewAutomation({ ...newAutomation, action: v as any })}
                >
                  <SelectTrigger className="bg-black border-amber-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-amber-600/50">
                    <SelectItem value="send_email">Enviar Email</SelectItem>
                    <SelectItem value="create_task">Crear Tarea</SelectItem>
                    <SelectItem value="post_social">Publicar en Redes</SelectItem>
                    <SelectItem value="update_sheet">Actualizar Google Sheets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-600/20 border border-blue-600/50 p-4 rounded">
                <p className="text-blue-300 text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Después de crear, copia el Webhook URL y pégalo en Zapier o Make.com para completar la integración.
                  </span>
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddAutomation}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-bold"
                >
                  Crear Automatización
                </Button>
                <Button
                  onClick={() => setShowDialog(false)}
                  variant="outline"
                  className="flex-1 border-amber-600/50 text-amber-500 hover:bg-amber-600/10"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
