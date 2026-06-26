# Ken Añabieza — Personal Portfolio

Single-page personal portfolio for **Ken Reymart Añabieza**, an AI Automation Developer & AI Agent Specialist (Philippines). This is an **independent project** — it has nothing to do with any client/employer work. Treat it as its own repo.

- **Live site:** https://kenanabieza.github.io/portfolio/ (GitHub Pages)
- **GitHub repo:** `kenanabieza/portfolio` (private/public personal repo)
- **GitHub account to use:** **`kenanabieza`** (Ken's personal account) — run `gh auth switch --user kenanabieza` before any git/gh work
- **Local working copy:** this folder (`E:\Portfolio`). Edit here, commit, push to `origin/main`; Pages redeploys automatically (~1 min).
- **Owner / contact:** anabieza.acc@gmail.com · linkedin.com/in/kenanabieza · github.com/kenanabieza

## Stack & layout

- **One file does everything:** `index.html` (~2,200 lines). All CSS lives in a single inline `<style>` in `<head>`; all JS is one inline `<script>` before `</body>`. No build step, no framework, no dependencies.
- **Images:** hand-authored SVG "mockups" in `assets/screenshots/`, all `viewBox="0 0 800 500"`. There is no real screenshot tooling — every project image is a drawn SVG (see conventions below).
- **Fonts:** Inter + JetBrains Mono via Google Fonts. Favicon is an inline data-URI SVG ("KA").
- **Theme:** dark site chrome with light Services/Education sections. CSS variables in `:root` (e.g. `--primary:#3b82f6`, `--bg-dark:#0a0a1a`).

### Page sections (in order, each a `<section id>`)
`nav` → `hero` → `about` → `results` → `tools` (Tools & Platforms tiles) → `projects` (filterable grid) → `case-studies` → `services` → `experience` → `education` → `contact` → `footer`. The content sections are wrapped in a `<main id="main">` landmark; there's a visually-hidden skip link.

## Projects grid (the part most often edited)

Filter chips (`.filter-btn[data-filter]`) toggle visibility of project cards (`.project-card[data-category]`) via the inline JS at the bottom. **Order positioning: Claude Code is first everywhere; Voice AI is second.**

Current categories and card counts: `claude`(7), `voice`(2), `n8n`(3), `make`(2), `zapier`(2), `ghl`(7), `agentic`(2), `python`(2).

**Card markup pattern:**
```html
<div class="project-card" data-category="ghl">
    <div class="project-screenshot">
        <img src="assets/screenshots/<name>.svg?v=1" alt="<describe what the mockup shows>">
    </div>
    <div class="project-info">
        <div class="project-tags">
            <span class="project-tag tag-ghl">GoHighLevel</span>
            <span class="project-tag tag-ai">...</span>
        </div>
        <h3 class="project-title">Title</h3>
        <p class="project-desc">2–4 sentences. Concrete, outcome-focused.</p>
        <div class="project-metrics">
            <span class="project-metric">Metric A</span>
            <span class="project-metric">Metric B</span>
        </div>
    </div>
</div>
```

**Tag CSS classes that exist** (defined in the `<style>` block, search `.tag-`): `tag-claude`, `tag-voice`, `tag-n8n`, `tag-make`, `tag-zapier`, `tag-ghl`, `tag-agentic`, `tag-python`, `tag-ai`, `tag-nextjs`, `tag-stripe`, `tag-infra`, `tag-rag`. If you need a new tag color, add a `.tag-<name>` rule next to the others before using it.

## SVG mockup conventions

All mockups are `800×500`. Two visual languages — match the one for the category:
- **Dark "app dashboard/console" style** (used for `claude-*`, `voice-*`, `n8n-scheduling-agent`, `n8n-email-outreach`, `agentic-*`): background `#1A1D23`, cards `#21252B`, borders `#2D3139`, Inter font, muted text `#94A3B8`, status pills with rgba fills. Often a header bar + stat strip + panels/tables.
- **Light "GoHighLevel product UI" style** (used for `ghl-*`): background `#f8fafc`, dark-blue top bar `#1e3a5f` with the three mac dots + "GoHighLevel", white sub-nav, primary blue `#3b82f6`, text `#0f172a`/`#64748b`. Mimics the actual GHL interface (Social Planner, AI Agents, etc.).
- **Older tool-UI mockups** (`make-*`, `zapier-*`, `n8n-lead-system`, `python-scraper`, `python-dashboard`) use `?v=3`-style and their own tool aesthetics; leave them unless asked.

Use `&#183;` (·) as a separator inside mockups. **Never** use em/en dashes (see rules). Keep text inside its boxes — these don't reflow.

## Adding a new project (checklist)

1. Build the SVG mockup in `assets/screenshots/<name>.svg`, matching the category's visual style. Validate it: `python -c "import xml.etree.ElementTree as ET; ET.parse('assets/screenshots/<name>.svg')"`.
2. Add a `.project-card` with the right `data-category`, tags, title, description (2–4 sentences), and two metrics. Reference the SVG with `?v=1`.
3. If it's a brand-new category: add a `.filter-btn[data-filter]` chip (with `aria-pressed="false"`), a `.tag-<name>` CSS rule, and `data-category` on the card.
4. Verify nothing broke (see Verification).
5. Commit + push (`origin main`). Pages redeploys in ~1 min; hard-refresh (`Ctrl+Shift+R`) to see it (browser caches aggressively).

## Hard rules (learned the hard way — keep these)

1. **Anonymize all clients/employers/vendors.** This portfolio repo is **public** — and so is this file (it's served at `/CLAUDE.md`). Client work must be described generically: **never** write the real name of any client, employer, vendor, brand, person, domain, or email that appears in the source projects you adapt. Use generic descriptors ("a B2B parts distributor", "a personal-brand client") and fictional company names in mockups ("Acme Electric", "Cardinal Switchgear"). Keep the actual list of names-to-avoid in a private note **outside this repo** — do not paste it here.
2. **No long dashes anywhere.** Em (—) and en (–) dashes read as AI-generated and the owner does not want them. In prose use commas / periods / colons; in mockup UI use `·` (`&#183;`); for ranges/compounds use a plain hyphen `-`. Grep before committing: `grep -rE '&mdash;|&ndash;|&#8212;|&#8211;|—|–' index.html assets/` should return nothing.
3. **Cache-bust changed SVGs.** When you edit an existing SVG, bump its `?v=N` in `index.html` (e.g. `?v=2` → `?v=3`) so browsers fetch the new version.
4. **Keep numbers internally consistent.** Hero stats, the Results cards, tool-tile counts (e.g. "20+ Workflows"), per-project metrics, and Experience bullets must not contradict each other. Headline totals should exceed the sums of their parts. (`50+` workflows is the all-platform total; hero "Hours Saved / Week" is `150+`.)
5. **One canonical role title:** "**AI Automation Developer & AI Agent Specialist**" — used in `<title>`, `og:title`, `twitter:title`, About, Experience, and footer. Don't introduce a new variant.
6. **Accessibility stays intact.** Keep: the `<main>` landmark + skip link; `aria-pressed` on filter buttons (toggled in JS); `aria-expanded` on the nav toggle (toggled in JS); meaningful `alt` text describing what each mockup shows.

## Verification (run before every commit)

```bash
# All SVGs are valid XML
python -c "import xml.etree.ElementTree as ET,os; [ET.parse('assets/screenshots/'+f) for f in os.listdir('assets/screenshots') if f.endswith('.svg')]; print('svg ok')"
# No long dashes
grep -rE '&mdash;|&ndash;|—|–' index.html assets/ && echo 'DASH FOUND' || echo 'no dashes'
# No leaked client/vendor names — substitute the real terms from your PRIVATE note
# (do not hardcode them in this public file):
grep -riE '<client>|<brand>|<person>|<domain>' index.html assets/ && echo 'LEAK' || echo 'clean'
# Every <img src> resolves and every filter chip has cards — spot check with grep as needed
```

## Standard workflow

```bash
gh auth switch --user kenanabieza
cd E:/Portfolio
git pull --rebase
# ...edit index.html / add SVGs...
# ...run Verification...
git add -A
git commit -m "..."
git push origin main      # GitHub Pages auto-deploys
```

## Gotchas

- Git on Windows warns `LF will be replaced by CRLF` — harmless, ignore.
- GitHub Pages + the browser cache the page hard. If a change "isn't showing," it's almost always cache: hard-refresh or check the live HTML via `gh api repos/kenanabieza/portfolio/pages/builds/latest`.
- This repo was previously edited from a throwaway temp clone. **This folder (`E:\Portfolio`) is now the canonical local working copy** — work here.
- History note: the portfolio used to sit (empty) under `E:\Transfer\Portfolio` on a USB/transfer drive, which loaded unrelated client-project context from that drive's own `CLAUDE.md`. It was moved here on 2026-06-26 specifically to be independent of that.
