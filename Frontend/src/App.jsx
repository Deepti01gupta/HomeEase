import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import ProviderRegister from './pages/ProviderRegister'
import LoginPage from './pages/LoginPage'
import ProviderDashboard from './pages/ProviderDashboard'
import ProviderProfile from './pages/ProviderProfile'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8f2] text-[#173c3a]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/provider/register" element={<ProviderRegister />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
