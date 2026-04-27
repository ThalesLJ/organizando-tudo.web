type AppLoadingProps = {
  label: string;
};

export function AppLoading({ label }: AppLoadingProps) {
  return (
    <div className="app-loading-overlay absolute inset-0 z-10 flex select-none items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
