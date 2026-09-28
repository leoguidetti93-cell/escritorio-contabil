# GUIDETTI CONTÁBIL — V1.4

Atualização consolidada após os testes da V1.3.

## Admissão inteligente
- Removido PIS/NIS.
- Adicionados nome do pai, nacionalidade, naturalidade e sexo conforme documento.
- Endereço dividido em CEP, logradouro, número, complemento, bairro, cidade e UF.
- CEP consulta ViaCEP e preenche automaticamente logradouro, bairro, cidade e UF.
- IA de documentos atualizada para extrair os novos campos.
- Dois fluxos claros no celular: **Fotografar documento** e **Anexar documentos**.
- Fotos são cumulativas: é possível fotografar frente, verso e outros documentos, uma a uma, até 8 imagens.
- Galeria de prévias com botão para remover cada imagem antes da leitura/envio.
- Campos de contratação revisados com local de trabalho, horários, intervalo, vale-transporte e dependentes.

## Férias
- Formulário revisado e segmentado.
- Incluídos responsável, período aquisitivo e opção de adiantamento da 1ª parcela do 13º.
- Término do gozo continua calculado automaticamente a partir da data inicial + dias de férias.

## Rescisão
- Formulário revisado e segmentado.
- Incluídos responsável, data da comunicação, motivos adicionais para contrato de experiência, estabilidade/afastamento, valores variáveis e descontos/adiantamentos pendentes.

## Insights
- Bloco em destaque e cards ficaram bem mais compactos.
- Menos altura, padding e texto para reduzir rolagem.

## Calendário oficial
- Novo Edge Function `conteudo-oficial`.
- Busca a Agenda Tributária da Receita Federal no gov.br para o mês atual/próximo.
- Cada item leva para a fonte oficial.
- Usa cache no Supabase para não consultar a fonte a cada acesso.

## Notícias automáticas
- `conteudo-oficial` busca notícias oficiais da Receita Federal e eSocial.
- Quando `OPENAI_API_KEY` está disponível, a função tenta gerar resumos curtos e factuais.
- Links sempre apontam para a matéria oficial.
- Cache de 6h reduz chamadas de IA e custo.

## Antes de publicar
1. Execute `supabase/SQL_PORTAL_CACHE.sql` no SQL Editor do Supabase.
2. Atualize/deploy `enviar-solicitacao`.
3. Atualize/deploy `extrair-documentos-admissao`.
4. Crie/deploy `conteudo-oficial`.
5. Nas três funções públicas, mantenha **Verify JWT with legacy secret = OFF**.
6. O `contador-ia` que já está funcionando não precisa ser alterado nesta versão.

## Observação
O conteúdo externo é tratado como informativo. O portal mantém link para a fonte oficial para conferência. A extração de documentos por IA exige revisão humana antes do envio.
