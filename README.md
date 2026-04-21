# Noshinto — Portfolio

A minimalist Next.js portfolio site. Static-exported, deploys to GitHub Pages via Actions.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Adding a new project (the "Work" section)

Each project is a folder under `public/work/<slug>/`. The folder name becomes the URL slug.

1. Create a folder: `public/work/my-new-project/`
2. Drop your images into it. Any `.jpg .jpeg .png .webp .avif .gif .svg` files are picked up automatically, sorted by filename. Tip: prefix with `01_`, `02_`, … to control order.
3. Add a `project.md` file in the same folder:

```markdown
---
title: My New Project
year: 2025
role: Photography, Direction
location: Paris
order: 1
summary: One-line description shown on the grid and the project header.
cover: 01.jpg        # optional — defaults to the first image alphabetically
# images:            # optional — explicit ordering, otherwise alphabetical
#   - 03.jpg
#   - 01.jpg
#   - 02.jpg
---

Optional longer body text. Appears below the images.
Supports plain paragraphs separated by blank lines.
```

4. Commit and push to `main` — the GitHub Action rebuilds and redeploys.

### Ordering projects on the grid

Set `order:` in each `project.md`. Lower numbers appear first. Projects without `order` sort to the end.

### Replacing the logo

Drop your circular logo as `public/logo.svg` (or change the `img` src in `src/components/Nav.tsx`). It's rendered inside a circular mask, so any square image works; a transparent SVG or PNG is ideal.

### Changing the contact email, name, socials

- Email & links: `src/app/contact/page.tsx`
- Site name in the nav: `src/components/Nav.tsx`
- Bio: `src/app/about/page.tsx`
- Site title / meta: `src/app/layout.tsx`

## Deploying to GitHub Pages

1. Push the repo to GitHub.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically.

The workflow auto-detects whether the repo is a user site (`<user>.github.io`) or a project site and sets the base path accordingly.

### Custom domain (optional)

Add a file `public/CNAME` containing your domain, e.g.:

```
www.example.com
```

Then configure the A/CNAME records with your DNS provider per GitHub's docs. With a custom domain you don't need a base path — the workflow handles this when the repo is named `<user>.github.io`, or you can set `NEXT_PUBLIC_BASE_PATH=""` in the workflow env.

## Adding a CMS (later, optional)

If you'd rather upload images through a web UI than push to git, add [Decap CMS](https://decapcms.org/) — it commits changes back to this repo and works fine with static export. Wire it up at an `/admin` route pointing at `public/work/`.
