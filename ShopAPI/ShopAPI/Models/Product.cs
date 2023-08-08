using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Models
{
    public class Product
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; } = "";

        [MaxLength(100)]
        public string Brand { get; set; } = "";

        [MaxLength(100)]
        public string Category { get; set; } = "";

        [Precision(16, 2)]
        public decimal Price { get; set; }

        public string Description { get; set; } = "";

        [MaxLength(100)]
        public string ImageFileName { get; set; } = "";
        public string ImageUrl { get; set; } = ""; // This property will store the Blob Storage URL for the image.

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
