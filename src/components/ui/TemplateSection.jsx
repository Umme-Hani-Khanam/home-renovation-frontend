import { useEffect, useState } from "react";
import api from "../../api/api";

export default function TemplateSection({ projectId }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data.data);
  };

  const applyTemplate = async (templateId) => {
    await api.post(`/projects/${projectId}/apply-template`, {
      templateId
    });
    alert("Template applied!");
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div key={template.id} className="premium-card">
          <h3 className="font-semibold">{template.name}</h3>
          <button
            onClick={() => applyTemplate(template.id)}
            className="mt-4 bg-[var(--primary)] text-white px-4 py-2 rounded-lg"
          >
            Apply Template
          </button>
        </div>
      ))}
    </div>
  );
}