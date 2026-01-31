import { Shield, Lock } from "lucide-react";

export const OrionBadge = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-[rgba(15,21,53,0.6)] backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
        <div className="relative">
          <Shield className="w-4 h-4 text-[#00d9ff]" />
          <Lock className="w-2 h-2 text-[#00d9ff] absolute -bottom-0.5 -right-0.5" />
        </div>
        <span className="text-xs font-medium text-white/60">
          Powered by <span className="text-[#00d9ff] font-bold">ORION</span>
        </span>
      </div>
    </div>
  );
};
