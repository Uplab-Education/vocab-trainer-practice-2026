# Automatic Deployment

Рекомендований deployment target для цього Next.js проєкту - Vercel. Він автоматично створює preview deployments для Pull Requests і production deployment після merge в `main`.

## Target Flow

| Подія | Очікувана поведінка |
| --- | --- |
| Pull Request opened | Створюється preview deployment |
| Pull Request updated | Preview deployment оновлюється |
| Pull Request merged to `main` | Створюється production deployment |

## Початковий Vercel setup

1. Створити або відкрити Vercel team/project.
2. Import GitHub repository.
3. Вибрати Next.js framework preset.
4. Залишити build command:

```bash
npm run build
```

5. Додати environment variables з `.env.example`, коли вони стануть потрібні.
6. Перевірити, що Vercel створює preview deployments для Pull Requests.

## Environment Variables

Поточні starter variables:

| Variable | Required now | Для чого |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL для майбутніх links/callbacks |
| `DATABASE_URL` | No | Placeholder для майбутньої database setup |
| `AUTH_SECRET` | Yes | Secret для signed session cookie |

Не коміть реальні secrets. Реальні значення додаються в Vercel Project Settings і локальний `.env.local`.

## GitHub Actions і Deployment

GitHub Actions перевіряє якість коду. Vercel відповідає за deployment.

Рекомендований branch protection для `main`:

- require GitHub Actions CI to pass;
- require pull request review from the assigned supervisor;
- block direct pushes to `main`.

## Де дивитися результат

| Що потрібно | Де дивитися |
| --- | --- |
| CI result | GitHub PR checks |
| Preview URL | GitHub PR deployment section або Vercel dashboard |
| Build logs | Vercel deployment details |
| Production URL | Vercel project dashboard |

## Альтернативи

Якщо Vercel недоступний, можна використати Render, Railway, Fly.io або Heroku. У такому разі потрібно оновити цей документ і environment variables до старту deployment-related задач.
