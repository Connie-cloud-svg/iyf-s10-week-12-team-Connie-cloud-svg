// src/pages/Home.jsx
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-6 py-2 rounded-3xl mb-8">
          ✨ Welcome to the IYF Alumni Network
        </div>

        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Connect. Grow.<br />Give Back.
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          Join a vibrant community of IYF students, alumni, and staff.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button label="Join the Network" className="px-10 py-4 text-lg" />
          </Link>
          
          <Link to="/login">
            <Button label="Sign In" variant="secondary" className="px-10 py-4 text-lg" />
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <Card title="🌟 Opportunities Board">Discover jobs, internships, and mentorships.</Card>
        <Card title="👥 Alumni Directory">Connect with fellow graduates.</Card>
        <Card title="📖 Share Your Story">Showcase your skills and achievements.</Card>
      </div>
    </div>
  );
};

export default Home;