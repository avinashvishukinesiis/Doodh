import type { Metadata } from 'next'
import './globals.css'
import { Yatra_One, IBM_Plex_Mono } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

const yatra = Yatra_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yatra-one',
  display: 'swap',
});

const ibm = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Doodh & co',
  description: 'Dairy',
  generator: 'Kinesiis',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${yatra.variable} ${ibm.variable}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <body>{children}</body>
    </html>
  )
}
