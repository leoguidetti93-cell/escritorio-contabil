import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const safe=(v:any)=>String(v??'').replace(/[<>]/g,'');
serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 try{
  const b=await req.json();
  const protocolo=`GUI-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  const text=`📥 NOVA SOLICITAÇÃO • ${protocolo}\nTipo: ${safe(b.tipo)}\nEmpresa: ${safe(b.empresa)}\nCNPJ: ${safe(b.cnpj)}\nResponsável: ${safe(b.responsavel)}\nE-mail: ${safe(b.email)}\nTelefone: ${safe(b.telefone)}\nData: ${safe(b.data)}\n\nDetalhes:\n${safe(b.detalhes)}`;
  const bot=Deno.env.get('TELEGRAM_BOT_TOKEN'),chat=Deno.env.get('TELEGRAM_CHAT_ID');
  if(bot&&chat) await fetch(`https://api.telegram.org/bot${bot}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text})});
  const resend=Deno.env.get('RESEND_API_KEY'),to=Deno.env.get('REQUEST_EMAIL_TO'),from=Deno.env.get('REQUEST_EMAIL_FROM');
  if(resend&&to&&from) await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${resend}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`Guidetti • ${safe(b.tipo)} • ${protocolo}`,text})});
  return new Response(JSON.stringify({ok:true,protocolo}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:String(e.message||e)}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}
});
