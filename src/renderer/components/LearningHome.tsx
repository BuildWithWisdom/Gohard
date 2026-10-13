import React, { useState } from 'react';
import { Plus, ArrowRight, CodeXml, Sigma, Brain, GraduationCap, MoreHorizontal } from 'lucide-react';
import booksImg from '../assets/my-skills-books.png';
import type { UserCourseSummary } from '../services/courseService';
import { deleteCourse, archiveCourse } from '../services/courseService';

interface PopularSkill {
  id: string;
  title: string;
  description: string;
  topic: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const POPULAR_SKILLS: PopularSkill[] = [
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Learn how to design scalable and reliable systems.',
    topic: 'System Design',
    icon: <CodeXml size={22} />,
    iconBg: 'rgba(34, 197, 94, 0.15)',
    iconColor: '#4ade80',
  },
  {
    id: 'go-programming',
    title: 'Go Programming',
    description: 'Build fast, efficient and reliable applications with Go.',
    topic: 'Go Programming',
    icon: <span style={{ fontWeight: 800, fontSize: '15px' }}>GO</span>,
    iconBg: 'rgba(56, 189, 248, 0.15)',
    iconColor: '#38bdf8',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Understand ML concepts and build intelligent systems.',
    topic: 'Machine Learning',
    icon: <Brain size={22} />,
    iconBg: 'rgba(168, 85, 247, 0.15)',
    iconColor: '#c084fc',
  },
  {
    id: 'calculus',
    title: 'Calculus',
    description: 'Master the foundations of calculus with clear explanations and practice.',
    topic: 'Calculus',
    icon: <Sigma size={22} />,
    iconBg: 'rgba(129, 140, 248, 0.15)',
    iconColor: '#a5b4fc',
  },
];

interface LearningHomeProps {
  userCourses: UserCourseSummary[];
  onCreateSkill: (topic?: string) => void;
  onOpenCourse: (courseId: string, lessonId: string) => void;
  onCoursesChanged: () => void;
  isLocked?: boolean;
}

function getResumeLessonId(course: UserCourseSummary): string {
  for (const mod of course.modules || []) {
    for (const les of mod.lessons || []) {
      if (!les.isCompleted) return les.id;
    }
  }
  const first = course.modules?.[0]?.lessons?.[0];
  return first ? first.id : '';
}

// "Lesson 16 • Interfaces" — position and title of the first incomplete
// lesson, counting across modules in order.
function getCurrentLessonLabel(course: UserCourseSummary): string {
  let index = 0;
  for (const mod of course.modules || []) {
    for (const les of mod.lessons || []) {
      index += 1;
      if (!les.isCompleted) return `Lesson ${index} • ${les.title}`;
    }
  }
  if (index === 0) return 'No lessons yet';
  return `All ${index} lessons complete`;
}

export const LearningHome: React.FC<LearningHomeProps> = ({
  userCourses,
  onCreateSkill,
  onOpenCourse,
  onCoursesChanged,
  isLocked = false,
}) => {
  // Archived courses stay in the database but leave the grid.
  const visibleCourses = userCourses.filter((course) => !course.isCompleted);
  const hasSkills = visibleCourses.length > 0;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const closeMenu = () => setOpenMenuId(null);

  const handleDelete = async (courseId: string) => {
    setBusyId(courseId);
    try {
      await deleteCourse(courseId);
      onCoursesChanged();
    } catch (err) {
      console.warn('[LearningHome] Failed to delete course:', err);
    } finally {
      setBusyId(null);
      closeMenu();
    }
  };

  const handleArchive = async (courseId: string) => {
    setBusyId(courseId);
    try {
      await archiveCourse(courseId);
      onCoursesChanged();
    } catch (err) {
      console.warn('[LearningHome] Failed to archive course:', err);
    } finally {
      setBusyId(null);
      closeMenu();
    }
  };

  const openCourse = (course: UserCourseSummary) => {
    const lessonId = getResumeLessonId(course);
    if (lessonId) onOpenCourse(course.id, lessonId);
  };

  return (
    <div className={hasSkills ? 'learning-home has-skills' : 'learning-home'}>
      {openMenuId && (
        <div className="learning-home-menu-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}
      {!hasSkills ? (
        <div className="learning-home-empty">
          <img src={booksImg} alt="Books with graduation cap" className="learning-home-hero-img" />
          <h2 className="learning-home-empty-title">
            You haven&rsquo;t started <span className="highlight-green">learning</span> anything yet.
          </h2>
          <button
            className="learning-home-cta"
            onClick={() => onCreateSkill()}
            disabled={isLocked}
            title={isLocked ? 'Course creation is disabled while Gohard is under development' : undefined}
          >
            <Plus size={18} />
            <span>Create Your First Skill</span>
          </button>
          {isLocked && (
            <p className="learning-home-locked-note">Course creation is disabled while Gohard is under development.</p>
          )}
        </div>
      ) : (
        <div className="learning-home-mine">
          <div className="learning-home-section-head">
            <h2 className="learning-home-section-title">Skills</h2>
            <p className="learning-home-section-subtitle">Your learning journey, in progress.</p>
          </div>
          <div className="learning-home-courses-grid">
            {visibleCourses.map((course) => {
              const menuOpen = openMenuId === course.id;
              const busy = busyId === course.id;
              return (
                <div
                  key={course.id}
                  className="learning-home-course-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openCourse(course)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCourse(course);
                    }
                  }}
                >
                  <div className="learning-home-course-top">
                    <div className="learning-home-course-icon">
                      <GraduationCap size={20} />
                    </div>
                    <button
                      className="learning-home-card-menu-btn"
                      aria-label={`Options for ${course.title}`}
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(menuOpen ? null : course.id);
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {menuOpen && (
                      <div
                        className="learning-home-card-menu"
                        role="menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="learning-home-card-menu-item"
                          role="menuitem"
                          disabled={busy}
                          onClick={() => void handleArchive(course.id)}
                        >
                          Archive
                        </button>
                        <button
                          className="learning-home-card-menu-item danger"
                          role="menuitem"
                          disabled={busy}
                          onClick={() => void handleDelete(course.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="learning-home-course-title">{course.title}</div>
                  <div className="learning-home-course-meta">
                    {getCurrentLessonLabel(course)}
                  </div>
                  <div className="learning-home-progress-row">
                    <div className="learning-home-progress-track">
                      <div
                        className="learning-home-progress-fill"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                    <span className="learning-home-progress-pct">{course.progressPercent}%</span>
                  </div>
                  <span className="learning-home-course-cta">
                    Continue <ArrowRight size={15} />
                  </span>
                </div>
              );
            })}
            <button
              className="learning-home-create-card"
              onClick={() => onCreateSkill()}
              disabled={isLocked}
              title={isLocked ? 'Course creation is disabled while Gohard is under development' : undefined}
            >
              <span className="learning-home-create-plus">
                <Plus size={20} />
              </span>
              <span className="learning-home-create-title">Create New Skill</span>
              <span className="learning-home-create-desc">Tell Gohard what you want to learn.</span>
            </button>
          </div>
        </div>
      )}

      {!hasSkills && (
      <div className="learning-home-popular">
        <div className="learning-home-popular-grid">
          {POPULAR_SKILLS.map((skill) => (
            <button
              key={skill.id}
              className="learning-home-popular-card"
              onClick={() => onCreateSkill(skill.topic)}
              disabled={isLocked}
              title={isLocked ? 'Course creation is disabled while Gohard is under development' : undefined}
            >
              <span
                className="learning-home-popular-icon"
                style={{ background: skill.iconBg, color: skill.iconColor }}
              >
                {skill.icon}
              </span>
              <span className="learning-home-popular-title">{skill.title}</span>
              <span className="learning-home-popular-desc">{skill.description}</span>
              <span className="learning-home-popular-arrow">
                <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default LearningHome;
