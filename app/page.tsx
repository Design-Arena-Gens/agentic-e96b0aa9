'use client';

import { useState } from 'react';

interface Registration {
  name: string;
  phone: string;
  timestamp: string;
}

export default function Home() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setFeedback('Please fill in all fields');
      return;
    }

    const newRegistration: Registration = {
      name: formData.name,
      phone: formData.phone,
      timestamp: new Date().toISOString(),
    };

    setRegistrations([...registrations, newRegistration]);
    setFormData({ name: '', phone: '' });
    setFeedback('Registration successful!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPhone || !message) {
      setFeedback('Please select a phone number and enter a message');
      return;
    }

    setLoading(true);
    setFeedback('');

    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedPhone,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback('Message sent successfully! ✓');
        setMessage('');
      } else {
        setFeedback(`Error: ${data.error || 'Failed to send message'}`);
      }
    } catch (error) {
      setFeedback('Error: Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            WhatsApp Messaging Agent
          </h1>
          <p className="text-gray-600">Register users and send WhatsApp messages</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl mr-2">📝</span>
              Register User
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                Register User
              </button>
            </form>

            {/* Registered Users List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Registered Users ({registrations.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {registrations.length === 0 ? (
                  <p className="text-gray-500 text-sm">No users registered yet</p>
                ) : (
                  registrations.map((reg, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{reg.name}</p>
                          <p className="text-sm text-gray-600">{reg.phone}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(reg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Send Message Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl mr-2">💬</span>
              Send WhatsApp Message
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recipient
                </label>
                <select
                  value={selectedPhone}
                  onChange={(e) => setSelectedPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={registrations.length === 0}
                >
                  <option value="">Choose a phone number...</option>
                  {registrations.map((reg, idx) => (
                    <option key={idx} value={reg.phone}>
                      {reg.name} - {reg.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || registrations.length === 0}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  feedback.includes('Error') || feedback.includes('Please')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {feedback}
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">ℹ️ How to use:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Register users with their phone numbers (include country code)</li>
                <li>Select a registered user from the dropdown</li>
                <li>Type your message and click Send</li>
              </ol>
              <p className="text-xs text-blue-600 mt-3">
                Note: You need to configure Twilio credentials in environment variables for actual WhatsApp message delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
