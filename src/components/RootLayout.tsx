import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen outline-none focus:outline-none"
    >
      <Outlet />
    </main>
  );
}
