import { AlertTriangle } from 'lucide-react';

export default function DangerZone({ slug }: { slug: string }) {
  return (
    <div className="mt-16 pt-8 border-t border-brand-secondary/30">
      <h3 className="text-xl font-domine font-bold text-red-600 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" /> Danger Zone
      </h3>
      <div className="border border-red-200 bg-red-50/50 rounded-2xl p-6 mt-4">
        <h4 className="font-semibold text-red-900">Delete Workspace Account</h4>
        <p className="text-red-700/80 text-sm mt-1 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 px-6 py-2.5 rounded-xl font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
