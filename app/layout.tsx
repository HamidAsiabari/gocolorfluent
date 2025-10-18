import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VideoProvider } from '../components/VideoPlayer/VideoContext'
import { SectionVisitProvider } from '../components/Animation'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'GoColorFluent',
  description: 'A modern web application built with Next.js, Tailwind CSS, and Three.js',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VideoProvider>
          <SectionVisitProvider>
            {children}
          </SectionVisitProvider>
        </VideoProvider>
      </body>
    </html>
  )
}
