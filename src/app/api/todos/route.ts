import { NextRequest, NextResponse } from "next/server";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Since we're moving to localStorage, these API routes will be simplified
// and mainly serve as fallbacks or for initial data

export async function GET() {
  // Return empty array - client will use localStorage
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  try {
    const { title, completed = false } = await req.json();
    
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // For localStorage approach, we'll just validate and return the todo
    // The actual persistence happens on the client side
    const newTodo: Todo = {
      id: Date.now(), // Simple ID generation for client-side use
      title: title.trim(),
      completed: Boolean(completed),
    };

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, completed } = await req.json();
    
    if (typeof id === "undefined") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // For localStorage approach, just return success
    // The actual update happens on the client side
    return NextResponse.json({ id, completed: Boolean(completed) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    if (typeof id === "undefined") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // For localStorage approach, just return success
    // The actual deletion happens on the client side
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
