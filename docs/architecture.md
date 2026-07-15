# Стартова архітектура

Репозиторій уже має підготовлений Next.js App Router product shell. У ньому є layout, credentials authentication, role-based navigation, стартові routes, Base UI primitives і shared UI components. Це дозволяє практикантам фокусуватися на product tasks і командному workflow, а не на базовому setup.

## Поточна структура

```text
src/
  auth/
    auth-provider.tsx
    session.ts
    users.ts
  app/
    api/
      auth/
    admin/
    dashboard/
    login/
    register/
    training/
    word-sets/
    layout.tsx
    page.tsx
    globals.css
  components/
    app-shell.tsx
    auth/
    ui/
  lib/
    cn.ts
```

## Рекомендована майбутня структура

```text
src/
  app/                 Next.js routes and route groups
  components/          Shared UI components
  features/            Product modules by feature area
  lib/                 Shared utilities and integration clients
  server/              Server-side business logic
  db/                  Database schema, migrations, and queries
  auth/                Credentials auth and session helpers
```

## Функціональні зони

| Зона | Приклади |
| --- | --- |
| Auth | Registration, login, logout, role checks |
| UI | Base UI primitives, обгорнуті в невеликі local components |
| Word Sets | Set list, set details, selected active set |
| Training | Exercise screens, answer validation, result screen |
| Admin | CRUD для sets і words, CSV/JSON import |
| Progress | Saved answers, accuracy, daily goal, hard words |
| Dashboard | User statistics and recent training sessions |

## Database Position

На старті практики база даних навмисно не підключена. Поточні product tasks мають працювати з typed starter data і local state, щоб практиканти спочатку навчилися базового командного flow: issue, branch, Pull Request, review, CI і deployment.

CSV import task у GitHub Issues - це import preview, а не повноцінний persistence flow. Практикант має вибрати CSV file, розпарсити rows, показати preview і validation errors. Запис у базу даних у цій задачі не потрібен.

Для реального продукту база даних буде потрібна для:

- збереження users і ролей;
- word sets і words;
- imported CSV data;
- training sessions;
- user progress, accuracy і hard words.

Database setup треба додавати окремою reviewed issue, коли команда буде готова перейти від local starter data до persistence. До цього моменту не додаємо Prisma, ORM, migrations або hosted database без окремого рішення керівника практики.

## Правила розробки

- Один PR має бути сфокусований на одній issue.
- Не замінювати credentials auth на інший auth provider без окремої reviewed issue.
- Не додавати database, іншу UI library або testing framework без окремої задачі.
- Reusable UI тримати в `src/components`.
- Feature-specific code додавати в `src/features`, коли фіча почне рости.
- Оновлювати цей документ, якщо змінюються архітектурні рішення.

## Starter Auth

Поточний auth навмисно невеликий:

- seed user: `student@example.com` / `password`;
- seed admin: `admin@example.com` / `password`;
- signed HTTP-only session cookie;
- route handlers для login, register, logout і session lookup.

Це дозволяє працювати з user/admin flows без OAuth або бази даних на старті практики.
