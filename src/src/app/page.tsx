"use client";
import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "uncompleted";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      setNewTask("");
      await fetchTodos();
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setAdding(false);
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true;
  });

  return (
    <main>
      <h1>To-Do List</h1>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          All
        </button>
        <button
          onClick={() => setFilter("uncompleted")}
          disabled={filter === "uncompleted"}
        >
          Uncompleted
        </button>
        <button
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
        >
          Completed
        </button>
      </nav>
      <form onSubmit={handleAddTask} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          disabled={adding}
        />
        <button type="submit" disabled={adding || !newTask.trim()}>
          {adding ? "Adding..." : "Add"}
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />{" "}
            {todo.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
