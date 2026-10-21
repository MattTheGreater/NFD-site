# Upload Guide: deploying this update to your Vercel site

## What's in this zip

```
index.html            ← home (new sections, hyperlinked allies, new email, podcast title, "any reason" phrasing)
cases.html            ← Morgan, Aikins, Dycus, Pankoe with arguments + fallacy breakdowns
anthropology.html     ← NEW: Eastern Orthodox, Roman Catholic, Islam, Judaism, Feminism
history.html          ← NEW: timeline from Rome to Reagan to today
library.html          ← hub to papers / bills / podcast / youtube
papers.html           ← links to your actual PDFs (bundled below)
bills.html            ← Mutual Consent Act + Texas Divorce Code + Legislative Dossier
podcast.html          ← "Breaking the Spell of No-Fault Divorce" + YouTube playlist embed
youtube.html          ← YouTube playlist embed
news.html             ← NEW: updates + counter-narrative short posts
site.css              ← updated with red/green map scheme, hyperlinked allies, new sections
site.js               ← updated map data (all 50 states + DC, case law for key states)
usmap-data.js         ← US map geometry (unchanged)
assets/
  logo-180.png
  logo-700.jpg
  papers/             ← your actual white papers, bundled and ready to serve
    one-page-summary.pdf
    12-arguments.pdf
    mutual-vs-unilateral.pdf
    brief-history.pdf
    aims-and-objectives.pdf
    three-elements.pdf
  bills/              ← your actual bills, bundled and ready to serve
    mutual-consent-act.pdf
    texas-divorce-code.pdf
  dossier/            ← empty; drop your dossier PDF here as "legislative-dossier.pdf"
```

## How to upload to GitHub (replaces everything, keeps site live)

The cleanest way is a drag-and-drop upload that overwrites your current repo contents.

1. **On your computer:** unzip this file somewhere easy to find (Desktop).
2. **Open GitHub:** go to `github.com/MattTheGreater/NFD-site`.
3. **Click `Add file` → `Upload files`.**
4. **Drag the ENTIRE CONTENTS of the unzipped folder into the drop zone.** Include subfolders. GitHub preserves the folder structure (`assets/`, `assets/papers/`, `assets/bills/`).
5. If GitHub prompts to overwrite existing files, say yes.
6. Scroll down, add a commit message like "Full site update: new sections, red/green map, papers and bills", click **Commit changes**.
7. **Vercel auto-redeploys within 30-60 seconds.** Visit `https://www.americansagainstnfd.org` and check.

## Adding your legislative dossier later

I set up `assets/dossier/` as an empty folder. When your dossier PDF is ready:

1. Save it on your computer as `legislative-dossier.pdf` (exact lowercase name).
2. In your GitHub repo, navigate to `assets/dossier/`.
3. `Add file → Upload files`, drag in the PDF, commit.
4. The download button on `/bills` already points to it; it will start working automatically.

Same pattern for adding more white papers: save as PDF, upload to `assets/papers/`, and add a new entry to `papers.html` with a link.

## Updating a single page later

If you only want to edit text (fix a typo, update case status, add a news post):

1. On GitHub, click the file (e.g., `news.html`).
2. Click the pencil icon (top right of the file view).
3. Make your edits in the browser editor.
4. Commit at the bottom.
5. Vercel redeploys in ~30 seconds.

## What's still placeholder vs. ready

**Ready to go live:** all seven navigation pages, the state map (all 50 states + DC + case law), the podcast embed (uses your playlist), the YouTube embed, your six existing white papers.

**Needs your action before fully polished:**

- Form submission (`/#involved`): the form currently only shows a thank-you message. To actually receive submissions, sign up for Formspree.io (free, 50/mo), get an endpoint URL, and in `index.html` change the `<form>` tag to `<form action="https://formspree.io/f/YOUR_ID" method="POST">`. Takes 2 minutes.
- Legislative dossier PDF: drop it into `assets/dossier/` when ready.
- News page: I seeded four counter-narrative posts and one organizational note. Add more by editing `news.html`.
- Any [VERIFY] markers in the state map data: these flag citations our research couldn't confirm against primary sources. Verify when you have time; nothing publishes a false citation that isn't already flagged.
