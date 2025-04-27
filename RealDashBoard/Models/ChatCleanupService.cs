using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class ChatCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public ChatCleanupService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

                var oldMessages = await dbContext.ChatMessages
                    .Where(m => m.Timestamp < oneWeekAgo)
                    .ToListAsync();

                if (oldMessages.Any())
                {
                    dbContext.ChatMessages.RemoveRange(oldMessages);
                    await dbContext.SaveChangesAsync();

                }
              
            }

            await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken); // Run every 60 minute
        }
    }
}
