import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Claim from "@/pages/Claim";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";
import { ThirdwebProvider } from "thirdweb/react";
import ContactPage from "./pages/contact";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // ensure this matches your ThemeContext export
import About from "./pages/about";
import WillDetails from "./pages/WillDetails";
import ScrollToTop from "./components/ScrollToTop";


const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Claim />} path="/claim" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<WillDetails />} path="/inheritance" />
      <Route element={<About />} path="/about" />
      <Route element={<ContactPage />} path="/contact" />
    </Routes>
  );
}

export function App() {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
            <ScrollToTop />
            <AppRoutes />
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

