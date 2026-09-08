import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XMLCraft | Zero-Egress XML Workbench & Data Studio',
  description: 'A 100% air-gapped, privacy-first XML Workbench and Data Studio for enterprise developers. Format, query (XPath), transform (XSLT), and mask sensitive XML payloads directly in your browser with zero network egress.',
  keywords: ['XML format', 'XML to JSON', 'XPath tester', 'XSLT sandbox', 'ISO 20022', 'enterprise XML', 'air-gapped XML tool', 'zero egress', 'PII masking'],
  authors: [{ name: 'XMLCraft Team' }],
  creator: 'XMLCraft',
  publisher: 'XMLCraft',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xmlcraft.app',
    title: 'XMLCraft | Zero-Egress XML Workbench',
    description: '100% air-gapped, client-side XML Workbench for banking and enterprise engineers. Zero data egress.',
    siteName: 'XMLCraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XMLCraft | Zero-Egress XML Workbench',
    description: 'Format, query, and transform enterprise XML payloads securely in your browser.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 h-screen w-screen overflow-hidden flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
