import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WagmiConnectButton } from "./WagmiConnectButton";
import { siteConfig } from "../config/site";

export const Navbar = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const location = useLocation()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    const navItems = siteConfig.navItems;
    
    return (
        <header 
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 lg:px-12",
                isScrolled ? "py-4" : "py-6"
            )}
        >
            <nav className={cn(
                "mx-auto max-w-5xl rounded-full border border-white/10 transition-all duration-300 px-8 py-2.5 backdrop-blur-xl bg-white/[0.03]",
                isScrolled && "bg-black/60 border-primary/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            )}>
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-all duration-300 border border-primary/20 group-hover:scale-110">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            Ether<span className="text-primary">Will</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <ul className="flex gap-8 text-[15px] font-medium tracking-wide">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "transition-all duration-300 hover:text-primary",
                                            location.pathname === item.href ? "text-primary" : "text-white/60"
                                        )}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="h-5 w-[1px] bg-white/10 mx-2" />

                        <WagmiConnectButton />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuState(!menuState)}
                        className="lg:hidden p-2 text-white/70 hover:text-white transition-colors">
                        {menuState ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full px-4 pt-4 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-[#0D0804] border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-2xl">
                            <ul className="space-y-6 flex flex-col mb-10">
                                {navItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.href}
                                            onClick={() => setMenuState(false)}
                                            className={cn(
                                                "text-xl font-semibold block transition-all",
                                                location.pathname === item.href ? "text-primary pl-2 border-l-2 border-primary" : "text-white/60"
                                            )}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <WagmiConnectButton />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
