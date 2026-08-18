import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { postChatMessage } from '../services/api';

export const useChat = () => {
  const { sessionId } = useSession();

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      type: 'text',
      text: "SYSTEM: FINBOT QUANTITATIVE ENGINE INITIALIZED. Enter your investment parameters (e.g. 'Invest 500,000 INR with medium risk profile') or select from prompt presets below.",
      data: null,
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    const userMsg = {
      from: 'user',
      type: 'text',
      text: userMessage,
      data: null
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await postChatMessage(userMessage, sessionId);
      const botMsg = {
        from: 'bot',
        type: res.response_type,
        text: res.content,
        data: res.portfolio_data
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg = {
        from: 'bot',
        type: 'text',
        text: "ERROR: Connection timeout to Quantitative API. Re-engaging fallback rules.",
        data: null
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};
