// Synthetic feature and assembly checks. Datum references stay fixed.
const scaleCases={
 micro:{length:8,baselines:[1.5,4],axis:'x',name:'Precision mounting insert',subtitle:'MOUNTING INSERT / HOLE POSITION & FIT',status:'Position · illustrative RFS check',kind:'position',value:.12,max:.20,step:.005,unit:'mm',control:'Radial offset of the mating-hole axis',metricLabel:'mm diametral position error',limit:.20,amplification:4,question:'Will the hole accept the mating pin when its axis moves in both X and Y?',lesson:'A diameter tolerance zone controls the axis location. Hole and pin size determine the available assembly clearance.',context:'An invented flat insert with ideal A/B/C locating features. The functional hole is ⌀0.90 mm and the nominal mating pin is ⌀0.70 mm. The XY hole-axis offset is prescribed; hole size and axis orientation are held ideal.'},
 part:{length:80,baselines:[20,36],axis:'x',name:'Machined bracket',subtitle:'MACHINED BRACKET / FACE ORIENTATION',status:'Orientation · illustrative perpendicularity',kind:'orientation',value:.45,max:1,step:.01,unit:'°',control:'Tilt of the upright face relative to datum A',metricLabel:'mm perpendicularity zone required',limit:.10,amplification:20,question:'Can the mating face sit square to the base, even when its hole position is acceptable?',lesson:'Perpendicularity is a distance between parallel zone planes. A face angle alone does not define the permitted error.',context:'The bracket geometry is retained. An ideal planar upright face tilts relative to the fixed primary underface A. Its evaluated height is 20 mm. Only the upright feature varies; the base and A/B/C locating frame remain nominal.'},
 body:{length:4200,baselines:[1240,1240],axis:'y',name:'Stamped BIW floor assembly',subtitle:'BIW FLOOR / STAMPED PANELS, FLANGES & WELDS',status:'Joining · welded in a locating fixture',kind:'release',value:.8,max:2,step:.05,unit:'mm',control:'Prescribed released Z offset at the joint flange',metricLabel:'mm departure at the joint flange',limit:.5,amplification:180,question:'Does the joint flange stay inside its mating allowance after the welded floor leaves the fixture?',lesson:'Rest points and clamps hold the joining condition. The released shape and the next assembly interface need their own check.',context:'Formed rails, kick-ups, stamped floor panels, beads, crossmembers, and lap flanges illustrate a welded floor assembly. The schematic is illustrative and contains no employer CAD. Distributed rests and clamps, a round locator, a slot locator, and spot-weld marks show the fixture-held assembly. The released shape is a prescribed field, not an FEA or welding prediction.'},
 airframe:{length:8000,baselines:[400,1400],axis:'y',name:'Tapered wing structure',subtitle:'WING / AIRFOIL-SECTION PROFILE',status:'Profile · illustrative section check',kind:'profile',value:.45,max:1,step:.01,unit:'mm',control:'Peak normal deviation of the tip airfoil section',metricLabel:'mm normal deviation at the section',limit:.3,amplification:350,question:'Is the airfoil section inside its profile envelope, even when the root interfaces are aligned?',lesson:'Root alignment and airfoil shape are different checks. A section can miss its profile zone without a rigid-body Y shift.',context:'The unswept wing, spars, ribs, and root interfaces are retained. Synthetic deviations act along the nominal airfoil-section normal in the YZ plane and increase toward the tip. The displayed check is profile of a line at the tip section, not whole-wing surface-profile inspection, structural validation, or a completed aerospace program.'}
};
let selectedScale='part',baselineChoice='short',viewYaw=-.52,viewPitch=.68,scaleResult=null,floorFixtureState='released';
const scaleInputs=Object.fromEntries(Object.entries(scaleCases).map(([k,s])=>[k,s.value]));
function calculateLocatorEffect(length,baseline,mismatch){const angle=Math.atan2(mismatch,baseline);return {length,baseline,mismatch,angle,angleDegrees:angle*180/Math.PI,lateral:length*Math.sin(angle),longitudinal:length*(Math.cos(angle)-1),gain:length/baseline,radialFloat:Math.hypot(baseline,mismatch)-baseline};}
function calculateScaleVariation(key,input,state='released'){
 const s=scaleCases[key];let metric=input,details;
 if(key==='micro'){metric=2*input;details={dx:.8*input,dy:.6*input,clearance:.10,interference:Math.max(0,input-.10)};}
 else if(key==='part'){metric=20*Math.tan(input*Math.PI/180);details={angle:input,height:20};}
 else if(key==='body'){metric=state==='held'?0:input;details={state};}
 else details={zoneWidth:.60,normalDeviation:input};
 return {input,metric,limit:s.limit,pass:metric<=s.limit+1e-10,...details};
}
function wirePath(points,kind='primary',closed=false){return {points,kind,closed};}
function ring(center,rx,ry,plane='yz',kind='primary'){return wirePath(Array.from({length:40},(_,i)=>{const t=i*2*Math.PI/40;return plane==='yz'?[center[0],center[1]+rx*Math.cos(t),center[2]+ry*Math.sin(t)]:[center[0]+rx*Math.cos(t),center[1]+ry*Math.sin(t),center[2]];}),kind,true);}
function boxWire(x0,x1,y0,y1,z0,z1,kind='primary'){return [wirePath([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],kind,true),wirePath([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],kind,true),...[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([x,y])=>wirePath([[x,y,z0],[x,y,z1]],kind))];}
function atlasInterface(key){
 const s=scaleCases[key],b=s.baselines[0];
 if(key==='micro')return {b,z:1,hole:.28,slot:.28,slotLength:1,aPoint:[-1,-1.7,0],aBounds:[-1.2,8,-2.2,2.2],supports:[[-.7,-1.6,0],[-.7,1.6,0],[.8,0,0]]};
 if(key==='part')return {b,z:3,hole:2.5,slot:2.5,slotLength:12,aPoint:[-8,-17,0],aBounds:[-10,80,-21,21],supports:[[-6,-16,0],[-6,16,0],[65,0,0]]};
 if(key==='body')return {b,z:20};
 return {b,z:20,hole:24,slot:24,slotLength:180,aPoint:[-120,-1350,0],aBounds:[-180,180,-1550,1550],supports:[[-110,-1100,0],[-110,1100,0],[110,0,0]]};
}
function slotWire(center,axis,r,length,z){const u=axis==='x'?[1,0]:[0,1],v=[-u[1],u[0]],half=Math.max(0,length/2-r),pts=[];for(const end of [1,-1])for(let i=0;i<=20;i++){const t=(end===1?-Math.PI/2:Math.PI/2)+i*Math.PI/20,a=end*half+r*Math.cos(t),b=r*Math.sin(t);pts.push([center[0]+a*u[0]+b*v[0],center[1]+a*u[1]+b*v[1],z]);}return wirePath(pts,'feature',true);}
function wingPoint(x,u,side=1){const chord=3000-1700*x/8000,thickness=5*.12*chord*(.2969*Math.sqrt(u)-.126*u-.3516*u*u+.2843*u**3-.1036*u**4);return [x,(u-.5)*chord,.03*x+side*thickness];}
function wingSectionNormal(p){
 const chord=3000-1700*p[0]/8000,u=Math.max(0,Math.min(1,p[1]/chord+.5)),side=p[2]-.03*p[0]<0?-1:1,lo=Math.max(0,u-.0002),hi=Math.min(1,u+.0002);
 const slope=(wingPoint(p[0],hi,side)[2]-wingPoint(p[0],lo,side)[2])/(chord*(hi-lo)),norm=Math.hypot(slope,1);
 return {u,n:[0,-side*slope/norm,side/norm]};
}
function tagged(paths,group){return paths.map(p=>({...p,group}));}
// Smooth, formed rail plan and kick-up: no rectangular part beams.
const floorStations=[[0,490,185],[400,565,135],[900,730,65],[1500,790,35],[2300,710,45],[3000,600,95],[3650,555,160],[4200,495,195]];
function floorShape(x){
 x=Math.max(0,Math.min(4200,x));let i=floorStations.findIndex((p,j)=>j<floorStations.length-1&&x>=p[0]&&x<=floorStations[j+1][0]);if(i<0)i=floorStations.length-2;
 const t=(x-floorStations[i][0])/(floorStations[i+1][0]-floorStations[i][0]);return [1,2].map(k=>{const a=floorStations[Math.max(0,i-1)][k],b=floorStations[i][k],c=floorStations[i+1][k],d=floorStations[Math.min(floorStations.length-1,i+2)][k];return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);});
}
function floorZ(x,y){const base=floorShape(x)[1],t=Math.max(0,Math.min(1,(x-450)/3000));return base+140*Math.sin(Math.PI*t)**2*Math.exp(-((y/125)**2));}
function floorJoint(){const x=2250,y=floorShape(x)[0]-80;return [x,y,floorZ(x,y)];}
function floorReleaseField(p){const t=Math.max(0,Math.min(1,p[0]/4200));return Math.sin(Math.PI*t)*(.70+.30*(p[1]+900)/1800);}
function buildFloorGeometry(){
 const paths=[],xs=Array.from({length:65},(_,i)=>i*4200/64),hat=[[-90,0],[-45,0],[-40,70],[40,70],[45,0],[90,0]];
 for(const side of [-1,1]){
  for(const [dy,dz]of hat)paths.push(wirePath(xs.map(x=>[x,side*floorShape(x)[0]+dy,floorShape(x)[1]+dz])));
  for(const x of xs.filter((_,i)=>i%8===0))paths.push(wirePath(hat.map(([dy,dz])=>[x,side*floorShape(x)[0]+dy,floorShape(x)[1]+dz]),'secondary'));
  for(let j=0;j<xs.length-1;j++){const x=xs[j],q=xs[j+1];const face=wirePath([[x,side*floorShape(x)[0]-40,floorShape(x)[1]+70],[q,side*floorShape(q)[0]-40,floorShape(q)[1]+70],[q,side*floorShape(q)[0]+40,floorShape(q)[1]+70],[x,side*floorShape(x)[0]+40,floorShape(x)[1]+70]],'sheet',true);paths.push(face);}
 }
 for(const [x0,x1]of [[450,1350],[1350,2450],[2450,3450]])for(const side of [-1,1]){
  const xx=Array.from({length:17},(_,i)=>x0+(x1-x0)*i/16),outer=xx.map(x=>[x,side*(floorShape(x)[0]-90),floorZ(x,side*(floorShape(x)[0]-90))]),inner=[...xx].reverse().map(x=>[x,side*170,floorZ(x,side*170)]);
  paths.push(wirePath([...outer,...inner],'panel',true));
  for(const f of [.30,.65])paths.push(wirePath(xx.map(x=>{const y=side*(170+f*(floorShape(x)[0]-260));return [x,y,floorZ(x,y)];}),'secondary'));
 }
 const tx=Array.from({length:41},(_,i)=>450+2900*i/40);
 for(const y of [-170,-85,0,85,170])paths.push(wirePath(tx.map(x=>[x,y,floorZ(x,y)]),y===0?'primary':'secondary'));
 for(const x of [450,900,1700,2500,3350])paths.push(wirePath(Array.from({length:17},(_,i)=>{const y=-170+340*i/16;return [x,y,floorZ(x,y)];}),'secondary'));
 // Stamped reinforcing beads, with tapered ends on the floor skins.
 for(const x of [780,940,1680,1840,2730,2890])for(const side of [-1,1])for(const dx of [-9,9])paths.push(wirePath(Array.from({length:17},(_,i)=>{const t=i/16,y=side*(210+t*(floorShape(x)[0]-355));return [x+dx,y,floorZ(x+dx,y)+12*Math.sin(Math.PI*t)];}),'secondary'));
 for(const x of [330,1200,2250,3450,4040]){
  const w=floorShape(x)[0]-35,ys=Array.from({length:25},(_,i)=>-w+2*w*i/24),section=[[-90,0],[-50,0],[-45,-60],[45,-60],[50,0],[90,0]];
  for(const [dx,dz]of section)paths.push(wirePath(ys.map(y=>{const px=x+dx+25*Math.cos(y/w*Math.PI/2);return [px,y,floorZ(px,y)+dz];}),dz===-60?'primary':'secondary'));
  for(const y of [-w,0,w])paths.push(wirePath(section.map(([dx,dz])=>{const px=x+dx+25*Math.cos(y/w*Math.PI/2);return [px,y,floorZ(px,y)+dz];}),'secondary'));
 }
 // Actual locator tabs on the formed front section, distinct from supports/clamps.
 const tabZ=floorShape(330)[1];
 for(const side of [-1,1])paths.push(...boxWire(285,375,side<0?-730:490,side<0?-490:730,tabZ,tabZ+10,'secondary'));
 paths.push(ring([330,-620,tabZ+10],24,24,'xy','feature'),slotWire([330,620],'y',24,135,tabZ+10));
 return tagged(paths,'floor');
}
function buildScaleGeometry(key){
 if(key==='body')return buildFloorGeometry();const paths=[],f=atlasInterface(key),s=scaleCases[key];
 if(key==='micro'){paths.push(...boxWire(-1.2,9,-2.2,2.2,0,1));paths.push(...tagged([ring([8,0,1],.45,.45,'xy')],'position'));}
 else if(key==='part'){paths.push(...boxWire(-10,90,-21,21,0,3));paths.push(...tagged([...boxWire(-10,-7,-21,21,3,23),ring([-7,0,14],4,4,'yz','secondary')],'orientation'));paths.push(ring([80,0,3],4,4,'xy'));for(const y of [-12,12])paths.push(ring([66,y,3],4,4,'xy','secondary'));}
 else{
  const stations=[0,600,1400,2300,3300,4400,5500,6600,7400,8000];
  for(const x of stations)paths.push(wirePath([...Array.from({length:31},(_,i)=>wingPoint(x,i/30,1)),...Array.from({length:31},(_,i)=>wingPoint(x,1-i/30,-1))],x===0||x===8000?'primary':'secondary',true));
  for(const u of [.25,.70]){paths.push(wirePath(stations.map(x=>wingPoint(x,u,1))),wirePath(stations.map(x=>wingPoint(x,u,-1))));for(const x of stations)paths.push(wirePath([wingPoint(x,u,-1),wingPoint(x,u,1)],'secondary'));}
  for(const u of [0,.12,.4,.55,.85,1])for(const side of [-1,1])paths.push(wirePath(stations.map(x=>wingPoint(x,u,side)),'secondary'));
  for(const p of paths)p.group='profile';paths.push(...boxWire(-180,180,-1550,1550,0,20));
  for(const u of [.25,.70]){const y=wingPoint(0,u,1)[1];paths.push(...boxWire(-130,0,y-100,y+100,20,260),ring([-130,y,155],47,47,'yz'));}
 }
 const c=s.axis==='x'?[f.b,0]:[0,f.b];paths.push(ring([0,0,f.z],f.hole,f.hole,'xy','feature'),slotWire(c,s.axis,f.slot,f.slotLength,f.z));return paths;
}
function atlasSvg(tag,attrs,textContent){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));if(textContent!==undefined)el.textContent=textContent;return el;}
function variationPoint(p,group,amp=scaleCases[selectedScale].amplification){
 const r=scaleResult;
 if(group==='position')return [p[0]+.8*r.input*amp,p[1]+.6*r.input*amp,p[2]];
 if(group==='orientation')return [p[0]+(p[2]-3)*Math.tan(r.input*Math.PI/180)*amp,p[1],p[2]];
 if(group==='floor')return [p[0],p[1],p[2]+r.metric*amp*floorReleaseField(p)/floorReleaseField(floorJoint())];
 if(group==='profile'){const {u,n}=wingSectionNormal(p),d=r.input*amp*Math.max(0,Math.min(1,p[0]/8000))**2*Math.sin(Math.PI*u);return p.map((v,i)=>v+n[i]*d);}
 return [...p];
}
function renderScaleScene(){
 const s=scaleCases[selectedScale],r=scaleResult,f=atlasInterface(selectedScale),paths=buildScaleGeometry(selectedScale),scene=document.querySelector('#scale-scene');if(!r)return;
 const fixturePaths=selectedScale==='body'?boxWire(-140,4370,-1040,1040,-220,-195,'fixture'):[];
 const raw=p=>{const x=p[0]-s.length/2,y=p[1],z=p[2],rx=x*Math.cos(viewYaw)-y*Math.sin(viewYaw),ry=x*Math.sin(viewYaw)+y*Math.cos(viewYaw);return [rx,ry*Math.sin(viewPitch)-z*Math.cos(viewPitch)];};
 const all=[...paths.flatMap(p=>p.points),...paths.flatMap(p=>p.points.map(q=>variationPoint(q,p.group))),...fixturePaths.flatMap(p=>p.points)],rp=all.map(raw),xs=rp.map(p=>p[0]),ys=rp.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),zoom=Math.min(620/(maxX-minX),285/(maxY-minY));
 const project=p=>{const q=raw(p);return [475+(q[0]-(minX+maxX)/2)*zoom,255+(q[1]-(minY+maxY)/2)*zoom];};
 const pathEl=(path,actual=false)=>{const coords=path.points.map(p=>project(actual?variationPoint(p,path.group):p)),filled=['panel','sheet'].includes(path.kind);return atlasSvg('path',{d:coords.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(' ')).join(' ')+(path.closed?' Z':''),fill:filled?(actual?'#ffb26c':'#9dd5ff'):'none','fill-opacity':actual?.055:path.kind==='panel'?.11:.07,stroke:actual?'#ffb26c':path.kind==='fixture'?'#527c6d':path.kind==='secondary'||path.kind==='sheet'?'#587e9b':'#9dd5ff','stroke-width':actual?1.4:path.kind==='feature'?2.2:filled?.8:path.kind==='primary'?1.7:1,'stroke-opacity':actual?.85:1,'vector-effect':'non-scaling-stroke'});};
 const varied=paths.filter(p=>p.group&&p.kind!=='secondary'&&p.kind!=='sheet'&&p.points.some(q=>variationPoint(q,p.group).some((v,i)=>Math.abs(v-q[i])>1e-9)));
 document.querySelector('#scale-geometry-lines').replaceChildren(...fixturePaths.map(p=>pathEl(p)),...paths.map(p=>pathEl(p)),...varied.map(p=>pathEl(p,true)));
 const g=document.querySelector('#scale-datums'),ann=document.querySelector('#scale-annotations');g.replaceChildren();ann.replaceChildren();
 const compact=scene.clientWidth<600,labelSize=13*940/Math.max(scene.clientWidth,260);
 const line=(points,color='#a7e6bf',dash='',parent=g)=>parent.append(atlasSvg('path',{d:points.map((p,i)=>(i?'L':'M')+project(p).join(' ')).join(' '),stroke:color,fill:'none','stroke-width':1.3,'stroke-dasharray':dash,'vector-effect':'non-scaling-stroke'}));
 const label=(p,x,y,text,color='#a7e6bf',parent=g)=>{const q=project(p);parent.append(atlasSvg('path',{d:`M${q.join(' ')} L${x+8} ${y-8}`,stroke:color,fill:'none','stroke-width':1,'stroke-opacity':.65}),atlasSvg('text',{x,y,fill:color,'font-family':'Consolas,monospace','font-size':labelSize},text));};
 const marker=(p,color,size=4,parent=g)=>{const q=project(p);parent.append(atlasSvg('circle',{cx:q[0],cy:q[1],r:size,fill:'#102330',stroke:color,'stroke-width':1.8}));};
 const plane=(points,opacity=.05)=>g.append(atlasSvg('polygon',{points:points.map(p=>project(p).join(',')).join(' '),fill:'#a7e6bf','fill-opacity':opacity,stroke:'#a7e6bf','stroke-opacity':.6,'stroke-dasharray':'5 4'}));
 if(selectedScale!=='body'){
  const a=f.aBounds;plane([[a[0],a[2],0],[a[1],a[2],0],[a[1],a[3],0],[a[0],a[3],0]]);for(const p of f.supports)marker(p,'#a7e6bf',3);
  const b=[0,0,f.z],c=s.axis==='x'?[f.b,0,f.z]:[0,f.b,f.z];marker(b,'#a7e6bf');marker(c,'#a7e6bf');line([b,c],'#a7e6bf','4 5');
  label(f.aPoint,55,422,'A / UNDERFACE');label([f.hole,0,f.z],55,65,'B / BORE WALL');label(s.axis==='x'?[f.b,f.slot,f.z]:[-f.slot,f.b,f.z],565,435,'C / SLOT WIDTH');
 }else{
  // Eight distributed clamping stations; no implied datum-target drawing callout.
  for(const x of [650,1450,2700,3700])for(const side of [-1,1]){
   const y=side*(floorShape(x)[0]-65),z=floorZ(x,y),lift=floorFixtureState==='held'?0:125;
   line([[x,y,-195],[x,y,z]],'#668f7e');line([[x-55,y,z],[x+55,y,z]],'#a7e6bf');marker([x,y,z],'#a7e6bf',3.5);
   line([[x,y+side*145,-195],[x,y+side*145,z+130],[x,y,z+15+lift]],'#a7e6bf');
  }
  marker([330,-620,floorShape(330)[1]+10],'#a7e6bf',5);marker([330,620,floorShape(330)[1]+10],'#a7e6bf',5);
  label([330,-620,floorShape(330)[1]+10],45,70,'ROUND LOCATOR');label([330,620,floorShape(330)[1]+10],560,430,'SLOT LOCATOR');label([1450,-(floorShape(1450)[0]-65),floorZ(1450,-(floorShape(1450)[0]-65))],45,417,floorFixtureState==='held'?'RESTS / CLAMPS CLOSED':'RESTS / CLAMPS OPEN');
  // Spot-weld marks stay on their panel/flange joints in both states.
  for(const x of [720,1000,1310,1540,1910,2210,2580,2870,3230])for(const side of [-1,1]){const y=side*(floorShape(x)[0]-82);marker(variationPoint([x,y,floorZ(x,y)],'floor'),'#d6a6f2',2.6,ann);}
  for(const x of [650,1150,1600,2050,2550,3050])for(const side of [-1,1])marker(variationPoint([x,side*170,floorZ(x,side*170)],'floor'),'#d6a6f2',2.2,ann);
 }
 let target,targetActual,targetLabel;
 if(selectedScale==='micro'){
  target=[8,0,1];targetActual=variationPoint(target,'position');targetLabel=compact?'HOLE / POSITION':'HOLE AXIS / XY POSITION';
  const zone=ring(target,.10*s.amplification,.10*s.amplification,'xy');line([...zone.points,zone.points[0]],'#a7e6bf','4 3');label(target,545,370,compact?'ZONE / ⌀0.20':'POSITION ZONE / ⌀0.20');
 }else if(selectedScale==='part'){
  target=[-7,0,23];targetActual=variationPoint(target,'orientation');targetLabel=compact?'FACE / TILT':'FACE / PERPENDICULARITY';
  const mid=-7+r.metric*s.amplification/2;for(const x of [mid-r.limit*s.amplification/2,mid+r.limit*s.amplification/2])plane([[x,-21,3],[x,21,3],[x,21,23],[x,-21,23]],.035);
 }else if(selectedScale==='body'){
  target=floorJoint();targetActual=variationPoint(target,'floor');targetLabel=compact?'JOINT / ΔZ':'JOINT FLANGE / ΔZ';
 }else{
  target=wingPoint(8000,.5,1);targetActual=variationPoint(target,'profile');targetLabel=compact?'PROFILE / Δn':'AIRFOIL / NORMAL DEVIATION';
  for(const side of [-1,1])for(const offset of [-r.limit,r.limit])line(Array.from({length:61},(_,i)=>{const p=wingPoint(8000,i/60,side),n=wingSectionNormal(p).n;return p.map((v,k)=>v+n[k]*offset*s.amplification);}), '#a7e6bf','4 3');
 }
 marker(target,'#9dd5ff',4,ann);marker(targetActual,r.pass?'#a7e6bf':'#ffb26c',4,ann);line([target,targetActual],'#ffb26c','',ann);label(targetActual,555,70,targetLabel,'#ffb26c',ann);
 if(scene.clientWidth>=600){
  const details=selectedScale==='body'?[[[1800,floorShape(1800)[0],floorShape(1800)[1]+70],330,110,'FORMED RAIL / KICK-UP'],[[1700,-400,floorZ(1700,-400)],570,355,'STAMPED PAN / BEADS'],[[2580,floorShape(2580)[0]-82,floorZ(2580,floorShape(2580)[0]-82)],570,145,'SPOT-WELDED LAP FLANGE']]:selectedScale==='airframe'?[[wingPoint(3300,.25,1),360,110,'FRONT SPAR'],[wingPoint(5500,.5,1),520,360,'RIB'],[[0,600,155],70,345,'ROOT LUGS']]:[];
  for(const [p,x,y,text]of details)label(p,x,y,text,'#9bb7cc',ann);
  const origin=project([0,0,0]);for(const [p,text]of [[[s.length*.08,0,0],'X'],[[0,s.length*.08,0],'Y'],[[0,0,s.length*.08],'Z']]){const q=project(p),factor=45/(s.length*.08*zoom),end=[850+(q[0]-origin[0])*factor,425+(q[1]-origin[1])*factor];ann.append(atlasSvg('path',{d:`M850 425 L${end.join(' ')}`,stroke:'#a7e6bf','stroke-width':1.5}),atlasSvg('text',{x:end[0]+5,y:end[1]-3,fill:'#a7e6bf','font-size':13},text));}
 }
 document.querySelector('#scale-scene-title').textContent=`${s.name}: ${s.kind} variation`;
 document.querySelector('#scale-scene-desc').textContent=`${s.context} Current check: ${r.metric.toFixed(3)} mm against ${r.limit.toFixed(3)} mm. ${r.pass?'Inside':'Outside'} the illustrative acceptance limit. Variations and zone widths are enlarged ${s.amplification} times; values use the unscaled geometry.`;
 document.querySelector('#scale-scene-note').textContent=selectedScale==='body'?`Green: fixture and contacts. Violet: spot welds. ${floorFixtureState==='held'?'Welded in fixture: clamps closed, ideal held shape.':'After release: clamps open, prescribed flange departure shown.'} Shape departure enlarged ${s.amplification}×; no weld/FEA prediction.`:`The A/B/C references remain fixed. ${s.kind==='orientation'?'Green zone planes stay perpendicular to A and translate to center on the face; no position control is implied.':s.kind==='profile'?'Green envelopes show a 0.60 mm total line-profile zone at the tip section.':'The green circle is the hole-axis position zone, not the hole boundary.'} Defect and zone offsets enlarged ${s.amplification}×.`;
}
function updateScale(){
 const s=scaleCases[selectedScale];scaleInputs[selectedScale]=Number(document.querySelector('#locator-mismatch').value);scaleResult=calculateScaleVariation(selectedScale,scaleInputs[selectedScale],floorFixtureState);const r=scaleResult;
 const text=(id,value)=>document.getElementById(id).textContent=value;
 text('locator-output',`${r.input.toFixed(selectedScale==='part'?2:3)} ${s.unit}`);text('scale-tip',r.metric.toFixed(3));text('scale-metric-label',s.metricLabel);text('scale-geometry',s.subtitle);text('scale-status',s.status);text('scale-question',s.question);text('scale-lesson',s.lesson);
 text('scale-explanation',selectedScale==='micro'?`The axis moves +${r.dx.toFixed(3)} mm in X and +${r.dy.toFixed(3)} mm in Y. A ⌀0.90 hole and ⌀0.70 pin provide 0.100 mm radial clearance.`:selectedScale==='part'?`A ${r.input.toFixed(2)}° planar-face tilt over 20 mm requires ${r.metric.toFixed(3)} mm between two zone planes perpendicular to A.`:selectedScale==='body'?`Formed panels and flanges are welded while located and clamped. ${floorFixtureState==='held'?'The held condition is idealized. Switch to after release to check the next assembly interface.':'The prescribed released shape puts the joint flange '+r.metric.toFixed(3)+' mm away from its nominal mating height.'}`:`The root frame remains aligned. The airfoil-section form departs ${r.input.toFixed(3)} mm along the nominal section normal at the tip.`);
 const facts=selectedScale==='micro'?[['Zone diameter','⌀0.200 mm'],['Axis offset',`${r.input.toFixed(3)} mm`],['Radial clearance','0.100 mm'],['Rigid interference',`${r.interference.toFixed(3)} mm`]]:selectedScale==='part'?[['Face tilt',`${r.input.toFixed(2)}°`],['Evaluated height','20 mm'],['Zone allowed','0.100 mm'],['Zone excess',`${Math.max(0,r.metric-r.limit).toFixed(3)} mm`]]:selectedScale==='body'?[['Joining state',floorFixtureState==='held'?'Welded / held':'After release'],['Flange allowance','0.500 mm'],['Distributed clamps','8 illustrated'],['Flange ΔZ',`${r.metric.toFixed(3)} mm`]]:[['Tip section','8,000 mm span'],['Total zone width','0.600 mm'],['Normal allowance','±0.300 mm'],['Normal excess',`${Math.max(0,r.metric-r.limit).toFixed(3)} mm`]];
 document.querySelector('#scale-facts').replaceChildren(...facts.map(([label,value])=>{const div=document.createElement('div'),span=document.createElement('span'),strong=document.createElement('strong');span.textContent=label;strong.textContent=value;div.append(span,strong);return div;}));
 text('scale-acceptance',r.pass?'WITHIN THE ILLUSTRATIVE LIMIT':'OUTSIDE THE ILLUSTRATIVE LIMIT');document.querySelector('#scale-acceptance').classList.toggle('is-outside',!r.pass);
 text('scale-consequence',selectedScale==='micro'?(r.pass?'The ideal pin fits inside the available radial clearance.':'Axis displacement exceeds radial clearance; rigid pin insertion would interfere.'):selectedScale==='part'?(r.pass?'The planar face fits between the perpendicularity zone planes.':'The face cannot fit inside the allowed orientation zone; a mating face may seat unevenly.'):selectedScale==='body'?(r.pass?'The displayed joint flange stays inside the mating allowance.':'The released joint flange exceeds the mating allowance; the next assembly can lose flushness or require rework.'):(r.pass?'The modeled tip section stays inside its bilateral profile zone.':'The modeled airfoil section crosses its profile envelope; aligned roots do not guarantee acceptable section shape.'));
 const summary=document.querySelector('.datum-summary');summary.innerHTML=selectedScale==='body'?'<div><strong>LOCATE</strong><span>Round pin + radial slot</span><small>Position and clock the assembly in the fixture.</small></div><div><strong>CLAMP & WELD</strong><span>Distributed rests and clamps</span><small>Hold the lap flanges at the joining condition.</small></div><div><strong>RELEASE & CHECK</strong><span>Joint-flange departure</span><small>Evaluate the next mating interface after release.</small></div>':'<div><strong>A / PRIMARY PLANE</strong><span>Tz · Rx · Ry</span><small>Ideal underface normal to Z</small></div><div><strong>B / ROUND HOLE</strong><span>Tx · Ty, after A</span><small>Z-axis bore; fixed in-plane origin</small></div><div><strong>C / RADIAL SLOT</strong><span>Rz, after A & B</span><small>Slot width clocks; length allows float</small></div>';
 document.querySelector('#locator-mismatch').setAttribute('aria-valuetext',`${r.input.toFixed(3)} ${s.unit}: ${s.control}`);renderScaleScene();
}
function configureScale(){const s=scaleCases[selectedScale],slider=document.querySelector('#locator-mismatch');slider.min=0;slider.max=s.max;slider.step=s.step;slider.value=scaleInputs[selectedScale];document.querySelector('#variation-control-label').textContent=s.control;document.querySelector('#variation-max').textContent=`${s.max.toFixed(selectedScale==='part'?2:3)} ${s.unit}`;document.querySelector('#fixture-view').hidden=selectedScale!=='body';updateScale();}
document.querySelectorAll('[data-scale]').forEach(button=>button.addEventListener('click',()=>{selectedScale=button.dataset.scale;document.querySelectorAll('[data-scale]').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button));});viewYaw=selectedScale==='airframe'?-.32:selectedScale==='body'?-.55:-.52;viewPitch=selectedScale==='body'?.88:.68;configureScale();}));
document.querySelectorAll('[data-floor-state]').forEach(button=>button.addEventListener('click',()=>{floorFixtureState=button.dataset.floorState;document.querySelectorAll('[data-floor-state]').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button));});updateScale();}));
document.querySelector('#locator-mismatch').addEventListener('input',updateScale);
for(const [id,delta]of [['view-left',-.2],['view-right',.2]])document.getElementById(id).addEventListener('click',()=>{viewYaw+=delta;renderScaleScene();});document.querySelector('#view-reset').addEventListener('click',()=>{viewYaw=selectedScale==='airframe'?-.32:selectedScale==='body'?-.55:-.52;viewPitch=selectedScale==='body'?.88:.68;renderScaleScene();});
let sceneDrag=null;const atlasScene=document.querySelector('#scale-scene');atlasScene.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;sceneDrag={x:e.clientX,y:e.clientY,yaw:viewYaw,pitch:viewPitch};atlasScene.setPointerCapture(e.pointerId);});atlasScene.addEventListener('pointermove',e=>{if(!sceneDrag)return;viewYaw=sceneDrag.yaw+(e.clientX-sceneDrag.x)*.006;viewPitch=Math.max(.2,Math.min(1.3,sceneDrag.pitch+(e.clientY-sceneDrag.y)*.004));renderScaleScene();});for(const type of ['pointerup','pointercancel'])atlasScene.addEventListener(type,()=>sceneDrag=null);
configureScale();new ResizeObserver(renderScaleScene).observe(atlasScene);
document.querySelector('#scale-method').addEventListener('click',event=>{
 const s=scaleCases[selectedScale],r={...scaleResult};openEngineeringDialog(event.currentTarget,'GEOMETRY / REQUIREMENT / ASSEMBLY',`${s.name}: ${s.kind} check`,body=>{
  const p=document.createElement('p');p.textContent=s.context;body.append(p);
  const eq=document.createElement('pre');eq.className='model-equation';eq.textContent=selectedScale==='micro'?'ΔX = 0.8 × ε; ΔY = 0.6 × ε\nRadial axis offset = √(ΔX² + ΔY²) = ε\nDiametral position error = 2 × ε\nRadial clearance = (0.90 − 0.70) / 2 = 0.10 mm':selectedScale==='part'?'Zone width required = H × |tan(β)|\nH = 20 mm vertical face height\nAllowed perpendicularity zone = 0.10 mm\nZone planes are perpendicular to A; location floats.':selectedScale==='body'?'Held shape: prescribed flange ΔZ = 0\nReleased shape: prescribed flange ΔZ = input\nMating allowance at the selected flange = 0.50 mm\nNo weld shrinkage, clamp-force, or stiffness solve.':'Tip section: d(u) = input × sin(πu)\nOffsets act along the nominal YZ-section normal.\nLine-profile zone: ±0.30 mm (0.60 mm total)\nRoot geometry stays fixed; tip section is checked.';body.append(eq);
  const result=document.createElement('p');result.textContent=`Current result: ${r.metric.toFixed(3)} mm; illustrative limit: ${r.limit.toFixed(3)} mm. ${r.pass?'Within':'Outside'} this check. The defect and tolerance-zone offsets are enlarged ${s.amplification}× for visibility; reported values use unscaled geometry.`;body.append(result);
  const notes=document.createElement('p');notes.textContent=selectedScale==='body'?'Fixture supports, clamps, and locators are joining features, without an implied datum-target drawing specification. The prescribed released field is normalized at the marked joint flange and is an illustration of a separate assembly check. It does not predict welding distortion or a real fixture’s performance.':'A/B/C establish an ideal fixed frame: A constrains Tz/Rx/Ry; B adds Tx/Ty; C slot width adds Rz. They do not vary in these feature examples. No material-boundary modifiers, datum mobility, imperfect datum surfaces, or complete inspection are modeled.';body.append(notes);
 });
});

const materialCases={
  steel:{alpha:12,subtitle:'SHEET STEEL / STAMPED + WELDED ASSEMBLY',headline:'The press makes the shape.\nThe assembly makes the system.',stations:[['Form','Investigate springback and feature movement after release from the die.'],['Locate','Separate the free-state shape from the restrained inspection and assembly conditions.'],['Join','Check weld sequence, restraint, and distortion at the functional interfaces.']],check:'Compare the free state, the restrained state, and the assembly condition. Then check the locator and welding sequence against the functional requirement.'},
  aluminium:{alpha:23,subtitle:'ALUMINIUM / MACHINED OR EXTRUDED + JOINED',headline:'Accurate at the machine.\nAligned in the assembly?',stations:[['Create geometry','Machining or extrusion changes the starting variation: review feature relationships and residual-stress effects.'],['Release & condition','Check what moves when the workholding is released and the part reaches the inspection temperature.'],['Join & align','Review joint clearance, fastener access, and differential thermal movement against the mating material.']],check:'Follow the functional dimensions from workholding through release, joining, and temperature. The inspection datum strategy should represent the interface that actually matters.'},
  polymer:{alpha:80,subtitle:'POLYMER / INJECTION MOLDED + ASSEMBLED',headline:'A cavity is a starting point.\nCooling changes the answer.',stations:[['Fill & pack','Review flow, packing, gate location, and the grade-specific shrinkage assumptions with the process team.'],['Cool & release','Check cooling balance and warpage; separate cavity geometry from the conditioned part.'],['Condition & assemble','Consider time, temperature, moisture sensitivity, and restraint for the selected polymer and interface.']],check:'Agree on the material grade, conditioning state, and measurement method before locking the tolerance. Use evidence from process trials to distinguish shift from spread.'},
  composite:{alpha:2,subtitle:'COMPOSITE / LAMINATE + CURED STRUCTURE',headline:'Direction matters.\nSo does the build history.',stations:[['Lay up','The laminate schedule and fiber directions make the dimensional response direction-dependent.'],['Cure & release','Review cure shrinkage, tooling mismatch, spring-in, and the released shape with the materials and process team.'],['Trim, drill & join','Check interface geometry, machining strategy, and how the structure is supported during joining and inspection.']],check:'Treat the laminate, tooling, cure cycle, and support condition as inputs to the dimensional plan. Validate directional thermal coefficients and the actual interface geometry.'},
  titanium:{alpha:8.5,subtitle:'TITANIUM / MACHINED + PRECISION ASSEMBLED',headline:'Control the cut.\nThen check the released part.',stations:[['Plan the setup','Review the cutting strategy, workholding, heat input, and accessibility of the critical features.'],['Machine & release','Investigate feature movement after release, especially in thin sections. Verify temperature and measurement repeatability.'],['Join & inspect','Review fastener interfaces, finish requirements, and the support condition used to accept the assembly.']],check:'Use the actual grade, geometry, and manufacturing evidence. Thin-section stability and interface position should be evaluated in the final functional state.'},
  casting:{alpha:11,subtitle:'CAST IRON / CAST + FINISH MACHINED',headline:'Start with the casting.\nFinish with the function.',stations:[['Cast & cool','Review pattern allowances, section transitions, cooling conditions, and casting-specific variation.'],['Establish datums','Plan machining stock and datum transfer so the rough casting can support accurate functional features.'],['Finish & assemble','Check the finished relationship between bores, mounting faces, and mating interfaces—not only individual sizes.']],check:'Separate as-cast variation from finish-machined requirements. Make sure there is enough stock, a practical datum transfer, and a measurement plan for the final interface.'},
  copper:{alpha:17,subtitle:'COPPER / FORMED CONDUCTOR + MECHANICAL INTERFACE',headline:'Electrical function.\nMechanical fit.',stations:[['Form the conductor','Review bend geometry, material condition, tool contact, and the variability of formed features.'],['Create interfaces','Check hole patterns, contact faces, and thickness or finish requirements against the mating design.'],['Assemble & heat','Consider temperature rise, differential expansion, joint clearance, and restraint in the assembled condition.']],check:'Bring mechanical fit and thermal movement into the interface review. Confirm the actual temperature range and reference conditions with the electrical and thermal teams.'},
  ceramic:{alpha:6,subtitle:'TECHNICAL CERAMIC / SHAPED + SINTERED + GROUND',headline:'The shape evolves.\nThe interface must survive.',stations:[['Shape','Review the forming route, green-part geometry, and the grade-specific allowances for the subsequent thermal process.'],['Sinter','Validate shrinkage, distortion, and support conditions with the process team instead of relying on a universal allowance.'],['Finish & inspect','Review achievable ground features, edge integrity, datum access, and how the part is supported during measurement.']],check:'Link the material grade and sintering evidence to the finished functional surfaces. The selected ceramic and mating material need their own thermal and structural validation.'}
};
let selectedMaterial='steel',thermalResult=null;
function calculateThermalMismatch(length,deltaT,alpha,referenceAlpha){
  const selectedGrowth=length*alpha*1e-6*deltaT,referenceGrowth=length*referenceAlpha*1e-6*deltaT;
  return {length,deltaT,alpha,referenceAlpha,selectedGrowth,referenceGrowth,mismatch:selectedGrowth-referenceGrowth};
}
function updateThermal(){
  const a=document.querySelector('#thermal-alpha'),b=document.querySelector('#thermal-reference');
  // Keep incomplete numeric edits from rendering NaN, without blocking keyboard editing.
  if(a.value===''||b.value===''||!a.validity.valid||!b.validity.valid)return;
  const deltaT=Number(document.querySelector('#temperature-change').value);
  thermalResult=calculateThermalMismatch(1000,deltaT,Number(a.value),Number(b.value));
  const r=thermalResult;
  document.querySelector('#temperature-output').textContent=`${deltaT>0?'+':''}${deltaT} °C`;
  document.querySelector('#temperature-change').setAttribute('aria-valuetext',`${deltaT} degrees Celsius temperature change`);
  const mismatch=document.querySelector('#thermal-mismatch');mismatch.replaceChildren(document.createTextNode(`${Math.abs(r.mismatch)<.0005?'0.000':(r.mismatch>0?'+':'')+r.mismatch.toFixed(3)} `));const unit=document.createElement('small');unit.textContent='mm';mismatch.append(unit);
  document.querySelector('#thermal-selected-bar').setAttribute('width',Math.max(20,220*(1+r.selectedGrowth/1000*100)));
  document.querySelector('#thermal-reference-bar').setAttribute('width',Math.max(20,220*(1+r.referenceGrowth/1000*100)));
  document.querySelector('#thermal-insight').textContent=Math.abs(r.mismatch)<1e-10?'The two assumed coefficients give equal free growth at this temperature change. Actual joints and restraint still need evaluation.':`The selected specimen freely ${r.selectedGrowth<0?'contracts':'grows'} by ${Math.abs(r.selectedGrowth).toFixed(3)} mm; the reference ${r.referenceGrowth<0?'contracts':'grows'} by ${Math.abs(r.referenceGrowth).toFixed(3)} mm. Restraint can turn differential movement into load or distortion.`;
  document.querySelector('#thermal-desc').textContent=`At a temperature change of ${deltaT} degrees Celsius, the assumed selected coefficient of ${r.alpha} micrometers per meter per degree Celsius gives ${r.selectedGrowth.toFixed(3)} millimeters of free change over one meter. The reference coefficient of ${r.referenceAlpha} gives ${r.referenceGrowth.toFixed(3)} millimeters. The signed free thermal mismatch is ${r.mismatch.toFixed(3)} millimeters. Bar changes are exaggerated one hundred times.`;
}
function updateMaterial(){
  const m=materialCases[selectedMaterial];document.querySelector('#material-subtitle').textContent=m.subtitle;
  const headline=document.querySelector('#material-headline');headline.replaceChildren();m.headline.split('\n').forEach((line,i)=>{if(i)headline.append(document.createElement('br'));headline.append(document.createTextNode(line));});
  document.querySelector('#process-stations').replaceChildren(...m.stations.map(([title,text],i)=>{const item=document.createElement('div');item.className='process-station';const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');const content=document.createElement('div');const strong=document.createElement('strong');strong.textContent=title;const p=document.createElement('p');p.textContent=text;content.append(strong,p);item.append(n,content);return item;}));
  document.querySelector('#material-check').textContent=m.check;document.querySelector('#thermal-alpha').value=m.alpha;updateThermal();
}
document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{selectedMaterial=button.dataset.material;document.querySelectorAll('[data-material]').forEach(other=>{const active=button===other;other.classList.toggle('is-active',active);other.setAttribute('aria-pressed',String(active));});updateMaterial();}));
for(const id of ['temperature-change','thermal-alpha','thermal-reference'])document.getElementById(id).addEventListener('input',updateThermal);
updateMaterial();
