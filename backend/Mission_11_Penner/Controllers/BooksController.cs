// Controllers/BooksController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Mission_11_Penner.Models;

namespace Mission_11_Penner.Controllers
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
        public async Task<ActionResult<object>> GetBooks(
            int pageNumber = 1,
            int pageSize = 5,
            string sortField = "Title",
            string sortDirection = "asc",
            string category = "")
        {
            // Create a query that can be filtered and sorted
            var query = _context.Books.AsQueryable();

            // Apply category filter if provided
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(b => b.Category == category);
            }

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

            return new
            {
                Books = books,
                TotalBooks = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        // GET: api/Books/categories
        [HttpGet("categories")]
        public async Task<ActionResult<List<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .ToListAsync();

            return categories;
        }
    }
}