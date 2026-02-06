import React, { useState } from "react";
import {
  MessageSquare,
  TicketIcon,
  Send,
  ChevronDown,
  X,
  User,
  Clock,
} from "lucide-react";

export default function Support() {
  const [activeTab, setActiveTab] = useState("ticket");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [department, setDepartment] = useState("technical");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "support",
      message: "Hello! How can I help you today?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // In a real app, you would send ticket data to your backend
    console.log({ name, email, subject, message, priority, department });
    // Show success message
    setTicketSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setPriority("medium");
      setDepartment("technical");
      setTicketSubmitted(false);
    }, 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages([
      ...chatMessages,
      { sender: "user", message: chatInput, time: "Just now" },
    ]);

    // Clear input
    setChatInput("");

    // Simulate response after a short delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "support",
          message:
            "Thanks for your message. Our support team will get back to you shortly.",
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="relative font-sans">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Support panel */}
      <div
        className={`fixed bottom-24 right-6 bg-white rounded-lg shadow-xl w-96 transition-all duration-300 overflow-hidden z-40 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4">
          <h2 className="text-xl font-semibold">Support Center</h2>
          <p className="text-indigo-100 text-sm">We're here to help you</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("ticket")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${
              activeTab === "ticket"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <TicketIcon size={16} />
            Open Ticket
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${
              activeTab === "chat"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare size={16} />
            Live Chat
          </button>
        </div>

        {/* Content area */}
        <div className="max-h-96 overflow-y-auto p-4">
          {/* Ticket Form */}
          {activeTab === "ticket" && (
            <div className="space-y-4">
              {ticketSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-center">
                  <p className="font-medium">Ticket submitted successfully!</p>
                  <p className="text-sm mt-1">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing</option>
                        <option value="sales">Sales</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <TicketIcon size={16} />
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Chat Interface */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-80">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-indigo-100 text-indigo-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "user" ? (
                          <User size={14} className="text-indigo-600" />
                        ) : (
                          <MessageSquare size={14} className="text-gray-600" />
                        )}
                        <span className="text-xs font-medium">
                          {msg.sender === "user" ? "You" : "Support Agent"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3 bg-gray-50 text-center text-xs text-gray-500">
          Available 24/7 • Average response time: 15 minutes
        </div>
      </div>
    </div>
  );
}
