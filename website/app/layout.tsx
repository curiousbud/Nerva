import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'ScriptHub - A Collection of Powerful Scripts',
  description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages. From automation to security tools, unlock the power of code with ScriptHub.',
  keywords: 'scripts, automation, programming, python, javascript, bash, powershell, security tools, code repository, open source',
  authors: [{ name: 'ScriptHub Team' }],
  creator: 'ScriptHub',
  publisher: 'ScriptHub',
  robots: 'index, follow',
  openGraph: {
    title: 'ScriptHub - A Collection of Powerful Scripts',
    description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages.',
    url: 'https://scripthub.dev',
    siteName: 'ScriptHub',
    images: [
      {
        url: '/banner.jpeg',
        width: 1200,
        height: 630,
        alt: 'ScriptHub - Collection of Powerful Scripts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScriptHub - A Collection of Powerful Scripts',
    description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages.',
    images: ['/banner.jpeg'],
    creator: '@scripthub',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f0ff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0b2e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
