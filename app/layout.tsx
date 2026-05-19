import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CreatorTrust AI — Smart Influencer Risk Scoring',
  description:
    'AI-powered influencer risk analysis for fashion and beauty brands. Classify, monitor, and recommend the right influencers to protect your brand reputation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}