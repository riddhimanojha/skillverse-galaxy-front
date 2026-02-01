export const AegisLogo = () => {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        {/* Subtle dark crimson ambient glow */}
        <div 
          className="absolute inset-0 blur-xl opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(0, 40%, 18%) 0%, transparent 70%)',
          }}
        />
        
        {/* Logo text with embossed treatment */}
        <h1 
          className="relative text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, hsl(0, 35%, 22%) 0%, hsl(0, 40%, 12%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            filter: 'drop-shadow(0 1px 0 rgba(80, 30, 30, 0.4)) drop-shadow(0 -1px 0 rgba(0,0,0,0.6))',
          }}
        >
          ORION
        </h1>
        
        {/* Subtle tagline */}
        <p 
          className="text-[10px] uppercase tracking-widest mt-0.5 opacity-50"
          style={{
            color: 'hsl(0, 20%, 35%)',
            letterSpacing: '0.15em',
            fontWeight: 500,
          }}
        >
          Security Monitor
        </p>
        
        {/* Subtle underline accent */}
        <div 
          className="h-px w-16 mt-2 opacity-40"
          style={{
            background: 'linear-gradient(90deg, hsl(0, 35%, 20%) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
};
