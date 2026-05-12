import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, Footer, ProtectedRoute } from './components';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import PublicProfilePage from './pages/PublicProfilePage';
import './styles/globals.css';
import './styles/auth.css';
import './styles/opportunities.css';
import './styles/profile.css';

// Placeholder pages for other routes
const HomePage = () => (
  <div className="page-wrapper">
    <div className="container">
      <section className="hero-section">
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
        <h1 className="hero-title animate-fade-in">
          Welcome to <span className="highlight">IYF Alumni Hub</span>
        </h1>
        <p className="hero-subtitle animate-fade-in">
          Connect with fellow alumni, discover opportunities, and grow together.
        </p>
        <div className="hero-cta animate-fade-in">
          <a href="/directory" className="btn btn-primary btn-lg">
            Explore Directory
          </a>
          <a href="/opportunities" className="btn btn-secondary btn-lg">
            View Opportunities
          </a>
        </div>
      </section>
    </div>
  </div>
);

const PlaceholderPage = ({ title, emoji = '🚧' }) => (
  <div className="page-wrapper">
    <div className="container">
      <div className="empty-state">
        <div className="empty-state-icon">{emoji}</div>
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-description">This page is under construction.</p>
      </div>
    </div>
  </div>
);

// Layout wrapper
const Layout = ({ children, hideNav = false }) => (
  <>
    {!hideNav && <Navbar />}
    <main style={{ flex: 1 }}>
      {children}
    </main>
    {!hideNav && <Footer />}
  </>
);

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Auth pages - no navbar/footer */}
            <Route path="/login" element={
              <Layout hideNav><LoginPage /></Layout>
            } />
            <Route path="/register" element={
              <Layout hideNav><RegisterPage /></Layout>
            } />

            {/* Main pages */}
            <Route path="/" element={
              <Layout><HomePage /></Layout>
            } />

            {/* Opportunities routes - /create BEFORE /:id */}
            <Route path="/opportunities" element={
              <Layout>
                <ProtectedRoute><OpportunitiesPage /></ProtectedRoute>
              </Layout>
            } />
            <Route path="/opportunities/create" element={
              <Layout>
                <ProtectedRoute><CreateOpportunityPage /></ProtectedRoute>
              </Layout>
            } />
            <Route path="/opportunities/:id" element={
              <Layout>
                <ProtectedRoute><OpportunityDetailPage /></ProtectedRoute>
              </Layout>
            } />

            {/* Profile routes - /edit BEFORE /:id pattern */}
            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              </Layout>
            } />
            <Route path="/profile/edit" element={
              <Layout>
                <ProtectedRoute><EditProfilePage /></ProtectedRoute>
              </Layout>
            } />

            {/* Directory routes */}
            <Route path="/directory" element={
              <Layout>
                <ProtectedRoute><AlumniDirectoryPage /></ProtectedRoute>
              </Layout>
            } />
            <Route path="/users/:id" element={
              <Layout>
                <ProtectedRoute><PublicProfilePage /></ProtectedRoute>
              </Layout>
            } />

            {/* Other pages */}
            <Route path="/events" element={
              <Layout><PlaceholderPage title="Events" emoji="📅" /></Layout>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;