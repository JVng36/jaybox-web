# Jaybox web

This workspace keeps the public and private web presences deliberately separated.

- `landing/` is the public source for `jaybox.dev`.
- `portfolio/` will be public source for `portfolio.jaybox.dev`.

## Public-source rule

Only commit content that is intentionally public: published site code, public copy, and assets cleared for publication. Do not commit credentials, deployment tokens, private notes, unpublished drafts, personal contact data, system inventories, or agent/runtime configuration.

## Deployment model

This public repository will supply two independent Cloudflare Pages projects:

- `landing/` → `jaybox.dev`
- `portfolio/` → `portfolio.jaybox.dev`

Herma's site intentionally lives in a separate private repository at `/home/hermes/projects/herma-site/` and will deploy separately to `herma.jaybox.dev`.
