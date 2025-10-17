import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        href="/"
        className="text-2xl font-semibold text-primary font-poppins"
      >
        AI Form Generator
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-gray-700 hover:text-primary font-semibold"
        >
          Dashboard
        </Link>
        <UserButton />
      </div>
    </nav>
  )
}