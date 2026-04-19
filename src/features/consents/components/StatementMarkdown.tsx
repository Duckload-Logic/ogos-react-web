import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface StatementMarkdownProps {
  content: string;
}

export function StatementMarkdown({ content }: StatementMarkdownProps) {
  content = content !== "" ? content : "### Not available as of the moment";

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 rounded-2xl border",
        "border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm",
        "duration-700 md:p-10 lg:p-12",
      )}
    >
      <ReactMarkdown
        components={{
          // Main title – now solid primary for a clean, bold look
          h1: ({ node, ...props }) => (
            <h1
              className="mb-8 text-4xl font-extrabold tracking-tight text-primary md:text-5xl"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className={cn(
                "mb-4 mt-12 flex items-center gap-2 border-b-2 border-border",
                "pb-2 text-2xl font-bold text-foreground md:text-3xl",
              )}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong
              className="font-semibold text-primary"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="mb-6 list-none space-y-3 pl-2"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              className="flex items-start gap-3 text-base text-muted-foreground md:text-lg"
              {...props}
            >
              <span className="mt-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              <span className="flex-1">{props.children}</span>
            </li>
          ),
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-t border-border"
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code
              className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
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
