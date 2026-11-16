import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from './services/api'

const services = [
  { name: 'Electrician', icon: '⚡', description: 'Wiring, lighting and repairs from verified experts.' },
  { name: 'Plumber', icon: '🔧', description: 'Fast solutions for leaks, pipes and installations.' },
  { name: 'Home cleaning', icon: '✦', description: 'A cleaner, healthier home that feels like yours.' },
  { name: 'Carpenter', icon: '⌂', description: 'Thoughtful repairs and custom woodwork at home.' },
  { name: 'Appliance repair', icon: '◈', description: 'Keep your essential appliances running smoothly.' },
]

const steps = [
  { number: '01', title: 'Tell us what you need', description: 'Choose a service and describe the job in a few simple details.' },
  { number: '02', title: 'Meet a trusted pro', description: 'Compare verified professionals by skills, availability and ratings.' },
  { number: '03', title: 'Relax, it is handled', description: 'Track your booking and pay securely when the work is complete.' },
]

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    getHealth()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f2] text-[#173c3a]">
      <header className="border-b border-[#dce6df] bg-[#f7f8f2]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="text-[1.65rem] font-black tracking-[-0.06em] text-[#174c48]">
            Home<span className="text-[#e76f3c]">Ease</span><span className="ml-1 align-top text-xs tracking-normal text-[#e76f3c]">●</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#home" className="text-[#e76f3c]">Home</a>
            <a href="#services" className="transition hover:text-[#e76f3c]">Services</a>
            <a href="#how-it-works" className="transition hover:text-[#e76f3c]">How it works</a>
            <a href="#about" className="transition hover:text-[#e76f3c]">About us</a>
            <a href="#login" className="transition hover:text-[#e76f3c]">Log in</a>
            <a href="#register" className="rounded-full bg-[#174c48] px-5 py-3 text-white shadow-sm transition hover:bg-[#0f3936]">Get started</a>
          </div>
          <button type="button" className="rounded-full border border-[#174c48] px-4 py-2 text-sm font-bold md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </nav>
        {menuOpen && <div className="border-t border-[#dce6df] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-semibold">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About us</a>
            <a href="#register" className="w-fit rounded-full bg-[#174c48] px-5 py-3 text-white" onClick={() => setMenuOpen(false)}>Get started</a>
          </div>
        </div>}
      </header>

      <main>
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="animate-rise">
            <p className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e76f3c]"><span className="h-px w-8 bg-[#e76f3c]" />Professional help, right at home</p>
            <h1 className="max-w-2xl text-[clamp(3.3rem,7vw,6.6rem)] font-black leading-[0.94] tracking-[-0.07em] text-[#173c3a]">
              Your home.<br /><span className="text-[#e76f3c]">Our expertise.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#55706d]">
              Book verified professionals for every household need. Quality service, transparent pricing and peace of mind, all in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#services" className="rounded-full bg-[#e76f3c] px-7 py-4 font-bold text-white shadow-lg shadow-[#e76f3c]/20 transition hover:-translate-y-0.5 hover:bg-[#cf5c2e]">
                Find a service <span className="ml-2">↗</span>
              </a>
              <a href="#how-it-works" className="rounded-full border border-[#b8ceca] px-7 py-4 font-bold text-[#174c48] transition hover:border-[#174c48]">How it works</a>
            </div>
            <div className="mt-9 flex items-center gap-3 text-sm text-[#55706d]" aria-live="polite">
              <span className={`h-2.5 w-2.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500' : backendStatus === 'offline' ? 'bg-red-500' : 'bg-amber-400'}`} />
              {backendStatus === 'connected' && 'HomeEase is ready to help'}
              {backendStatus === 'offline' && 'Booking services are being prepared'}
              {backendStatus === 'checking' && 'Checking HomeEase services...'}
            </div>
          </div>
          <div className="relative min-h-[430px] animate-rise-delay">
            <div className="absolute -right-10 top-4 h-64 w-64 rounded-full bg-[#f6c453]/35 blur-3xl" />
            <div className="relative ml-auto max-w-[500px] overflow-hidden rounded-[2.5rem] bg-[#174c48] p-8 text-white shadow-2xl shadow-[#174c48]/20 sm:p-12">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-[#e76f3c]/60" />
              <div className="relative">
                <div className="mb-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e76f3c] text-3xl shadow-lg">⌂</div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b8d5c9]">Care made simple</p>
                <h2 className="mt-3 max-w-xs text-4xl font-black leading-tight tracking-[-0.04em]">A little help goes a long way.</h2>
                <p className="mt-5 max-w-sm leading-7 text-[#c9e0d7]">From quick fixes to regular upkeep, trusted local experts are only a booking away.</p>
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#4c7770] pt-6">
                  <div><p className="text-3xl font-black">5+</p><p className="mt-1 text-sm text-[#b8d5c9]">Service categories</p></div>
                  <div><p className="text-3xl font-black">100%</p><p className="mt-1 text-sm text-[#b8d5c9]">Verified pros</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="border-y border-[#dce6df] bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div><p className="font-bold uppercase tracking-[0.2em] text-[#e76f3c]">What we offer</p><h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Services for every corner of your home.</h2></div>
              <a href="#register" className="font-bold text-[#174c48] underline decoration-[#e76f3c] decoration-2 underline-offset-8">View all services <span className="ml-1">↗</span></a>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {services.map((service) => (
                <article key={service.name} className="group rounded-2xl border border-[#dce6df] bg-[#f7f8f2] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#e76f3c] hover:shadow-lg hover:shadow-[#174c48]/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6c453] text-2xl font-black text-[#174c48] transition group-hover:rotate-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="mt-6 font-black text-[#174c48]">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#55706d]">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="font-bold uppercase tracking-[0.2em] text-[#e76f3c]">Simple from start to finish</p><h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Good help should feel easy.</h2></div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step) => <article key={step.number} className="border-t-2 border-[#174c48] pt-5"><p className="text-sm font-black text-[#e76f3c]">{step.number}</p><h3 className="mt-5 font-black text-[#174c48]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#55706d]">{step.description}</p></article>)}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="rounded-[2rem] bg-[#174c48] px-8 py-14 text-center text-white sm:px-12">
            <p className="font-bold uppercase tracking-[0.2em] text-[#f6c453]">A better way to care for home</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Reliable help starts with HomeEase.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#c9e0d7]">We are building a simpler way to care for your home and support the professionals who keep it running.</p>
            <a id="register" href="#services" className="mt-8 inline-block rounded-full bg-[#f6c453] px-7 py-4 font-black text-[#174c48] transition hover:bg-[#ffd875]">Find your professional ↗</a>
          </div>
        </section>
      </main>

      <footer className="bg-[#102f2d] px-5 py-10 text-sm text-[#b8d5c9]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center lg:px-3"><p className="text-xl font-black tracking-[-0.05em] text-white">Home<span className="text-[#e76f3c]">Ease</span></p><p>© 2026 HomeEase. Trusted care for every home.</p><div className="flex gap-5"><a href="#services" className="hover:text-white">Services</a><a href="#about" className="hover:text-white">About</a><a href="#login" className="hover:text-white">Log in</a></div></div>
      </footer>
    </div>
  )
}

export default App
