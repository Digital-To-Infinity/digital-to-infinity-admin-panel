import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBlog from './pages/AddBlog';
import Blog from './pages/Blog';
import User from './pages/User';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/admin-panel" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="blogs" element={<Blog />} />
              <Route path="blogs/add" element={<AddBlog />} />
              <Route path="blogs/edit/:id" element={<AddBlog />} />
              <Route path="users" element={<User />} />
            </Route>

            {/* Catch-all and Redirects */}
            <Route path="/" element={<Navigate to="/admin-panel" replace />} />
            <Route path="*" element={<Navigate to="/admin-panel" replace />} />
          </Routes>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
