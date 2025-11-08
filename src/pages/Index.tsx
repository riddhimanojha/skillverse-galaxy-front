import { useState, useEffect } from "react";
import { GalaxyCanvas } from "@/components/GalaxyCanvas";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { SearchBar } from "@/components/SearchBar";
import { toast } from "sonner";

// ============================================
// API Configuration
// ============================================
// Replace with your actual backend URL
const BASE_API = "https://your-backend-api.com/api";

// ============================================
// Type Definitions
// ============================================
interface Skill {
  id: string;
  name: string;
  description: string;
  learned: boolean;
  x: number; // Position on canvas (percentage)
  y: number;
  connectors?: string[];
}

// ============================================
// Mock Data (Replace with API calls)
// ============================================
const mockSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript including variables, functions, and control flow.",
    learned: false,
    x: 20,
    y: 30,
    connectors: ["React Fundamentals", "TypeScript Basics"],
  },
  {
    id: "2",
    name: "React Fundamentals",
    description: "Master React concepts like components, props, state, and hooks.",
    learned: false,
    x: 35,
    y: 25,
    connectors: ["Next.js", "React Router"],
  },
  {
    id: "3",
    name: "CSS Grid & Flexbox",
    description: "Build responsive layouts using modern CSS Grid and Flexbox techniques.",
    learned: true,
    x: 50,
    y: 40,
    connectors: ["Tailwind CSS", "Responsive Design"],
  },
  {
    id: "4",
    name: "TypeScript Basics",
    description: "Add type safety to your JavaScript code with TypeScript fundamentals.",
    learned: false,
    x: 65,
    y: 35,
    connectors: ["Advanced TypeScript", "React with TypeScript"],
  },
  {
    id: "5",
    name: "Git & GitHub",
    description: "Version control essentials: commits, branches, merges, and collaboration.",
    learned: true,
    x: 30,
    y: 55,
    connectors: ["CI/CD", "GitHub Actions"],
  },
  {
    id: "6",
    name: "Node.js",
    description: "Server-side JavaScript with Node.js and npm package management.",
    learned: false,
    x: 45,
    y: 65,
    connectors: ["Express.js", "REST APIs"],
  },
  {
    id: "7",
    name: "REST APIs",
    description: "Design and consume RESTful APIs for backend communication.",
    learned: false,
    x: 70,
    y: 60,
    connectors: ["GraphQL", "API Authentication"],
  },
  {
    id: "8",
    name: "Database Design",
    description: "Learn SQL and NoSQL database design patterns and best practices.",
    learned: false,
    x: 55,
    y: 75,
    connectors: ["PostgreSQL", "MongoDB"],
  },
];

const Index = () => {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // ============================================
  // Mouse Tracking for Parallax Effect
  // ============================================
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ============================================
  // API Functions (Currently using mock data)
  // ============================================
  
  /**
   * Fetch all skills from backend
   * Expected response format:
   * [
   *   {
   *     "id": "1",
   *     "name": "JavaScript Basics",
   *     "description": "Learn JS fundamentals...",
   *     "learned": false,
   *     "x": 20,
   *     "y": 30
   *   },
   *   ...
   * ]
   */
  const fetchSkills = async () => {
    try {
      // Uncomment when backend is ready:
      // const response = await fetch(`${BASE_API}/skills`);
      // const data = await response.json();
      // setSkills(data);
      
      // Using mock data for now
      console.log("Fetching skills from:", `${BASE_API}/skills`);
      toast.info("Using mock data - connect your backend to load real skills");
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    }
  };

  /**
   * Fetch connector suggestions between two skills
   * Expected response format:
   * {
   *   "connectors": ["Skill A", "Skill B", "Skill C"]
   * }
   */
  const fetchConnectors = async (fromSkillId: string, toSkillId: string) => {
    try {
      // Uncomment when backend is ready:
      // const response = await fetch(
      //   `${BASE_API}/connectors?from=${fromSkillId}&to=${toSkillId}`
      // );
      // const data = await response.json();
      // return data.connectors;
      
      console.log("Fetching connectors:", `${BASE_API}/connectors?from=${fromSkillId}&to=${toSkillId}`);
      return [];
    } catch (error) {
      console.error("Error fetching connectors:", error);
      return [];
    }
  };

  /**
   * Mark a skill as learned
   * Expected request body: { "learned": true }
   * Expected response: { "success": true, "skill": { ...updated skill } }
   */
  const markSkillLearned = async (skillId: string) => {
    try {
      // Uncomment when backend is ready:
      // const response = await fetch(`${BASE_API}/skills/${skillId}/learn`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ learned: true }),
      // });
      // const data = await response.json();
      
      // Mock implementation
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === skillId ? { ...skill, learned: true } : skill
        )
      );
      
      toast.success("Skill marked as learned! ⭐", {
        description: "Keep up the great work!",
      });
      
      // Update selected skill if it's the one being modified
      if (selectedSkill?.id === skillId) {
        setSelectedSkill({ ...selectedSkill, learned: true });
      }
      
      console.log("Marking skill learned:", `${BASE_API}/skills/${skillId}/learn`);
    } catch (error) {
      console.error("Error marking skill learned:", error);
      toast.error("Failed to update skill");
    }
  };

  // Load skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // ============================================
  // Search and Filter Logic
  // ============================================
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSkillHighlighted = (skillId: string) => {
    if (!searchQuery) return false;
    return filteredSkills.some((s) => s.id === skillId);
  };

  // ============================================
  // Keyboard Accessibility
  // ============================================
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSkill) {
        setSelectedSkill(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSkill]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-gradient">
      {/* Galaxy Background Canvas */}
      <GalaxyCanvas mousePosition={mousePosition} />

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Title */}
      <div className="fixed top-6 left-6 z-20">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Skill<span className="text-primary">Verse</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Navigate your learning galaxy
        </p>
      </div>

      {/* Stats */}
      <div className="fixed bottom-6 left-6 z-20 bg-card/80 backdrop-blur-md border border-border rounded-lg p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Learned:</span>
            <span className="font-bold text-primary">
              {skills.filter((s) => s.learned).length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold text-foreground">{skills.length}</span>
          </div>
        </div>
      </div>

      {/* Skill Stars */}
      <div className="relative w-full h-screen">
        {skills.map((skill) => (
          <SkillStar
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkill(skill)}
            isHighlighted={isSkillHighlighted(skill.id)}
          />
        ))}
      </div>

      {/* Skill Detail Panel */}
      <SkillPanel
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onMarkLearned={markSkillLearned}
      />
    </div>
  );
};

export default Index;
