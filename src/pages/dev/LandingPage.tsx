import React from "react";
import { useNavigate } from "react-router-dom";
import { Code, Shield, BarChart3, Zap, Cpu, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useUI } from "@/context";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useUI();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Background Decor */}
      <div className="bg-grid pointer-events-none absolute left-0 top-0 h-full w-full opacity-[0.01]" />
      <div className="animate-glow absolute right-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-primary/[0.05] blur-[150px]" />
      <div className="animate-glow absolute bottom-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-secondary/[0.05] blur-[150px]" />

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => navigate("/")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-transform group-hover:scale-110">
              <Cpu className="size-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Developer{" "}
              <span className="font-medium italic text-primary/60">
                Service
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <div className="hidden h-4 w-px bg-border sm:block" />
            <button
              onClick={() => navigate("/login")}
              className="hidden px-4 py-2 text-xs font-semibold tracking-wide transition-all hover:text-primary sm:block"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="glass-button border-none bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pb-32 pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                <Zap
                  size={12}
                  fill="currentColor"
                />
                API v1.0 Production Ready
              </div>
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
                GuiSIS <br />
                <span className="text-gradient decoration-primary/10 decoration-4 underline-offset-4">
                  Developer Service
                </span>
              </h1>
              <p className="max-w-lg text-lg font-normal leading-relaxed text-muted-foreground">
                Securely integrate your applications with the PUPT ecosystem.
                Full machine-to-machine automation for PUPT partners and
                verified developers.
              </p>
              <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
                <button
                  onClick={() => navigate("/register")}
                  className="glass-button flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-base text-white hover:scale-105 active:scale-95 sm:w-auto"
                >
                  Get Started{" "}
                  <ChevronRight
                    size={18}
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative mt-20 lg:mt-0"
            >
              <div className="absolute -inset-10 rounded-full bg-primary/[0.03] blur-[100px]" />
              <div className="glass-card relative z-10 rounded-[2.5rem] border-primary/5 p-1.5 shadow-2xl">
                <div className="overflow-hidden rounded-[2.3rem] border border-white/5 bg-background/80 backdrop-blur-3xl">
                  <div className="flex h-12 items-center gap-2 border-b border-white/5 bg-white/5 px-6">
                    <div className="h-2.5 w-2.5 rounded-full bg-border/20" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border/20" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border/20" />
                  </div>
                  <div className="space-y-6 p-10">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Shield
                          size={20}
                          className="text-primary/60"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-32 rounded-full bg-primary/20" />
                        <div className="h-2 w-20 rounded-full bg-primary/10" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full rounded-full bg-muted/30" />
                      <div className="h-2 w-4/5 rounded-full bg-muted/30" />
                      <div className="h-2 w-3/4 rounded-full bg-muted/30" />
                    </div>
                    <div className="flex items-end justify-between pt-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                          />
                        ))}
                      </div>
                      <div className="h-8 w-24 rounded-lg bg-primary/10" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Value Props */}
          <section className="mt-40 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <Shield
                    size={24}
                    className="text-info/60"
                  />
                ),
                title: "University Auth",
                desc: "Securely manage student data access within the protected university ecosystem.",
              },
              {
                icon: (
                  <Code
                    size={24}
                    className="text-primary/60"
                  />
                ),
                title: "Peer Documentation",
                desc: "Interactive guides and resources designed specifically for PUPT Student CAPSTONE Developers of batch 2027.",
              },
              {
                icon: (
                  <BarChart3
                    size={24}
                    className="text-secondary/60"
                  />
                ),
                title: "Machine to Machine",
                desc: "Securely integrate your applications with the PUPT ecosystem.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group relative overflow-hidden rounded-[2rem] p-10 transition-all hover:border-primary/20"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted/40">
              <Cpu className="size-4 text-muted-foreground/60" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Developer{" "}
              <span className="font-medium italic text-muted-foreground/30">
                Service
              </span>
            </span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <a
              href="https://www.pup.edu.ph/privacy/"
              target="_blank"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl px-6 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20">
            © 2026 STUDENT DATA SERVICE. ACADEMIC USE ONLY.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
