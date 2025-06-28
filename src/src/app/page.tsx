interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "uncompleted";

async function getTodos(): Promise<Todo[]> {
  const res = await fetch("http://localhost:3001/todos", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export default async function Home({ searchParams }: { searchParams?: { filter?: Filter } }) {
  const todos = await getTodos();
  const filter = searchParams?.filter || "all";
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
        <a href="?filter=all"><button disabled={filter === "all"}>All</button></a>
        <a href="?filter=uncompleted"><button disabled={filter === "uncompleted"}>Uncompleted</button></a>
        <a href="?filter=completed"><button disabled={filter === "completed"}>Completed</button></a>
      </nav>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly /> {todo.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
