# Portfolio site

The **Tabbed Notebook** layout, built with React and plain CSS. Your name and short introduction sit beside a paper-like panel with Projects, About me, and Contact tabs. On small screens the sidebar moves above the panel.

This folder is the public source for the separate `portfolio.jaybox.dev` Cloudflare Pages project. The current text is illustrative. Do not link a résumé, real work samples, or professional contact details until Jay has reviewed the exact public copy. A local build is not permission to publish it.

## Run locally

Use Node.js 24, which includes npm.

Run these commands inside the `portfolio/` folder:

```sh
npm ci
npm run dev
```

Open the local address Vite prints. Editing a source file updates the page automatically. If Vite runs on a remote computer, use your editor's port forwarding to reach that local address.

## Where to start reading and editing

The entry path is `index.html` → `src/main.jsx` → `src/App.jsx`.

| File | Purpose |
| --- | --- |
| `src/App.jsx` | The visible page and its sample text. `Projects`, `About`, and `Contact` are small components in this file. The `App` component below them puts the page together. |
| `src/index.css` | Colors, spacing, typography, the two-column layout, and the mobile layout. The stylesheet is split into numbered sections. |
| `src/main.jsx` | Connects React to the HTML page. You do not need to edit this to change your portfolio content. |
| `index.html` | The browser title, description, favicon link, and root element. |
| `tests/notebook.spec.js` | Browser checks for tab selection, keyboard use, project notes, direct links, and responsive layout. |

**For your first edits, ignore the keyboard code.** Change a project title or description in `Projects`, then save and look at the browser. Next, try changing a color in the stylesheet's `:root` block.

The project markup is intentionally written out instead of using a content database or configuration system. To add a project, duplicate one complete `<article className="project">` in `Projects` and change its text.

## How the tabs work

- `sections` lists the section IDs and button labels.
- `useState` stores `activeSection`, which determines the selected button and visible panel.
- `aria-selected` also controls the selected button's CSS styling.
- The other panels use `hidden`, rather than being removed. An open project note stays open when you switch away and back.
- `useRef` keeps references to the buttons so arrow keys can move keyboard focus.
- `useEffect` listens for changes to the mobile breakpoint and cleans up that listener when the component is removed.
- Desktop tabs use Up/Down; mobile tabs use Left/Right. Home and End jump to the first and last tabs. Tab moves into the selected page.
- Project notes use the browser's own `<details>` and `<summary>` elements, not another state variable.

The mobile breakpoint is **760px** in both `App.jsx` and `index.css`. Change both if you change that breakpoint.

Opening `/#work`, `/#about`, or `/#contact` selects that initial section. Unknown fragments fall back to Projects. Like the original sketch, switching tabs is local UI state: it does not add browser history entries or rewrite the URL. Reloading uses the URL's initial section again.

This React app requires JavaScript. The original standalone sketch remains at `sketches/sidebar-variations/03-tabbed-notebook.html`, including its non-JavaScript fallback, for reference. The sketches are not imported into the app.

## Check your changes

```sh
npm run lint
npm run build
```

The build writes `dist/`. You can inspect that build locally with `npm run preview`.

For the browser tests, install Chromium once, then run the suite:

```sh
npx playwright install chromium
npm test
```

On a fresh Linux machine, Playwright may also need system browser libraries; its installer will report what is missing. The tests start their own loopback-only Vite server on port 5174 and stop it afterward. Port 5174 must be free.

Playwright is a **development-only** test dependency. The website itself uses only the existing React runtime and plain CSS. Test output is ignored by Git.

## Publishing boundary

Keep source inside this repository's `portfolio/` directory. Do not move it into a separate repository. The deployment remains separate from the main Jaybox site. No new publishing configuration or public contact information is part of this layout implementation.
