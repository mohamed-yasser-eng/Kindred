<!-- ════════════════════════════════════════════════════════════════ -->
<!--  HEADER BANNER                                                     -->
<!-- ════════════════════════════════════════════════════════════════ -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1f6feb,100:58a6ff&height=200&section=header&text=Kindred&fontSize=70&fontColor=ffffff&fontAlignY=35&desc=Social-networking%20backend%20%E2%80%94%20REST%20%C2%B7%20GraphQL%20%C2%B7%20WebSocket&descSize=18&descAlignY=58&descColor=c9d1d9&animation=fadeIn" width="100%" />

<!-- ════════════════════════════════════════════════════════════════ -->
<!--  TYPING SVG                                                        -->
<!-- ════════════════════════════════════════════════════════════════ -->

<p align="center">
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPO">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=58A6FF&center=true&vCenter=true&width=620&lines=Three+API+surfaces%2C+one+domain+core.;REST+%2B+GraphQL+%2B+WebSocket+over+TypeScript.;MongoDB+%C2%B7+Redis+%C2%B7+S3+%E2%80%94+layered+%26+strict." alt="Typing SVG" />
  </a>
</p>

<!-- ════════════════════════════════════════════════════════════════ -->
<!--  BADGES                                                            -->
<!-- ════════════════════════════════════════════════════════════════ -->

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.6_strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/license-MIT-58A6FF?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO?style=for-the-badge&color=1f6feb&logo=github&logoColor=white" alt="Stars" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/OpenAPI-3.0-6BA539?style=flat-square&logo=openapiinitiative&logoColor=white" alt="OpenAPI" />
  <img src="https://img.shields.io/badge/Swagger-UI-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/JWT-revocable-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

A social-networking backend in TypeScript that serves three coordinated API surfaces — **REST**, **GraphQL**, and **WebSocket** — over one shared domain core (MongoDB + Redis + S3).

<!-- ════════════════════════════════════════════════════════════════ -->
<!--  TECH STACK ICONS                                                  -->
<!-- ════════════════════════════════════════════════════════════════ -->

## 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nodejs,express,mongodb,redis,graphql,aws,docker&perline=8" alt="Tech stack" />
</p>

| Area | Choice |
| --- | --- |
| Runtime / language | Node.js, TypeScript 5.6 (`strict`) |
| HTTP | Express 5 |
| Database | MongoDB + Mongoose 7 |
| Read API | GraphQL (`graphql` + `graphql-http`) |
| Realtime | Socket.IO 4 |
| Cache / rate-limit store | Redis (`ioredis`) |
| Object storage | AWS S3 (SDK v3) |
| Auth / crypto | `jsonwebtoken`, `bcrypt`, `node:crypto` (AES-256-CBC) |
| Validation / docs | Zod 4, `swagger-ui-express` |

---

## ✨ Features

- **Auth** — local email/password with email-OTP verification; JWT access/refresh tokens with revocation (sign-out blacklists tokens).
- **Social graph** — friend requests, accept/reject, friends-only groups.
- **Content** — posts with image attachments and friend tagging; arbitrarily deep comment threads; typed reactions (like/love/haha/sad/angry).
- **Real-time chat** — 1:1 and group messaging over Socket.IO, multi-tab presence aware.
- **Aggregated reads** — a GraphQL feed, post detail, profile dashboard, and conversations.
- **Media** — AWS S3-backed uploads with presigned URLs.
- **Self-documenting** — OpenAPI 3.0 spec generated from the request validators, served via Swagger UI.

---

## 🏛 Architecture

Layered architecture with a single direction of dependency. The three transports are siblings that converge on the same services, repositories, and models.

```
            REST  /api/*          GraphQL  /graphql (read-only)        Socket.IO  ws
               │                          │                                 │
               └──────────────┬───────────┴─────────────────┬───────────────┘
                              ▼                              ▼
                    Services (business logic)   ◄──   cross-cutting middleware
                              ▼                        (auth, validation,
                    Repositories (BaseRepository<T>)    rate limit, upload)
                              ▼
                    Mongoose Models
                              ▼
                MongoDB  ·  Redis  ·  S3
```

**REST request flow:** `index.ts` → controller (`express.Router`) → middleware chain → service → repository → model.

---

## 🚀 Getting Started

### Prerequisites
Node.js (Docker image pins Node 24), and access to MongoDB, Redis, an S3 bucket, and an SMTP server.

### Install & run
```bash
cd BE
npm install
cp .env.example .env     # fill in every key (see note below)
npm run dev              # watch mode (nodemon)
```

| Script | Action |
| --- | --- |
| `npm run dev` | Compile + run with nodemon |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | Run the built server |
| `npm run typecheck` / `npm test` | `tsc --noEmit` |
| `npm run export-spec` | Write the OpenAPI spec to `openapi.json` |

### Configuration
`src/Config/env.config.ts` validates the whole environment with Zod at startup and **exits if any variable is missing or invalid** — the app won't boot half-configured. Key constraints: `ENCRYPTION_SECRET_KEY` must be exactly 32 chars, `JWT_PREFIX` must be `Bearer`.

> **Note:** the env schema also requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`, which are not yet in `.env.example` — add them when filling your `.env`.

### Docker
```bash
docker build -t kindred-backend .
docker run --env-file .env -p 5000:5000 kindred-backend
```

---

## 📡 API

Protected requests send `Authorization: Bearer <accessToken>`. Every response uses one envelope: `{ meta: { status, success, message }, data | error }`.

| Surface | Entry point |
| --- | --- |
| Swagger UI | `GET /api-docs` |
| Raw OpenAPI spec | `GET /api-docs.json` |
| Health probe | `GET /health` |
| REST | `/api/auth`, `/api/users`, `/api/posts`, `/api/comments`, `/api/reacts` |
| GraphQL (read-only) | `POST /graphql` — `feed`, `postDetails`, `profileDashboard`, `conversations` |
| Socket.IO | `send-private-message`, `get-chat-history`, `send-group-message`, `get-group-chat` |

Full contract: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) and [`WEBSOCKET.md`](./WEBSOCKET.md).

---

## 📂 Project Structure

```
BE/src/
├── index.ts          # app wiring, middleware order, error sink, server + io bootstrap
├── Config/           # env (Zod-validated), redis, swagger
├── Common/           # shared enums, interfaces, types
├── Db/
│   ├── Models/       # Mongoose schemas, indexes, validate hooks
│   └── Repositories/ # BaseRepository<T> + concrete repos
├── Modules/          # feature modules (controller + service): Users, Posts, Comments, Reacts, Chat
├── Middlewares/      # authentication, validation, rate-limit, multer
├── GraphQl/          # schema, context (own auth path), resolvers, mappers
├── Gateways/         # Socket.IO init, handshake auth, presence
├── Validators/       # Zod schemas — single source for requests, OpenAPI, socket payloads
├── Docs/             # OpenAPI registry, paths, responses
└── Utils/            # crypto, token, hash, S3, email, pagination, responses, errors
```

---

## 🏗 Engineering & Architecture

A closer look at how the system is built — each item ties to the real files and, where relevant, the trade-off behind the decision.

### 🗄️ Data & Persistence

**Database Architecture & Schema Design**  
<sub>Document-modeling by intent: polymorphic `refPath` associations (`onModel ∈ {Post, Comment}`) power deep comment threads and unified reactions across posts/comments alike; OTPs are embedded + hashed on the user document; direct chats and friendships derive sorted composite keys for order-independent identity ("A↔B" == "B↔A").  ·  `comment.model.ts`, `react.model.ts`, `user.model.ts`, `conversation.model.ts`, `friendShip.model.ts`</sub>

**Mongoose ODM in Depth**  
<sub>Aggregation pipelines (`$match`/`$group`/`$project`) for reaction roll-ups, `.lean()` on read paths, `.populate()` with field projections, idempotent upserts with `setDefaultsOnInsert`, `mongoose-paginate-v2` behind a typed `PaginateModel`, and `pre('validate')` hooks for derived-state computation. Schemas are generically typed (`Schema<IUser>`).  ·  `GraphQl/Resolvers/post.resolvers.ts`, `Modules/Reacts/services/react.service.ts`, `Db/Repositories/post.repository.ts`</sub>

**Indexing Strategy**  
<sub>Every model indexed to actual query patterns: compound `{refId, onModel, createdAt}` for comment/react fan-out, a unique `{ownerId, refId, onModel}` enforcing one reaction per user per target, `{conversationId, createdAt}` for chat history, a partial unique index on `directKey` (direct conversations only), and a TTL index (`expireAfterSeconds: 0`) for auto-purging the token blacklist.  ·  `react.model.ts`, `comment.model.ts`, `conversation.model.ts`, `black-listed-tokens.model.ts`</sub>

**Performance & Query Optimization**  
<sub>GraphQL `feed` kills the N+1 by collecting all post ids then running three batched aggregations (comment counts, reaction breakdowns, viewer's own reactions) in parallel via `Promise.all`, assembled per-post with a `Map`. Reads use `.lean()` and page size is clamped server-side ≤50. *(postDetails comment thread not yet batched — roadmap.)*  ·  `GraphQl/Resolvers/post.resolvers.ts`</sub>

### 🧱 Architecture & Code Style

**Modular Layered Architecture**  
<sub>Clean n-tier with a single dependency direction: transport (controllers/resolvers/gateways) → service → repository → model. Persistence sits behind a generic `BaseRepository<T>`; specialized repos add only what's special. Services are singletons with constructor-injected repositories (manual DI); all three transports converge on the same shared core.  ·  `Db/Repositories/base.repository.ts`, `Modules/**`, `Modules/controllers.index.ts`</sub>

**Type-Safe Development Style**  
<sub>`strict` TypeScript with generics carrying intent (`BaseRepository<T>`, `SuccessResponse<T>`), a shared `Common/` vocabulary of interfaces and enums (`IUser`, `IRequest`, `ReactTypeEnum`, …), and a typed exception hierarchy replacing ad-hoc throws. *(Formatting is not yet linted — roadmap.)*  ·  `Common/`, `Utils/Errors/`, `tsconfig.json`</sub>

**Contract-First API Design**  
<sub>Zod validators in `src/Validators` are the single source of truth: they validate + coerce incoming requests **and** generate the OpenAPI 3.0 schema via `z.toJSONSchema` (the same library validates env at boot). One response envelope `{ meta, data | error }` across all three API surfaces sharing one JWT identity.  ·  `Validators/`, `Config/swagger.config.ts`, `Utils/Response/response-helper.utils.ts`</sub>

**Middleware Composition**  
<sub>Routes compose factory-built chains (auth → rate-limit → upload → validate → handler). The schema-driven validator coerces input onto the request — including an Express-5 workaround that shadows the read-only `req.query` getter via `Object.defineProperty`. A single terminal error middleware maps all thrown exceptions to responses; Socket.IO auth plugs in via `io.use`.  ·  `Middlewares/`, `Modules/Posts/post.controller.ts`, `src/index.ts`</sub>

**Error Handling Architecture**  
<sub>Service handlers throw typed `HttpException` subclasses — `BadRequestException` (400), `UnauthorizedException` (401), `NotFoundException` (404), `ConflictException` (409) — and never catch them locally. A single async terminal middleware at the bottom of `src/index.ts` handles every outcome: `MulterError` → 413/400, `HttpException` → its own status, anything else → 500; always through the standard envelope, always after cleaning up uploaded temp files.  ·  `Utils/Errors/http-exception.utils.ts`, `Utils/Errors/exceptions.utils.ts`, `src/index.ts`</sub>

### 🛡️ Security & Resilience

**Defense in Depth**  
<sub>Security is enforced at every layer of the pipeline, not just one. At the transport edge: `helmet` security headers and a strict CORS allow-list. Before the handler: Redis-backed rate limiting per route and per socket event. At the auth boundary: JWT verification plus a blacklist check on every request. At the input gate: Zod validation that rejects unknown fields. At the storage layer: bcrypt passwords, hashed OTPs, and AES-256-CBC phone encryption with per-record IVs.  ·  `src/index.ts`, `Middlewares/`, `Utils/Encryption/`, `Config/env.config.ts`</sub>

**Security Engineering**  
<sub>Defense in depth: revocable stateless JWTs (UUID `jti` + indexed blacklist checked on every authed request), bcrypt passwords, hashed OTPs at rest, AES-256-CBC phone encryption with a per-record random IV, `helmet` headers, CORS allow-list sourced from `CLIENT_ORIGINS`, and strict validation that rejects unknown fields. *(Trade-off: revocation costs one indexed read per authenticated request.)*  ·  `Utils/Encryption/`, `Middlewares/authentication.middleware.ts`, `Utils/cors.utils.ts`</sub>

**Distributed Rate Limiting**  
<sub>Redis-backed via `rate-limiter-flexible` so budgets hold across multiple instances. Distinct limits cover the global surface, per-route auth flows (signup/signin/confirm/upload/GraphQL), and per-socket-event traffic. Uploads are keyed per authenticated user rather than per IP; exhausted limits return `429` with `Retry-After`.  ·  `Middlewares/rate-limit.middleware.ts`</sub>

**Resilience & Reliability**  
<sub>S3↔DB writes run as a saga — orphaned S3 objects are deleted if the DB write fails, partial multi-file uploads roll back, and temp files are always unlinked (including by the error middleware). Boot is fail-fast (`process.exit(1)` on bad env or unreachable DB). Redis reconnects resiliently (`maxRetriesPerRequest: null`). `/health` exposes Mongo/Redis status and process uptime.  ·  `Modules/Posts/services/post.service.ts`, `Utils/Services/s3-client.utils.ts`, `Config/env.config.ts`, `Config/redis.config.ts`</sub>

### ⚡ Real-Time & Cloud

**Real-Time Architecture**  
<sub>Socket.IO rooms map 1:1 to conversations. Handshake is authenticated via `io.use` (JWT, rate-limited by IP) before any event fires. Presence is multi-tab aware via `connectedSockets: Map<userId, socketId[]>`. Every chat event is Zod-validated and rate-limited; direct conversations are found-or-created by their deterministic composite key.  ·  `Gateways/socketIo.gateways.ts`, `Modules/Chat/chat.events.ts`, `Modules/Chat/Services/chat.services.ts`</sub>

**Cloud Storage Integration**  
<sub>Media lives in a private S3 bucket (AWS SDK v3) fronted by presigned, expiring GET URLs (default 300s — never publicly readable). Large files use `lib-storage` multipart `Upload` (5 MB parts, concurrency 4); smaller ones stream from Multer disk storage with guaranteed temp-file cleanup in a `finally` block.  ·  `Utils/Services/s3-client.utils.ts`, `Middlewares/multer.middleware.ts`</sub>

**Event-Driven Side Effects**  
<sub>OTP email is emitted on a Node `EventEmitter` rather than awaited inline — a slow or failing mail server can't block or fail the signup response. *(Honest caveat: the bus is in-process and fire-and-forget — a durable queue with retries is the documented upgrade path.)*  ·  `Utils/Services/email.utils.ts`, `Modules/Users/services/auth.service.ts`</sub>

---

## 🗺 Roadmap

- Behavioral test suite + CI pipeline (current verification is `tsc --strict` + Zod validation; `npm test` runs the type-check).
- Wrap the deletion cascade in a MongoDB transaction (session) to close the partial-orphan window.
- Refresh-token rotation with reuse detection.
- Extend feed-style batching (or DataLoader) to the `postDetails` comment thread.
- Replace the in-process email `EventEmitter` with a durable queue (retries, dead-letter).

<!-- ════════════════════════════════════════════════════════════════ -->
<!--  FOOTER                                                            -->
<!-- ════════════════════════════════════════════════════════════════ -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:58a6ff,50:1f6feb,100:0d1117&height=120&section=footer" width="100%" />