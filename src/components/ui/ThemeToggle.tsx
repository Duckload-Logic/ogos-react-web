import { Moon, Sun } from "lucide-react";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function ThemeToggle({ darkMode, setDarkMode }: Props) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 hover:bg-muted/30 rounded-lg transition-colors duration-300 text-primary-foreground"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
