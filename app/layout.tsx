import type { Metadata } from 'next';
import { IBM_Plex_Sans, Chakra_Petch, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/ui/Nav';
import MotionLayer from '@/components/ui/MotionLayer';
import { siteConfig } from '@/lib/siteConfig';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});
const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
  openGraph: {
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plexSans.variable} ${chakra.variable} ${jetbrains.variable} font-sans min-h-screen text-ink antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-mint focus:px-3 focus:py-2 focus:text-on-mint"
        >
          Skip to content
        </a>
        <MotionLayer />
        <Nav />
        {children}
      </body>
    </html>
  );
}
