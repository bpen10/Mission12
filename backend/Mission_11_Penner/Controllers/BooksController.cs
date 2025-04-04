// Controllers/BooksController.cs
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission_11_Penner.Models; // Replace with your actual namespace

namespace YourNamespace.Controllers // Replace with your actual namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<BooksResponse>> GetBooks(
            int pageNumber = 1,
            int pageSize = 5,
            string sortField = "Title",
            string sortDirection = "asc")
        {
            // Create a query that can be sorted
            var query = _context.Books.AsQueryable();

            // Apply sorting
            switch (sortField.ToLower())
            {
                case "title":
                    query = sortDirection.ToLower() == "asc" ?
                        query.OrderBy(b => b.Title) :
                        query.OrderByDescending(b => b.Title);
                    break;
                case "author":
                    query = sortDirection.ToLower() == "asc" ?
                        query.OrderBy(b => b.Author) :
                        query.OrderByDescending(b => b.Author);
                    break;
                case "price":
                    query = sortDirection.ToLower() == "asc" ?
                        query.OrderBy(b => b.Price) :
                        query.OrderByDescending(b => b.Price);
                    break;
                default:
                    query = query.OrderBy(b => b.Title);
                    break;
            }

            // Count total items
            var totalItems = await query.CountAsync();

            // Apply pagination
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new BooksResponse
            {
                Books = books,
                TotalBooks = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }

    public class BooksResponse
    {
        public List<Book> Books { get; set; }
        public int TotalBooks { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}