import React from "react";
import { Shield, Lock, Cpu, Clock } from "lucide-react";
import DefaultLayout from "@/layouts/default";

const AboutPage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Decentralized Security",
      description: "Your assets are secured by immutable smart contracts on the Ethereum blockchain. No central authority can access your funds."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Inactivity Detection",
      description: "Our protocol monitors your activity (pings). If you're inactive for 180 days, the inheritance process automatically triggers."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Private & Secure",
      description: "Only your designated beneficiary can claim the specific assets you've allocated to them."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Smart Automations",
      description: "Powered by Chainlink, ensuring high reliability and accurate timing for your inheritance plans."
    }
  ];

  return (
    <DefaultLayout>
      <div className="w-full space-y-20 animate-in fade-in duration-700 pb-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-12">
          <h1 className="text-6xl font-extrabold orange-gradient-text tracking-tight">
            Securing Your Digital Legacy
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            EtherWill is a decentralized inheritance protocol designed to ensure your digital assets are safely passed on to your loved ones, exactly when they need them.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Why EtherWill?</h2>
            <p className="text-white/70 leading-relaxed text-lg font-medium">
              In the world of Web3, losing access to your private keys often means your assets are lost forever. Traditional legal systems struggle to keep up with digital wealth.
            </p>
            <p className="text-white/70 leading-relaxed text-lg font-medium">
              EtherWill bridges this gap by providing a trustless, automated way to manage your inheritance. You maintain full control while you're active, and your loved ones are protected if you're not.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-sm font-semibold">
                #Trustless
              </div>
              <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-sm font-semibold">
                #Decentralized
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="glow-card border-white/5 hover:border-primary/20 transition-all group">
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white/90">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="glow-card border-none bg-primary/5 py-12 px-8 text-center relative overflow-hidden ring-1 ring-primary/20 shadow-2xl shadow-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed italic font-medium">
            "To provide every Web3 user with the peace of mind that their hard-earned assets will never be lost to time, and will always find their way to the people they care about most."
          </p>
        </div>

        {/* Stats/Facts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-y border-white/5 py-12">
          {[
            { label: "Stability", value: "99.9%" },
            { label: "Network", value: "Sepolia" },
            { label: "Governance", value: "DAO" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-black text-primary mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AboutPage;
