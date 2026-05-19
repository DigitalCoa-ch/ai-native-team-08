import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CreatorTrust AI — Brand Command Center',
  description:
    'AI-native influencer governance platform. Monitor risk, protect brand reputation, and operate at enterprise scale.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: '#030712', color: '#f1f5f9' }}>
        {children}
      </body>
    </html>
  );
}