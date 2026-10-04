'use strict';

// One deterministic educational experiment; no customer geometry or measurements.
function seededUniform(seed) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + 0.5) / 4294967296; };
}
const uniform = seededUniform(42);
function gaussian() { return Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()); }
const baseMeasurements = Array.from({length:36}, (_,i) => ({id:i+1, x:0.060 + gaussian()*0.043, y:0.025 + gaussian()*0.033}));
let fixtureMode = 'baseline';
let bridgeResult = null;
let currentBriefUrl = null;

function currentMeasurements() {
  return fixtureMode === 'improved'
    ? baseMeasurements.map(point => ({id:point.id, x:0.015+(point.x-0.060)*0.7, y:0.006+(point.y-0.025)*0.7}))
    : baseMeasurements.map(point => ({...point}));
}
function inspectMeasurements(points, zoneDiameter) {
  const measured = points.map(point => ({...point, positionError:2*Math.hypot(point.x,point.y)}));
  const within = measured.filter(point => point.positionError <= zoneDiameter).length;
  const meanX = measured.reduce((sum,p)=>sum+p.x,0)/measured.length;
  const meanY = measured.reduce((sum,p)=>sum+p.y,0)/measured.length;
  return {points:measured,zoneDiameter,within,total:measured.length,outside:measured.length-within,meanX,meanY,meanOffset:Math.hypot(meanX,meanY),worst:Math.max(...measured.map(p=>p.positionError)),fixtureMode};
}
function svgElement(tag,attributes) { const el=document.createElementNS('http://www.w3.org/2000/svg',tag); for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value)); return el; }
function updateBridge() {
  const limit=Number(document.querySelector('#position-tolerance').value);
  bridgeResult=inspectMeasurements(currentMeasurements(),limit);
  const result=bridgeResult;
  document.querySelector('#position-output').textContent=`⌀${limit.toFixed(2)} mm`;
  document.querySelector('#frame-limit').textContent=limit.toFixed(2);
  document.querySelector('#position-tolerance').setAttribute('aria-valuetext',`Position zone diameter ${limit.toFixed(2)} millimeters`);
  document.querySelector('#live-frame').setAttribute('aria-label',`Position tolerance diameter ${limit.toFixed(2)}, regardless of feature size, relative to datums A, B, C`);
  const scale=550;
  document.querySelector('#position-zone').setAttribute('r',limit*scale/2);
  const pointsGroup=document.querySelector('#measurement-points');
  pointsGroup.replaceChildren(...result.points.map(point=>{
    const circle=svgElement('circle',{cx:217.5+point.x*scale,cy:140-point.y*scale,r:4,fill:point.positionError<=limit?'#8ecbff':'#ffad72','fill-opacity':0.9,stroke:'#131e27','stroke-width':1});
    const title=svgElement('title',{});title.textContent=`Part ${point.id}: ΔX ${point.x.toFixed(3)} mm, ΔY ${point.y.toFixed(3)} mm; position error ${point.positionError.toFixed(3)} mm`;circle.append(title);return circle;
  }));
  document.querySelector('#mean-mark').setAttribute('transform',`translate(${result.meanX*scale} ${-result.meanY*scale})`);
  document.querySelector('#demo-pass').innerHTML=`${result.within}<small>/ ${result.total}</small>`;
  document.querySelector('#demo-mean').innerHTML=`${result.meanOffset.toFixed(3)}<small>mm</small>`;
  document.querySelector('#demo-worst').innerHTML=`${result.worst.toFixed(3)}<small>mm</small>`;
  document.querySelector('#demo-verdict').textContent=result.outside===0
    ?'All 36 sample centers meet this position requirement. Keep checking the process over time.'
    :`${result.outside} of 36 sample centers are outside the zone. Investigate the locating setup and process spread.`;
  document.querySelector('#demo-insight').textContent=`The code checked 36 points against a ⌀${limit.toFixed(2)} mm zone. ${result.within} passed. A summary carries the measurements, assumptions, and results together.`;
  document.querySelector('#measurement-desc').textContent=`Thirty-six synthetic hole centers: ${result.within} within the ${limit.toFixed(2)} millimeter diameter circular tolerance zone and ${result.outside} outside. Mean center offset ${result.meanOffset.toFixed(3)} millimeters. Axes show deviation from nominal in millimeters.`;
}
document.querySelector('#position-tolerance').addEventListener('input',updateBridge);
document.querySelectorAll('[data-fixture]').forEach(button=>button.addEventListener('click',()=>{
  fixtureMode=button.dataset.fixture;
  document.querySelectorAll('[data-fixture]').forEach(candidate=>{const active=candidate===button;candidate.classList.toggle('is-active',active);candidate.setAttribute('aria-pressed',String(active));});
  updateBridge();
}));
updateBridge();

const chapters={
  design:{role:'MECHANICAL DESIGNER / ENGINEERING TECHNIQUE',question:'“What does this\npart need to do?”',story:'My starting point was mechanical component design: geometry, material efficiency, and the purpose behind each feature. It gave me the language of design intent.',tags:['Mechanical design','Packaging project','Material efficiency'],link:'#experience',linkText:'See the experience behind this chapter'},
  factory:{role:'QUALITY ENGINEER / LA METAL STAMPING',question:'“Why does the\nprocess vary?”',story:'Stamped parts and assemblies brought me into SPC, measurement, DOE trials, and root cause analysis. I learned to read production evidence and carry it into systematic corrective action.',tags:['DOE + 8D','SPC + MSA','Production evidence'],link:'#projects',linkText:'Explore the DOE and process-improvement project'},
  bridge:{role:'DIMENSIONAL ENGINEERING / TI AUTOMOTIVE + HONDA ADC',question:'“Will the design\nwork in assembly?”',story:'GD&T, locating strategies, fixture standards, and 3D variation analysis connect the drawing with how parts are built and assembled. This is where design intent and manufacturing reality become one engineering problem.',tags:['GD&T','3DCS + CATIA','Fixtures + assembly'],link:'#projects',linkText:'Explore dimensional analysis and the FCF generator'},
  code:{role:'CODE / THE NEXT CHAPTER',question:'“Can the geometry, data,\n& engineering travel together?”',story:'VBA and web tools already extend my engineering practice. My Python CNC simulator is the starting point for an industrial operations copilot. Physical AI, digital twins, and the OpenUSD framework are my learning direction.',tags:['Python simulator: built','Industrial AI: in development','OpenUSD: learning'],link:'#physical-ai',linkText:'Explore the next chapter'}
};
const chapterButtons=[...document.querySelectorAll('[data-chapter]')];
function activateChapter(button,focus=false) {
  const chapter=chapters[button.dataset.chapter];
  chapterButtons.forEach(candidate=>{const active=candidate===button;candidate.setAttribute('aria-selected',String(active));candidate.tabIndex=active?0:-1;});
  document.querySelector('#chapter-panel').setAttribute('aria-labelledby',button.id);
  document.querySelector('#chapter-role').textContent=chapter.role;
  const question=document.querySelector('#chapter-question');question.replaceChildren();
  chapter.question.split('\n').forEach((line,index)=>{if(index)question.append(document.createElement('br'));question.append(document.createTextNode(line));});
  document.querySelector('#chapter-story').textContent=chapter.story;
  document.querySelector('#chapter-tags').replaceChildren(...chapter.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));
  const link=document.querySelector('#chapter-link');link.href=chapter.link;link.textContent=chapter.linkText+' +';
  if(focus)button.focus();
}
chapterButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>activateChapter(button));
  button.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%chapterButtons.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+chapterButtons.length-1)%chapterButtons.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=chapterButtons.length-1;
    if(next!==undefined){event.preventDefault();activateChapter(chapterButtons[next],true);}
  });
});

function openEngineeringDialog(trigger,kicker,title,build) {
  if(currentBriefUrl){URL.revokeObjectURL(currentBriefUrl);currentBriefUrl=null;}
  lastProjectButton=trigger;
  document.querySelector('#dialog-kicker').textContent=kicker;
  dialogBody.replaceChildren();
  const heading=document.createElement('h2');heading.id='dialog-title';heading.textContent=title;dialogBody.append(heading);
  build(dialogBody);
  dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
}
document.querySelector('#inspect-logic').addEventListener('click',event=>openEngineeringDialog(event.currentTarget,'CODE / FROM GEOMETRY TO A DECISION','The bridge is in the calculation.',body=>{
  const p=document.createElement('p');p.className='dialog-lead';p.textContent='The feature control frame defines a circular zone. This code checks the measured hole centers against that same requirement, one part at a time.';body.append(p);
  const code=document.createElement('pre');code.className='logic-code';code.textContent=`function inspectMeasurements(points, zoneDiameter) {\n  const measured = points.map(point => ({\n    ...point,\n    positionError: 2 * Math.hypot(point.x, point.y)\n  }));\n\n  const within = measured.filter(point =>\n    point.positionError <= zoneDiameter\n  ).length;\n\n  // The page also computes the mean center\n  // offset and the worst position error.\n  return { measured, within };\n}`;body.append(code);
  const note=document.createElement('p');note.className='case-note';note.textContent='A shortened excerpt of the JavaScript actually running this portfolio demo. The engineering meaning comes first: this is a simplified 2D hole-center calculation in an established datum reference frame.';body.append(note);
}));

function buildSummary(result) {
  const rows=result.points.map(p=>`${p.id},${p.x.toFixed(6)},${p.y.toFixed(6)},${p.positionError.toFixed(6)},${p.positionError<=result.zoneDiameter?'within':'outside'}`).join('\n');
  return `ENGINEERING SUMMARY / SYNTHETIC POSITION STUDY\n\nFeature: hole center, nominally 30 mm from one edge and 20 mm from the other, in a 60 x 40 mm illustrative plate.\nPosition zone diameter: ${result.zoneDiameter.toFixed(2)} mm at RFS.\nCoordinate deviations are relative to an already-established datum reference frame.\nSimplified XY position error = 2 * sqrt(delta_x^2 + delta_y^2).\nSetup: ${result.fixtureMode==='improved'?'illustrative improved locating':'illustrative original locating'}.\n\nOBSERVED SAMPLE\nCount: ${result.total}\nWithin requirement: ${result.within}\nOutside requirement: ${result.outside}\nMean delta_x: ${result.meanX.toFixed(6)} mm\nMean delta_y: ${result.meanY.toFixed(6)} mm\nMean center offset magnitude: ${result.meanOffset.toFixed(6)} mm\nWorst position error: ${result.worst.toFixed(6)} mm\n\nENGINEERING REVIEW\nObserved: ${result.outside} of ${result.total} synthetic points exceed the displayed zone.\nThe mean center shift and spread are measurements of this sample, not a root-cause diagnosis.\nCheck locating interfaces, measurement-system repeatability, and sampling before changing the setup or drawing tolerance.\n\nASSUMPTIONS AND LIMITS\nAll measurements are seeded synthetic data for a portfolio demonstration. Sample results do not establish long-term process capability. Hole size, axis orientation, MMC bonus, and datum mobility are not modeled. No production data is included.\n\nMEASUREMENTS / MM\npart_id,delta_x,delta_y,position_error,result\n${rows}\n`;
}
document.querySelector('#build-summary').addEventListener('click',event=>{
  const result=bridgeResult;
  openEngineeringDialog(event.currentTarget,'ENGINEERING / MEASUREMENT SUMMARY','Build a summary from the current study.',body=>{
    const p=document.createElement('p');p.className='dialog-lead';p.textContent='This technical summary records the current requirement, sample results, locating setup, and modeling limits. Download it with the measurement table for review.';body.append(p);
    const stats=document.createElement('div');stats.className='dialog-bridge-data';
    [['Position zone',`⌀${result.zoneDiameter.toFixed(2)} mm`],['Within sample',`${result.within} / ${result.total}`],['Locating setup',result.fixtureMode==='improved'?'Improved':'Original']].forEach(([label,value])=>{const div=document.createElement('div');const span=document.createElement('span');span.textContent=label;const strong=document.createElement('strong');strong.textContent=value;div.append(span,strong);stats.append(div);});body.append(stats);
    const brief=buildSummary(result);const preview=document.createElement('pre');preview.className='brief-preview';preview.textContent=brief;body.append(preview);
    currentBriefUrl=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));
    const download=document.createElement('a');download.className='button button-dark brief-download';download.href=currentBriefUrl;download.download='Tapan_Bhatt_Engineering_Summary.txt';download.textContent='Download summary';body.append(download);
    const note=document.createElement('p');note.className='case-note';note.textContent='Includes the current synthetic measurements and calculations. Built locally in your browser.';body.append(note);
  });
});
