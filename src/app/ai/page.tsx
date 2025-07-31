"use client";

import Link from "next/link";

export default function AIPage() {
  return (
    <main style={{
      maxWidth: "800px",
      margin: "40px auto",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 16px #eee",
      padding: "32px 24px",
      fontFamily: '"Inter", sans-serif',
      minHeight: "500px"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "24px",
        color: "#2d2d2d",
        fontSize: "2rem"
      }}>
        AI Assistant 🤖
      </h1>
      
      <div style={{
        textAlign: "center",
        color: "#666",
        padding: "40px 20px"
      }}>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Welcome to the AI section!
        </p>
        <p style={{ fontSize: "16px", color: "#888" }}>
          This page is ready for AI features to be implemented.
        </p>
      </div>

      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        marginTop: "40px"
      }}>
        <Link href="/ai/chat" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "20px",
            border: "2px solid #007bff",
            borderRadius: "8px",
            textAlign: "center",
            color: "#007bff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: "#f8f9ff"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9ff";
            e.currentTarget.style.color = "#007bff";
          }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>💬</div>
            <h3 style={{ margin: "0 0 10px 0" }}>Chat Assistant</h3>
            <p style={{ margin: "0", fontSize: "14px" }}>Click to open chat</p>
          </div>
        </Link>

        <div style={{
          padding: "20px",
          border: "2px dashed #ddd",
          borderRadius: "8px",
          textAlign: "center",
          color: "#666"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>📊</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Analytics</h3>
          <p style={{ margin: "0", fontSize: "14px" }}>Coming soon...</p>
        </div>

        <div style={{
          padding: "20px",
          border: "2px dashed #ddd",
          borderRadius: "8px",
          textAlign: "center",
          color: "#666"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>🎯</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Smart Recommendations</h3>
          <p style={{ margin: "0", fontSize: "14px" }}>Coming soon...</p>
        </div>
      </div>
    </main>
  );
}
