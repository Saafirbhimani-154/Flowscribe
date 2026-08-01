import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PreferencesForm from './components/PreferencesForm';

export default function SettingsLanguage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
      <div className="mb-8">
        <h3 className="text-2xl font-domine font-bold text-brand-text mb-2">Preferences</h3>
        <p className="text-brand-muted">Customize your workspace language and theme.</p>
      </div>

      <PreferencesForm slug={slug || ''} />
    </motion.div>
  );
}
