import ProjectSelector from "@/components/project/ProjectSelector";
import InspirationSection from "@/components/project/InspirationSection";

export default function Inspiration() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inspiration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate renovation concepts and refine ideas with AI-assisted suggestions.
        </p>
      </div>

      <ProjectSelector required />

      <InspirationSection />
    </div>
  );
}
