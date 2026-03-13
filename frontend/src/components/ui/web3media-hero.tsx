import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CryptoIcon {
  icon: React.ReactNode;
  label: string;
  position: { x: string; y: string };
}

interface Web3MediaHeroProps {
  logo?: string;
  navigation?: Array<{
    label: string;
    onClick?: () => void;
  }>;
  contactButton?: {
    label: string;
    onClick: () => void;
  };
  title: string;
  highlightedText?: string;
  subtitle: string;
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  cryptoIcons?: CryptoIcon[];
  trustedByText?: string;
  brands?: Array<{
    name: string;
    logo: React.ReactNode;
  }>;
  className?: string;
  children?: React.ReactNode;
  showHeader?: boolean;
}

const coinLogoSize = 36;

const BtcLogo = () => (
  <svg width={coinLogoSize} height={coinLogoSize} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="#F7931A" />
    <text
      x="18"
      y="22"
      textAnchor="middle"
      fontSize="15"
      fontWeight="700"
      fill="#fff"
      fontFamily="Inter, sans-serif"
    >
      ₿
    </text>
  </svg>
);

const EthLogo = () => (
  <svg width={coinLogoSize} height={coinLogoSize} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="#627EEA" />
    <path d="M18 6L11 18L18 14L25 18L18 6Z" fill="#FFFFFF" fillOpacity="0.95" />
    <path d="M18 15.3L11 19.2L18 30L25 19.2L18 15.3Z" fill="#FFFFFF" fillOpacity="0.72" />
  </svg>
);

const UsdtLogo = () => (
  <svg width={coinLogoSize} height={coinLogoSize} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="#26A17B" />
    <path d="M10 11.5H26V14.2H19.9V15.8C23.9 16 26 16.9 26 18.1C26 19.3 23.9 20.2 19.9 20.4V27H16.1V20.4C12.1 20.2 10 19.3 10 18.1C10 16.9 12.1 16 16.1 15.8V14.2H10V11.5ZM16.1 18.6V17.5C13.8 17.6 12.7 18 12.7 18.1C12.7 18.2 13.8 18.6 16.1 18.6ZM19.9 17.5V18.6C22.2 18.6 23.3 18.2 23.3 18.1C23.3 18 22.2 17.6 19.9 17.5Z" fill="#fff" />
  </svg>
);

const SolLogo = () => (
  <svg width={coinLogoSize} height={coinLogoSize} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="#111827" />
    <defs>
      <linearGradient id="solGradient" x1="9" y1="9" x2="27" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#14F195" />
        <stop offset="0.55" stopColor="#9A75FF" />
        <stop offset="1" stopColor="#00D1FF" />
      </linearGradient>
    </defs>
    <path d="M10 11.5H25L22.2 14.3H7.2L10 11.5Z" fill="url(#solGradient)" />
    <path d="M10 17.6H25L22.2 20.4H7.2L10 17.6Z" fill="url(#solGradient)" />
    <path d="M10 23.7H25L22.2 26.5H7.2L10 23.7Z" fill="url(#solGradient)" />
  </svg>
);

export function Web3MediaHero({
  logo = "Web3 Media",
  navigation = [
    { label: "Home" },
    { label: "Gallery" },
    { label: "Cases" },
    { label: "About us" },
  ],
  contactButton,
  title,
  highlightedText = "Web3 Visibility",
  subtitle,
  ctaButton,
  cryptoIcons = [],
  trustedByText = "Trusted by",
  brands = [],
  className,
  children,
  showHeader = false,
}: Web3MediaHeroProps) {
  const resolvedCryptoIcons: CryptoIcon[] =
    cryptoIcons.length > 0
      ? cryptoIcons
      : [
          {
            label: "BTC",
            position: { x: "12%", y: "30%" },
            icon: <BtcLogo />,
          },
          {
            label: "ETH",
            position: { x: "80%", y: "26%" },
            icon: <EthLogo />,
          },
          {
            label: "USDT",
            position: { x: "18%", y: "70%" },
            icon: <UsdtLogo />,
          },
          {
            label: "SOL",
            position: { x: "77%", y: "68%" },
            icon: <SolLogo />,
          },
        ];

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 153, 0, 0.15) 0%, rgba(255, 153, 0, 0) 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* Header Container */}
      {showHeader && (
        <motion.header
          className="relative z-50 w-full px-6 py-6 flex flex-row items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
        {/* Logo */}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#FFFFFF",
          }}
        >
          <span style={{ fontWeight: 400 }}>{logo.split(" ")[0]}</span>
          <span style={{ fontWeight: 700 }}>{logo.split(" ")[1] || ""}</span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-row items-center gap-8" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: "#FFFFFF",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Contact Button */}
        {contactButton && (
          <button
            onClick={contactButton.onClick}
            className="px-6 py-2.5 rounded-full transition-all hover:scale-105"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 400,
              color: "#FFFFFF",
            }}
          >
            {contactButton.label}
          </button>
        )}
      </motion.header>
      )}

      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
          {/* Floating Crypto Icons */}
          {resolvedCryptoIcons.map((crypto, index) => (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center gap-2"
              style={{
                left: crypto.position.x,
                top: crypto.position.y,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -20, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + index * 0.1 },
                scale: { duration: 0.6, delay: 0.3 + index * 0.1 },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(255, 153, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 153, 0, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 40px rgba(255, 153, 0, 0.4)",
                }}
              >
                {crypto.icon}
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                }}
              >
                {crypto.label}
              </span>
            </motion.div>
          ))}
 
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center w-full"
            style={{ gap: "32px", padding: "0 5%" }}
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {logo}
            </motion.div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: "1.2",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #FF9900 0%, #FFB84D 50%, #FF9900 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                {highlightedText}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 2vw, 16px)",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "500px",
              }}
            >
              {subtitle}
            </p>

            {/* CTA Button */}
            {ctaButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                onClick={ctaButton.onClick}
                className="px-8 py-3 rounded-md transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(255, 153, 0, 0.2)",
                }}
              >
                {ctaButton.label}
              </motion.button>
            )}
          </motion.div>
        </div>
      )}

      {/* Brand Slider */}
      {brands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 w-full overflow-hidden"
          style={{
            paddingTop: "60px",
            paddingBottom: "60px",
          }}
        >
          {/* "Trusted by" Text */}
          <div className="text-center mb-8">
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {trustedByText}
            </span>
          </div>

          {/* Gradient Overlays */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "200px",
              background: "linear-gradient(90deg, #0A0500 0%, rgba(10, 5, 0, 0) 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "200px",
              background: "linear-gradient(270deg, #0A0500 0%, rgba(10, 5, 0, 0) 100%)",
            }}
          />

          {/* Scrolling Brands */}
          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -(brands.length * 200)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: brands.length * 5,
                ease: "linear",
              },
            }}
            style={{
              gap: "80px",
              paddingLeft: "80px",
            }}
          >
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
                style={{
                  width: "120px",
                  height: "40px",
                }}
              >
                {brand.logo}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
