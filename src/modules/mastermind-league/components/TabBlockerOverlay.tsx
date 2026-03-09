"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TabBlockerOverlayProps {
  visible: boolean;
  onAcknowledge: () => void;
}

export function TabBlockerOverlay({ visible, onAcknowledge }: TabBlockerOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-icai-dark-grey/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="max-w-md mx-4 rounded-2xl border-2 border-icai-yellow/60 bg-icai-dark-grey p-8 text-center shadow-2xl"
          >
            <p className="text-5xl mb-4">⚠️</p>
            <h3 className="text-xl font-bold text-icai-light-grey mb-2">
              Stay on the game tab
            </h3>
            <p className="text-icai-light-blue mb-6">
              You switched to another tab. To keep the game fair, please stay on this tab while playing.
            </p>
            <button
              type="button"
              onClick={onAcknowledge}
              className="px-6 py-3 rounded-xl bg-icai-yellow text-icai-dark-indigo font-bold hover:bg-icai-yellow/90 transition-colors duration-150"
            >
              I&apos;m back
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
