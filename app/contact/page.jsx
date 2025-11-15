"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We will contact you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20">
      {/* Heading Animation */}
      <motion.h1
        className="text-5xl font-bold text-orange-600 text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.h1>

      {/* Intro Text Animation */}
      <motion.div
        className="max-w-3xl mx-auto mb-12 text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
          Have a question, suggestion, or just want to say hello? We’d love to
          hear from you!
        </p>
        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
          The <span className="text-orange-500 font-medium">SRBlogs</span> team
          is always open to feedback and new ideas from our amazing community.
        </p>
        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
          Reach out anytime — your{" "}
          <span className="text-orange-500 font-medium">voice</span> matters to
          us.
        </p>
      </motion.div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Contact Info Animated */}
        <motion.div
          className="flex flex-col space-y-6"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: <FaMapMarkerAlt className="text-3xl text-orange-500" />,
              text: "123 SRBlogs Street, City, Country",
            },
            {
              icon: <FaPhone className="text-3xl text-orange-500" />,
              text: "+92 300 1234567",
            },
            {
              icon: <FaEnvelope className="text-3xl text-orange-500" />,
              text: "support@srblogs.com",
            },
          ].map((info, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {info.icon}
              <span className="text-gray-700 text-lg">{info.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form Animated */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white shadow-lg rounded-2xl p-6"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          viewport={{ once: true }}
        >
          <motion.input
            type="text"
            placeholder="Your Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            whileFocus={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <motion.input
            type="email"
            placeholder="Your Email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            whileFocus={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <motion.textarea
            placeholder="Your Message"
            value={form.message}
            required
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <motion.button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
