import React, { useState, useEffect } from 'react';
import { usePageMetadata } from "@/context";
import { docsService } from "@/features/dev-tools/docs/services/api";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Book,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Endpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: any[];
  responses: any;
  tags: string[];
}

const Documentation: React.FC = () => {
  const [docs, setDocs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [selectedSchema, setSelectedSchema] = useState<{ name: string, schema: any } | null>(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  usePageMetadata({
    title: "API Reference",
    description: "Everything you need to integrate student data into your capstone system. Use your M2M Client ID and Secret to authenticate.",
    badgeText: "Developer Tools",
    badgeIcon: <Book className="h-3.5 w-3.5" />,
  });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const resp = await docsService.getIntegrationDocs();
        setDocs(resp.data);
      } catch (err) {
        setError('Failed to load documentation. Please ensure the API is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const toggleEndpoint = (id: string) => {
    const next = new Set(expandedEndpoints);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedEndpoints(next);
  };

  const getEndpoints = (): Endpoint[] => {
    if (!docs?.paths) return [];
    const endpoints: Endpoint[] = [];
    Object.entries(docs.paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, detail]: [string, any]) => {
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: detail.summary,
          description: detail.description,
          parameters: detail.parameters || [],
          responses: detail.responses || {},
          tags: detail.tags || []
        });
      });
    });
    return endpoints.filter(e =>
      e.path.toLowerCase().includes(search.toLowerCase()) ||
      e.summary.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-success-foreground bg-success-background border-success-foreground/20';
      case 'POST': return 'text-info-foreground bg-info-background border-info-foreground/20';
      case 'PUT': return 'text-warning-foreground bg-warning-background border-warning-foreground/20';
      case 'DELETE': return 'text-danger-foreground bg-danger-background border-danger-foreground/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const resolveSchema = (schema: any, depth = 0): any => {
    if (depth > 12 || !schema || typeof schema !== 'object') return schema;

    if (schema.$ref) {
      const ref = schema.$ref.replace('#/definitions/', '');
      const definition = docs.definitions?.[ref];
      return definition ? resolveSchema(definition, depth + 1) : schema;
    }

    if (schema.type === 'array' && schema.items) {
      return [resolveSchema(schema.items, depth + 1)];
    }

    if (schema.properties) {
      const resolvedProps: any = {};
      Object.keys(schema.properties).forEach(key => {
        resolvedProps[key] = resolveSchema(schema.properties[key], depth + 1);
      });
      return resolvedProps;
    }

    return schema;
  };

  const handleOpenSchema = (name: string, schema: any) => {
    const resolved = resolveSchema(schema);
    setSelectedSchema({ name, schema: resolved });
    setIsSchemaModalOpen(true);
  };

  const getExampleCurl = (endpoint: Endpoint) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;

    // Add Headers
    curl += ` \\\n  -H "Content-Type: application/json"`;

    if (endpoint.path.startsWith('/integrations/students')) {
      curl += ` \\\n  -H "Authorization: Bearer <your_access_token>"`;
    }

    // Add Body for POST/PUT
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      let body = {};
      if (endpoint.path === '/auth/m2m/token') {
        body = { clientId: "your_client_id", clientSecret: "your_client_secret" };
      } else if (endpoint.path === '/auth/m2m/refresh') {
        body = { refreshToken: "your_refresh_token" };
      } else {
        // Try to infer from parameters if they are 'body'
        const bodyParam = endpoint.parameters.find(p => p.in === 'body');
        if (bodyParam && bodyParam.schema) {
          const resolved = resolveSchema(bodyParam.schema);
          if (resolved && resolved.properties) {
            Object.keys(resolved.properties).forEach(key => {
              (body as any)[key] = resolved.properties[key].type === 'string' ? 'string' : 0;
            });
          }
        }
      }

      if (Object.keys(body).length > 0) {
        curl += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
      }
    }

    return curl;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-muted-foreground animate-pulse">Parsing API Specifications...</p>
    </div>
  );

  if (error) return (
    <div className="glass-card p-12 text-center space-y-4">
      <AlertCircle className="mx-auto text-danger" size={40} />
      <h3 className="text-xl font-bold">Documentation Offline</h3>
      <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
    </div>
  );

  const endpoints = getEndpoints();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">

      <div className="top-20 z-30 py-4 bg-background/80 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search endpoints, paths, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint) => {
          const id = `${endpoint.method}-${endpoint.path}`;
          const isExpanded = expandedEndpoints.has(id);

          return (
            <div key={id} className="glass-card overflow-hidden group border-white/5 hover:border-white/10 transition-all">
              <button
                onClick={() => toggleEndpoint(id)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-muted-foreground/90 tracking-widest">{endpoint.path}</span>
                    <span className="font-bold text-xl">{endpoint.summary}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="text-muted-foreground" /> : <ChevronRight className="text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 space-y-8 border-t border-white/5 pt-6 bg-white/[0.01]">
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">{endpoint.description}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80">Example Request</h4>
                          <button
                            onClick={() => handleCopy(id, getExampleCurl(endpoint))}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                          >
                            {copiedId === id ? (
                              <><Check size={12} className="text-success-foreground" /> Copied</>
                            ) : (
                              <><Copy size={12} /> Copy Curl</>
                            )}
                          </button>
                        </div>
                        <div className="rounded-xl bg-black border border-white/5 p-4 overflow-x-auto group/code">
                          <pre className="text-xs font-mono text-blue-300 leading-relaxed whitespace-pre-wrap">
                            {getExampleCurl(endpoint)}
                          </pre>
                        </div>
                      </div>

                      {endpoint.parameters.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80">Parameters</h4>
                          <div className="space-y-3">
                            {endpoint.parameters.map((param: any, pIdx: number) => (
                              <div key={pIdx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex flex-col gap-1 w-32 border-r border-white/5 pr-4">
                                  <span className="font-mono text-sm font-bold text-primary">{param.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase">{param.in}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-blue-400 uppercase">{param.type}</span>
                                    {param.required && <span className="text-[10px] bg-rose-500/20 text-rose-500 px-1.5 py-0.5 rounded font-bold uppercase">Required</span>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{param.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80">Responses</h4>
                        <div className="grid gap-3">
                          {Object.entries(endpoint.responses).map(([code, res]: [string, any]) => (
                            <div key={code} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                              <div className="flex items-center gap-4">
                                <span className={`w-12 text-center font-bold text-sm ${code.startsWith('2') ? 'text-success-foreground' : 'text-danger-foreground'}`}>
                                  {code}
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">{res.description}</span>
                              </div>
                              {res.schema && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSchema(`${endpoint.method} ${endpoint.path} - ${code} Response`, res.schema);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded hover:bg-primary/10 transition-all flex items-center gap-2"
                                >
                                  View Schema <ExternalLink size={10} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {isSchemaModalOpen && selectedSchema && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSchemaModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-2xl max-h-[80vh] flex flex-col relative z-[101]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Schema Definition</h3>
                  <p className="text-xs text-muted-foreground font-mono">{selectedSchema.name}</p>
                </div>
                <button
                  onClick={() => setIsSchemaModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="rounded-xl bg-black/40 border border-white/5 p-6 overflow-x-auto">
                  <pre className="text-sm font-mono leading-relaxed">
                    {JSON.stringify(selectedSchema.schema, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documentation;
