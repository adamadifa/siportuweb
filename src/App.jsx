import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import Dashboard from '@/pages/Dashboard/Dashboard';
import StudentProfile from '@/pages/StudentProfile/StudentProfile';
import Tagihan from '@/pages/Tagihan/Tagihan';
import Tabungan from '@/pages/Tabungan/Tabungan';
import TabunganDetail from '@/pages/TabunganDetail/TabunganDetail';
import Pengumuman from '@/pages/Pengumuman/Pengumuman';
import PengumumanDetail from '@/pages/PengumumanDetail/PengumumanDetail';
import Berita from '@/pages/Berita/Berita';
import BeritaDetail from '@/pages/BeritaDetail/BeritaDetail';
import Prestasi from '@/pages/Prestasi/Prestasi';
import Akun from '@/pages/Akun/Akun';
import Presensi from '@/pages/Presensi/Presensi';
import MainLayout from '@/components/layout/MainLayout/MainLayout';

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#ecfdf5', // Green 50
              color: '#15803d',      // Green 700
              border: '1px solid #bbf7d0',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fef2f2', // Red 50
              color: '#b91c1c',      // Red 700
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Bottom Navigation */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-profile/:id" element={<StudentProfile />} />
          <Route path="/tagihan/:studentId" element={<Tagihan />} />
          <Route path="/tabungan/:studentId" element={<Tabungan />} />
          <Route path="/tabungan/:studentId/:accountNo" element={<TabunganDetail />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/pengumuman/:id" element={<PengumumanDetail />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita-detail/:slug" element={<BeritaDetail />} />
          <Route path="/prestasi" element={<Prestasi />} />
          <Route path="/akun" element={<Akun />} />
          <Route path="/presensi/:studentId" element={<Presensi />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
