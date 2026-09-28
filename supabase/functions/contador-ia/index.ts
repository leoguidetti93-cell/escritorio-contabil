import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 try{
  const {message}=await req.json();
  const key=Deno.env.get('OPENAI_API_KEY');
  if(!key) throw new Error('OPENAI_API_KEY não configurada');
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_MODEL')||'gpt-5-mini',input:[{role:'system',content:[{type:'input_text',text:`Você é o Contador IA da Guidetti Contábil. Responda em português do Brasil, de forma clara, curta e prudente sobre temas contábeis, fiscais, tributários, trabalhistas e empresariais. Não invente legislação, alíquotas ou prazos. Quando a resposta depender do regime tributário, município, convenção coletiva ou detalhes da empresa, peça essas informações ou recomende análise da equipe. Não substitua parecer profissional específico. Sempre diferencie orientação geral de conclusão aplicável ao caso concreto.`}]},{role:'user',content:[{type:'input_text',text:String(message||'')}]}],max_output_tokens:700})});
  const data=await response.json();
  if(!response.ok) throw new Error(data?.error?.message||'Erro na OpenAI');
  const answer=data.output_text || data.output?.flatMap((x:any)=>x.content||[]).find((c:any)=>c.type==='output_text')?.text || 'Não consegui responder agora.';
  return new Response(JSON.stringify({answer}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:String(e.message||e)}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}
});
