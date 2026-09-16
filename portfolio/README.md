# Portfolio site

The **Tabbed Notebook** layout, built with React and plain CSS. Jay's name and short introduction sit beside a paper-like panel with projects, About me, and Contact tabs. On small screens the sidebar moves above the panel.

This folder is the public source for the separate `portfolio.jaybox.dev` Cloudflare Pages project. The project copy refers to public repositories, with source references in `CONTENT.md`. Review the exact project and About copy with Jay before publishing. Contact uses the LinkedIn profile and email address Jay explicitly selected for this portfolio. It has no contact form or email backend. A local build is not permission to publish it.

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
| `src/App.jsx` | The page markup, shared `workTitle`, About and Contact text, and tab behavior. `Projects` receives its heading as a prop. The `App` component below puts the page together. |
| `src/projects.js` | Project titles, categories, descriptions, technology labels, notes, and public GitHub links. Array order is display order. |
| `src/index.css` | Colors, spacing, typography, the two-column layout, and the mobile layout. The stylesheet is split into numbered sections. |
| `src/main.jsx` | Connects React to the HTML page. You do not need to edit this to change your portfolio content. |
| `index.html` | The browser title, description, favicon link, and root element. |
| `tests/notebook.spec.js` | Browser checks for tab selection, keyboard use, project notes, direct links, and responsive layout. |
| `tests/polish.spec.js`, `tests/project-actions.spec.js` | Checks the public name, availability, direct copy, and shared action rows. |
| `tests/portfolio.spec.js` | Checks project order and links, personal copy, metadata, and phone-sized link targets. |
| `CONTENT.md` | Public evidence behind the project descriptions and boundaries to preserve when editing. |

**For your first edits, ignore the keyboard code.** Change a project title or description in `src/projects.js`, then save and look at the browser. Next, try changing a color in the stylesheet's `:root` block.

There is no content database or CMS. `projects` is an ordinary array of objects, rendered with `.map()` just like the navigation. To add a project, duplicate an object, give it a unique `id`, and edit its text and URL. Each item in `notes` becomes a paragraph in an expandable note below the project's action row.

The shared-title path is `workTitle` → `<Projects title={workTitle} />` → `function Projects({ title })` → `<h2>{title}</h2>`. The tab label uses the same `workTitle` value. IDs such as `work` stay separate from the displayed wording.

## Notebook styling

Section **6. Margin notebook** at the end of `src/index.css` contains the paper details:

- `--rule` colors the blue entry dividers; `--margin-rule` colors the vertical margin. Each has a light and dark value.
- `main::before` draws the margin as an empty decorative element. `pointer-events: none` lets clicks pass through it.
- `main` uses a small `box-shadow` to suggest another sheet underneath.
- The selected navigation button has a stronger edge and rounded outer corners, like an index tab.
- The final mobile rule narrows the margin and moves the selected tab's stronger edge to the top.

These are CSS-only decorations. The content and React controls do not depend on them. There are no paper images, additional font downloads, or animation libraries. `tests/margin-notebook.spec.js` checks the rules and usable space in both palettes on desktop and phones.

## How the tabs work

- `sections` lists the section IDs and button labels.
- `useState` stores `activeSection`, which determines the selected button and visible panel.
- `aria-selected` also controls the selected button's CSS styling.
- The other panels use `hidden`, rather than being removed. An open project note stays open when you switch away and back.
- `useRef` keeps references to the buttons so arrow keys can move keyboard focus.
- `useEffect` listens for changes to the mobile breakpoint and cleans up that listener when the component is removed.
- Desktop tabs use Up/Down; mobile tabs use Left/Right. Home and End jump to the first and last tabs. Tab moves into the selected page.
- Each `Project` component keeps its own `notesOpen` state. The note button exposes `aria-expanded` and `aria-controls`; the linked note stays mounted and uses `hidden` when closed. The button and GitHub link share a wrapping action row, while expanded notes use the full project width.

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

When intentionally changing the shared title, update `workTitle` in `tests/notebook.spec.js` as well. When adding or reordering projects, update `expectedProjects` in `tests/portfolio.spec.js`. The tests should describe the intended content, not silently accept any array the app renders.

## Publishing boundary

Keep source inside this repository's `portfolio/` directory. Do not move it into a separate repository. The deployment remains separate from the main Jaybox site. No publishing configuration is changed by the content update. Do not add private project material, host details, credentials, a résumé, or personal contact information without a separate review.
