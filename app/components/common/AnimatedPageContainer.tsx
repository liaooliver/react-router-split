import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedPageContainerProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedPageContainer = ({
  children,
  className = "",
}: AnimatedPageContainerProps) => {
  return (
    <motion.div
      className={`max-w-md mx-auto p-4 space-y-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
