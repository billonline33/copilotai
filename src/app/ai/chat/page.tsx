"use client";

export default function ChatPage() {
  return (
    <main style={{
      maxWidth: "1000px",
      margin: "40px auto",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 16px #eee",
      padding: "32px 24px",
      fontFamily: '"Inter", sans-serif',
      minHeight: "600px"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "24px",
        color: "#2d2d2d",
        fontSize: "2rem"
      }}>
        Chat Assistant 💬
      </h1>
      
      <div style={{
        textAlign: "center",
        color: "#666",
        padding: "40px 20px"
      }}>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          This is your blank chat page!
        </p>
        <p style={{ fontSize: "16px", color: "#888" }}>
          Ready for you to hand code the chat functionality.
        </p>
      </div>

      {/* Blank canvas area for your chat implementation */}
      <div style={{
        border: "2px dashed #ddd",
        borderRadius: "8px",
        padding: "40px",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "16px",
        gap: "20px"
      }}>

        <div style={{
          padding: "20px",
          backgroundColor: "#f0f8ff",
          borderRadius: "8px",
          border: "1px solid #007bff",
          alignSelf: "flex-end",
          maxWidth: "70%"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#007bff" }}>Me</div>
            <div style={{ color: "#333" }}>Tell me a joke about AI</div>
        </div>
        <div style={{
          padding: "20px",
          backgroundColor: "#f8fff0",
          borderRadius: "8px",
          border: "1px solid #28a745",
          alignSelf: "flex-start",
          maxWidth: "70%"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#28a745" }}>AI</div>
            <div style={{ color: "#333" }}>Hahaha, this is the AI answer</div>
        </div>
      </div>
    </main>
  );
}
