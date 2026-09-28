const cfg=window.GUIDETTI_CONFIG||{};
const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const menu=$('#mobileMenu'); $('#menuButton').onclick=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false')}; $('#menuClose').onclick=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true')}; $$('#mobileMenu a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}); $$('.reveal').forEach(el=>io.observe(el));

const insights=[
 {meta:'GESTÃO • 4 MIN',title:'Pró-labore, distribuição e retirada: por que separar?',text:'Evite misturar finanças pessoais e empresariais.'},
 {meta:'TRABALHISTA • 3 MIN',title:'Admissão: o que enviar antes do início?',text:'Checklist curto para reduzir retrabalho no registro.'},
 {meta:'FISCAL • 5 MIN',title:'Nota fiscal emitida errada: primeiros passos',text:'O que conferir antes de cancelar ou substituir.'}
];
$('#insightCards').innerHTML=insights.map(x=>`<article class="article-card reveal"><span class="meta">${x.meta}</span><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');

const fallbackNews=[
 {date:'FONTE OFICIAL',title:'Notícias contábeis e trabalhistas',text:'As atualizações oficiais aparecerão aqui automaticamente.',url:'https://www.gov.br/receitafederal/pt-br/assuntos/noticias'},
 {date:'FONTE OFICIAL',title:'Atualizações do eSocial',text:'Comunicados e mudanças relevantes do ambiente trabalhista.',url:'https://www.gov.br/esocial/pt-br/noticias'},
 {date:'FONTE OFICIAL',title:'Agenda tributária da Receita Federal',text:'Prazos e vencimentos oficiais para consulta.',url:'https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria'}
];
const fallbackCalendar=[
 {day:'—',month:'OFICIAL',title:'Agenda Tributária da Receita Federal',text:'Carregando próximos vencimentos oficiais.',type:'RFB',url:'https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria'}
];
function renderNews(items){$('#newsGrid').innerHTML=(items?.length?items:fallbackNews).slice(0,6).map(x=>`<article class="news-card reveal"><small>${escapeHtml(x.date||'FONTE OFICIAL')}</small><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.text||'')}</p>${x.url?`<a class="source-link" href="${escapeHtml(x.url)}" target="_blank" rel="noopener">Ver fonte oficial →</a>`:''}</article>`).join('');$$('.reveal').forEach(el=>io.observe(el))}
function renderCalendar(items){$('#calendarList').innerHTML=(items?.length?items:fallbackCalendar).slice(0,8).map(x=>`<a class="calendar-item reveal" ${x.url?`href="${escapeHtml(x.url)}" target="_blank" rel="noopener"`:''}><div class="calendar-date"><b>${escapeHtml(x.day||'—')}</b><span>${escapeHtml(x.month||'')}</span></div><div><h4>${escapeHtml(x.title)}</h4><p>${escapeHtml(x.text||'')}</p></div><span class="calendar-type">${escapeHtml(x.type||'OFICIAL')}</span></a>`).join('');$$('.reveal').forEach(el=>io.observe(el))}
renderNews(fallbackNews);renderCalendar(fallbackCalendar);
async function loadOfficialContent(){
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
  try{
    const [n,c]=await Promise.allSettled([
      invokeFunction(cfg.CONTENT_FUNCTION||'conteudo-oficial',{action:'news'}),
      invokeFunction(cfg.CONTENT_FUNCTION||'conteudo-oficial',{action:'calendar'})
    ]);
    if(n.status==='fulfilled'&&Array.isArray(n.value.items))renderNews(n.value.items);
    if(c.status==='fulfilled'&&Array.isArray(c.value.items))renderCalendar(c.value.items);
  }catch(e){console.warn('Conteúdo oficial indisponível',e)}
}
loadOfficialContent();

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
        <div class="form-block-head"><div><span class="mini-eyebrow">ADMISSÃO INTELIGENTE</span><h3>Fotografe ou anexe os documentos</h3><p>Você pode tirar várias fotos, uma após a outra, ou escolher imagens já salvas. A IA reúne tudo e tenta preencher os campos abaixo.</p></div><span class="ai-badge">IA</span></div>
        <input id="cameraInput" class="hidden-file" type="file" accept="image/*" capture="environment" />
        <input id="galleryInput" class="hidden-file" type="file" accept="image/*" multiple />
        <div class="doc-actions"><button class="btn secondary" id="cameraBtn" type="button">📷 Fotografar documento</button><button class="btn secondary" id="galleryBtn" type="button">📎 Anexar documentos</button></div>
        <small class="doc-help">Até 8 imagens. Você pode fotografar frente e verso e tocar em “Fotografar documento” novamente para adicionar mais.</small>
        <div id="docList" class="doc-grid"></div>
        <button class="btn primary ai-read-btn" id="readDocsBtn" type="button">✦ Ler documentos com IA</button>
        <div id="aiDocStatus" class="ai-doc-status" aria-live="polite"></div>
      </div>
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">DADOS DO FUNCIONÁRIO</span><h3>Identificação</h3></div></div>
        <div class="field-grid">
          <label><span>Nome completo</span><input required name="funcionario_nome" data-ai="nome_completo" /></label>
          <label><span>CPF</span><input required name="funcionario_cpf" data-ai="cpf" /></label>
          <label><span>Data de nascimento</span><input type="date" name="data_nascimento" data-ai="data_nascimento" /></label>
          <label><span>RG / Documento</span><input name="rg" data-ai="rg" /></label>
          <label><span>Nome da mãe</span><input name="nome_mae" data-ai="nome_mae" /></label>
          <label><span>Nome do pai</span><input name="nome_pai" data-ai="nome_pai" /></label>
          <label><span>Nacionalidade</span><input name="nacionalidade" data-ai="nacionalidade" placeholder="Ex.: Brasileira" /></label>
          <label><span>Naturalidade</span><input name="naturalidade" data-ai="naturalidade" placeholder="Cidade/UF de nascimento" /></label>
          <label><span>Estado civil</span><select name="estado_civil" data-ai="estado_civil"><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>União estável</option><option>Divorciado(a)</option><option>Separado(a)</option><option>Viúvo(a)</option></select></label>
          <label><span>Sexo conforme documento</span><select name="sexo" data-ai="sexo"><option value="">Selecione</option><option>Feminino</option><option>Masculino</option></select></label>
        </div>
      </div>
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">ENDEREÇO</span><h3>Residência do funcionário</h3><p>Digite o CEP e o endereço será preenchido automaticamente.</p></div></div>
        <div class="field-grid">
          <label><span>CEP</span><input id="cepAdmissao" name="cep" data-ai="cep" inputmode="numeric" maxlength="9" placeholder="00000-000" /></label>
          <label><span>Logradouro</span><input id="logradouroAdmissao" name="logradouro" data-ai="logradouro" /></label>
          <label><span>Número</span><input name="numero" data-ai="numero" /></label>
          <label><span>Complemento</span><input name="complemento" data-ai="complemento" /></label>
          <label><span>Bairro</span><input id="bairroAdmissao" name="bairro" data-ai="bairro" /></label>
          <label><span>Cidade</span><input id="cidadeAdmissao" name="cidade" data-ai="cidade" /></label>
          <label><span>UF</span><input id="ufAdmissao" name="uf" data-ai="uf" maxlength="2" /></label>
        </div>
        <div id="cepStatus" class="field-status"></div>
      </div>
      <div class="form-block">
        <div class="form-block-head"><div><span class="mini-eyebrow">CONTRATAÇÃO</span><h3>Condições da admissão</h3></div></div>
        <div class="field-grid">
          <label><span>Data de admissão</span><input required type="date" name="data_admissao" /></label>
          <label><span>Cargo / função</span><input required name="cargo" /></label>
          <label><span>Salário</span><input required name="salario" placeholder="R$ 0,00" /></label>
          <label><span>Tipo de contrato</span><select name="tipo_contrato"><option>Prazo indeterminado</option><option>Experiência</option><option>Prazo determinado</option><option>Aprendiz</option><option>Estágio</option></select></label>
          <label><span>Experiência (dias)</span><input type="number" min="0" max="180" name="experiencia_dias" placeholder="Ex.: 45" /></label>
          <label><span>Local de trabalho</span><input name="local_trabalho" placeholder="Sede, filial, remoto..." /></label>
          <label><span>Entrada</span><input type="time" name="hora_entrada" /></label>
          <label><span>Saída</span><input type="time" name="hora_saida" /></label>
          <label><span>Intervalo</span><input name="intervalo" placeholder="Ex.: 12:00 às 13:00" /></label>
          <label><span>Vale-transporte</span><select name="vale_transporte"><option>Não</option><option>Sim</option><option>A confirmar</option></select></label>
          <label><span>Possui dependentes?</span><select name="possui_dependentes"><option>Não</option><option>Sim</option></select></label>
          <label class="span-2"><span>Benefícios / observações</span><textarea name="observacoes" rows="3" placeholder="VR, plano de saúde, dependentes, particularidades da jornada e outras informações."></textarea></label>
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
          <label><span>Responsável</span><input required name="responsavel" /></label>
          <label><span>Telefone</span><input required name="telefone" /></label>
          <label><span>E-mail</span><input required type="email" name="email" /></label>
          <label><span>Nome do funcionário</span><input required name="funcionario_nome" /></label>
          <label><span>Período aquisitivo - início</span><input type="date" name="periodo_aquisitivo_inicio" /></label>
          <label><span>Período aquisitivo - fim</span><input type="date" name="periodo_aquisitivo_fim" /></label>
          <label><span>Dias de férias</span><input required id="feriasDias" type="number" min="1" max="30" name="dias_ferias" value="30" /></label>
          <label><span>Dias de abono</span><input required type="number" min="0" max="10" name="dias_abono" value="0" /></label>
          <label><span>Início do gozo</span><input required id="feriasInicio" type="date" name="inicio_gozo" /></label>
          <label><span>Término do gozo</span><input readonly id="feriasTermino" type="date" name="termino_gozo" /></label>
          <label><span>Data de pagamento</span><input type="date" name="data_pagamento" /></label>
          <label><span>Abono posterior ao gozo?</span><select name="abono_posterior"><option value="Não">Não</option><option value="Sim">Sim</option></select></label>
          <label><span>Adiantamento da 1ª parcela do 13º?</span><select name="adiantamento_13"><option>Não</option><option>Sim</option><option>Não se aplica</option></select></label>
          <label class="span-2"><span>Observações</span><textarea name="observacoes" rows="3" placeholder="Informações adicionais sobre a programação."></textarea></label>
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
          <label><span>Responsável</span><input required name="responsavel" /></label>
          <label><span>Telefone</span><input required name="telefone" /></label>
          <label><span>E-mail</span><input required type="email" name="email" /></label>
          <label><span>Nome do funcionário</span><input required name="funcionario_nome" /></label>
          <label><span>CPF do funcionário</span><input name="funcionario_cpf" /></label>
          <label><span>Data da comunicação</span><input type="date" name="data_comunicacao" /></label>
          <label class="span-2"><span>Motivo da baixa</span><select required name="motivo_baixa"><option value="">Selecione</option><option>Pedido de demissão</option><option>Dispensa sem justa causa</option><option>Dispensa com justa causa</option><option>Término de contrato de experiência</option><option>Rescisão antecipada pelo empregador - experiência</option><option>Rescisão antecipada pelo empregado - experiência</option><option>Término de contrato por prazo determinado</option><option>Acordo entre as partes (art. 484-A)</option><option>Falecimento</option><option>Outro</option></select></label>
          <label><span>Último dia trabalhado</span><input required type="date" name="ultimo_dia_trabalhado" /></label>
          <label><span>Aviso prévio</span><select required name="aviso_previo"><option value="">Selecione</option><option>Trabalhado</option><option>Indenizado pelo empregador</option><option>Descontar do empregado</option><option>Dispensado do cumprimento</option><option>Não aplicável</option></select></label>
          <label><span>Data de início do aviso</span><input type="date" name="data_aviso" /></label>
          <label><span>Possui férias vencidas?</span><select name="ferias_vencidas"><option>Não</option><option>Sim</option><option>Não sei</option></select></label>
          <label><span>Exame demissional</span><select name="exame_demissional"><option>A agendar</option><option>Já agendado</option><option>Já realizado</option><option>Não se aplica / verificar</option></select></label>
          <label><span>Existe estabilidade/afastamento?</span><select name="estabilidade_afastamento"><option>Não</option><option>Sim</option><option>Não sei</option></select></label>
          <label><span>Comissão / variável pendente</span><input name="variavel_pendente" placeholder="R$ 0,00 ou descrição" /></label>
          <label><span>Adiantamentos / descontos</span><input name="descontos_pendentes" placeholder="R$ 0,00 ou descrição" /></label>
          <label class="span-2"><span>Observações</span><textarea name="observacoes" rows="3" placeholder="Horas extras, faltas, empréstimos, devolução de equipamentos ou outras informações relevantes."></textarea></label>
        </div>
      </div>`
  },
  outros:{
    title:'Outra solicitação',
    html:`<div class="form-block"><div class="form-block-head"><div><span class="mini-eyebrow">OUTRA SOLICITAÇÃO</span><h3>Conte para a equipe o que você precisa</h3></div></div><div class="field-grid">
      <label><span>Empresa</span><input required name="empresa" /></label><label><span>CNPJ</span><input name="cnpj" /></label><label><span>Responsável</span><input required name="responsavel" /></label><label><span>E-mail</span><input required type="email" name="email" /></label><label><span>Telefone</span><input name="telefone" /></label><label class="span-2"><span>Detalhes</span><textarea required name="detalhes" rows="5" placeholder="Descreva a solicitação com o máximo de informações possível."></textarea></label>
    </div></div>`
  }
};

let admissionFiles=[];
const fieldsRoot=$('#dynamicFields');
function renderForm(type){$('#requestType').value=type;fieldsRoot.innerHTML=formSchemas[type].html;admissionFiles=[];bindDynamicForm(type)}
function bindDynamicForm(type){
  if(type==='ferias'){
    const start=$('#feriasInicio'),days=$('#feriasDias'),end=$('#feriasTermino');
    const calc=()=>{if(!start.value||!days.value){end.value='';return}const d=new Date(start.value+'T12:00:00');d.setDate(d.getDate()+Math.max(1,Number(days.value))-1);end.value=d.toISOString().slice(0,10)};
    start.addEventListener('change',calc);days.addEventListener('input',calc);calc();
  }
  if(type==='admissao'){
    const camera=$('#cameraInput'),gallery=$('#galleryInput'),list=$('#docList'),btn=$('#readDocsBtn'),status=$('#aiDocStatus');
    $('#cameraBtn').onclick=()=>camera.click(); $('#galleryBtn').onclick=()=>gallery.click();
    const addFiles=(files)=>{for(const f of [...files]){if(admissionFiles.length>=8)break;const key=`${f.name}-${f.size}-${f.lastModified}`;if(!admissionFiles.some(x=>`${x.name}-${x.size}-${x.lastModified}`===key))admissionFiles.push(f)}renderDocList();if([...files].length+admissionFiles.length>8)status.textContent='Limite de 8 imagens por solicitação.'};
    camera.addEventListener('change',()=>{addFiles(camera.files);camera.value=''}); gallery.addEventListener('change',()=>{addFiles(gallery.files);gallery.value=''});
    function renderDocList(){list.innerHTML=admissionFiles.map((f,i)=>`<div class="doc-card"><img data-doc-preview="${i}" alt="Prévia do documento ${i+1}"><div><strong>Documento ${i+1}</strong><small>${escapeHtml(f.name)} • ${formatBytes(f.size)}</small></div><button type="button" class="doc-remove" data-remove-doc="${i}" aria-label="Remover">×</button></div>`).join('');
      admissionFiles.forEach((f,i)=>{const el=$(`[data-doc-preview="${i}"]`);if(el){const u=URL.createObjectURL(f);el.src=u;el.onload=()=>URL.revokeObjectURL(u)}});$$('[data-remove-doc]').forEach(b=>b.onclick=()=>{admissionFiles.splice(Number(b.dataset.removeDoc),1);renderDocList()});
    }
    btn.addEventListener('click',async()=>{
      if(!admissionFiles.length){status.textContent='Fotografe ou anexe ao menos um documento antes de usar a IA.';return}
      btn.disabled=true;btn.textContent='Analisando documentos…';status.textContent='Lendo as imagens. Revise todos os campos depois do preenchimento.';
      try{const files=await Promise.all(admissionFiles.map(prepareAttachment));const r=await invokeFunction('extrair-documentos-admissao',{files:files.map(x=>({name:x.name,type:x.type,data:x.data}))});const extracted=r.data||{};
        $$('[data-ai]').forEach(el=>{const v=extracted[el.dataset.ai];if(v&&!el.value)el.value=v});
        status.textContent=`IA analisou ${admissionFiles.length} documento(s). ${r.documentos_identificados?.length?'Identificados: '+r.documentos_identificados.join(', ')+'. ':''}Confira os dados antes de enviar.`;
        if($('#cepAdmissao')?.value)buscarCep($('#cepAdmissao').value,true);
      }catch(err){status.textContent='Não foi possível ler os documentos agora: '+(err.message||err)}finally{btn.disabled=false;btn.textContent='✦ Ler documentos com IA'}
    });
    const cep=$('#cepAdmissao');cep.addEventListener('input',()=>{cep.value=maskCep(cep.value)});cep.addEventListener('blur',()=>buscarCep(cep.value,false));
  }
}
$$('.form-tab').forEach(btn=>btn.onclick=()=>{$$('.form-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderForm(btn.dataset.form)});renderForm('admissao');

function maskCep(v){const d=String(v||'').replace(/\D/g,'').slice(0,8);return d.length>5?d.slice(0,5)+'-'+d.slice(5):d}
async function buscarCep(value,silent=false){const cep=String(value||'').replace(/\D/g,'');const st=$('#cepStatus');if(cep.length!==8){if(!silent&&st)st.textContent='Digite um CEP com 8 números.';return}if(st)st.textContent='Buscando endereço…';try{const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);const d=await r.json();if(d.erro)throw new Error('CEP não encontrado');const map={logradouro:'#logradouroAdmissao',bairro:'#bairroAdmissao',localidade:'#cidadeAdmissao',uf:'#ufAdmissao'};Object.entries(map).forEach(([k,s])=>{const el=$(s);if(el&&d[k]&&!el.value)el.value=d[k]});if(st)st.textContent='Endereço localizado. Complete número e complemento.'}catch(e){if(st)st.textContent='Não foi possível localizar esse CEP. Você pode preencher o endereço manualmente.'}}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function formatBytes(n){return n<1024*1024?Math.round(n/1024)+' KB':(n/1024/1024).toFixed(1)+' MB'}
function fileToData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(file)})}
function compressImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return fileToData(file).then(data=>resolve({name:file.name,type:file.type||'application/octet-stream',data})).catch(reject);const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(async blob=>{try{const data=await fileToData(blob);resolve({name:file.name.replace(/\.[^.]+$/,'.jpg'),type:'image/jpeg',data})}catch(e){reject(e)}},'image/jpeg',.78)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível preparar '+file.name))};img.src=url})}
async function prepareAttachment(file){if(file.size>12*1024*1024)throw new Error(`${file.name} excede 12 MB`);return compressImage(file)}

async function invokeFunction(name,body){if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)throw new Error('Integração ainda não configurada');const r=await fetch(`${cfg.SUPABASE_URL}/functions/v1/${name}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.SUPABASE_ANON_KEY},body:JSON.stringify(body)});const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch{data={error:raw}}if(!r.ok)throw new Error(data.error||`Falha na solicitação (HTTP ${r.status})`);return data}

$('#requestForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,st=$('#formStatus'),submit=form.querySelector('button[type="submit"]');const fd=new FormData(form),data={};for(const [k,v] of fd.entries())if(!(v instanceof File))data[k]=v;data.tipo=$('#requestType').value;if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent='Enviando...'}st.textContent='Enviando solicitação...';try{if(data.tipo==='admissao'&&admissionFiles.length)data.anexos=await Promise.all(admissionFiles.map(prepareAttachment));const r=await invokeFunction(cfg.REQUEST_FUNCTION||'enviar-solicitacao',data);const emailNote=r.email===false?' • Telegram enviado; e-mail não confirmado pelo serviço.':'';st.textContent=`Solicitação enviada com sucesso${r.protocolo?' • Protocolo '+r.protocolo:''}${emailNote}`;const type=data.tipo;form.reset();renderForm(type)}catch(err){console.error(err);st.textContent=`Não foi possível enviar agora. ${err.message||''}`}finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||'Enviar solicitação'}}});

const panel=$('#aiPanel'),messages=$('#aiMessages'),text=$('#aiText');$$('[data-open-ai]').forEach(b=>b.onclick=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');setTimeout(()=>text.focus(),100)});$('#closeAi').onclick=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};
function addMsg(t,c){const d=document.createElement('div');d.className='msg '+c;d.textContent=t;messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}
async function askAI(q){addMsg(q,'user');const wait=addMsg('Pensando…','bot');try{const r=await invokeFunction(cfg.AI_FUNCTION||'contador-ia',{message:q});wait.textContent=r.answer||'Não consegui responder agora.'}catch(err){wait.textContent='Não consegui acessar o Contador IA agora.'}}
$('#aiForm').addEventListener('submit',e=>{e.preventDefault();const q=text.value.trim();if(!q)return;text.value='';askAI(q)});$$('.ai-chips button').forEach(b=>b.onclick=()=>askAI(`Tenho uma dúvida sobre ${b.textContent}.`));
