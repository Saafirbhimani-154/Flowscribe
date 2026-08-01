import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PasswordForm from './components/PasswordForm';

export default function SettingsPassword() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
      <div className="mb-8">
        <h3 className="text-2xl font-domine font-bold text-brand-text mb-2">Change Password</h3>
        <p className="text-brand-muted">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <PasswordForm slug={slug || ''} />
    </motion.div>
  );
}
