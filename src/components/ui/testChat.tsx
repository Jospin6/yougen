"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateAIResponse,
    setAIStatus,
    selectAIResponse,
    addChatHistory,
    fetchAIResponse,
    selectAIStatus,
    selectChatHistory
} from '@/features/chatSlice';
import { AppDispatch } from '@/features/store';

const TestChat = () => {
    const [message, setMessage] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const response = useSelector(selectAIResponse);
    const [displayedText, setDisplayedText] = useState('');
    const status = useSelector(selectAIStatus);
    const chatHistory = useSelector(selectChatHistory) as { role: string, content: string }[];

    useEffect(() => {
        if (status === 'succeeded' && response) {
            setDisplayedText('');
            let index = 0;

            const interval = setInterval(() => {
                if (index < response.length) {
                    setDisplayedText((prev) => prev + response.charAt(index));
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 20);

            return () => clearInterval(interval);
        }
    }, [response, status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        dispatch(addChatHistory({ role: 'user', content: message }));
        dispatch(fetchAIResponse(message));
        setMessage('');
    };

    return (
        <div className='overflow-y-auto h-screen flex flex-col'>
            <h1 className='text-white'>Chat avec l'IA</h1>
            {/* <div className='text-white'>
                {chatHistory.map((chat, index) => (
                    <p key={index}><strong>{chat.role === 'user' ? 'Vous' : 'IA'}:</strong> {chat.content}</p>
                ))}
            </div> */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écris un message..."
                />
                <button type="submit" disabled={status === 'loading'} className='text-white'>
                    Envoyer
                </button>
            </form>
            <div className='text-white'>
                {status === 'loading' && <p>Chargement...</p>}
                {status === 'succeeded' && (
                    <p style={{ whiteSpace: 'pre-line' }}>Réponse de l'IA: {displayedText}</p>
                )}
                {status === 'failed' && <p>Erreur lors de la requête.</p>}
            </div>
        </div>
    );
};

export default TestChat;
