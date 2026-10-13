import React from 'react';
import { ChatHeaderBar } from './ChatHeaderBar';
import { LearningHome } from './LearningHome';
import { ThemeMode } from '../types';
import { UserCourseSummary } from '../services/courseService';

export interface SkillsHomeProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isLeftSidebarVisible: boolean;
  onToggleLeftSidebar: () => void;
  onOpenAuthModal: () => void;
  onSelectTurn: (turnIndex: number) => void;
  onToggleContents: () => void;
  userCourses: UserCourseSummary[];
  onCreateSkill: (topic?: string) => void;
  onOpenCourse: (courseId: string, lessonId: string) => void;
  onCoursesChanged: () => void;
  isLocked?: boolean;
}

export const SkillsHome: React.FC<SkillsHomeProps> = ({
  theme,
  onToggleTheme,
  isLeftSidebarVisible,
  onToggleLeftSidebar,
  onOpenAuthModal,
  onSelectTurn,
  onToggleContents,
  userCourses,
  onCreateSkill,
  onOpenCourse,
  onCoursesChanged,
  isLocked = false,
}) => {
  return (
    <>
      <ChatHeaderBar
        title="My Skills"
        turns={[]}
        activeTurnIndex={0}
        onSelectTurn={onSelectTurn}
        onToggleContents={onToggleContents}
        hasMessages={false}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isLeftSidebarVisible={isLeftSidebarVisible}
        onToggleLeftSidebar={onToggleLeftSidebar}
        onOpenAuthModal={onOpenAuthModal}
      />
      <LearningHome
        userCourses={userCourses}
        onCreateSkill={isLocked ? () => undefined : onCreateSkill}
        onOpenCourse={onOpenCourse}
        onCoursesChanged={onCoursesChanged}
        isLocked={isLocked}
      />
    </>
  );
};

export default SkillsHome;
