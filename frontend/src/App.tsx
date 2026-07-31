import './App.css';
import { AppRoutes } from './routing/app-routes';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      <AppRoutes />
    </div>
  );
}

export default App;
