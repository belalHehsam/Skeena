export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 max-w-[70%] bg-card border border-border rounded-[18px_18px_18px_4px] p-3 shadow-sm mr-auto select-none animate-fade-in">
      <div className="flex gap-1.5 items-center py-1 px-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-400 animate-bounce" />
      </div>
    </div>
  );
}
export default TypingIndicator;
