import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Camera, 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Menu, 
  X,
  BarChart3,
  Search,
  Settings,
  User,
  Navigation,
  Layers,
  Info
} from 'lucide-react';

// --- Mock Data & Constants ---
const ISSUE_CATEGORIES = [
  { id: 'pothole', label: 'Pothole', color: 'bg-red-500' },
  { id: 'garbage', label: 'Garbage Accumulation', color: 'bg-orange-500' },
  { id: 'streetlight', label: 'Broken Streetlight', color: 'bg-yellow-500' },
  { id: 'parking', label: 'Illegal Parking', color: 'bg-blue-500' },
];

const MOCK_REPORTS = [
  { id: '101', type: 'Pothole', status: 'Pending', location: 'Main St & 5th', date: '2023-10-24', confidence: 0.94, lat: 40.7128, lng: -74.0060 },
  { id: '102', type: 'Garbage', status: 'In Progress', location: 'Riverside Park', date: '2023-10-23', confidence: 0.88, lat: 40.7228, lng: -73.9960 },
  { id: '103', type: 'Streetlight', status: 'Resolved', location: 'Industrial Ave', date: '2023-10-22', confidence: 0.97, lat: 40.7028, lng: -74.0160 },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'citizen', label: 'Report Issue', icon: Camera },
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'City Map', icon: Navigation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 shadow-xl border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">SmartCity AI</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">JD</div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-500">City Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CitizenPortal = ({ onSubmitReport }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API/ML processing
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Success step
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-slate-500 mt-2">Help us keep the city clean and safe using AI-powered reporting.</p>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative"
              onClick={() => document.getElementById('fileInput').click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">Click or Drag photo of the issue</p>
                  <p className="text-slate-400 text-sm">Potholes, garbage, broken lights, etc.</p>
                </>
              )}
              <input 
                id="fileInput" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <button 
              disabled={!file}
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition-all"
            >
              Next: Details & Location
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Description</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-32" 
                  placeholder="Tell us what's wrong..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50" 
                      value="40.7128° N, 74.0060° W" 
                      readOnly 
                    />
                  </div>
                  <button type="button" className="px-4 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600">
                    Auto-Detect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AI Analyzing...
                </>
              ) : 'Submit Report'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Report Successfully Submitted!</h2>
          <p className="text-slate-500 mt-2 mb-8">Our AI system has categorized this as a <span className="text-blue-600 font-bold">Pothole (94% confidence)</span> and notified the public works department.</p>
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Tracking ID</p>
            <p className="text-xl font-mono text-slate-700">#SCR-2023-8894</p>
          </div>
          <button 
            onClick={() => { setStep(1); setPreview(null); setFile(null); }}
            className="text-blue-600 font-bold hover:underline"
          >
            Submit another report
          </button>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">City Command Center</h1>
          <p className="text-slate-500">Real-time infrastructure health monitoring</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search reports..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
            <Settings className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Issues', value: '1,248', change: '+12%', icon: AlertTriangle, color: 'blue' },
          { label: 'Pending AI Review', value: '42', change: '-4', icon: Clock, color: 'orange' },
          { label: 'Resolved Today', value: '18', change: '+3', icon: CheckCircle, color: 'green' },
          { label: 'Avg Resolution', value: '4.2h', change: '-12m', icon: BarChart3, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800">Recent Reports</h3>
            <button className="text-xs text-blue-600 font-bold">View All</button>
          </div>
          {MOCK_REPORTS.map((report) => (
            <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Camera className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-slate-900">{report.type}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{report.location}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span>AI Confidence: <span className="text-blue-600 font-bold">{(report.confidence * 100).toFixed(0)}%</span></span>
                <span>{report.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-slate-200 rounded-3xl h-[600px] overflow-hidden relative border-4 border-white shadow-xl">
             {/* Mock Map Background (SVG) */}
             <svg className="absolute inset-0 w-full h-full bg-[#f8fafc]" viewBox="0 0 800 600">
               <path d="M0,100 L800,100 M0,200 L800,200 M0,300 L800,300 M0,400 L800,400 M0,500 L800,500" stroke="#e2e8f0" strokeWidth="1" />
               <path d="M100,0 L100,600 M200,0 L200,600 M300,0 L300,600 M400,0 L400,600 M500,0 L500,600 M600,0 L600,600 M700,0 L700,600" stroke="#e2e8f0" strokeWidth="1" />
               <path d="M0,0 L800,600" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
               <path d="M0,600 L800,0" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
               
               {/* Map Markers */}
               {MOCK_REPORTS.map((r, i) => (
                 <g key={i} transform={`translate(${100 + i*150}, ${100 + i*120})`} className="cursor-pointer">
                    <circle r="12" fill="white" className="shadow-lg" />
                    <circle r="6" fill={r.status === 'Resolved' ? '#10b981' : '#f59e0b'} />
                    <text y="-20" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">{r.type}</text>
                 </g>
               ))}
             </svg>

             {/* Map UI Overlays */}
             <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-md p-1 rounded-lg shadow-lg flex flex-col border border-white">
                  <button className="p-2 hover:bg-slate-100 border-b border-slate-100">+</button>
                  <button className="p-2 hover:bg-slate-100">-</button>
                </div>
                <button className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white hover:bg-white">
                  <Navigation className="w-5 h-5 text-slate-600" />
                </button>
             </div>

             <div className="absolute bottom-6 right-6 flex gap-2">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white w-64 animate-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Filters</h4>
                  <div className="space-y-2">
                    {ISSUE_CATEGORIES.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                          <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Heatmap Mode</span>
                    <div className="w-8 h-4 bg-blue-600 rounded-full flex items-center px-1">
                      <div className="w-2.5 h-2.5 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CityMapOnly = () => {
  return (
    <div className="h-[calc(100vh-64px)] md:h-screen w-full relative">
      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
        <div className="text-center p-8">
          <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Interactive City Map Loading...</h2>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">Connecting to PostGIS and Mapbox for real-time spatial analytics.</p>
        </div>
      </div>
      
      {/* Search Overlay */}
      <div className="absolute top-8 left-8 right-8 md:left-auto md:w-96 bg-white shadow-2xl rounded-2xl p-4 border border-slate-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search address or issue ID..." />
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Urgent', 'Today', 'Assigned'].map(tag => (
            <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${tag === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {tag}
            </button>
          ))}
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">HIGH PRIORITY</span>
              <span className="text-[10px] text-slate-400">2m ago</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1">Sewer Overflow</p>
            <p className="text-xs text-slate-500">241 Broadway, NYC</p>
          </div>
          <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">MAINTENANCE</span>
              <span className="text-[10px] text-slate-400">15m ago</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1">Dead Streetlight</p>
            <p className="text-xs text-slate-500">Wall St & Broad St</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'citizen': return <CitizenPortal />;
      case 'dashboard': return <AdminDashboard />;
      case 'map': return <CityMapOnly />;
      case 'analytics': return (
        <div className="p-8 text-center mt-20">
          <BarChart3 className="w-20 h-20 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Analytics Engine</h2>
          <p className="text-slate-500">Aggregation of city health metrics, response times, and predictive trends.</p>
        </div>
      );
      default: return <CitizenPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Nav */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-blue-500" />
          <span className="font-bold tracking-tight">SmartCity AI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-slate-900 z-40 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {[
            { id: 'citizen', label: 'Report Issue', icon: Camera },
            { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
            { id: 'map', label: 'City Map', icon: Navigation },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 p-4 rounded-2xl ${activeTab === item.id ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <item.icon />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sidebar - Desktop Only */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto">
        {renderContent()}
      </main>

      {/* Floating Action Button (Mobile Only) */}
      {activeTab !== 'citizen' && (
        <button 
          onClick={() => setActiveTab('citizen')}
          className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
        >
          <Camera className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}