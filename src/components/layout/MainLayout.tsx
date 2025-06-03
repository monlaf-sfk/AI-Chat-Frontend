import React from 'react';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  chatArea: React.ReactNode;
  showChatAreaOnMobile: boolean;
}

export function MainLayout({ sidebar, chatArea, showChatAreaOnMobile }: MainLayoutProps) {
  return (
    <div className="flex h-screen antialiased text-gray-800 bg-telegram-bg-secondary w-full max-w-full">
      <div className={`
        flex flex-col w-full md:w-80 bg-white border-r border-telegram-border-color
        transition-all duration-300 ease-in-out
        ${showChatAreaOnMobile ? 'hidden md:flex' : 'flex'}
        min-h-0
      `}>
        {sidebar}
      </div>

      <div className={`
        flex flex-col flex-auto h-full w-full
        transition-all duration-300 ease-in-out
        ${showChatAreaOnMobile ? 'flex' : 'hidden md:flex'}
        min-h-0
      `}>
        {chatArea}
      </div>
    </div>
  );
}