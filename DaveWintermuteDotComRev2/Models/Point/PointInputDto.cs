using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DaveWintermuteDotComRev2.Models.Point
{
    public class PointInputDto
    {
        public int X { get; set; }
        public int Y { get; set; }
        public string Color { get; set; }
        public double Width { get; set; }
        public double Opacity { get; set; }
    }
}
