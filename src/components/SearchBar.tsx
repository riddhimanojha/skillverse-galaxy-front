import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search skills..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-card/80 backdrop-blur-md border-border focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
};
