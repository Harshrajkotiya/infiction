import { motion } from "framer-motion";

const Layout = ({ children }) => (
  <motion.div
    // initial={{rotateY: 0,}}
    animate={{ y: ["-1200px", "0px"], opacity: [1,  1] }}
    // exit={{ rotateX: 180, rotateY: 180, transition: { duration: 3 } }}
    transition={
      {
        type: 'tween',
        ease: 'easeInOut',
        duration: 2,
      }
    }
   
  >
    {children}
  </motion.div>
);
export default Layout;
