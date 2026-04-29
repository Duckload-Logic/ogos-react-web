import React, { useState } from 'react';
import { usePageMetadata } from "@/context";
import {
  Terminal,
  Server,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Cpu,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Guides: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'laravel' | 'php' | 'curl'>('laravel');
  const [copied, setCopied] = useState(false);

  usePageMetadata({
    title: "Implementation Guides",
    description: "Get up and running in minutes with our ready-to-use code snippets for popular frameworks and languages.",
    badgeText: "Developer Tools",
    badgeIcon: <Terminal className="h-3.5 w-3.5" />,
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snippets = {
    laravel: {
      title: 'Laravel (HTTP Client)',
      desc: 'Use the built-in Guzzle wrapper to make authenticated requests.',
      code: `use Illuminate\\Support\\Facades\\Http;

$response = Http::withToken('YOUR_TOKEN')
    ->get('https://api.pupt-ogos.dllbsit2027.com/api/v1/integrations/students/profiles', [
        'page' => 1,
        'page_size' => 10
    ]);

if ($response->successful()) {
    $students = $response->json()['data'];
}`
    },
    php: {
      title: 'Native PHP (cURL)',
      desc: 'Standard cURL implementation for legacy PHP environments.',
      code: `<?php
$ch = curl_init('https://api.pupt-ogos.dllbsit2027.com/api/v1/integrations/students/profiles');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_TOKEN',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);`
    },
    curl: {
      title: 'cURL / CLI',
      desc: 'Quick testing from your terminal or shell scripts.',
      code: `curl -X GET "https://api.pupt-ogos.dllbsit2027.com/api/v1/integrations/students/profiles" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -H "Content-Type: application/json"`
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          {[
            { id: 'laravel', name: 'Laravel 10+', icon: <Layers size={18} /> },
            { id: 'php', name: 'Native PHP', icon: <Server size={18} /> },
            { id: 'curl', name: 'cURL / CLI', icon: <Terminal size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${activeTab === item.id
                ? 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/5'
                : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10'
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold">{item.name}</span>
              </div>
              <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 space-y-4">
                <h2 className="text-3xl font-black tracking-tight uppercase leading-none">{snippets[activeTab].title}</h2>
                <p className="text-muted-foreground font-medium">{snippets[activeTab].desc}</p>

                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => copyCode(snippets[activeTab].code)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all backdrop-blur-md border border-white/10 shadow-lg"
                    >
                      {copied ? <Check size={16} className="text-success-foreground" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="p-6 pt-12 rounded-lg bg-[#0a0a0a] border border-white/10 text-sm font-mono text-amber-200 overflow-x-auto selection:bg-primary/30">
                    <code>{snippets[activeTab].code}</code>
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Globe size={18} />
                  </div>
                  <h4 className="font-bold uppercase tracking-tight">Base URL</h4>
                  <code className="text-xs text-muted-foreground font-mono text-wrap">https://api.pupt-ogos.dllbsit2027.com/api/v1</code>
                </div>
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <Cpu size={18} />
                  </div>
                  <h4 className="font-bold uppercase tracking-tight">Authentication</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Bearer Token Auth</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Guides;
