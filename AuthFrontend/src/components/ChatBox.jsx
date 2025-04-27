import React, { useEffect, useState } from "react";
import api from "../services/api";

const ChatBox = ({ connection, chatWith, senderEmail, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!connection) return;

    // Load chat history
    const fetchChatHistory = async () => {
      try {
        const res = await api.get(
          `/auth/chat/history?user1=${senderEmail}&user2=${chatWith}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to load chat history:", err);
      }
    };

    fetchChatHistory();

    connection.on("ReceiveMessage", (sender, msg) => {
      if (sender === chatWith) {
        setMessages((prev) => [...prev, { senderEmail: sender, message: msg }]);
      }
    });

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [connection, chatWith, senderEmail]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await connection.invoke("SendPrivateMessage", chatWith, message.trim());
        setMessages((prev) => [...prev, { senderEmail: senderEmail, message }]);
        setMessage("");
      } catch (err) {
        console.error("❌ Send error:", err);
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <strong>Chat with {chatWith}</strong>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          ❌
        </button>
      </div>

      <div
        style={{
          height: "200px",
          overflowY: "auto",
          marginBottom: "10px",
          border: "1px solid #eee",
          padding: "5px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.senderEmail === senderEmail ? "right" : "left",
            }}
          >
            <p>
              <strong>
                {msg.senderEmail === senderEmail ? "Me" : msg.senderEmail}:
              </strong>{" "}
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
