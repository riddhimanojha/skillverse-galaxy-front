import { Finding } from "@/types/finding";
import { Star } from "./Star";

interface SecurityConstellationProps {
  findings: Finding[];
  onStarClick: (finding: Finding) => void;
}

export const SecurityConstellation = ({ findings, onStarClick }: SecurityConstellationProps) => {
  // Order: Auth (left), Database (center), API (right)
  const orderedCategories = ['Authentication', 'Database', 'API Security'];
  
  const orderedFindings = orderedCategories
    .map(cat => findings.find(f => f.category === cat))
    .filter((f): f is Finding => f !== undefined);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="text-[#00d9ff]">ORION</span> Security Map
        </h1>
        <p className="text-white/50 text-sm">Real-time vulnerability constellation</p>
      </div>

      {/* Constellation container */}
      <div className="relative">
        {/* Constellation lines (connecting stars) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 600 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00d9ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="threatLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2563" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#ff2563" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff2563" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          {/* Line from Auth to Database */}
          <line 
            x1="100" y1="100" 
            x2="300" y2="100"
            stroke={orderedFindings[0]?.is_vulnerable || orderedFindings[1]?.is_vulnerable 
              ? "url(#threatLineGradient)" 
              : "url(#lineGradient)"
            }
            strokeWidth="2"
            strokeDasharray={orderedFindings[0]?.is_vulnerable || orderedFindings[1]?.is_vulnerable ? "none" : "5,5"}
            className={orderedFindings[0]?.is_vulnerable || orderedFindings[1]?.is_vulnerable ? "animate-pulse" : ""}
          />
          
          {/* Line from Database to API */}
          <line 
            x1="300" y1="100" 
            x2="500" y2="100"
            stroke={orderedFindings[1]?.is_vulnerable || orderedFindings[2]?.is_vulnerable 
              ? "url(#threatLineGradient)" 
              : "url(#lineGradient)"
            }
            strokeWidth="2"
            strokeDasharray={orderedFindings[1]?.is_vulnerable || orderedFindings[2]?.is_vulnerable ? "none" : "5,5"}
            className={orderedFindings[1]?.is_vulnerable || orderedFindings[2]?.is_vulnerable ? "animate-pulse" : ""}
          />
        </svg>

        {/* Stars grid */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {orderedFindings.map((finding) => (
            <Star
              key={finding.id}
              finding={finding}
              onClick={() => onStarClick(finding)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
