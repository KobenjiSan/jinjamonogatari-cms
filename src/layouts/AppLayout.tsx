import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav/SideNav";
import Header from "../components/Header/Header";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />

      <main style={{ flex: 1 }}>
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
