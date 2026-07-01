import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI, linksAPI } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import MetricCard from '../components/MetricCard';

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, linkRes] = await Promise.all([
        analyticsAPI.getLink(id),
        linksAPI.getById(id)
      ]);
      setAnalytics(analyticsRes.data);
      setLink(linkRes.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics for {link?.referral_code}</h1>
        <p className="text-gray-600 mt-1">Detailed performance metrics for your referral link</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Total Clicks"
          value={analytics?.stats?.total_clicks || 0}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics?.stats?.unique_visitors || 0}
        />
        <MetricCard
          title="Last Visited"
          value={analytics?.stats?.last_visited ? new Date(analytics.stats.last_visited).toLocaleDateString() : 'Never'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Clicks Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Clicks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.dailyClicks || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.devices || []}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                label
              >
                {(analytics?.devices || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Browsers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Browsers</h2>
        <div className="space-y-2">
          {(analytics?.browsers || []).map((browser, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{browser.browser}</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(browser.count / (analytics.stats.total_clicks || 1)) * 100}%`
                    }}
                  />
                </div>
                <span className="text-gray-900 font-medium w-12 text-right">{browser.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Visits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Visits</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">IP Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Browser</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(analytics?.recentVisits || []).map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{visit.ip_address}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{visit.device}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{visit.browser}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(visit.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
