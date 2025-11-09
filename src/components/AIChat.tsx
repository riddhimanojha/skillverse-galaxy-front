import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export interface AIChatHandle {
  focus: () => void;
}

export const AIChat = forwardRef<AIChatHandle>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI learning assistant. I can help you find the perfect learning path. What would you like to learn?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string) => {
    setTimeout(() => {
      let response = "";
      const lower = userMessage.toLowerCase();

      if (lower.includes("python") || lower.includes("backend")) {
        response = "Great choice! Python is perfect for backend development. I recommend starting with the Python fundamentals, then moving to Flask or Django. Check out the Python constellation in your skill map! 🐍";
      } else if (lower.includes("react") || lower.includes("frontend")) {
        response = "Excellent! React is a powerful frontend framework. Start with HTML, CSS, and JavaScript basics, then dive into React. Look for the Frontend constellation! ⚛️";
      } else if (lower.includes("help") || lower.includes("what")) {
        response = "I can help you navigate your learning journey! Try exploring the constellation map - each star represents a skill. Click on unlocked skills to see resources and complete them. Use the 'Complete All' button when you're ready to test yourself! ✨";
      } else {
        response = "That sounds interesting! Explore the constellation map to find related skills. Each completed skill unlocks new ones in your learning journey. What specific area interests you most? 🌟";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    simulateResponse(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel rounded-2xl border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold text-foreground cosmic-glow">AI Learning Guide</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 animate-fade-in ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
                  : "glass-panel border border-primary/10"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/20 bg-background/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-background/80 border-primary/20 focus:border-primary/40"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

AIChat.displayName = "AIChat";
