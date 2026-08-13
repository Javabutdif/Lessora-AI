import type { Metadata } from 'next';
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import { ReactQueryProvider } from './providers';
import ErrorBoundary from './components/error-boundary';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-base',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = process.env.PUBLIC_APP_URL || 'https://lessora.ajgenabio.me';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lessora AI | Lesson Plans Made Simply',
    template: '%s | Lessora AI',
  },
  description:
    'Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments — no account required.',
  keywords: [
    'lesson plan generator',
    'AI lesson plans',
    'lesson plan template',
    'teacher tools',
    'DepEd lesson plan',
    'curriculum planning',
    'education AI',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Lessora AI',
    title: 'Lessora AI | Lesson Plans Made Simply',
    description:
      'Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments — no account required.',
    locale: 'en_US',
    images: [
      {
        url: '/lessora-logo.png',
        width: 512,
        height: 512,
        alt: 'Lessora AI',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Lessora AI | Lesson Plans Made Simply',
    description:
      'Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments — no account required.',
    images: ['/lessora-logo.png'],
  },
  icons: {
    icon: '/lessora-logo.png',
    apple: '/lessora-logo.png',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Lessora AI',
      url: SITE_URL,
      description:
        'AI-powered lesson plan generator for teachers. Create curriculum-ready lesson plans in minutes.',
      inLanguage: 'en',
    },
    {
      '@type': 'Organization',
      name: 'Lessora AI',
      url: SITE_URL,
      logo: `${SITE_URL}/lessora-logo.png`,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
