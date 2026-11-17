import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from '../services/api'

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

export default function LandingPage() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    getHealth()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-16">
        <div className="animate-rise">
          <p className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e76f3c]">
            <span className="h-px w-8 bg-[#e76f3c]" />Professional help, right at home
          </p>
          <h1 className="max-w-2xl text-[clamp(3.3rem,7vw,6.6rem)] font-black leading-[0.94] tracking-[-0.07em] text-[#173c3a]">
            Your home.<br /><span className="text-[#e76f3c]">Our expertise.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#55706d]">
            Book verified professionals for every household need. Quality service, transparent pricing and peace of mind, all in one place.
          </p>
          
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="rounded-full bg-[#e76f3c] px-7 py-4 font-bold text-white shadow-lg shadow-[#e76f3c]/20 transition hover:-translate-y-0.5 hover:bg-[#cf5c2e]"
            >
              Find a service <span className="ml-2">↗</span>
            </a>
            <Link
              to="/provider/register"
              className="rounded-full bg-[#174c48] px-7 py-4 font-bold text-white shadow-lg shadow-[#174c48]/20 transition hover:-translate-y-0.5 hover:bg-[#0f3936]"
            >
              Become a Provider
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-[#b8ceca] px-7 py-4 font-bold text-[#174c48] transition hover:border-[#174c48]"
            >
              How it works
            </a>
          </div>

          <div className="mt-9 flex items-center gap-3 text-sm text-[#55706d]" aria-live="polite">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === 'connected'
                  ? 'bg-emerald-500'
                  : backendStatus === 'offline'
                  ? 'bg-amber-500'
                  : 'bg-amber-400'
              }`}
            />
            {backendStatus === 'connected' && 'HomeEase API is active & connected'}
            {backendStatus === 'offline' && 'HomeEase is running in standalone mode'}
            {backendStatus === 'checking' && 'Checking HomeEase services...'}
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="relative min-h-[430px] animate-rise-delay">
          <div className="absolute -right-10 top-4 h-64 w-64 rounded-full bg-[#f6c453]/35 blur-3xl" />
          <div className="relative ml-auto max-w-[500px] overflow-hidden rounded-[2.5rem] bg-[#174c48] p-8 text-white shadow-2xl shadow-[#174c48]/20 sm:p-12">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-[#e76f3c]/60" />
            <div className="relative">
              <div className="mb-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e76f3c] text-3xl shadow-lg">
                ⌂
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b8d5c9]">Care made simple</p>
              <h2 className="mt-3 max-w-xs text-4xl font-black leading-tight tracking-[-0.04em]">
                A little help goes a long way.
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-[#c9e0d7]">
                From quick fixes to regular upkeep, trusted local experts are only a booking away.
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#4c7770] pt-6">
                <div>
                  <p className="text-3xl font-black">5+</p>
                  <p className="mt-1 text-sm text-[#b8d5c9]">Service categories</p>
                </div>
                <div>
                  <p className="text-3xl font-black">100%</p>
                  <p className="mt-1 text-sm text-[#b8d5c9]">Verified pros</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section id="services" className="border-y border-[#dce6df] bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-bold uppercase tracking-[0.2em] text-[#e76f3c]">What we offer</p>
              <h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Services for every corner of your home.
              </h2>
            </div>
            <Link
              to="/provider/register"
              className="font-bold text-[#174c48] underline decoration-[#e76f3c] decoration-2 underline-offset-8"
            >
              Offer your services on HomeEase <span className="ml-1">↗</span>
            </Link>
          </div>
          
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <article
                key={service.name}
                className="group rounded-2xl border border-[#dce6df] bg-[#f7f8f2] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#e76f3c] hover:shadow-lg hover:shadow-[#174c48]/10"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6c453] text-2xl font-black text-[#174c48] transition group-hover:rotate-6"
                  aria-hidden="true"
                >
                  {service.icon}
                </div>
                <h3 className="mt-6 font-black text-[#174c48]">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#55706d]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Callout Banner */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#dce6df] bg-gradient-to-r from-[#174c48] to-[#1e5c57] p-8 text-white sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-[#f6c453] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#174c48]">
              For Service Providers
            </span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Are you a skilled technician or specialist?
            </h2>
            <p className="mt-3 text-base text-[#c9e0d7] sm:text-lg">
              Set up your profile, list your skills, define your service areas, and start receiving job requests directly from homeowners today.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/provider/register"
                className="rounded-full bg-[#f6c453] px-6 py-3 text-sm font-bold text-[#174c48] transition hover:bg-[#ffd875]"
              >
                Register as Provider ↗
              </Link>
              <Link
                to="/provider/dashboard"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Go to Provider Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-[#e76f3c]">Simple from start to finish</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Good help should feel easy.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="border-t-2 border-[#174c48] pt-5">
                <p className="text-sm font-black text-[#e76f3c]">{step.number}</p>
                <h3 className="mt-5 font-black text-[#174c48]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#55706d]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#174c48] px-8 py-14 text-center text-white sm:px-12">
          <p className="font-bold uppercase tracking-[0.2em] text-[#f6c453]">A better way to care for home</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Reliable help starts with HomeEase.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#c9e0d7]">
            We are building a simpler way to care for your home and support the professionals who keep it running.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/provider/register"
              className="inline-block rounded-full bg-[#f6c453] px-7 py-4 font-black text-[#174c48] transition hover:bg-[#ffd875]"
            >
              Join our Pro Network ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
