import Navigation from "@/components/navigation";
import { Outlet } from "react-router";

const NavLayout = () => {
  return (
    <div className="bg-muted min-h-screen flex flex-col">
      <Navigation></Navigation>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;
