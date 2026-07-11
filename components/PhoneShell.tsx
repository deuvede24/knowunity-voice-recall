import { StatusBar } from "./StatusBar";

export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-x-hidden bg-app-bg"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <StatusBar />
      {children}
    </div>
  );
}
