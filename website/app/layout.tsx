import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://curiousbud.github.io/Nerva'),
  title: 'Nerva - A Collection of Powerful Scripts',
  description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages. From automation to security tools, unlock the power of code with Nerva.',
  keywords: 'scripts, automation, programming, python, javascript, bash, powershell, security tools, code repository, open source, nerva',
  authors: [{ name: 'Nerva Team' }],
  creator: 'Nerva',
  publisher: 'Nerva',
  robots: 'index, follow',
  openGraph: {
    title: 'Nerva - A Collection of Powerful Scripts',
    description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages.',
    url: 'https://curiousbud.github.io/Nerva',
    siteName: 'Nerva',
    images: [
      {
        url: '/Nerva/banner.jpeg',
        width: 1200,
        height: 630,
        alt: 'Nerva - Collection of Powerful Scripts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nerva - A Collection of Powerful Scripts',
    description: 'Discover, share, and contribute cutting-edge scripts across multiple programming languages.',
    images: ['/Nerva/banner.jpeg'],
    creator: '@nerva',
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
