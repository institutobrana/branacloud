(function(){
  function escHtml(value){
    return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  function populateSelect(selectEl, items, getValue, getLabel, placeholder=""){
    if(!(selectEl instanceof HTMLElement))return;
    const options=[];
    if(placeholder)options.push(`<option value="">${escHtml(placeholder)}</option>`);
    (Array.isArray(items)?items:[]).forEach(item=>{
      options.push(`<option value="${escHtml(String(getValue(item)||""))}">${escHtml(String(getLabel(item)||""))}</option>`);
    });
    selectEl.innerHTML=options.join("");
  }

  function ensureShell(doc,ctx={}){
    if(doc.getElementById("editor-textos-panel"))return;
    const anchor=
      (typeof workspaceEmpty!=="undefined"&&workspaceEmpty&&typeof workspaceEmpty.insertAdjacentHTML==="function")
        ? workspaceEmpty
        : doc.getElementById("workspace-empty");
    if(!anchor||typeof anchor.insertAdjacentHTML!=="function")return;
    const imageAccept=String(ctx.editorTextosImagemAccept||".bmp,.jpg,.jpeg,.png,.gif,.webp,image/bmp,image/jpeg,image/png,image/gif,image/webp");
    anchor.insertAdjacentHTML("afterend",`
      <section id="editor-textos-panel" class="editor-textos-panel hidden">
        <div class="panel-title">Editor de textos</div>
        <div class="editor-textos-menubar">
          <button id="editor-textos-menu-arquivo" type="button">Arquivo</button>
          <button id="editor-textos-menu-editar" type="button">Editar</button>
          <button id="editor-textos-menu-formatar" type="button">Formatar</button>
          <div id="editor-textos-menupop" class="editor-textos-menupop hidden"></div>
        </div>
        <div class="editor-textos-toolbar editor-textos-toolbar-main">
          <button id="editor-textos-btn-abrir" class="materiais-btn" type="button"><img src="/desktop-assets/pasta.png" alt="">Abre</button>
          <button id="editor-textos-btn-novo" class="materiais-btn" type="button"><img src="/desktop-assets/novo.png" alt="">Novo</button>
          <button id="editor-textos-btn-salvar" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Salva</button>
          <button id="editor-textos-btn-salvar-como" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Salvar como</button>
          <button id="editor-textos-btn-imprimir" class="materiais-btn icon-btn" type="button" title="Imprimir"><img src="/desktop-assets/imprimir.png" alt=""></button>
          <div class="sep"></div>
          <button id="editor-textos-btn-negrito" class="materiais-btn icon-btn" type="button" title="Negrito"><b>B</b></button>
          <button id="editor-textos-btn-italico" class="materiais-btn icon-btn" type="button" title="Itálico"><i>I</i></button>
          <button id="editor-textos-btn-sublinhado" class="materiais-btn icon-btn" type="button" title="Sublinhado"><u>U</u></button>
          <button id="editor-textos-btn-recortar" class="materiais-btn icon-btn" type="button" title="Recortar">✂</button>
          <button id="editor-textos-btn-copiar" class="materiais-btn icon-btn" type="button" title="Copiar">⧉</button>
          <button id="editor-textos-btn-colar" class="materiais-btn icon-btn" type="button" title="Colar">📋</button>
          <div class="sep"></div>
          <button id="editor-textos-btn-esq" class="materiais-btn icon-btn" type="button" title="Alinhar à esquerda">≡</button>
          <button id="editor-textos-btn-centro" class="materiais-btn icon-btn" type="button" title="Centralizar">≣</button>
          <button id="editor-textos-btn-dir" class="materiais-btn icon-btn" type="button" title="Alinhar à direita">≢</button>
          <button id="editor-textos-btn-justificar" class="materiais-btn icon-btn" type="button" title="Justificar">☰</button>
          <button id="editor-textos-btn-lista" class="materiais-btn icon-btn" type="button" title="Lista">•</button>
          <button id="editor-textos-btn-imagem" class="materiais-btn icon-btn" type="button" title="Imagem">▧</button>
          <button id="editor-textos-btn-tabela" class="materiais-btn icon-btn" type="button" title="Insere tabela">▦</button>
          <button id="editor-textos-btn-pagina" class="materiais-btn" type="button"><img src="/desktop-assets/impressora.png" alt="">Página</button>
        </div>
        <div class="editor-textos-toolbar editor-textos-toolbar-fields">
          <label>Fonte:</label>
          <select id="editor-textos-font" class="font"></select>
          <select id="editor-textos-size" class="size"></select>
          <label>Cor:</label>
          <span id="editor-textos-color-swatch" class="color-swatch"></span>
          <span class="color-holder">
            <select id="editor-textos-color" class="color" title="Cor do texto"></select>
          </span>
          <div class="sep"></div>
          <input id="editor-textos-nome" class="nome" type="text" placeholder="Nome do modelo">
          <button id="editor-textos-btn-inserir-campo" class="materiais-btn editor-textos-merge-trigger" type="button">&lt;&lt;nome&gt;&gt; Insere campo de mesclagem</button>
          <button id="editor-textos-btn-gerar-pdf" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Gerar PDF</button>
          <button id="editor-textos-btn-fechar" class="materiais-btn hidden" type="button"><img src="/desktop-assets/cancela.png" alt="">Fecha</button>
        </div>
        <div class="editor-textos-ruler">
          <div class="editor-textos-ruler-corner"></div>
          <div id="editor-textos-ruler-scale" class="editor-textos-ruler-scale"></div>
          <div class="editor-textos-ruler-line"></div>
        </div>
        <div class="editor-textos-work">
          <div id="editor-textos-page" class="editor-textos-page" contenteditable="true"></div>
        </div>
        <input id="editor-textos-image-file" type="file" accept="${imageAccept}" class="hidden">
        <div id="editor-textos-status" class="editor-textos-status">Pronto.</div>
      </section>

      <div id="editor-textos-open-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-open-modal">
          <div class="modal-header"><div class="modal-title">Abrir modelo</div></div>
          <div class="editor-textos-open-head">
            <label for="editor-textos-open-q">Nome:</label>
            <input id="editor-textos-open-q" type="text" placeholder="Pesquisar por nome">
            <label for="editor-textos-open-tipo">Tipo:</label>
            <select id="editor-textos-open-tipo"></select>
            <button id="editor-textos-open-refresh" class="materiais-btn" type="button"><img src="/desktop-assets/restaurar.png" alt="">Atualiza</button>
          </div>
          <div class="editor-textos-open-grid">
            <table>
              <thead><tr><th>Nome</th><th>Tipo</th><th>Origem</th></tr></thead>
              <tbody id="editor-textos-open-tbody"></tbody>
            </table>
          </div>
          <div class="editor-textos-open-actions">
            <button id="editor-textos-open-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-open-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
          <div id="editor-textos-open-context" class="editor-textos-open-context hidden" role="menu" aria-label="Ações do modelo">
            <button id="editor-textos-open-menu-abrir" type="button">Abrir</button>
            <button id="editor-textos-open-menu-renomear" type="button">Renomear</button>
            <div class="sep"></div>
            <button id="editor-textos-open-menu-excluir" type="button">Excluir</button>
            <button id="editor-textos-open-menu-propriedades" type="button">Propriedades</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-open-delete-backdrop" class="cad-modal-backdrop hidden" tabindex="-1">
        <div class="editor-textos-open-delete-modal">
          <div class="modal-header"><div class="modal-title">Excluir Arquivo</div></div>
          <div class="editor-textos-open-delete-box">
            <div class="editor-textos-open-delete-main">
              <div class="editor-textos-open-delete-icon">X</div>
              <div>
                <div class="editor-textos-open-delete-message">Tem certeza de que deseja excluir este arquivo permanentemente?</div>
                <div class="editor-textos-open-delete-details">
                  <div class="row"><strong>Nome:</strong><span id="editor-textos-open-delete-nome">-</span></div>
                  <div class="row"><strong>Tipo:</strong><span id="editor-textos-open-delete-tipo">-</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="editor-textos-open-delete-actions">
            <button id="editor-textos-open-delete-sim" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Sim</button>
            <button id="editor-textos-open-delete-nao" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Não</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-pdfprompt-backdrop" class="cad-modal-backdrop hidden" tabindex="-1">
        <div class="editor-textos-pdfprompt-modal">
          <div class="modal-header"><div class="modal-title">Editor de textos</div><button id="editor-textos-pdfprompt-close" class="modal-close-x" type="button" aria-label="Fechar">X</button></div>
          <div class="editor-textos-pdfprompt-body">
            <div class="editor-textos-pdfprompt-icon">?</div>
            <div id="editor-textos-pdfprompt-message" class="editor-textos-pdfprompt-message">O arquivo foi gerado com sucesso. Deseja abrir agora ?</div>
          </div>
          <div class="editor-textos-pdfprompt-sep"></div>
          <div class="editor-textos-pdfprompt-actions">
            <button id="editor-textos-pdfprompt-sim" class="editor-textos-pdfprompt-btn" type="button">Sim</button>
            <button id="editor-textos-pdfprompt-nao" class="editor-textos-pdfprompt-btn" type="button">Não</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-new-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-new-modal">
          <div class="modal-header"><div class="modal-title">Novo texto</div></div>
          <div class="editor-textos-new-group">
            <label class="editor-textos-new-option"><input id="editor-textos-new-mode-open" type="radio" name="editor-textos-new-mode" value="abrir">Abrir um texto já existente...</label>
            <label class="editor-textos-new-option"><input id="editor-textos-new-mode-type" type="radio" name="editor-textos-new-mode" value="tipo" checked>Criar um novo texto do tipo:</label>
            <select id="editor-textos-new-type" class="editor-textos-new-list" size="5"></select>
          </div>
          <div class="editor-textos-new-actions">
            <button id="editor-textos-new-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-new-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-merge-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-merge-modal">
          <div class="modal-header"><div class="modal-title">Insere campo de mesclagem</div></div>
          <div class="editor-textos-merge-group">
            <label for="editor-textos-merge-category">Categoria dos campos:</label>
            <select id="editor-textos-merge-category" class="editor-textos-merge-category"></select>
            <div class="editor-textos-merge-grid">
              <table>
                <thead><tr><th>Campo</th><th>Descrição</th></tr></thead>
                <tbody id="editor-textos-merge-tbody"></tbody>
              </table>
            </div>
          </div>
          <div class="editor-textos-merge-actions">
            <button id="editor-textos-merge-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-merge-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-table-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-table-modal">
          <div class="modal-header"><div class="modal-title">Insere tabela</div></div>
          <div class="editor-textos-table-group">
            <div class="editor-textos-table-row">
              <label for="editor-textos-table-cols"><span>Nº de colunas</span><span class="dot"></span></label>
              <input id="editor-textos-table-cols" type="number" min="1" max="999" step="1" value="1">
            </div>
            <div class="editor-textos-table-row">
              <label for="editor-textos-table-rows"><span>Nº de linhas</span><span class="dot"></span></label>
              <input id="editor-textos-table-rows" type="number" min="1" max="999" step="1" value="1">
            </div>
            <label class="editor-textos-table-check"><input id="editor-textos-table-border" type="checkbox" checked>Borda visível</label>
          </div>
          <div class="editor-textos-table-actions">
            <button id="editor-textos-table-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-table-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-pagina-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-pagina-modal">
          <div class="modal-header"><div class="modal-title">Configura página</div></div>
          <div class="editor-textos-pagina-group">
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-tipo"><span>Tipo do papel</span><span class="dot"></span></label>
              <select id="editor-textos-pagina-tipo">
                <option value="A4">A4</option>
                <option value="Carta">Carta</option>
                <option value="Receituário">Receituário</option>
                <option value="Definido pelo usuário">Definido pelo usuário</option>
              </select>
              <span></span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-orientacao"><span>Orientação</span><span class="dot"></span></label>
              <select id="editor-textos-pagina-orientacao">
                <option value="Retrato">Retrato</option>
                <option value="Paisagem">Paisagem</option>
              </select>
              <span></span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-altura"><span>Altura</span><span class="dot"></span></label>
              <input id="editor-textos-pagina-altura" class="readonly" type="text" inputmode="decimal">
              <span class="unit">mm</span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-largura"><span>Largura</span><span class="dot"></span></label>
              <input id="editor-textos-pagina-largura" class="readonly" type="text" inputmode="decimal">
              <span class="unit">mm</span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-margem-superior"><span>Margem superior</span><span class="dot"></span></label>
              <input id="editor-textos-pagina-margem-superior" type="text" inputmode="decimal">
              <span class="unit">mm</span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-margem-esquerda"><span>Margem esquerda</span><span class="dot"></span></label>
              <input id="editor-textos-pagina-margem-esquerda" type="text" inputmode="decimal">
              <span class="unit">mm</span>
            </div>
            <div class="editor-textos-pagina-row">
              <label for="editor-textos-pagina-margem-direita"><span>Margem direita</span><span class="dot"></span></label>
              <input id="editor-textos-pagina-margem-direita" type="text" inputmode="decimal">
              <span class="unit">mm</span>
            </div>
          </div>
          <div class="editor-textos-pagina-actions">
            <button id="editor-textos-pagina-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-pagina-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-image-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-image-modal">
          <div class="modal-header"><div class="modal-title">Inserir imagem</div></div>
          <div class="editor-textos-image-group">
            <div class="editor-textos-image-row">
              <div>
                <label for="editor-textos-image-name">Arquivo:</label>
                <input id="editor-textos-image-name" type="text" readonly value="Nenhum arquivo selecionado">
              </div>
              <button id="editor-textos-image-escolher" class="materiais-btn" type="button"><img src="/desktop-assets/pasta.png" alt="">Escolher...</button>
            </div>
            <div id="editor-textos-image-preview" class="editor-textos-image-preview-wrap">
              <div class="editor-textos-image-empty">Nenhuma imagem selecionada.</div>
            </div>
            <label class="editor-textos-image-fit"><input id="editor-textos-image-fit" type="checkbox" checked>Ajustar à largura da página</label>
            <div id="editor-textos-image-hint" class="editor-textos-image-hint">Formatos: BMP, JPG, PNG, GIF e WEBP.</div>
          </div>
          <div class="editor-textos-image-actions">
            <button id="editor-textos-image-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-image-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-sign-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-sign-modal">
          <div class="modal-header"><div class="modal-title">Assinar PDF</div></div>
          <div class="editor-textos-sign-group">
            <div class="editor-textos-sign-row">
              <label style="display:flex;align-items:center;gap:6px"><input id="editor-textos-sign-use-current" type="checkbox" checked>Usar documento atual do editor</label>
            </div>
            <div class="editor-textos-sign-row">
              <label for="editor-textos-sign-pdf">Arquivo PDF:</label>
              <input id="editor-textos-sign-pdf" type="file" accept=".pdf,application/pdf">
            </div>
            <div class="editor-textos-sign-row">
              <label for="editor-textos-sign-pfx">Certificado digital A1 (PFX/P12):</label>
              <input id="editor-textos-sign-pfx" type="file" accept=".pfx,.p12,application/x-pkcs12">
            </div>
            <div class="editor-textos-sign-row">
              <label for="editor-textos-sign-password">Senha do certificado:</label>
              <input id="editor-textos-sign-password" type="password" autocomplete="off">
            </div>
            <div class="editor-textos-sign-row">
              <label for="editor-textos-sign-field">Nome do campo de assinatura:</label>
              <input id="editor-textos-sign-field" type="text" value="Signature1">
            </div>
            <div class="editor-textos-sign-help">Você pode assinar um PDF já existente ou usar o documento atual do editor para gerar e assinar o PDF no mesmo fluxo.</div>
            <div class="editor-textos-sign-row">
              <label style="display:flex;align-items:center;gap:6px"><input id="editor-textos-sign-use-windows" type="checkbox" checked>Usar certificado instalado no Windows (ponte local)</label>
            </div>
            <div class="editor-textos-sign-bridge">
              <div class="editor-textos-sign-bridge-head">
                <div class="editor-textos-sign-bridge-title">Certificados instalados no Windows</div>
                <button id="editor-textos-sign-bridge-refresh" class="materiais-btn" type="button"><img src="/desktop-assets/restaurar.png" alt="">Atualizar</button>
              </div>
              <div id="editor-textos-sign-bridge-status" class="editor-textos-sign-bridge-status">Ponte local ainda não verificada.</div>
              <div id="editor-textos-sign-bridge-list" class="editor-textos-sign-bridge-list">
                <div class="editor-textos-sign-bridge-item"><small>Nenhum certificado carregado.</small></div>
              </div>
            </div>
          </div>
          <div class="editor-textos-sign-actions">
            <button id="editor-textos-sign-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Assinar</button>
            <button id="editor-textos-sign-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-assist-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-assist-modal">
          <div class="modal-header"><div class="modal-title">Assistente de receitas</div></div>
          <div class="editor-textos-assist-grid">
            <div class="editor-textos-assist-top">
              <div>
                <label for="editor-textos-assist-cirurgiao">Cirurgião:</label>
                <select id="editor-textos-assist-cirurgiao"></select>
              </div>
              <div>
                <label for="editor-textos-assist-modelo">Modelo de receituário:</label>
                <select id="editor-textos-assist-modelo"></select>
              </div>
            </div>
            <div class="editor-textos-assist-line">
              <label for="editor-textos-assist-paciente">Paciente:</label>
              <div class="editor-textos-assist-inline">
                <input id="editor-textos-assist-paciente" type="text" readonly>
                <button id="editor-textos-assist-paciente-btn" class="materiais-btn" type="button" title="Selecionar paciente"><img src="/desktop-assets/pasta.png" alt=""></button>
              </div>
            </div>
            <div class="editor-textos-assist-presc">
              <label>Prescrição:</label>
              <div class="editor-textos-assist-radio">
                <label><input id="editor-textos-assist-radio-adulto" type="radio" name="editor-textos-assist-radio" checked>Adulto</label>
                <label><input id="editor-textos-assist-radio-crianca" type="radio" name="editor-textos-assist-radio">Criança</label>
              </div>
              <textarea id="editor-textos-assist-prescricao"></textarea>
            </div>
            <div class="editor-textos-assist-bottom">
              <div class="editor-textos-assist-line">
                <label for="editor-textos-assist-quantidade">Quantidade:</label>
                <input id="editor-textos-assist-quantidade" type="text">
              </div>
              <div class="editor-textos-assist-line">
                <label for="editor-textos-assist-uso">Uso:</label>
                <input id="editor-textos-assist-uso" type="text">
              </div>
            </div>
            <div class="editor-textos-assist-line">
              <label for="editor-textos-assist-obs">Observações:</label>
              <textarea id="editor-textos-assist-obs"></textarea>
            </div>
            <div id="editor-textos-assist-status" class="editor-textos-assist-status"></div>
          </div>
          <div class="editor-textos-assist-actions">
            <button id="editor-textos-assist-incluir" class="materiais-btn" type="button">Incluir</button>
            <button id="editor-textos-assist-finalizar" class="materiais-btn" type="button">Finalizar</button>
            <button id="editor-textos-assist-assinar" class="materiais-btn" type="button">Assinar PDF</button>
            <button id="editor-textos-assist-cancelar" class="materiais-btn" type="button">Cancelar</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-assist-medmenu-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-assist-medmenu-modal">
          <div class="modal-header"><div class="modal-title">Menu de medicamentos</div></div>
          <div class="editor-textos-assist-medmenu-grid">
            <div class="editor-textos-assist-medmenu-top">
              <div>
                <label for="editor-textos-assist-medmenu-filtro">Filtro:</label>
                <select id="editor-textos-assist-medmenu-filtro"></select>
              </div>
              <div>
                <label for="editor-textos-assist-medmenu-q">Pesquisar nome:</label>
                <input id="editor-textos-assist-medmenu-q" type="text">
              </div>
            </div>
            <div id="editor-textos-assist-medmenu-alpha" class="editor-textos-assist-medmenu-alpha"></div>
            <div class="editor-textos-assist-medmenu-table">
              <table>
                <thead><tr><th>Nome</th><th>Apresentação</th></tr></thead>
                <tbody id="editor-textos-assist-medmenu-tbody"></tbody>
              </table>
            </div>
          </div>
          <div class="editor-textos-assist-medmenu-actions">
            <button id="editor-textos-assist-medmenu-ok" class="materiais-btn" type="button">Ok</button>
            <button id="editor-textos-assist-medmenu-cancelar" class="materiais-btn" type="button">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-atestado-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-atestado-modal">
          <div class="modal-header"><div class="modal-title">Assistente de atestado</div></div>
          <div class="editor-textos-atestado-grid">
            <div class="editor-textos-atestado-top">
              <div>
                <label for="editor-textos-atestado-cirurgiao">Cirurgião:</label>
                <select id="editor-textos-atestado-cirurgiao"></select>
              </div>
              <div>
                <label for="editor-textos-atestado-modelo">Modelo de atestado:</label>
                <select id="editor-textos-atestado-modelo"></select>
              </div>
            </div>
            <div class="editor-textos-atestado-line">
              <label for="editor-textos-atestado-paciente">Paciente:</label>
              <div class="editor-textos-atestado-inline">
                <input id="editor-textos-atestado-paciente" class="editor-textos-atestado-paciente" type="text" readonly>
                <button id="editor-textos-atestado-paciente-btn" class="materiais-btn" type="button" title="Selecionar paciente"><img src="/desktop-assets/pasta.png" alt=""></button>
              </div>
            </div>
            <div class="editor-textos-atestado-periodo">
              <label>Período de afastamento:</label>
              <div class="editor-textos-atestado-periodo-grid">
                <input id="editor-textos-atestado-data-inicial" type="text" inputmode="numeric">
                <span>[ a</span>
                <input id="editor-textos-atestado-data-final" type="text" inputmode="numeric">
                <span>]</span>
                <span>das</span>
                <input id="editor-textos-atestado-hora-inicial" type="text" inputmode="numeric">
                <span>às</span>
                <input id="editor-textos-atestado-hora-final" type="text" inputmode="numeric">
              </div>
            </div>
            <div class="editor-textos-atestado-line">
              <label for="editor-textos-atestado-motivo">Motivo:</label>
              <select id="editor-textos-atestado-motivo"></select>
            </div>
            <div class="editor-textos-atestado-cid editor-textos-atestado-line">
              <label for="editor-textos-atestado-cid">CID (Código Internacional de Doenças):</label>
              <div class="editor-textos-atestado-inline">
                <input id="editor-textos-atestado-cid" type="text" readonly>
                <button id="editor-textos-atestado-cid-btn" class="materiais-btn" type="button" title="Menu de doenças"><img src="/desktop-assets/restaurar.png" alt=""></button>
              </div>
            </div>
            <div class="editor-textos-atestado-line">
              <label for="editor-textos-atestado-obs">Observações:</label>
              <textarea id="editor-textos-atestado-obs" spellcheck="false"></textarea>
            </div>
          </div>
          <div class="editor-textos-atestado-actions">
            <button id="editor-textos-atestado-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
            <button id="editor-textos-atestado-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
          </div>
        </div>
      </div>

      <div id="editor-textos-atestado-cidmenu-backdrop" class="cad-modal-backdrop hidden">
        <div class="editor-textos-atestado-cidmenu-modal">
          <div class="modal-header"><div class="modal-title">Menu de doenças</div></div>
          <div class="editor-textos-atestado-cidmenu-grid">
            <div class="editor-textos-atestado-cidmenu-top">
              <label for="editor-textos-atestado-cidmenu-q">Pesquisar nome:</label>
              <input id="editor-textos-atestado-cidmenu-q" type="text">
            </div>
            <div class="editor-textos-atestado-cidmenu-table">
              <table>
                <colgroup><col style="width:100px"><col></colgroup>
                <thead><tr><th>Código</th><th>Nome</th></tr></thead>
                <tbody id="editor-textos-atestado-cidmenu-tbody"></tbody>
              </table>
            </div>
            <div id="editor-textos-atestado-cidmenu-alpha" class="editor-textos-atestado-cidmenu-alpha"></div>
          </div>
          <div class="editor-textos-atestado-cidmenu-foot">
            <label><input id="editor-textos-atestado-cidmenu-preferidos" type="checkbox">Apenas preferidos</label>
            <div class="editor-textos-atestado-cidmenu-actions">
              <button id="editor-textos-atestado-cidmenu-ok" class="materiais-btn" type="button"><img src="/desktop-assets/gravar.png" alt="">Ok</button>
              <button id="editor-textos-atestado-cidmenu-cancelar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Cancela</button>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  function ensureStyle(doc){
    if(doc.getElementById("editor-textos-bootstrap-style"))return;
    const style=doc.createElement("style");
    style.id="editor-textos-bootstrap-style";
    style.textContent=`
    .editor-textos-panel{width:min(1340px,100%);height:780px;margin:0 auto;background:#d3d3d3;border:1px solid #b7b7b7;box-sizing:border-box;font:12px Tahoma,sans-serif;display:flex;flex-direction:column}
    .editor-textos-menubar{display:flex;gap:16px;padding:4px 8px;border-bottom:1px solid #b8c2cf;background:#ececec;position:relative}
    .editor-textos-menubar button{border:none;background:transparent;padding:0;cursor:pointer;font:12px Tahoma,sans-serif}
    .editor-textos-toolbar{display:flex;align-items:center;gap:2px;padding:3px 6px;border-bottom:1px solid #b8c2cf;background:#ececec}
    .editor-textos-toolbar-main{flex-wrap:nowrap;overflow-x:auto;white-space:nowrap}
    .editor-textos-toolbar-fields{flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;border-top:1px solid #d5dbe4}
    .editor-textos-toolbar .materiais-btn{height:22px;min-height:22px;padding:0 5px;font-size:12px}
    .editor-textos-toolbar .materiais-btn img{width:14px;height:14px}
    .editor-textos-toolbar .icon-btn{min-width:24px;padding:0 4px}
    .editor-textos-toolbar .icon-btn.active{background:#d9e8fb;border-color:#88a7c8;box-shadow:inset 0 0 0 1px #9fb9d8}
    .editor-textos-toolbar .sep{width:1px;height:22px;background:#b9c3d0;margin:0 2px}
    .editor-textos-toolbar label{padding:0 4px 0 2px;white-space:nowrap}
    .editor-textos-toolbar select,.editor-textos-toolbar input[type="text"]{height:22px;border:1px solid #a8b2c2;padding:0 6px;box-sizing:border-box;font:12px Tahoma,sans-serif;background:#fff}
    .editor-textos-toolbar .font{width:148px}
    .editor-textos-toolbar .size{width:50px}
    .editor-textos-toolbar .color{width:108px}
    .editor-textos-toolbar .color-holder{width:108px;display:inline-block}
    .editor-textos-toolbar .nome{display:none}
    .editor-textos-toolbar .merge{width:250px}
    .editor-textos-toolbar .editor-textos-merge-trigger{
      width:250px;
      justify-content:flex-start;
      text-align:left;
      padding:0 6px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .editor-textos-toolbar .color-swatch{display:inline-block;width:20px;height:18px;border:1px solid #8e9caf;margin-right:4px;vertical-align:middle}
    .editor-textos-ruler{height:36px;border-top:1px solid #9ea7b5;border-bottom:1px solid #9ea7b5;background:#b8b8b8;position:relative;overflow:hidden}
    .editor-textos-ruler-corner{position:absolute;left:0;top:0;width:24px;height:20px;border-right:1px solid #8f95a1;border-bottom:1px solid #8f95a1;background:linear-gradient(180deg,#cfd3d9,#aeb5bf)}
    .editor-textos-ruler-corner::after{content:"";position:absolute;left:4px;top:5px;width:14px;height:8px;border:1px solid #4a4a4a;background:#f4f4f4}
    .editor-textos-ruler-scale{position:absolute;left:24px;right:0;top:0;height:20px;background:#a6adb8}
    .editor-textos-ruler-scale .zone{position:absolute;top:0;bottom:0;pointer-events:none}
    .editor-textos-ruler-scale .zone.off{background:#a6adb8}
    .editor-textos-ruler-scale .zone.page{background:#d7dbe2}
    .editor-textos-ruler-scale .zone.margin{background:#c2c8d1}
    .editor-textos-ruler-scale .zone.content{background:#eef1f5}
    .editor-textos-ruler-scale .tick{position:absolute;bottom:0;width:1px;background:#4f5660;z-index:1}
    .editor-textos-ruler-scale .tick.minor{height:4px}
    .editor-textos-ruler-scale .tick.mid{height:7px}
    .editor-textos-ruler-scale .tick.major{height:11px}
    .editor-textos-ruler-scale .label{position:absolute;top:1px;transform:translate??(-50%);font:700 11px Tahoma,sans-serif;color:#20242a;user-select:none;z-index:1}
    .editor-textos-ruler-scale .label.zero{font-weight:800}
    .editor-textos-ruler-scale .drag-marker{position:absolute;transform:translate??(-50%);width:12px;height:14px;user-select:none;cursor:ew-resize;z-index:4}
    .editor-textos-ruler-scale .drag-marker::before,
    .editor-textos-ruler-scale .drag-marker::after{content:"";position:absolute}
    .editor-textos-ruler-scale .drag-marker.margin-left,
    .editor-textos-ruler-scale .drag-marker.margin-right{top:-1px}
    .editor-textos-ruler-scale .drag-marker.margin-left::before,
    .editor-textos-ruler-scale .drag-marker.margin-right::before{
      left:1px;top:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid #ececec;
      filter:drop-shadow(0 1px 0 #535a64)
    }
    .editor-textos-ruler-scale .drag-marker.margin-right::before{border-top-color:#d7e7ff}
    .editor-textos-ruler-scale .drag-marker.margin-left::after,
    .editor-textos-ruler-scale .drag-marker.margin-right::after{
      left:5px;top:7px;width:2px;height:7px;background:#4f5660
    }
    .editor-textos-ruler-scale .drag-marker.tab-stop{top:13px}
    .editor-textos-ruler-scale .drag-marker.tab-stop::before{
      left:1px;top:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:7px solid #32465f
    }
    .editor-textos-ruler-scale .drag-marker.tab-stop::after{
      left:5px;top:7px;width:2px;height:6px;background:#32465f
    }
    .editor-textos-ruler-scale .drag-marker:hover::before{filter:drop-shadow(0 1px 0 #2b3340) brightness(1.08)}
    .editor-textos-ruler-scale .drag-marker.active::before{filter:drop-shadow(0 0 0 #1f2b3a) brightness(1.2)}
    .editor-textos-ruler-scale .drag-marker.active::after{background:#1f2b3a}
    .editor-textos-ruler-scale .drag-guide{position:absolute;top:0;bottom:0;width:1px;background:#2d3f54;opacity:.42;pointer-events:none;z-index:3}
    .editor-textos-ruler-line{position:absolute;left:24px;right:0;top:22px;height:12px;border-top:2px solid #2f2f2f;background:#efefef}
    .editor-textos-work{flex:1;padding:10px 24px 10px 32px;overflow:auto;background:#b8b8b8}
    .editor-textos-page{width:860px;min-height:1060px;margin:0 auto;background:#fff;border:1px solid #888;padding:22px;outline:none;box-sizing:border-box;color:#000;line-height:1.05}
    .editor-textos-page p,
    .editor-textos-page div,
    .editor-textos-page li,
    .editor-textos-page h1,
    .editor-textos-page h2,
    .editor-textos-page h3,
    .editor-textos-page h4,
    .editor-textos-page h5,
    .editor-textos-page h6,
    .editor-textos-page blockquote,
    .editor-textos-page pre{margin:0;line-height:1.05}
    .editor-textos-page p,
    .editor-textos-page div,
    .editor-textos-page li,
    .editor-textos-page h1,
    .editor-textos-page h2,
    .editor-textos-page h3,
    .editor-textos-page h4,
    .editor-textos-page h5,
    .editor-textos-page h6,
    .editor-textos-page blockquote,
    .editor-textos-page td,
    .editor-textos-page th{overflow-wrap:break-word;word-break:normal}
    .editor-textos-tab-marker{display:inline-block;width:32px;min-width:32px;height:1em;vertical-align:baseline;pointer-events:none;user-select:none}
    .editor-textos-sem-tab-pad{display:inline-block;height:1em;vertical-align:baseline;pointer-events:none;user-select:none}
    .editor-textos-page table{max-width:100%}
    .editor-textos-page img.editor-textos-inline-image{max-width:100%;height:auto;display:inline-block;vertical-align:middle}
    .editor-textos-image-resize-overlay{
      position:fixed;
      border:1px dashed #2f67b6;
      box-sizing:border-box;
      pointer-events:none;
      z-index:2100;
      display:none;
    }
    .editor-textos-image-resize-overlay .handle{
      position:absolute;
      width:8px;
      height:8px;
      background:#fff;
      border:1px solid #2f67b6;
      box-sizing:border-box;
      pointer-events:auto;
    }
    .editor-textos-image-resize-overlay .handle.nw{left:-5px;top:-5px;cursor:nwse-resize}
    .editor-textos-image-resize-overlay .handle.n{left:calc(50% - 4px);top:-5px;cursor:ns-resize}
    .editor-textos-image-resize-overlay .handle.ne{right:-5px;top:-5px;cursor:nesw-resize}
    .editor-textos-image-resize-overlay .handle.e{right:-5px;top:calc(50% - 4px);cursor:ew-resize}
    .editor-textos-image-resize-overlay .handle.se{right:-5px;bottom:-5px;cursor:nwse-resize}
    .editor-textos-image-resize-overlay .handle.s{left:calc(50% - 4px);bottom:-5px;cursor:ns-resize}
    .editor-textos-image-resize-overlay .handle.sw{left:-5px;bottom:-5px;cursor:nesw-resize}
    .editor-textos-image-resize-overlay .handle.w{left:-5px;top:calc(50% - 4px);cursor:ew-resize}
    .editor-textos-page.table-resize-hover{cursor:col-resize}
    .editor-textos-status{height:24px;border-top:1px solid #b8c2cf;padding:4px 8px;background:#ececec;color:#42546e}
    .editor-textos-open-modal{width:min(760px,96vw);max-height:82vh;background:#fff;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-open-head{display:grid;grid-template-columns:auto minmax(180px,1fr) auto 220px auto;gap:8px;align-items:center;margin-bottom:8px}
    .editor-textos-open-head label{white-space:nowrap}
    .editor-textos-open-head input,.editor-textos-open-head select{height:24px;border:1px solid #bfc9d6;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif}
    .editor-textos-open-grid{border:1px solid #cfd8e3;height:420px;overflow:auto}
    .editor-textos-open-grid table{width:100%;border-collapse:collapse;table-layout:fixed}
    .editor-textos-open-grid th,.editor-textos-open-grid td{padding:4px 6px;border-bottom:1px solid #edf1f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .editor-textos-open-grid th{text-align:left;background:#f2f6fb}
    .editor-textos-open-grid tr.selected{background:#d9e8fb}
    .editor-textos-open-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px}
    .editor-textos-open-context{position:fixed;z-index:9600;min-width:180px;background:#fff;border:1px solid #a8b2c2;box-shadow:0 4px 12px rgba(0,0,0,.2)}
    .editor-textos-open-context.hidden{display:none}
    .editor-textos-open-context button{display:block;width:100%;border:none;background:#fff;text-align:left;padding:6px 10px;cursor:pointer;font:12px Tahoma,sans-serif}
    .editor-textos-open-context button:hover:not(:disabled){background:#d9e8fb}
    .editor-textos-open-context button:disabled{color:#93a1b5;background:#f7f9fc;cursor:default}
    .editor-textos-open-context .sep{height:1px;background:#d0d7e2;margin:3px 0}
    .editor-textos-open-delete-modal{width:min(520px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-open-delete-box{border:1px solid #c7ced8;background:#fff;padding:10px}
    .editor-textos-open-delete-main{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:start}
    .editor-textos-open-delete-icon{width:38px;height:38px;border:1px solid #d5dbe5;border-radius:4px;display:flex;align-items:center;justify-content:center;font:700 24px Tahoma,sans-serif;color:#d04a2f;background:#fff}
    .editor-textos-open-delete-title{font:700 18px Tahoma,sans-serif;margin-bottom:8px}
    .editor-textos-open-delete-message{font:12px Tahoma,sans-serif;margin-bottom:10px}
    .editor-textos-open-delete-details{font:12px Tahoma,sans-serif;line-height:1.5}
    .editor-textos-open-delete-details .row{display:grid;grid-template-columns:130px 1fr;gap:8px}
    .editor-textos-open-delete-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-new-modal{width:min(360px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-new-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-new-option{display:flex;align-items:center;gap:6px;margin-bottom:6px}
    .editor-textos-new-option:last-of-type{margin-bottom:8px}
    .editor-textos-new-list{width:100%;height:112px;border:1px solid #b9c4d3;font:12px Tahoma,sans-serif;box-sizing:border-box}
    .editor-textos-new-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-merge-modal{width:min(560px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-merge-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-merge-group label{display:block;margin-bottom:6px}
    .editor-textos-merge-category{width:100%;height:24px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif;margin-bottom:8px}
    .editor-textos-merge-grid{border:1px solid #cfd8e3;height:280px;overflow:auto;background:#fff}
    .editor-textos-merge-grid table{width:100%;border-collapse:collapse;table-layout:fixed}
    .editor-textos-merge-grid th,.editor-textos-merge-grid td{padding:4px 6px;border-bottom:1px solid #edf1f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .editor-textos-merge-grid th{text-align:left;background:#f2f6fb}
    .editor-textos-merge-grid tr.selected{background:#d9e8fb}
    .editor-textos-merge-grid tr.empty td{text-align:center;color:#5f6f84}
    .editor-textos-merge-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-table-modal{width:min(285px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-table-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-table-row{display:grid;grid-template-columns:1fr 72px;gap:8px;align-items:center;margin-bottom:8px}
    .editor-textos-table-row:last-of-type{margin-bottom:0}
    .editor-textos-table-row label{display:flex;align-items:center;gap:6px;white-space:nowrap}
    .editor-textos-table-row label .dot{flex:1;border-bottom:1px dotted #798291;transform:translateY(-1px)}
    .editor-textos-table-row input[type="number"]{width:100%;height:24px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif}
    .editor-textos-table-check{display:flex;align-items:center;gap:6px;margin-top:8px}
    .editor-textos-table-check input{width:auto;height:auto}
    .editor-textos-table-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-pagina-modal{width:min(370px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-pagina-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-pagina-row{display:grid;grid-template-columns:132px 1fr 30px;gap:6px;align-items:center;margin-bottom:8px}
    .editor-textos-pagina-row:last-child{margin-bottom:0}
    .editor-textos-pagina-row label{display:flex;align-items:center;gap:6px;white-space:nowrap}
    .editor-textos-pagina-row label .dot{flex:1;border-bottom:1px dotted #798291;transform:translateY(-1px)}
    .editor-textos-pagina-row input,.editor-textos-pagina-row select{width:100%;height:24px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif}
    .editor-textos-pagina-row input.readonly{background:#eef1f5}
    .editor-textos-pagina-row .unit{color:#4c5c73;white-space:nowrap}
    .editor-textos-pagina-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-image-modal{width:min(560px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-image-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-image-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-bottom:8px}
    .editor-textos-image-row label{display:block;margin-bottom:3px}
    .editor-textos-image-row input{width:100%;height:24px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#f3f5f8;font:12px Tahoma,sans-serif}
    .editor-textos-image-preview-wrap{border:1px solid #cfd8e3;background:#fff;min-height:180px;display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box}
    .editor-textos-image-preview-wrap img{max-width:100%;max-height:260px;display:block}
    .editor-textos-image-empty{font:12px Tahoma,sans-serif;color:#5d6c80;text-align:center}
    .editor-textos-image-fit{display:flex;align-items:center;gap:6px;margin-top:8px}
    .editor-textos-image-hint{margin-top:6px;font:12px Tahoma,sans-serif;color:#4d5f79}
    .editor-textos-image-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    #editor-textos-sign-backdrop{z-index:1305}
    #editor-textos-assist-backdrop{z-index:1200}
    #editor-textos-assist-backdrop.editor-textos-backdrop-inactive{pointer-events:none}
    #editor-textos-assist-backdrop.editor-textos-backdrop-inactive .editor-textos-assist-modal{opacity:.88;filter:saturate(.9)}
    .editor-textos-sign-modal{width:min(520px,94vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-sign-group{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-sign-row{margin-bottom:8px}
    .editor-textos-sign-row:last-of-type{margin-bottom:0}
    .editor-textos-sign-row label{display:block;margin-bottom:3px}
    .editor-textos-sign-row input[type="file"],
    .editor-textos-sign-row input[type="password"],
    .editor-textos-sign-row input[type="text"]{
      width:100%;height:26px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif
    }
    .editor-textos-sign-help{margin-top:8px;font:12px Tahoma,sans-serif;color:#4d5f79;line-height:1.35}
    .editor-textos-sign-bridge{margin-top:10px;border-top:1px solid #d5dce6;padding-top:8px}
    .editor-textos-sign-bridge-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}
    .editor-textos-sign-bridge-title{font:700 12px Tahoma,sans-serif;color:#24364d}
    .editor-textos-sign-bridge-status{font:12px Tahoma,sans-serif;color:#4d5f79;line-height:1.35;margin-bottom:6px}
    .editor-textos-sign-bridge-status.ok{color:#245a2a}
    .editor-textos-sign-bridge-status.warn{color:#7a4d12}
    .editor-textos-sign-bridge-list{border:1px solid #cfd8e3;background:#fff;max-height:140px;overflow:auto}
    .editor-textos-sign-bridge-item{display:flex;align-items:flex-start;gap:8px;padding:6px 8px;border-bottom:1px solid #edf1f6;font:12px Tahoma,sans-serif;cursor:pointer}
    .editor-textos-sign-bridge-item:last-child{border-bottom:none}
    .editor-textos-sign-bridge-item.selected{background:#eef6ff}
    .editor-textos-sign-bridge-radio{padding-top:2px}
    .editor-textos-sign-bridge-body{min-width:0;flex:1}
    .editor-textos-sign-bridge-item strong{display:block;color:#1f2f45}
    .editor-textos-sign-bridge-item small{display:block;color:#5d6c80;line-height:1.35}
    .editor-textos-sign-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:10px}
    .editor-textos-assist-modal{width:min(640px,96vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-assist-grid{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-assist-top{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
    .editor-textos-assist-top label,
    .editor-textos-assist-line label,
    .editor-textos-assist-presc label{display:block;margin-bottom:3px}
    .editor-textos-assist-grid select,
    .editor-textos-assist-grid input[type="text"],
    .editor-textos-assist-grid input[type="number"],
    .editor-textos-assist-grid textarea{
      width:100%;height:26px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif
    }
    .editor-textos-assist-grid textarea{height:90px;padding:6px;resize:vertical}
    .editor-textos-assist-line{margin-bottom:8px}
    .editor-textos-assist-inline{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:end}
    .editor-textos-assist-inline button{height:26px;min-height:26px}
    .editor-textos-assist-presc{border:1px solid #d6dde8;background:#fafcff;padding:6px;margin-bottom:8px}
    .editor-textos-assist-radio{display:flex;gap:14px;align-items:center;margin-bottom:6px}
    .editor-textos-assist-radio label{display:flex;align-items:center;gap:5px;margin:0}
    .editor-textos-assist-bottom{display:grid;grid-template-columns:110px 1fr;gap:8px;margin-bottom:8px}
    .editor-textos-assist-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px}
    .editor-textos-atestado-modal{width:min(660px,96vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-atestado-grid{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-atestado-top{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
    .editor-textos-atestado-top label,
    .editor-textos-atestado-line label,
    .editor-textos-atestado-periodo label,
    .editor-textos-atestado-cid label{display:block;margin-bottom:3px}
    .editor-textos-atestado-grid select,
    .editor-textos-atestado-grid input[type="text"],
    .editor-textos-atestado-grid textarea{
      width:100%;height:26px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif
    }
    .editor-textos-atestado-grid textarea{height:96px;padding:6px;resize:vertical}
    .editor-textos-atestado-line{margin-bottom:8px}
    .editor-textos-atestado-inline{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:end}
    .editor-textos-atestado-inline button{height:26px;min-height:26px}
    .editor-textos-atestado-paciente{background:#e7f8f8}
    .editor-textos-atestado-periodo{margin-bottom:8px}
    .editor-textos-atestado-periodo-grid{display:grid;grid-template-columns:92px auto 92px auto 62px auto 62px auto;gap:6px;align-items:end}
    .editor-textos-atestado-periodo-grid span{height:26px;display:flex;align-items:center;color:#334455}
    .editor-textos-atestado-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px}
    .editor-textos-atestado-cidmenu-modal{width:min(700px,96vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-atestado-cidmenu-grid{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-atestado-cidmenu-top{margin-bottom:8px}
    .editor-textos-atestado-cidmenu-top label{display:block;margin-bottom:3px}
    .editor-textos-atestado-cidmenu-top input{width:100%;height:26px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif}
    .editor-textos-atestado-cidmenu-table{border:1px solid #cfd8e3;height:320px;overflow:auto;background:#fff}
    .editor-textos-atestado-cidmenu-table table{width:100%;border-collapse:collapse;table-layout:fixed}
    .editor-textos-atestado-cidmenu-table th,.editor-textos-atestado-cidmenu-table td{padding:3px 6px;border-bottom:1px solid #edf1f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .editor-textos-atestado-cidmenu-table th{text-align:left;background:#f2f6fb}
    .editor-textos-atestado-cidmenu-table tr.selected{background:#d9e8fb}
    .editor-textos-atestado-cidmenu-alpha{display:grid;grid-template-columns:repeat(15,minmax(0,1fr));gap:2px;margin:6px 0 8px}
    .editor-textos-atestado-cidmenu-alpha button{height:22px;padding:0 4px;border:1px solid #bfc9d6;background:#f2f6fb;cursor:pointer;font:12px Tahoma,sans-serif}
    .editor-textos-atestado-cidmenu-alpha button.active{background:#d9e8fb;border-color:#8ea9cb}
    .editor-textos-atestado-cidmenu-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:8px}
    .editor-textos-atestado-cidmenu-foot label{display:flex;align-items:center;gap:6px}
    .editor-textos-atestado-cidmenu-actions{display:flex;justify-content:flex-end;gap:8px}
    .editor-textos-assist-medmenu-modal{width:min(700px,96vw);background:#f6f6f4;border:1px solid #bfc9d6;padding:10px;box-sizing:border-box}
    .editor-textos-assist-medmenu-grid{border:1px solid #c7ced8;background:#fff;padding:8px}
    .editor-textos-assist-medmenu-top{display:grid;grid-template-columns:260px 1fr;gap:12px;margin-bottom:8px}
    .editor-textos-assist-medmenu-top label{display:block;margin-bottom:3px}
    .editor-textos-assist-medmenu-top select,.editor-textos-assist-medmenu-top input{width:100%;height:26px;border:1px solid #b9c4d3;padding:0 6px;box-sizing:border-box;background:#fff;font:12px Tahoma,sans-serif}
    .editor-textos-assist-medmenu-alpha{display:flex;flex-wrap:wrap;gap:2px;margin-bottom:6px}
    .editor-textos-assist-medmenu-alpha button{min-width:22px;height:22px;padding:0 4px;border:1px solid #bfc9d6;background:#f2f6fb;cursor:pointer;font:12px Tahoma,sans-serif}
    .editor-textos-assist-medmenu-alpha button.active{background:#d9e8fb;border-color:#8ea9cb}
    .editor-textos-assist-medmenu-table{border:1px solid #cfd8e3;height:320px;overflow:auto;background:#fff}
    .editor-textos-assist-medmenu-table table{width:100%;border-collapse:collapse;table-layout:fixed}
    .editor-textos-assist-medmenu-table th,.editor-textos-assist-medmenu-table td{padding:3px 6px;border-bottom:1px solid #edf1f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .editor-textos-assist-medmenu-table th{text-align:left;background:#f2f6fb}
    .editor-textos-assist-medmenu-table tr.selected{background:#d9e8fb}
    .editor-textos-assist-medmenu-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px}
    .editor-textos-menupop{position:absolute;top:25px;left:6px;z-index:60;min-width:280px;background:#fff;border:1px solid #a8b2c2;box-shadow:0 4px 12px rgba(0,0,0,.2)}
    .editor-textos-menupop.hidden{display:none}
    .editor-textos-menupop button{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;border:none;background:#fff;text-align:left;padding:6px 10px;cursor:pointer;font:12px Tahoma,sans-serif}
    .editor-textos-menupop button .menu-label{display:block;min-width:0;white-space:nowrap}
    .editor-textos-menupop button .menu-shortcut{display:block;color:#4c5c73;white-space:nowrap}
    .editor-textos-menupop button:hover{background:#d9e8fb}
    .editor-textos-menupop .sep{height:1px;background:#d0d7e2;margin:3px 0}
    .editor-textos-pdfprompt-modal{width:min(560px,96vw);background:#f2f2f2;border:1px solid #bfc9d6;box-sizing:border-box;padding:0 0 10px;font:12px Tahoma,sans-serif;color:#000}
    .editor-textos-pdfprompt-body{display:grid;grid-template-columns:72px 1fr;gap:14px;padding:16px 18px 18px;min-height:112px;align-items:start}
    .editor-textos-pdfprompt-icon{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 35%,#9fe4ff 0,#3faef5 55%,#1673cc 100%);border:2px solid #d6f0ff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.65);color:#fff;font:700 34px/1 Tahoma,sans-serif}
    .editor-textos-pdfprompt-message{font:12px Tahoma,sans-serif;line-height:1.45;padding-top:4px;word-break:break-word}
    .editor-textos-pdfprompt-sep{height:1px;background:#cfcfcf;margin:0 8px}
    .editor-textos-pdfprompt-actions{display:flex;justify-content:flex-end;gap:10px;padding:14px 14px 0}
    .editor-textos-pdfprompt-btn{min-width:92px;height:28px;border:1px solid #b9c2ce;border-radius:4px;background:linear-gradient(180deg,#ffffff,#ededed);box-shadow:inset 0 1px 0 rgba(255,255,255,.9);font:12px Tahoma,sans-serif;color:#000;cursor:pointer}
    .editor-textos-pdfprompt-btn:hover{background:linear-gradient(180deg,#ffffff,#e6eefc)}
    .editor-textos-pdfprompt-btn:focus{outline:1px dotted #1d5fa7;outline-offset:-4px}
  `;
    doc.head.appendChild(style);
  }

  function ensureUI(ctx={}){
    const doc=ctx.document||document;
    ensureShell(doc,ctx);
    ensureStyle(doc);
    const shell={
      panel:doc.getElementById("editor-textos-panel"),
      title:doc.querySelector("#editor-textos-panel .panel-title"),
      page:doc.getElementById("editor-textos-page"),
      nome:doc.getElementById("editor-textos-nome"),
      status:doc.getElementById("editor-textos-status"),
      font:doc.getElementById("editor-textos-font"),
      size:doc.getElementById("editor-textos-size"),
      color:doc.getElementById("editor-textos-color"),
      colorSwatch:doc.querySelector("#editor-textos-color-swatch"),
      menuArquivo:doc.getElementById("editor-textos-menu-arquivo"),
      menuEditar:doc.getElementById("editor-textos-menu-editar"),
      menuFormatar:doc.getElementById("editor-textos-menu-formatar"),
      menuPop:doc.getElementById("editor-textos-menupop"),
      btnAbrir:doc.getElementById("editor-textos-btn-abrir"),
      btnNovo:doc.getElementById("editor-textos-btn-novo"),
      btnSalvar:doc.getElementById("editor-textos-btn-salvar"),
      btnSalvarComo:doc.getElementById("editor-textos-btn-salvar-como"),
      btnImprimir:doc.getElementById("editor-textos-btn-imprimir"),
      btnFechar:doc.getElementById("editor-textos-btn-fechar"),
      btnNegrito:doc.getElementById("editor-textos-btn-negrito"),
      btnItalico:doc.getElementById("editor-textos-btn-italico"),
      btnSublinhado:doc.getElementById("editor-textos-btn-sublinhado"),
      btnRecortar:doc.getElementById("editor-textos-btn-recortar"),
      btnCopiar:doc.getElementById("editor-textos-btn-copiar"),
      btnColar:doc.getElementById("editor-textos-btn-colar"),
      btnEsq:doc.getElementById("editor-textos-btn-esq"),
      btnCentro:doc.getElementById("editor-textos-btn-centro"),
      btnDir:doc.getElementById("editor-textos-btn-dir"),
      btnJustificar:doc.getElementById("editor-textos-btn-justificar"),
      btnLista:doc.getElementById("editor-textos-btn-lista"),
      btnImagem:doc.getElementById("editor-textos-btn-imagem"),
      btnTabela:doc.getElementById("editor-textos-btn-tabela"),
      btnPagina:doc.getElementById("editor-textos-btn-pagina"),
      imageFileInput:doc.getElementById("editor-textos-image-file"),
      btnInserirCampo:doc.getElementById("editor-textos-btn-inserir-campo"),
      btnGerarPdf:doc.getElementById("editor-textos-btn-gerar-pdf"),
      openBackdrop:doc.getElementById("editor-textos-open-backdrop"),
      openQ:doc.getElementById("editor-textos-open-q"),
      openTipo:doc.getElementById("editor-textos-open-tipo"),
      openRefresh:doc.getElementById("editor-textos-open-refresh"),
      openTbody:doc.getElementById("editor-textos-open-tbody"),
      openOk:doc.getElementById("editor-textos-open-ok"),
      openCancelar:doc.getElementById("editor-textos-open-cancelar"),
      openContext:doc.getElementById("editor-textos-open-context"),
      openMenuAbrir:doc.getElementById("editor-textos-open-menu-abrir"),
      openMenuRenomear:doc.getElementById("editor-textos-open-menu-renomear"),
      openMenuExcluir:doc.getElementById("editor-textos-open-menu-excluir"),
      openMenuPropriedades:doc.getElementById("editor-textos-open-menu-propriedades"),
      openDeleteBackdrop:doc.getElementById("editor-textos-open-delete-backdrop"),
      openDeleteNome:doc.getElementById("editor-textos-open-delete-nome"),
      openDeleteTipo:doc.getElementById("editor-textos-open-delete-tipo"),
      openDeleteSim:doc.getElementById("editor-textos-open-delete-sim"),
      openDeleteNao:doc.getElementById("editor-textos-open-delete-nao"),
      pdfPromptBackdrop:doc.getElementById("editor-textos-pdfprompt-backdrop"),
      pdfPromptMessage:doc.getElementById("editor-textos-pdfprompt-message"),
      pdfPromptClose:doc.getElementById("editor-textos-pdfprompt-close"),
      pdfPromptSim:doc.getElementById("editor-textos-pdfprompt-sim"),
      pdfPromptNao:doc.getElementById("editor-textos-pdfprompt-nao"),
      newBackdrop:doc.getElementById("editor-textos-new-backdrop"),
      newModeOpen:doc.getElementById("editor-textos-new-mode-open"),
      newModeType:doc.getElementById("editor-textos-new-mode-type"),
      newType:doc.getElementById("editor-textos-new-type"),
      newOk:doc.getElementById("editor-textos-new-ok"),
      newCancelar:doc.getElementById("editor-textos-new-cancelar"),
      mergeBackdrop:doc.getElementById("editor-textos-merge-backdrop"),
      mergeCategory:doc.getElementById("editor-textos-merge-category"),
      mergeTbody:doc.getElementById("editor-textos-merge-tbody"),
      mergeOk:doc.getElementById("editor-textos-merge-ok"),
      mergeCancelar:doc.getElementById("editor-textos-merge-cancelar"),
      tableBackdrop:doc.getElementById("editor-textos-table-backdrop"),
      tableCols:doc.getElementById("editor-textos-table-cols"),
      tableRows:doc.getElementById("editor-textos-table-rows"),
      tableBorder:doc.getElementById("editor-textos-table-border"),
      tableOk:doc.getElementById("editor-textos-table-ok"),
      tableCancelar:doc.getElementById("editor-textos-table-cancelar"),
      paginaBackdrop:doc.getElementById("editor-textos-pagina-backdrop"),
      paginaTipo:doc.getElementById("editor-textos-pagina-tipo"),
      paginaOrientacao:doc.getElementById("editor-textos-pagina-orientacao"),
      paginaAltura:doc.getElementById("editor-textos-pagina-altura"),
      paginaLargura:doc.getElementById("editor-textos-pagina-largura"),
      paginaMargemSuperior:doc.getElementById("editor-textos-pagina-margem-superior"),
      paginaMargemEsquerda:doc.getElementById("editor-textos-pagina-margem-esquerda"),
      paginaMargemDireita:doc.getElementById("editor-textos-pagina-margem-direita"),
      paginaOk:doc.getElementById("editor-textos-pagina-ok"),
      paginaCancelar:doc.getElementById("editor-textos-pagina-cancelar"),
      imageBackdrop:doc.getElementById("editor-textos-image-backdrop"),
      imageName:doc.getElementById("editor-textos-image-name"),
      imagePreview:doc.getElementById("editor-textos-image-preview"),
      imageFit:doc.getElementById("editor-textos-image-fit"),
      imageHint:doc.getElementById("editor-textos-image-hint"),
      imageEscolher:doc.getElementById("editor-textos-image-escolher"),
      imageOk:doc.getElementById("editor-textos-image-ok"),
      imageCancelar:doc.getElementById("editor-textos-image-cancelar"),
      signBackdrop:doc.getElementById("editor-textos-sign-backdrop"),
      signUseCurrent:doc.getElementById("editor-textos-sign-use-current"),
      signPdf:doc.getElementById("editor-textos-sign-pdf"),
      signPfx:doc.getElementById("editor-textos-sign-pfx"),
      signPassword:doc.getElementById("editor-textos-sign-password"),
      signField:doc.getElementById("editor-textos-sign-field"),
      signUseWindows:doc.getElementById("editor-textos-sign-use-windows"),
      signBridgeRefresh:doc.getElementById("editor-textos-sign-bridge-refresh"),
      signBridgeStatus:doc.getElementById("editor-textos-sign-bridge-status"),
      signBridgeList:doc.getElementById("editor-textos-sign-bridge-list"),
      signOk:doc.getElementById("editor-textos-sign-ok"),
      signCancelar:doc.getElementById("editor-textos-sign-cancelar"),
      assistBackdrop:doc.getElementById("editor-textos-assist-backdrop"),
      assistCirurgiao:doc.getElementById("editor-textos-assist-cirurgiao"),
      assistModelo:doc.getElementById("editor-textos-assist-modelo"),
      assistPaciente:doc.getElementById("editor-textos-assist-paciente"),
      assistPacienteBtn:doc.getElementById("editor-textos-assist-paciente-btn"),
      assistMedicamento:doc.getElementById("editor-textos-assist-medicamento"),
      assistMedicamentoBtn:doc.getElementById("editor-textos-assist-medicamento-btn"),
      assistRadioAdulto:doc.getElementById("editor-textos-assist-radio-adulto"),
      assistRadioCrianca:doc.getElementById("editor-textos-assist-radio-crianca"),
      assistPrescricao:doc.getElementById("editor-textos-assist-prescricao"),
      assistQuantidade:doc.getElementById("editor-textos-assist-quantidade"),
      assistUso:doc.getElementById("editor-textos-assist-uso"),
      assistObs:doc.getElementById("editor-textos-assist-obs"),
      assistStatus:doc.getElementById("editor-textos-assist-status"),
      assistIncluir:doc.getElementById("editor-textos-assist-incluir"),
      assistFinalizar:doc.getElementById("editor-textos-assist-finalizar"),
      assistAssinar:doc.getElementById("editor-textos-assist-assinar"),
      assistCancelar:doc.getElementById("editor-textos-assist-cancelar"),
      assistMedMenuBackdrop:doc.getElementById("editor-textos-assist-medmenu-backdrop"),
      assistMedMenuFiltro:doc.getElementById("editor-textos-assist-medmenu-filtro"),
      assistMedMenuQ:doc.getElementById("editor-textos-assist-medmenu-q"),
      assistMedMenuAlpha:doc.getElementById("editor-textos-assist-medmenu-alpha"),
      assistMedMenuTbody:doc.getElementById("editor-textos-assist-medmenu-tbody"),
      assistMedMenuOk:doc.getElementById("editor-textos-assist-medmenu-ok"),
      assistMedMenuCancelar:doc.getElementById("editor-textos-assist-medmenu-cancelar"),
      assistAtestadoBackdrop:doc.getElementById("editor-textos-atestado-backdrop"),
      assistAtestadoCirurgiao:doc.getElementById("editor-textos-atestado-cirurgiao"),
      assistAtestadoModelo:doc.getElementById("editor-textos-atestado-modelo"),
      assistAtestadoPaciente:doc.getElementById("editor-textos-atestado-paciente"),
      assistAtestadoPacienteBtn:doc.getElementById("editor-textos-atestado-paciente-btn"),
      assistAtestadoDataInicial:doc.getElementById("editor-textos-atestado-data-inicial"),
      assistAtestadoDataFinal:doc.getElementById("editor-textos-atestado-data-final"),
      assistAtestadoHoraInicial:doc.getElementById("editor-textos-atestado-hora-inicial"),
      assistAtestadoHoraFinal:doc.getElementById("editor-textos-atestado-hora-final"),
      assistAtestadoMotivo:doc.getElementById("editor-textos-atestado-motivo"),
      assistAtestadoCid:doc.getElementById("editor-textos-atestado-cid"),
      assistAtestadoCidBtn:doc.getElementById("editor-textos-atestado-cid-btn"),
      assistAtestadoObs:doc.getElementById("editor-textos-atestado-obs"),
      assistAtestadoOk:doc.getElementById("editor-textos-atestado-ok"),
      assistAtestadoCancelar:doc.getElementById("editor-textos-atestado-cancelar"),
      assistAtestadoCidMenuBackdrop:doc.getElementById("editor-textos-atestado-cidmenu-backdrop"),
      assistAtestadoCidMenuQ:doc.getElementById("editor-textos-atestado-cidmenu-q"),
      assistAtestadoCidMenuTbody:doc.getElementById("editor-textos-atestado-cidmenu-tbody"),
      assistAtestadoCidMenuAlpha:doc.getElementById("editor-textos-atestado-cidmenu-alpha"),
      assistAtestadoCidMenuPreferidos:doc.getElementById("editor-textos-atestado-cidmenu-preferidos"),
      assistAtestadoCidMenuOk:doc.getElementById("editor-textos-atestado-cidmenu-ok"),
      assistAtestadoCidMenuCancelar:doc.getElementById("editor-textos-atestado-cidmenu-cancelar"),
      rulerScale:doc.getElementById("editor-textos-ruler-scale"),
      work:doc.querySelector("#editor-textos-panel .editor-textos-work")
    };

    const fontSelect=shell.font;
    const sizeSelect=shell.size;
    const colorSelect=shell.color;
    const colorSwatch=shell.colorSwatch;
    const newTypeSelect=shell.newType;

    if(fontSelect){
      fontSelect.innerHTML='<option value="">Carregando fontes...</option>';
      fontSelect.disabled=true;
    }
    if(sizeSelect){
      sizeSelect.innerHTML=["8","9","10","11","12","14","16","18","20","24","28","36"].map(size=>`<option value="${size}">${size}</option>`).join("");
      sizeSelect.value="11";
    }
    const colorListFallback=[
    {value:"#ffff00",label:"Amarelo"},
    {value:"#0000ff",label:"Azul"},
    {value:"#00e5ef",label:"Azul água"},
    {value:"#000080",label:"Azul marinho"},
    {value:"#ffffff",label:"Branco"},
    {value:"#808080",label:"Cinza"},
    {value:"#d9d9d9",label:"Cinza claro"},
    {value:"#666666",label:"Cinza escuro"},
    {value:"#c61ad9",label:"Lilás"},
    {value:"#8b4513",label:"Marrom"},
    {value:"#c0c0c0",label:"Prata"},
    {value:"#000000",label:"Preto"},
    {value:"#800080",label:"Roxo"},
    {value:"#008000",label:"Verde"},
    {value:"#006400",label:"Verde escuro"},
    {value:"#00ff00",label:"Verde limão"},
    {value:"#808000",label:"Verde oliva"},
    {value:"#ff0000",label:"Vermelho"}
  ];
    const colorListSource=(typeof ctx.prestAgendaApresCorOptions==="function")
      ? ctx.prestAgendaApresCorOptions()
      : colorListFallback;
    const colorList=[];
    const colorSeen=new Set();
    (Array.isArray(colorListSource)?colorListSource:[]).forEach(item=>{
      const value=String(item?.value||"").trim().toLowerCase();
      const label=String(item?.label||"").trim();
      if(!/^#[0-9a-f]{6}$/.test(value)||!label||colorSeen.has(value))return;
      colorSeen.add(value);
      colorList.push({label,value});
    });
    if(!colorSeen.has("#000000"))colorList.unshift({label:"Preto",value:"#000000"});
    if(colorSelect){
      colorSelect.innerHTML=colorList.map(item=>`<option value="${escHtml(String(item.value))}">${escHtml(String(item.label))}</option>`).join("");
      colorSelect.value="#000000";
      if(typeof ctx.auxCorApresentacaoMontarCombo==="function"){
        try{ctx.auxCorApresentacaoMontarCombo(colorSelect)}catch{}
      }
    }
    if(colorSwatch)colorSwatch.style.backgroundColor="#000000";
    if(newTypeSelect){
      populateSelect(newTypeSelect,ctx.editorTextosNovoTipos||[],item=>item.value,item=>item.label);
      newTypeSelect.value="receita";
    }
    return shell;
  }

  window.BranaEditorTextosBootstrapModule=Object.freeze({ensureUI});
})();
