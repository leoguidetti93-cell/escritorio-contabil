const cfg=window.GUIDETTI_CONFIG||{};
const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const menu=$('#mobileMenu'); $('#menuButton').onclick=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false')}; $('#menuClose').onclick=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true')}; $$('#mobileMenu a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}); $$('.reveal').forEach(el=>io.observe(el));

const insights=[
 {meta:'GESTÃO • 4 MIN',title:'Pró-labore, distribuição e retirada: por que separar?',text:'Uma explicação simples para evitar mistura entre finanças pessoais e empresariais.'},
 {meta:'TRABALHISTA • 3 MIN',title:'Admissão: o que o escritório precisa receber antes do início?',text:'Checklist objetivo para reduzir retrabalho e atrasos no registro.'},
 {meta:'FISCAL • 5 MIN',title:'Nota fiscal emitida errada: quais são os primeiros passos?',text:'O que conferir antes de cancelar, substituir ou pedir análise do escritório.'}
];
const news=[
 {date:'DEMONSTRAÇÃO',title:'Espaço para notícia tributária relevante',text:'Cards preparados para atualizações do escritório ou integração futura com uma fonte de notícias.'},
 {date:'DEMONSTRAÇÃO',title:'Mudanças trabalhistas em destaque',text:'Use este espaço apenas para mudanças que realmente merecem atenção dos clientes.'},
 {date:'DEMONSTRAÇÃO',title:'Atualização empresarial e societária',text:'Resumo curto, linguagem simples e link para conteúdo completo quando necessário.'}
];
const calendar=[
 {day:'07',month:'OUT',title:'Exemplo de obrigação mensal',text:'Substitua pelos vencimentos efetivamente relevantes aos seus clientes.',type:'TRIBUTO'},
 {day:'15',month:'OUT',title:'Exemplo de obrigação trabalhista',text:'Calendário editável em data/calendar.json.',type:'TRABALHISTA'},
 {day:'20',month:'OUT',title:'Exemplo de tributo federal',text:'Pode ser mantido manualmente sem banco de dados.',type:'FEDERAL'},
 {day:'31',month:'OUT',title:'Fechamento do mês',text:'Espaço para lembretes e obrigações específicas.',type:'ALERTA'}
];
$('#insightCards').innerHTML=insights.map(x=>`<article class="article-card reveal"><span class="meta">${x.meta}</span><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');
$('#newsGrid').innerHTML=news.map(x=>`<article class="news-card reveal"><small>${x.date}</small><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');
$('#calendarList').innerHTML=calendar.map(x=>`<div class="calendar-item reveal"><div class="calendar-date"><b>${x.day}</b><span>${x.month}</span></div><div><h4>${x.title}</h4><p>${x.text}</p></div><span class="calendar-type">${x.type}</span></div>`).join('');
$$('.reveal').forEach(el=>io.observe(el));

const formCopy={admissao:['Dados da admissão','Informe nome do funcionário, cargo, salário, data de admissão e demais informações.'],rescisao:['Dados da rescisão','Informe funcionário, tipo de desligamento, data prevista, aviso prévio e observações.'],ferias:['Dados das férias','Informe funcionário, período desejado, abono e demais observações.'],outros:['Detalhes da solicitação','Descreva o que você precisa e inclua todas as informações relevantes.']};
$$('.form-tab').forEach(btn=>btn.onclick=()=>{$$('.form-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('#requestType').value=btn.dataset.form;$('#detailLabel').textContent=formCopy[btn.dataset.form][0];$('textarea[name="detalhes"]').placeholder=formCopy[btn.dataset.form][1]});

async function invokeFunction(name,body){if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY) throw new Error('Integração ainda não configurada'); const r=await fetch(`${cfg.SUPABASE_URL}/functions/v1/${name}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.SUPABASE_ANON_KEY,'Authorization':`Bearer ${cfg.SUPABASE_ANON_KEY}`},body:JSON.stringify(body)}); const data=await r.json().catch(()=>({})); if(!r.ok)throw new Error(data.error||'Falha na solicitação'); return data;}

$('#requestForm').addEventListener('submit',async e=>{e.preventDefault();const st=$('#formStatus');const data=Object.fromEntries(new FormData(e.currentTarget).entries());st.textContent='Enviando...';try{const r=await invokeFunction(cfg.REQUEST_FUNCTION||'enviar-solicitacao',data);st.textContent=`Solicitação enviada${r.protocolo?' • '+r.protocolo:''}`;e.currentTarget.reset()}catch(err){st.textContent=cfg.SUPABASE_URL?'Não foi possível enviar agora.':'Integração ainda não configurada — estrutura pronta.'}});

const panel=$('#aiPanel'),messages=$('#aiMessages'),text=$('#aiText'); $$('[data-open-ai]').forEach(b=>b.onclick=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');setTimeout(()=>text.focus(),100)}); $('#closeAi').onclick=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};
function addMsg(t,c){const d=document.createElement('div');d.className='msg '+c;d.textContent=t;messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}
async function askAI(q){addMsg(q,'user');const wait=addMsg('Pensando…','bot');try{const r=await invokeFunction(cfg.AI_FUNCTION||'contador-ia',{message:q});wait.textContent=r.answer||'Não consegui responder agora.'}catch(err){wait.textContent=cfg.SUPABASE_URL?'Não consegui acessar o Contador IA agora.':'O Contador IA já está montado visualmente. Falta apenas conectarmos o Supabase e a API de IA.'}}
$('#aiForm').addEventListener('submit',e=>{e.preventDefault();const q=text.value.trim();if(!q)return;text.value='';askAI(q)}); $$('.ai-chips button').forEach(b=>b.onclick=()=>askAI(`Tenho uma dúvida sobre ${b.textContent}.`));
