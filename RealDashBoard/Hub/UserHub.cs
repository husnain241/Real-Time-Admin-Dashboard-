using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

[Authorize]
public class UserHub : Hub
{
    public static ConcurrentDictionary<string, string> ConnectedUsers = new();
    private readonly ChatRepository _chatRepo;

    public UserHub(ChatRepository chatRepo)
    {
        _chatRepo = chatRepo;
    }
    public override async Task OnConnectedAsync()
    {
        var email = Context.User.Identity.Name;
        ConnectedUsers[email] = Context.ConnectionId;

        // Broadcast new online list to all
        await Clients.All.SendAsync("onlineuserslist", ConnectedUsers.Keys.ToList());
        await Clients.All.SendAsync("userstatuschanged", email, true);

        await base.OnConnectedAsync();
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var email = Context.User.Identity.Name;
        ConnectedUsers.TryRemove(email, out _);

        await Clients.All.SendAsync("OnlineUsersList", ConnectedUsers.Keys.ToList());
        await Clients.All.SendAsync("UserStatusChanged", email, false);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string toEmail, string message)
    {
        var fromEmail = Context.User?.Identity?.Name;
        if (fromEmail != null && toEmail != null)
        {
            await _chatRepo.SaveMessage(fromEmail, toEmail, message);
            await Clients.User(toEmail).SendAsync("ReceiveMessage", fromEmail, message);
        }
    }
    public async Task SendPrivateMessage(string targetEmail, string message)
    {
        var senderEmail = Context.User?.Identity?.Name;
        if (senderEmail != null && targetEmail != null)
        {
            // Send to target user
            await Clients.User(targetEmail).SendAsync("ReceiveMessage", senderEmail, message);

            // Save to DB
            await _chatRepo.SaveMessage(senderEmail, targetEmail, message);
        }
    }

    public async Task SendAdminMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveAdminMessage", message);
    }





}
