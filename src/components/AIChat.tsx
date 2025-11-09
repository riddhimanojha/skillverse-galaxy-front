/**
 * AIChat - Demo chat interface component
 * Provides a focusable chat input for user interaction
 */

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";

export interface AIChatRef {
  focus: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Welcome to SkillVerse! I'm your AI learning companion. What would you like to learn today?",
    sender: "ai",
    timestamp: new Date(),
  },
];

export const AIChat = forwardRef<AIChatRef>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "Great choice! I'll help you master that skill. Click on any unlocked star in the galaxy to begin your journey.",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4 border border-primary/20">
      <h2 className="text-xl font-bold cosmic-glow">AI Learning Companion</h2>
      
      <div className="h-48 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-primary/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/50 text-foreground"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about any skill..."
          className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Chat input"
        />
        <Button
          onClick={handleSend}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

AIChat.displayName = "AIChat";
