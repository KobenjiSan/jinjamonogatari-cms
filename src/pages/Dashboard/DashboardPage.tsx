import DashboardHeader from "../../features/dashboard/DashboardHeader/DashboardHeader";
import UserCard from "../../features/dashboard/UserCard/UserCard";
import QuickCounts from "../../features/dashboard/QuickCounts/QuickCounts";
import QuickActions from "../../features/dashboard/QuickActions/QuickActions";

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="p-xl column gap-xl">
        <UserCard />
        <QuickCounts />
        <QuickActions />
      </div>
    </div>
  );
}
