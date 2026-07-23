import { motion } from 'framer-motion';

/**
 * Fixed ambient backdrop: a faint dotted grid, two slow-drifting aurora blobs,
 * and a vignette. Sits behind everything at z-0.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.10) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 100%)',
        }}
      />

      {/* Aurora blobs */}
      <motion.div
        className="absolute -left-40 top-[-10%] h-[38rem] w-[38rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.30), transparent 65%)' }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] top-[20%] h-[32rem] w-[32rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.20), transparent 65%)' }}
        animate={{ x: [0, -50, 20, 0], y: [0, 60, 10, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[30%] h-[34rem] w-[34rem] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.16), transparent 65%)' }}
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
