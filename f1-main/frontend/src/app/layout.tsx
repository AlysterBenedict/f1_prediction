import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../components/Chatbot.css'; 
import Chatbot from 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'F1-Predict',
  description: 'F1 prediction app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Add the Chatbot component here */}
        <Chatbot />
      </body>
    </html>
  );
}