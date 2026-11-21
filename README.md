# Mansala Liyanage Portfolio

This is Mansala Liyanage's portfolio. Edit your name, contact links, and projects in `src/data/portfolio.ts`.

## Add your work

Edit the arrays in `src/data/portfolio.ts`:

- **Projects:** Add an entry to `projects` with a unique `id` and `index`, your title, year, role, summary, description, and `tags`. Choose one of the existing `preview` styles (`audio`, `fluid`, `spatial`, or `kinetic`). Put real URLs in `links`, or use an empty array if there is no link. Include `award` only for a real award.
- **Design posters:** Add an entry to `posters` and replace its placeholder details with your own. Put the artwork in `public/` and set `image` to its root-relative path, such as `/posters/my-poster.jpg`. The `art` settings draw placeholder artwork when `image` is absent.
- **Tech stack:** Edit the groups and `tools` in `stack`. Add `{ name: "Tool" }` for a tool you use, or `{ name: "Tool", daily: true }` to show its highlighted daily-use dot.

Keep only work and details you can verify, and update or remove the demo entries as you add your own.

## Local development

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Run `npm run build` to create a production build. Deploy the built application to a hosting provider that supports TanStack Start server rendering.
