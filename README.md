# Dan Hoffkins portfolio

Static portfolio published through GitHub Pages at https://dhoffkins83.github.io/.

## Edit and preview

- `index.html`: current portfolio content.
- `assets/css/site.css`: responsive styles, including reduced-motion support.
- `assets/js/site.js`: navigation and workflow comparison.
- `resume.pdf`: current public resume; replace this file to keep links stable.
- `previous/`: preserved previous design. Its content is intentionally historical.

Run `python3 -m http.server 8765 --bind 127.0.0.1` and open
http://127.0.0.1:8765/. Run `python3 scripts/check_site.py` and
`node --check assets/js/site.js` before publishing.

Push reviewed commits to `main` to update the existing GitHub Pages site.
The legacy branch-preview workflow is separate from main-site publishing.
Undo an update with `git revert <commit>` followed by a push, rather than
rewriting shared history.

Older named PDFs remain for existing links. Use `resume.pdf` for new links.
Keep private company data, credentials, and internal screenshots out of this repo.
