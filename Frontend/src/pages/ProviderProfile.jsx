import { Link } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'

export default function ProviderProfile() {
  return (
    <div className="min-h-screen bg-[#f7f8f2] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/provider/dashboard"
            className="flex items-center text-sm font-bold text-[#174c48] transition hover:text-[#e76f3c]"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-xs font-semibold text-[#55706d]">Profile Settings</span>
        </div>

        <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-xl shadow-[#174c48]/5 sm:p-10">
          <div className="border-b border-[#eef2ee] pb-6">
            <span className="inline-block rounded-full bg-[#f6c453]/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#174c48]">
              Account Settings
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#173c3a]">
              Service Provider Profile
            </h1>
            <p className="mt-2 text-sm text-[#55706d]">
              Update your contact name, phone, trade skills, years of experience, and service areas.
            </p>
          </div>

          <div className="mt-6">
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
