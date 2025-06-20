using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodosController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodosController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos() =>
            await _context.Todos.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<TodoItem>> AddTodo(TodoItem item)
        {
            item.Completed = false;
            _context.Todos.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTodos), new { id = item.Id }, item);
        }

        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleComplete(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null) return NotFound();
            todo.Completed = !todo.Completed;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null) return NotFound();
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
