import React, { useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import './Drawer.css';

export function BottomDrawer({ isOpen, onClose, children }) {
  const y = useMotionValue(0);

  // Close if dragged down past threshold
  const handleDragEnd = (_, info) => {
    const shouldClose = info.velocity.y > 500 || info.point.y > window.innerHeight * 0.4;
    if (shouldClose) {
        // handleSelect([]);
        onClose();
    };
  };

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer-overlay open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
                // handleSelect([]);
                onClose();
            }}
          />

          {/* Drawer */}
          <motion.div
            className="drawer-container"
            style={{ y }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            // onClick={(e) => {e.stopPropagation()}}
          >
            <div className='drawer-line'>
              <div className="drawer-handle" />
            </div>
            <div className="drawer-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}