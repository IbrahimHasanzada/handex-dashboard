"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from 'react-redux'
import { store } from "@/store/store"
import { Bounce, ToastContainer } from 'react-toastify';
import { AuthGuard } from "@/components/authGuard"
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}



