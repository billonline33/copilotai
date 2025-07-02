"use client";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "uncompleted";

export default function TodoPage() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTask, setNewTask] = useState("");

  // Get next available ID
  function getNextId(): number {
    return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const newTodo: Todo = {
      id: getNextId(),
      title: newTask.trim(),
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setNewTask("");
  }

  function handleToggleCompleted(id: number) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function handleDeleteTask(id: number) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true;
  });

  return (
    <main style={{
      maxWidth: "480px",
      margin: "40px auto", 
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 16px #eee",
      padding: "32px 24px",
      fontFamily: '"Inter", sans-serif'
    }}>
      <h1 style={{textAlign: "center", marginBottom: "24px", color: "#2d2d2d", fontSize: "2rem"}}>To-Do List</h1>
      <nav style={{display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px"}}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: filter === "all" ? "#007bff" : "white",
            color: filter === "all" ? "white" : "#333",
            cursor: "pointer"
          }}
          disabled={filter === "all"}
        >
          All
        </button>
        <button
          onClick={() => setFilter("uncompleted")}
          style={{
            padding: "8px 16px", 
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: filter === "uncompleted" ? "#007bff" : "white",
            color: filter === "uncompleted" ? "white" : "#333",
            cursor: "pointer"
          }}
          disabled={filter === "uncompleted"}
        >
          Uncompleted
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd", 
            borderRadius: "4px",
            background: filter === "completed" ? "#007bff" : "white",
            color: filter === "completed" ? "white" : "#333",
            cursor: "pointer"
          }}
          disabled={filter === "completed"}
        >
          Completed
        </button>
      </nav>
      <form onSubmit={handleAddTask} style={{marginBottom: "24px", display: "flex", gap: "8px"}}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
        <button 
          type="submit" 
          disabled={!newTask.trim()}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !newTask.trim() ? "not-allowed" : "pointer",
            opacity: !newTask.trim() ? 0.6 : 1
          }}
        >
          Add
        </button>
      </form>
      
      {filteredTodos.length === 0 ? (
        <div style={{textAlign: "center", color: "#666", padding: "20px"}}>
          {filter === "all" ? "No tasks yet. Add one above!" : 
           filter === "completed" ? "No completed tasks yet." : 
           "No uncompleted tasks!"}
        </div>
      ) : (
        <ul style={{listStyle: "none", padding: 0}}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={{
              display: "flex",
              alignItems: "center", 
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              gap: "12px"
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id)}
                style={{cursor: "pointer"}}
              />
              <span style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#999" : "#333",
                flex: 1
              }}>
                {todo.title}
              </span>
              <button 
                onClick={() => handleDeleteTask(todo.id)}
                style={{
                  padding: "4px 8px",
                  background: "#dc3545",
                  color: "white", 
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >Delete</button>
            </li>
          ))}
        </ul>
      )}
      
      <div style={{marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#999"}}>
        📱 Data is saved locally in your browser
      </div>
    </main>
  );
}
