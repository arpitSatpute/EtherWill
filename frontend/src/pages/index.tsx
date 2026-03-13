import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Shield, Sparkles, ChevronRight, Zap, Lock, Globe, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="space-y-32">
        {/* Hero Section */}
        <section className="relative text-center space-y-12 py-12">
          {/* Hero Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative space-y-10">
            {/* Protocol Badge */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
               <div className="flex items-center gap-2">
                 <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Ether Will Protocol</span>
               </div>
            </motion.div>

            {/* Headline */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
              >
                Secure Your <br />
                <span className="orange-gradient-text px-1">Digital Legacy</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed"
              >
                Ensure your digital assets are passed on securely and trustlessly. 
                The world's first decentralized inheritance protocol built for the future.
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center pt-6"
            >
              <button 
                onClick={() => navigate("/dashboard")}
                className="orange-button-solid group flex items-center gap-3 px-12 rounded-full"
              >
                GET STARTED
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid: Protocol Specifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/20 italic">Protocol Specs</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon="Ξ" 
              label="Ethereum Native" 
              desc="Optimized exclusively for ETH assets and Native Layer 2 expansions."
              color="bg-blue-500/10 text-blue-500 border-blue-500/20" 
              delay={0.1}
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />} 
              label="180-Day Inactivity" 
              desc="Automatic witness check triggered after 180 days of on-chain silence."
              color="bg-orange-500/10 text-orange-500 border-orange-500/20" 
              delay={0.2}
            />
            <FeatureCard 
              icon="$100" 
              label="Min. Requirement" 
              desc="Secure your legacy with a minimum of $100 equivalent in ETH."
              color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              delay={0.3}
            />
            <FeatureCard 
              icon={<RotateCcw className="w-6 h-6" />} 
              label="Revocable Wills" 
              desc="Total control. Revoke or update your will and heirs at any moment."
              color="bg-purple-500/10 text-purple-500 border-purple-500/20" 
              delay={0.4}
            />
          </section>
        </div>

        {/* Protocol Philosophy Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 pb-24 border-t border-white/5">
            <WhyItem 
                icon={<Lock />}
                title="Trustless Execution"
                desc="Smart contracts handle everything on-chain. No middleman, no central authority, total privacy."
            />
             <WhyItem 
                icon={<Zap />}
                title="Proof of Activity"
                desc="Automated witness system monitors your on-chain vitality to trigger inheritance protocols."
            />
             <WhyItem 
                icon={<Globe />}
                title="Universal Access"
                desc="A borderless solution accessible to anyone, anywhere in the world on the open web."
            />
        </div>
      </div>
    </DefaultLayout>
  );
}

function FeatureCard({ icon, label, desc, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glow-card border-white/5 space-y-6 group cursor-default hover:border-primary/20 transition-all"
    >
      <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl font-black transition-transform group-hover:scale-110 group-hover:-rotate-12", color)}>
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-white font-black text-lg">{label}</h3>
        <p className="text-white/40 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function WhyItem({ icon, title, desc }: any) {
    return (
        <div className="space-y-6 group">
            <div className="p-3 w-fit rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-primary/50 transition-colors">
                {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 text-primary" })}
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">{title}</h4>
              <p className="text-white/40 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
