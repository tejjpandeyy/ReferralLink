import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linksAPI } from '../services/api';
import { Link, Copy } from 'lucide-react';

const CreateLink = () => {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await linksAPI.create({
        destinationUrl,
        referralCode
      });

      setSuccess('Link created successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10);
    setReferralCode(randomCode);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Link</h1>
        <p className="text-gray-600 mt-1">Create a new referral link for tracking</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-3">Destination URL</label>
              <div className="relative">
                <Link className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="https://example.com/register"
                  required
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">Enter the full URL you want to redirect to</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">Referral Code</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-3 text-gray-600 text-lg">/</span>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="ankit"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Generate
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">Choose a unique code for this referral link</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Link'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLink;
