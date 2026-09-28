import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const safe=(v:unknown)=>String(v??'').replace(/[<>]/g,'').trim();
const labels:Record<string,string>={tipo:'Tipo',empresa:'Empresa',cnpj:'CNPJ',responsavel:'Responsável',email:'E-mail',telefone:'Telefone',funcionario_nome:'Funcionário',funcionario_cpf:'CPF do funcionário',data_nascimento:'Data de nascimento',rg:'RG / Documento',pis_nis:'PIS / NIS',nome_mae:'Nome da mãe',estado_civil:'Estado civil',cep:'CEP',endereco:'Endereço',data_admissao:'Data de admissão',cargo:'Cargo / função',salario:'Salário',tipo_contrato:'Tipo de contrato',experiencia_dias:'Experiência (dias)',jornada:'Horário / jornada',dias_ferias:'Dias de férias',dias_abono:'Dias de abono',inicio_gozo:'Início do gozo',termino_gozo:'Término do gozo',data_pagamento:'Data de pagamento',abono_posterior:'Abono posterior ao gozo?',motivo_baixa:'Motivo da baixa',ultimo_dia_trabalhado:'Último dia trabalhado',aviso_previo:'Aviso prévio',data_aviso:'Data do aviso',ferias_vencidas:'Férias vencidas?',exame_demissional:'Exame demissional',detalhes:'Detalhes',observacoes:'Observações'};
const sectionTitle=(t:string)=>({admissao:'ADMISSÃO',ferias:'FÉRIAS',rescisao:'RESCISÃO',outros:'OUTRA SOLICITAÇÃO'}[t]||t.toUpperCase());
serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return new Response(JSON.stringify({error:'Método não permitido'}),{status:405,headers:{...cors,'Content-Type':'application/json'}});
 try{
  const b=await req.json();const protocolo=`GUI-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  const anexos=Array.isArray(b.anexos)?b.anexos:[];
  const lines=[`📥 NOVA SOLICITAÇÃO • ${protocolo}`,`Processo: ${sectionTitle(safe(b.tipo))}`];
  for(const [k,v] of Object.entries(b)){if(k==='anexos'||k==='tipo'||v===''||v==null)continue;lines.push(`${labels[k]||k}: ${safe(v)}`)}
  if(anexos.length)lines.push(`Documentos anexados ao e-mail: ${anexos.length}`);
  const text=lines.join('\n');
  const bot=Deno.env.get('TELEGRAM_BOT_TOKEN'),chat=Deno.env.get('TELEGRAM_CHAT_ID');if(!bot||!chat)throw new Error('Telegram não configurado no Supabase');
  const tg=await fetch(`https://api.telegram.org/bot${bot}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text})});const tgData=await tg.json().catch(()=>({}));if(!tg.ok||tgData?.ok===false)throw new Error(`Falha no Telegram: ${tgData?.description||tg.status}`);
  const resend=Deno.env.get('RESEND_API_KEY'),to=Deno.env.get('REQUEST_EMAIL_TO'),from=Deno.env.get('REQUEST_EMAIL_FROM');let emailEnviado=false,emailErro='';
  if(resend&&to&&from){
    const attachments=anexos.slice(0,8).map((a:any)=>({filename:safe(a.name)||'documento.jpg',content:String(a.data||''),content_type:safe(a.type)||'application/octet-stream'}));
    const er=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${resend}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`Guidetti • ${sectionTitle(safe(b.tipo))} • ${protocolo}`,text,attachments})});
    const ed=await er.json().catch(()=>({}));emailEnviado=er.ok;if(!er.ok)emailErro=ed?.message||`HTTP ${er.status}`;
  }
  return new Response(JSON.stringify({ok:true,protocolo,telegram:true,email:emailEnviado,emailErro}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:String(e?.message||e)}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}
});