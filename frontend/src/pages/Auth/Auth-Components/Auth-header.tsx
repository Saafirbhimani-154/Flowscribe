interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-zinc-400">{subtitle}</p>
    </div>
  );
}
