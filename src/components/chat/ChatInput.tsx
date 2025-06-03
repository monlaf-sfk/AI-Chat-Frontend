import React, { useState, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSendMessage: (text: string, imageFile?: File | null) => void;
  isTyping?: boolean;
}

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedText = inputText.trim();
    if (trimmedText || imageFile) {
      onSendMessage(trimmedText, imageFile);
      setInputText('');
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const removeImage = () => setImageFile(null);

  return (
    <div className="px-2 md:px-4 py-2 md:py-3">
      {isTyping && <p className="text-xs text-gray-500 mb-1 italic animate-pulse">AI печатает...</p>}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <label className="p-2 text-gray-500 hover:text-telegram-primary-blue rounded-full cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6.75A2.25 2.25 0 0013.5 4.5h-6A2.25 2.25 0 005.25 6.75v10.5A2.25 2.25 0 007.5 19.5h9a2.25 2.25 0 002.25-2.25v-4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </label>
        <textarea
          ref={inputRef}
          rows={1}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение..."
          className="flex-grow px-2 md:px-3 py-2 md:py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-telegram-primary-blue focus:ring-1 focus:ring-telegram-primary-blue transition-colors resize-none overflow-y-auto max-h-32 text-sm md:text-base"
          disabled={isTyping}
          aria-label="Поле ввода сообщения"
        />
        <button
          type="submit"
          className="bg-telegram-primary-blue text-white p-2 md:p-2.5 rounded-full hover:bg-telegram-dark-blue transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          disabled={(!inputText.trim() && !imageFile) || isTyping}
          title="Отправить сообщение"
        >
          <PaperAirplaneIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </form>
      {imageFile && (
        <div className="mt-2 flex items-center space-x-2">
          <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border border-gray-300 shadow-sm" />
          <button onClick={removeImage} className="text-red-500 text-xs md:text-sm">Удалить</button>
        </div>
      )}
    </div>
  );
}