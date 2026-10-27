# Executive English Studio

Teacher Wayne's executive English coaching application. This standalone package
is ready to upload to a GitHub repository and run on a Node.js host.

## Included

- `server.js`: Express backend with server-side Google Gemini requests and PostgreSQL contact capture.
- `public/index.html`: HTML/Tailwind studio with four modules, 40 supplied templates,
  Teacher Wayne's introductory note, follow-up chat, and consent-based contact form.
- `public/korea.html`, `public/japan.html`, `public/taiwan.html`: the supplied country pages,
  including embedded images and QR codes. Each page links to the studio with its country selected.
- `public/assets/`: compiled Tailwind styling, ready to use without a build step.
- `public/templates.js`: ten templates per module, preserving the supplied wording.
- `source/index.css`: editable Tailwind source for reference. The ready-to-run CSS is in `public/assets/`.
- `database/schema.sql`: empty database schema, no saved contact details.
- `reference/`: original supplied country HTML and 40-template text for reference.
- `.env.example`: variable names only, no credentials.

## Run locally

Requires Node.js **22.9 or newer** and a PostgreSQL database for saving contacts.

1. Install dependencies: `npm install` (or `pnpm install`).
2. Copy `.env.example` to `.env`.
3. Add your own `GEMINI_API_KEY` and `DATABASE_URL` to `.env`.
4. For a **new external/local PostgreSQL database**, initialize the empty table:
   `psql "$DATABASE_URL" -f database/schema.sql`
   Alternatively, run the contents of the file in your database provider's SQL editor.
   Do not use this script to migrate Replit-managed production databases.
5. Start: `npm start` (or `pnpm start`).
6. Open `http://localhost:3000`.

No Replit account, monorepo, Vite server, or frontend build is required to run
this standalone export. You must serve it through Node, not open the HTML files directly.
The source workspace retains Vite for editing and rebuilding Tailwind styles.

Run `npm run check` for JavaScript syntax checks and `npm test` to verify the
packaged templates, landing pages, personal note, and compiled stylesheet.
For reproducible dependency installation, use `pnpm install --frozen-lockfile`
with the included lockfile.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio key, used only on the server |
| `DATABASE_URL` | PostgreSQL connection string for saving coaching-contact requests |
| `PORT` | Listening port, defaults to 3000 |

Without a Gemini key the page and illustrative examples still open, but generation
and chat return an explicit configuration error. Without a configured database,
the contact form returns an explicit error instead of pretending to save.

## Upload to GitHub

Create an empty repository, unzip this package, and upload its contents, including
the hidden `.gitignore` and `.env.example`. Do **not** upload `.env`, `node_modules`,
credentials, or database exports. If using Git locally:

```sh
git init
git add .
git commit -m "Add Executive English Studio"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

GitHub stores the code; **GitHub Pages cannot run this backend**. Deploy to a host
that runs a persistent Node.js process. Set its start command to `npm start`,
configure `GEMINI_API_KEY` and `DATABASE_URL` in that host's secret manager, and
use HTTPS. Replit Secrets do not automatically transfer to GitHub or another host.

## Operation and boundaries

- Text sent for refinement or follow-up chat is sent to Google Gemini.
- Contact data is saved to PostgreSQL with consent. No email notification, CRM
  connection, or public contact-list endpoint is configured.
- Pronunciation coaching is written guidance, not generated speech.
- Country pages retain their original external LINE, WhatsApp, email, social,
  and Google Fonts links. These services and remote fonts require internet access.
  An unfinished editorial placeholder was removed from the Korean public page;
  the unmodified original is retained under `reference/`.
- Chats and generated outputs are kept in memory in the current browser page,
  not saved as a private coaching history.
- An in-memory request limit protects a single server process. Add shared rate
  limiting and abuse monitoring before scaling to multiple instances.
- The studio intentionally provides no public way to read saved leads. Access
  them through your database provider using appropriate permissions.
- The database's contents are not in this package; back up or transfer existing
  contact data separately through a secure process if you need it.

## Updating this export

In the original source project, run:

```sh
pnpm --filter @workspace/executive-studio export:github
```

This rebuilds styling and produces a fresh clean package. Changes made only inside
an old ZIP are not automatically reflected in the source project.
