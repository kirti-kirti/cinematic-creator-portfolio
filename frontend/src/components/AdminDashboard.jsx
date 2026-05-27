import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, LayoutDashboard, FolderOpen, Mail, SlidersHorizontal, 
  Trash2, Eye, EyeOff, Check, Plus, AlertCircle, TrendingUp, DollarSign, Upload, Info 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const CHART_COLORS = ['#ff5722', '#8a2be2', '#00bcd4', '#e91e63', '#ffeb3b', '#4caf50'];

// Converts any YouTube URL to youtube-nocookie embed format
// Handles: watch?v=, youtu.be/, shorts/, embed/
const toYouTubeEmbed = (url) => {
  if (!url) return url;
  // Already a local upload — return as-is
  if (url.startsWith('/uploads') || /\.(mp4|mov|webm|ogg)($|\?)/i.test(url)) return url;

  let videoId = null;

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&/#]+)/);
  if (shortMatch) videoId = shortMatch[1];

  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^&/#]+)/);
  if (watchMatch) videoId = watchMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = url.match(/\/shorts\/([^?&/#]+)/);
  if (shortsMatch) videoId = shortsMatch[1];

  // Already embed — extract and rebuild with nocookie
  const embedMatch = url.match(/\/embed\/([^?&/#]+)/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }
  return url; // Return as-is if not a YouTube URL
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [token, setToken] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'portfolio' | 'inquiries'
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  
  // Upload states
  const [uploadingField, setUploadingField] = useState(null); // 'url' | 'thumbnail' | 'before' | 'after'
  const [uploadProvider, setUploadProvider] = useState('local');

  // Portfolio CRUD state
  const [isEditingItem, setIsEditingItem] = useState(null); // null or item details
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'Video Editing',
    mediaType: 'video',
    url: '',
    thumbnail: '',
    description: '',
    tags: '',
    before: '',
    after: ''
  });

  // Settings state
  const [profileImageUrl, setProfileImageUrl] = useState(
    localStorage.getItem('profileImageUrl') || '/about-profile.jpg'
  );
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const categories = ['Video Editing', 'Photography', 'Reels', 'Cinematic', 'Events'];

  // Check auth on load
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchDashboardData(savedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchDashboardData(data.token);
      } else {
        setAuthError(data.error || 'Invalid passcode.');
      }
    } catch (err) {
      setAuthError('Connection failure to authentication server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async (authToken) => {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    try {
      // Fetch stats
      const statsRes = await fetch('/api/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch inquiries
      const inqRes = await fetch('/api/inquiries', { headers });
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }

      // Fetch portfolio
      const portRes = await fetch('/api/portfolio');
      if (portRes.ok) {
        const portData = await portRes.json();
        setPortfolio(portData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  // Upload handler
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      
      if (data.success) {
        setPortfolioForm(prev => ({ ...prev, [fieldName]: data.url }));
        setUploadProvider(data.provider);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Inquiry CRUD methods
  const toggleInquiryStatus = async (id, currentStatus) => {
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error('Failed to update inquiry:', err);
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client inquiry?')) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // Portfolio CRUD methods
  const handlePortfolioFormChange = (e) => {
    const { name, value } = e.target;
    setPortfolioForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditPortfolioClick = (item) => {
    setIsEditingItem(item.id);
    setPortfolioForm({
      title: item.title,
      category: item.category,
      mediaType: item.mediaType,
      url: item.url,
      thumbnail: item.thumbnail || '',
      description: item.description,
      tags: item.tags ? item.tags.join(', ') : '',
      before: item.beforeAfter ? item.beforeAfter.before : '',
      after: item.beforeAfter ? item.beforeAfter.after : ''
    });
  };

  const resetPortfolioForm = () => {
    setIsEditingItem(null);
    setPortfolioForm({
      title: '',
      category: 'Video Editing',
      mediaType: 'video',
      url: '',
      thumbnail: '',
      description: '',
      tags: '',
      before: '',
      after: ''
    });
  };

  const savePortfolioItem = async (e) => {
    e.preventDefault();
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Format tags from comma-separated string to array
    const tagsArr = portfolioForm.tags
      ? portfolioForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const payload = {
      title: portfolioForm.title,
      category: portfolioForm.category,
      mediaType: portfolioForm.mediaType,
      url: toYouTubeEmbed(portfolioForm.url), // auto-convert any YouTube URL
      thumbnail: portfolioForm.thumbnail,
      description: portfolioForm.description,
      tags: tagsArr
    };

    // If before/after inputs are filled, add beforeAfter object
    if (portfolioForm.before || portfolioForm.after) {
      payload.beforeAfter = {
        before: portfolioForm.before,
        after: portfolioForm.after
      };
    }

    if (isEditingItem) {
      payload.id = isEditingItem;
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        resetPortfolioForm();
        fetchDashboardData(token);
        alert(isEditingItem ? 'Item updated successfully!' : 'New portfolio item added!');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save portfolio item.');
      }
    } catch (err) {
      console.error('Portfolio save error:', err);
    }
  };

  const deletePortfolioItem = async (id) => {
    if (!window.confirm('Delete this portfolio item forever?')) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setPortfolio(prev => prev.filter(item => item.id !== id));
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error('Failed to delete portfolio item:', err);
    }
  };

  // --- PASSCODE SHIELD OVERLAY ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-orange/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 relative z-10 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-accent-orange/10 border border-accent-orange/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-accent-orange" />
          </div>

          <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
            ADMINISTRATOR ACCESS
          </h1>
          <p className="text-white/50 text-xs mt-2 font-mono tracking-widest uppercase">
            Secured Decrypt Shield
          </p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="passcode" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Passcode Key</label>
              <input
                type="password"
                id="passcode"
                required
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:border-accent-orange text-center tracking-widest text-lg transition-colors duration-300"
              />
            </div>

            <button
              type="submit"
              className="py-4 rounded-xl font-mono text-[10px] tracking-widest font-bold bg-accent-orange hover:bg-accent-orange/90 text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              UNLOCK CONSOLE
            </button>

            {authError && (
              <div className="flex items-center gap-2 justify-center p-3 rounded-lg bg-rose-600/10 border border-rose-500/30 text-rose-400 text-xs font-mono mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </form>

          <div className="text-[9px] font-mono text-white/20 mt-8 uppercase tracking-widest">
            Authorized Personnel Only
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DUAL PANEL ADMIN WORKSPACE ---
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 relative px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase">SYS_CONSOLE ONLINE</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-wider text-white mt-1">
              CREATOR PANEL
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-xs font-mono tracking-widest text-white/70 transition-all duration-300"
          >
            LOGOUT CONSOLE
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex gap-2 border-b border-white/5 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 ${
              activeTab === 'overview'
                ? 'bg-accent-orange/10 text-accent-orange border-b-2 border-accent-orange'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 ${
              activeTab === 'portfolio'
                ? 'bg-accent-orange/10 text-accent-orange border-b-2 border-accent-orange'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Portfolio Manager ({portfolio.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 ${
              activeTab === 'inquiries'
                ? 'bg-accent-orange/10 text-accent-orange border-b-2 border-accent-orange'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inquiries ({inquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 ${
              activeTab === 'settings'
                ? 'bg-accent-orange/10 text-accent-orange border-b-2 border-accent-orange'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Site Settings
          </button>
        </div>

        {/* TAB CONTENTS */}
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && stats && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Unread Inquiries */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">UNREAD INQUIRIES</span>
                  <div className="w-8 h-8 rounded-lg bg-accent-orange/10 flex items-center justify-center border border-accent-orange/30">
                    <Mail className="w-4 h-4 text-accent-orange" />
                  </div>
                </div>
                <div className="font-display font-bold text-3xl text-white mt-4">{stats.unreadInquiries}</div>
                <p className="text-[10px] text-white/40 mt-1 font-mono uppercase">OUT OF {stats.totalInquiries} TOTAL INQUIRIES</p>
              </div>

              {/* Estimated Value */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">PIPELINE VALUE</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="font-display font-bold text-3xl text-white mt-4">₹{stats.estimatedPipelineValue.toLocaleString('en-IN')}</div>
                <p className="text-[10px] text-white/40 mt-1 font-mono uppercase">ESTIMATED CLIENT BUDGETS</p>
              </div>

              {/* Total Portfolio Items */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">PORTFOLIO ITEMS</span>
                  <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center border border-accent-violet/30">
                    <FolderOpen className="w-4 h-4 text-accent-violet" />
                  </div>
                </div>
                <div className="font-display font-bold text-3xl text-white mt-4">{stats.totalPortfolioItems}</div>
                <p className="text-[10px] text-white/40 mt-1 font-mono uppercase">DYNAMIC WORK ITEMS</p>
              </div>

              {/* Conversion Stats */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">CONVERSION RATE</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="font-display font-bold text-3xl text-white mt-4">
                  {stats.totalInquiries > 0 
                    ? Math.round(((stats.totalInquiries - stats.unreadInquiries) / stats.totalInquiries) * 100) 
                    : 0}%
                </div>
                <p className="text-[10px] text-white/40 mt-1 font-mono uppercase">READ / TOTAL MESSAGE RATE</p>
              </div>

            </div>

            {/* Recharts Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Trends Bar Chart */}
              <div className="lg:col-span-8 glass p-6 rounded-2xl border border-white/5">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-6">Inquiry Traffic (Weekly)</h3>
                
                <div className="h-80 w-full font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.inquiryTrends}>
                      <XAxis dataKey="day" stroke="#ffffff30" />
                      <YAxis stroke="#ffffff30" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f0f12', borderColor: '#1a1a24', color: '#fff' }}
                        cursor={{ fill: '#ffffff05' }}
                      />
                      <Bar dataKey="inquiries" fill="#ff5722" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Project Distribution Pie Chart */}
              <div className="lg:col-span-4 glass p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-6">Project Request Split</h3>

                <div className="h-64 w-full flex items-center justify-center font-mono text-[10px]">
                  {stats.projectTypeDistribution && stats.projectTypeDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.projectTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.projectTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f0f12', borderColor: '#1a1a24', color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36} iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-white/40 uppercase">No Distribution Available</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PORTFOLIO MANAGER PANEL */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Create/Edit Form Column */}
            <div className="lg:col-span-5 glass p-6 rounded-2xl border border-white/5 self-start">
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6 flex items-center justify-between">
                <span>{isEditingItem ? 'Edit Item Details' : 'Add Portfolio Item'}</span>
                {isEditingItem && (
                  <button 
                    onClick={resetPortfolioForm}
                    className="text-[9px] font-mono tracking-widest text-accent-orange border border-accent-orange/20 bg-accent-orange/5 px-2.5 py-1 rounded"
                  >
                    RESET CREATE
                  </button>
                )}
              </h3>

              {/* Status Header displaying storage client type */}
              <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-[10px] font-mono text-white/60">
                <Info className="w-3.5 h-3.5 text-accent-orange" />
                <span>Uploads Active via: <strong className="text-white capitalize">{uploadProvider} Server</strong></span>
              </div>

              <form onSubmit={savePortfolioItem} className="flex flex-col gap-4 text-left">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 uppercase">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Urban Drift - Racing Edit"
                    value={portfolioForm.title}
                    onChange={handlePortfolioFormChange}
                    className="px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange"
                  />
                </div>

                {/* Category & Media Type Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/50 uppercase">Category</label>
                    <select
                      name="category"
                      value={portfolioForm.category}
                      onChange={handlePortfolioFormChange}
                      className="px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#09090c] text-white">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/50 uppercase">Media Type</label>
                    <select
                      name="mediaType"
                      value={portfolioForm.mediaType}
                      onChange={handlePortfolioFormChange}
                      className="px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                    >
                      <option value="video" className="bg-[#09090c] text-white">Video</option>
                      <option value="image" className="bg-[#09090c] text-white">Image / Photo</option>
                    </select>
                  </div>
                </div>

                {/* URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 uppercase">Source Asset URL (YouTube Embed or Image Path)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="url"
                      required
                      placeholder={portfolioForm.mediaType === 'video' ? "https://www.youtube.com/embed/... or Video File Path" : "Unsplash URL or Image File Path"}
                      value={portfolioForm.url}
                      onChange={handlePortfolioFormChange}
                      className="flex-grow px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange font-mono"
                    />
                    <label className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono tracking-wide cursor-pointer flex items-center justify-center text-white shrink-0">
                      {uploadingField === 'url' ? 'UPLOADING...' : 'UPLOAD'}
                      <input 
                        type="file" 
                        accept={portfolioForm.mediaType === 'video' ? 'video/*' : 'image/*'} 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'url')}
                        disabled={uploadingField !== null}
                      />
                    </label>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 uppercase">Thumbnail URL (Optional for Photos)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="thumbnail"
                      placeholder="https://images.unsplash.com/..."
                      value={portfolioForm.thumbnail}
                      onChange={handlePortfolioFormChange}
                      className="flex-grow px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange font-mono"
                    />
                    <label className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono tracking-wide cursor-pointer flex items-center justify-center text-white shrink-0">
                      {uploadingField === 'thumbnail' ? 'UPLOADING...' : 'UPLOAD'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        disabled={uploadingField !== null}
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 uppercase">Short Narrative</label>
                  <textarea
                    name="description"
                    required
                    rows="3"
                    placeholder="Describe context, edits, tools utilized..."
                    value={portfolioForm.description}
                    onChange={handlePortfolioFormChange}
                    className="px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/50 uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="DaVinci Resolve, Color Grading, Drone"
                    value={portfolioForm.tags}
                    onChange={handlePortfolioFormChange}
                    className="px-3 py-2 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange"
                  />
                </div>

                {/* Optional Before/After Comparison Links */}
                <div className="border-t border-white/5 pt-4 mt-2">
                  <span className="font-mono text-[10px] text-accent-orange tracking-widest uppercase block mb-3">Optional: Before/After Grading comparison</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] text-white/40 uppercase">Before Image</label>
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          name="before"
                          placeholder="Link or Upload..."
                          value={portfolioForm.before}
                          onChange={handlePortfolioFormChange}
                          className="px-3 py-2 text-[10px] rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange font-mono"
                        />
                        <label className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[8px] font-mono tracking-wide cursor-pointer flex items-center justify-center text-white shrink-0">
                          {uploadingField === 'before' ? 'UPLOADING...' : 'UPLOAD FILE'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'before')}
                            disabled={uploadingField !== null}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] text-white/40 uppercase">After Image</label>
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          name="after"
                          placeholder="Link or Upload..."
                          value={portfolioForm.after}
                          onChange={handlePortfolioFormChange}
                          className="px-3 py-2 text-[10px] rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange font-mono"
                        />
                        <label className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[8px] font-mono tracking-wide cursor-pointer flex items-center justify-center text-white shrink-0">
                          {uploadingField === 'after' ? 'UPLOADING...' : 'UPLOAD FILE'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'after')}
                            disabled={uploadingField !== null}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 rounded-xl font-mono text-[10px] tracking-widest font-bold bg-accent-orange hover:bg-accent-orange/90 text-white mt-4 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isEditingItem ? 'UPDATE ITEM' : 'ADD TO PORTFOLIO'}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 glass p-6 rounded-2xl border border-white/5">
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
                Active Portfolio ({portfolio.length})
              </h3>

              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                {portfolio.map(item => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* Preview Image */}
                      <div className="w-16 aspect-video bg-dark-card rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img 
                          src={item.thumbnail || item.url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-white/90 line-clamp-1">{item.title}</h4>
                        <span className="font-mono text-[8px] text-accent-orange tracking-wider uppercase bg-accent-orange/10 px-2 py-0.5 rounded border border-accent-orange/20 mt-1.5 inline-block">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPortfolioClick(item)}
                        className="w-8 h-8 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                        title="Edit Item"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="w-8 h-8 rounded-lg border border-white/5 bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {portfolio.length === 0 && (
                  <div className="text-center py-20 text-white/30 font-mono text-xs uppercase">No items in database.</div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* INQUIRIES PANEL */}
        {activeTab === 'inquiries' && (
          <div className="glass p-6 rounded-2xl border border-white/5 animate-fade-in">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
              Client Inquiries ({inquiries.length})
            </h3>

            <div className="flex flex-col gap-6">
              {inquiries.map(inq => (
                <div 
                  key={inq.id}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 ${
                    inq.status === 'unread' 
                      ? 'border-accent-orange/40 bg-accent-orange/5 shadow-[0_0_15px_rgba(255,87,34,0.05)]' 
                      : 'border-white/5 bg-black/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                    <div>
                      {/* Name & Email */}
                      <h4 className="font-display font-bold text-lg text-white">{inq.name}</h4>
                      <p className="font-mono text-xs text-white/50 mt-1">{inq.email} &bull; {inq.phone}</p>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-mono text-[9px] text-accent-orange uppercase tracking-wider bg-accent-orange/10 px-3 py-1 rounded-full border border-accent-orange/20">
                        {inq.projectType}
                      </span>
                      
                      <span className="font-mono text-[9px] text-white/70 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        BUDGET: {inq.budget}
                      </span>

                      <span className="font-mono text-[9px] text-white/40 tracking-wider">
                        {new Date(inq.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Message body */}
                  <p className="text-white/80 text-sm mt-4 leading-relaxed font-light whitespace-pre-line">
                    {inq.message}
                  </p>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                    {/* Mark as read/unread button */}
                    <button
                      onClick={() => toggleInquiryStatus(inq.id, inq.status)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[9px] tracking-widest uppercase transition-colors ${
                        inq.status === 'unread'
                          ? 'bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {inq.status === 'unread' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          MARK AS READ
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          MARK UNREAD
                        </>
                      )}
                    </button>

                    {/* Action links & deletes */}
                    <div className="flex gap-3 items-center">
                      <a
                        href={`https://wa.me/${(() => {
                          const clean = inq.phone.replace(/[^0-9]/g, '');
                          return clean.length === 10 ? `91${clean}` : clean;
                        })()}?text=Hi%20${encodeURIComponent(inq.name)}%2C%20regarding%20your%20inquiry%20on%20my%20portfolio...`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[9px] tracking-wider uppercase transition-colors"
                      >
                        REPLY ON WHATSAPP
                      </a>

                      <a
                        href={`mailto:${inq.email}?subject=Inquiry%20regarding%20your%20project%20on%20Navneet%20Films&body=Hi%20${inq.name}%2C%0A%0AThanks%20for%20reaching%20out!`}
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] tracking-wider uppercase border border-white/10 transition-colors"
                      >
                        REPLY VIA EMAIL
                      </a>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="w-8 h-8 rounded-lg border border-white/5 bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {inquiries.length === 0 && (
                <div className="text-center py-20 text-white/30 font-mono text-xs uppercase border border-dashed border-white/10 rounded-2xl bg-dark-card/20">
                  No customer inquiries received yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS PANEL */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-8 animate-fade-in max-w-2xl">
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                <Upload className="w-4 h-4 text-accent-orange" />
                Profile Photo
              </h3>

              {/* Current Photo Preview */}
              <div className="flex items-start gap-6 mb-6">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-accent-orange/30 bg-dark-card shrink-0">
                  <img
                    src={profileImageUrl}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/about-profile.jpg'; }}
                  />
                  {uploadingProfile && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 flex-grow">
                  <p className="text-white/60 text-xs font-mono leading-relaxed">
                    This photo is displayed in the <strong className="text-white">About Section</strong>.<br/>
                    Uploading a new photo will update it across all pages.
                  </p>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wide">
                    Supported: JPG, PNG, WEBP • Max size: 10MB
                  </p>

                  {/* Upload Button */}
                  <label className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-all duration-300 w-fit ${
                    uploadingProfile
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-accent-orange hover:bg-accent-orange/80 text-white'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingProfile ? 'Uploading...' : 'Upload New Photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingProfile}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploadingProfile(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || 'Upload failed');
                          if (data.success) {
                            localStorage.setItem('profileImageUrl', data.url);
                            setProfileImageUrl(data.url);
                            alert('✅ Profile photo updated! Reload the site to see changes in About section.');
                          }
                        } catch (err) {
                          alert(`Upload failed: ${err.message}`);
                        } finally {
                          setUploadingProfile(false);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>

                  {/* Reset to default */}
                  {profileImageUrl !== '/about-profile.jpg' && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('profileImageUrl');
                        setProfileImageUrl('/about-profile.jpg');
                        alert('Profile photo reset to default.');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[9px] tracking-widest uppercase text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors w-fit"
                    >
                      <Trash2 className="w-3 h-3" />
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>

              {/* Current URL display */}
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-[10px] text-white/40 break-all">
                Current: <span className="text-accent-orange">{profileImageUrl}</span>
              </div>
            </div>

            {/* Password change hint */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-orange" />
                Admin Password
              </h3>
              <p className="text-white/50 text-xs font-mono leading-relaxed">
                To change the password, update <code className="text-accent-orange bg-accent-orange/10 px-2 py-0.5 rounded">ADMIN_PASSCODE</code> in the <code className="text-accent-orange bg-accent-orange/10 px-2 py-0.5 rounded ml-1">backend/.env</code> file.
              </p>
              <div className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-[10px] text-white/40">
                Current passcode: <span className="text-accent-orange">Navneet@8287</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
