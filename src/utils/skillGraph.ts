export interface Skill {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  unlocked: boolean;
  x: number;
  y: number;
  requires?: string[];
  unlocks?: string[];
}

export const initialSkills: Omit<Skill, "completed" | "unlocked">[] = [
  {
    id: "html",
    name: "HTML",
    description: "Learn the foundation of web development. Master semantic HTML, forms, tables, and document structure.",
    x: 30,
    y: 50,
    requires: [],
    unlocks: ["CSS", "JavaScript", "Git"],
  },
  {
    id: "css",
    name: "CSS",
    description: "Style your web pages with CSS. Learn selectors, layouts, animations, and responsive design.",
    x: 45,
    y: 35,
    requires: ["html"],
    unlocks: [],
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Add interactivity to your websites. Learn variables, functions, DOM manipulation, and modern ES6+ features.",
    x: 50,
    y: 55,
    requires: ["html"],
    unlocks: ["Python"],
  },
  {
    id: "python",
    name: "Python",
    description: "Master Python programming for backend development, data science, and automation.",
    x: 65,
    y: 60,
    requires: ["javascript"],
    unlocks: [],
  },
  {
    id: "git",
    name: "Git",
    description: "Version control essentials. Learn commits, branches, merging, and collaboration with GitHub.",
    x: 55,
    y: 40,
    requires: ["html"],
    unlocks: [],
  },
];

export const checkUnlocked = (skill: Omit<Skill, "completed" | "unlocked">, completedSkills: Set<string>): boolean => {
  if (!skill.requires || skill.requires.length === 0) {
    return true;
  }
  return skill.requires.every((reqId) => completedSkills.has(reqId));
};

export const buildSkillsFromStorage = (): Skill[] => {
  const completed = new Set<string>(
    JSON.parse(localStorage.getItem("skillverse_completed") || "[]")
  );

  return initialSkills.map((skill) => ({
    ...skill,
    completed: completed.has(skill.id),
    unlocked: checkUnlocked(skill, completed),
  }));
};

export const saveProgress = (completedSkills: Set<string>) => {
  localStorage.setItem("skillverse_completed", JSON.stringify([...completedSkills]));
};
