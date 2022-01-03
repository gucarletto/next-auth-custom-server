A sample full-stack app with a functionally-complete identity management layer.

Tech stack:
 - Next
 - Express (custom server for next)
 - Tailwind
 - Prisma
 - Winston
 - Postgres database

docker-compose up -d --build

Then visit http://localhost:3000 in your browser.


### Features:
- [x] Sign up a new user
- [x] Login an existing user
- [x] Logout a user
- [x] Auto-login after signup
- [x] User profile updates
- [x] Authorized pages and API endpoints
- [x] Request logging
- [x] Clean PII from logs
- [x] SCSS modules
- [x] Admin page to manage users
- [x] 2FA (on console)