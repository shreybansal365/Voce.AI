import axios from "axios";

export const getToken=async()=>{
    const result = await axios.get('/api/getToken');
    return result.data;
}

export const AIModel = async (topic, coachingOption, msg) => {
  try {
    const res = await axios.post("/api/sendToAI", { topic, coachingOption, msg });
    return res.data;
  } catch (err) {
    console.error("AI request failed:", err);
    throw err;
  }
};

export const AIModelFeedback = async (coachingOption, conversation) => {
  try {
    // Convert conversation array into a single string
    const msg = conversation
      .map(m => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    const res = await axios.post("/api/sendToAIFeedback", { coachingOption, msg });
    return res.data;
  } catch (err) {
    console.error("AI request failed:", err);
    throw err;
  }
};
