import { Context } from 'hono';
import { z } from 'zod';
import { courseService } from './course.service';
import { Bindings } from '../../types';

export const createCourseSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
  level: z.string().default('intermediate'),
  goal: z.string().default('Master practical skills'),
  style: z.string().default('hands_on_lab_first'),
  userId: z.string().optional(),
});

// Neon serverless failures surface as blank DOM ErrorEvents instead of
// Errors, so `err instanceof Error` is false and the real cause is lost.
// This extracts a human-readable message from any thrown value.
function describeUnknownError(err: unknown): string {
  if (err instanceof Error) {
    const cause = (err as any)?.cause;
    const causeMsg =
      cause instanceof Error
        ? ` | caused by: ${cause.message}`
        : typeof cause === 'string' && cause
          ? ` | caused by: ${cause}`
          : '';
    return `${err.name}: ${err.message}${causeMsg}`;
  }
  if (typeof err === 'string') return err;
  const anyErr = err as any;
  // DOM ErrorEvent from the Neon WebSocket driver (no message, only type).
  if (anyErr && (anyErr.type === 'error' || anyErr.constructor?.name === 'ErrorEvent')) {
    const inner = anyErr.message || anyErr.error?.message || '';
    return (
      'Database connection failed (Neon WebSocket ErrorEvent)' +
      (inner ? `: ${inner}` : ' — the project was likely asleep and the wake-up query failed') +
      '. Just retry the request; the next attempt usually succeeds once Neon is awake. ' +
      'If it keeps failing, check: 1) Neon project is Active (not Paused), ' +
      '2) DATABASE_URL in server/.env is current.'
    );
  }
  if (anyErr && typeof anyErr.message === 'string') return anyErr.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function logCourseError(route: string, err: unknown) {
  console.error(`\n[Backend CourseController ERROR] route=${route}`);
  console.error('  summary:', describeUnknownError(err));
  console.error('  name:', (err as any)?.constructor?.name);
  const anyErr = err as any;
  if (anyErr && (anyErr.code || anyErr.meta)) {
    try {
      console.error('  code/meta:', JSON.stringify({ code: anyErr.code, meta: anyErr.meta }));
    } catch {
      /* ignore stringify failures */
    }
  }
  if (err instanceof Error && err.stack) {
    console.error('  stack:', err.stack.split('\n').slice(0, 5).join('\n'));
  }
  if (err instanceof Error && (err as any).cause) {
    console.error('  cause:', (err as any).cause);
  }
}

export class CourseController {
  private getUserId(c: Context): string {
    const authUser = c.get('user') as any;
    if (authUser && authUser.id) {
      return authUser.id;
    }
    throw new Error('Unauthorized: Missing authenticated user token');
  }

  async handleGenerateCourse(c: Context<{ Bindings: Bindings }>) {
    try {
      const body = await c.req.json().catch(() => ({}));
      const userId = this.getUserId(c);
      const validated = (c.req as any).valid?.('json') || body;
      const payload = { ...validated, userId: validated.userId || userId };
      const course = await courseService.generateAndSaveCourse(payload as any);
      return c.json({ success: true, course }, 201);
    } catch (err: unknown) {
      const msg = describeUnknownError(err);
      logCourseError('POST /api/courses/generate', err);
      return c.json({ error: msg }, 500);
    }
  }

  async handleGetUserCourses(c: Context<{ Bindings: Bindings }>) {
    try {
      const userId = this.getUserId(c);
      const courses = await courseService.getUserCourses(userId);
      return c.json({ courses });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch courses';
      return c.json({ error: msg }, 500);
    }
  }

  async handleGetCourseDetails(c: Context<{ Bindings: Bindings }>) {
    try {
      const courseId = c.req.param('id');
      if (!courseId) {
        return c.json({ error: 'Missing course ID' }, 400);
      }
      const userId = this.getUserId(c);
      const course = await courseService.getCourseDetails(courseId, userId);
      return c.json({ course });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Course not found';
      return c.json({ error: msg }, 404);
    }
  }

  async handleGetLessonContent(c: Context<{ Bindings: Bindings }>) {
    try {
      const lessonId = c.req.param('lessonId');
      if (!lessonId) {
        return c.json({ error: 'Missing lesson ID' }, 400);
      }
      const generate = c.req.query('generate') === 'true';
      const lesson = await courseService.getOrGenerateLessonContent(lessonId, generate);
      return c.json({ lesson });
    } catch (err: unknown) {
      const msg = describeUnknownError(err);
      logCourseError('GET /api/courses/lessons/:lessonId', err);
      return c.json({ error: msg }, 500);
    }
  }

  async handleDeleteCourse(c: Context<{ Bindings: Bindings }>) {
    try {
      const courseId = c.req.param('id');
      if (!courseId) {
        return c.json({ error: 'Missing course ID' }, 400);
      }
      const userId = this.getUserId(c);
      const result = await courseService.deleteCourse(courseId, userId);
      return c.json(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete course';
      return c.json({ error: msg }, 500);
    }
  }

  async handleArchiveCourse(c: Context<{ Bindings: Bindings }>) {
    try {
      const courseId = c.req.param('id');
      if (!courseId) {
        return c.json({ error: 'Missing course ID' }, 400);
      }
      const userId = this.getUserId(c);
      const result = await courseService.archiveCourse(courseId, userId);
      return c.json(result);
    } catch (err: unknown) {
      const msg = describeUnknownError(err);
      logCourseError('PUT /api/courses/:id/archive', err);
      return c.json({ error: msg }, 500);
    }
  }
}

export const courseController = new CourseController();
