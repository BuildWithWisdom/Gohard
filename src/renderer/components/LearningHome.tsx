import React from 'react';
import { Plus, ArrowRight, CodeXml, Sigma, Brain, GraduationCap } from 'lucide-react';
import booksImg from '../assets/my-skills-books.png';
import type { UserCourseSummary } from '../services/courseService';

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

export const LearningHome: React.FC<LearningHomeProps> = ({
  userCourses,
  onCreateSkill,
  onOpenCourse,
}) => {
  const hasSkills = userCourses.length > 0;

  return (
    <div className="learning-home">
      {!hasSkills ? (
        <div className="learning-home-empty">
          <img src={booksImg} alt="Books with graduation cap" className="learning-home-hero-img" />
          <h2 className="learning-home-empty-title">
            You haven&rsquo;t started <span className="highlight-green">learning</span> anything yet.
          </h2>
          <button className="learning-home-cta" onClick={() => onCreateSkill()}>
            <Plus size={18} />
            <span>Create Your First Skill</span>
          </button>
        </div>
      ) : (
        <div className="learning-home-mine">
          <div className="learning-home-section-row">
            <h2 className="learning-home-section-title">Your Skills</h2>
            <button className="learning-home-secondary-btn" onClick={() => onCreateSkill()}>
              <Plus size={16} />
              <span>New Skill</span>
            </button>
          </div>
          <div className="learning-home-courses-grid">
            {userCourses.map((course) => {
              const lessonId = getResumeLessonId(course);
              return (
                <button
                  key={course.id}
                  className="learning-home-course-card"
                  onClick={() => lessonId && onOpenCourse(course.id, lessonId)}
                >
                  <div className="learning-home-course-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="learning-home-course-title">{course.title}</div>
                  <div className="learning-home-course-meta">
                    {course.completedLessons}/{course.totalLessons} lessons · {course.progressPercent}%
                  </div>
                  <div className="learning-home-progress-track">
                    <div
                      className="learning-home-progress-fill"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <span className="learning-home-course-cta">
                    Continue <ArrowRight size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="learning-home-popular">
        <div className="learning-home-popular-grid">
          {POPULAR_SKILLS.map((skill) => (
            <button
              key={skill.id}
              className="learning-home-popular-card"
              onClick={() => onCreateSkill(skill.topic)}
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
    </div>
  );
};

export default LearningHome;
