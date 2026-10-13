import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot,
  Brain,
  FileText,
  Wrench,
  Plug,
  HelpCircle,
  Plus,
  Search,
  MoreHorizontal,
  SlidersHorizontal,
  PanelLeftClose,
  GraduationCap,
  CodeXml,
  Server,
  Terminal,
  Database,
  ChevronRight,
  ChevronDown,
  BookOpen,
  User,
  UserCheck,
  LogOut,
} from 'lucide-react';
import GohardLogo from './GohardLogo';
import { Conversation } from '../types';
import { UserCourseSummary } from '../services/courseService';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isLeftSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  userCourses?: UserCourseSummary[];
  onOpenCourseModal?: () => void;
  onSelectLesson?: (courseId: string, lessonId: string) => void;
  onBrowseSkills?: () => void;
  activeLessonId?: string;
  activeTab?: 'chats' | 'learning' | 'docs' | 'tools' | 'plugins';
  onTabChange?: (tab: 'chats' | 'learning' | 'docs' | 'tools' | 'plugins') => void;
  onOpenAuthModal?: () => void;
  isLocked?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  isLeftSidebarVisible = true,
  onToggleSidebar,
  userCourses = [],
  onOpenCourseModal,
  onSelectLesson,
  onBrowseSkills,
  activeLessonId = '',
  activeTab = 'chats',
  onTabChange,
  onOpenAuthModal,
  isLocked = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showCourseSwitcher, setShowCourseSwitcher] = useState<boolean>(false);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Record<string, boolean>>({});
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeLessonId && userCourses?.length > 0) {
      for (const course of userCourses) {
        if (!course.modules) continue;
        for (const mod of course.modules) {
          if (!mod.lessons) continue;
          if (mod.lessons.some((l) => l.id === activeLessonId)) {
            setSelectedCourseId(course.id);
            return;
          }
        }
      }
    }
  }, [activeLessonId, userCourses]);

  const displayCourses = userCourses.filter((course) => !course.isCompleted);
  const selectedCourse = displayCourses.find((c) => c.id === selectedCourseId);

  // Land where the work is: the module holding the first incomplete lesson
  // starts expanded, the rest start collapsed. Explicit toggles win.
  const resumeModuleId = useMemo(() => {
    if (!selectedCourse) return null;
    for (const mod of selectedCourse.modules || []) {
      if ((mod.lessons || []).some((les) => !les.isCompleted)) return mod.id;
    }
    return selectedCourse.modules?.[0]?.id ?? null;
  }, [selectedCourse]);

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModuleIds((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId] === false ? true : false,
    }));
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const COMING_SOON_LABELS: Record<string, string> = {
    docs: 'Documents',
    tools: 'Tools',
    plugins: 'Plugins',
    help: 'Help & Settings',
  };

  const showComingSoonToast = (featureKey: string) => {
    const label = COMING_SOON_LABELS[featureKey] || featureKey;
    setToastMessage(`${label} are coming to Gohard soon`);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2500);
  };

  const handleTabClick = (tab: 'chats' | 'learning' | 'docs' | 'tools' | 'plugins') => {
    if (tab === 'docs' || tab === 'tools' || tab === 'plugins') {
      showComingSoonToast(tab);
      return;
    }
    onTabChange?.(tab);
    if (!isLeftSidebarVisible) {
      onToggleSidebar?.();
    }
  };

  return (
    <div className="dual-sidebar-wrapper">
      {/* 1. Primary Navigation Rail */}
      <nav className="primary-nav-rail">
        <div className="rail-top">
          <button
            className={`rail-logo-btn ${!isLeftSidebarVisible ? 'can-expand' : ''}`}
            onClick={!isLeftSidebarVisible ? onToggleSidebar : undefined}
            title={isLeftSidebarVisible ? 'Gohard' : 'Expand Sidebar'}
            aria-label={isLeftSidebarVisible ? 'Gohard' : 'Expand Sidebar'}
          >
            <span className="logo-default">
              <GohardLogo size={25} />
            </span>
            {!isLeftSidebarVisible && (
              <span className="logo-hover-expand">
                <PanelLeftClose size={20} />
              </span>
            )}
          </button>

          <div className="rail-menu-items">
            <button
              className={`rail-icon-btn ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => handleTabClick('chats')}
              title="Chats"
              aria-label="Chats"
            >
              <Bot size={20} />
            </button>

            <button
              className={`rail-icon-btn ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => handleTabClick('learning')}
              title="Learning & Courses"
              aria-label="Learning"
            >
              <Brain size={20} />
            </button>

            <button
              className="rail-icon-btn"
              onClick={() => handleTabClick('docs')}
              title="Documents"
              aria-label="Documents"
            >
              <FileText size={20} />
            </button>

            <button
              className="rail-icon-btn"
              onClick={() => handleTabClick('tools')}
              title="Tools"
              aria-label="Tools"
            >
              <Wrench size={20} />
            </button>

            <button
              className="rail-icon-btn"
              onClick={() => handleTabClick('plugins')}
              title="Plugins"
              aria-label="Plugins"
            >
              <Plug size={20} />
            </button>
          </div>
        </div>

        <div className="rail-bottom" style={{ position: 'relative' }}>
          {isAuthenticated && (
            <>
              <button
                className="rail-icon-btn active"
                title={`User Account (${user?.name || 'Logged In'})`}
                aria-label="Account"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                style={{ position: 'relative' }}
              >
                <UserCheck size={20} color="#22c55e" />
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    boxShadow: '0 0 6px #22c55e',
                  }}
                />
              </button>

              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '60px',
                    width: '260px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
                    zIndex: 9999,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#f8fafc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user?.name || 'Learner'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user?.email || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '10px 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#f87171',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </>
          )}

          <button
            className="rail-icon-btn"
            title="Help & Settings"
            aria-label="Help"
            onClick={() => showComingSoonToast('help')}
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </nav>

      {/* 2. Secondary Content Panel */}
      <aside className={`sidebar-container ${!isLeftSidebarVisible ? 'hidden' : ''}`}>
        {/* View Mode 1: CHATS */}
        {activeTab === 'chats' && (
          <>
            <div className="sidebar-header">
              <div className="brand-group">
                <span className="brand-name">Gohard</span>
              </div>
                  <button
                    className="sidebar-toggle-btn"
                    title="Collapse Sidebar"
                    onClick={onToggleSidebar}
                  >
                    <PanelLeftClose size={18} />
                  </button>
                </div>

            <div className="sidebar-action-area">
              <button className="new-chat-btn" onClick={onNewChat}>
                <Plus size={19} />
                <span>New Chat</span>
              </button>
            </div>

            <div className="chats-section">
              <div className="chats-header">
                <span className="chats-title">CHATS</span>
                <button className="search-btn" title="Search chats">
                  <Search size={17} />
                </button>
              </div>

              <div className="chats-list">
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${chat.id === activeId ? 'active' : ''}`}
                    onClick={() => onSelectConversation(chat.id)}
                  >
                    <Bot size={17} className="chat-icon" />
                    <span className="chat-title">{chat.title}</span>
                    <button
                      className="chat-more-btn"
                      title="Options"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* View Mode 2: LEARNING & COURSES */}
        {activeTab === 'learning' && (
          <>
            {/* Case A: No course selected */}
            {!selectedCourse && (
              <>
                <div className="sidebar-header">
                  <span className="brand-name">Gohard</span>
                  <button
                    className="sidebar-toggle-btn"
                    title="Collapse Sidebar"
                    onClick={onToggleSidebar}
                  >
                    <PanelLeftClose size={18} />
                  </button>
                </div>

                <div className="sidebar-action-area">
                  <button
                    className="new-chat-btn"
                    onClick={onOpenCourseModal}
                    disabled={isLocked}
                    title={isLocked ? 'Course creation is disabled while Gohard is under development' : undefined}
                  >
                    <Plus size={18} />
                    <span>Create Skill</span>
                  </button>
                </div>

                <div className="course-empty-state">
                  <div className="skill-icon-box green">
                    <GraduationCap size={18} />
                  </div>
                  <div className="course-empty-title">No course selected</div>
                  <p className="course-empty-copy">
                    Pick a course to see its lessons here.
                  </p>
                  {activeTab !== 'learning' && (
                    <button className="course-empty-cta" onClick={onBrowseSkills}>
                      Go to Skills
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Case B: Selected Course Detail View */}
            {selectedCourse && (
              <>
                <div className="sidebar-header-back-row course-switcher-row">
                  <button
                    className="course-switcher-btn"
                    aria-haspopup="menu"
                    aria-expanded={showCourseSwitcher}
                    onClick={() => setShowCourseSwitcher((prev) => !prev)}
                    title={selectedCourse.title}
                  >
                    <span className="course-switcher-label">{selectedCourse.title}</span>
                    <ChevronDown size={16} className="course-switcher-chevron" />
                  </button>
                  <button
                    className="sidebar-toggle-btn"
                    title="Collapse Sidebar"
                    onClick={onToggleSidebar}
                  >
                    <PanelLeftClose size={18} />
                  </button>
                  {showCourseSwitcher && (
                    <>
                      <div
                        className="course-switcher-backdrop"
                        onClick={() => setShowCourseSwitcher(false)}
                        aria-hidden="true"
                      />
                      <div className="course-switcher-menu" role="menu">
                        {displayCourses.map((course) => (
                          <button
                            key={course.id}
                            className={`course-switcher-item${course.id === selectedCourse.id ? ' active' : ''}`}
                            role="menuitemradio"
                            aria-checked={course.id === selectedCourse.id}
                            title={course.title}
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setShowCourseSwitcher(false);
                            }}
                          >
                            <GraduationCap size={15} className="course-switcher-item-icon" />
                            <span className="course-switcher-item-label">{course.title}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="course-detail-header-card green">
                  <div className="skill-icon-box green">
                    <GraduationCap size={18} />
                  </div>
                  <div className="course-detail-header-info">
                    <span className="course-detail-title">{selectedCourse.title}</span>
                    <span className="skill-status-text green">
                      {selectedCourse.totalLessons} Lessons
                    </span>
                  </div>
                </div>

                <div className="chats-section">
                  <div className="chats-header">
                    <span className="chats-title">MODULES</span>
                  </div>

                  <div className="modules-clean-list">
                    {selectedCourse.modules.map((mod) => {
                      const isExpanded = expandedModuleIds[mod.id] ?? mod.id === resumeModuleId;

                      return (
                        <div key={mod.id} className="clean-module-group">
                          <div
                            className="clean-module-header"
                            onClick={() => toggleModuleExpand(mod.id)}
                          >
                            <button className="module-chevron-btn">
                              {isExpanded ? (
                                <ChevronDown size={15} />
                              ) : (
                                <ChevronRight size={15} />
                              )}
                            </button>
                            <span className="clean-module-title">{mod.title}</span>
                          </div>

                          {isExpanded && (
                            <div className="clean-lessons-list">
                              {mod.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className={`chat-item ${les.id === activeLessonId ? 'active' : ''}`}
                                  onClick={() => onSelectLesson?.(selectedCourse.id, les.id)}
                                >
                                  <BookOpen size={15} className="chat-icon" />
                                  <span className="chat-title">{les.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

      </aside>

      {toastMessage && (
        <div className="sidebar-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
