# Automatic Deployment

Deployment target для цього Next.js проєкту - Vercel. Він автоматично створює preview deployments для Pull Requests і production deployment після merge в `main`.

## Target Flow

| Подія | Очікувана поведінка |
| --- | --- |
| Pull Request opened | Створюється preview deployment |
| Pull Request updated | Preview deployment оновлюється |
| Pull Request merged to `main` | Створюється production deployment |

## Поточний setup

| Що | Значення |
| --- | --- |
| Vercel scope | `uplab` (план Hobby) |
| Vercel project | `vocab-trainer-practice-2026` |
| Production URL | https://vocab-trainer-practice-2026.vercel.app |
| Git repository | `Uplab-Education/vocab-trainer-practice-2026`, підключений до проєкту |
| Framework preset | Next.js, build command `npm run build` |
| Node.js version | 24.x |
| Function region | `fra1` (Франкфурт) |
| Прод-база | Neon resource `vocab-trainer-db`, регіон `fra1` (Франкфурт, `eu-central-1`) |

Function region і регіон бази мають збігатися. Сторінки рендеряться на сервері, тому запити до Postgres підуть з регіону функції, а не з браузера користувача. Якщо рознести їх по континентах, кожен запит до бази додасть ~90 мс.

Deployment Protection вимкнено, тому preview-URL відкриваються за посиланням без логіну у Vercel.

## Environment Variables

| Variable | Required now | Звідки береться | Де встановлено |
| --- | --- | --- | --- |
| `AUTH_SECRET` | Yes | Випадковий рядок, позначений як sensitive | Production, Preview |
| `DATABASE_URL` | Ще не використовується | Автоматично від Neon-інтеграції (pooled connection string) | Production, Preview |
| `DATABASE_URL_UNPOOLED` | Ще не використовується | Автоматично від Neon-інтеграції (direct connection) | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL для майбутніх links/callbacks | Не встановлено |

Neon-інтеграція додає ще набір `POSTGRES_*` і `PG*` змінних - вони приходять у комплекті і застосунком не використовуються.

Environment `Development` навмисно не підключений до Neon: прод-креденшели на машини практиканток не потрапляють.

Не коміть реальні secrets. Реальні значення живуть у Vercel Project Settings і локальному `.env.local`.

## Прод-база даних на Neon

Базу створено через Vercel Marketplace (Storage -> Neon), тому вона керується з того ж Vercel-акаунта і окремий акаунт на neon.com не потрібен. План Free: 0.5 GB сховища, автопризупинення після 5 хвилин простою.

**База створена, але порожня.** На `main` застосунок поки тримає дані у пам'яті (`src/features/word-sets/data.ts`) - схема, ORM і міграції приїжджають окремим Pull Request. `DATABASE_URL` уже чекає у Production і Preview, тож коли той PR зіллється, інфраструктуру піднімати не доведеться: залишиться прогнати міграції.

Коли з'являться міграції, запускати їх на проді буде ТІЛЬКИ керівник практики:

```bash
# Витягнути прод-змінні у тимчасовий файл (НЕ у .env.local - його перезапише)
vercel --scope uplab env pull /tmp/prod.env \
  --environment production --project vocab-trainer-practice-2026

# Міграції - через unpooled connection, DDL погано дружить з пулером
export DATABASE_URL=$(grep '^DATABASE_URL_UNPOOLED=' /tmp/prod.env | cut -d= -f2- | tr -d '"')
# <команда міграцій>

rm /tmp/prod.env
```

Preview deployments використовуватимуть ту саму базу, що й production. Для навчальної практики це прийнятно: дані тестові. Якщо захочеться ізоляції, Neon підтримує [database branching](https://neon.com/docs/introduction) - окрема копія бази на кожен preview.

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
| Production URL | https://vocab-trainer-practice-2026.vercel.app |
| Vercel dashboard | https://vercel.com/uplab/vocab-trainer-practice-2026 |

## Альтернативи

Якщо Vercel недоступний, можна використати Render, Railway, Fly.io або Heroku. У такому разі потрібно оновити цей документ і environment variables до старту deployment-related задач.
