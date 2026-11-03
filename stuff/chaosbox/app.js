const $=id=>document.getElementById(id);
const examples={
greet:{code:'name => "Hello, " + name + "! 👋"',args:'["world"]'},
math:{code:'(a, b) => ({ sum: a + b, difference: a - b, product: a * b, quotient: b === 0 ? "Cannot divide by zero" : a / b })',args:'[12, 4]'},
factorial:{code:'function factorial(n) {\n  if (n < 0) throw new Error("Use a non-negative number");\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',args:'[6]'},
filter:{code:'(numbers, minimum = 0) => numbers.filter(number => number >= minimum)',args:'[[3, 8, 1, 12, 5, 20], 8]'},
word:{code:'text => ({ words: text.trim() ? text.trim().split(/\\s+/).length : 0, characters: text.length, uppercase: text.toUpperCase() })',args:'["Functions are pretty cool"]'},
fibonacci:{code:'(count) => {\n  const sequence = [];\n  for (let i = 0; i < count; i++) sequence.push(i < 2 ? i : sequence[i - 1] + sequence[i - 2]);\n  return sequence;\n}',args:'[12]'},
async:{code:'async name => {\n  await new Promise(resolve => setTimeout(resolve, 500));\n  return "Finished waiting, " + name + "!";\n}',args:'["experiment"]'},
custom:{code:'value => {\n  // Write your function here\n  return value;\n}',args:'["hello"]'}
};
let activeExample='greet',lastOutput='';
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2300)}
function loadExample(name){const item=examples[name]||examples.custom;activeExample=name;$('functionCode').value=item.code;$('functionArgs').value=item.args;$('functionOutput').textContent='Ready. Press RUN FUNCTION to execute.';$('runStatus').textContent='READY TO EXECUTE';lastOutput=''}
$('exampleSelect').addEventListener('change',e=>loadExample(e.target.value));
$('resetCode').addEventListener('click',()=>loadExample(activeExample));
$('runFunction').addEventListener('click',async()=>{
 const code=$('functionCode').value.trim(),out=$('functionOutput'),status=$('runStatus');
 if(!code){out.textContent='Write a function first.';status.textContent='NO FUNCTION';return}
 let args;
 try{args=JSON.parse($('functionArgs').value);if(!Array.isArray(args))throw new Error('Arguments must be a JSON array, e.g. [1, 2].')}
 catch(error){out.textContent='ARGUMENT ERROR\n'+error.message;status.textContent='INVALID ARGUMENTS';return}
 status.textContent='RUNNING...';out.textContent='Executing...';$('runFunction').disabled=true;
 try{
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  const runner=new AsyncFunction('args','"use strict"; const fn = ('+code+'); if (typeof fn !== "function") throw new TypeError("Your code must evaluate to a function."); return await fn(...args);');
  const value=await runner(args);
  lastOutput=typeof value==='undefined'?'undefined':JSON.stringify(value,null,2)??String(value);
  if(typeof value==='string')lastOutput=JSON.stringify(value);
  if(typeof value==='function')lastOutput='[Function '+(value.name||'anonymous')+']';
  out.textContent=lastOutput;status.textContent='✓ EXECUTED SUCCESSFULLY';
 }catch(error){lastOutput=error.name+': '+error.message;out.textContent='ERROR\n'+lastOutput;status.textContent='✕ EXECUTION FAILED'}
 finally{$('runFunction').disabled=false}
});
$('copyOutput').addEventListener('click',async()=>{if(!lastOutput){toast('RUN A FUNCTION FIRST.');return}try{await navigator.clipboard.writeText(lastOutput);toast('OUTPUT COPIED.')}catch{toast('CLIPBOARD ACCESS WAS BLOCKED.')}});
loadExample('greet');
let audioContext;
function audio(){const C=window.AudioContext||window.webkitAudioContext;if(!C){toast('Web Audio is not supported in this browser.');return null}audioContext??=new C();if(audioContext.state==='suspended')audioContext.resume();return audioContext}
$('beepBtn').addEventListener('click',()=>{const ctx=audio();if(!ctx)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(880,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(220,ctx.currentTime+.28);gain.gain.setValueAtTime(.18,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.3);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.31);$('soundReadout').textContent='BEEP TRANSMITTED // 880 → 220 HZ'});
$('noiseBtn').addEventListener('click',()=>{const ctx=audio();if(!ctx)return;const length=Math.floor(ctx.sampleRate*.22),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,2);const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffer;gain.gain.value=.22;src.connect(gain).connect(ctx.destination);src.start();$('soundReadout').textContent='STATIC BURST // RANDOMIZED'});
$('glitchBtn').addEventListener('click',()=>{document.body.classList.remove('glitch');void document.body.offsetWidth;document.body.classList.add('glitch');toast('REALITY.EXE HAS ENCOUNTERED A MINOR ISSUE');setTimeout(()=>document.body.classList.remove('glitch'),1300)});
function setSpin(v){$('spinValue').value=v;$('spinner').style.animation='spin '+(11-Number(v))*.16+'s linear infinite'}const style=document.createElement('style');style.textContent='@keyframes spin{to{transform:rotate(360deg)}}';document.head.append(style);setSpin(5);$('spinRange').addEventListener('input',e=>setSpin(e.target.value));
const fancy='𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',plain='abcdefghijklmnopqrstuvwxyz';let unicodeResult='';$('convertBtn').addEventListener('click',()=>{unicodeResult=[...$('unicodeInput').value].map(ch=>{const i=plain.indexOf(ch.toLowerCase());return i<0?ch:fancy[i]}).join('');$('unicodeOutput').textContent=unicodeResult||'TYPE SOMETHING FIRST, CHAOS ENGINEER.'});$('copyBtn').addEventListener('click',async()=>{if(!unicodeResult){toast('NOTHING TO COPY YET.');return}try{await navigator.clipboard.writeText(unicodeResult);toast('COPIED TO CLIPBOARD.')}catch{toast('CLIPBOARD ACCESS WAS BLOCKED.')}});
const fates=['ABSOLUTELY YES','ASK A POTATO','NOT TODAY','ROLL AGAIN','THE PROPHECY IS UNCLEAR','DO IT (RESPONSIBLY)','42','MAYBE IN ANOTHER TIMELINE','COMPUTER SAYS NO','YES, BUT WHY?'];$('randomBtn').addEventListener('click',()=>{$('decision').textContent=fates[Math.floor(Math.random()*fates.length)]});
$('forbiddenBtn').addEventListener('click',()=>{document.getElementById('freezeOverlay').hidden=false;document.body.style.overflow='hidden';document.title='Not Responding — CHAOSBOX';});