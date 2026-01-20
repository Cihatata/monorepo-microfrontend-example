import { useAccount } from "platform/account";

export function Header() {
  const { data: account, isLoading } = useAccount();

  return (
    <header className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
          MF
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Web Analytics Platform
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="w-32 h-8 bg-slate-700 animate-pulse rounded" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center font-medium text-sm">
              {account?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="text-sm font-medium text-slate-200">
              {account?.name ?? "Guest"}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
