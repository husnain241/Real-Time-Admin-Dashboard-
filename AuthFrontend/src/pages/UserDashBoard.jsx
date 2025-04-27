import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import ChatBox from "../components/ChatBox";

const UserDashboard = () => {
  const [notification, setNotification] = useState("");
  const [connection, setConnection] = useState(null);
  const [chatWithAdmin, setChatWithAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email"); // 👈 get logged-in user's email
    setUserEmail(email);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_SIGNALR_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ User SignalR Connected");
        setConnection(newConnection);

        newConnection.on("ReceiveAdminMessage", (msg) => {
          setNotification(msg);
        });

        newConnection.on("ReceiveMessage", (from, msg) => {
          console.log("🔔 Private message from:", from, msg);
        });
      })
      .catch((err) => console.error("❌ SignalR connection error:", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleOpenChat = () => {
    setChatWithAdmin(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      {notification && (
        <div
          style={{
            backgroundColor: "#ffeeba",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ffeeba",
          }}
        >
          <strong>📢 Admin says:</strong> {notification}
        </div>
      )}

      <h1>Welcome, {userEmail || "User"}!</h1>

      {/* Button to start chat with Admin */}
      <button
        onClick={handleOpenChat}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Chat with Admin
      </button>

      {/* Common ChatBox usage */}
      {chatWithAdmin && connection && (
        <ChatBox
          connection={connection}
          chatWith="admin@example.com" // chatting to Admin
          senderEmail={userEmail} // 🔥 dynamically logged-in user email
          onClose={() => setChatWithAdmin(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
