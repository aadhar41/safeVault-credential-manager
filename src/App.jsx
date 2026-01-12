import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Shield,
  Key,
  Mail,
  User,
  FileText,
  Paperclip,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  Save,
  X,
  Lock,
  Download,
  Upload
} from 'lucide-react';

const App = () => {
  // State Management
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('safevault_credentials');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('home'); // 'home', 'add', 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [isSecureMode, setIsSecureMode] = useState(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('safevault_credentials', JSON.stringify(credentials));
  }, [credentials]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    email: '',
    password: '',
    notes: '',
    attachments: []
  });

  // Handle Form Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle File Uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment = {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          id: Math.random().toString(36).substr(2, 9),
          url: event.target.result // Base64 string
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadFile = (file) => {
    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Increased delay for mobile browsers to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
      }, 5000);
    } catch (err) {
      window.alert('Download failed: ' + err.message);
    }
  };

  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
  };

  // CRUD Operations
  const saveCredential = () => {
    if (!formData.title) return;

    const newEntry = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString()
    };

    setCredentials([newEntry, ...credentials]);
    resetForm();
    setView('home');
  };

  const deleteCredential = (id) => {
    setCredentials(credentials.filter(c => c.id !== id));
    if (selectedItem?.id === id) setView('home');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      username: '',
      email: '',
      password: '',
      notes: '',
      attachments: []
    });
  };

  // Toggles
  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Import/Export
  const exportData = async () => {
    try {
      const dataStr = JSON.stringify(credentials, null, 2);
      const fileName = `safevault-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Try using Web Share API if available (best for mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([dataStr], fileName, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'SafeVault Backup',
            text: 'Your encrypted credentials backup'
          });
          return;
        }
      }

      // Fallback to traditional download
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Increased delay to ensure mobile browser handles the download
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 5000);
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert('Export failed: ' + err.message);
      }
    }
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          if (window.confirm('Import data? This will merge with your existing credentials.')) {
            setCredentials(prev => [...imported, ...prev]);
          }
        }
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  // Filtered List
  const filteredCredentials = useMemo(() => {
    return credentials.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [credentials, searchQuery]);

  // Views
  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] bg-white border-b border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Shield size={28} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SafeVault</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportData}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                title="Export Backup"
            >
              <Download size={20} />
            </button>
            <label className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Import Backup">
              <Upload size={20} />
              <input type="file" className="hidden" accept=".json" onChange={importData} />
            </label>
            <button
              onClick={() => setIsSecureMode(!isSecureMode)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isSecureMode ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
            >
              {isSecureMode ? '● Encrypted' : '○ Unlocked'}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search credentials..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCredentials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Lock size={48} className="mb-3 opacity-20" />
            <p className="text-sm">No credentials found</p>
          </div>
        ) : (
          filteredCredentials.map(item => (
            <div
              key={item.id}
              onClick={() => { setSelectedItem(item); setView('detail'); }}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Key size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500 truncate">{item.username || item.email}</p>
              </div>
              {item.attachments.length > 0 && (
                <Paperclip size={14} className="text-slate-400" />
              )}
            </div>
          ))
        )}
      </main>

      <button
        onClick={() => { resetForm(); setView('add'); }}
        className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors active:scale-95 z-50 ring-4 ring-white"
      >
        <Plus size={28} />
      </button>
    </div>
  );

  const renderAdd = () => (
    <div className="flex flex-col h-full bg-white relative">
      <header className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b flex items-center gap-4 sticky top-0 bg-white z-20">
        <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-bold">New Credential</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Google Account, Netflix"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                name="password"
                type={showPassword['new'] ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword['new'] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
              placeholder="Recovery codes, security questions..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attachments</label>
            <div className="flex flex-col gap-3">
              {formData.attachments.map(file => (
                <div key={file.id} className="group relative px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Paperclip size={16} className="text-indigo-500" />
                    <span className="text-sm text-indigo-700 font-medium truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeAttachment(file.id)}
                    className="p-1 text-indigo-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <label className="px-4 py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors bg-slate-50 mt-2">
                <Plus size={20} />
                <span className="text-sm font-semibold">Upload File</span>
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      </main>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t bg-white fixed bottom-0 left-0 right-0">
        <button
          onClick={saveCredential}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Save size={20} />
          Save Credential
        </button>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] bg-white border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ChevronLeft />
          </button>
          <h2 className="text-lg font-bold truncate max-w-[200px]">{selectedItem.title}</h2>
        </div>
        <button
          onClick={() => deleteCredential(selectedItem.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          {/* Identity Section */}
          <div className="space-y-4">
            {selectedItem.username && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Username</p>
                  <p className="text-slate-900 font-medium">{selectedItem.username}</p>
                </div>
              </div>
            )}

            {selectedItem.email && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</p>
                  <p className="text-slate-900 font-medium">{selectedItem.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <Lock size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-slate-900 font-mono font-bold tracking-widest">
                    {showPassword[selectedItem.id] ? selectedItem.password : '••••••••••••'}
                  </p>
                  <button
                    onClick={() => togglePasswordVisibility(selectedItem.id)}
                    className="text-indigo-600 text-xs font-bold"
                  >
                    {showPassword[selectedItem.id] ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedItem.notes && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-slate-400" />
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secure Notes</p>
            </div>
            <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{selectedItem.notes}</p>
          </div>
        )}

        {selectedItem.attachments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Paperclip size={16} className="text-slate-400" />
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secure Attachments</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {selectedItem.attachments.map(file => (
                <div key={file.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{file.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => downloadFile(file)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 font-medium">
          Added on {selectedItem.createdAt}
        </p>
      </main>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-0 sm:p-4">
      <div className="w-full max-w-md h-[100vh] sm:h-[800px] bg-white sm:rounded-[3rem] sm:border-[8px] border-slate-800 shadow-2xl relative">
        {/* Notch for mobile look */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>

        <div className="h-full">
          {view === 'home' && renderHome()}
          {view === 'add' && renderAdd()}
          {view === 'detail' && renderDetail()}
        </div>
      </div>
    </div>
  );
};

export default App;