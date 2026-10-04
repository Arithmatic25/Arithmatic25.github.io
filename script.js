'use strict';

const projectContent = {
  vba: {
    kicker: '01 / ENGINEERING AUTOMATION',
    title: 'Excel VBA for CATIA & 3DCS.',
    lead: 'Turning dimensional engineering knowledge into reusable code: a set of VBA tools under ongoing development for more consistent CATIA and 3DCS model preparation.',
    outcome: 'Engineering knowledge, encoded in repeatable tasks.',
    outcomeNote: 'Development includes point transfer, tree organization, fixture preparation, and Excel-based data exchange. No measured time-saving claim is made here.',
    sections: [
      ['The problem', 'Preparing an assembly variation model involves repetitive operations across the CAD tree, reference points, fixtures, and structured input files. A manual approach creates opportunities for inconsistent naming, hierarchy, and transfer.'],
      ['What I’m building', ['CATIA product and part preparation, including fixture placement at the intended hierarchy.', 'Tree organization using part numbers to make the model easier to navigate.', 'Point copy and transfer tools, including handling parts that have no existing point geometry.', 'Coordinate and IJK direction transformations for mirrored geometry.', 'Excel-driven import and export preparation for fixtures, GD&T, and moves.']],
      ['Engineering considerations', 'Empty parts, locator directions, naming conventions, and model interpretation all matter. A file that imports successfully still needs to be checked against the intended move, geometry, and assembly behavior.'],
      ['My contribution', 'Define the engineering task, build and debug the VBA logic, and check the resulting structure and geometry in CATIA and 3DCS.']
    ],
    tools: ['Excel VBA', 'CATIA V5', '3DCS', 'CSV / structured data'],
    note: 'The schematic and pseudocode illustrate the tool’s ongoing development. Employer code and CAD files are not distributed.'
  },
  fcf: {
    kicker: '02 / ENGINEERING SOFTWARE',
    title: 'FrameLab: Feature Control Frame generator.',
    lead: 'A bridge between geometric design intent and the teams that need to build and inspect it: a web app for GD&T communication and faster drawing markup.',
    outcome: '40% less drawing markup time.',
    outcomeNote: 'Reported in my resume for my Corporate Dimensional Engineer role at TI Automotive.',
    sections: [
      ['The problem', 'Creating geometric tolerance callouts during drawing reviews can be repetitive. Clear feature control frames help communicate design intent between engineering teams, customers, and suppliers.'],
      ['The solution', 'I built a web app for generating Feature Control Frames, bringing a frequent engineering communication task into a reusable tool.'],
      ['Why it matters', 'The tool connects software development with a real dimensional engineering task. Its value lies in making the communication of geometric requirements faster and clearer.'],
      ['My contribution', 'Identified the task, built the web app, and applied my GD&T expertise to the engineering use case.']
    ],
    tools: ['GD&T', 'Feature Control Frames', 'Web app', 'Drawing reviews'],
    note: 'Open FrameLab to build and export a frame. The small preview below shows the difference between MMC and RFS; final drawing requirements need engineering review.',
    extra: 'fcf'
  },
  doe: {
    kicker: '03 / MANUFACTURING IMPROVEMENT',
    title: 'Structured trials. Systematic corrective action.',
    lead: 'Bringing production evidence into engineering decisions through DOE process trials, root cause analysis, and 8D at LA Metal Stamping Co.',
    outcome: 'Approximately 23% fewer warranty claims.',
    outcomeNote: 'Resume-reported outcome of the combined root cause analysis, DOE trials, and 8D effort; it is not attributed to DOE alone.',
    sections: [
      ['The problem', 'Recurring quality issues in stamped parts and assemblies required a systematic way to identify causes and implement corrective action.'],
      ['The approach', 'Used designed process trials as part of an evidence-based investigation, together with root cause analysis and the 8D problem-solving method.'],
      ['Related process-control work', 'Implemented SPC and improved process capability and performance measures by 15%, as reported in my resume. Introduced 3DCS QDM to make production quality data easier to visualize.'],
      ['My contribution', 'Applied statistical process-control methods, supported structured trials, and carried the findings into systematic corrective action.']
    ],
    tools: ['DOE', 'Root cause analysis', '8D', 'SPC', '3DCS QDM'],
    note: 'Trial factors, response data, and experimental settings are not available in the public project material. The matrix on the portfolio is a generic two-factor example, not the actual trial design.'
  },
  variation: {
    kicker: '04 / DIMENSIONAL ENGINEERING',
    title: 'From design intent to assembly behavior.',
    lead: 'The heart of the design-to-manufacturing connection: tolerance modeling links functional requirements to part variation, locating strategy, and assembly sequence.',
    outcome: 'Identify dimensional risk before launch.',
    outcomeNote: 'Core work described in my dimensional engineering roles, including current Body-in-White studies at Honda Auto Development Center — R&D Center.',
    sections: [
      ['What I analyze', '3D and linear tolerance stacks, geometric controls, locator and fixture strategies, and assembly variation affecting fit and finish.'],
      ['How I approach a study', ['Start with the functional requirement and decide what the model needs to measure.', 'Define datums, locating strategy, part variation, and the assembly sequence.', 'Use tolerance analysis to identify the inputs and geometric sensitivities that drive the result.', 'Review the model against design intent before recommending a change.']],
      ['Angular deviation', 'Recent study discussions explored how combined translation and rotation affect a mounted plane, including yaw, pitch, roll, and overall angular deviation. Correct coordinate frames and measurement definitions are essential.'],
      ['Beyond the model', 'Developed secondary fixture and gauging standards, supported DFM and PFMEA reviews, and improved fixture procurement alignment with program timing.']
    ],
    tools: ['3DCS', 'CETOL 6σ', 'CATIA V5 / FTA', 'GD&T', 'Monte Carlo', 'RSS'],
    note: 'Customer geometry, actual program tolerances, and simulation results are not reproduced. The interactive stack on this page is a separate educational example.'
  }
};

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#main-nav');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

const dialog = document.querySelector('#project-dialog');
const dialogBody = document.querySelector('#dialog-body');
let lastProjectButton = null;
const escapeHtml = text => text.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function openProject(key, trigger) {
  const item = projectContent[key];
  if (!item) return;
  lastProjectButton = trigger;
  document.querySelector('#dialog-kicker').textContent = item.kicker;
  dialogBody.innerHTML = `<h2 id="dialog-title">${escapeHtml(item.title)}</h2><p class="dialog-lead">${escapeHtml(item.lead)}</p><div class="case-outcome"><strong>${escapeHtml(item.outcome)}</strong><p>${escapeHtml(item.outcomeNote)}</p></div>${item.sections.map(([title, content]) => `<section class="case-section"><h3>${escapeHtml(title)}</h3>${Array.isArray(content) ? `<ul>${content.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : `<p>${escapeHtml(content)}</p>`}</section>`).join('')}<div class="case-tools">${item.tools.map(tool=>`<span>${escapeHtml(tool)}</span>`).join('')}</div><p class="case-note">${escapeHtml(item.note)}</p>${item.extra === 'fcf' ? `<section class="fcf-example" aria-labelledby="fcf-demo-title"><a class="button button-dark framelab-link" href="./framelab/" target="_blank" rel="noopener noreferrer">Open FrameLab ↗</a><h3 id="fcf-demo-title">Illustrative frame preview</h3><div class="frame-demo" role="img" aria-label="Position tolerance: diameter 0.20 at maximum material condition, relative to datums A, B, and C"><span>⌖</span><span id="fcf-tolerance">⌀ 0.20 Ⓜ</span><span>A</span><span>B</span><span>C</span></div><label for="fcf-modifier">Position tolerance example</label><select id="fcf-modifier"><option value="mmc">Diameter 0.20 · maximum material condition</option><option value="rfs">Diameter 0.20 · regardless of feature size</option></select></section>` : ''}`;
  if (item.extra === 'fcf') {
    document.querySelector('#fcf-modifier').addEventListener('change', event => {
      const isMmc = event.target.value === 'mmc';
      document.querySelector('#fcf-tolerance').textContent = isMmc ? '⌀ 0.20 Ⓜ' : '⌀ 0.20';
      document.querySelector('.fcf-example .frame-demo').setAttribute('aria-label', `Position tolerance: diameter 0.20 ${isMmc ? 'at maximum material condition' : 'regardless of feature size'}, relative to datums A, B, and C`);
    });
  }
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (lastProjectButton) lastProjectButton.focus(); });

const toleranceInputs = ['a','b','c'].map(id => document.querySelector(`#tol-${id}`));
function updateStack() {
  const values = toleranceInputs.map(input => Number(input.value));
  toleranceInputs.forEach((input, index) => { document.querySelector(`#out-${['a','b','c'][index]}`).textContent = `±${values[index].toFixed(2)} mm`; input.setAttribute('aria-valuetext', `Plus or minus ${values[index].toFixed(2)} millimeters`); });
  const worst = values.reduce((total,value)=>total+value,0);
  const rss = Math.sqrt(values.reduce((total,value)=>total+value*value,0));
  document.querySelector('#worst-case').innerHTML = `±${worst.toFixed(2)} <small>mm</small>`;
  document.querySelector('#rss-value').innerHTML = `±${rss.toFixed(2)} <small>mm</small>`;
  document.querySelector('#worst-bar').style.width = `${worst / 3 * 100}%`;
  document.querySelector('#rss-bar').style.width = `${rss / 3 * 100}%`;
}
toleranceInputs.forEach(input => input.addEventListener('input', updateStack));
document.querySelector('#reset-stack').addEventListener('click', () => { toleranceInputs.forEach((input,index)=>input.value=[.30,.20,.10][index]); updateStack(); });
updateStack();
document.querySelector('#year').textContent = new Date().getFullYear();
