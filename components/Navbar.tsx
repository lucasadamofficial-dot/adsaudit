'use client'
  import Link from 'next/link'
import { BarChart2 } from 'lucide-react'

    export default function Navbar() {
      return (
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
              <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
                  <BarChart2 size={20} className="text-blue-600" />
                  AdsAudit
                </Link>
                <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
                  <Link href="/#features" className="hover:text-gray-900 transition-colors">Features</Link>
                  <Link href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
                  <Link href="/#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
          </Link>
                  <Link href="/dashboard" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start free
          </Link>
                </div>
              </div>
            </nav>
          )
        }
