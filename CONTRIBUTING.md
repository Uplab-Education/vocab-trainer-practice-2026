# Правила роботи в репозиторії

Цей репозиторій потрібен не тільки для розробки продукту, а й для навчання командного процесу. Майже кожна зміна має проходити через GitHub Issue, branch, Pull Request, automated checks і review від закріпленого керівника практики.

Коміти, назви branches і назви задач пишемо англійською. Пояснювальну документацію в репозиторії ведемо українською.

## Перед роботою

Цей файл - основна інструкція для практикантів. Починай з нього і повертайся сюди, коли працюєш з issue, branch, commit, Pull Request або review.

Перший крок - виконай свою onboarding issue. У ній є checklist для Git, Node.js, npm, VS Code, extensions і локального запуску.

## Onboarding

1. Відкрий свою onboarding issue на GitHub board.
2. Встанови інструменти з checklist в issue.
3. Створи локальний `.env.local` на основі `.env.example`.
4. Запусти проєкт локально за інструкцією з [README.md](README.md).
5. Прочитай цей файл до кінця.
6. Залиш comment в onboarding issue з версіями `git`, `node` і `npm`.

Команда для `.env.local`:

```bash
cp .env.example .env.local
```

На Windows у PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Не коміть `.env.local` і не додавай реальні secrets у Pull Request.

Onboarding issue не потребує Pull Request, якщо в самій issue не написано інше.

Після onboarding бери product task тільки з колонки `Ready`.

## Корисна документація

Не потрібно знати всі ці технології напам'ять. Коли береш задачу, спочатку подивись на схожий код у репозиторії, а потім відкрий відповідну документацію.

| Якщо треба | Куди дивитися |
| --- | --- |
| Зрозуміти components, props, state, events, lists, conditional rendering | [React Learn](https://react.dev/learn) |
| Додати accessible UI primitive: menu, dialog, popover, tabs, tooltip | [Base UI components](https://base-ui.com/react/components) |
| Зрозуміти як складати Base UI parts у власний компонент | [Base UI composition](https://base-ui.com/react/handbook/composition) |
| Додати або змінити стилі через utility classes | [Tailwind CSS docs](https://tailwindcss.com/docs) |
| Розібратися з TypeScript types, unions, objects, functions | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) |
| Перевірити HTML/CSS basics або browser behavior | [MDN Web Docs](https://developer.mozilla.org/en-US/) |
| Зрозуміти App Router, pages, layouts, route handlers | [Next.js App Router docs](https://nextjs.org/docs/app) |

## Як додавати UI components

Спочатку перевір, чи в репозиторії вже є схожий компонент:

- `src/components/ui` - маленькі reusable components, наприклад buttons, cards, empty states;
- `src/components` - більші application components, наприклад layout або navigation;
- `src/app` - routes і page-level composition.

Правила:

- не копіюй великий компонент у кілька місць;
- якщо компонент повторюється або буде повторюватися, винеси його в `src/components/ui` або `src/components`;
- для interactive primitives спочатку дивись Base UI, а не пиши behavior з нуля;
- для styling використовуй Tailwind classes, якщо немає вагомої причини додавати custom CSS;
- props описуй TypeScript type або interface;
- назва компонента має пояснювати, що він робить: `WordSetCard`, `TrainingProgress`, `EmptyState`.

Мінімальний приклад компонента:

```tsx
type WordSetCardProps = {
  title: string;
  wordCount: number;
};

export function WordSetCard({ title, wordCount }: WordSetCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{wordCount} words</p>
    </article>
  );
}
```

Перед тим як відкривати PR, перевір:

- компонент має зрозумілу назву;
- props typed;
- немає duplicated markup, який краще винести в компонент;
- UI виглядає нормально на desktop і mobile;
- `npm run lint`, `npm run typecheck`, `npm run build` проходять.

## GitHub Board

Board: `Vocabulary Trainer Practice 2026`

Workflow:

```text
Issue -> Branch -> Pull Request -> Supervisor review -> CI -> Merge -> Deploy
```

Колонки на GitHub Project board:

| Колонка | Що означає |
| --- | --- |
| Backlog | Задача існує, але ще не готова до роботи |
| Ready | Задачу можна брати в роботу |
| In progress | Branch створена, робота почалась |
| In review | Pull Request відкритий |
| Changes requested | Керівник попросив правки |
| Done | PR merged, issue закрита |

Переміщуй issue тоді, коли змінюється її реальний статус. Не переміщуй задачу в `Done`, поки PR не merged.

Onboarding tasks можна закривати без Pull Request, якщо це прямо написано в issue.

Правила:

- не починай product task без GitHub issue;
- одна issue має одну основну branch і один Pull Request;
- issue переходить в `In review` тільки після відкриття PR;
- issue переходить в `Changes requested`, якщо керівник попросив правки;
- issue переходить в `Done` тільки після merge;
- approval дає закріплений керівник практики.

## Issues

Product task має містити:

- чітку назву;
- контекст;
- очікуваний результат;
- acceptance criteria;
- технічні notes, якщо потрібно;
- linked Pull Request, коли починається розробка.

Для нових задач використовуй template `.github/ISSUE_TEMPLATE/task.md`.

## Branches

Одна issue = одна branch.

Формат:

```text
type/issue-number-short-description
```

Приклади:

```text
feature/2-word-sets-list
feature/6-training-exercise-flow
test/10-training-logic
fix/18-auth-validation
docs/12-product-usage
```

Назви branches пишемо lowercase, слова розділяємо дефісами.

## Стандартний workflow задачі

Перейти на актуальну `main`:

```bash
git checkout main
git pull
```

Створити branch для issue:

```bash
git checkout -b feature/2-word-sets-list
```

Після змін подивитись статус:

```bash
git status
git diff
```

Запустити перевірки:

```bash
npm run lint
npm run typecheck
npm run build
```

Додати зміни в commit:

```bash
git add .
git commit -m "Build word sets list"
```

Відправити branch у GitHub:

```bash
git push -u origin feature/2-word-sets-list
```

Після цього відкрий Pull Request у GitHub з твоєї branch у `main`.

## Commits

Commit messages пишемо англійською, коротко і конкретно.

Хороші приклади:

```text
Add word set list page
Add training accuracy calculation
Fix empty state for word set filters
Update student guide wording
```

Погані приклади:

```text
changes
fix
updates
final
```

## Pull Requests

Кожен PR має:

- лінкувати issue;
- пояснювати, що змінилося;
- описувати, як перевірити зміни;
- містити screenshots для UI-змін;
- проходити `lint`, `typecheck`, `build`;
- пройти review від закріпленого керівника практики.

Практиканти не approve-ять PR один одного. Обговорювати код можна, але approval дає керівник практики.

## Review Flow

1. Відкрий PR і перемісти issue в `In review`.
2. Дочекайся review від керівника.
3. Якщо є правки, перемісти issue в `Changes requested`.
4. Внеси правки в тій самій branch.
5. Запуш зміни:

```bash
git add .
git commit -m "Address review comments"
git push
```

6. Перемісти issue назад в `In review`.
7. PR можна merge тільки після approval і green CI.

## Корисні Git-команди

Поточна branch і змінені файли:

```bash
git status
```

Історія commit-ів:

```bash
git log --oneline
```

Перемкнутися на іншу branch:

```bash
git checkout branch-name
```

Оновити свою branch змінами з `main`:

```bash
git checkout main
git pull
git checkout your-branch-name
git merge main
```

Скасувати незакомічені зміни в одному файлі:

```bash
git restore path/to/file.tsx
```

Не використовуй destructive commands на кшталт `git reset --hard`, якщо керівник практики прямо не попросив це зробити.

## Definition of Done

Product task можна закривати, коли:

- linked PR merged;
- acceptance criteria виконані;
- CI проходить;
- керівник практики approve-нув PR;
- документація оновлена, якщо змінилась поведінка або setup.
