import { DashboardHeader } from './components/DashboardHeader';
import { QuickActions } from './components/QuickActions';
import { StatsOverview } from './components/StatsOverview';
import { RecentActivity } from './components/RecentActivity';

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 p-8 pb-32 max-w-7xl mx-auto pt-20">
      <DashboardHeader />
      <QuickActions />
      <StatsOverview />
      <RecentActivity />
    </div>
  );
}
