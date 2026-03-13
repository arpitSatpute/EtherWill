import React, { useState } from "react";
import { Mail, MessageSquare, Twitter, Send, MapPin } from "lucide-react";
import { toast } from "sonner";
import DefaultLayout from "@/layouts/default";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <DefaultLayout>
      <div className="w-full space-y-20 animate-in fade-in duration-700 pb-20">
        {/* Header */}
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-5xl font-extrabold orange-gradient-text tracking-tight">
            Get in Touch
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Have questions about securing your digital legacy? Our team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="glow-card border-none bg-primary/5 p-8 relative overflow-hidden ring-1 ring-primary/20 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-2xl font-bold mb-8 text-white">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1 font-bold uppercase tracking-widest">Email us at</div>
                    <div className="text-white font-bold text-lg">arpitrameshsatpute6986@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                    <Twitter className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1 font-bold uppercase tracking-widest">Follow us</div>
                    <div className="text-white font-bold text-lg">@arpits_jsx</div>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1 font-bold uppercase tracking-widest">Our Location</div>
                    <div className="text-white font-bold text-lg">Decentralized, Global</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Contact form */}
          <div className="glow-card border-white/10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 ml-1 font-bold uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 ml-1 font-bold uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/40 ml-1 font-bold uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/40 ml-1 font-bold uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share your thoughts with us..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full orange-button-solid py-5 text-lg flex items-center justify-center gap-3 group"
              >
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactPage;