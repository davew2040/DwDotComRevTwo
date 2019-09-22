using DaveWintermuteDotComRev2.Models.Point;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DaveWintermuteDotComRev2.Hubs
{
    public class PointHub : Hub
    {
        private PointAccumulator accumulator;
        private readonly Regex colorRegex = new Regex("#[a-fA-F0-9]{6}");

        public PointHub(PointAccumulator accumulator)
        {
            this.accumulator = accumulator;
        }

        public override async Task OnConnectedAsync()
        {
            var currentPoints = await this.accumulator.GetPoints();
            await Clients.Caller.SendAsync("GetPoints", currentPoints.Select(p => PointDto.FromPoint(p)));
        }

        public async Task AddPoint(PointInputDto dto)
        {
            if (!this.colorRegex.IsMatch(dto.Color))
            {
                throw new ArgumentException("Color is not in a valid format.");
            }

            var addedRemoved = await this.accumulator.AddPoint(dto);
            var tasks = new List<Task>();

            foreach (var added in addedRemoved.Added)
            {
                tasks.Add(Clients.All.SendAsync("PointAdded", PointDto.FromPoint(added)));
            }

            foreach (var removed in addedRemoved.Removed)
            {
                tasks.Add(Clients.All.SendAsync("PointRemoved", removed.Id));
            }

            await Task.WhenAll(tasks);
        }
    }
}
