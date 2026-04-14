'use client';

import Link from 'next/link';
import { useUser } from "@stackframe/stack";
import { Mic, Brain, BarChart3, ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="glass-card p-8 group hover:bg-white/[0.03] transition-all duration-500">
    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
      <Icon className="text-primary w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 font-outfit tracking-tight">{title}</h3>
    <p className="text-white/40 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function LandingPage() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-inter overflow-x-hidden">
      {/* Technical Background */}
      <div className="fixed inset-0 bg-grid-white -z-10 opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-radial from-primary/10 via-background to-background -z-20"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tighter">Voce.AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all flex items-center gap-2">
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <Link href="/handler/sign-in" className="px-5 py-2 rounded-full bg-primary hover:bg-primary/80 text-sm font-bold transition-all shadow-lg shadow-primary/20">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles size={14} className="animate-pulse" />
                The Future of Language Mastery
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold font-outfit tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Master Any Skill through <br />
                <span className="bg-gradient-to-r from-primary via-indigo-400 to-purple-500 bg-clip-text text-transparent">Spoken Intelligence.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-white/40 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Engage in fluid, real-time conversations with specialized AI Experts. Practice interviews, learn languages, or explore complex topics with native-speed feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Link 
                    href={user ? "/dashboard" : "/handler/sign-up"} 
                    className="px-8 py-4 rounded-full bg-primary hover:bg-primary/80 text-lg font-bold transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 active:scale-95 group"
                >
                    {user ? "Continue Journey" : "Start Session Free"}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Platform Stats */}
            <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2 justify-center"><Globe size={20}/> <span className="text-sm font-bold tracking-widest uppercase">Global Edge</span></div>
                <div className="flex items-center gap-2 justify-center"><Brain size={20}/> <span className="text-sm font-bold tracking-widest uppercase">Neural Core</span></div>
                <div className="flex items-center gap-2 justify-center"><Shield size={20}/> <span className="text-sm font-bold tracking-widest uppercase">Secure Grid</span></div>
                <div className="flex items-center gap-2 justify-center"><Sparkles size={20}/> <span className="text-sm font-bold tracking-widest uppercase">Zero Latency</span></div>
            </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
              <div className="mb-20 space-y-4">
                  <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-sm">Capabilities</h2>
                  <h3 className="text-4xl md:text-5xl font-bold font-outfit">Built for High Performance.</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={Mic}
                    title="Spoken Fluency"
                    description="Real-time speech-to-text with word-level latency. Experience the fastest conversation cycle in educational AI."
                  />
                  <FeatureCard 
                    icon={Brain}
                    title="Deep Analytical Feedback"
                    description="Get scored on Vocabulary, Grammar, and Fluency using our custom Speech-Analysis-Protocol."
                  />
                  <FeatureCard 
                    icon={BarChart3}
                    title="IELTS Calibration"
                    description="Professional-grade evaluation metrics designed to mimic real-world academic and professional standards."
                  />
              </div>
          </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="glass-card p-12 md:p-20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000"></div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit max-w-2xl mx-auto">Ready to break the barriers of traditional learning?</h2>
                    <p className="text-white/40 max-w-lg mx-auto">Join the new standard of AI-driven voice coaching. No placeholders, no latency, just intelligence.</p>
                    <Link 
                        href="/handler/sign-up" 
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95"
                    >
                        Initialize Account <ArrowRight size={20}/>
                    </Link>
                </div>
             </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5" />
            <span className="text-lg font-bold font-outfit tracking-tighter">Voce.AI</span>
          </div>
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
            © 2026 Voce AI. The Future of Spoken Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}