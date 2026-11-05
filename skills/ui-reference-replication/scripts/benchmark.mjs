#!/usr/bin/env node
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const SOURCES=["provider-runtime","host-runtime","estimated","unavailable"], STATUSES=["pass","partial","fail","not-tested"];
async function hasFile(root,rel){if(typeof rel!=="string"||!rel.trim()||path.isAbsolute(rel))return false;const p=path.resolve(root,rel);if(p!==root&&!p.startsWith(root+path.sep))return false;try{const r=await realpath(p);return(r===root||r.startsWith(root+path.sep))&&(await stat(r)).isFile();}catch{return false;}}
export async function validateBenchmark(d,root=process.cwd()){
 const errors=[],warnings=[],runs=Array.isArray(d&&d.runs)?d.runs:[],ids=new Set(),base=await realpath(root);
 if(!d||d.schemaVersion!=="1.0.0")errors.push("schemaVersion must be 1.0.0.");
 if(!d||typeof d.benchmarkId!=="string"||!d.benchmarkId.trim())errors.push("benchmarkId is required.");
 const s=d&&d.scenario;
 if(!s||!s.id||!s.fixtureId)errors.push("scenario.id and scenario.fixtureId are required.");
 if(!["new-build","existing-redesign","hybrid"].includes(s&&s.workMode))errors.push("scenario.workMode is invalid.");
 if(!["reference-faithful","reference-inspired-creative"].includes(s&&s.fidelity))errors.push("scenario.fidelity is invalid.");
 if(!Array.isArray(d&&d.runs))errors.push("runs must be an array.");
 let valid=0;
 for(const [i,r] of runs.entries()){
  const tag="runs["+i+"]",before=errors.length;
  if(!r||typeof r.runId!=="string"||!r.runId.trim()||ids.has(r.runId))errors.push(tag+": runId missing or duplicated.");else ids.add(r.runId);
  for(const k of ["id","model","runtime","skillVersion"])if(typeof(r&&r.agent&&r.agent[k])!=="string"||!r.agent[k].trim())errors.push(tag+": agent."+k+" required.");
  if(!r||typeof r.measuredAt!=="string"||Number.isNaN(Date.parse(r.measuredAt)))errors.push(tag+": measuredAt invalid.");
  const q=r&&r.quality,u=r&&r.usage;
  if(!q||!STATUSES.includes(q.visualReview)||!STATUSES.includes(q.functionalRegression)||!Number.isInteger(q.criticalDefects)||q.criticalDefects<0)errors.push(tag+": quality statuses and criticalDefects required.");
  if(!u||!SOURCES.includes(u.source))errors.push(tag+": usage.source invalid.");
  for(const k of ["inputTokens","outputTokens"])if(u&&u[k]!=null&&(!Number.isSafeInteger(u[k])||u[k]<0))errors.push(tag+": "+k+" must be non-negative integer or null.");
  if(u&&["provider-runtime","host-runtime"].includes(u.source)&&(!Number.isSafeInteger(u.inputTokens)||!Number.isSafeInteger(u.outputTokens)))errors.push(tag+": measured usage requires numeric inputTokens and outputTokens.");
  if(u&&u.actualCostUsd!=null&&(!Number.isFinite(u.actualCostUsd)||u.actualCostUsd<0||!["provider-runtime","host-runtime"].includes(u.costSource)))errors.push(tag+": actualCostUsd requires a non-negative value and provider/host costSource.");
  if(!Array.isArray(r&&r.evidence))errors.push(tag+": evidence must be an array.");
  if(Array.isArray(r&&r.evidence))for(const f of r.evidence)if(!await hasFile(base,f))errors.push(tag+": evidence missing or outside root: "+f);
  if(q&&(q.visualReview==="pass"||q.functionalRegression==="pass")&&(!Array.isArray(r.evidence)||!r.evidence.length))errors.push(tag+": passing quality claims require evidence.");
  if(u&&u.source==="estimated")warnings.push(tag+": estimates are excluded from savings comparisons.");
  if(!errors.some(e=>e.startsWith(tag)))valid++;
 }
 if(!runs.length&&!errors.length)warnings.push("No runs recorded; no savings claim can be made.");
 return{schemaVersion:"1.0.0",status:errors.length?"fail":runs.length?"pass":"not-tested",benchmarkId:d&&d.benchmarkId||null,runCount:valid,errors,warnings,limitation:"Schema/evidence references are checked; provider usage, runtime identity, benchmark fairness, and agent declarations are not independently verified."};
}
const median=a=>{const x=[...a].sort((m,n)=>m-n),i=Math.floor(x.length/2);return!x.length?null:x.length%2?x[i]:(x[i-1]+x[i])/2;};
const qualityPass=r=>r.length>0&&r.every(x=>x.quality&&x.quality.visualReview==="pass"&&x.quality.functionalRegression==="pass"&&x.quality.criticalDefects===0);
export function compareBenchmarks(a,b,min=3){
 const key=x=>JSON.stringify([x&&x.scenario&&x.scenario.id,x&&x.scenario&&x.scenario.fixtureId,x&&x.scenario&&x.scenario.workMode,x&&x.scenario&&x.scenario.fidelity]);
 if(key(a)!==key(b))return{status:"not-comparable",reason:"Scenario/fixture/work/fidelity differs.",tokenSavingsPercent:null};
 const x=a.runs||[],y=b.runs||[],id=r=>JSON.stringify([r.agent.id,r.agent.model,r.agent.runtime]);
 if(!x.length||!y.length||new Set(x.map(id)).size!==1||new Set(y.map(id)).size!==1||id(x[0])!==id(y[0]))return{status:"not-comparable",reason:"Agent/model/runtime must match.",tokenSavingsPercent:null};
 const qa=qualityPass(x),qb=qualityPass(y);
 if(!qa||!qb)return{status:qa&&!qb?"quality-regression":"quality-not-eligible",quality:{baselinePass:qa,candidatePass:qb},tokenSavingsPercent:null,costSavingsPercent:null};
 if(x.length<min||y.length<min)return{status:"insufficient-samples",minimumRuns:min,counts:{baseline:x.length,candidate:y.length},tokenSavingsPercent:null};
 const src=r=>[...new Set(r.map(z=>z.usage.source))],sx=src(x),sy=src(y);
 if(sx.length!==1||sy.length!==1||sx[0]!==sy[0]||!["provider-runtime","host-runtime"].includes(sx[0]))return{status:"usage-not-measured",usageSources:{baseline:sx,candidate:sy},tokenSavingsPercent:null};
 const tx=median(x.map(z=>z.usage.inputTokens+z.usage.outputTokens)),ty=median(y.map(z=>z.usage.inputTokens+z.usage.outputTokens));
 if(!(tx>0))return{status:"invalid-baseline",tokenSavingsPercent:null};
 const delta=(ty-tx)/tx*100,cx=[...new Set(x.map(z=>z.usage.costSource))],cy=[...new Set(y.map(z=>z.usage.costSource))];
 const costOk=x.every(z=>Number.isFinite(z.usage.actualCostUsd))&&y.every(z=>Number.isFinite(z.usage.actualCostUsd))&&cx.length===1&&cy.length===1&&cx[0]===cy[0]&&["provider-runtime","host-runtime"].includes(cx[0]);
 const costX=costOk?median(x.map(z=>z.usage.actualCostUsd)):null,costY=costOk?median(y.map(z=>z.usage.actualCostUsd)):null;
 return{status:"comparable",sampleCount:{baseline:x.length,candidate:y.length},usageSource:sx[0],quality:{baselinePass:true,candidatePass:true,criticalDefectsBaseline:0,criticalDefectsCandidate:0},tokens:{baselineMedian:tx,candidateMedian:ty,deltaPercent:+delta.toFixed(2),savingsPercent:+(-delta).toFixed(2)},cost:costOk?{source:cx[0],baselineMedianUsd:costX,candidateMedianUsd:costY,savingsPercent:costX>0?+((costX-costY)/costX*100).toFixed(2):null}:null,explanation:"Savings use only measured provider/host usage, identical fixture and agent/model/runtime, repeated runs, and passing visual/functional quality with zero critical defects. Estimates are excluded."};
}
async function main(){const a=process.argv.slice(2),get=n=>{const i=a.indexOf(n);return i<0?null:a[i+1];};if(a.includes("--help")||a.includes("-h")){console.log("benchmark.mjs validate --file <benchmark.json> [--root .] | compare --baseline <base.json> --candidate <next.json> [--minimum-runs 3]");return;}
 if(a[0]==="validate"){const f=get("--file");if(!f||path.isAbsolute(f))throw Error("Required relative --file.");const root=path.resolve(get("--root")||"."),p=path.resolve(root,f);if(p!==root&&!p.startsWith(root+path.sep))throw Error("Path escapes root.");const rr=await realpath(root),rp=await realpath(p);if(rp!==rr&&!rp.startsWith(rr+path.sep))throw Error("Symlink escapes root.");const r=await validateBenchmark(JSON.parse(await readFile(rp,"utf8")),rr);console.log(JSON.stringify(r,null,2));if(r.status!=="pass")process.exitCode=1;return;}
 if(a[0]==="compare"){const p=get("--baseline"),q=get("--candidate"),n=Number(get("--minimum-runs")||3);if(!p||!q||!Number.isInteger(n)||n<1)throw Error("Required baseline/candidate and positive minimum-runs.");const [x,y]=await Promise.all([p,q].map(z=>readFile(path.resolve(z),"utf8").then(JSON.parse)));const r=compareBenchmarks(x,y,n);console.log(JSON.stringify(r,null,2));if(r.status!=="comparable")process.exitCode=1;return;}throw Error("Use validate or compare.");}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=2;});
