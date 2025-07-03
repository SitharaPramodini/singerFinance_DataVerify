import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 10000); 

      return () => clearTimeout(timer);
    }
  }, [imageLoaded, navigate]);

  return (
    <div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center"
      >
        <img
          src="success.gif"
          className="mt-28 h-auto w-52 mb-4"
          alt="Success"
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? "block" : "none" }}
        />

        {imageLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="mb-4 mt-24 text-xl font-extrabold leading-none tracking-tight text-[#3fb5cf] md:text-3xl lg:text-4xl">
              Thank You! <br /> We have received your <br /> consent.
            </h1>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Success;
