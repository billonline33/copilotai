import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://localhost:3001/todos";

export async function PATCH(req: NextRequest) {
  try {
    const { id, completed } = await req.json();
    if (typeof id === "undefined") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (typeof id === "undefined") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    return NextResponse.json({ success: res.ok });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
