import type { Chat, User } from '../../types';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
  currentUser: User;
  highlightTextFn?: (text: string) => React.ReactNode;
}

export function ChatListItem({ chat, isSelected, onClick, currentUser, highlightTextFn }: ChatListItemProps) {
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
  const displayName = otherParticipant ? otherParticipant.name : 'Неизвестный чат';
  const lastMessageText = chat.lastMessage?.text || 'Нет сообщений';
  const lastMessageTime = chat.lastMessage?.timestamp
    ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const previewText = lastMessageText.length > 25
    ? `${lastMessageText.substring(0, 22)}...`
    : lastMessageText;

  const avatarSrc = otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3.5 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors ${
        isSelected ? 'bg-telegram-primary-blue text-white hover:bg-telegram-dark-blue' : 'bg-white'
      }`}
      aria-current={isSelected ? "page" : undefined}
    >
      <div className="flex items-center">
        <img
          className="w-12 h-12 rounded-full mr-3 object-cover bg-gray-300 flex-shrink-0"
          src={avatarSrc}
          alt={`Аватар ${displayName}`}
          onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{highlightTextFn ? highlightTextFn(displayName) : displayName}</h3>
            {lastMessageTime && (
                <span className={`text-xs ml-2 flex-shrink-0 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>{lastMessageTime}</span>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{chat.isTyping && chat.type === 'ai' ? <span className="italic">печатает...</span> : (highlightTextFn ? highlightTextFn(previewText) : previewText)}</p>
            {chat.unreadCount && chat.unreadCount > 0 && !isSelected && (
              <span className="ml-2 bg-telegram-primary-blue text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}