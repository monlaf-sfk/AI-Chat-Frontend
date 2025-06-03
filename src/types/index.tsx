export interface User {
    id: string;           
    name: string;         
    avatar?: string;      
    isOnline?: boolean;   
  }
  
  export interface Message {
    id: string;           
    chatId: string;       
    senderId: string;     
    text: string;         
    timestamp: number;    
    status?: 'sent' | 'delivered' | 'read'; 
    type?: 'text' | 'image' | 'file';      
    imageUrl?: string;     
    fileName?: string;     
    fileUrl?: string;      
    replyToMessageId?: string;  
  }
  
  export type ChatType = 'user' | 'ai';
  
  export interface Chat {
    id: string;                      
    type: ChatType;                  
    participants: User[];            
                                     
    messages: Message[];             
    lastMessage?: Message;           
    unreadCount?: number;            
    isTyping?: boolean;              
    name?: string;                   
    createdAt?: number;              
  }