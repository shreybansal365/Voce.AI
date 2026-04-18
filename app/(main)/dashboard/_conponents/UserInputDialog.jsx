import React, { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/app/_context/UserContext'
import { Volume2 } from 'lucide-react'

function UserInputDialog({ children, ExpertList }) {
    const [selectedExpert, setSelectedExpert] = useState();
    const [topic, setTopic] = useState("");
    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

    const [loading, setLoading] = useState(false);
    const[openDialog, setOpenDialog] = useState(false);
    const router = useRouter();
    const {userData}=useContext(UserContext);

    const playVoicePreview = (expert) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(expert.introText);
        const voices = synth.getVoices();
        
        // Define strict gender-matched candidates for better cross-browser compatibility
        const femaleKeywords = ["Samantha", "Victoria", "Karen", "Moira", "Tessa", "Zira", "Female", "Woman", "Google US English", "Premium"];
        const maleKeywords = ["Alex", "Daniel", "Fred", "Rishi", "David", "Male", "Man", "Google UK English Male", "Premium"];

        let targetVoice = null;

        // 1. Try to find the exact target voice if specified
        if (expert.voiceTarget) {
            targetVoice = voices.find(v => v.name.includes(expert.voiceTarget));
        }

        // 2. If not found or not specified, use strict gender filtering
        if (!targetVoice) {
            const candidates = expert.gender === 'female' ? femaleKeywords : maleKeywords;
            
            // Try to find the best match from our candidate list
            for (const keyword of candidates) {
                targetVoice = voices.find(v => v.name.includes(keyword) && v.lang.startsWith('en'));
                if (targetVoice) break;
            }
        }

        // 3. Last resort: Find ANY voice that contains gender hints in its metadata
        if (!targetVoice) {
            const genderHint = expert.gender === 'female' ? "female" : "male";
            targetVoice = voices.find(v => v.name.toLowerCase().includes(genderHint) && v.lang.startsWith('en'));
        }
        
        if (targetVoice) utterance.voice = targetVoice;
        
        // Ensure settings are crisp for coaching
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Stop any current speech before previewing
        synth.cancel();
        synth.speak(utterance);
    };

    const OnClickNext= async () => {
        if (!userData?._id || !topic || !selectedExpert) return;
        
        setLoading(true);
        try {
            const result = await createDiscussionRoom({
                topic:topic,
                coachingOptions: ExpertList?.name,
                expertName: selectedExpert,
                uid:userData?._id
            });
            // Deliberately keeping the dialog open and loading state true during router push 
            // This prevents the jarring "flash" to the dashboard before the room page initializes.
            router.push('/discussion-room/'+result);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const isNextDisabled = loading || !userData?._id || !topic.trim() || !selectedExpert;

    return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="glass-panel border-white/5 ring-1 ring-white/10">
            <DialogHeader>
            <DialogTitle className="text-white font-outfit text-2xl font-bold tracking-tight">{ExpertList.name}</DialogTitle>
            <p className='text-white/40 text-sm mt-2 leading-relaxed max-w-md'>
                {ExpertList.description}
            </p>
            <DialogDescription asChild>
                <div className='mt-6 space-y-8'>
                    <div className="space-y-3">
                        <h2 className='text-white/70 font-medium text-sm uppercase tracking-widest'>1. Master your skill</h2>
                        <div className="relative group">
                            <Textarea 
                                placeholder={`e.g. ${ExpertList.example}`} 
                                className='mt-2 bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 rounded-2xl min-h-[100px] focus:border-primary/50 focus:bg-white/[0.08] transition-all resize-none' 
                                onChange={(e) => setTopic(e.target.value)} 
                            />
                        </div>
                    </div>
                
                    <div className="space-y-4">
                        <h2 className='text-white/70 font-medium text-sm uppercase tracking-widest'>2. Select AI Persona</h2>
                        <div className='grid grid-cols-3 gap-4'>
                        {CoachingExpert.map((expert, index) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    setSelectedExpert(expert.name);
                                    playVoicePreview(expert);
                                }}
                                className={`relative p-3 rounded-3xl border transition-all cursor-pointer group flex flex-col items-center gap-2 ${selectedExpert === expert.name ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                            >
                                <div className="relative">
                                    <Image
                                        src={expert.avatar}
                                        alt={expert.name}
                                        width={80}
                                        height={80}
                                        className='rounded-2xl h-[60px] w-[60px] object-cover border border-white/10'
                                    />
                                    {selectedExpert === expert.name && (
                                        <div className="absolute -top-1 -right-1 bg-primary p-1 rounded-full text-white shadow-lg">
                                            <Volume2 size={12} />
                                        </div>
                                    )}
                                </div>
                                <h2 className={`text-xs font-bold ${selectedExpert === expert.name ? 'text-primary' : 'text-white/50'}`}>{expert.name}</h2>
                            </div> 
                        ))}
                        </div>
                    </div>

                    <div className='flex justify-end pt-4'>
                        <button 
                            disabled={isNextDisabled}
                            onClick={OnClickNext}
                            className={`px-10 py-3 rounded-full font-bold text-sm transition-all shadow-lg ${isNextDisabled ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20'}`}
                        >
                            {loading ? 'Booting Canvas...' : 'Initialize Session'}
                        </button>
                    </div>
                
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default UserInputDialog
