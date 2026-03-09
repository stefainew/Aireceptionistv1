
import React, { useState, useEffect } from 'react';
import { db, Lead, AppSettings } from '../utils/storage';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Phone, 
  Clock, 
  DollarSign, 
  Save, 
  Trash2, 
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'settings'>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLeads(db.getLeads());
  }, [activeTab]);

  const handleStatusChange = (id: string, status: Lead['status']) => {
    db.updateLeadStatus(id, status);
    setLeads(db.getLeads());
  };

  const handleDelete = (id: string) => {
    if(confirm('Сигурни ли сте, че искате да изтриете този запис?')) {
      db.deleteLead(id);
      setLeads(db.getLeads());
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-900 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-500 rounded-lg flex items-center justify-center text-black">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-neon-500/10 text-neon-400 border border-neon-500/20' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <TrendingUp className="w-5 h-5" />
            Общ преглед
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'leads' ? 'bg-neon-500/10 text-neon-400 border border-neon-500/20' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
            Запитвания
            {stats.new > 0 && (
              <span className="ml-auto bg-neon-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {stats.new}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-neon-500/10 text-neon-400 border border-neon-500/20' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            Настройки на AI
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Изход
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-bold">Добре дошли, Шефе. 👋</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-dark-800 rounded-2xl border border-white/5">
                <div className="text-gray-400 text-sm mb-2">Общо запитвания</div>
                <div className="text-4xl font-bold text-white">{stats.total}</div>
              </div>
              <div className="p-6 bg-neon-500/10 rounded-2xl border border-neon-500/20">
                <div className="text-neon-400 text-sm mb-2">Нови (Чакат)</div>
                <div className="text-4xl font-bold text-neon-400">{stats.new}</div>
              </div>
              <div className="p-6 bg-dark-800 rounded-2xl border border-white/5">
                <div className="text-blue-400 text-sm mb-2">Обработени</div>
                <div className="text-4xl font-bold text-blue-400">{stats.contacted}</div>
              </div>
              <div className="p-6 bg-dark-800 rounded-2xl border border-white/5">
                <div className="text-green-400 text-sm mb-2">Приключени</div>
                <div className="text-4xl font-bold text-green-400">{stats.closed}</div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-2xl border border-white/5 p-6">
              <h3 className="text-xl font-bold mb-4">Бързи действия</h3>
              <div className="flex gap-4">
                 <button onClick={() => window.open('/', '_blank')} className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200">
                    Виж Сайта
                 </button>
                 <button onClick={() => setActiveTab('settings')} className="px-4 py-2 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/5">
                    Промени работно време
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Входящи Запитвания</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Търсене..." 
                  className="bg-dark-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-500 transition-colors"
                />
              </div>
            </div>

            <div className="bg-dark-800 rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium">Име</th>
                      <th className="p-4 font-medium">Контакти</th>
                      <th className="p-4 font-medium">Тип</th>
                      <th className="p-4 font-medium">Дата</th>
                      <th className="p-4 font-medium">Статус</th>
                      <th className="p-4 font-medium text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          Няма намерени запитвания. Споделете формата!
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 font-medium text-white">{lead.name}</td>
                          <td className="p-4 text-gray-300">
                            <div className="flex flex-col text-sm">
                              <span>{lead.phone}</span>
                              <span className="text-gray-500 text-xs">{lead.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 capitalize">{lead.type}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {new Date(lead.date).toLocaleDateString('bg-BG')}
                          </td>
                          <td className="p-4">
                             <select 
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                                className={`bg-transparent text-xs font-bold uppercase tracking-wider px-2 py-1 rounded cursor-pointer focus:outline-none ${
                                  lead.status === 'new' ? 'text-neon-400 bg-neon-500/10' :
                                  lead.status === 'contacted' ? 'text-blue-400 bg-blue-500/10' :
                                  'text-green-400 bg-green-500/10'
                                }`}
                             >
                                <option value="new" className="bg-dark-900">Нов</option>
                                <option value="contacted" className="bg-dark-900">Свързан</option>
                                <option value="closed" className="bg-dark-900">Приключен</option>
                             </select>
                          </td>
                          <td className="p-4 text-right">
                             <button 
                                onClick={() => handleDelete(lead.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in max-w-2xl">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Настройки на AI</h2>
              {isSaved && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Запазено
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 space-y-6">
                 <h3 className="text-xl font-bold border-b border-white/5 pb-4">Основни данни</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Име на AI Асистента</label>
                      <input 
                        type="text" 
                        value={settings.aiName}
                        onChange={e => setSettings({...settings, aiName: e.target.value})}
                        className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Име на Бизнеса</label>
                      <input 
                        type="text" 
                        value={settings.businessName}
                         onChange={e => setSettings({...settings, businessName: e.target.value})}
                        className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-500 focus:outline-none"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Работно Време (за AI логиката)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                         value={settings.workingHours}
                         onChange={e => setSettings({...settings, workingHours: e.target.value})}
                        className="w-full bg-dark-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon-500 focus:outline-none"
                      />
                    </div>
                 </div>
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 space-y-6">
                 <h3 className="text-xl font-bold border-b border-white/5 pb-4">Контакти & Цени</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Телефон за връзка</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          type="text" 
                           value={settings.phone}
                           onChange={e => setSettings({...settings, phone: e.target.value})}
                          className="w-full bg-dark-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Базова цена за услуга</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          type="text" 
                           value={settings.pricePerConsultation}
                           onChange={e => setSettings({...settings, pricePerConsultation: e.target.value})}
                          className="w-full bg-dark-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon-500 focus:outline-none"
                        />
                      </div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setSettings(db.getSettings())} className="px-6 py-3 text-gray-400 hover:text-white font-medium">
                  Отказ
                </button>
                <button type="submit" className="px-8 py-3 bg-neon-500 hover:bg-neon-400 text-black font-bold rounded-xl flex items-center gap-2 transition-colors">
                  <Save className="w-5 h-5" />
                  Запази Промените
                </button>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
