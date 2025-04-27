using RealDashBoard.Models;


public class ChatRepository
{
    private readonly ApplicationDbContext _context;

    public ChatRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SaveMessage(string senderEmail, string receiverEmail, string message)
    {
        var chatMessage = new ChatMessage
        {
            SenderEmail = senderEmail,
            ReceiverEmail = receiverEmail,
            Message = message,
            Timestamp = DateTime.UtcNow  // ✅ Save current time
        };

        _context.ChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();
    }


    public List<ChatMessage> GetChatHistory(string user1, string user2)
    {
        return _context.ChatMessages
            .Where(m =>
                (m.SenderEmail == user1 && m.ReceiverEmail == user2) ||
                (m.SenderEmail == user2 && m.ReceiverEmail == user1))
            .OrderBy(m => m.Timestamp)
            .ToList();
    }
}
