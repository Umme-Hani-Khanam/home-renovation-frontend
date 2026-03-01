import ProjectSelector from "@/components/project/ProjectSelector";
import ContractorSection from "@/components/project/ContractorSection";

export default function Contractors() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add contractors, schedule visits, and monitor contractor activity trends.
        </p>
      </div>

      <ProjectSelector required />

      <ContractorSection />
    </div>
  );
}
