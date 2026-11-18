import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getStoredAdmin, clearStoredAdmin, getAdminDashboard } from '../services/api'

const MENU = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'providers', label: 'Providers' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'complaints', label: 'Complaints' },
  { key: 'categories', label: 'Service categories' },
]

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total users', goTo: 'users' },
  { key: 'totalProviders', label: 'Service providers', goTo: 'providers' },
  { key: 'totalBookings', label: 'Total bookings', goTo: 'bookings' },
  { key: 'totalComplaints', label: 'Complaints', goTo: 'complaints' },
  { key: 'totalCategories', label: 'Service categories', goTo: 'categories' },
]

const EMPTY_TEXT = {
  users: 'No customers have registered yet. Customer accounts will appear here once customer sign-up is live.',
  bookings: 'No bookings yet. Bookings will appear here once customers can book services.',
  complaints: 'No complaints. Complaints raised by customers will appear here.',
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#dce6df] bg-white px-6 py-12 text-center text-sm text-[#55706d]">
      {text}
    </div>
  )
}

function Panel({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-[#dce6df] bg-white">
      <div className="flex items-center justify-between border-b border-[#dce6df] px-5 py-4">
        <h2 className="text-sm font-black text-[#173c3a]">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function ProvidersTable({ providers }) {
  if (!providers.length) {
    return <EmptyState text="No providers yet. Providers who register will appear here." />
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-[#55706d]">
          <tr>
            <th className="py-2 pr-4 font-bold">Name</th>
            <th className="py-2 pr-4 font-bold">Phone</th>
            <th className="py-2 pr-4 font-bold">Skills</th>
            <th className="py-2 pr-4 font-bold">Areas</th>
            <th className="py-2 font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p._id || p.email} className="border-t border-[#eef3ef]">
              <td className="py-3 pr-4">
                <p className="font-bold text-[#173c3a]">{p.name}</p>
                <p className="text-xs text-[#55706d]">{p.email}</p>
              </td>
              <td className="py-3 pr-4 text-[#173c3a]">{p.phone}</td>
              <td className="py-3 pr-4 text-[#173c3a]">{(p.skills || []).join(', ') || '-'}</td>
              <td className="py-3 pr-4 text-[#173c3a]">{(p.serviceAreas || []).join(', ') || '-'}</td>
              <td className="py-3">
                <span className="rounded-full bg-[#eaf3f0] px-2.5 py-1 text-xs font-bold capitalize text-[#174c48]">
                  {p.status || 'available'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CategoriesGrid({ categories }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <div key={c.name} className="flex items-center gap-3 rounded-xl bg-[#f7f8f2] px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6c453] font-black text-[#174c48]">
            {c.icon}
          </span>
          <span className="text-sm font-bold text-[#173c3a]">{c.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getStoredAdmin()
  const [active, setActive] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!admin) return
    getAdminDashboard().then(setData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    clearStoredAdmin()
    navigate('/admin/login')
  }

  const stats = data?.stats || {}
  const providers = data?.providers || []
  const categories = data?.categories || []
  const title = MENU.find((m) => m.key === active).label

  return (
    <div className="min-h-screen bg-[#f7f8f2] text-[#173c3a] lg:flex">
      {/* Sidebar */}
      <aside className={`${menuOpen ? 'block' : 'hidden'} shrink-0 bg-[#174c48] text-white lg:block lg:w-64`}>
        <div className="px-6 py-5">
          <Link to="/" className="text-[1.5rem] font-black tracking-[-0.06em]">
            Home<span className="text-[#f6c453]">Ease</span>
          </Link>
          <p className="text-xs text-[#b8d5c9]">Admin panel</p>
        </div>
        <nav className="px-3 pb-4" aria-label="Admin navigation">
          {MENU.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setActive(m.key)
                setMenuOpen(false)
              }}
              className={`mb-1 block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                active === m.key ? 'bg-white/15 text-white' : 'text-[#b8d5c9] hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#dce6df] bg-white px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full border border-[#174c48] px-3.5 py-1.5 text-xs font-bold lg:hidden"
              aria-expanded={menuOpen}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
            <h1 className="text-lg font-black">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-bold text-[#55706d] sm:inline">{admin.name || admin.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#dce6df] px-3.5 py-1.5 text-xs font-bold text-[#55706d] transition hover:border-red-400 hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="space-y-6 p-5 lg:p-8">
          {!data && <p className="text-sm text-[#55706d]">Loading dashboard...</p>}

          {data && active === 'overview' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {STAT_CARDS.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setActive(card.goTo)}
                    className="rounded-2xl border border-[#dce6df] bg-white p-5 text-left transition hover:border-[#e76f3c] hover:shadow-lg hover:shadow-[#174c48]/10"
                  >
                    <p className="text-xs font-bold text-[#55706d]">{card.label}</p>
                    <p className="mt-2 text-3xl font-black text-[#174c48]">{stats[card.key] ?? 0}</p>
                  </button>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <Panel title="Latest providers" action={
                  <button type="button" onClick={() => setActive('providers')} className="text-xs font-bold text-[#e76f3c]">View all</button>
                }>
                  <ProvidersTable providers={providers.slice(0, 5)} />
                </Panel>
                <Panel title="Latest complaints" action={
                  <button type="button" onClick={() => setActive('complaints')} className="text-xs font-bold text-[#e76f3c]">View all</button>
                }>
                  <EmptyState text={EMPTY_TEXT.complaints} />
                </Panel>
              </div>
            </>
          )}

          {data && active === 'users' && <EmptyState text={EMPTY_TEXT.users} />}

          {data && active === 'providers' && (
            <Panel title={`All providers (${providers.length})`}>
              <ProvidersTable providers={providers} />
            </Panel>
          )}

          {data && active === 'bookings' && <EmptyState text={EMPTY_TEXT.bookings} />}

          {data && active === 'complaints' && <EmptyState text={EMPTY_TEXT.complaints} />}

          {data && active === 'categories' && (
            <Panel title={`Service categories (${categories.length})`}>
              <CategoriesGrid categories={categories} />
            </Panel>
          )}
        </main>
      </div>
    </div>
  )
}