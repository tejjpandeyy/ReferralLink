import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, BarChart3, Trash2, Plus } from 'lucide-react';
import { linksAPI, analyticsAPI } from '../services/api';
import MetricCard from '../components/MetricCard';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, analyticsRes] = await Promise.all([
        linksAPI.getAll(),
        analyticsAPI.getOverall()
      ]);
      setLinks(linksRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await linksAPI.delete(id);
        setLinks(links.filter(link => link.id !== id));
      } catch (err) {
        setError('Failed to delete link');
      }
    }
  };

  const handleCopy = (referralCode) => {
    const url = `${process.env.REACT_APP_BASE_URL}/${referralCode}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleDownloadQR = (qrImage, referralCode) => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `qr-${referralCode}.png`;
    link.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your referral link overview.</p>
        </div>
        <Link
          to="/create"
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Link</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Links"
          value={analytics?.totalLinks || 0}
        />
        <MetricCard
          title="Total Clicks"
          value={analytics?.overall?.total_clicks || 0}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics?.overall?.unique_visitors || 0}
        />
        <MetricCard
          title="Top Link Clicks"
          value={analytics?.topLinks?.[0]?.clicks || 0}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Links Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Referral Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destination</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Clicks</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Visitors</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">/{link.referral_code}</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 truncate">{link.destination_url}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{link.total_clicks}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{link.unique_visitors}</td>
                <td className="px-6 py-4 text-sm flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(link.referral_code)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <Copy size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDownloadQR(link.qr_image, link.referral_code)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download QR"
                  >
                    <Download size={18} className="text-gray-600" />
                  </button>
                  <Link
                    to={`/analytics/${link.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View analytics"
                  >
                    <BarChart3 size={18} className="text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
