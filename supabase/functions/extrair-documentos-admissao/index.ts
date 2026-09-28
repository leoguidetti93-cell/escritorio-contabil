import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(x:any,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...cors,"Content-Type":"application/json"}});
serve(async(req)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  if(req.method!=='POST') return json({error:'Método não permitido'},405);
  try{
    const {files=[]}=await req.json();
    if(!Array.isArray(files)||!files.length) return json({error:'Nenhum documento recebido'},400);
    if(files.length>8) return json({error:'Envie no máximo 8 imagens por leitura'},400);
    const key=Deno.env.get('OPENAI_API_KEY'); if(!key) throw new Error('OPENAI_API_KEY não configurada');
    const content:any[]=[{type:'input_text',text:`Analise as imagens de documentos brasileiros de uma admissão trabalhista. Extraia apenas informações claramente visíveis. Não invente dados. Se houver conflito entre documentos, deixe o campo vazio quando não for possível decidir com segurança. Retorne SOMENTE JSON válido, sem markdown, neste formato:\n{"nome_completo":"","cpf":"","data_nascimento":"YYYY-MM-DD ou vazio","rg":"","pis_nis":"","nome_mae":"","estado_civil":"","cep":"","endereco":"","documentos_identificados":["CNH","CPF"]}.\nPara endereço, una logradouro, número, complemento, bairro, cidade e UF quando existirem. Preserve zeros à esquerda em documentos.`}];
    for(const f of files){
      if(!String(f.type||'').startsWith('image/')) continue;
      content.push({type:'input_image',image_url:`data:${f.type};base64,${f.data}`});
    }
    if(content.length===1) return json({error:'Nenhuma imagem válida recebida'},400);
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_VISION_MODEL')||'gpt-5.6-luna',input:[{role:'user',content}],max_output_tokens:1200})});
    const raw=await response.json(); if(!response.ok) throw new Error(raw?.error?.message||'Erro ao analisar documentos');
    const out=raw.output_text||raw.output?.flatMap((x:any)=>x.content||[]).find((c:any)=>c.type==='output_text')?.text||'{}';
    const cleaned=String(out).replace(/^```json\s*/i,'').replace(/```$/,'').trim();
    let data:any={}; try{data=JSON.parse(cleaned)}catch{throw new Error('A IA não retornou dados estruturados válidos')}
    const docs=Array.isArray(data.documentos_identificados)?data.documentos_identificados:[]; delete data.documentos_identificados;
    return json({ok:true,data,documentos_identificados:docs});
  }catch(e){return json({error:String(e?.message||e)},500)}
});