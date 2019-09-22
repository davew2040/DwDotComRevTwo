using DaveWintermuteDotComRev2.Models.Point;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DaveWintermuteDotComRev2.Hubs
{
    public class PointAccumulator
    {
        private ConcurrentExclusiveSchedulerPair schedulerPair;
        private Queue<PointWithId> points;
        private int queueSize;
        private int id = 1;

        public PointAccumulator(int queueSize = 3)
        {
            this.schedulerPair = new ConcurrentExclusiveSchedulerPair();
            this.points = new Queue<PointWithId>();
            this.queueSize = queueSize;
        }

        public async Task<AddedRemoved<PointWithId>> AddPoint(PointInputDto dto)
        {
            var addedRemoved = await Task.Factory.StartNew(() =>
            {
                var newPoint = PointWithId.FromInputDto(dto, id++);
                this.points.Enqueue(newPoint);
                List<PointWithId> removalQueue = new List<PointWithId>();
                //this.added.OnNext(newPoint);

                while (this.points.Count > this.queueSize)
                {
                    removalQueue.Add(this.points.Dequeue());
                    //this.removed.OnNext(newPoint);
                }

                return new PointAccumulator.AddedRemoved<PointWithId>(
                    new List<PointWithId>() { newPoint },
                    removalQueue);
            },
                CancellationToken.None,
                TaskCreationOptions.DenyChildAttach,
                this.schedulerPair.ExclusiveScheduler);

            return addedRemoved;
        }

        public async Task<IReadOnlyCollection<PointWithId>> GetPoints()
        {
            IReadOnlyCollection<PointWithId> points;

            points = await Task.Factory.StartNew(() =>
            {
                return this.points.ToList().AsReadOnly();
            },
                CancellationToken.None,
                TaskCreationOptions.DenyChildAttach,
                this.schedulerPair.ExclusiveScheduler);

            return points;
        }

        public class AddedRemoved<T>
        {
            public IEnumerable<T> Added { get; }
            public IEnumerable<T> Removed { get; }

            public AddedRemoved(IEnumerable<T> added, IEnumerable<T> removed)
            {
                this.Added = added;
                this.Removed = removed;
            }
        }

        public class PointWithId
        {
            public int Id { get; }
            public Point Point { get; }
            public string Color { get; }
            public double Width { get; }
            public double Opacity { get; }

            private PointWithId() { }

            public PointWithId(int id, Point point, string color, double width, double opacity)
            {
                this.Id = id;
                this.Point = point;
                this.Color = color;
                this.Width = width;
                this.Opacity = opacity;
            }

            public static PointWithId FromInputDto(PointInputDto dto, int id)
            {
                return new PointWithId(id, new Point(dto.X, dto.Y), dto.Color, dto.Width, dto.Opacity);
            }
        }
    }
}
