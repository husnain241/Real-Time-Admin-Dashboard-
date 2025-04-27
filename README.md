📚 Real-Time Admin Dashboard - React + ASP.NET Core + SignalR
💪 Project Overview
A real-time dashboard where:
•	🧑💻 Admins can manage users, send announcements, and chat individually with users.
•	🧑 Users can chat privately with Admins.
•	🟢 Online/offline status of users is tracked live using SignalR.
•	🔐 Authentication is handled via JWT tokens (Role-based: Admin and User).
•	💬 Chat messages are persisted into the database (SQL Server).
________________________________________
🏗 Tech Stack
Frontend	Backend	Realtime	Database
React.js	ASP.NET Core Web API (.NET 8)	SignalR	SQL Server (Entity Framework Core)
________________________________________
📂 Project Structure
/Frontend
•	/components
o	Navbar.jsx
o	ProtectedRoute.jsx
o	LoginForm.jsx
o	RegisterForm.jsx
o	ChatBox.jsx
o	UserStatusChart.jsx
•	/pages
o	AdminDashboard.jsx
o	UserDashboard.jsx
•	/context
o	AuthContext.jsx
•	App.jsx
•	services/api.js
•	.env
•	package.json
/Backend
•	/Controllers
o	AuthController.cs
•	/Hubs
o	UserHub.cs
•	/Models
o	ApplicationUser.cs
o	ChatMessage.cs
•	/Repositories
o	ChatRepository.cs
•	/Data
o	ApplicationDbContext.cs
•	Program.cs
•	appsettings.json
________________________________________
🚀 How to Run Locally
Backend (ASP.NET Core Web API)
1.	Open the backend folder in Visual Studio.
2.	Set your database connection string inside appsettings.json.
3.	Add migrations and update the database:
4.	dotnet ef migrations add InitialCreate
5.	dotnet ef database update
6.	Run the backend:
7.	dotnet run
________________________________________
Frontend (React.js)
1.	Navigate to the frontend directory.
2.	Install dependencies:
3.	npm install
4.	Set up the .env file with:
5.	REACT_APP_SIGNALR_URL=https://localhost:7110/userhub
6.	Start the frontend:
7.	npm start
________________________________________
✅ Core Features
🔐 Authentication
•	Secure login and registration system.
•	JWT token-based authentication with refresh-safe login.
•	Roles assigned: Admin and User.
👨💻 Admin Dashboard
•	View all registered users.
•	See live online/offline user status using SignalR.
•	Send broadcast announcements to all users.
•	Private 1-to-1 chat with users.
•	Authentication via localStorage (token + role).
👥 User Dashboard
•	View welcome panel/dashboard.
•	Receive real-time announcements from Admin.
•	Private chat support with Admin.
________________________________________
⚡ Real-Time Features (Powered by SignalR)
•	Auto-connect on user login.
•	Live online/offline status tracking across all clients.
•	Instant private messaging (Admin ↔ User).
•	Automatic updates without page refresh.
________________________________________
🧐 Important Notes
•	Login persists even after page refresh (localStorage based).
•	Only Admins can initiate chats with Users.
•	All SignalR hubs require JWT token authentication.
•	Automatically delete chat after 7 days
•	Broadcast announcements and private chats both supported.
•	Private chats and announcements are stored in the database.
________________________________________

________________________________________
🌟 Future Enhancements
•	✏️ Add "typing..." indicator when user/admin is typing.
•	👥 Enable group chat for multiple users.
•	🔔 Browser push notifications for new messages/announcements.
•	🛡️ Admin ability to block/ban users.
•	🧹 Improve frontend mobile responsiveness.
•	🔒 More secure role-based frontend route protection.
________________________________________
🏆 Credits
Built with ❤️ using React.js, ASP.NET Core, Entity Framework Core, and SignalR.
Author: ALI HUSNAIN
________________________________________

