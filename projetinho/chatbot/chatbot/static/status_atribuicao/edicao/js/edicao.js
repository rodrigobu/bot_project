// Listar as competências da atribuição
var abrir_cts_atrib = function(atrib_id) {
    var url = URL_LIST_CTS.replace('/0/', '/' + atrib_id + '/');
    // Gerar Formulário
    $.post(url, {}, function(response) {
        if (response["status"] == "ok") {
            $('#container-cts').html(response["html"]);
            // Abrir Dialog
            $('.dialog-cts').dialog({
                title: 'Ver Competências Técnicas',
                modal: true,
                hide: 'fade',
                show: 'fade',
                ace_theme: true,
                width: '60%',
                close: function() {
                    $(this).dialog('close').dialog('destroy');
                },
                buttons: {
                    c: { // Botão Fechar
                        click: function() {
                            $(this).dialog('close');
                        },
                        'class': 'btn btn-xs',
                        text: 'Fechar'
                    },
                }
            });
        } else {
            $.dialogs.error(response["msg"]);
        }
    });

};

// Atualiza a ordem das atribuições
var ORDENACAO = {};

function atualiza_ordem() {

    $.each($('#listagem').find('tbody > tr'), function(index, tr) {
        var tr = $(tr);
        tr.find('.ordem_td').html(index + 1);
        ORDENACAO[tr.attr("cache-id")] = index + 1;
    });
    // Enviar a alteração
    $.post(URL_SALVAR_ORDEM, ORDENACAO, function(response) {
        if (response["status"] == "ok") {;
        }
    });
}

// Salva o formulário de nova atribuição
var salvar_novaatrib = function() {
    mostrarCarregando("Salvando ...");
    if ($("#id_1-descricao").val().replace(" ", "") == '') {
        $.dialogs.error("O campo Descrição é obrigatório.");
        esconderCarregando();
        return;
    }
    var data = $('#cad_atrib_form').serialize();
    $.post(URL_CAD_ATRIB, data, function(response) {
        if (response["status"] == "ok") {
            // Limpa o form
            $('#cad_atrib_form').html("");
            // Reload nas listagens
            $("#table_cts_atribuicoes table tbody").append('<tr>\
                     <td class="center"> \
                         <span>\
                             <input type="checkbox" name="ct" value="' + response["id"] + '" class=""> \
                             <span class="lbl"></span> \
                         </span> \
                     </td> \
                     <td> <span> ' + response["descricao"] + ' </span> </td> \
                  </tr>');
            $("#table_cts_atribuicoes [value='" + response["id"] + "']").click();
            // Fecha dialog
            $('.dialog-cad-atribuicao').dialog("close");
            // Alerta de sucesso
            $.dialogs.success("Atribuição cadastrada com sucesso.");
        } else {
            $.dialogs.error(response["msg"]);
        }
    }).done(function() {
        esconderCarregando();
    }).fail(function() {
        esconderCarregando();
    });
};

// Cadastrar Atribuição
var abrir_cad_atribuicao = function() {
    // Gerar Formulário
    $.post(URL_GET_FORM_ATRIB, {}, function(response) {
        if (response["status"] == "ok") {
            $('#cad_atribuicao_form').html(response["html"]);
            // Abrir Dialog
            $('.dialog-cad-atribuicao').dialog({
                title: 'Cadastrar Atribuição',
                modal: true,
                hide: 'fade',
                show: 'fade',
                ace_theme: true,
                width: '40%',
                close: function() {
                    $(this).dialog('close').dialog('destroy');
                },
                buttons: {
                    c: { // Botão Cancelar
                        click: function() {
                            $(this).dialog('close');
                        },
                        'class': 'btn btn-xs',
                        text: 'Cancelar'
                    },
                    s: { // Botão Salvar
                        click: salvar_novaatrib,
                        'class': 'btn btn-xs btn-success pull-right',
                        text: 'Salvar'
                    }
                }
            });
        } else {
            $.dialogs.error(response["msg"]);
        }
    });

};

// Adicionar Atribuição
function salvar_atrib(dialog) {
    var data = dialog.find(':checked').serialize();
    if (data.length == 0) {
        $.dialogs.warning('Escolha pelo menos uma atribuição para adicionar.');
    } else {
        var url = URL_ADD_ATRIB.replace('/0/', '/' + _funcao_id + '/');
        $.post(url, data, function(response) {
            if (response.status == 'error') {
                $.dialogs.error(response.errors);
            } else {
                recarregar_listagem();
                dialog.dialog('close');
            };
        });
    };
};

// Dialog - Famílias para a seleção de novas competências cognitivas
function get_atribuicoes(dialog) {
    var container = dialog.find('#container-atrib');
    container.html("");
    mostrarCarregando();
    $.ajax({
        url: URL_LISTA_ATRIB_ADD.replace('/0/', '/' + _funcao_id + '/'),
        type: 'get',
        assync: false,
        success: function(retorno) {
            container.html(retorno["html"]);
        },
        complete: esconderCarregando
    });

    // Ações
    $(".nova-atribuicao").die('click');
    $(".nova-atribuicao").live('click', abrir_cad_atribuicao);

    $(".selecionar-todas-atribuicao").die('change');
    $(".selecionar-todas-atribuicao").live('change', function() {
        $(this).checkUncheckAll($(this).closest('table').find('tbody').find(':checkbox'));
    });

};

// Exclui Atribuição
function excluir_atribuicao(id_atrib) {
    $.dialogs.confirm('Você realmente quer excluir esta atribuição?', function() {
        mostrarCarregando("Excluindo...");
        var url = URL_DELETAR_ATRIB.replace('/0/', '/' + id_atrib + '/');
        $.ajax({
            url: url,
            type: 'post',
            assync: false,
            success: function(retorno) {
                if (retorno["status"] == "ok") {
                    $.dialogs.success(retorno["msg"]);
                    recarregar_listagem();
                } else {
                    $.dialogs.error(retorno["msg"]);
                }
            },
            complete: esconderCarregando
        });
    });
}

// Salvar Atribuição (Atualização) ao alterar qualquer elemento da listagem, ele faz uma requisição e salva as informações
function atualizar_atribuicao(tr) {
  	mostrarCarregando("Salvando Atribuição");
    var id_atrib = tr.attr('cache-id');
    var url = URL_UTUALIZAR_ATRIB.replace('/0/', '/' + id_atrib + '/');
    var impacto = $(tr).find('select[name*=impacto]').val();
    var dificuldade = $(tr).find('select[name*=dificuldade]').val();
    var descricao = $(tr).find('textarea[name*=descricao]').val();
    var estrategica = $(tr).find('[name*=estrategica]:checkbox').is(':checked');
    $.ajax({
        url: url,
        type: 'post',
        assync: false,
        data: {
            dificuldade: dificuldade ? dificuldade : '',
            impacto: impacto ? impacto : '',
            descricao: descricao ? descricao : '',
            estrategica: estrategica ? 'on' : ''
        },
				success: function(dados){
				    if(dados['status']=='nok'){
							$.dialogs.error(dados['msg']);
						}
				},
				complete: esconderCarregando
    });
};

// Faz a validação das atribuições
function validar_atribuicao(tr, aptidao) {
    if (tr.find('td').length > 1) {
        tr.popover('destroy');
        var atribuicao = tr.find('[name*=descricao]').val();
        if (atribuicao.replace(/ /g, '') == '') {
            tr.removeClass('warning');
            tr.addClass('danger');
            tr.popover({
                placement: 'top',
                title: 'Atribuição Inválida',
                trigger: 'manual',
                content: "Atribuição é obrigatória"
            }).on('show.bs.popover', function() {
                $(this).addClass('popover-error');
            }).popover('show');
            return false;
        } else {
            tr.removeClass('danger');
        };
        return true;
    };
    return false;
};

var criar_acoes_automaticas = function() {
    $('#listagem :checkbox[name*=estrategica], #listagem select[name*=impacto], #listagem select[name*=dificuldade], #listagem textarea[name*=descricao]').die('change');
    $('#listagem :checkbox[name*=estrategica], #listagem select[name*=impacto], #listagem select[name*=dificuldade], #listagem textarea[name*=descricao]').live('change', function(e) {
        if (this.tagName == 'SELECT') {
            // Ajustes para o type select
            $(this.options).not(this.options[this.options.selectedIndex]).removeAttr('selected');
            $(this.options[this.options.selectedIndex]).prop('selected', true).attr('selected', 'selected');
        };
        if (validar_atribuicao($(this).closest('tr'))) {
            atualizar_atribuicao($(this).closest('tr'));
        }
    });
    $('#listagem :checkbox[name*=estrategica]').live('click', function(e) {
        if (this.tagName == 'SELECT') {
            // Ajustes para o type select
            $(this.options).not(this.options[this.options.selectedIndex]).removeAttr('selected');
            $(this.options[this.options.selectedIndex]).prop('selected', true).attr('selected', 'selected');
        };
        if (validar_atribuicao($(this).closest('tr'))) {
            atualizar_atribuicao($(this).closest('tr'));
        }
    });

    $('a.excluir').die('click');
    $('a.excluir').live("click", function() {
        excluir_atribuicao($(this).attr('data-funcao-ct-id'));
    });

};

var recarregar_listagem = function() {
    $('#listagem').djflexgrid({
        url: URL_LISTAGEM,
        completeLoad: function() {
            $('input[type=checkbox]').unbind('click.checks').bind('click.checks', function(e) {
                $(this).val($(this).is(':checked'));
            });
            if (usa_mapa == "true") {
                $('a.ver_tec').die('click');
                $('a.ver_tec').live('click', function() {
                    abrir_cts_atrib($(this).attr("data-funcao-ct-id"));
                });
            } else {
                $('a.ver_tec').hide();
            }
        }
    });
};

// Inicialização
$(function() {

    /*$('input[type=checkbox]').bind('click.checks').unbind('click.checks', function(e){
        $(this).attr('checked', $(this).is(':checked'));
    });*/

    // Recarregar Flexgrids
    recarregar_listagem();

    // Ações dos botões, e salvamento automatico.
    criar_acoes_automaticas();

    // Conclusão
    $('.concluir').on('click', function() {
        // -- Não deixa concluir senão tiver pelo menos uma
        if ($("#listagem .ajax_list_row").length == 0) {
            $.dialogs.error('É necessário pelo menos uma atribuição para concluir as edições.');
            return;
        } else {
            $.dialogs.confirm('Você realmente deseja concluir?', function() {
                $("#form_atrib_gerenciamento").submit();
            });
        }
    });

    // Adicionar Atribuição
    $('.add-atrib').live('click', function() {
        $('.dialog-add-atrib').dialog({
            modal: true,
            hide: 'fade',
            show: 'fade',
            ace_theme: true,
            buttons: {},
            close: function() {
                $(this).dialog('close').dialog('destroy');
            },
            buttons: {
                s: { // Botão Adicionar
                    click: function() {
                        salvar_atrib($(this));
                    },
                    'class': 'btn btn-xs btn-success pull-right',
                    text: 'Adicionar'
                }
            },
            open: function() {
                get_atribuicoes($(this));
            },
            title: 'Adicionar Atribuição',
            width: '80%'
        });
    });

    // Movimentação de atribuições
    $('a.mover').die('click');
    $('a.mover').live('click', function() {
        var button = $(this);
        var tr = button.closest('tr');
        var table = tr.closest('table');
        var msg = 'Para mover as atribuições basta arrastá-las conforme for desejado o posicionamento.  ';
        $.dialogs.warning(msg, function() {
            $(table).sortable({
                handle: tr,
                items: 'tbody > tr',
                revert: true,
                update: function() {
                    atualiza_ordem();
                    $(table).sortable('destroy');
                }
            });
        });
    });


    // Listagem das CTS
    if (usa_mapa == "true") {
        $('a.ver_tec').die('click');
        $('a.ver_tec').live('click', function() {
            abrir_cts_atrib($(this).attr("data-funcao-ct-id"));
        });
    } else {
        $('a.ver_tec').hide();
    }

});
