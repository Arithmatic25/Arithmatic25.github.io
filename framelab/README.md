# FrameLab GD&T Generator

FrameLab is a browser-based feature control frame builder for ASME Y14.5-style drafting work. It replaces the original font-character border trick with real SVG geometry, so every exported frame has complete, closed borders.

## What is included

- Single, true composite, and independent stacked feature control frames
- Twelve current ASME Y14.5 geometric characteristics
- Appendix C-style `h` proportions: frame height `2h`, characteristic artwork sized within the prescribed working bands, and compact datum compartments
- Shared vector symbol definitions for the preview and PNG copy, with no characteristic-font substitution
- Compact 12 px divider clearance, 2 px borders, and drawn modifier circles with proportionate letters
- Bounded vector header and calculator icons and readable control labels
- Filled-arrow total runout geometry with a horizontal line connecting the arrow tails, touching stacked rows, and datum flags seated directly on the frame
- Full-letter-height drawn diameter symbols and a shared stacked-row layout with aligned columns, equal row heights, and equal text sizes; rows with fewer datums end earlier without stretching their datum cells
- MMC/LMC, datum boundary, projected-zone, tangent-plane, free-state, and unequal-profile modifiers
- Composite datum-sequence guidance and common structural warnings
- Free-text notes, boxed annotations, vector datum flags, and divided-circle datum targets above or below a frame
- PNG clipboard copy and share links
- True-position, MMC bonus, fixed-fastener, projected-zone, and coaxial-clearance calculators
- Responsive desktop and mobile layouts with mm/in conversion

## Use the site

Open `index.html` for basic use. Clipboard image copying works best from HTTPS or localhost because browsers restrict clipboard access on ordinary local-file pages.

The included GitHub Pages workflow publishes the repository on pushes to `main`.

Share links encode the validated frame setup in the URL. No frame data is uploaded by the generator, but anyone who receives a link can read the settings contained in it.

## Export workflow

Use **Copy PNG** to copy the complete output as a high-resolution image with no added outer margins. Use **Copy share link** to reopen the setup later. Copied graphics are not editable text tables. Change tolerances, datums, or labels in the generator and copy again.

Stacked rows share column widths, row height, and text scale. As with composite frames, fewer datums shorten a row without widening its last cell.

Find **Datum target** under **Drafting annotation**. Enter an ID such as `A1` and an optional target size. PNG copy preserves the divided-circle outline and labels.

Enable **Annotation only** below the drafting-annotation fields when you need a datum flag, datum target, boxed note, or free-text annotation without a feature control frame. Preview, PNG copy, and share links all follow this setting.

## Engineering note

The drawing proportions follow the user-supplied nonmandatory Appendix C figures (labelled ASME Y14.5-2009). This is not a claim of independently verified Y14.5-2018 compliance. FrameLab is a drafting and screening aid, not an automated standards-compliance or drawing-approval system. Confirm final requirements using the invoked drawing, thread, fastener, and company standards and obtain qualified engineering review.
