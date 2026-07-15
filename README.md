# Vocabulary Trainer Practice 2026

Репозиторій для проєктно-технологічної практики. Продукт: вебзастосунок для вивчення англійської лексики з рольовим доступом, інтерактивними тренуваннями, наборами слів, адмінським керуванням контентом і персональним dashboard користувача.

Окрім продукту, цей репозиторій використовується для навчання командного процесу: GitHub board, issues, branches, pull requests, code review, CI checks і automatic deployment.

## Технології

| Частина | Рішення |
| --- | --- |
| Мова | TypeScript |
| Framework | Next.js App Router |
| UI primitives | Base UI |
| Styling | Tailwind CSS |
| Package manager | npm |
| Runtime | Node.js 24+ |
| CI | GitHub Actions |
| Deployment | Vercel recommended |

У репозиторії вже є базовий layout, credentials authentication, role-based navigation, стартові product routes і shared UI components. Поточні задачі працюють з typed starter data і local state; базу даних, додаткові UI libraries і test tooling потрібно додавати тільки через окремі issues та reviewed pull requests.

## Стартові облікові записи

Для локальної розробки доступні seed accounts:

| Role | Email | Password |
| --- | --- | --- |
| User | `student@example.com` | `password` |
| Admin | `admin@example.com` | `password` |

Auth використовує signed HTTP-only session cookie. Ці seed accounts потрібні для локальної розробки й пізніше можуть бути замінені користувачами з бази даних.

## Локальний запуск

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Для локальної розробки `.env.local` створюється на основі `.env.example`. Реальні secrets не комітимо.

Відкрити:

```text
http://localhost:3000
```

## Перевірки перед Pull Request

```bash
npm run lint
npm run typecheck
npm run build
```

## Як працюємо

Коротко: кожна product task проходить через `Issue -> Branch -> Pull Request -> Review -> CI -> Merge`.

Правила, команди, приклади і статуси GitHub board описані в [CONTRIBUTING.md](CONTRIBUTING.md).

## Для практикантів

Починати тут:

1. Прочитати [CONTRIBUTING.md](CONTRIBUTING.md).
2. Виконати свою onboarding issue.
3. Після onboarding взяти product task з GitHub board.
4. Працювати за правилами з `CONTRIBUTING.md`.

## Документи

| Документ | Для чого |
| --- | --- |
| [план.md](%D0%BF%D0%BB%D0%B0%D0%BD.md) | Загальний план практики |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Основна інструкція для практикантів: onboarding, Git, issues, branches, commits і Pull Requests |
| [docs/deployment.md](docs/deployment.md) | Як працює automatic deployment |
| [docs/architecture.md](docs/architecture.md) | Стартова архітектура проєкту |

## Definition of Done

Product task готова, коли є linked issue, окрема branch, Pull Request з описом змін, green CI, approval керівника практики і потрібні оновлення документації.
