"use client";
import { useState, useEffect } from "react";
import styles from "./todo-app.module.scss";

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
      const res = await fetch("/api/todos");
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
      const res = await fetch("/api/todos", {
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

  async function handleToggleCompleted(id: number, completed: boolean) {
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTodos();
    } catch (err: unknown) {
      setError(String(err));
    }
  }

  async function handleDeleteTask(id: number) {
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTodos();
    } catch (err: unknown) {
      setError(String(err));
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true;
  });

  return (
    <main className={styles["todo-app"]}>
      <h1>To-Do List</h1>
      <nav>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.active : ""}
          disabled={filter === "all"}
        >
          All
        </button>
        <button
          onClick={() => setFilter("uncompleted")}
          className={filter === "uncompleted" ? styles.active : ""}
          disabled={filter === "uncompleted"}
        >
          Uncompleted
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? styles.active : ""}
          disabled={filter === "completed"}
        >
          Completed
        </button>
      </nav>
      <form onSubmit={handleAddTask}>
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
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo.id, todo.completed)}
            />
            <span className={todo.completed ? styles.completed : ""}>
              {todo.title}
            </span>
            <button onClick={() => handleDeleteTask(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
