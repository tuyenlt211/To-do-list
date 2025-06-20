namespace TodoApi.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public string? Tag { get; set; }
        public DateTime? Deadline { get; set; }
        public bool Completed { get; set; }
    }
}
