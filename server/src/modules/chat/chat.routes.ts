import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { chatController, streamChatSchema } from './chat.controller';
import { MODEL_GROUPS, DEFAULT_MODEL_ID, DEFAULT_PROVIDER_SLUG, FALLBACK_MODEL_CHAIN } from '../../models';
import { Bindings } from '../../types';
import { authMiddleware, optionalAuthMiddleware } from '../auth/auth.middleware';

export const chatRouter = new Hono<{ Bindings: Bindings }>();

// Compat endpoint: frontend no longer calls this (model-free UI).
// Kept for old clients; returns Qwen-only groups plus server-side default/fallback.
chatRouter.get('/models', (c) => {
  return c.json({
    modelGroups: MODEL_GROUPS,
    defaultModelId: DEFAULT_MODEL_ID,
    defaultProviderSlug: DEFAULT_PROVIDER_SLUG,
    fallbackChain: FALLBACK_MODEL_CHAIN.map((m) => m.id),
  });
});

// Guest-friendly endpoint (uses optionalAuthMiddleware so guests can stream 1 message)
chatRouter.post('/stream', optionalAuthMiddleware, zValidator('json', streamChatSchema), (c) =>
  chatController.handleStreamChat(c)
);

// Protected endpoints requiring authenticated user token
chatRouter.use('*', authMiddleware);

chatRouter.get('/conversations', (c) => chatController.handleGetUserConversations(c));

chatRouter.get('/conversations/:id', (c) => chatController.handleGetConversationDetails(c));

chatRouter.delete('/conversations/:id', (c) => chatController.handleDeleteConversation(c));
