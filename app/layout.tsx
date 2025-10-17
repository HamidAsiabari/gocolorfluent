import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VideoProvider } from '../components/VideoPlayer/VideoContext'
import { SectionVisitProvider } from '../components/Animation'
import DebugSidebar from '../components/DebugSidebar'
import { DebugProvider } from '../components/DebugSidebar/DebugContext'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Inter Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
  adjustFontFallback: false
})

export const metadata: Metadata = {
  title: 'GoColorFluent',
  description: 'A modern web application built with Next.js, Tailwind CSS, and Three.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebugProvider>
          <VideoProvider>
            <SectionVisitProvider>
              {children}
            </SectionVisitProvider>
          </VideoProvider>
          <DebugSidebar />
        </DebugProvider>
      </body>
    </html>
  )
}
