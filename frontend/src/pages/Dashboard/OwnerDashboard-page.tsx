import { DashboardHeader } from './components/DashboardHeader';
import { QuickActions } from './components/QuickActions';
import { StatsOverview } from './components/StatsOverview';
import { RecentActivity } from './components/RecentActivity';
import ConstellationCanvas from '../../../utils/ui/ConstellationCanvas';

export default function OwnerDashboardPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ConstellationCanvas />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 p-8 pb-32 max-w-7xl mx-auto pt-20">
        <DashboardHeader />
        <QuickActions />
        <StatsOverview />
        <RecentActivity />
      </div>
    </div>
  );
}
