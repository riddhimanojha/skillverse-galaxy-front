export interface LearningMaterial {
  introduction: string;
  concepts: {
    title: string;
    description: string;
  }[];
  codeExample?: {
    title: string;
    code: string;
  };
}

export const learningMaterials: Record<string, LearningMaterial> = {
  html: {
    introduction: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of a webpage using elements and tags.",
    concepts: [
      {
        title: "What is HTML?",
        description: "HTML is the backbone of web pages. It defines the structure and content using tags wrapped in angle brackets."
      },
      {
        title: "Tags and Elements",
        description: "Elements consist of opening tags, content, and closing tags. For example: <p>This is a paragraph</p>"
      },
      {
        title: "Attributes",
        description: "Tags can have attributes that provide additional information. For example: <a href='url'>Link</a>"
      },
      {
        title: "Semantic HTML",
        description: "Use meaningful tags like <header>, <nav>, <main>, <article>, and <footer> to describe content structure."
      },
      {
        title: "Document Structure",
        description: "Every HTML document starts with <!DOCTYPE html>, followed by <html>, <head>, and <body> tags."
      },
      {
        title: "Common Elements",
        description: "Learn headings (h1-h6), paragraphs (p), lists (ul, ol), images (img), and links (a)."
      }
    ],
    codeExample: {
      title: "Basic HTML Structure",
      code: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello Galaxy</h1>
    <p>Welcome to web development!</p>
  </body>
</html>`
    }
  },
  css: {
    introduction: "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and positioning of HTML elements.",
    concepts: [
      {
        title: "What is CSS?",
        description: "CSS is a stylesheet language that describes how HTML elements should be displayed on screen."
      },
      {
        title: "Selectors",
        description: "Target elements using tag names, classes (.class), IDs (#id), or attribute selectors."
      },
      {
        title: "Properties and Values",
        description: "CSS rules consist of properties (like color, font-size) and their values (like red, 16px)."
      },
      {
        title: "The Box Model",
        description: "Every element is a box with content, padding, border, and margin areas."
      },
      {
        title: "Layout Techniques",
        description: "Use flexbox and grid for modern, responsive layouts."
      },
      {
        title: "Responsive Design",
        description: "Use media queries to adapt styles for different screen sizes and devices."
      }
    ],
    codeExample: {
      title: "Basic CSS Styling",
      code: `.galaxy-header {
  color: #9b59d0;
  font-size: 2rem;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}`
    }
  },
  javascript: {
    introduction: "JavaScript is a powerful programming language that adds interactivity and dynamic behavior to web pages. It can manipulate HTML, respond to user events, and communicate with servers.",
    concepts: [
      {
        title: "What is JavaScript?",
        description: "JavaScript makes web pages interactive. It runs in the browser and can modify content in real-time."
      },
      {
        title: "Variables and Data Types",
        description: "Store data using let, const, or var. Common types include strings, numbers, booleans, arrays, and objects."
      },
      {
        title: "Functions",
        description: "Reusable blocks of code that perform specific tasks. Can accept parameters and return values."
      },
      {
        title: "DOM Manipulation",
        description: "Select and modify HTML elements using methods like querySelector, getElementById, and innerHTML."
      },
      {
        title: "Events",
        description: "Respond to user interactions like clicks, keypresses, and form submissions using event listeners."
      },
      {
        title: "Conditional Logic",
        description: "Make decisions in code using if/else statements and switch cases."
      }
    ],
    codeExample: {
      title: "Interactive Button Example",
      code: `const button = document.querySelector('.galaxy-btn');

button.addEventListener('click', () => {
  console.log('Button clicked!');
  button.textContent = 'Clicked!';
  button.style.background = '#764ba2';
});`
    }
  },
  python: {
    introduction: "Python is a versatile, beginner-friendly programming language known for its readable syntax. It's used in web development, data science, automation, AI, and more.",
    concepts: [
      {
        title: "What is Python?",
        description: "Python is a high-level, interpreted language that emphasizes code readability and simplicity."
      },
      {
        title: "Variables and Types",
        description: "Python is dynamically typed. Common types include int, float, str, list, dict, and bool."
      },
      {
        title: "Indentation Matters",
        description: "Python uses indentation (spaces or tabs) to define code blocks instead of curly braces."
      },
      {
        title: "Functions and Methods",
        description: "Define functions using def keyword. Call built-in methods on objects like strings and lists."
      },
      {
        title: "Lists and Dictionaries",
        description: "Lists store ordered collections, dictionaries store key-value pairs for fast lookups."
      },
      {
        title: "Control Flow",
        description: "Use if/elif/else for decisions, for and while for loops, and try/except for error handling."
      }
    ],
    codeExample: {
      title: "Python Basics",
      code: `# Define a function
def greet_galaxy(name):
    return f"Hello, {name} from the galaxy!"

# Use the function
message = greet_galaxy("Explorer")
print(message)

# List and loop
skills = ["HTML", "CSS", "JavaScript"]
for skill in skills:
    print(f"Learning {skill}")`
    }
  },
  react: {
    introduction: "React is a JavaScript library for building user interfaces. It uses components to create reusable UI elements and efficiently updates the page when data changes.",
    concepts: [
      {
        title: "What is React?",
        description: "React is a component-based library for building interactive UIs. It makes it easy to create complex interfaces from small, isolated pieces."
      },
      {
        title: "Components",
        description: "Components are reusable pieces of UI. They can be function components or class components."
      },
      {
        title: "JSX Syntax",
        description: "JSX allows you to write HTML-like syntax in JavaScript. It gets compiled to JavaScript function calls."
      },
      {
        title: "Props",
        description: "Props (properties) are how you pass data from parent to child components. They're read-only."
      },
      {
        title: "State",
        description: "State is data that changes over time. Use useState hook to add state to function components."
      },
      {
        title: "Hooks",
        description: "Hooks like useState, useEffect, and useContext let you use React features in function components."
      }
    ],
    codeExample: {
      title: "Simple React Component",
      code: `import { useState } from 'react';

function GalaxyCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>Stars Collected: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Collect Star ⭐
      </button>
    </div>
  );
}`
    }
  },
  typescript: {
    introduction: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type checking to catch errors early and improve code quality.",
    concepts: [
      {
        title: "What is TypeScript?",
        description: "TypeScript extends JavaScript by adding type annotations. It helps catch bugs before runtime."
      },
      {
        title: "Type Annotations",
        description: "Explicitly declare types for variables, parameters, and return values using : syntax."
      },
      {
        title: "Interfaces",
        description: "Define the shape of objects using interfaces. They describe what properties an object should have."
      },
      {
        title: "Type Inference",
        description: "TypeScript can often infer types automatically, so you don't always need to write them explicitly."
      },
      {
        title: "Generics",
        description: "Create reusable components that work with multiple types while maintaining type safety."
      },
      {
        title: "Union and Intersection Types",
        description: "Combine types using | (union) or & (intersection) for flexible type definitions."
      }
    ],
    codeExample: {
      title: "TypeScript Example",
      code: `interface Skill {
  id: string;
  name: string;
  completed: boolean;
}

function completeSkill(skill: Skill): Skill {
  return {
    ...skill,
    completed: true
  };
}

const htmlSkill: Skill = {
  id: "html",
  name: "HTML Basics",
  completed: false
};`
    }
  },
  nodejs: {
    introduction: "Node.js is a JavaScript runtime that lets you run JavaScript on the server. It's built on Chrome's V8 engine and uses an event-driven, non-blocking I/O model.",
    concepts: [
      {
        title: "What is Node.js?",
        description: "Node.js allows JavaScript to run outside the browser, enabling server-side development."
      },
      {
        title: "Modules and Require",
        description: "Organize code into modules using require() or ES6 import/export syntax."
      },
      {
        title: "NPM (Node Package Manager)",
        description: "NPM manages packages and dependencies. Install libraries using npm install."
      },
      {
        title: "Event Loop",
        description: "Node.js uses an event-driven architecture. Asynchronous operations don't block the main thread."
      },
      {
        title: "HTTP Server",
        description: "Create web servers using the built-in http module or frameworks like Express."
      },
      {
        title: "File System",
        description: "Read and write files using the fs module. Supports both synchronous and asynchronous operations."
      }
    ],
    codeExample: {
      title: "Simple HTTP Server",
      code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from the Galaxy Server!</h1>');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`
    }
  }
};

export function getLearningMaterial(skillId: string): LearningMaterial | null {
  return learningMaterials[skillId] || null;
}
