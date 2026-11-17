import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#102f2d] px-5 py-12 text-sm text-[#b8d5c9]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-[-0.05em] text-white">
              Home<span className="text-[#e76f3c]">Ease</span>
            </Link>
            <p className="mt-3 text-xs leading-6 text-[#9ebdb5]">
              Connecting homeowners with certified, verified local service professionals with transparent pricing and real reviews.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">For Customers</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link to="/#services" className="hover:text-white transition">Explore Services</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-white transition">How Booking Works</Link></li>
              <li><Link to="/#about" className="hover:text-white transition">Safety & Guarantee</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">For Service Providers</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link to="/provider/register" className="text-[#f6c453] hover:text-white transition font-medium">Register as Provider</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Provider Login</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-white transition">Provider Dashboard</Link></li>
              <li><Link to="/provider/profile" className="hover:text-white transition">Profile Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Platform</h4>
            <p className="mt-4 text-xs text-[#9ebdb5]">Built with React, Express, Node.js & MongoDB Atlas.</p>
            <div className="mt-3 inline-block rounded-full bg-[#174c48] px-3 py-1 text-[11px] font-semibold text-[#f6c453]">
              ● Day 2: Provider Suite Active
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1d423f] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 HomeEase Inc. Trusted care for every home.</p>
          <div className="flex gap-5">
            <Link to="/#services" className="hover:text-white transition">Services</Link>
            <Link to="/#about" className="hover:text-white transition">About</Link>
            <Link to="/login" className="hover:text-white transition">Sign in</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
