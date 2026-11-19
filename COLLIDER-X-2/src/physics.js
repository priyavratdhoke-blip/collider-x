export const PARTICLES=[
{id:'e-',name:'Electron',symbol:'e⁻',type:'Lepton',mass:0.000510999,charge:-1,spin:'1/2',stable:true,antiparticle:'Positron'},
{id:'mu-',name:'Muon',symbol:'μ⁻',type:'Lepton',mass:0.105658,charge:-1,spin:'1/2',stable:false,antiparticle:'Antimuon'},
{id:'tau-',name:'Tau',symbol:'τ⁻',type:'Lepton',mass:1.77686,charge:-1,spin:'1/2',stable:false,antiparticle:'Antitau'},
{id:'nu',name:'Neutrino',symbol:'ν',type:'Lepton',mass:0,charge:0,spin:'1/2',stable:true,antiparticle:'Antineutrino'},
{id:'u',name:'Up quark',symbol:'u',type:'Quark',mass:0.0022,charge:2/3,spin:'1/2',stable:false,antiparticle:'Anti-up'},
{id:'d',name:'Down quark',symbol:'d',type:'Quark',mass:0.0047,charge:-1/3,spin:'1/2',stable:false,antiparticle:'Anti-down'},
{id:'c',name:'Charm quark',symbol:'c',type:'Quark',mass:1.27,charge:2/3,spin:'1/2',stable:false,antiparticle:'Anti-charm'},
{id:'s',name:'Strange quark',symbol:'s',type:'Quark',mass:0.096,charge:-1/3,spin:'1/2',stable:false,antiparticle:'Anti-strange'},
{id:'t',name:'Top quark',symbol:'t',type:'Quark',mass:172.76,charge:2/3,spin:'1/2',stable:false,antiparticle:'Anti-top'},
{id:'b',name:'Bottom quark',symbol:'b',type:'Quark',mass:4.18,charge:-1/3,spin:'1/2',stable:false,antiparticle:'Anti-bottom'},
{id:'photon',name:'Photon',symbol:'γ',type:'Boson',mass:0,charge:0,spin:1,stable:true,antiparticle:'Self'},
{id:'gluon',name:'Gluon',symbol:'g',type:'Boson',mass:0,charge:0,spin:1,stable:true,antiparticle:'Self'},
{id:'w',name:'W boson',symbol:'W±',type:'Boson',mass:80.377,charge:1,spin:1,stable:false,antiparticle:'W∓'},
{id:'z',name:'Z boson',symbol:'Z⁰',type:'Boson',mass:91.1876,charge:0,spin:1,stable:false,antiparticle:'Self'},
{id:'h',name:'Higgs boson',symbol:'H⁰',type:'Boson',mass:125.25,charge:0,spin:0,stable:false,antiparticle:'Self'}];
export const fmt=(x,d=3)=>Number.isFinite(x)?x.toFixed(d):'—';
export function fourVector(p){const pt=Number(p.pt)||0,eta=Number(p.eta)||0,phi=Number(p.phi)||0,m=Math.max(0,Number(p.mass)||0);const px=pt*Math.cos(phi),py=pt*Math.sin(phi),pz=pt*Math.sinh(eta),E=Math.sqrt(px*px+py*py+pz*pz+m*m);return {px,py,pz,E,pt,eta,phi,mass:m};}
export function combine(particles){const v=particles.map(fourVector).reduce((a,b)=>({px:a.px+b.px,py:a.py+b.py,pz:a.pz+b.pz,E:a.E+b.E}),{px:0,py:0,pz:0,E:0});const m2=v.E*v.E-v.px*v.px-v.py*v.py-v.pz*v.pz;return {...v,pt:Math.hypot(v.px,v.py),mass:Math.sqrt(Math.max(0,m2)),mass2:m2};}
export function normalizeEvent(raw){
  const looksLikeParticle=x=>x&&typeof x==='object'&&(x.pt!==undefined||x.PT!==undefined||x.pT!==undefined||x.px!==undefined||x.Px!==undefined)&&(x.eta!==undefined||x.Eta!==undefined||x.pz!==undefined||x.Pz!==undefined||x.phi!==undefined||x.Phi!==undefined);
  let arr=Array.isArray(raw)?raw:null;
  if(!arr&&raw&&typeof raw==='object'){
    const direct=[raw.particles,raw.objects,raw.tracks,raw.muons,raw.electrons,raw.photons,raw.jets,raw.event?.particles,raw.events?.[0]?.particles,raw.events?.[0]?.tracks];
    arr=direct.find(Array.isArray)||null;
    if(!arr){const queue=[raw];let found=null;while(queue.length&&!found){const cur=queue.shift();if(Array.isArray(cur)){if(cur.length&&cur.some(looksLikeParticle)){found=cur;break;}continue;}if(cur&&typeof cur==='object')for(const [k,v] of Object.entries(cur)){if(['metadata','geometry','hits','vertices','collections'].includes(k.toLowerCase()))continue;if(Array.isArray(v)){if(v.length&&v.some(looksLikeParticle)){found=v;break;}queue.push(v);}else if(v&&typeof v==='object')queue.push(v);}}arr=found;}
  }
  if(!arr)return [];
  return arr.filter(p=>p&&typeof p==='object').map((p,i)=>{const get=(...keys)=>{for(const k of keys)if(p[k]!==undefined)return p[k];return 0};let pt=get('pt','PT','pT'),eta=get('eta','Eta'),phi=get('phi','Phi'),px=get('px','Px'),py=get('py','Py'),pz=get('pz','Pz');if(!pt&&px!==0&&px!==undefined)pt=Math.hypot(Number(px),Number(py));if((eta===0||eta===undefined)&&pz!==undefined&&pt>0)eta=Math.asinh(Number(pz)/pt);if((phi===0||phi===undefined)&&px!==undefined)phi=Math.atan2(Number(py),Number(px));const kind=p.name||p.type||p.particle||p.collection||'Particle';return {id:String(p.id??p.pdgId??p.pdg_id??i),name:kind,type:kind,pt:Number(pt)||0,eta:Number(eta)||0,phi:Number(phi)||0,mass:Number(get('mass','m'))||0,charge:Number(get('charge','q'))||0,source:'imported'};}).filter(p=>Number.isFinite(p.pt)&&p.pt>=0);
}
export function demoEvent(seed=1){let s=seed;const rand=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};const types=[['Muon',-1,.1057],['Electron',-1,.000511],['Photon',0,0],['Jet',0,0],['Muon',1,.1057],['Electron',1,.000511]];return Array.from({length:7},(_,i)=>{const t=types[Math.floor(rand()*types.length)];return {id:`D${seed}-${i+1}`,name:t[0],type:t[0],pt:8+rand()*75,eta:(rand()-.5)*4.5,phi:(rand()*2-1)*Math.PI,mass:t[2],charge:t[1],source:'generated'};});}

export function missingTransverseMomentum(particles){const sum=particles.map(fourVector).reduce((a,b)=>({px:a.px+b.px,py:a.py+b.py}),{px:0,py:0});return {px:-sum.px,py:-sum.py,pt:Math.hypot(sum.px,sum.py),phi:Math.atan2(-sum.py,-sum.px)};}
