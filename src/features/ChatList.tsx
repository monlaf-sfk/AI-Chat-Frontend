import React from 'react';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { ChatListItem } from '../components/chat/ChatListItem';
import type { Chat, User } from '../types';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (type: 'user' | 'ai') => void;
  currentUser: User;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function highlightText(text: string, highlight: string) {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 text-black rounded px-1">{part}</span>
    ) : (
      part
    )
  );
}

export function ChatList({ chats, selectedChatId, onSelectChat, onCreateChat, currentUser, searchTerm, setSearchTerm }: ChatListProps) {
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
    const lastMessageText = chat.lastMessage?.text?.toLowerCase() || '';
    return (
      otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMessageText.includes(searchTerm.toLowerCase())
    );
  }).sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-full md:max-w-[400px] mx-auto shadow-lg rounded-lg md:rounded-none md:shadow-none transition-all duration-300">
      <div className="p-3 border-b border-telegram-border-color sticky top-0 bg-white z-10">
        <div className="relative mb-2 flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск по чатам или сообщениям"
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-telegram-primary-blue focus:ring-1 focus:ring-telegram-primary-blue transition-colors shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Поиск по чатам"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setSearchTerm('')}
              aria-label="Очистить поиск"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex space-x-2">
            <button
              onClick={() => onCreateChat('user')}
              className="flex-1 bg-telegram-primary-blue text-white px-3 py-1.5 rounded-md text-sm hover:bg-telegram-dark-blue transition flex items-center justify-center"
              title="Создать новый чат с пользователем"
            >
              <UserPlusIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              Новый (User)
            </button>
            <button
              onClick={() => onCreateChat('ai')}
              className="flex-1 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600 transition flex items-center justify-center"
              title="Создать новый чат с AI ассистентом"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 flex-shrink-0">
                <path d="M12 2a2.5 2.5 0 00-2.5 2.5v0A2.5 2.5 0 0012 7a2.5 2.5 0 002.5-2.5v0A2.5 2.5 0 0012 2zM7.738 9.23A8.002 8.002 0 002.25 16.004v1.129A2.25 2.25 0 004.5 19.383h15a2.25 2.25 0 002.25-2.25v-1.129a8.002 8.002 0 00-5.488-6.774.75.75 0 00-.575.016 9.498 9.498 0 00-7.375 0 .75.75 0 00-.575-.016z" />
              </svg>
              Новый (AI)
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {chats.length === 0 && searchTerm && (
          <p className="p-4 text-center text-gray-500">Нет сообщений или чатов по запросу "{searchTerm}".</p>
        )}
        {chats.length === 0 && !searchTerm && (
             <p className="p-6 text-center text-gray-500 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.862-8.25 8.625-8.25S21 7.444 21 12z" />
                </svg>
                У вас пока нет чатов. <br/>Создайте новый!
            </p>
        )}
        {chats.map(chat => {
          const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
          const displayName = otherParticipant ? otherParticipant.name : 'Неизвестный чат';
          const lastMessageText = chat.lastMessage?.text || 'Нет сообщений';
          return (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
              currentUser={currentUser}
              highlightTextFn={searchTerm ? (text: string) => highlightText(text, searchTerm) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}