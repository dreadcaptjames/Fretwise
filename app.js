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
  dim:{label:'Diminished',suffix:'dim',intervals:[0,3,6],hint:'Tense and unsettled; great for linking other chords.'}
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

const $ = (selector) => document.querySelector(selector);
const state = {tab:'chords',selectedChord:{pc:0,quality:'major'},selectedProgression:'pop',key:MAJOR_KEYS[0],stepIndex:0,bpm:90,playing:false,globalBeat:0,interval:null,audio:null};

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
function strum(chord){
  const ctx=audioContext();if(!ctx)return;
  const notes=chord.shape.frets.flatMap((f,i)=>f<0?[]:[STRING_MIDI[i]+f]);
  for(let i=0;i<notes.length;i++){
    const at=ctx.currentTime+.02+i*.051;
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type='triangle';osc.frequency.value=440*Math.pow(2,(notes[i]-69)/12);
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(.095,at+.018);
    gain.gain.exponentialRampToValueAtTime(.001,at+1.45);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(at);osc.stop(at+1.46);
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
function switchTab(tab,focusTab=false){
  if(state.tab!==tab&&state.playing)stopPractice();
  state.tab=tab;
  for(const section of ['chords','progressions']){
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
  renderChordList();selectChord(0,'major');renderProgressions();changeTempo(90);
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
  for(const tab of document.querySelectorAll('.tab'))tab.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();switchTab(state.tab==='chords'?'progressions':'chords',true);
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
  $('#tempo-slider').addEventListener('input',e=>changeTempo(Number(e.target.value)));
  $('#transport-play').addEventListener('click',()=>state.playing?pausePractice():resumePractice());
  $('#transport-stop').addEventListener('click',()=>stopPractice());
  document.addEventListener('keydown',e=>{
    if(e.code!=='Space'||state.tab!=='progressions'||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName))return;
    e.preventDefault();state.playing?pausePractice():resumePractice();
  });
}

document.addEventListener('DOMContentLoaded',init);
