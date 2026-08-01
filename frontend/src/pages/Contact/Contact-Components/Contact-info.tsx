import { Mail, MapPin } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-6xl font-light tracking-tight">
        Let's build <br/><span className="font-semibold text-blue-500">together.</span>
      </h1>
      <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
        Whether you have a question about our Vision AI parsing, need custom enterprise deployment, or just want to chat about architecture workflows, our team is ready to help.
      </p>
      
      <div className="space-y-6 pt-8 border-t border-zinc-800/50 max-w-md">
        <div className="flex items-center gap-4 text-zinc-300">
          <div className="p-3 bg-zinc-900 rounded-full text-blue-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Email Us</p>
            <p className="text-zinc-500 text-sm">saafirbhimani@gmail.com</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-zinc-300">
          <div className="p-3 bg-zinc-900 rounded-full text-blue-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Headquarters</p>
            <p className="text-zinc-500 text-sm">Surat, Gujarat, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
