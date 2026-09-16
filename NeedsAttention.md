# NeedsAttention

> Central tracker for known issues, security gaps, and tech-debt to fix later.
> Add new entries at the bottom under the correct category. Keep status up to date.
>
> Status legend: `[ ] TODO` | `[/] IN PROGRESS` | `[x] DONE` | `[-] WONTFIX`
> Priority: `P0 Critical` | `P1 High` | `P2 Medium` | `P3 Low`

---

## Template (copy for new entries)

```md
### [ ] <Short title> — <P0/P1/P2/P3>
- **Date added:** YYYY-MM-DD
- **Area:** Auth / Chat / Course / Memory / Frontend / Backend / Infra / UI
- **Files:** `path/to/file.ts:line`
- **Observation:** What is wrong?
- **Impact:** What can happen?
- **Suggested fix:** How to fix?
- **Status:** TODO
```

---

## 1. Auth & Security

### [ ] Guest limit is client-only, unlimited free streaming — P0
- **Date added:** 2026-09-16
- **Area:** Auth / Backend
- **Files:** `src/renderer/App.tsx:251`, `server/src/modules/chat/chat.routes.ts:16`, `server/src/modules/auth/auth.middleware.ts:44`
- **Observation:** 1-message guest limit lives only in `localStorage:openmanus_guest_msg_count`. `POST /api/chat/stream` uses `optionalAuthMiddleware` with no server counter.
- **Impact:** Clear storage = unlimited free LLM usage / cost abuse.
- **Suggested fix:** Enforce server-side: IP/device fingerprint + Redis/DB counter, or require auth for persistence + rate-limit guests.
- **Status:** TODO

### [ ] Stream endpoint trusts client `userId`, allows memory leak + IDOR write — P0
- **Date added:** 2026-09-16
- **Area:** Auth / Chat
- **Files:** `server/src/modules/chat/chat.controller.ts:34`, `server/src/modules/chat/chat.service.ts:107,119`
- **Observation:** `userId = authUser?.id || validated.userId`. Unauthed caller can pass any `userId` to build that user's memory context. `saveConversationMessages()` upserts by `conversationId` without ownership check.
- **Impact:** Cross-user memory exposure via prompt, overwrite of another user's conversation title if ID known.
- **Suggested fix:** Ignore body `userId` entirely. If no `authUser`, force guest mode (no memory, no DB write). For authed, verify `conversation.userId == authUser.id` before upsert.
- **Status:** TODO

### [ ] No token revocation, 30-day JWT stays valid after password change — P1
- **Date added:** 2026-09-16
- **Area:** Auth
- **Files:** `server/src/modules/auth/auth.service.ts:35`, `server/src/modules/auth/auth.middleware.ts:20`
- **Observation:** Single long-lived JWT (30d), no refresh rotation, no blacklist/version. `changePassword` does not invalidate old tokens.
- **Impact:** Stolen token = 30 days access even after password reset.
- **Suggested fix:** Add `User.tokenVersion`, bump on password change / logout-all, check in middleware. Move to short access (15m) + refresh (7d) rotation.
- **Status:** TODO

### [ ] Token in localStorage, XSS-readable + unencrypted on disk — P1
- **Date added:** 2026-09-16
- **Area:** Auth / Frontend / Electron
- **Files:** `src/renderer/services/authService.ts:2,33`, `src/renderer/context/AuthContext.tsx:32`
- **Observation:** `openmanus_auth_token` in `localStorage`. Markdown rendering + any XSS can exfiltrate. Electron persists plain on disk.
- **Impact:** Session hijack.
- **Suggested fix:** Use `httpOnly Secure` cookie for web, or `Electron safeStorage` + in-memory token for desktop. Add CSP.
- **Status:** TODO

### [ ] No rate-limit / lockout on login, register, stream — P1
- **Date added:** 2026-09-16
- **Area:** Auth / Infra
- **Files:** `server/src/index.ts:10`, `server/src/modules/auth/auth.routes.ts:8`
- **Observation:** No throttling, captcha, or lockout.
- **Impact:** Credential stuffing / brute-force, LLM cost burn.
- **Suggested fix:** Add rate-limit middleware (e.g. 5/min login, 20/min stream per IP + user), account lockout, Cloudflare Turnstile for register.
- **Status:** TODO

### [ ] CORS wildcard with Authorization allowed — P2
- **Date added:** 2026-09-16
- **Area:** Backend
- **Files:** `server/src/index.ts:14`
- **Observation:** `cors({ origin: '*' })` + `allowHeaders: Authorization`.
- **Impact:** Any site can call API (relies solely on token secrecy).
- **Suggested fix:** Restrict to `app://`, `http://localhost:*` in dev, and production domain. Add `helmet`-style headers.
- **Status:** TODO

### [ ] Weak password policy + email change without verification — P2
- **Date added:** 2026-09-16
- **Area:** Auth
- **Files:** `server/src/modules/auth/auth.controller.ts:6`, `server/src/modules/auth/auth.service.ts:141`
- **Observation:** Min 6 chars only. `PUT /profile` changes email + re-issues token with no verification. `register` leaks `account already exists`.
- **Impact:** Weak accounts, session hijacker can lock out victim via email change.
- **Suggested fix:** Min 8 + strength check, email-change verification link, generic register response.
- **Status:** TODO

---

## 2. Backend / Data (add next issues here)

_None yet._

---

## 3. Frontend (add next issues here)

_None yet._

---

## 4. Memory / AI (add next issues here)

_None yet._

---

## Changelog

- 2026-09-16: Created file, added Auth Security Review (7 items).
