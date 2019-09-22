using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static DaveWintermuteDotComRev2.Hubs.PointAccumulator;

namespace DaveWintermuteDotComRev2.Models.Point
{
    public class PointDto
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Id { get; set; }
        public string Color { get; set; }
        public double Width { get; set; }
        public double Opacity { get; set; }

        public static PointDto FromPoint(PointWithId point)
        {
            return new PointDto()
            {
                Id = point.Id,
                Color = point.Color,
                X = point.Point.X,
                Y = point.Point.Y,
                Width = point.Width,
                Opacity = point.Opacity
            };
        }
    }
}
