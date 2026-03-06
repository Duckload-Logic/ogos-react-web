import { Moon, Sun } from "lucide-react";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function ThemeToggle({ darkMode, setDarkMode }: Props) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 hover:bg-muted rounded-lg"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}