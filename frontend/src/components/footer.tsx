import React from 'react';
import { Mail, Linkedin, Github, Twitter, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const socialLinks = [
        { name: 'Twitter', icon: Twitter, url: 'https://x.com/arpits_jsx' },
        { name: 'GitHub', icon: Github, url: 'https://github.com/arpitSatpute' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/arpitsatpute' },
    ];

    const footerLinks = {
        platform: [
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Claim', href: '/claim' },
            { name: 'How it Works', href: '/about' },
        ],
        support: [
            { name: 'Contact', href: '/contact' },
        ],
        
    };

    return (
        <footer className="relative z-10 border-t border-white/10 bg-[#0A0500]/80 backdrop-blur-md pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">
                                Ether<span className="text-primary">Will</span>
                            </span>
                        </Link>
                        <p className="text-white/50 max-w-sm leading-relaxed text-base">
                            The world's first decentralized inheritance protocol. 
                            Ensuring your digital legacy is preserved and passed on securely through smart contracts.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:bg-primary/20 hover:border-primary/50 text-white/50 hover:text-primary"
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {Object.entries(footerLinks).map(([title, links]) => (
                                <div key={title} className="space-y-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">{title}</h3>
                                    <ul className="space-y-4">
                                        {links.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.href}
                                                    className="text-white/40 hover:text-white transition-colors text-sm font-medium"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30 font-medium">
                    <p>© 2025 EtherWill Protocol. Built with security by design.</p>
                    <div className="flex items-center gap-6">
                        <span>Mainnet (Coming Soon)</span>
                        <div className="flex items-center gap-2 text-primary">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Sepolia Testnet Active
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
