import { Link } from 'react-router-dom';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

export default function AuthFooter({ text, linkText, linkTo }: AuthFooterProps) {
  return (
    <p className="mt-8 text-center text-zinc-400 text-sm">
      {text}{' '}
      <Link to={linkTo} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
        {linkText}
      </Link>
    </p>
  );
}
