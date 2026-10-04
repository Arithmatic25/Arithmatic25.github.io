# Tapan Bhatt — Engineering Portfolio

A responsive static portfolio built with plain HTML, CSS, and JavaScript. No build step, account, API key, or backend is required. Extract the complete ZIP, keep its folders together, and open `index.html` to view the portfolio. The linked FrameLab application is included in `framelab/` and works without a published website address.

The portfolio connects design, dimensional engineering, manufacturing evidence, and coding. It includes four engineering scales, an interactive datum sequence, selected project case studies, material/process considerations, an editable thermal example, a synthetic measurement study, a linear tolerance stack, a Python telemetry replay, and a maker/outdoor story.

## Publishing later on GitHub Pages

1. Create or select the repository intended for this portfolio.
2. Upload the **extracted contents** of this ZIP to the repository root, including `index.html`, all four CSS files, all four JavaScript files, `.nojekyll`, `assets/`, and `framelab/`. Upload the files and folders, rather than the ZIP itself.
3. Open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the publishing branch (typically `main`) and **/ (root)**, then save.
5. Use the published address shown by GitHub after deployment succeeds.

Relative paths support a GitHub project URL as well as a personal-site repository. Official instructions: [configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

This release is prepared for the portfolio’s GitHub Pages repository.

## Editing

| File | Purpose |
| --- | --- |
| `index.html` | Public story, experience, projects, credentials, contact, and accessible control markup |
| `styles.css` / `script.js` | Base presentation, mobile navigation, project dialogs, and linear tolerance stack |
| `bridge.css` / `bridge.js` | Opening, career chapters, synthetic measurement study, calculations, and local engineering-summary export |
| `atlas.css` / `atlas.js` | Four-scale geometry, position/orientation/profile and joining checks, material/process explorer, and thermal model |
| `revisions.css` / `evidence.js` | Datum lab, telemetry replay, maker story, and responsive refinements |
| `assets/Tapan_Bhatt_Resume.pdf` | Public résumé with Honda Auto Development Center — R&D Center wording |
| `assets/Industrial_RSS_Stack.xlsx` | Original supplied educational workbook, unchanged |
| `assets/simulator.py` | Original supplied Python simulator, unchanged |
| `assets/machine_data.jsonl` | Thirty synthetic readings recorded by running that simulator |

Contact links use `tapan_bhatt@outlook.com` and `https://www.linkedin.com/in/-tbhatt1/`.

## Engineering assumptions

### A plane, a round hole, and a radial slot

The primary planar underface A constrains Tz, Rx, and Ry. After A, the secondary round hole B with a Z-axis constrains Tx and Ty. After A and B, the tertiary radial slot C constrains Rz through its width, while its length permits radial float. B is the fixed pivot. This is an ideal rigid-body educational setup with ideal simulator interfaces, not a drawing specification or conformance solver. Fixture contact marks are illustrative and do not use datum target symbols.

The second datum example uses three perpendicular planes: A normal to Z constrains Tz/Rx/Ry; B normal to Y additionally constrains Ty/Rz; C normal to X additionally constrains Tx. These results depend on the shown geometry, orientation, and precedence, not on the letters alone.

### Four variation examples

These are invented educational geometries and requirements; they are not employer CAD or complete inspection/structural analyses.

| Example | Varied feature and check | Illustrative limit | Visual enlargement |
| --- | --- | --- | --- |
| 8 mm mounting insert | Functional-hole XY offset ε: ΔX = 0.8ε, ΔY = 0.6ε; diametral position error = 2ε. Hole ⌀0.90 and pin ⌀0.70 give 0.10 mm radial clearance. | Position zone ⌀0.20 at RFS | Defect/zone offsets 4× |
| 80 mm bracket | Upright planar face tilts relative to fixed A; the zone width needed is 20 × tan(β) mm for 20 mm vertical height. Perpendicular zone planes float in location. | Perpendicularity zone width 0.10 mm | Defect/zone offsets 20× |
| 4.2 m stamped floor | Curved formed rails with kick-ups, stamped skins/beads, tunnel, hat-section crossmembers, lap flanges, and spot-weld marks. Eight distributed stations hold the joining condition. After release, a prescribed Z field is normalized to the marked joint flange. | Selected flange height departure 0.50 mm | Prescribed release shape 180× |
| 8 m wing | Tip airfoil-section profile of a line, with departures along the nominal YZ-section normal. The synthetic field is input × (span/8000)² × sin(πu). Root geometry stays fixed. | Bilateral zone ±0.30 mm, 0.60 mm total | Defect/zone offsets 350× |

The floor reference supplied by the owner informs its general formed construction. Green floor geometry represents a separate fixture base, rests, clamps, and round/slot locators. Violet marks represent illustrative spot welds, not a production weld schedule. Held geometry is idealized. Released geometry is prescribed; no weld-shrinkage, stiffness, clamp-force, or FEA calculation is performed. Fixture labels do not imply a datum-target drawing specification.

In the insert, bracket, and wing examples, A/B/C reference features stay fixed while the functional feature varies. No material-boundary modifiers, datum mobility, imperfect datum surfaces, or complete inspection are modeled. The wing check is section profile, not full-wing surface profile.

### Other demonstrations

- The measurement console uses 36 deterministic synthetic XY hole-center points in an already established datum reference frame. Position error is `2 × hypot(ΔX, ΔY)` compared with a circular-zone diameter. It excludes hole size, bonus tolerance, hole-axis orientation, and datum mobility. Its planar datum illustration has A normal to Z, B normal to X, and C normal to Y.
- Improved locating changes the synthetic mean/spread for comparison; it does not predict a real fixture's performance.
- **Build summary** downloads the current technical summary, assumptions, results, review considerations, and 36-row measurement table. It runs locally.
- The linear stack compares worst case with RSS for three independent dimensions; RSS assumes independent centered sources whose entered half-widths represent equal sigma multiples.
- The RSS section offers the original Excel workbook for download, unchanged.
- Thermal coefficients are editable illustrative assumptions, not material-grade data. Uniform free growth is `alpha × 1e−6 × L × ΔT`; mismatch is specimen growth minus reference growth. Composite alpha represents one assumed direction. Restraint, gradients, moisture, nonlinearity, and full laminate behavior are excluded. Thermal graphics exaggerate changes by 100×.
- The telemetry replay uses readings from the supplied Python script: ten normal, ten rising-temperature, and ten scripted stopped/cooling samples. It is synthetic and local. The stop is authored in the script, not triggered by AI or alarm logic. Temperature/vibration correlation does not establish a diagnosis.

## Public story and evidence

- Honda is presented as **Honda Auto Development Center — R&D Center** throughout the website and public résumé. Original résumé claims and chronology are retained.
- Résumé-reported outcomes: FCF markup time −40%; manufacturing defects −25%; fixture procurement cost −10%; process capability/performance measures +15%; warranty claims approximately −23% from the combined root cause, DOE, and 8D effort.
- VBA automation is ongoing development, with no invented savings percentage. The displayed pseudocode is illustrative; employer code is not distributed.
- FrameLab is included at `framelab/`. Project-card and case-study links open the upgraded app supplied for this revision. Its files retain the original app behavior and engineering notes.
- The Python simulator is demonstrated. Protocol integration, Docker, a dashboard, and AI assistance remain development stages.
- Physical AI, digital twins, and learning OpenUSD are the next chapter. OpenUSD supports scene description, reusable assets, layering, and composition. Physics and a useful digital twin require separate validated behavior, data, and tools.
- The maker section is the final story section, immediately before Let’s connect. It covers 3D printing, kayaking/canoeing, and camping from the owner’s supplied experiences. The original collage is shown through two SVG viewports for robust photo visibility; its underlying pixels remain unchanged.
- The private Tesla interview brief, employer CAD, private code, unverified aircraft-program claims, and invented testimonials are excluded.

## Verification for this revision

- JavaScript syntax and relative asset paths checked; standalone embeds its CSS, scripts, photographs, and downloadable resources.
- Numerically checked acceptance boundaries, pin clearance, fixed reference geometry, bracket face tilt, airfoil normals, unchanged wing root, normalized floor release, and finite coordinates.
- Reviewed all four graphics and model dialogs in Chrome. Checked zero/maximum inputs and both floor states. Default results: insert 0.240 mm diametral position; bracket 0.157 mm zone width; released floor flange 0.800 mm; wing normal deviation 0.450 mm.
- Reviewed readable next-chapter headings, hobby photographs, summary preview, and hobby/contact section order. Mobile rendering reviewed at 320 and 390 px widths.
- Earlier checks of the unchanged datum sequence, project dialogs, FCF controls, thermal model, RSS, telemetry, résumé, and source-download payloads remain applicable.
- No external AI request, analytics, live machine connection, or deployment is part of this revision.

## Technical references

These sources support the general educational explanation, not the invented dimensions or a claim of drawing certification:

- [FARO — holes and slots in precision location](https://www.faro.com/en/Resource-Library/Article/gd-t-in-precision-engineering-using-slots-in-precision-location)
- [KEYENCE — datum types and geometry](https://www.keyence.com/ss/products/measure-sys/gd-and-t/datum/type.jsp)
- [ASME — Y14.5 dimensioning and tolerancing](https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensioning-tolerancing)
- [FAA — Airframe handbook, aircraft construction](https://www.faa.gov/documentlibrary/media/advisory_circular/ac_65-15a.pdf)
- [OpenUSD — introduction and composition](https://openusd.org/release/intro.html)
- [SSAB — springback](https://www.ssab.com/en/support/how-to-process/how-to-bend/how-to-press-brake/how-to-set-up-the-press-brake/springback)
- [Autodesk — shrinkage](https://help.autodesk.com/view/MOLDFLOW/2013/ENU/caas.html?url=caas/vhelp/help-dev-autodesk-com/v/Simulation-Moldflow/enu/2013/Help/2-0Insight/5787-Glossary5787/5994-Shrinkag5994.html)
- [Ersoy et al. — composite spring-in during cure](https://doi.org/10.1016/j.compositesa.2005.02.013)

- [KEYENCE — orientation tolerance](https://www.keyence.com/ss/products/measure-sys/gd-and-t/type/orientation-tolerance.jsp)
- [KEYENCE — profile tolerance](https://www.keyence.ca/ss/products/measure-sys/gd-and-t/type/profile.jsp)
- [Comau — floor sub-weld and BIW framing](https://www.comau.com/en/2026/03/19/leveraging-power-roller-beds-to-reduce-cycle-time-and-unlock-biw-capacity-in-mixed-model-production/)
