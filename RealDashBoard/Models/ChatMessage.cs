﻿namespace RealDashBoard.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public string SenderEmail { get; set; }
    public string ReceiverEmail { get; set; }
    public string Message { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
