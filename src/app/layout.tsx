import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "./Components/Navbar";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import ContextProvider from "./ContextProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};
const queryClient = new QueryClient();
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en">
      <body className={inter.className}>
      <ContextProvider cookies={cookies}>
          <Navbar/>
          <NextTopLoader 
            color="#2562EA"
            height={5}
            />
            <Toaster
              toastOptions={{
                className:'bg-black',
                style:{
                  color:'#fff',
                  background:"black",
                  boxShadow:"5px 6px 10px #011111",
                  padding:"20px",
                  borderRadius:"15px",
                  marginTop:"10px"
                }
              }}
            />
          {children}
          </ContextProvider>
      </body>
    </html>
  );
}
