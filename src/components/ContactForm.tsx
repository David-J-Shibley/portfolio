import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import emailjs from 'emailjs-com'

import '../index.css'

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as HTMLFormElement)[0].value;
    const email = (e.target as HTMLFormElement)[1].value;
    const message = (e.target as HTMLFormElement)[2].value;
  
    setIsSubmitting(true);
  
    const templateParams = {
      to_email: "davidjshibley@gmail.com",
      from_name: name,
      from_email: email,
      message: message,
    };
    console.log('email', import.meta.env)
  
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID || '', // Replace with your EmailJS Service ID
        import.meta.env.VITE_EMAIL_TEMPLATE_ID || '', // Replace with your EmailJS Template ID
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY || '' // Replace with your EmailJS Public Key
      );
  
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Email sending failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-md mx-auto"
    >
      {isSubmitted ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
          >
            <CheckCircle className="text-primary" size={32} />
          </motion.div>
          <h3 className="heading-md mb-2">Message sent!</h3>
          <p className="text-muted-foreground">
            Thank you for your message. I'll get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              placeholder="Your message..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ContactForm;
