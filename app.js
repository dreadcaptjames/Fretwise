'use strict';

/*
 * Fretwise — zero-dependency guitar learning app
 * The diagram order is low E, A, D, G, B, high e (left to right).
 * Fret -1 means a muted string; 0 means an open string.
 */
const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const MIXED = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const ROOTS = [0,1,2,3,4,5,6,7,8,9,10,11];
const MAJOR_KEYS = [
  {name:'C',pc:0,accidentals:'mixed'}, {name:'Db',pc:1,accidentals:'flat'},
  {name:'D',pc:2,accidentals:'sharp'}, {name:'Eb',pc:3,accidentals:'flat'},
  {name:'E',pc:4,accidentals:'sharp'}, {name:'F',pc:5,accidentals:'flat'},
  {name:'F#',pc:6,accidentals:'sharp'}, {name:'G',pc:7,accidentals:'sharp'},
  {name:'Ab',pc:8,accidentals:'flat'}, {name:'A',pc:9,accidentals:'sharp'},
  {name:'Bb',pc:10,accidentals:'flat'}, {name:'B',pc:11,accidentals:'sharp'}
];
const QUALITIES = {
  major:{label:'Major',suffix:'',intervals:[0,4,7],hint:'Bright, steady, and at home in thousands of songs.'},
  minor:{label:'Minor',suffix:'m',intervals:[0,3,7],hint:'A softer, moodier sound.'},
  '7':{label:'Dominant 7',suffix:'7',intervals:[0,4,7,10],hint:'A bluesy chord with a little tension.'},
  maj7:{label:'Major 7',suffix:'maj7',intervals:[0,4,7,11],hint:'Warm and dreamy with a jazzy edge.'},
  m7:{label:'Minor 7',suffix:'m7',intervals:[0,3,7,10],hint:'Smooth and mellow; popular in soul and jazz.'},
  sus2:{label:'Suspended 2',suffix:'sus2',intervals:[0,2,7],hint:'Open, floating sound without a major or minor third.'},
  sus4:{label:'Suspended 4',suffix:'sus4',intervals:[0,5,7],hint:'Creates gentle tension that wants to resolve.'},
  dim:{label:'Diminished',suffix:'dim',intervals:[0,3,6],hint:'Tense and unsettled; great for linking other chords.'},
  power:{label:'Power chord',suffix:'5',intervals:[0,7],hint:'The root and fifth, with no major or minor third.'}
};
const QUALITY_ORDER = ['major','minor','7','maj7','m7','sus2','sus4','dim'];
const OPEN_SHAPES = {
  '0-major':{f:[-1,3,2,0,1,0],fingers:[0,3,2,0,1,0],tip:'Arch your first finger so the high E string stays clear.'},
  '2-major':{f:[-1,-1,0,2,3,2],fingers:[0,0,0,1,3,2],tip:'Keep your three fingers close together without muting the open D.'},
  '4-major':{f:[0,2,2,1,0,0],fingers:[0,2,3,1,0,0],tip:'Try lifting your fingers together when changing to A or E minor.'},
  '7-major':{f:[3,2,0,0,0,3],fingers:[2,1,0,0,0,3],tip:'Let the middle three strings ring freely.'},
  '9-major':{f:[-1,0,2,2,2,0],fingers:[0,0,1,2,3,0],tip:'Press close to the second fret; avoid the low E string.'},
  '2-minor':{f:[-1,-1,0,2,3,1],fingers:[0,0,0,2,3,1],tip:'Anchor your first finger on the high E string at fret one.'},
  '4-minor':{f:[0,2,2,0,0,0],fingers:[0,2,3,0,0,0],tip:'A two-finger chord: use it to practice clean changes.'},
  '9-minor':{f:[-1,0,2,2,1,0],fingers:[0,0,2,3,1,0],tip:'Keep your thumb relaxed behind the neck.'},
  '0-7':{f:[-1,3,2,3,1,0],fingers:[0,3,2,4,1,0]},
  '2-7':{f:[-1,-1,0,2,1,2],fingers:[0,0,0,2,1,3]},
  '4-7':{f:[0,2,0,1,0,0],fingers:[0,2,0,1,0,0]},
  '7-7':{f:[3,2,0,0,0,1],fingers:[3,2,0,0,0,1]},
  '9-7':{f:[-1,0,2,0,2,0],fingers:[0,0,2,0,3,0]},
  '11-7':{f:[-1,2,1,2,0,2],fingers:[0,2,1,3,0,4]},
  '0-maj7':{f:[-1,3,2,0,0,0]},
  '2-maj7':{f:[-1,-1,0,2,2,2]},
  '4-maj7':{f:[0,2,1,1,0,0]},
  '5-maj7':{f:[-1,-1,3,2,1,0]},
  '7-maj7':{f:[3,2,0,0,0,2]},
  '9-maj7':{f:[-1,0,2,1,2,0]},
  '2-m7':{f:[-1,-1,0,2,1,1]},
  '4-m7':{f:[0,2,0,0,0,0]},
  '9-m7':{f:[-1,0,2,0,1,0]},
  '2-sus2':{f:[-1,-1,0,2,3,0]},
  '9-sus2':{f:[-1,0,2,2,0,0]},
  '2-sus4':{f:[-1,-1,0,2,3,3]},
  '4-sus4':{f:[0,2,2,2,0,0]},
  '9-sus4':{f:[-1,0,2,2,3,0]}
};
// These shapes transpose by moving every sounded fret by the same number.
const MOVABLE = {
  major:{e:[0,2,2,1,0,0],a:[-1,0,2,2,2,0]},
  minor:{e:[0,2,2,0,0,0],a:[-1,0,2,2,1,0]},
  '7':{e:[0,2,0,1,0,0],a:[-1,0,2,0,2,0]},
  maj7:{e:[0,2,1,1,0,0],a:[-1,0,2,1,2,0]},
  m7:{e:[0,2,0,0,0,0],a:[-1,0,2,0,1,0]},
  sus2:{e:[0,2,4,4,0,0],a:[-1,0,2,2,0,0]},
  sus4:{e:[0,2,2,2,0,0],a:[-1,0,2,2,3,0]},
  dim:{e:[0,1,2,0,-1,-1],a:[-1,0,1,2,1,-1]}
};
const STRING_MIDI = [40,45,50,55,59,64];
const STRING_NAMES = ['E','A','D','G','B','e'];
const PROGRESSIONS = [
  {id:'pop',name:'The Four-Chord Pop',genre:'POP / INDIE',description:'The instantly familiar loop behind so many great songs.',roman:'I – V – vi – IV',steps:[[0,'major','I'],[7,'major','V'],[9,'minor','vi'],[5,'major','IV']]},
  {id:'rock',name:'The Classic Rock Loop',genre:'ROCK',description:'A powerful, uncomplicated three-chord foundation.',roman:'I – IV – V – IV',steps:[[0,'major','I'],[5,'major','IV'],[7,'major','V'],[5,'major','IV']]},
  {id:'fifties',name:'The 50s Turnaround',genre:'OLDIES',description:'A timeless doo-wop sound that keeps coming back.',roman:'I – vi – IV – V',steps:[[0,'major','I'],[9,'minor','vi'],[5,'major','IV'],[7,'major','V']]},
  {id:'folk',name:'The Folk Companion',genre:'FOLK / COUNTRY',description:'An easy, sing-along set of changes for acoustic guitar.',roman:'I – IV – I – V',steps:[[0,'major','I'],[5,'major','IV'],[0,'major','I'],[7,'major','V']]},
  {id:'minor',name:'The Minor Mood',genre:'ALT / POP',description:'Start on the relative minor for a reflective feeling.',roman:'vi – IV – I – V',steps:[[9,'minor','vi'],[5,'major','IV'],[0,'major','I'],[7,'major','V']]},
  {id:'jazz',name:'The Jazz Resolution',genre:'JAZZ',description:'The essential ii–V–I movement, with colorful sevenths.',roman:'ii7 – V7 – Imaj7',steps:[[2,'m7','ii7'],[7,'7','V7'],[0,'maj7','Imaj7']]},
  {id:'blues',name:'The 12-Bar Blues',genre:'BLUES',description:'Twelve bars of dominant sevenths — a classic jam template.',roman:'I7 – IV7 – V7',steps:[[0,'7','I7'],[0,'7','I7'],[0,'7','I7'],[0,'7','I7'],[5,'7','IV7'],[5,'7','IV7'],[0,'7','I7'],[0,'7','I7'],[7,'7','V7'],[5,'7','IV7'],[0,'7','I7'],[7,'7','V7']]},
  {id:'canon',name:'The Canon Sequence',genre:'SONGWRITING',description:'A flowing eight-chord pattern used in classical and pop music.',roman:'I – V – vi – iii – IV – I – IV – V',steps:[[0,'major','I'],[7,'major','V'],[9,'minor','vi'],[4,'minor','iii'],[5,'major','IV'],[0,'major','I'],[5,'major','IV'],[7,'major','V']]}
];

// These are familiar stylistic building blocks, not exact song transcriptions.
const PUNK_PROGRESSIONS = [
  {id:'anthem',name:'Three-Chord Anthem',genre:'CLASSIC PUNK',description:'The fast and direct I–IV–V backbone of punk rhythm guitar.',roman:'I5 – IV5 – V5 – IV5',steps:[[0,'I5'],[5,'IV5'],[7,'V5'],[5,'IV5']]},
  {id:'pop-punk',name:'Pop-Punk Lift',genre:'POP-PUNK',description:'A hook-friendly, sing-along four-chord cycle.',roman:'I5 – V5 – vi5 – IV5',steps:[[0,'I5'],[7,'V5'],[9,'vi5'],[5,'IV5']]},
  {id:'skate',name:'Skate-Punk Drop',genre:'SKATE PUNK',description:'A punchy lowered-seventh move with room for an explosive return.',roman:'I5 – ♭VII5 – IV5 – I5',steps:[[0,'I5'],[10,'♭VII5'],[5,'IV5'],[0,'I5']]},
  {id:'garage',name:'Garage Shout',genre:'GARAGE PUNK',description:'Rough-edged movement between the tonic, fourth, and flat seventh.',roman:'I5 – IV5 – ♭VII5 – IV5',steps:[[0,'I5'],[5,'IV5'],[10,'♭VII5'],[5,'IV5']]},
  {id:'descend',name:'Descending Charge',genre:'HARDCORE / PUNK',description:'A darker descending riff built for tight, palm-muted picking.',roman:'I5 – ♭VII5 – ♭VI5 – ♭VII5',steps:[[0,'I5'],[10,'♭VII5'],[8,'♭VI5'],[10,'♭VII5']]},
  {id:'turnaround',name:'Fast Turnaround',genre:'MELODIC PUNK',description:'An urgent I–V–IV turnaround with a quick push back to the fifth.',roman:'I5 – V5 – IV5 – V5',steps:[[0,'I5'],[7,'V5'],[5,'IV5'],[7,'V5']]}
];

const $ = (selector) => document.querySelector(selector);
const state = {tab:'chords',selectedChord:{pc:0,quality:'major'},selectedProgression:'pop',key:MAJOR_KEYS[0],stepIndex:0,bpm:90,playing:false,globalBeat:0,interval:null,audio:null,
  punk:{key:MAJOR_KEYS[4],selected:'anthem',bpm:160,stepIndex:0,eighthIndex:0,playing:false,interval:null}};

function mod(n,m=12){return((n%m)+m)%m;}
function noteName(pc,preference='mixed'){
  const names=preference==='sharp'?SHARP:preference==='flat'?FLAT:MIXED;
  return names[mod(pc)];
}
function chordName(pc,quality,preference='mixed'){
  return noteName(pc,preference)+QUALITIES[quality].suffix;
}
function shapeFor(pc,quality){
  const open=OPEN_SHAPES[`${pc}-${quality}`];
  if(open) return {frets:[...open.f],fingers:open.fingers||null,open:true,barre:null,tip:open.tip||null};
  const offsetE=mod(pc-4),offsetA=mod(pc-9);
  const base=offsetE<=offsetA?MOVABLE[quality].e:MOVABLE[quality].a;
  const offset=Math.min(offsetE,offsetA);
  const frets=base.map(f=>f<0?-1:f+offset);
  const openStringIndices=base.flatMap((f,i)=>f===0?[i]:[]);
  const barre=offset>0&&openStringIndices.length>=2?{fret:offset,from:Math.min(...openStringIndices),to:Math.max(...openStringIndices)}:null;
  return {frets,fingers:null,open:offset===0,barre,tip:null};
}
function chordFor(pc,quality){return {pc:mod(pc),quality,shape:shapeFor(mod(pc),quality)};}
function powerChordFor(pc,rootString='auto',includeOctave=true){
  pc=mod(pc);
  const eFret=mod(pc-4),aFret=mod(pc-9);
  const string=rootString==='auto'?(eFret<=aFret?'e':'a'):rootString;
  const fret=string==='e'?eFret:aFret;
  const start=string==='e'?0:1;
  const frets=Array(6).fill(-1),fingers=Array(6).fill(0);
  frets[start]=fret;
  frets[start+1]=fret+2;
  if(fret>0)fingers[start]=1;
  fingers[start+1]=3;
  if(includeOctave){frets[start+2]=fret+2;fingers[start+2]=4;}
  return {pc,quality:'power',shape:{frets,fingers,open:fret===0,barre:null,rootString:string,rootFret:fret}};
}
function punkChordName(pc){return noteName(pc,state.punk.key.accidentals)+'5';}
function punkSteps(){
  const progression=PUNK_PROGRESSIONS.find(p=>p.id===state.punk.selected)||PUNK_PROGRESSIONS[0];
  return progression.steps.map(([interval,roman])=>({pc:mod(state.punk.key.pc+interval),roman}));
}
function selectedPunk(){return PUNK_PROGRESSIONS.find(p=>p.id===state.punk.selected)||PUNK_PROGRESSIONS[0];}

function describePosition(shape){
  if(shape.frets.includes(0)) return 'Open position';
  const min=Math.min(...shape.frets.filter(f=>f>0));
  return `Starting at fret ${min}`;
}
function chordDifficulty(shape){return shape.frets.includes(0)?'OPEN SHAPE':shape.barre?'BARRE SHAPE':'MOVABLE SHAPE';}
function chordNotes(pc,quality,preference){return QUALITIES[quality].intervals.map(i=>noteName(pc+i,preference)).join(' · ');}
function chordDiagramSVG(chord,{mini=false}={}){
  const {frets,barre,fingers}=chord.shape;
  const active=frets.filter(f=>f>0);
  const firstFret=active.length&&Math.max(...active)>5?Math.min(...active):1;
  const x=i=>58+i*44;
  const y=f=>54+(f-firstFret+.5)*48;
  const dark=mini;
  const ink=dark?'#e7f2e1':'#314b3a';
  const grid=dark?'#6c977c':'#9cad98';
  const rootFill='#c6ff70';
  const otherFill=dark?'#bdd2c2':'#27483a';
  let markup=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 336 357" role="img" aria-label="${chordName(chord.pc,chord.quality)} chord: ${frets.map(f=>f<0?'muted':f===0?'open':`fret ${f}`).join(', ')} from low E to high E">`;
  markup+=`<g stroke="${grid}" stroke-linecap="round" fill="none">`;
  for(let s=0;s<6;s++) markup+=`<path d="M ${x(s)} 54 V 294" stroke-width="${s===0||s===5?2.4:1.5}"/>`;
  for(let f=0;f<=5;f++) markup+=`<path d="M 58 ${54+f*48} H 278" stroke-width="${f===0&&firstFret===1?7:1.8}"/>`;
  markup+='</g>';
  if(firstFret>1)markup+=`<text x="37" y="${y(firstFret)+5}" text-anchor="middle" font-size="15" font-family="Arial,sans-serif" font-weight="700" fill="${ink}">${firstFret}fr</text>`;
  if(barre&&barre.fret>=firstFret&&barre.fret<firstFret+5){
    let bx=x(barre.from)-15,br=x(barre.to)+15;
    markup+=`<rect x="${bx}" y="${y(barre.fret)-15}" width="${br-bx}" height="30" rx="15" fill="${dark?'#89bc61':'#b4d890'}" opacity=".76"/>`;
  }
  frets.forEach((f,i)=>{
    if(f===-1)markup+=`<text x="${x(i)}" y="38" font-size="20" font-weight="700" text-anchor="middle" font-family="Arial,sans-serif" fill="${ink}">×</text>`;
    else if(f===0)markup+=`<circle cx="${x(i)}" cy="29" r="7" fill="none" stroke="${ink}" stroke-width="2.1"/>`;
    else{
      const root=mod(STRING_MIDI[i]+f)===chord.pc;
      const fill=root?rootFill:otherFill;
      markup+=`<circle cx="${x(i)}" cy="${y(f)}" r="17" fill="${fill}" stroke="${root?'#789e52':'none'}" stroke-width="1"/>`;
      if(fingers&&fingers[i])markup+=`<text x="${x(i)}" y="${y(f)+5.1}" font-size="15" text-anchor="middle" font-weight="800" font-family="Arial,sans-serif" fill="${root?'#183122':'#ffffff'}">${fingers[i]}</text>`;
    }
  });
  STRING_NAMES.forEach((name,i)=>markup+=`<text x="${x(i)}" y="328" font-size="15" font-weight="700" text-anchor="middle" font-family="Arial,sans-serif" fill="${ink}">${name}</text>`);
  return markup+'</svg>';
}

function renderChordList(){
  const query=$('#chord-search').value.trim().toLowerCase().replaceAll('♯','#').replaceAll('♭','b');
  const rootFilter=$('#root-filter').value,qualityFilter=$('#quality-filter').value;
  const exactChordMatch=Boolean(query)&&ROOTS.some(pc=>QUALITY_ORDER.some(quality=>
    ['mixed','flat','sharp'].some(pref=>chordName(pc,quality,pref).toLowerCase()===query)));
  const list=[];
  for(const pc of ROOTS) for(const quality of QUALITY_ORDER){
    if(rootFilter!=='all'&&Number(rootFilter)!==pc)continue;
    if(qualityFilter!=='all'&&qualityFilter!==quality)continue;
    const names=[chordName(pc,quality,'mixed'),chordName(pc,quality,'flat'),chordName(pc,quality,'sharp')].map(n=>n.toLowerCase());
    if(query&&(exactChordMatch?!names.includes(query):(!names.some(n=>n.includes(query))&&!QUALITIES[quality].label.toLowerCase().includes(query))))continue;
    list.push({pc,quality});
  }
  $('#results-count').textContent=`${list.length} RESULT${list.length===1?'':'S'}`;
  $('#chord-list').innerHTML=list.length?list.map(({pc,quality})=>{
    const shape=shapeFor(pc,quality),name=chordName(pc,quality);
    const selected=state.selectedChord.pc===pc&&state.selectedChord.quality===quality;
    return `<button type="button" class="chord-tile${selected?' selected':''}" data-pc="${pc}" data-quality="${quality}" aria-pressed="${selected}"><strong>${name}</strong><span>${shape.frets.includes(0)?'OPEN':shape.barre?'BARRE':'MOVABLE'} · ${QUALITIES[quality].label.toUpperCase()}</span></button>`;
  }).join(''):'<div class="empty-state">No matches yet. Try a different root, chord type, or search.</div>';
}
function selectChord(pc,quality){
  state.selectedChord={pc,quality};
  document.querySelectorAll('.chord-tile').forEach(el=>{
    const match=Number(el.dataset.pc)===pc&&el.dataset.quality===quality;
    el.classList.toggle('selected',match);
    el.setAttribute('aria-pressed',String(match));
  });
  const chord=chordFor(pc,quality);
  const index=ROOTS.indexOf(pc)*QUALITY_ORDER.length+QUALITY_ORDER.indexOf(quality)+1;
  $('#chord-number').textContent=`${String(index).padStart(2,'0')} / 96`;
  $('#chord-quality').textContent=QUALITIES[quality].label.toUpperCase()+' CHORD';
  $('#selected-chord-name').textContent=chordName(pc,quality);
  $('#chord-difficulty').textContent=chordDifficulty(chord.shape);
  $('#chord-diagram').innerHTML=chordDiagramSVG(chord);
  $('#chord-notes').textContent=chordNotes(pc,quality,'mixed');
  $('#chord-position').textContent=describePosition(chord.shape);
  $('#chord-tip').textContent=chord.shape.tip||`${QUALITIES[quality].hint} Press close to each fret for a clean sound.`;
}
function stepsFor(progression){
  return progression.steps.map(([interval,quality,roman])=>({pc:mod(state.key.pc+interval),quality,roman}));
}
function selectedProgression(){return PROGRESSIONS.find(p=>p.id===state.selectedProgression);}
function renderProgressions(){
  $('#progression-list').innerHTML=PROGRESSIONS.map(p=>{
    const selected=p.id===state.selectedProgression;
    const steps=stepsFor(p);
    const chordSummary=steps.length>8?`${steps.slice(0,4).map(s=>chordName(s.pc,s.quality,state.key.accidentals)).join(' – ')} ...`:
      steps.map(s=>chordName(s.pc,s.quality,state.key.accidentals)).join(' – ');
    return `<button class="progression-card${selected?' selected':''}" type="button" data-progression="${p.id}" aria-pressed="${selected}"><div class="progression-card-heading"><strong>${p.name}</strong><span class="progression-card-category">${p.genre}</span></div><p>${p.description}</p><div class="progression-card-degrees">${p.roman}</div><div class="progression-card-chords">${chordSummary}</div></button>`;
  }).join('');
  renderPractice();
}
function renderPractice(){
  const p=selectedProgression(),steps=stepsFor(p);
  $('#progression-title').textContent=p.name;
  $('#progression-description').textContent=p.description;
  $('#progression-steps').innerHTML=steps.map((step,i)=>`<button type="button" class="step-tile${i===state.stepIndex?' active':''}" data-step="${i}" aria-pressed="${i===state.stepIndex}" aria-label="Bar ${i+1}, ${chordName(step.pc,step.quality,state.key.accidentals)}, ${step.roman}"><span class="step-degree">${step.roman}</span><span class="step-chord">${chordName(step.pc,step.quality,state.key.accidentals)}</span><span class="step-number">BAR ${String(i+1).padStart(2,'0')}</span></button>`).join('');
  updatePracticeChord();
}
function updatePracticeChord(){
  const steps=stepsFor(selectedProgression());
  const step=steps[state.stepIndex]||steps[0];
  if(!step)return;
  document.querySelectorAll('.step-tile').forEach((el,i)=>{
    const active=i===state.stepIndex;
    el.classList.toggle('active',active);
    el.setAttribute('aria-pressed',String(active));
  });
  $('#practice-current-name').textContent=chordName(step.pc,step.quality,state.key.accidentals);
  $('#practice-current-degree').textContent=`${step.roman} · ${QUALITIES[step.quality].label.toUpperCase()}`;
  $('#practice-mini-diagram').innerHTML=chordDiagramSVG(chordFor(step.pc,step.quality),{mini:true});
}
function updateBeatDots(index=-1){document.querySelectorAll('.beat-dot').forEach((el,i)=>el.classList.toggle('on',i===index));}
function updateTransport(){
  $('#transport-icon').textContent=state.playing?'Ⅱ':'▶';
  $('#transport-text').textContent=state.playing?'Pause practice':'Start practice';
}
function stopPractice(reset=true){
  if(state.interval!==null){clearInterval(state.interval);state.interval=null;}
  state.playing=false;
  if(reset){state.globalBeat=0;state.stepIndex=0;updatePracticeChord();}
  updateBeatDots();updateTransport();
  $('#practice-status').textContent='Each chord plays for four beats. Tap any chord to preview it.';
}
function tickPractice(){
  const steps=stepsFor(selectedProgression());
  const barIndex=Math.floor(state.globalBeat/4)%steps.length;
  const beat=state.globalBeat%4;
  state.stepIndex=barIndex;
  updatePracticeChord();updateBeatDots(beat);
  if(beat===0)strum(chordFor(steps[barIndex].pc,steps[barIndex].quality));
  if($('#metronome-toggle').checked)metronomeClick(beat===0);
  $('#practice-status').textContent=`Playing · bar ${barIndex+1} of ${steps.length} · beat ${beat+1} of 4`;
  state.globalBeat++;
}
function resumePractice(){
  state.playing=true;
  updateTransport();
  tickPractice();
  state.interval=setInterval(tickPractice,60000/state.bpm);
}
function pausePractice(){
  if(state.interval!==null)clearInterval(state.interval);
  state.interval=null;state.playing=false;updateTransport();updateBeatDots();
  $('#practice-status').textContent='Paused. Press Start to continue where you left off.';
}
function changeTempo(bpm){
  state.bpm=bpm;$('#tempo-output').textContent=String(bpm);
  $('#tempo-slider').style.background=`linear-gradient(to right,#c6ff70 ${((bpm-50)/130)*100}%,#4c6b56 ${((bpm-50)/130)*100}%)`;
  if(state.playing){clearInterval(state.interval);state.interval=setInterval(tickPractice,60000/state.bpm);}
}

function audioContext(){
  const Constructor=window.AudioContext||window.webkitAudioContext;
  if(!Constructor)return null;
  if(!state.audio)state.audio=new Constructor();
  if(state.audio.state==='suspended')state.audio.resume().catch(()=>{});
  return state.audio;
}
function strum(chord,options={}){
  const ctx=audioContext();if(!ctx)return;
  const notes=chord.shape.frets.flatMap((f,i)=>f<0?[]:[STRING_MIDI[i]+f]);
  const duration=options.duration??1.45,stagger=options.stagger??.051;
  const volume=options.volume??(chord.quality==='power'?.07:.095);
  for(let i=0;i<notes.length;i++){
    const at=ctx.currentTime+.01+i*stagger;
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=chord.quality==='power'?'sawtooth':'triangle';
    osc.frequency.value=440*Math.pow(2,(notes[i]-69)/12);
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(volume,at+.009);
    gain.gain.exponentialRampToValueAtTime(.001,at+duration);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(at);osc.stop(at+duration+.02);
  }
}
function metronomeClick(accent){
  const ctx=audioContext();if(!ctx)return;
  const at=ctx.currentTime+.015;
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(accent?1100:790,at);
  osc.frequency.exponentialRampToValueAtTime(accent?650:500,at+.045);
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(accent?.105:.055,at+.003);
  gain.gain.exponentialRampToValueAtTime(.001,at+.07);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(at);osc.stop(at+.08);
}

function renderPowerExplorer(){
  const pc=Number($('#power-root').value);
  const string=$('#power-string').value;
  const octave=$('#power-octave').checked;
  const chord=powerChordFor(pc,string,octave);
  const fifth=noteName(pc+7,'mixed'),root=noteName(pc,'mixed');
  $('#power-chord-name').textContent=root+'5';
  $('#power-diagram').innerHTML=chordDiagramSVG(chord);
  $('#power-notes').textContent=octave?`${root} · ${fifth} · ${root} (octave)`:`${root} · ${fifth}`;
  $('#power-position').textContent=`${string==='e'?'Low E':'A'} string · ${chord.shape.rootFret===0?'open root':'fret '+chord.shape.rootFret}`;
  $('#power-fingering').textContent=chord.shape.rootFret===0?
    `Let the ${string==='e'?'low E':'A'} string ring open. Fret the fifth two frets up on the next string${octave?', then add the octave on the following string':''}. Mute all other strings.`:
    `Index finger on fret ${chord.shape.rootFret}; ring finger on fret ${chord.shape.rootFret+2} of the next string${octave?', pinky on that same fret of the following string':''}. Mute all other strings.`;
  document.querySelectorAll('[data-power-example]').forEach(button=>button.classList.toggle('selected',Number(button.dataset.powerExample)===pc));
}
function renderPunkList(){
  $('#punk-list').innerHTML=PUNK_PROGRESSIONS.map(p=>{
    const selected=state.punk.selected===p.id;
    const chordSummary=p.steps.map(([offset])=>punkChordName(state.punk.key.pc+offset)).join(' – ');
    return `<button class="progression-card${selected?' selected':''}" type="button" data-punk="${p.id}" aria-pressed="${selected}"><div class="progression-card-heading"><strong>${p.name}</strong><span class="progression-card-category">${p.genre}</span></div><p>${p.description}</p><div class="progression-card-degrees">${p.roman}</div><div class="progression-card-chords">${chordSummary}</div></button>`;
  }).join('');
  renderPunkPractice();
}
function renderPunkPractice(){
  const p=selectedPunk(),steps=punkSteps();
  $('#punk-title').textContent=p.name;
  $('#punk-description').textContent=p.description;
  $('#punk-steps').innerHTML=steps.map((step,i)=>`<button type="button" class="step-tile${i===state.punk.stepIndex?' active':''}" data-punk-step="${i}" aria-pressed="${i===state.punk.stepIndex}" aria-label="Bar ${i+1}, ${punkChordName(step.pc)}, ${step.roman}"><span class="step-degree">${step.roman}</span><span class="step-chord">${punkChordName(step.pc)}</span><span class="step-number">BAR ${String(i+1).padStart(2,'0')}</span></button>`).join('');
  updatePunkChord();
}
function updatePunkChord(){
  const steps=punkSteps(),step=steps[state.punk.stepIndex]||steps[0];
  if(!step)return;
  document.querySelectorAll('#punk-steps .step-tile').forEach((el,i)=>{
    const active=i===state.punk.stepIndex;
    el.classList.toggle('active',active);
    el.setAttribute('aria-pressed',String(active));
  });
  $('#punk-current-name').textContent=punkChordName(step.pc);
  $('#punk-current-degree').textContent=`${step.roman} · POWER CHORD`;
  $('#punk-mini-diagram').innerHTML=chordDiagramSVG(powerChordFor(step.pc,'auto',true),{mini:true});
}
function setPunkBeat(beat=-1){document.querySelectorAll('#punk-beats .beat-dot').forEach((el,i)=>el.classList.toggle('on',i===beat));}
function updatePunkTransport(){
  $('#punk-play-icon').textContent=state.punk.playing?'Ⅱ':'▶';
  $('#punk-play-text').textContent=state.punk.playing?'Pause punk practice':'Start punk practice';
}
function stopPunkPractice(reset=true){
  if(state.punk.interval!==null){clearInterval(state.punk.interval);state.punk.interval=null;}
  state.punk.playing=false;
  if(reset){state.punk.eighthIndex=0;state.punk.stepIndex=0;updatePunkChord();}
  setPunkBeat();updatePunkTransport();
  $('#punk-status').textContent='Four beats per chord. Follow the dots and keep the downstrokes tight.';
}
function tickPunk(){
  const steps=punkSteps(),eighth=state.punk.eighthIndex;
  const bar=Math.floor(eighth/8)%steps.length;
  const within=eighth%8,beat=Math.floor(within/2);
  state.punk.stepIndex=bar;
  if(within%2===0){updatePunkChord();setPunkBeat(beat);if($('#punk-metronome').checked)metronomeClick(beat===0);}
  if($('#punk-rhythm').value==='eighths'||within%2===0){
    const halfBeat=60/state.punk.bpm/2;
    strum(powerChordFor(steps[bar].pc,'auto',true),{duration:Math.min(.16,halfBeat*.8),stagger:.007,volume:within%2===0?.048:.033});
  }
  $('#punk-status').textContent=`Playing · bar ${bar+1} of ${steps.length} · beat ${beat+1} of 4`;
  state.punk.eighthIndex++;
}
function startPunkPractice(){
  state.punk.playing=true;
  updatePunkTransport();tickPunk();
  state.punk.interval=setInterval(tickPunk,30000/state.punk.bpm);
}
function pausePunkPractice(){
  if(state.punk.interval!==null)clearInterval(state.punk.interval);
  state.punk.interval=null;state.punk.playing=false;
  setPunkBeat();updatePunkTransport();
  $('#punk-status').textContent='Paused. Press Start to pick up where you left off.';
}
function changePunkTempo(bpm){
  state.punk.bpm=bpm;
  $('#punk-tempo-output').textContent=String(bpm);
  const pct=(bpm-80)/140*100;
  $('#punk-tempo').style.background=`linear-gradient(to right,#c6ff70 ${pct}%,#4c6b56 ${pct}%)`;
  if(state.punk.playing){clearInterval(state.punk.interval);state.punk.interval=setInterval(tickPunk,30000/bpm);}
}

function switchTab(tab,focusTab=false){
  if(state.tab!==tab){if(state.playing)stopPractice();if(state.punk.playing)stopPunkPractice();}
  state.tab=tab;
  for(const section of ['chords','progressions','power']){
    const active=tab===section;
    $(`#panel-${section}`).hidden=!active;
    const button=$(`#tab-${section}`);
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
    button.tabIndex=active?0:-1;
  }
  if(focusTab)$(`#tab-${tab}`).focus();
}
function init(){
  $('#chord-count').textContent=String(ROOTS.length*QUALITY_ORDER.length);
  $('#root-filter').insertAdjacentHTML('beforeend',ROOTS.map(pc=>{
    const sharp=SHARP[pc],flat=FLAT[pc],name=sharp===flat?sharp:`${sharp} / ${flat}`;
    return `<option value="${pc}">${name}</option>`;
  }).join(''));
  $('#key-select').innerHTML=MAJOR_KEYS.map(k=>`<option value="${k.name}">${k.name} major</option>`).join('');
  $('#key-select').value='C';
  $('#power-root').innerHTML=ROOTS.map(pc=>`<option value="${pc}">${noteName(pc)}</option>`).join('');
  $('#power-root').value='7';
  $('#punk-key').innerHTML=MAJOR_KEYS.map(k=>`<option value="${k.name}">${k.name} major tonic</option>`).join('');
  $('#punk-key').value='E';
  renderChordList();selectChord(0,'major');renderProgressions();changeTempo(90);
  renderPowerExplorer();renderPunkList();changePunkTempo(160);
  $('#chord-list').addEventListener('click',e=>{
    const tile=e.target.closest('.chord-tile');if(!tile)return;
    selectChord(Number(tile.dataset.pc),tile.dataset.quality);
  });
  $('#chord-search').addEventListener('input',renderChordList);
  $('#root-filter').addEventListener('change',renderChordList);
  $('#quality-filter').addEventListener('change',renderChordList);
  $('#play-chord').addEventListener('click',()=>strum(chordFor(state.selectedChord.pc,state.selectedChord.quality)));
  $('#tab-chords').addEventListener('click',()=>switchTab('chords'));
  $('#tab-progressions').addEventListener('click',()=>switchTab('progressions'));
  $('#tab-power').addEventListener('click',()=>switchTab('power'));
  const tabNames=['chords','progressions','power'];
  for(const tab of document.querySelectorAll('.tab'))tab.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'||event.key==='Home'||event.key==='End'){
      event.preventDefault();
      const direction=event.key==='ArrowRight'?1:-1;
      const target=event.key==='Home'?0:event.key==='End'?tabNames.length-1:mod(tabNames.indexOf(state.tab)+direction,tabNames.length);
      switchTab(tabNames[target],true);
    }
  });
  $('#hero-chords').addEventListener('click',()=>{switchTab('chords');$('#main').scrollIntoView({behavior:'smooth'});});
  $('#hero-progressions').addEventListener('click',()=>{switchTab('progressions');$('#main').scrollIntoView({behavior:'smooth'});});
  $('#key-select').addEventListener('change',e=>{
    stopPractice();state.key=MAJOR_KEYS.find(k=>k.name===e.target.value)||MAJOR_KEYS[0];renderProgressions();
  });
  $('#progression-list').addEventListener('click',e=>{
    const card=e.target.closest('.progression-card');if(!card)return;
    stopPractice();state.selectedProgression=card.dataset.progression;renderProgressions();
  });
  $('#progression-steps').addEventListener('click',e=>{
    const tile=e.target.closest('.step-tile');if(!tile)return;
    const idx=Number(tile.dataset.step),step=stepsFor(selectedProgression())[idx];
    state.stepIndex=idx;state.globalBeat=idx*4+(state.playing?1:0);
    updatePracticeChord();strum(chordFor(step.pc,step.quality));
    if(state.playing){updateBeatDots(0);$('#practice-status').textContent=`Playing · bar ${idx+1} of ${stepsFor(selectedProgression()).length} · beat 1 of 4`;}
  });
  $('#power-root').addEventListener('change',renderPowerExplorer);
  $('#power-string').addEventListener('change',renderPowerExplorer);
  $('#power-octave').addEventListener('change',renderPowerExplorer);
  document.querySelector('.power-example-buttons').addEventListener('click',e=>{
    const button=e.target.closest('[data-power-example]');if(!button)return;
    const pc=Number(button.dataset.powerExample);
    $('#power-root').value=String(pc);
    $('#power-string').value=mod(pc-4)<=mod(pc-9)?'e':'a';
    renderPowerExplorer();
  });
  $('#power-play').addEventListener('click',()=>strum(powerChordFor(Number($('#power-root').value),$('#power-string').value,$('#power-octave').checked)));
  $('#punk-key').addEventListener('change',e=>{
    stopPunkPractice();state.punk.key=MAJOR_KEYS.find(k=>k.name===e.target.value)||MAJOR_KEYS[4];renderPunkList();
  });
  $('#punk-list').addEventListener('click',e=>{
    const card=e.target.closest('[data-punk]');if(!card)return;
    stopPunkPractice();state.punk.selected=card.dataset.punk;renderPunkList();
  });
  $('#punk-steps').addEventListener('click',e=>{
    const tile=e.target.closest('[data-punk-step]');if(!tile)return;
    const idx=Number(tile.dataset.punkStep),step=punkSteps()[idx];
    state.punk.stepIndex=idx;state.punk.eighthIndex=idx*8+(state.punk.playing?1:0);
    updatePunkChord();setPunkBeat(0);
    strum(powerChordFor(step.pc,'auto',true));
  });
  $('#punk-tempo').addEventListener('input',e=>changePunkTempo(Number(e.target.value)));
  $('#punk-play').addEventListener('click',()=>state.punk.playing?pausePunkPractice():startPunkPractice());
  $('#punk-stop').addEventListener('click',()=>stopPunkPractice());
  $('#tempo-slider').addEventListener('input',e=>changeTempo(Number(e.target.value)));
  $('#transport-play').addEventListener('click',()=>state.playing?pausePractice():resumePractice());
  $('#transport-stop').addEventListener('click',()=>stopPractice());
  document.addEventListener('keydown',e=>{
    if(e.code!=='Space'||!['progressions','power'].includes(state.tab)||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName))return;
    e.preventDefault();
    if(state.tab==='power')state.punk.playing?pausePunkPractice():startPunkPractice();
    else state.playing?pausePractice():resumePractice();
  });
}

document.addEventListener('DOMContentLoaded',init);
