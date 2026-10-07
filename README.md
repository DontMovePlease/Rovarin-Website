# Rovarin Website

Rovarin’s separate static marketing website. No app code, backend, telemetry, cookies, npm dependencies or build step are required.

## Current content

- Homepage: concise consumer introduction, three everyday benefits, real desktop/phone screenshot gallery, local-versus-remote setup, short FAQs and restrained reveal animations. Release highlights link to the existing v0.3.0 notes.
- `/download/`: official v0.3.0 Experimental Alpha installer, checksum, unsigned-installer guidance and noncommercial license information.
- `/security/` and `/faq/`: factual setup, privacy and remote-access information.
- `assets/images/social-preview.png`: 1200×630 website preview.

Screenshots must never include PINs, private addresses, usernames or personal file paths. The included desktop captures were reviewed for those details.

## Local preview and checks

Serve the directory with a static web server. The browser validator in `scripts/validate.cjs` expects the site at `http://127.0.0.1:4173`. Set `ROVARIN_PLAYWRIGHT_PATH` to an existing Playwright installation if it is not normally resolvable; the website itself does not require Playwright.

Validation covers five routes, 320/375/390/430/768/1024/1440px widths, internal links, metadata, JSON-LD, screenshot controls, keyboard menu and reduced motion.

## Hosting

The official production website is:
https://rovarinofficial.com

This project supports static hosting, including Cloudflare Workers static assets or Pages. Deploy only public HTML pages, public `assets/`, `robots.txt`, `sitemap.xml` and `_headers`. Never deploy `.git/`, `.qa/`, README, scripts, backups or local credentials. The Cloudflare account must be authenticated before updating the claimed preview.

The public site is indexable. Its robots policy allows crawling and advertises the sitemap at the current Cloudflare address. If a custom domain is adopted later, update canonical/social metadata and sitemap together. Recalculate the homepage JSON-LD CSP hash in both `index.html` and `_headers` whenever its contents change. Keep the restrictive security headers.

No paid plan or domain purchase is needed for the existing Cloudflare preview. A custom domain is a separate choice. Do not claim physical-device compatibility that has not been verified.


## Search and AI discovery

Public content is served as readable HTML without requiring JavaScript. robots.txt explicitly permits major AI search/user-request crawlers, along with normal search engines; the sitemap lists public pages. Homepage structured data links to the official source repository, current release notes and license. This permits discovery but does not guarantee indexing, ranking or inclusion in an AI answer.
