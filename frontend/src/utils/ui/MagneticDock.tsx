import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface DockIconProps {
  icon: LucideIcon;
  mouseX: any;
  title: string;
  href?: string;
  badge?: number;
}

function DockIcon({ icon: Icon, mouseX, title, href, badge }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate scaling based on distance to mouse
  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const iconScaleSync = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const InnerContent = (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-visible cursor-pointer transition-colors hover:bg-zinc-800"
    >
      <motion.div style={{ scale: iconScale }} className="flex items-center justify-center w-full h-full">
        <Icon className="w-5 h-5 text-zinc-300" />
      </motion.div>

      {/* Notification Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-zinc-950">
          {badge}
        </span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-10 left-1/2 whitespace-pre rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-semibold text-white shadow-sm"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Dot (Optional: static for now) */}
      <div className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );

  return href ? (
    <Link to={href} className="group overflow-visible">
      {InnerContent}
    </Link>
  ) : (
    <div className="group overflow-visible">{InnerContent}</div>
  );
}

export interface MagneticDockProps {
  items: {
    title: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
  }[];
}

export function MagneticDock({ items }: MagneticDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 flex h-16 -translate-x-1/2 items-end gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/80 px-4 pb-2 backdrop-blur-md shadow-2xl z-50"
    >
      {items.map((item, idx) => (
        <DockIcon
          key={idx}
          icon={item.icon}
          mouseX={mouseX}
          title={item.title}
          href={item.href}
          badge={item.badge}
        />
      ))}
    </motion.div>
  );
}
