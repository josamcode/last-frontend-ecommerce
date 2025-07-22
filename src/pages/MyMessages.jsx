// src/pages/MyMessages.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import Title from "../components/Title";
import { showError } from "../utils/Toast";

import { FaBell, FaCheck } from "react-icons/fa";
import { HiClock } from "react-icons/hi";

// Icons (inline SVGs to avoid extra deps)

// Type badge colors
const typeColors = {
  system: "bg-blue-100 text-blue-800",
  notification: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  reply: "bg-purple-100 text-purple-800",
  general: "bg-gray-100 text-gray-800",
};

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          showError("Not authenticated.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/message-to-user/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        const errorMsg = err.response?.data?.message || "Failed to load messages.";
        showError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Optional: Mark all as read when page is viewed
  useEffect(() => {
    if (messages.length > 0 && !messages.every(m => m.isRead)) {
      const unreadIds = messages.filter(m => !m.isRead).map(m => m._id);
      axios.put(
        `${process.env.REACT_APP_API_URL}/message-to-user/mark-read`,
        { messageIds: unreadIds },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      ).catch(console.error); // best effort
    }
  }, [messages]);

  if (loading) {
    return (
      <main className="font-sans text-gray-900 py-20 px-6 max-w-3xl mx-auto">
        <Title title="Your Messages" subtitle="Loading your inbox..." />
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans text-gray-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Title
          title="Your Messages"
          subtitle="Important updates, replies, and notifications from JoSam."
        />

        {messages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <FaBell className="h-5 w-5" />
            <h3 className="text-lg font-medium text-gray-700 mt-4">No messages yet</h3>
            <p className="text-gray-500 mt-2">You haven't received any messages from admins or the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 rounded-xl border-l-4 shadow-sm transition-all hover:shadow
                  ${!msg.isRead ? "border-primary bg-white" : "border-gray-300 bg-gray-50"}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[msg.type]}`}>
                    {msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <HiClock className="h-4 w-4 mr-1" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-800 leading-relaxed mb-3">{msg.content}</p>

                <div className="flex items-center">
                  {!msg.isRead ? (
                    <span className="flex items-center text-primary text-sm font-medium">
                      <FaCheck className="h-4 w-4" /> <span className="ml-1">New</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Read</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 left-10 w-40 h-40 bg-purple-500 opacity-5 rounded-full blur-3xl pointer-events-none"></div>
    </main>
  );
}