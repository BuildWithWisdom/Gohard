import React from 'react';
import { ChatHome, ChatHomeProps } from './ChatHome';
import { SkillsHome, SkillsHomeProps } from './SkillsHome';
import { LessonView, LessonViewProps } from './LessonView';

export type MainViewKind = 'chat' | 'skills' | 'lesson';

export interface MainViewProps {
  view: MainViewKind;
  chat: ChatHomeProps;
  skills: SkillsHomeProps;
  lesson: LessonViewProps;
}

/**
 * Host component for the main workspace card.
 * Owns the layout shell + view switch; each page owns its content.
 * Adding a new default page = new page component + one case here.
 */
export const MainView: React.FC<MainViewProps> = ({ view, chat, skills, lesson }) => {
  return (
    <div className="chat-workspace-card">
      {view === 'skills' ? (
        <SkillsHome {...skills} />
      ) : view === 'lesson' ? (
        <LessonView {...lesson} />
      ) : (
        <ChatHome {...chat} />
      )}
    </div>
  );
};

export default MainView;
