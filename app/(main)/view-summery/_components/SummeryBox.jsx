import React from "react";
import ReactMarkdown from "react-markdown";

function ScoreCard({ label, score, color }) {
  const percentage = (score / 10) * 100;
  return (
    <div className="glass-card p-5 space-y-3 flex-1 min-w-[200px]">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-xs uppercase font-bold tracking-widest">{label}</span>
        <span className={`text-2xl font-bold font-outfit ${color}`}>{score}/10</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%`, backgroundColor: `oklch(from var(--primary) l c h)` }}
        ></div>
      </div>
    </div>
  );
}

function SummeryBox({ summery }) {
  let data = null;
  let isLegacy = false;

  try {
    // Attempt to parse if it's a JSON string, otherwise use as object
    data = typeof summery === 'string' ? JSON.parse(summery) : summery;
    if (!data.scores) throw new Error("Missing scores");
  } catch (e) {
    isLegacy = true;
  }

  if (!summery) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isLegacy ? (
        <div className="glass-card p-8 leading-relaxed text-white/80">
          <ReactMarkdown>{summery}</ReactMarkdown>
        </div>
      ) : (
        <>
          {/* Performance Overview */}
          <div className="flex flex-wrap gap-4">
            <ScoreCard label="Fluency" score={data.scores.fluency} color="text-blue-400" />
            <ScoreCard label="Vocabulary" score={data.scores.vocabulary} color="text-purple-400" />
            <ScoreCard label="Grammar" score={data.scores.grammar} color="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feedback Corner */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Expert Feedback</h3>
              <p className="text-white/90 text-sm leading-relaxed italic border-l-2 border-primary/30 pl-4">
                "{data.overall_feedback}"
              </p>
              <div className="bg-white/5 p-4 rounded-2xl">
                 <h4 className="text-white/40 text-[10px] uppercase font-bold mb-2">Pacing Advice</h4>
                 <p className="text-xs text-white/70">{data.pacing_advice}</p>
              </div>
            </div>

            {/* Suggested Improvements */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Growth Plan</h3>
              <ul className="space-y-3">
                {data.suggested_improvements?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-white/80">
                    <span className="text-primary font-bold mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best Response Highlight */}
          <div className="glass-card p-6 border-primary/20 bg-primary/5">
             <h3 className="text-amber-400 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                <span className="text-lg">⭐</span> Highlight of the Session
             </h3>
             <p className="text-white/90 font-medium leading-relaxed">
                {data.best_response}
             </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SummeryBox;
