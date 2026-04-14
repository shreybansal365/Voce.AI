import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import Provider from "./providor";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "Voce.AI | Elevate Your Spoken Intelligence",
  description: "Advanced AI conversational platform for high-stakes voice coaching and professional fluency.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning
        className="font-inter antialiased bg-grid-white"
      ><StackProvider app={stackClientApp}><StackTheme>
        <Provider>
            {children}
        </Provider>
        
      </StackTheme></StackProvider></body>
    </html>
  );
}
