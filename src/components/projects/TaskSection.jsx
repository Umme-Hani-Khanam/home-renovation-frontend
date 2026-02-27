import { useEffect, useState } from "react";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function TasksSection({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${projectId}`);
    setTasks(res.data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const addTask = async () => {
    if (!title) return;

    await API.post("/tasks", {
      project_id: projectId,
      title,
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await API.patch(`/tasks/${task.id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Tasks</h3>

        <div className="flex gap-2">
          <Input
            placeholder="New Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={addTask}>Add</Button>
        </div>

        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks yet.</p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border p-3 rounded-md hover:bg-gray-50 transition"
          >
            <div
              onClick={() => toggleTask(task)}
              className="cursor-pointer flex items-center gap-2"
            >
              <Badge variant={task.completed ? "default" : "secondary"}>
                {task.completed ? "Completed" : "Pending"}
              </Badge>
              <span
                className={
                  task.completed ? "line-through text-gray-500" : ""
                }
              >
                {task.title}
              </span>
            </div>

            <Trash2
              className="h-4 w-4 text-red-500 cursor-pointer"
              onClick={() => deleteTask(task.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}