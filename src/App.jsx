import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBlog from './pages/AddBlog';
import BlogList from './pages/BlogList';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/admin-panel" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add" element={<AddBlog />} />
              <Route path="edit/:id" element={<AddBlog />} />
              <Route
                path="published"
                element={<BlogList statusFilter="published" title="Published Blogs" />}
              />
              <Route
                path="drafts"
                element={<BlogList statusFilter="draft" title="Draft Posts" />}
              />
              <Route
                path="all-blogs"
                element={<BlogList statusFilter="all-blogs" title="All Blogs" />}
              />
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
