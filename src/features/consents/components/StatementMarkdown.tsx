import ReactMarkdown from "react-markdown";

interface StatementMarkdownProps {
  content: string;
}

export function StatementMarkdown({ content }: StatementMarkdownProps) {
  content = content !== "" ? content : "### Not available as of the moment";

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <ReactMarkdown
        components={{
          // Main title – now solid primary for a clean, bold look
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-primary"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-4 pb-2 border-b-2 border-border flex items-center gap-2"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-primary" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-none space-y-3 mb-6 pl-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li
              className="flex items-start gap-3 text-muted-foreground text-base md:text-lg"
              {...props}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <span className="flex-1">{props.children}</span>
            </li>
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-border" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="px-1.5 py-0.5 rounded-md bg-muted text-foreground font-mono text-sm"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
