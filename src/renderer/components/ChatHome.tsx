import React from 'react';
import { ChatHeaderBar, TurnItem } from './ChatHeaderBar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatMessage, ThemeMode } from '../types';

export interface ChatHomeProps {
  title: string;
  turns: TurnItem[];
  activeTurnIndex: number;
  onSelectTurn: (turnIndex: number) => void;
  onToggleContents: () => void;
  hasMessages: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isLeftSidebarVisible: boolean;
  onToggleLeftSidebar: () => void;
  onOpenAuthModal: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  onSelectPrompt: (text: string) => void;
  onSendMessage: (text: string) => void;
  inputDisabled: boolean;
  inputStreaming: boolean;
  onAbort: () => void;
  isLocked?: boolean;
}

export const ChatHome: React.FC<ChatHomeProps> = ({
  title,
  turns,
  activeTurnIndex,
  onSelectTurn,
  onToggleContents,
  hasMessages,
  theme,
  onToggleTheme,
  isLeftSidebarVisible,
  onToggleLeftSidebar,
  onOpenAuthModal,
  messages,
  isLoading,
  isStreaming,
  onSelectPrompt,
  onSendMessage,
  inputDisabled,
  inputStreaming,
  onAbort,
  isLocked = false,
}) => {
  return (
    <>
      <ChatHeaderBar
        title={title}
        turns={turns}
        activeTurnIndex={activeTurnIndex}
        onSelectTurn={onSelectTurn}
        onToggleContents={onToggleContents}
        hasMessages={hasMessages}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isLeftSidebarVisible={isLeftSidebarVisible}
        onToggleLeftSidebar={onToggleLeftSidebar}
        onOpenAuthModal={onOpenAuthModal}
      />

      <div className="chat-card-body">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onSelectPrompt={isLocked ? undefined : onSelectPrompt}
          isLocked={isLocked}
        />
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        disabled={inputDisabled || isLocked}
        isStreaming={inputStreaming}
        onAbort={onAbort}
        isLocked={isLocked}
      />
    </>
  );
};

export default ChatHome;
