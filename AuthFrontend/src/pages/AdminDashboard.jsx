import React, { useEffect, useState } from "react";
import api from "../services/api";
import * as signalR from "@microsoft/signalr";
import ChatBox from "../components/ChatBox";
import { Trash2, MessageSquare, SendHorizonal } from "lucide-react";
import UserStatusChart from "../components/UserStatusChart";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [chatWith, setChatWith] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/all-users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();

    const token = localStorage.getItem("token");

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
        console.log("✅ SignalR connected");
        setConnection(newConnection);

        newConnection.on("OnlineUsersList", (list) => {
          setOnlineUsers(new Set(list));
        });

        newConnection.on("UserStatusChanged", (email, isOnline) => {
          setOnlineUsers((prev) => {
            const updated = new Set(prev);
            isOnline ? updated.add(email) : updated.delete(email);
            return updated;
          });
        });
      })
      .catch((err) => console.error("❌ SignalR connection failed:", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleSendAnnouncement = async () => {
    if (connection && message.trim()) {
      try {
        connection.invoke("SendAdminMessage", message);
        setMessage("");
      } catch (err) {
        console.error("❌ Failed to send announcement:", err);
      }
    }
  };

  const handleOpenChat = (email) => {
    setChatWith(email);
  };

  const handleDeleteUser = async (email) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${email}?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/auth/delete-user/${email}`);
      alert("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="admin-container" style={{ padding: "20px" }}>
      <h3>📥 Send Announcement</h3>
      <div
        style={{ position: "relative", width: "300px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Type your announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 36px 8px 12px", // extra right padding for icon
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <SendHorizonal
          onClick={handleSendAnnouncement}
          className="send-icon-inside-input"
          size={18}
          title="Send"
        />
      </div>

      <h2 className="section-title">📋 Registered Users</h2>
      <UserStatusChart
        onlineCount={Array.from(onlineUsers).length}
        offlineCount={users.length - Array.from(onlineUsers).length}
      />

      <div className="user-list">
        {users
          .filter((user) => user.email !== localStorage.getItem("email"))
          .map((user, index) => (
            <div
              key={index}
              className="user-row"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="user-info">
                <p className="user-email">👤 {user.email}</p>
                <p className="user-status">
                  Status:{" "}
                  <span
                    className={
                      onlineUsers.has(user.email)
                        ? "status-dot online"
                        : "status-dot offline"
                    }
                  >
                    ● {onlineUsers.has(user.email) ? "Online" : "Offline"}
                  </span>
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Trash2
                  className="icon-action delete-icon"
                  size={22}
                  onClick={() => handleDeleteUser(user.email)}
                  title="Delete User"
                />

                <MessageSquare
                  className="icon-action chat-icon"
                  size={22}
                  onClick={() => handleOpenChat(user.email)}
                  title="Chat with User"
                />
              </div>
            </div>
          ))}
      </div>

      {/* Common ChatBox usage */}
      {chatWith && connection && (
        <ChatBox
          connection={connection}
          chatWith={chatWith}
          senderEmail={localStorage.getItem("email")} // dynamic admin email
          onClose={() => setChatWith(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
