import React, { useState, useEffect } from 'react';
import { usePageMetadata } from "@/context";
import { m2mService } from "@/features/dev-tools/m2m/services/api";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Loader2,
  Lock,
  Fingerprint,
  Eye,
  EyeOff,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface M2MClient {
  id: number;
  clientName: string;
  clientDescription: string;
  clientId: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

const M2MManagement: React.FC = () => {
  const [clients, setClients] = useState<M2MClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', description: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<{ id: string, secret: string } | null>(null);
  const [createdClientData, setCreatedClientData] = useState<{ client: M2MClient, secret: string } | null>(null);
  const [showCreatedSecret, setShowCreatedSecret] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  usePageMetadata({
    title: "Client Manager",
    description: "Manage machine-to-machine authentication for your capstone system.",
    badgeText: "Dev Portal",
    badgeIcon: <Lock className="h-3.5 w-3.5" />,
    headerActions: (
      <div className="group relative">
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={clients.some((c) => c.isActive)}
          className="btn-primary flex items-center gap-2 px-6 py-3 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Create New Client</span>
        </button>
        {clients.some((c) => c.isActive) && (
          <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-3 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold leading-relaxed tracking-widest text-amber-500">
              Restriction: You already have an active client. Revoke it to create a new one.
            </p>
          </div>
        )}
      </div>
    ),
  });

  const fetchClients = async () => {
    try {
      const resp = await m2mService.getClients();
      setClients(resp.data || []);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await m2mService.createClient({
        clientName: newClient.name,
        clientDescription: newClient.description
      });
      // Skip setting createdClientData to avoid showing the success modal
      // as verification is pending anyway.
      await fetchClients();
      setNewClient({ name: '', description: '' });
      setShowCreateModal(false); // Close the creation form
    } catch (err) {
      console.error('Failed to create client', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to revoke this client? This action cannot be undone.')) return;
    try {
      await m2mService.deleteClient(id.toString());
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete client', err);
    }
  };

  const handleGenerateSecret = async (id: number) => {
    setGeneratingFor(id.toString());
    try {
      const resp = await m2mService.generateSecret(id.toString());
      setNewSecret({ id: id.toString(), secret: resp.data.clientSecret });
    } catch (err) {
      console.error('Failed to generate secret', err);
    } finally {
      setGeneratingFor(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 relative">
      {clients.some(c => c.isActive) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black uppercase">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold tracking-tight uppercase">Security Policy Active</p>
            <p className="text-xs text-muted-foreground font-medium underline decoration-primary/20">To protect student data from irresponsible use, we limit each developer to one active M2M client.</p>
          </div>
        </motion.div>
      )}

      {clients.some(c => c.isActive && !c.isVerified) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 font-black">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold tracking-tight uppercase text-amber-700">Verification Pending</p>
            <p className="text-xs text-amber-600/80 font-medium leading-relaxed">Some of your clients are awaiting Superadmin approval. Sensitive information is hidden and API access is restricted until verified.</p>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Retrieving secured clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-24 text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/10 border border-primary/20">
            <Fingerprint size={40} />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-bold tracking-tight">No clients yet</h3>
            <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
              Generate your first machine-to-machine client to start integrating with our secure student APIs.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-secondary flex items-center gap-2 px-8"
          >
            <Plus size={18} /> Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <motion.div
              layout
              key={client.id}
              className={`glass-card hover:translate-y-[-6px] transition-all duration-300 group relative overflow-hidden flex flex-col border border-glass-border rounded-xl px-6 py-4 ${!client.isVerified ? 'opacity-60 shadow-none grayscale-[0.5]' : ''}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-muted/50 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-primary/30 relative">
                  <ShieldCheck size={28} />
                  {!client.isVerified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                      <AlertTriangle size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground p-0 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <h3 className="text-xl font-bold truncate tracking-tight">{client.clientName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 font-medium">{client.clientDescription || 'No description provided.'}</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Client ID</label>
                    <div className="flex items-center gap-3 bg-muted/50 border border-border p-3 rounded-lg group/item pr-4 shadow-inner">
                      <code className="text-xs flex-1 truncate font-mono text-foreground font-bold tracking-tight">{client.clientId}</code>
                      <button
                        onClick={() => copyToClipboard(client.clientId, client.id.toString())}
                        disabled={!client.isVerified}
                        className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {copiedId === client.id.toString() ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Client Secret</label>
                    {newSecret?.id === client.id.toString() ? (
                      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg animate-in zoom-in-95 shadow-inner">
                        <input
                          type={showCreatedSecret ? "text" : "password"}
                          readOnly
                          value={newSecret.secret}
                          className="text-xs flex-1 bg-transparent border-none focus:outline-none font-mono text-emerald-500 font-bold"
                        />
                        <button
                          onClick={() => setShowCreatedSecret(!showCreatedSecret)}
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-all active:scale-90"
                        >
                          {showCreatedSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(newSecret.secret, 'secret-' + client.id.toString())}
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-all active:scale-90"
                        >
                          {copiedId === 'secret-' + client.id.toString() ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button
                          onClick={() => setNewSecret(null)}
                          className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted transition-all active:scale-90"
                          title="Dismiss"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGenerateSecret(client.id)}
                        disabled={generatingFor === client.id.toString() || !client.isVerified}
                        className="w-full h-12 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all group/gen disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingFor === client.id.toString() ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} className="text-primary group-hover:scale-125 transition-transform" /> Generate New Secret</>}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5 pt-5 mt-auto border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Clock size={14} className="text-muted-foreground/60" /> {new Date(client.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${client.isActive ? (client.isVerified ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' : 'text-amber-500 bg-amber-500/10 border-amber-500/10') : 'text-rose-500 bg-rose-500/10 border-rose-500/10'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${client.isActive ? (client.isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500') : 'bg-rose-500'}`} />
                    {client.isActive ? (client.isVerified ? 'Verified Active' : 'Pending Verification') : 'Revoked'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card w-full max-w-lg relative z-10 p-10 space-y-8 shadow-2xl border-primary/10"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">
                  {createdClientData ? 'Client Created Successfully' : 'Create M2M Client'}
                </h2>
                <p className="text-muted-foreground font-medium">
                  {createdClientData
                    ? 'Please copy your client secret now. For security, we won\'t show it to you again.'
                    : 'Authorize a new machine-to-machine application to integrate with the OGOS platform.'}
                </p>
              </div>

              {createdClientData ? (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Client ID</label>
                      <div className="flex items-center gap-3 bg-background border border-border p-4 rounded-2xl shadow-inner">
                        <code className="text-sm flex-1 truncate font-mono text-foreground font-bold">{createdClientData.client.clientId}</code>
                        <button
                          onClick={() => copyToClipboard(createdClientData.client.clientId, 'created-id')}
                          className="p-2 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary transition-all"
                        >
                          {copiedId === 'created-id' ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Client Secret</label>
                      <div className="flex items-center gap-3 bg-background border border-border p-4 rounded-2xl shadow-inner">
                        <input
                          type={showCreatedSecret ? "text" : "password"}
                          readOnly
                          value={createdClientData.secret}
                          className="text-sm flex-1 bg-transparent border-none focus:outline-none font-mono text-emerald-500 font-bold"
                        />
                        <button
                          onClick={() => setShowCreatedSecret(!showCreatedSecret)}
                          className="p-2 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary transition-all"
                        >
                          {showCreatedSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(createdClientData.secret, 'created-secret')}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all font-bold"
                        >
                          {copiedId === 'created-secret' ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-500/90 font-bold leading-relaxed">
                      Make sure to store this secret securely. You will not be able to retrieve it later, though you can always generate a new one.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreatedClientData(null);
                      setShowCreatedSecret(false);
                    }}
                    className="w-full btn-primary py-4 text-sm font-bold"
                  >
                    I've copied the secret
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                      Application Name <span className="text-destructive ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="e.g. Finance Analytics Service"
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                      Purpose / Description <span className="text-destructive ml-1">*</span>
                    </label>
                    <textarea
                      value={newClient.description}
                      required
                      onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                      placeholder="Explain how this application will use the available student endpoints."
                      className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Generate Client
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default M2MManagement;
