# Commit Plan

Goal: commit the current local production-readiness work into a new branch using focused commits.

No commits should be made until this plan is reviewed and agreed.

## Proposed Branch

```txt
production-refactor
```

## Pre-Commit Checks

Run before the first commit and again after the final commit:

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

Expected audit note:

- Normal `npm audit fix` has already been run.
- One remaining moderate `nodemailer` advisory requires `npm audit fix --force`.

## Commit 1: Production Config And Security Hardening

Draft message:

```txt
harden production configuration and security
```

Purpose:

- Add safer startup/runtime defaults.
- Improve request/security middleware.
- Harden uploads and AWS S3 handling.

Proposed files:

```txt
src/Config/env.config.ts
src/Config/redis.config.ts
src/Utils/cors.utils.ts
src/Utils/Services/s3-client.utils.ts
src/Middlewares/multer.middleware.ts
src/index.ts
.env.example
```

Notes:

- Includes `helmet`.
- Includes request JSON body limit.
- Includes AWS-only S3 client config.
- Includes upload MIME, extension, file-size validation, and temp-file cleanup.
- Includes `/health` endpoint unless we decide to split health into its own commit.

## Commit 2: Redis-Backed Rate Limiting

Draft message:

```txt
add redis-backed rate limiting
```

Purpose:

- Add global, route-level, GraphQL, upload, and socket rate limiting.

Proposed files:

```txt
src/Middlewares/rate-limit.middleware.ts
src/Middlewares/index.ts
src/Modules/Users/controllers/auth.controller.ts
src/Modules/Users/controllers/profile.controller.ts
src/Modules/Posts/post.controller.ts
src/Gateways/socketIo.gateways.ts
src/Modules/Chat/chat.events.ts
package.json
package-lock.json
```

Notes:

- `package.json` and `package-lock.json` also include dependency audit updates, so we may need to decide whether package changes belong here or in a separate dependency commit.

## Commit 3: Core Feature Completion

Draft message:

```txt
complete core social features
```

Purpose:

- Complete missing REST features and auth flow gaps.

Proposed files:

```txt
src/Modules/Users/services/auth.service.ts
src/Modules/Users/services/profile.service.ts
src/Modules/Posts/services/post.service.ts
src/Modules/Comments/comment.controller.ts
src/Modules/Comments/services/comment.service.ts
src/Modules/Reacts/react.controller.ts
src/Modules/Reacts/services/react.service.ts
src/Db/Models/comment.model.ts
src/Db/Models/react.model.ts
src/Db/Models/post.model.ts
src/Db/Models/user.model.ts
src/Db/Models/black-listed-tokens.model.ts
src/Db/Models/friendShip.model.ts
src/Db/Models/conversation.model.ts
src/Db/Models/message.model.ts
src/Db/Repositories/comment.repository.ts
src/Db/Repositories/react.repository.ts
src/Common/Enums/user.enum.ts
src/Common/Interfaces/user.interface.ts
```

Notes:

- Includes refresh token endpoint/service behavior.
- Includes verified-email-only sign-in.
- Includes comments/reacts/profile/post feature gaps.
- Includes database cleanup/index/schema changes if they are tied to those features.

## Commit 4: GraphQL Read Layer

Draft message:

```txt
add graphql read layer
```

Purpose:

- Add modular GraphQL read/query layer.

Proposed files:

```txt
src/GraphQl/index.graphql.ts
src/GraphQl/context.ts
src/GraphQl/Args/post.args.ts
src/GraphQl/Types/user.types.ts
src/GraphQl/Types/post.types.ts
src/GraphQl/Types/comment.types.ts
src/GraphQl/Types/react.types.ts
src/GraphQl/Types/conversation.types.ts
src/GraphQl/Types/profile.types.ts
src/GraphQl/Schema/Query/post.query.ts
src/GraphQl/Schema/Query/profile.query.ts
src/GraphQl/Schema/Query/conversation.query.ts
src/GraphQl/Resolvers/post.resolvers.ts
src/GraphQl/Resolvers/profile.resolvers.ts
src/GraphQl/Resolvers/conversation.resolvers.ts
src/GraphQl/Utils/graphql-mappers.utils.ts
src/GraphQl/Utils/index.ts
src/index.ts
package.json
package-lock.json
```

Notes:

- `src/index.ts` is shared with other commits because it also contains security, health, and route mounting.
- We need to decide whether to stage only the GraphQL-related parts of `src/index.ts` manually.

## Commit 5: API Response Shape And Validation

Draft message:

```txt
standardize api responses and validation
```

Purpose:

- Standardize REST success/error responses.
- Add route validators and socket payload validators.

Proposed files:

```txt
src/Common/Interfaces/response.interface.ts
src/Utils/Response/response-helper.utils.ts
src/Middlewares/validation.middleware.ts
src/Middlewares/authentication.middleware.ts
src/Validators/index.ts
src/Validators/User/auth.validator.ts
src/Validators/User/profile.validator.ts
src/Validators/post.validator.ts
src/Validators/comment.validator.ts
src/Validators/react.validator.ts
src/Validators/socket.validator.ts
src/Modules/Users/controllers/auth.controller.ts
src/Modules/Users/controllers/profile.controller.ts
src/Modules/Posts/post.controller.ts
src/Modules/Comments/comment.controller.ts
src/Modules/Reacts/react.controller.ts
src/Modules/Users/services/auth.service.ts
src/Modules/Posts/services/post.service.ts
src/Middlewares/rate-limit.middleware.ts
src/Modules/Chat/chat.events.ts
```

Notes:

- Some files overlap with feature/rate-limit commits.
- We should decide whether response standardization and validators should be split into two commits.

## Commit 6: Documentation And Readiness Tracking

Draft message:

```txt
document api and production readiness
```

Purpose:

- Add client-facing API docs and track remaining production gaps.

Proposed files:

```txt
API_DOCUMENTATION.md
PRODUCTION_READINESS.md
```

Notes:

- `PRODUCTION_READINESS.md` is currently ignored in `.gitignore`, so we must decide whether it should remain ignored or be committed.

## Commit 7: Dependency Audit Updates

Draft message:

```txt
update dependencies for audit fixes
```

Purpose:

- Capture package updates from `npm audit fix`.

Proposed files:

```txt
package.json
package-lock.json
```

Notes:

- This may be better as the first commit or the last commit.
- It should not include `npm audit fix --force`.
- Remaining `nodemailer` advisory should be mentioned in the commit body or PR description.

## Open Decisions

- Should `PRODUCTION_READINESS.md` be removed from `.gitignore` so it can be committed? no
- Should `src/index.ts` be staged in one commit or split manually because it contains several unrelated changes?
- Should response standardization and validation be one commit or two?
- Should dependency audit updates be committed separately from feature/security work?
- Should the branch name be `production-readiness`, `feature/production-readiness`, or something else?
