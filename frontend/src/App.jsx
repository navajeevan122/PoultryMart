import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import { AuthContext } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Browse from './pages/public/Browse';
import PoultryDetails from './pages/public/PoultryDetails';
import Hens from './pages/public/Hens';
import Cocks from './pages/public/Cocks';
import Breeds from './pages/public/Breeds';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Seller Pages
import SellerLogin from './pages/seller/SellerLogin';
import SellerRegister from './pages/seller/SellerRegister';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddPoultry from './pages/seller/AddPoultry';
import EditPoultry from './pages/seller/EditPoultry';
import MyListings from './pages/seller/MyListings';
import SellerProfile from './pages/seller/SellerProfile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Sellers from './pages/admin/Sellers';
import Listings from './pages/admin/Listings';
import PendingListings from './pages/admin/PendingListings';

// Seller Protection Guard
const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/seller/login" replace />;
  }
  return children;
};

// Admin Protection Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes - No Customer Auth Required */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/poultry/:id" element={<PoultryDetails />} />
          <Route path="/hens" element={<Hens />} />
          <Route path="/cocks" element={<Cocks />} />
          <Route path="/breeds" element={<Breeds />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Seller Auth Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />

          {/* Protected Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/poultry"
            element={
              <SellerRoute>
                <MyListings />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/poultry/add"
            element={
              <SellerRoute>
                <AddPoultry />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/poultry/edit/:id"
            element={
              <SellerRoute>
                <EditPoultry />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <SellerRoute>
                <SellerProfile />
              </SellerRoute>
            }
          />

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <AdminRoute>
                <Sellers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <AdminRoute>
                <Listings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/listings/pending"
            element={
              <AdminRoute>
                <PendingListings />
              </AdminRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastNotification />
    </div>
  );
}

export default App;
