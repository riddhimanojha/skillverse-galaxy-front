export const AegisLogo = () => {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        {/* Subtle deep crimson ambient glow */}
        <div 
          className="absolute inset-0 blur-xl opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, #7A1E3A 0%, transparent 70%)',
          }}
        />
        
        {/* Logo text with embossed treatment - deep crimson gradient */}
        <h1 
          className="relative text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, #7A1E3A 0%, #4A1225 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 1px 0 rgba(122, 30, 58, 0.3)) drop-shadow(0 -1px 0 rgba(0,0,0,0.7))',
          }}
        >
          ORION
        </h1>
        
        {/* Subtle tagline - muted sky blue */}
        <p 
          className="text-[10px] uppercase tracking-widest mt-0.5"
          style={{
            color: 'rgba(127, 183, 214, 0.5)',
            letterSpacing: '0.15em',
            fontWeight: 500,
          }}
        >
          Security Monitor
        </p>
        
        {/* Subtle underline accent - deep crimson fade */}
        <div 
          className="h-px w-16 mt-2 opacity-35"
          style={{
            background: 'linear-gradient(90deg, #7A1E3A 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
};
