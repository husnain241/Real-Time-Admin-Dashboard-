import * as signalR from "@microsoft/signalr";

let connection = null;

export const connectToHub = (onUserConnected, onUserDisconnected) => {
  const token = localStorage.getItem("token");

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7110/userhub", {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();

  connection.on("UserConnected", (connId) => {
    console.log("User connected:", connId);
    onUserConnected(connId);
  });

  connection.on("UserDisconnected", (connId) => {
    console.log("User disconnected:", connId);
    onUserDisconnected(connId);
  });

  connection
    .start()
    .then(() => console.log("SignalR Connected"))
    .catch((err) => console.error("SignalR Error: ", err));
};

export const getConnection = () => connection;
