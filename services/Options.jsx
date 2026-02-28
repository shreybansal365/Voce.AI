export const ExpertList = [
    {
        name: 'Socratic Seminar',
        description: 'Engage in a deep, interactive learning session where the AI guides you through complex topics using the Socratic method of questioning.',
        example: 'Quantum Physics concepts for high school students...',
        icon: '/lecture.png',
        prompt: 'You are a Socratic tutor teaching {user_topic}. Do not just lecture; instead, ask thought-provoking questions to lead the user to discover the answers themselves. Keep responses under 120 characters and always end with a question that requires them to speak back.',
        summeryPrompt: 'As per conversation generate structured study notes and key takeaways based on the concepts discussed.',
        abstract: '/ab1.png'
    },
    {
        name: 'Mock Interview',
        description: 'Practice for your dream job with industry-standard interview simulations and real-time performance feedback.',
        example: 'Senior React Developer role at a tech firm...',
        icon: '/interview.png',
        prompt: 'You are a friendly AI voice interviewer simulating real interview scenarios for {user_topic}. Ask structured, industry-relevant questions and provide constructive feedback. Keep responses clear, professional, and under 120 characters. One question at a time.',
        summeryPrompt: 'Identify key strengths and areas for improvement in the user\'s interview performance based on the transcript.',
        abstract: '/ab2.png'
    },
    {
        name: 'Ques Ans Prep',
        description: 'Master any subject by challenging yourself with interactive quizzes and detailed explanatory feedback.',
        example: 'Organic Chemistry mechanisms and functional groups...',
        icon: '/qa.png',
        prompt: 'You are an AI tutor conducting a quiz-style session on {user_topic}. Ask precise questions to test the user\'s knowledge. If they get it wrong, provide a hint and ask them to try again. Keep responses highly interactive and under 120 characters.',
        summeryPrompt: 'List the questions asked and the user\'s accuracy, highlighting concepts that need more review.',
        abstract: '/ab3.png'
    },
    {
        name: 'Learn Language',
        description: 'Accelerate your fluency through voice-based conversation practice and real-time grammar coaching.',
        example: 'Conversational Spanish for a business trip to Madrid...',
        icon: '/language.png',
        prompt: 'You are a language coach helping users practice {user_topic}. Engage them in a simple conversation and periodically check their pronunciation or grammar. Keep responses friendly, encouraging, and under 120 characters.',
        summeryPrompt: 'Generate a list of new vocabulary words and grammar corrections discussed during the session.',
        abstract: '/ab4.png'
    },
    {
        name: 'Debate Arena',
        description: 'Sharpen your critical thinking by engaging in structured verbal debates against a logical AI opponent.',
        example: 'The ethical implications of universal basic income...',
        icon: '/debate.png',
        prompt: 'You are a world-class debater taking a counter-position on {user_topic}. Challenge the user\'s arguments with logic and evidence. Force them to defend their stance. Keep responses sharp, respectful, and under 120 characters. End with a "Refute that" challenge.',
        summeryPrompt: 'Summarize the core arguments from both sides and evaluate the strength of the user\'s persuasive speaking.',
        abstract: '/ab5.png'
    }
];

export const CoachingExpert=[
    {
        name:'Joanna',
        avatar: '/t1.avif',
        introText: "I'm Joanna! I focus on building your confidence through warm, encouraging feedback. Let's grow together.",
        voiceTarget: 'Samantha',
        gender: 'female'
    },
    {
        name:'Sallie',
        avatar: '/t2.jpg',
        introText: "I'm Sallie. I provide rigorous, industry-standard coaching to ensure your performance is truly elite.",
        voiceTarget: 'Victoria',
        gender: 'female'
    },
    {
        name:'Mat',
        avatar: '/t3.jpg',
        introText: "Hey, I'm Mat. I use logic and analytical feedback to sharpen your arguments and clarify your thoughts.",
        voiceTarget: 'Daniel',
        gender: 'male'
    },
]