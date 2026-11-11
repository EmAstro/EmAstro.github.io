# emastro.github.io

Personal website of Emanuele Paolo Farina, served by GitHub Pages.
Plain static HTML: no build step, no frameworks, no jQuery.

## Layout

```
index.html, about.html, research.html,
publications.html, contact.html   Main site pages
css/site.css                      All styles (commented, with a table of contents)
js/site.js                        Mobile menu, scroll animations, carousel,
                                  back-to-top button, sortable tables
fonts/                            Icon fonts, subset to the glyphs in use
images/                           Images used by the main site

requiem/                          REQUIEM survey pages
  css/requiem.css                 Orange theme and reading layout (serif text
                                  column, figures, team/paper lists, table);
                                  navigation and banner come from ../css/site.css
  images/, movies/                REQUIEM media (MP4 videos with poster frames)

aether/                           Aether survey pages (self-contained)
push.sh                           Commit and push everything
```

## Common edits

- **Change a colour:** edit the variables at the top of `css/site.css`
  (`requiem/css/requiem.css` for REQUIEM).
- **Add a page:** copy an existing page, keep the `<nav>` block, and move
  `class="active"` to the new menu item. The navigation is repeated in every
  page, so a new menu entry must be added to each of them.
- **Fade-in on scroll:** add `class="reveal"` to an element; optionally
  `data-reveal="fade"`, `"left"` or `"right"` (default slides up).
- **Image carousel:** see the `.carousel` blocks in `research.html`.
- **Sortable table:** `<table class="data-table" data-sortable>` with a
  `<thead>` and a `<tbody>`.
- **New icon:** the fonts in `fonts/` contain only the glyphs listed in
  section 4 of `css/site.css`. To add one, subset the original Icomoon or
  Themify font again including its code point, e.g.
  `pyftsubset themify.ttf --unicodes=U+e602,... --flavor=woff2`.

## Credits

Design based on a template by GetTemplates.co. Icons from Icomoon and
Themify Icons.
