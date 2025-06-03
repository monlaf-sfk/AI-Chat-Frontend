import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { ArrowLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import type { Chat, Message, User } from '../../types';
import { MessageItem } from '../../components/chat/MessageItem';
import { ChatInput } from '../../components/chat/ChatInput';

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  onSendMessage: (chatId: string, text: string, imageFile?: File | null) => void;
  onGoBack?: () => void;
  searchTerm?: string;
}

export function ChatWindow({ chat, currentUser, onSendMessage, onGoBack, searchTerm }: ChatWindowProps) {
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
  const messagesContainerRef = useRef<HTMLDivElement>(null);  
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
        const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 100; 
        
        if (isScrolledToBottom || chat.messages.some(msg => msg.senderId === currentUser.id && (Date.now() - msg.timestamp < 2000))) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [chat.messages, chat.id, currentUser.id]);


  const handleSendMessage = (text: string, imageFile?: File | null) => {
    onSendMessage(chat.id, text, imageFile);
  };

  if (!otherParticipant) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-telegram-bg-secondary p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <h2 className="text-xl font-semibold mb-1">Ошибка загрузки чата</h2>
            <p className="text-center">Не удалось найти информацию о собеседнике. Попробуйте выбрать другой чат.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-full md:rounded-none md:shadow-none rounded-lg shadow-lg transition-all duration-300">
      <div className="bg-white border-b border-telegram-border-color px-2 md:px-4 py-2 md:py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center min-w-0"> {/* min-w-0 для родителя с truncate */}
            {onGoBack && (
                <button
                    onClick={onGoBack}
                    className="mr-2 p-2 -ml-2 md:hidden text-gray-600 hover:text-telegram-primary-blue rounded-full hover:bg-blue-50 transition"
                    aria-label="Назад к списку чатов"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            )}
            <img
              className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-200 flex-shrink-0"
              src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random&color=fff`}
              alt={`Аватар ${otherParticipant.name}`}
              onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random&color=fff`)}
            />
            <div className="flex-grow min-w-0">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate">{otherParticipant.name}</h2>
              {chat.type === 'user' && otherParticipant.isOnline && (
                <p className="text-xs text-green-500">онлайн</p>
              )}
              {chat.type === 'ai' && (
                <p className="text-xs text-telegram-primary-blue">AI Ассистент</p>
              )}
              {chat.type === 'user' && !otherParticipant.isOnline && (
                <p className="text-xs text-gray-400">не в сети</p>
              )}
            </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-telegram-primary-blue rounded-full hover:bg-blue-50 transition" aria-label="Опции чата">
            <EllipsisVerticalIcon className="w-6 h-6" />
        </button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-2 md:p-4 space-y-1 bg-telegram-bg-secondary flex flex-col justify-end min-h-0">
        {chat.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.862-8.25 8.625-8.25S21 7.444 21 12z" />
                </svg>
                <p>Нет сообщений в этом чате.</p>
                <p className="text-sm">Начните диалог, отправив первое сообщение!</p>
            </div>
        )}
        {chat.messages.map(msg => (
          <MessageItem key={msg.id} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-telegram-border-color px-2 md:px-4">
        <ChatInput onSendMessage={handleSendMessage} isTyping={chat.isTyping} />
      </div>
    </div>
  );
}