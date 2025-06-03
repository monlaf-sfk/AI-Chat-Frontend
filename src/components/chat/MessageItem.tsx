import type { Message, User } from '../../types'; 
import clsx from 'clsx';

interface MessageItemProps {
  message: Message;
  currentUser: User;
}

export function MessageItem({ message, currentUser }: MessageItemProps) {
  const isCurrentUserSender = message.senderId === currentUser.id;
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={clsx('flex mb-2', isCurrentUserSender ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'py-2 px-3 md:py-2.5 md:px-4 rounded-lg max-w-[90%] sm:max-w-[70%] md:max-w-[60%] break-words shadow-sm flex flex-col items-center',
          isCurrentUserSender
            ? 'bg-telegram-message-out text-telegram-text-primary rounded-br-none'
            : 'bg-telegram-message-in text-telegram-text-primary rounded-bl-none'
        )}
      >
        {message.type === 'image' && message.imageUrl && (
          <img src={message.imageUrl} alt="sent" className="mb-2 max-w-full max-h-48 md:max-h-60 rounded border border-gray-200 shadow-sm" />
        )}
        {message.text && (
          <p className="text-sm md:text-base whitespace-pre-wrap w-full text-center break-words">{message.text}</p>
        )}
        <div className="text-right w-full">
          <span className={clsx(
            'text-xs md:text-sm mt-1 opacity-70',
            isCurrentUserSender ? 'text-green-900' : 'text-gray-500'
          )}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}