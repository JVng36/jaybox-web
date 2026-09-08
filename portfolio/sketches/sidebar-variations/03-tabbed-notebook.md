# 03 · Tabbed Notebook

**Stance:** a stable identity beside a small notebook whose page changes.

## What goes where
- Left: name, short bio and Projects / About / Contact navigation.
- Middle: one visible section at a time inside a paper-like panel.
- Phone: the identity moves above the paper and the navigation becomes horizontal.

## Learn from
`.notebook` sets the two columns. The border belongs to `main`, not to individual projects. The only JavaScript turns working anchor links into accessible tabs, then sets each panel's `hidden` property.

Read the script in this order: discover elements, add tab roles, `selectTab`, pointer handler, keyboard handler, initial selection.

Keyboard behavior: arrow keys change sections, Home/End jump to the first/last section, Tab enters the active page. Without JavaScript all three sections stay visible and the links still work. Active sections are not added to browser history; a production version could use proper routes if sharing each section separately matters.

Try changing `.tabs-ready .panel`'s minimum height to see how it affects short sections. A taller panel looks stable when switching but creates more blank space.

**Strong at:** a compact portfolio with a few well-defined sections.
**Weak at:** long articles or lots of work; a scrolling page is easier to skim and print. Slightly more code to learn than the first two.
**Difference from Sidebar Desk:** the left navigation swaps the middle section instead of scrolling to a different place.

All copy is illustrative. There are no external libraries or network requests.
