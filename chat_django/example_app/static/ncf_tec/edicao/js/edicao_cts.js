///****************************   LISTAGEM DAS COMPETÊNCIAS E APTIDÕES (INICIO) *****************************************
// -- Listagem das Competências Cognitivas
var recarregar_cognitiva = function() {
    $('#cognitivas').djflexgrid({
        url: URL_LISTAR_COGNITIVAS.replace('/0/', '/' + _funcao_id + '/'),
        completeLoad: function() {
            completeLoad("cognitivas");
        }
    });
};

// --Listagem das CAptidões
function recarregar_aptidoes() {
    $('#aptidoes').djflexgrid({
        //filter_form : '#aptidao_form form',
        url: URL_LISTAR_APTIDOES.replace('/0/', '/' + _funcao_id + '/'),
        completeLoad: function() {
            completeLoad("aptidoes");
        }
    });
};

// Selecionar Todos
function marcar_desmarcar_todas(table) {
    var checks = $(table).find('tbody [name=funccts]');
    $(table).find('thead [name=selecionar-todas]').on('change', function(e) {
        $(table).find('thead [name=selecionar-todas]').checkUncheckAll(checks).change();
    });
};

// Avaliar todos
function marcar_desmarcar_avaliar(table) {
    var checks = $(table).find('tbody [name=avaliar]:checkbox');
    $(table).find('[name=avaliar-todas]').on('change', function(e) {
        $(table).find('[name=avaliar-todas]').checkUncheckAll(checks).change();
    });
};

// Execuções pós-reload da tabela de cognitivas ou aptidoes
var completeLoad = function(tipo) {
    // Configurações de Remoção
    $('#' + tipo + ' table').keyup(function(e) {
        if (e.keyCode == 46) { // DEL
            deletar_em_massa(this);
        };
    });
    marcar_desmarcar_todas('#' + tipo);
    marcar_desmarcar_avaliar('#' + tipo);

    // Verificação dos níveis após carregamento
    $('#' + tipo + ' tbody tr').each(function() {
        clean_funcaoct($(this).closest('tr'), tipo != "cognitivas");
    });

};

///****************************   LISTAGEM DAS COMPETÊNCIAS E APTIDÕES (FIM) *****************************************

///*********************   ATUALIZAÇÃO/SALVAMENTO DAS COMPETÊNCIAS E APTIDÕES (INICIO) *******************************

// Validação dos níveis após alteração das informações de cada componente
// Após validação, se estiver ok, emite o pedido de salvamento das informações
// Cria a ação dos botçoes de excluir.
var criar_acoes_automaticas = function() {

    $('#cognitivas [name=avaliar]:checkbox, #cognitivas select[name^=nivel]').die('change');
    $('#cognitivas [name=avaliar]:checkbox, #cognitivas select[name^=nivel]').live('change', function(e) {
        if (this.tagName == 'SELECT') {
            // Ajustes para o type select
            $(this.options).not(this.options[this.options.selectedIndex]).removeAttr('selected');
            $(this.options[this.options.selectedIndex]).prop('selected', true).attr('selected', 'selected');
        };
        if (clean_funcaoct($(this).closest('tr'), false))
            atualizar_funcaoct($(this).closest('tr'));
    });

    $('#aptidoes [name=avaliar]:checkbox').die('change');
    $('#aptidoes [name=avaliar]:checkbox').live('change', function(e) {
        if (clean_funcaoct($(this).closest('tr'), true))
            atualizar_funcaoct($(this).closest('tr'));
    });

    $('.deletar').die('click');
    $('.deletar').live("click", function() {
        var obj = $(this);
        var funcao_ct_id = obj.data('funcaoCtId');
        $.dialogs.confirm('Você realmente quer excluir esta competência?', function() {
            _deletar(obj, funcao_ct_id, obj.closest('tr'));
        });
    });

};

// Níveis - Validação dos Níveis
function clean_niveis(avaliar, min, ideal) {
    if (avaliar && (!min && ideal)) {
        return 'O nível mínimo não pode ficar em branco se a opção avaliar estiver marcada.';
    } else if (avaliar && (min && !ideal)) {
        return 'O nível ideal não pode ficar em branco se a opção avaliar estiver marcada.';
    } else if (avaliar && (!min && !ideal)) {
        return 'Os níveis não podem ficar em branco se a opção avaliar estiver marcada.';
    } else if ((min && ideal) && (min > ideal)) {
        return 'O nível mínimo não pode ser maior que o ideal.';
    };
};

// Salvar Funcaoct (Atualização) ao trocar os niveis ou marcar avaliar, ele faz uma requisição e salva as informações
function atualizar_funcaoct(tr) {
    mostrarCarregando("Salvando Atribuição");
    var id_ct = tr.attr('cache-id');
    var url = URL_ATUALIZAR_FUNCAOCTS.replace('/0/', '/' + id_ct + '/');
    var nivel = $(tr).find('select[name=nivel_ideal]').val();
    var nivel_min = $(tr).find('select[name=nivel_min]').val();
		var avaliar = $(tr).find('input[name=avaliar]').is(':checked');
    $.ajax({
        url: url,
        type: 'post',
        assync: false,
        data: {
            nivel: nivel ? nivel : '',
            nivel_min: nivel_min ? nivel_min : '',
            avaliar: avaliar ? 'on' : ''
        },
				success: function(dados){
				    if(dados['status']=='nok'){
							$.dialogs.error(dados['msg']);
						}
				},
				complete: esconderCarregando
    });
};

// Faz a validação das funções (avaliar, nivel e nivel minimo) tanto de cognitivas qnt das aptidões
function clean_funcaoct(tr, aptidao) {
    if (tr.find('td').length > 1) {
        tr.popover('destroy');
        var avaliar = tr.find('[name=avaliar]').is(':checked');
        var min = tr.find('[name^=nivel_min]').val();
        var ideal = tr.find('[name^=nivel_ideal]').val();
        var msg_niveis_invalidos = clean_niveis(avaliar, min, ideal);
        if (msg_niveis_invalidos && !aptidao) {
            tr.removeClass('warning');
            tr.addClass('danger');
            tr.addClass('danger');
            //$("tr[cache-id='43715']").find("td:last")$("#erro_popover_43715")
            var tr_id = tr.attr("cache-id");
            $("#erro_popover_" + tr_id).remove();
            tr.find("td:last").find(".action-buttons").append("<i id='erro_popover_" + tr_id + "' class='ace-icon red fa fa-exclamation-triangle bigger-120'></i>");
            $("#erro_popover_" + tr_id).popover({
                placement: 'left',
                title: 'Nível Inválido',
                trigger: 'manual',
                viewport: "#erro_popover_" + tr_id,
                content: msg_niveis_invalidos
            });
            $("#erro_popover_" + tr_id).mouseover(function() {
                $(this).popover('show');
                var left = $("#erro_popover_" + tr_id).position().left - 300;
                var top = $("#erro_popover_" + tr_id).position().top - 50;
                $(tr.find(".popover")).attr("style", "left: " + left + "px!important; top: " + top + "px!important; display: block;");
            });
            $("#erro_popover_" + tr.attr("cache-id")).mouseout(function() {
                $(this).popover('hide');
            });
            return false;
        } else {
            var tr_id = tr.attr("cache-id");
            $("#erro_popover_" + tr_id).remove();
            tr.removeClass('danger');
            if (!avaliar) {
                tr.addClass('warning');
            } else {
                tr.removeClass('warning');
            };
        };
        return true;
    };
    return false;
};

// Deletar FuncaoCT
function _deletar(flexgrid, pk_ou_pks, trs) {
    $.post(
        URL_DELETAR_FUNCAOCTS, {
            funccts_ids: pk_ou_pks,
            funcao_id: _funcao_id
        },
        function(response) {
            if (response.status == 'ok') {
                trs.addClass('success');
                recarregar_aptidoes();
                recarregar_cognitiva();
            } else {
                $.dialogs.error(response["msg"]);
            };
        }
    );
};

// Deletar FuncaoCT em Massa
function deletar_em_massa(obj) {
    var table = $(obj).closest('.dataTables_wrapper').find('table');
    var checks = table.find('[name=funccts]:checked');
    var trs = checks.closest('tr');
    var pks = _.map(trs, function(item, index) {
        return $(item).attr('cache-id');
    });
    if (checks.length == 0) {
        $.dialogs.warning('Selecione pelo menos 1 competência para deletar');
    } else {
        $.dialogs.confirm('Você realmente deseja excluir esta(s) competência(s)?', function() {
            _deletar('#' + table.parent().prop('id'), pks, trs);
        });
    };
};

///*********************   ATUALIZAÇÃO/SALVAMENTO DAS COMPETÊNCIAS E APTIDÕES (FIM) *******************************


///*************************   ADIÇÃO DE NOVAS COMPETÊNCIAS E APTIDÕES (INICIO) ***********************************

// Dialog - Famílias para a seleção de novas competências cognitivas
function get_familiasct(dialog) {
    var accordion = dialog.find('#accordion');
    accordion.html("");
    mostrarCarregando();
    $.ajax({
        url: URL_LISTAR_FAMILIACTS.replace('/0/', '/' + _funcao_id + '/'),
        type: 'get',
        assync: false,
        success: function(retorno) {
            $('#accordion').html(retorno["html"]);
            if ($(".accordion-header").length != 0) {
                accordion.accordion({
                    active: false,
                    animate: 250,
                    collapsible: true,
                    heightStyle: 'content',
                    header: '.accordion-header'
                }).accordion('refresh');
            }
        },
        complete: esconderCarregando
    });

    // Ações
    $(".nova-competencia").die('click');
    $(".nova-competencia").live('click', abrir_cad_ct_cognitiva);

    $(".selecionar-todas").die('change');
    $(".selecionar-todas").live('change', function() {
        $(this).checkUncheckAll($(this).closest('table').find('tbody').find(':checkbox'));
    });

};

// Dialog - Aptidões para a seleção de novas competências cognitivas
function get_aptidoes(dialog) {
    $('#container-aptidoes').html("");
    mostrarCarregando();
    $.ajax({
        url: URL_LISTAR_ADD_APTIDAO.replace('/0/', '/' + _funcao_id + '/'),
        type: 'get',
        assync: false,
        success: function(retorno) {
            $('#container-aptidoes').html(retorno["html"]);
        },
        complete: esconderCarregando
    });

    // Ações
    $(".nova-aptidao").die('click');
    $(".nova-aptidao").live('click', abrir_cad_ct_aptidao);

    $(".selecionar-todas-aptidao").die('change');
    $(".selecionar-todas-aptidao").live('change', function() {
        $(this).checkUncheckAll($(this).closest('table').find('tbody').find(':checkbox'));
    });

};

// Adiciona as competências/aptidões que foram selecionadas para a função
var salvar_competencia = function(dialog, tipo, label) {
    var data = dialog.find(':checked').serialize();
    if (data.length == 0) {
        $.dialogs.warning('Escolha pelo menos uma ' + label + ' para adicionar');
    } else {
        data += '&funcao=' + _funcao_id;
        $.post(URL_CRIAR_FUNCAOCTS, data, function(response) {
            if (response.status == 'error') {
                $.dialogs.error(response.errors);
            } else {
                if (tipo == 'competencia') recarregar_cognitiva();
                else recarregar_aptidoes();
                dialog.dialog('close');
            };
        });
    };
};


///***************************   ADIÇÃO DE NOVAS COMPETÊNCIAS E APTIDÕES (FIM) ************************************
