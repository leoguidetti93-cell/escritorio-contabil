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


const formSchemas={
  admissao:{
    title:'Admissão',
    html:`
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">DADOS DA EMPRESA</span><h3>Quem está solicitando</h3></div></div>
        <div class="field-grid">
          <label><span>Empresa</span><input required name="empresa" placeholder="Razão social ou nome" /></label>
          <label><span>CNPJ</span><input required name="cnpj" placeholder="00.000.000/0000-00" /></label>
          <label><span>Responsável</span><input required name="responsavel" placeholder="Seu nome" /></label>
          <label><span>E-mail</span><input required type="email" name="email" placeholder="voce@empresa.com.br" /></label>
          <label><span>Telefone / WhatsApp</span><input required name="telefone" placeholder="(00) 00000-0000" /></label>
        </div>
      </div>
      <div class="form-block ai-doc-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">ADMISSÃO INTELIGENTE</span><h3>Fotografe os documentos</h3><p>Envie várias fotos. A IA tentará identificar os documentos e preencher os campos abaixo. Revise tudo antes de enviar.</p></div><span class="ai-badge">IA</span></div>
        <label class="file-field smart-file"><span>Documentos do funcionário</span><input id="admissionDocs" type="file" accept="image/*" capture="environment" multiple /><small>Até 8 imagens. Fotos nítidas de RG/CNH, CPF, comprovante de endereço, CTPS digital, certidões e documentos de dependentes.</small></label>
        <div id="docList" class="doc-list"></div>
        <button class="btn secondary ai-read-btn" id="readDocsBtn" type="button">✦ Ler documentos com IA</button>
        <div id="aiDocStatus" class="ai-doc-status" aria-live="polite"></div>
      </div>
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">DADOS EXTRAÍDOS / CADASTRAIS</span><h3>Dados do funcionário</h3></div></div>
        <div class="field-grid">
          <label><span>Nome completo</span><input required name="funcionario_nome" data-ai="nome_completo" /></label>
          <label><span>CPF</span><input required name="funcionario_cpf" data-ai="cpf" /></label>
          <label><span>Data de nascimento</span><input type="date" name="data_nascimento" data-ai="data_nascimento" /></label>
          <label><span>RG / Documento</span><input name="rg" data-ai="rg" /></label>
          <label><span>PIS / NIS</span><input name="pis_nis" data-ai="pis_nis" /></label>
          <label><span>Nome da mãe</span><input name="nome_mae" data-ai="nome_mae" /></label>
          <label><span>Estado civil</span><input name="estado_civil" data-ai="estado_civil" /></label>
          <label><span>CEP</span><input name="cep" data-ai="cep" /></label>
          <label class="span-2"><span>Endereço completo</span><input name="endereco" data-ai="endereco" /></label>
        </div>
      </div>
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">CONTRATAÇÃO</span><h3>Condições da admissão</h3></div></div>
        <div class="field-grid">
          <label><span>Data de admissão</span><input required type="date" name="data_admissao" /></label>
          <label><span>Cargo / função</span><input required name="cargo" /></label>
          <label><span>Salário</span><input required name="salario" placeholder="R$ 0,00" /></label>
          <label><span>Tipo de contrato</span><select name="tipo_contrato"><option>Prazo indeterminado</option><option>Experiência</option><option>Prazo determinado</option><option>Aprendiz</option><option>Estágio</option></select></label>
          <label><span>Experiência (dias)</span><input type="number" min="0" max="180" name="experiencia_dias" placeholder="Ex.: 45" /></label>
          <label><span>Horário / jornada</span><input name="jornada" placeholder="Ex.: Seg. a sex. 08:00–18:00" /></label>
          <label class="span-2"><span>Benefícios / observações</span><textarea name="observacoes" rows="3" placeholder="VT, VR, plano de saúde, informações adicionais..."></textarea></label>
        </div>
      </div>`
  },
  ferias:{
    title:'Férias',
    html:`
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">FÉRIAS</span><h3>Programação de férias</h3></div></div>
        <div class="field-grid">
          <label><span>Empresa</span><input required name="empresa" /></label>
          <label><span>CNPJ</span><input required name="cnpj" /></label>
          <label><span>Telefone</span><input required name="telefone" /></label>
          <label><span>E-mail</span><input required type="email" name="email" /></label>
          <label class="span-2"><span>Nome do funcionário</span><input required name="funcionario_nome" /></label>
          <label><span>Dias de férias</span><input required id="feriasDias" type="number" min="1" max="30" name="dias_ferias" value="30" /></label>
          <label><span>Dias de abono</span><input required type="number" min="0" max="10" name="dias_abono" value="0" /></label>
          <label><span>Início do gozo</span><input required id="feriasInicio" type="date" name="inicio_gozo" /></label>
          <label><span>Término do gozo</span><input readonly id="feriasTermino" type="date" name="termino_gozo" /></label>
          <label><span>Data de pagamento</span><input type="date" name="data_pagamento" /></label>
          <label><span>Abono posterior ao gozo?</span><select name="abono_posterior"><option value="Não">Não</option><option value="Sim">Sim</option></select></label>
          <label class="span-2"><span>Observações</span><textarea name="observacoes" rows="3"></textarea></label>
        </div>
      </div>`
  },
  rescisao:{
    title:'Rescisão',
    html:`
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">RESCISÃO</span><h3>Dados do desligamento</h3></div></div>
        <div class="field-grid">
          <label><span>Empresa</span><input required name="empresa" /></label>
          <label><span>CNPJ</span><input required name="cnpj" /></label>
          <label><span>Telefone</span><input required name="telefone" /></label>
          <label><span>E-mail</span><input required type="email" name="email" /></label>
          <label><span>Nome do funcionário</span><input required name="funcionario_nome" /></label>
          <label><span>CPF do funcionário</span><input name="funcionario_cpf" /></label>
          <label class="span-2"><span>Motivo da baixa</span><select required name="motivo_baixa"><option value="">Selecione</option><option>Pedido de demissão</option><option>Dispensa sem justa causa</option><option>Dispensa com justa causa</option><option>Término de contrato de experiência</option><option>Término de contrato por prazo determinado</option><option>Acordo entre as partes (art. 484-A)</option><option>Falecimento</option><option>Outro</option></select></label>
          <label><span>Último dia trabalhado</span><input required type="date" name="ultimo_dia_trabalhado" /></label>
          <label><span>Aviso prévio</span><select required name="aviso_previo"><option value="">Selecione</option><option>Trabalhado</option><option>Indenizado pelo empregador</option><option>Dispensado do cumprimento</option><option>Não aplicável</option></select></label>
          <label><span>Data do aviso</span><input type="date" name="data_aviso" /></label>
          <label><span>Possui férias vencidas?</span><select name="ferias_vencidas"><option>Não</option><option>Sim</option><option>Não sei</option></select></label>
          <label><span>Exame demissional</span><select name="exame_demissional"><option>A agendar</option><option>Já agendado</option><option>Já realizado</option><option>Não se aplica / verificar</option></select></label>
          <label class="span-2"><span>Observações</span><textarea name="observacoes" rows="3" placeholder="Descontos, adiantamentos, comissões, empréstimos ou outras informações relevantes."></textarea></label>
        </div>
      </div>`
  },
  outros:{
    title:'Outra solicitação',
    html:`
      <div class="form-block"><div class="form-block-head"><div><span class="mini-eyebrow">OUTRA SOLICITAÇÃO</span><h3>Conte para a equipe o que você precisa</h3></div></div>
      <div class="field-grid">
        <label><span>Empresa</span><input required name="empresa" /></label>
        <label><span>CNPJ</span><input name="cnpj" /></label>
        <label><span>Responsável</span><input required name="responsavel" /></label>
        <label><span>E-mail</span><input required type="email" name="email" /></label>
        <label><span>Telefone</span><input name="telefone" /></label>
        <label class="span-2"><span>Detalhes</span><textarea required name="detalhes" rows="6" placeholder="Descreva a solicitação com o máximo de informações possível."></textarea></label>
      </div></div>`
  }
};

let admissionFiles=[];
const fieldsRoot=$('#dynamicFields');
function renderForm(type){
  $('#requestType').value=type;
  fieldsRoot.innerHTML=formSchemas[type].html;
  admissionFiles=[];
  bindDynamicForm(type);
}
function bindDynamicForm(type){
  if(type==='ferias'){
    const start=$('#feriasInicio'),days=$('#feriasDias'),end=$('#feriasTermino');
    const calc=()=>{if(!start.value||!days.value){end.value='';return}const d=new Date(start.value+'T12:00:00');d.setDate(d.getDate()+Math.max(1,Number(days.value))-1);end.value=d.toISOString().slice(0,10)};
    start.addEventListener('change',calc);days.addEventListener('input',calc);calc();
  }
  if(type==='admissao'){
    const input=$('#admissionDocs'),list=$('#docList'),btn=$('#readDocsBtn'),status=$('#aiDocStatus');
    input.addEventListener('change',()=>{
      admissionFiles=[...input.files].slice(0,8);
      list.innerHTML=admissionFiles.map((f,i)=>`<span class="doc-pill">${i+1}. ${escapeHtml(f.name)} <small>${formatBytes(f.size)}</small></span>`).join('');
      if(input.files.length>8) status.textContent='Serão analisados somente os 8 primeiros arquivos.';
    });
    btn.addEventListener('click',async()=>{
      if(!admissionFiles.length){status.textContent='Selecione ao menos uma foto antes de usar a IA.';return}
      btn.disabled=true;btn.textContent='Analisando documentos…';status.textContent='Preparando imagens e extraindo dados. Revise o resultado antes de enviar.';
      try{
        const files=await Promise.all(admissionFiles.map(prepareAttachment));
        const r=await invokeFunction('extrair-documentos-admissao',{files:files.map(x=>({name:x.name,type:x.type,data:x.data}))});
        const extracted=r.data||{};
        $$('[data-ai]').forEach(el=>{const v=extracted[el.dataset.ai];if(v&&!el.value)el.value=v});
        status.textContent=`IA analisou ${admissionFiles.length} documento(s). ${r.documentos_identificados?.length? 'Identificados: '+r.documentos_identificados.join(', ')+'. ':''}Confira todos os campos antes de enviar.`;
      }catch(err){status.textContent='Não foi possível ler os documentos agora: '+(err.message||err)}finally{btn.disabled=false;btn.textContent='✦ Ler documentos com IA'}
    });
  }
}
$$('.form-tab').forEach(btn=>btn.onclick=()=>{$$('.form-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderForm(btn.dataset.form)});
renderForm('admissao');

function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function formatBytes(n){return n<1024*1024?Math.round(n/1024)+' KB':(n/1024/1024).toFixed(1)+' MB'}
function fileToData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(file)})}
function compressImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return fileToData(file).then(data=>resolve({name:file.name,type:file.type||'application/octet-stream',data})).catch(reject);const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(async blob=>{try{const data=await fileToData(blob);resolve({name:file.name.replace(/\.[^.]+$/,'.jpg'),type:'image/jpeg',data})}catch(e){reject(e)}},'image/jpeg',.78)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível preparar '+file.name))};img.src=url})}
async function prepareAttachment(file){if(file.size>12*1024*1024)throw new Error(`${file.name} excede 12 MB`);return compressImage(file)}

async function invokeFunction(name,body){
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY) throw new Error('Integração ainda não configurada');
  const r=await fetch(`${cfg.SUPABASE_URL}/functions/v1/${name}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.SUPABASE_ANON_KEY},body:JSON.stringify(body)});
  const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch{data={error:raw}}if(!r.ok)throw new Error(data.error||`Falha na solicitação (HTTP ${r.status})`);return data;
}

$('#requestForm').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget,st=$('#formStatus'),submit=form.querySelector('button[type="submit"]');
  const fd=new FormData(form),data={};for(const [k,v] of fd.entries())if(!(v instanceof File))data[k]=v;
  data.tipo=$('#requestType').value;
  if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent='Enviando...'}st.textContent='Enviando solicitação...';
  try{
    if(data.tipo==='admissao'&&admissionFiles.length){data.anexos=await Promise.all(admissionFiles.map(prepareAttachment));}
    const r=await invokeFunction(cfg.REQUEST_FUNCTION||'enviar-solicitacao',data);
    const emailNote=r.email===false?' • Telegram enviado; e-mail não confirmado pelo serviço.':'';
    st.textContent=`Solicitação enviada com sucesso${r.protocolo?' • Protocolo '+r.protocolo:''}${emailNote}`;
    const type=data.tipo;form.reset();renderForm(type);
  }catch(err){console.error(err);st.textContent=`Não foi possível enviar agora. ${err.message||''}`}
  finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||'Enviar solicitação'}}
});

const panel=$('#aiPanel'),messages=$('#aiMessages'),text=$('#aiText'); $$('[data-open-ai]').forEach(b=>b.onclick=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');setTimeout(()=>text.focus(),100)}); $('#closeAi').onclick=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};
function addMsg(t,c){const d=document.createElement('div');d.className='msg '+c;d.textContent=t;messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}
async function askAI(q){addMsg(q,'user');const wait=addMsg('Pensando…','bot');try{const r=await invokeFunction(cfg.AI_FUNCTION||'contador-ia',{message:q});wait.textContent=r.answer||'Não consegui responder agora.'}catch(err){wait.textContent=cfg.SUPABASE_URL?'Não consegui acessar o Contador IA agora.':'O Contador IA já está montado visualmente. Falta apenas conectarmos o Supabase e a API de IA.'}}
$('#aiForm').addEventListener('submit',e=>{e.preventDefault();const q=text.value.trim();if(!q)return;text.value='';askAI(q)}); $$('.ai-chips button').forEach(b=>b.onclick=()=>askAI(`Tenho uma dúvida sobre ${b.textContent}.`));
