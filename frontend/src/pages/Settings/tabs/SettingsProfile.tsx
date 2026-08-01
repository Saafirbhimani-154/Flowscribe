import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileForm from '../components/ProfileForm';
import DangerZone from '../components/DangerZone';

export default function SettingsProfile() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
      <div className="mb-8">
        <h3 className="text-2xl font-domine font-bold text-brand-text mb-2">Identity Profile</h3>
        <p className="text-brand-muted">Update your personal details and email address.</p>
      </div>

      <ProfileForm slug={slug || ''} />
      <DangerZone />
    </motion.div>
  );
}
