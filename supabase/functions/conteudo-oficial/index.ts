import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(x:any,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...cors,"Content-Type":"application/json","Cache-Control":"public, max-age=1800"}});
const monthNames=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const unescapeHtml=(s:string)=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const abs=(href:string,base:string)=>href.startsWith('http')?href:new URL(href,base).toString();


async function getCache(key:string,maxAgeMs:number){
  const base=Deno.env.get('SUPABASE_URL'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!base||!service)return null;
  try{
    const r=await fetch(`${base}/rest/v1/portal_cache?cache_key=eq.${encodeURIComponent(key)}&select=payload,updated_at&limit=1`,{headers:{apikey:service,Authorization:`Bearer ${service}`}});
    const rows=await r.json(); if(!r.ok||!Array.isArray(rows)||!rows[0])return null;
    const age=Date.now()-new Date(rows[0].updated_at).getTime(); return age<=maxAgeMs?rows[0].payload:null;
  }catch{return null}
}
async function setCache(key:string,payload:any){
  const base=Deno.env.get('SUPABASE_URL'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!base||!service)return;
  try{await fetch(`${base}/rest/v1/portal_cache?on_conflict=cache_key`,{method:'POST',headers:{apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify({cache_key:key,payload,updated_at:new Date().toISOString()})})}catch{}
}

async function fetchText(url:string){const r=await fetch(url,{headers:{'User-Agent':'GuidettiContabilPortal/1.0'}});if(!r.ok)throw new Error(`Fonte oficial indisponível (${r.status})`);return await r.text()}

async function calendar(){
  const now=new Date();
  const targets=[new Date(now.getFullYear(),now.getMonth(),1),new Date(now.getFullYear(),now.getMonth()+1,1)];
  const items:any[]=[];
  for(const d of targets){
    const year=d.getFullYear(),month=monthNames[d.getMonth()];
    const base=`https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria/${year}/${month}`;
    let html='';try{html=await fetchText(base)}catch{continue}
    const re=/href="([^"]*dia-(\d{2})-(\d{2})-(\d{4})[^"]*)"/gi;let m;
    const seen=new Set<string>();
    while((m=re.exec(html))){
      const url=abs(m[1],base); if(seen.has(url))continue;seen.add(url);
      const date=new Date(`${m[4]}-${m[3]}-${m[2]}T12:00:00`);if(date<new Date(now.getFullYear(),now.getMonth(),now.getDate()))continue;
      let page='';try{page=await fetchText(url)}catch{continue}
      const groups=[...page.matchAll(/<td[^>]*>\s*([^<]{2,80})\s*<\/td>/gi)].map(x=>unescapeHtml(x[1])).filter(Boolean);
      const preferred=groups.find(x=>/Simples Nacional|INSS|FGTS|IRRF|PIS|Cofins|IPI|DCTFWeb|IOF/i.test(x));
      const title=preferred?`${preferred} — vencimentos do dia`:'Obrigações tributárias do dia';
      items.push({day:m[2],month:month.slice(0,3).toUpperCase(),title,text:'Consulte os códigos, períodos de apuração e bases legais na Agenda Tributária oficial.',type:'RFB',url,date:date.toISOString()});
      if(items.length>=10)break;
    }
    if(items.length>=10)break;
  }
  items.sort((a,b)=>a.date.localeCompare(b.date));
  return {items:items.slice(0,8),source:'Receita Federal — Agenda Tributária'};
}

function collectNews(html:string,base:string,source:string){
  const out:any[]=[];const seen=new Set<string>();
  const re=/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;let m;
  while((m=re.exec(html))){
    const title=unescapeHtml(m[2]);if(title.length<28||title.length>180)continue;
    if(!/(tribut|fiscal|receita|cnpj|simples|declara|dctf|esocial|trabalh|folha|crédito do trabalhador|nota fiscal|imposto|contribui)/i.test(title))continue;
    const url=abs(m[1],base);if(seen.has(url)||!url.startsWith('https://www.gov.br/'))continue;seen.add(url);
    out.push({date:source.toUpperCase(),title,text:`Atualização publicada em fonte oficial. Abra a matéria para consultar os detalhes e a data de publicação.`,url});
    if(out.length>=5)break;
  }
  return out;
}
async function summarizeWithAI(items:any[]){
  const key=Deno.env.get('OPENAI_API_KEY'); if(!key||!items.length)return items;
  const enriched=[];
  for(const item of items){
    let body='';
    try{body=unescapeHtml((await fetchText(item.url)).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')).slice(0,9000)}catch{}
    enriched.push({...item,body});
  }
  const prompt=`Você recebe matérias de FONTES OFICIAIS do governo brasileiro. Gere um resumo curto e estritamente factual de cada item, em português simples para clientes de um escritório contábil. Não invente impacto, prazo ou obrigação que não esteja no texto. Se o conteúdo disponível for insuficiente, escreva apenas "Consulte a fonte oficial para os detalhes.". Retorne SOMENTE JSON válido no formato {"items":[{"url":"...","text":"resumo de até 220 caracteres"}]}.\n\n`+enriched.map((x,i)=>`ITEM ${i+1}\nURL: ${x.url}\nTÍTULO: ${x.title}\nCONTEÚDO: ${x.body}`).join('\n\n');
  try{
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_MODEL')||'gpt-5-mini',input:prompt,max_output_tokens:1400})});
    const d=await r.json(); if(!r.ok)return items;
    const out=d.output_text||d.output?.flatMap((x:any)=>x.content||[]).find((c:any)=>c.type==='output_text')?.text||'{}';
    const parsed=JSON.parse(String(out).replace(/^```json\s*/i,'').replace(/```$/,'').trim());
    const byUrl=new Map((parsed.items||[]).map((x:any)=>[x.url,x.text]));
    return items.map(x=>({...x,text:byUrl.get(x.url)||x.text}));
  }catch{return items}
}
async function news(){
  const sources=[
    {url:'https://www.gov.br/receitafederal/pt-br/assuntos/noticias',name:'Receita Federal'},
    {url:'https://www.gov.br/esocial/pt-br/noticias',name:'eSocial'}
  ];
  let items:any[]=[];
  for(const s of sources){try{items=items.concat(collectNews(await fetchText(s.url),s.url,s.name))}catch{/* mantém demais fontes */}}
  const dedup=[...new Map(items.map(x=>[x.url,x])).values()].slice(0,6);
  return {items:await summarizeWithAI(dedup),source:'gov.br — Receita Federal e eSocial'};
}

serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'Método não permitido'},405);
  try{
    const {action}=await req.json();
    if(action!=='calendar'&&action!=='news')return json({error:'Ação inválida'},400);
    const maxAge=action==='news'?6*60*60*1000:12*60*60*1000;
    const cached=await getCache(action,maxAge);if(cached)return json({...cached,cached:true});
    const fresh=action==='news'?await news():await calendar();await setCache(action,fresh);return json({...fresh,cached:false});
  }catch(e){return json({error:String(e?.message||e)},500)}
});
