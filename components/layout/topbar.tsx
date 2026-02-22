export default function Topbar() {
  return (
    <header className="h-14 border-b bg-background px-6 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        System Monitoring Dashboard
      </div>

      <div className="text-xs text-muted-foreground">
        Auto-refresh every 10s
      </div>
    </header>
  );
}