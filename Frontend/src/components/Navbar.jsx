import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getStoredProvider, clearStoredProvider } from '../services/api'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedInProvider, setLoggedInProvider] = useState(getStoredProvider())
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  // Update navbar user state whenever the route changes
  useEffect(() => {
    setLoggedInProvider(getStoredProvider())
  }, [location.pathname])

  const handleSignOut = () => {
    clearStoredProvider()
    setLoggedInProvider(null)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce6df] bg-[#f7f8f2]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="text-[1.65rem] font-black tracking-[-0.06em] text-[#174c48]">
          Home<span className="text-[#e76f3c]">Ease</span>
          <span className="ml-1 align-top text-xs tracking-normal text-[#e76f3c]">●</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link to="/" className={location.pathname === '/' ? 'text-[#e76f3c]' : 'transition hover:text-[#e76f3c]'}>
            Home
          </Link>
          {isHome ? (
            <>
              <a href="#services" className="transition hover:text-[#e76f3c]">Services</a>
              <a href="#how-it-works" className="transition hover:text-[#e76f3c]">How it works</a>
              <a href="#about" className="transition hover:text-[#e76f3c]">About</a>
            </>
          ) : (
            <>
              <Link to="/#services" className="transition hover:text-[#e76f3c]">Services</Link>
              <Link to="/#how-it-works" className="transition hover:text-[#e76f3c]">How it works</Link>
            </>
          )}

          <div className="h-4 w-px bg-[#dce6df]" />

          {/* Conditional based on whether provider is logged in */}
          {loggedInProvider ? (
            <div className="flex items-center gap-4">
              <Link
                to="/provider/dashboard"
                className={`flex items-center gap-1.5 rounded-full bg-[#eaf3f0] px-4 py-2 text-xs font-bold text-[#174c48] transition hover:bg-[#d8e9e4] ${
                  location.pathname === '/provider/dashboard' ? 'ring-2 ring-[#174c48]' : ''
                }`}
              >
                📊 Dashboard
              </Link>

              <Link
                to="/provider/profile"
                className="flex items-center gap-1.5 text-xs font-bold text-[#173c3a] transition hover:text-[#e76f3c]"
              >
                👤 {loggedInProvider.name || 'My Profile'}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-[#dce6df] px-3.5 py-1.5 text-xs font-bold text-[#55706d] transition hover:border-red-400 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/provider/dashboard"
                className="text-xs font-bold text-[#55706d] transition hover:text-[#174c48]"
              >
                Provider Hub
              </Link>

              <Link
                to="/login"
                className={`transition hover:text-[#e76f3c] ${
                  location.pathname === '/login' ? 'text-[#e76f3c]' : ''
                }`}
              >
                Log in
              </Link>

              <Link
                to="/provider/register"
                className="rounded-full bg-[#174c48] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3936]"
              >
                Join as Provider
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="rounded-full border border-[#174c48] px-4 py-2 text-sm font-bold md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="border-t border-[#dce6df] bg-[#f7f8f2] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3.5 text-sm font-semibold">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/#services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            <div className="my-1 border-t border-[#dce6df]" />

            {loggedInProvider ? (
              <>
                <div className="text-xs font-bold text-[#55706d]">
                  Signed in as: <strong className="text-[#174c48]">{loggedInProvider.name}</strong>
                </div>
                <Link to="/provider/dashboard" className="text-[#174c48] font-bold" onClick={() => setMenuOpen(false)}>
                  📊 Provider Dashboard
                </Link>
                <Link to="/provider/profile" onClick={() => setMenuOpen(false)}>
                  👤 Edit Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    handleSignOut()
                  }}
                  className="w-full text-left text-xs font-bold text-red-600 py-1"
                >
                  🚪 Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  🔐 Log in
                </Link>
                <Link
                  to="/provider/register"
                  className="mt-2 w-full rounded-full bg-[#174c48] py-2.5 text-center text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Join as Service Provider
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
