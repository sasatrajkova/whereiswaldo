export default function SplashScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/20 via-background to-secondary/30">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className={`text-center transition-all duration-1000`}>
          {/* Magnifying glass icon */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
            <span className="inline-block animate-wiggle">{"Where's"}</span>
            <br />
            <span
              className="inline-block text-transparent bg-clip-text bg-primary animate-pulse"
              style={{
                WebkitTextStroke: '2px currentColor',
                paintOrder: 'stroke fill',
              }}
            >
              Waldo?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
            {'Embark on a jungle adventure and find Waldo hidden in the wild!'}
          </p>
        </div>
      </div>
    </main>
  );
}
