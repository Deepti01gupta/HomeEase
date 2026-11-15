import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from './services/api'

const services = [
  { name: 'Electrician', icon: '⚡', description: 'Safe and reliable electrical repairs.' },
  { name: 'Plumber', icon: '🔧', description: 'Fast solutions for every plumbing need.' },
  { name: 'Cleaning', icon: '✨', description: 'A cleaner, healthier home for you.' },
  { name: 'Carpenter', icon: '🪚', description: 'Thoughtful repairs and custom woodwork.' },
  { name: 'Appliance Repair', icon: '🛠️', description: 'Keep your essential appliances running.' },
]

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    getHealth()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-teal-700">
            Home<span className="text-orange-500">Ease</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#home" className="text-teal-700">Home</a>
            <a href="#services" className="hover:text-teal-700">Services</a>
            <a href="#about" className="hover:text-teal-700">About</a>
            <a href="#login" className="hover:text-teal-700">Login</a>
            <a href="#register" className="rounded-full bg-teal-700 px-5 py-2.5 text-white hover:bg-teal-800">Register</a>
          </div>
          <a href="#services" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white md:hidden">Explore</a>
        </nav>
      </header>

      <main>
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 font-semibold uppercase tracking-[0.2em] text-orange-500">Professional help, right at home</p>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Trusted Home Services, Just a Click Away
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Book verified professionals for all your household needs. Quality service, transparent pricing, and peace of mind.
            </p>
            <a href="#services" className="mt-8 inline-block rounded-full bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600">
              Find a service
            </a>
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-500" aria-live="polite">
              <span className={`h-2.5 w-2.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500' : backendStatus === 'offline' ? 'bg-red-500' : 'bg-amber-400'}`} />
              {backendStatus === 'connected' && 'Backend connected'}
              {backendStatus === 'offline' && 'Backend unavailable'}
              {backendStatus === 'checking' && 'Connecting to backend...'}
            </div>
          </div>
          <div className="rounded-[2rem] bg-teal-700 p-8 text-white shadow-2xl shadow-teal-200 sm:p-12">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl">🏠</div>
            <h2 className="text-3xl font-bold">Your home, taken care of.</h2>
            <p className="mt-4 leading-7 text-teal-100">From quick fixes to regular upkeep, HomeEase connects you with trusted local experts.</p>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-teal-500 pt-6">
              <div><p className="text-3xl font-bold">5+</p><p className="text-sm text-teal-100">Service categories</p></div>
              <div><p className="text-3xl font-bold">100%</p><p className="text-sm text-teal-100">Verified pros</p></div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-white px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-500">What we offer</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Services for every corner of your home</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {services.map((service) => (
                <article key={service.name} className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
                  <div className="text-3xl" aria-hidden="true">{service.icon}</div>
                  <h3 className="mt-5 font-bold">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">Reliable help starts with HomeEase</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">We are building a simpler way to care for your home and support the professionals who keep it running.</p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">
        <p>© 2026 HomeEase. Trusted care for every home.</p>
      </footer>
    </div>
  )
}

export default App
