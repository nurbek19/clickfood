import { motion, AnimatePresence } from 'framer-motion';

const AnimatedBottomButton = ({ visible, text, onClick }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={onClick}
          className='fixed-button'
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedBottomButton;