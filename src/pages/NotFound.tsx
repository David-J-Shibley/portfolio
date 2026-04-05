import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <PageMeta title="Page not found" description="This page does not exist." />
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        className="glass-card max-w-md w-full p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-9xl font-bold mb-4 opacity-20"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{ 
            duration: 4, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        >
          404
        </motion.div>
        <h1 className="heading-md mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <motion.a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={18} />
          Return to Home
        </motion.a>
      </motion.div>
    </div>
    </>
  );
};

export default NotFound;
