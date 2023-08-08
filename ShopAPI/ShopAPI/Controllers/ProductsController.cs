using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Models;
using ShopAPI.Services;
using System.Data;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment env;
        //categories list
        private readonly List<string> listCategories = new List<string>()
        {
            "Phones", "Computers", "Accessories", "Printers", "Cameras", "Other"
        };
        public ProductsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            this.context = context;
            this.env = env;
        }

        //get categories
        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            return Ok(listCategories);
        }

        //get products
        [HttpGet]
        public IActionResult GetProducts(string? search, string? category,
                    int? minPrice, int? maxPrice,
                    string? sort, string? order,
                    int? page)
        {
            IQueryable<Product> query = context.Product;

            // search functionality
            if (search != null)
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
            }

            if (category != null)
            {
                query = query.Where(p => p.Category == category);
            }

            if (minPrice != null)
            {
                query = query.Where(p => p.Price >= minPrice);
            }

            if (maxPrice != null)
            {
                query = query.Where(p => p.Price <= maxPrice);
            }

            // sort functionality
            if (sort == null) sort = "id";
            if (order == null || order != "asc") order = "desc";

            if (sort.ToLower() == "name")
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.Name);
                }
                else
                {
                    query = query.OrderByDescending(p => p.Name);
                }
            }
            else if (sort.ToLower() == "brand")
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.Brand);
                }
                else
                {
                    query = query.OrderByDescending(p => p.Brand);
                }
            }
            else if (sort.ToLower() == "category")
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.Category);
                }
                else
                {
                    query = query.OrderByDescending(p => p.Category);
                }
            }
            else if (sort.ToLower() == "price")
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.Price);
                }
                else
                {
                    query = query.OrderByDescending(p => p.Price);
                }
            }
            else if (sort.ToLower() == "date")
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.CreatedAt);
                }
                else
                {
                    query = query.OrderByDescending(p => p.CreatedAt);
                }
            }
            else
            {
                if (order == "asc")
                {
                    query = query.OrderBy(p => p.Id);
                }
                else
                {
                    query = query.OrderByDescending(p => p.Id);
                }
            }


            // pagination functionality
            if (page == null || page < 1) page = 1;

            int pageSize = 5;
            int totalPages = 0;

            decimal count = query.Count();
            totalPages = (int)Math.Ceiling(count / pageSize);

            query = query.Skip((int)(page - 1) * pageSize).Take(pageSize);


            var products = query.ToList();

            var response = new
            {
                Products = products,
                TotalPages = totalPages,
                PageSize = pageSize,
                Page = page
            };

            return Ok(response);
        }

        //get product by id
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = context.Product.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        //image
        private async Task<string> UploadImageToBlobStorage(IFormFile imageFile, string imageFileName)
        {
            // Initialize the Azure Blob Storage client
            var connectionString = "DefaultEndpointsProtocol=https;AccountName=productimages4262;AccountKey=LMy3zP2J7tLXfznekJ+QJChWO68Udrn5MvX7wO3qV6sArEufk0y0/NjPJxJ7/C1r/3gyWrjZjQG++ASt1Ikhaw==;EndpointSuffix=core.windows.net";
            var containerName = "productimages";
            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Upload the image to the Blob Storage container
            var blobClient = containerClient.GetBlobClient(imageFileName);
            using (var stream = imageFile.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // Get the Blob Storage URL for the uploaded image
            var blobStorageUrl = blobClient.Uri.ToString();
            return blobStorageUrl;
        }

        //create a product
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProductAsync([FromForm] ProductDto productDto)
        {
            if (!listCategories.Contains(productDto.Category))
            {
                ModelState.AddModelError("Category", "Please select a valid category");
                return BadRequest(ModelState);
            }

            if (productDto.ImageFile == null)
            {
                ModelState.AddModelError("ImageFile", "The image is required");
                return BadRequest(ModelState);
            }

            //save image on server
            string imageFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            imageFileName += Path.GetExtension(productDto.ImageFile.FileName);
            string imageUrl = await UploadImageToBlobStorage(productDto.ImageFile, imageFileName);

            // save product in the database
            Product product = new Product()
            {
                Name = productDto.Name,
                Brand = productDto.Brand,
                Category = productDto.Category,
                Price = productDto.Price,
                Description = productDto.Description ?? "",
                ImageFileName = imageFileName,
                ImageUrl = imageUrl, // Set the Blob Storage URL
                CreatedAt = DateTime.Now
            };

            context.Product.Add(product);
            context.SaveChanges();

            return Ok(product);
        }




        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDto productDto)
        {
            if (!listCategories.Contains(productDto.Category))
            {
                ModelState.AddModelError("Category", "Please select a valid category");
                return BadRequest(ModelState);
            }

            var product = context.Product.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            string imageFileName = product.ImageFileName;
            string imageUrl = product.ImageUrl;

            if (productDto.ImageFile != null)
            {
                // Save the image to Blob Storage
                imageFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + Path.GetExtension(productDto.ImageFile.FileName);
                imageUrl = await UploadImageToBlobStorage(productDto.ImageFile, imageFileName);
            }

            // Delete the old image if an updated image was provided
            if (product.ImageFileName != imageFileName)
            {
                await DeleteImageFromBlobStorage(product.ImageFileName);
            }

            // Update the product in the database
            product.Name = productDto.Name;
            product.Brand = productDto.Brand;
            product.Category = productDto.Category;
            product.Price = productDto.Price;
            product.Description = productDto.Description ?? "";
            product.ImageFileName = imageFileName;
            product.ImageUrl = imageUrl;

            context.SaveChanges();

            return Ok(product);
        }

        private async Task DeleteImageFromBlobStorage(string imageName)
        {
            var connectionString = "DefaultEndpointsProtocol=https;AccountName=productimages4262;AccountKey=LMy3zP2J7tLXfznekJ+QJChWO68Udrn5MvX7wO3qV6sArEufk0y0/NjPJxJ7/C1r/3gyWrjZjQG++ASt1Ikhaw==;EndpointSuffix=core.windows.net";
            var containerName = "productimages";

            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            BlobClient blobClient = containerClient.GetBlobClient(imageName);

            await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        }

        //delete product
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = context.Product.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            // delete the image on the server
            string imagesFolder = env.WebRootPath + "/images/products/";
            System.IO.File.Delete(imagesFolder + product.ImageFileName);


            // delete the product from the database
            context.Product.Remove(product);
            context.SaveChanges();

            return Ok();
        }
    }
}
