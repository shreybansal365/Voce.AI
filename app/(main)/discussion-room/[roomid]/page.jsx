"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import { AIModel, AIModelFeedback } from "@/services/GlobalServices";
import Image from "next/image";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function DiscussionRoom() {
  const { roomid } = useParams();
  const router = useRouter();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  const [expert, setExpert] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("Ready to listen...");
  const [chatHistory, setChatHistory] = useState([]);
  const [messageQueue, setMessageQueue] = useState([]);
  const [enableFeedback, setEnableFeedback] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const UpdateSummery = useMutation(api.DiscussionRoom.UpdateSummery);
  const UpdateUsageStats = useMutation(api.DiscussionRoom.UpdateUsageStats);

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const cleanText = (text) => {
    let cleaned = text.replace(/<\｜begin▁of▁sentence\｜>/g, "");
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, "");
    return cleaned.trim();
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    const voices = synth.getVoices();
    
    if (voices.length > 0 && expert) {
        const femaleKeywords = ["Samantha", "Victoria", "Karen", "Moira", "Tessa", "Zira", "Female", "Woman", "Google US English", "Premium"];
        const maleKeywords = ["Alex", "Daniel", "Fred", "Rishi", "David", "Male", "Man", "Google UK English Male", "Premium"];

        let targetVoice = null;

        if (expert.voiceTarget) {
            targetVoice = voices.find(v => v.name.includes(expert.voiceTarget));
        }

        if (!targetVoice) {
            const candidates = expert.gender === 'female' ? femaleKeywords : maleKeywords;
            for (const keyword of candidates) {
                targetVoice = voices.find(v => v.name.includes(keyword) && v.lang.startsWith('en'));
                if (targetVoice) break;
            }
        }

        if (!targetVoice) {
            const genderHint = expert.gender === 'female' ? "female" : "male";
            targetVoice = voices.find(v => v.name.toLowerCase().includes(genderHint) && v.lang.startsWith('en'));
        }
        
        if (targetVoice) utterance.voice = targetVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synth.cancel();
    synth.speak(utterance);
  };

  useEffect(() => {
    if (messageQueue.length === 0) return;
    const processQueue = async () => {
      const nextMessage = messageQueue[0];
      try {
        const completion = await AIModel(nextMessage.topic, nextMessage.coachingOption, nextMessage.msg);
        let aiReply = completion?.choices?.[0]?.message?.content || "No response from AI.";
        aiReply = cleanText(aiReply);
        setChatHistory(prev => [...prev, { sender: "ai", text: aiReply }]);
        if (DiscussionRoomData?._id && completion?.usage) {
          await UpdateUsageStats({ id: DiscussionRoomData._id, usage: completion.usage });
        }
        speakText(aiReply);
      } catch (err) {
        setChatHistory(prev => [...prev, { sender: "ai", text: "⚠️ Connection error." }]);
      } finally {
        setMessageQueue(prev => prev.slice(1));
      }
    };
    processQueue();
  }, [messageQueue]);

  const sendToAI = (message) => {
    if (!DiscussionRoomData) return;
    const topic = DiscussionRoomData?.topic || "General";
    const coachingOption = DiscussionRoomData?.coachingOptions;
    setMessageQueue(prev => [...prev, { topic, coachingOption, msg: message }]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("Listening...");
    } catch (err) {
      alert("Microphone access required.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (blob) => {
    setIsTranscribing(true);
    setTranscript("Analyzing your speech...");
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    try {
      const res = await axios.post("/api/transcribe", formData);
      const text = res.data.text;
      setTranscript(text || "Repeat that please?");
      if (text && text.trim().length > 0) {
        setChatHistory(prev => [...prev, { sender: "user", text }]);
        sendToAI(text);
      }
    } catch (err) {
      setTranscript("Transcription failed.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const finalizeSession = async () => {
    if (DiscussionRoomData) {
      await UpdateConversation({ id: DiscussionRoomData._id, conversation: chatHistory });
    }
    setEnableFeedback(true);
  };

  const sendFeedback = async () => {
    if (!DiscussionRoomData) return;
    setIsGeneratingReport(true);
    try {
      const feedbackResponse = await AIModelFeedback(DiscussionRoomData.coachingOptions, chatHistory);
      const content = feedbackResponse?.analysis || feedbackResponse?.choices?.[0]?.message?.content;
      await UpdateSummery({ id: DiscussionRoomData._id, summery: content });
      if (feedbackResponse?.usage) {
        await UpdateUsageStats({ id: DiscussionRoomData._id, usage: feedbackResponse.usage });
      }
      
      // Navigate directly to the newly generated report
      router.push('/view-summery/' + DiscussionRoomData._id);
    } catch (err) {
      alert("failed to generate feedback.");
      setIsGeneratingReport(false);
    }
  };

  if (!DiscussionRoomData || !expert) {
    return (
        <div className="h-[85vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 animate-pulse">
                <Sparkles className="text-primary w-8 h-8" />
            </div>
            <div className="text-center">
                <h2 className="text-white font-bold font-outfit text-xl tracking-tight">Booting Intelligence...</h2>
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] mt-2">Synchronizing Neural Canvas</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto -mt-6 h-[85vh] flex flex-col gap-6">
      {/* Room Header */}
      <div className="flex justify-between items-center px-4">
        <div>
           <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-1">{DiscussionRoomData?.coachingOptions}</h2>
           <h1 className="text-2xl font-bold font-outfit text-white">{DiscussionRoomData?.topic}</h1>
        </div>
        <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-white/40 text-xs font-medium uppercase tracking-tighter">Live Session</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Main Stage (Expert) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-1 glass-card flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className={`absolute -inset-8 bg-primary/20 blur-3xl rounded-full transition-all duration-1000 ${isRecording ? 'opacity-100 scale-125 pulse' : 'opacity-0 scale-50'}`}></div>
                <Image
                  src={expert?.avatar}
                  alt="Avatar"
                  width={200}
                  height={150}
                  className={`h-32 w-32 rounded-full object-cover relative ring-4 ring-white/10 ${isRecording ? "animate-pulse" : ""}`}
                />
              </div>
              
              <h2 className="text-white text-xl font-bold font-outfit tracking-wide">{expert?.name}</h2>
              <p className="text-white/40 text-sm italic uppercase tracking-tighter mt-1">AI Coach Specialist</p>

              {/* Status Bar */}
              <div className="mt-12 glass px-6 py-4 rounded-2xl border border-white/5 max-w-[80%] text-center">
                 <p className={`text-sm ${isTranscribing ? "text-primary italic animate-pulse" : "text-white/60"}`}>
                    {transcript}
                 </p>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="glass-card p-4 flex gap-4 items-center justify-center border-primary/20">
            {!isRecording ? (
              <>
                <button 
                  onClick={startRecording} 
                  disabled={isTranscribing} 
                  className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                   <div className="w-2 h-2 bg-white rounded-full"></div> Start Speaking
                </button>
                {chatHistory.length > 0 && (
                  <button onClick={finalizeSession} className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white/80 font-bold text-sm transition-all">
                    End Session
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={stopRecording} 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-red-500/20 transition-all flex items-center gap-3 animate-pulse"
              >
                <div className="w-2 h-2 bg-white rounded-sm"></div> Stop & Analyze
              </button>
            )}

            {enableFeedback && (
              <button 
                onClick={sendFeedback} 
                disabled={isGeneratingReport}
                className={`text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl transition-all ml-4 flex items-center gap-2 ${isGeneratingReport ? 'bg-amber-600/50 cursor-not-allowed shadow-none border border-amber-600/30' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'}`}
              >
                 {isGeneratingReport ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating Insight...</>
                 ) : (
                    <>✨ Generate Report</>
                 )}
              </button>
            )}
          </div>
        </div>

        {/* Conversation Feed */}
        <div className="hidden lg:flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 glass-card p-4 overflow-y-auto space-y-4">
             {chatHistory.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full mb-3 flex items-center justify-center text-xl">💬</div>
                  <p className="text-white/30 text-xs font-medium uppercase tracking-widest leading-relaxed">Dialogue Log will appear here</p>
               </div>
             ) : (
               chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-3xl max-w-[90%] text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === "user"
                    ? "ml-auto bg-primary/20 border border-primary/20 text-white rounded-tr-none"
                    : "mr-auto bg-white/5 border border-white/5 text-white/80 rounded-tl-none"
                  }`}
                >
                  <p className="font-bold text-[10px] uppercase tracking-tighter opacity-40 mb-1">
                    {msg.sender === "user" ? "You" : expert?.name}
                  </p>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
               ))
             )}
          </div>
          <p className="text-[10px] text-white/20 text-center uppercase tracking-widest font-bold">Encrypted Session</p>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
