import ProjectSelector from "@/components/project/ProjectSelector";
import TaskSection from "@/components/project/TaskSection";

export default function Tasks() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign tasks, collaborate with members, and manage recurring home maintenance schedules.
        </p>
      </div>

      <ProjectSelector required />

      <TaskSection />
    </div>
  );
}
