import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ChatList } from './features/ChatList';
import { ChatWindow } from './components/chat/ChatWindow';
import type { Chat, Message, User } from './types'; 
import { getAiResponse } from './services/aiServices';

const MOCK_CURRENT_USER: User = { id: 'user-curr', name: 'Вы', avatar: 'https://i.pravatar.cc/150?u=user-curr' };
const MOCK_AI_USER: User = { id: 'ai-bot-asst', name: 'AI Ассистент', avatar: 'https://i.pravatar.cc/150?u=ai-bot-asst' };

function App() {
  const [currentUser] = useState<User>(MOCK_CURRENT_USER);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedChats = localStorage.getItem('nf-my-social-network-chats');
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats) as Chat[];
        setChats(parsedChats);
        if (parsedChats.length > 0 && !selectedChatId) {
        }
      } catch (error) {
        console.error("Failed to parse chats from localStorage", error);
        localStorage.removeItem('nf-my-social-network-chats'); 
      }
    } else {
      const initialAiChat: Chat = {
        id: `chat-ai-${Date.now()}`,
        type: 'ai',
        participants: [currentUser, MOCK_AI_USER],
        messages: [
            {id: `msg-init-${Date.now()}`, chatId: `chat-ai-${Date.now()}`, senderId: MOCK_AI_USER.id, text: "Привет! Я ваш AI ассистент. Чем могу помочь?", timestamp: Date.now()}
        ],
        lastMessage: {id: `msg-init-${Date.now()}`, chatId: `chat-ai-${Date.now()}`, senderId: MOCK_AI_USER.id, text: "Привет! Я ваш AI ассистент. Чем могу помочь?", timestamp: Date.now()},
        isTyping: false,
        unreadCount: 1,
      };
      setChats([initialAiChat]);
    }
  }, [currentUser]); 

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('nf-my-social-network-chats', JSON.stringify(chats));
    } else {
        localStorage.removeItem('nf-my-social-network-chats');
    }
  }, [chats]);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }, []);

  const handleCreateChat = useCallback((type: 'user' | 'ai') => {
    let newChat: Chat | null = null;
    const newChatId = `chat-${Date.now()}`;

    if (type === 'ai') {
      const existingAIChat = chats.find(c => c.type === 'ai' && c.participants.some(p => p.id === MOCK_AI_USER.id));
      if (existingAIChat) {
        handleSelectChat(existingAIChat.id);
        return;
      }
      newChat = {
        id: newChatId,
        type: 'ai',
        participants: [currentUser, MOCK_AI_USER],
        messages: [],
        lastMessage: undefined,
        isTyping: false,
        unreadCount: 0,
      };
    } else {
      const newOtherUserId = `user-${Date.now().toString().slice(-6)}`;
      const newOtherUser: User = {
        id: newOtherUserId,
        name: `Собеседник ${newOtherUserId.substring(0, 3)}`,
        avatar: `https://i.pravatar.cc/150?u=${newOtherUserId}`
      };
      const existingUserChat = chats.find(c => c.type === 'user' && c.participants.some(p => p.id === newOtherUser.id));
      if (existingUserChat) {
        handleSelectChat(existingUserChat.id);
        return;
      }
      newChat = {
        id: newChatId,
        type: 'user',
        participants: [currentUser, newOtherUser],
        messages: [],
        lastMessage: undefined,
        isTyping: false,
        unreadCount: 0,
      };
    }

    if (newChat) {
        setChats(prevChats => [newChat!, ...prevChats].sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0)));
        setSelectedChatId(newChatId);
    }
  }, [currentUser, chats, handleSelectChat]);


  const handleSendMessage = useCallback(async (chatId: string, text: string, imageFile?: File | null) => {
    let newMessage: Message;
    if (imageFile) {
      newMessage = {
        id: `msg-${Date.now()}`,
        chatId,
        senderId: currentUser.id,
        text,
        timestamp: Date.now(),
        type: 'image',
        imageUrl: URL.createObjectURL(imageFile),
      };
    } else {
      newMessage = {
        id: `msg-${Date.now()}`,
        chatId,
        senderId: currentUser.id,
        text,
        timestamp: Date.now(),
        type: 'text',
      };
    }

    const targetChat = chats.find(c => c.id === chatId);

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
              isTyping: chat.type === 'ai',
            }
          : chat
      ).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
    );

    if (targetChat && targetChat.type === 'ai' && !imageFile) {
      try {
        const aiTextResponse = await getAiResponse(text);
        const aiParticipant = targetChat.participants.find(p => p.id === MOCK_AI_USER.id);
        if (!aiParticipant) return;

        const aiResponseMessage: Message = {
          id: `msg-ai-${Date.now()}`,
          chatId,
          senderId: aiParticipant.id,
          text: aiTextResponse,
          timestamp: Date.now(),
          type: 'text',
        };

        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, aiResponseMessage],
                  lastMessage: aiResponseMessage,
                  isTyping: false,
                }
              : chat
          ).sort((a,b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
        );
      } catch (error) {
        console.error("Failed to get AI response:", error);
      }
    }
  }, [currentUser, chats]);

  const showChatAreaOnMobile = !!selectedChatId;

  const handleGoBackMobile = useCallback(() => {
    setSelectedChatId(null);
  }, []);

  // Filtered chats and messages for search
  const filteredChats = chats
    .map(chat => {
      // If searching, filter messages in each chat
      if (searchTerm.trim()) {
        const filteredMessages = chat.messages.filter(
          m =>
            m.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.type === 'image' && m.imageUrl && m.imageUrl.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        // Only include chat if it has matching messages or participant name
        const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
        if (filteredMessages.length > 0 || (otherParticipant && otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return { ...chat, messages: filteredMessages.length > 0 ? filteredMessages : chat.messages };
        }
        return null;
      }
      return chat;
    })
    .filter(Boolean) as Chat[];

  const selectedChatData = filteredChats.find(chat => chat.id === selectedChatId);

  const sidebarContent = (
    <ChatList
      chats={filteredChats}
      selectedChatId={selectedChatId}
      onSelectChat={handleSelectChat}
      onCreateChat={handleCreateChat}
      currentUser={currentUser}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );

  const chatAreaContent = selectedChatData ? (
    <ChatWindow
      chat={selectedChatData}
      currentUser={currentUser}
      onSendMessage={handleSendMessage}
      onGoBack={handleGoBackMobile}
      searchTerm={searchTerm}
    />
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-500 bg-telegram-bg-secondary">
      <img src="/telegram-logo.svg" alt="Telegram Clone" className="w-24 h-24 mx-auto mb-4 opacity-30" />
      <p className="text-lg">Выберите чат для начала общения</p>
      <p className="text-sm mt-1">или создайте новый, используя кнопки слева.</p>
    </div>
  );

  return (
    <MainLayout
      sidebar={sidebarContent}
      chatArea={chatAreaContent}
      showChatAreaOnMobile={showChatAreaOnMobile}
    />
  );
}

export default App;