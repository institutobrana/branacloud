(function(){
  const module={};

  function usersOptions(items,valueField,labelField,selectedValue,placeholder){
    const opts=[];
    if(placeholder!==undefined)opts.push(`<option value="">${esc(placeholder)}</option>`);
    (Array.isArray(items)?items:[]).forEach(item=>{
      const value=String(item?.[valueField]??"");
      const label=String(item?.[labelField]??"").trim()||value;
      const selected=String(selectedValue??"")===value?' selected':"";
      opts.push(`<option value="${esc(value)}"${selected}>${esc(label)}</option>`)
    });
    return opts.join("")
  }

  function usersPopularModalCombos(user=null){
    if(usersModalTipo)usersModalTipo.innerHTML=usersOptions(usersTiposCache,"descricao","descricao",user?.tipo_usuario||"","");
    if(usersModalPrestador)usersModalPrestador.innerHTML=usersOptions(usersPrestadoresLookup,"row_id","nome",user?.prestador_row_id||"","<< Nenhum >>");
    if(usersModalUnidade)usersModalUnidade.innerHTML=usersOptions(usersUnidadesLookup,"row_id","nome",user?.unidade_row_id||"","<< Nenhuma >>")
  }

  function usersPreencherModal(user=null){
    usersModalNome.value=String(user?.nome||"");
    if(usersModalApelido)usersModalApelido.value=String(user?.apelido||"");
    if(usersModalEmail)usersModalEmail.value=String(user?.email||"");
    if(usersModalAtivo)usersModalAtivo.checked=user?user.ativo===false:false;
    if(usersModalAdmin)usersModalAdmin.checked=!!user?.is_admin;
    if(usersModalForcarSenha)usersModalForcarSenha.checked=!!user?.forcar_troca_senha;
    if(usersModalSenhaAtual)usersModalSenhaAtual.value="";
    usersModalSenha.value="";
    usersModalConfirma.value="";
    if(usersModalShowSenha)usersModalShowSenha.checked=false;
    usersSyncSenhaAtualVisibility();
    usersToggleSenhaVisibilidade();
    usersPopularModalCombos(user)
  }

  function usersSyncSenhaAtualVisibility(){
    if(!usersModalSenhaAtualWrap)return;
    const editar=usersModalMode==="editar";
    usersModalSenhaAtualWrap.style.display=editar?"":"none";
    if(!editar&&usersModalSenhaAtual)usersModalSenhaAtual.value=""
  }

  function usersToggleSenhaVisibilidade(){
    const mostrar=!!usersModalShowSenha?.checked;
    const tipo=mostrar?"text":"password";
    [usersModalSenhaAtual,usersModalSenha,usersModalConfirma].forEach(el=>{if(el)el.type=tipo})
  }

  function usersAtualizarAcoesToolbar(){
    const u=usersAtualSelecionado();
    const canManage=usersCanManageSelected(u);
    const semSelecao=!u;
    const disabled=semSelecao||!canManage;
    [usersBtnEditar,usersBtnExcluir,usersBtnPreferencias,usersBtnPermissoes].forEach(btn=>{if(!btn)return;btn.disabled=disabled});
    if(usersBtnEditar)usersBtnEditar.title=disabled?(!u?"Selecione um usuário.":"Conta base 'Clínica' é protegida."):"";
    if(usersBtnExcluir)usersBtnExcluir.title=disabled?(!u?"Selecione um usuário.":"Conta base 'Clínica' é protegida."):"";
    if(usersBtnPreferencias)usersBtnPreferencias.title=disabled?(!u?"Selecione um usuário.":"Conta base 'Clínica' é protegida."):"";
    if(usersBtnPermissoes)usersBtnPermissoes.title=disabled?(!u?"Selecione um usuário.":"Conta base 'Clínica' é protegida."):""
  }

  module.usersOptions=usersOptions;
  module.usersPopularModalCombos=usersPopularModalCombos;
  module.usersPreencherModal=usersPreencherModal;
  module.usersSyncSenhaAtualVisibility=usersSyncSenhaAtualVisibility;
  module.usersToggleSenhaVisibilidade=usersToggleSenhaVisibilidade;
  module.usersAtualizarAcoesToolbar=usersAtualizarAcoesToolbar;
  window.BranaUsersAdminModalVisualModule=module;
})();
