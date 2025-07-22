// src/pages/ContactPage.js
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import GradientButton from "../components/GradientButton";
import Title from "../components/Title";
import { showError, showSuccess } from "../utils/Toast";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      showError("Message is required.");
      return;
    }

    setIsSubmitting(true);

    const token = Cookies.get("token");
    if (!token) {
      showError("You are not logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/messages`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Message sent successfully!");
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);

      const errorMsg =
        err.response?.data?.message || "Failed to send message. Please try again.";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="font-sans text-gray-900 pt-0 pb-20">
      {/* Hero Section */}
      <section
        className="relative py-20 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1470&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-6">
            We'd Love to Hear From You
          </h1>
          <p className="text-gray-200 text-lg md:text-xl">
            Got questions, feedback, or need help? Send us a message!
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto px-6 mt-16">
        <Title
          title="Send Us a Message"
          subtitle="Fill out the form below and we'll get back to you as soon as possible."
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Message Textarea */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Your Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="6"
              required
              placeholder="Tell us what's on your mind..."
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 resize-none transition-shadow"
            ></textarea>
          </div>

          {/* Submit Button */}
          <GradientButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </GradientButton>
        </form>
      </section>

      {/* Decorative Background Elements */}
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 left-10 w-40 h-40 bg-purple-500 opacity-5 rounded-full blur-3xl pointer-events-none"></div>
    </main>
  );
}