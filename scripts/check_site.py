"""Check local assets and fragment links without external dependencies."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.errors.append(f"Duplicate id: {attrs['id']}")
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])
        if tag == "img" and "alt" not in attrs:
            self.errors.append("Image missing alt text")


errors = []
for path in (ROOT / "index.html", ROOT / "previous/index.html"):
    page = Page()
    page.feed(path.read_text())
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = (ROOT / unquote(url.path.lstrip("/")) if url.path.startswith("/")
                  else path.parent / unquote(url.path)) if url.path else path
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            page.errors.append(f"Missing local target: {link}")
        elif url.fragment and target.suffix == ".html":
            other = page if target.resolve() == path.resolve() else Page()
            if other is not page:
                other.feed(target.read_text())
            if unquote(url.fragment) not in other.ids:
                page.errors.append(f"Missing fragment: {link}")
    errors.extend(f"{path.relative_to(ROOT)}: {error}" for error in page.errors)

if errors:
    raise SystemExit("\n".join(errors))
print("PASS: current and previous pages have valid local links, unique IDs, and image alt text.")
