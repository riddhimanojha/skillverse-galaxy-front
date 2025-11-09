import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface DashboardButtonProps {
  onClick: () => void;
}

export const DashboardButton = ({ onClick }: DashboardButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-50 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-110 group"
      size="icon"
    >
      <BarChart3 className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
    </Button>
  );
};
