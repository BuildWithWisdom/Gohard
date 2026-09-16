import React from 'react';
import { ChatHeaderBar } from './ChatHeaderBar';
import { LessonWorkspace } from './LessonWorkspace';
import { ThemeMode } from '../types';

export interface LessonViewProps {
  title: string;
  hasMessages: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isLeftSidebarVisible: boolean;
  onToggleLeftSidebar: () => void;
  onOpenAuthModal: () => void;
  onSelectTurn: (turnIndex: number) => void;
  onToggleContents: () => void;
  lessonId: string;
  initialHasContent?: boolean;
  lessonTitle?: string;
  cachedMarkdown?: string;
  onLessonContentLoaded: (contentMarkdown: string) => void;
  onLessonGenerated: (lessonId: string, contentMarkdown: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  title,
  hasMessages,
  theme,
  onToggleTheme,
  isLeftSidebarVisible,
  onToggleLeftSidebar,
  onOpenAuthModal,
  onSelectTurn,
  onToggleContents,
  lessonId,
  initialHasContent,
  lessonTitle,
  cachedMarkdown,
  onLessonContentLoaded,
  onLessonGenerated,
}) => {
  return (
    <>
      <ChatHeaderBar
        title={title}
        turns={[]}
        activeTurnIndex={0}
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
        <LessonWorkspace
          lessonId={lessonId}
          initialHasContent={initialHasContent}
          lessonTitle={lessonTitle}
          cachedMarkdown={cachedMarkdown}
          onLessonContentLoaded={onLessonContentLoaded}
          onLessonGenerated={onLessonGenerated}
        />
      </div>
    </>
  );
};

export default LessonView;
