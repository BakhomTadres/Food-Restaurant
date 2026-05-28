import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const contactInfo = [
    {
      icon: "fa-location-dot",
      title: "Visit Us",
      lines: ["123 Food Street", "Cairo, Egypt"],
    },
    {
      icon: "fa-phone",
      title: "Call Us",
      lines: ["+20 100 000 0000", "Mon–Fri, 9am – 10pm"],
    },
    {
      icon: "fa-envelope",
      title: "Email Us",
      lines: ["hello@food.com", "We reply within 24 hours"],
    },
    {
      icon: "fa-clock",
      title: "Working Hours",
      lines: ["Mon – Sun: 9am – 11pm", "Kitchen closes at 10:30pm"],
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header location="contact" />

      {/* Hero */}
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-amber-50 mb-6">
            Contact <span className="text-amber-400">Us</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have a question, a reservation request, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map(({ icon, title, lines }) => (
            <div
              key={title}
              className="bg-gray-800 hover:bg-gray-750 border border-white/5 hover:border-amber-400/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4">
                <i className={`fa-solid ${icon} text-amber-400`}></i>
              </div>
              <h3 className="text-amber-50 font-bold mb-2">{title}</h3>
              {lines.map((line) => (
                <p key={line} className="text-gray-400 text-sm">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-gray-800 border border-white/5 rounded-3xl p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-20 h-20 bg-green-400/10 border border-green-400/20 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-circle-check text-green-400 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-black text-amber-50 mb-3">Message Sent!</h3>
                <p className="text-gray-400 mb-8">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-amber-50 mb-2">Send us a message</h2>
                <p className="text-gray-400 mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                        Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`w-full bg-gray-700 border ${errors.name ? "border-red-500" : "border-white/10"} focus:border-amber-400 text-amber-50 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                        Email <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full bg-gray-700 border ${errors.email ? "border-red-500" : "border-white/10"} focus:border-amber-400 text-amber-50 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+20 100 000 0000"
                        className="w-full bg-gray-700 border border-white/10 focus:border-amber-400 text-amber-50 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-1.5">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-white/10 focus:border-amber-400 text-amber-50 rounded-xl px-4 py-3 text-sm outline-none transition cursor-pointer"
                      >
                        <option value="" className="bg-gray-800">Select a topic</option>
                        <option value="reservation" className="bg-gray-800">Table Reservation</option>
                        <option value="order" className="bg-gray-800">Order Issue</option>
                        <option value="feedback" className="bg-gray-800">Feedback</option>
                        <option value="catering" className="bg-gray-800">Catering / Events</option>
                        <option value="other" className="bg-gray-800">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                      Message <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className={`w-full bg-gray-700 border ${errors.message ? "border-red-500" : "border-white/10"} focus:border-amber-400 text-amber-50 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition resize-none`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    <p className="text-gray-500 text-xs mt-1">{form.message.length} / 500</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-gray-900 font-black py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-base"
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right Column: Map + Social */}
          <div className="flex flex-col gap-6">
            {/* Map placeholder */}
            <div className="bg-gray-800 border border-white/5 rounded-3xl overflow-hidden flex-1 min-h-64 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-map-location-dot text-amber-400 text-2xl"></i>
                </div>
                <div className="text-center">
                  <p className="text-amber-50 font-bold">123 Food Street</p>
                  <p className="text-gray-400 text-sm">Cairo, Egypt</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-5 py-2 rounded-xl text-sm transition cursor-pointer"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-800 border border-white/5 rounded-3xl p-8">
              <h3 className="text-amber-50 font-black text-lg mb-2">Follow Us</h3>
              <p className="text-gray-400 text-sm mb-6">Stay updated with our latest dishes and offers.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "fa-brands fa-instagram", label: "Instagram", handle: "@food.restaurant", color: "from-pink-600 to-purple-600" },
                  { icon: "fa-brands fa-facebook", label: "Facebook", handle: "Food Restaurant", color: "from-blue-600 to-blue-700" },
                  { icon: "fa-brands fa-tiktok", label: "TikTok", handle: "@food.restaurant", color: "from-gray-900 to-gray-700" },
                  { icon: "fa-brands fa-whatsapp", label: "WhatsApp", handle: "+20 100 000 0000", color: "from-green-600 to-green-700" },
                ].map(({ icon, label, handle, color }) => (
                  <div
                    key={label}
                    className={`bg-gradient-to-br ${color} rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform duration-200`}
                  >
                    <i className={`${icon} text-white text-xl mb-2 block`}></i>
                    <p className="text-white font-bold text-sm">{label}</p>
                    <p className="text-white/70 text-xs">{handle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
