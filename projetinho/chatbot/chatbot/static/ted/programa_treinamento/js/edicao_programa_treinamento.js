//-- Geral

var salva_descricao = function() {
    $('#id_lbl_descricao').editable({
        url: URL_SALVAR_DESCRICAO,
        title: 'Entre com uma descrição',
        error: function(response, newValue) {
            return response.responseText;
        },
        validate: function(value) {
            if ($.trim(value) == '') {
                return 'Este campo é obrigatório.';
            }
        }
    });
};

var botao_edicao = function() {
    $('#id_editar_descricao').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_descricao').editable('toggle');
    });
};

var salva_tipo_treinamento = function() {
    $('#id_lbl_tipo_treinamento').editable({
        url: URL_SALVAR_TIPO_TREINAMENTO,
        title: 'Escolha o Tipo de Treinamento',
        source: TIPO_TREINAMENTO_SOURCE,
        error: function(response, newValue) {
            return response.responseText;
        },
        validate: function(value) {
            if ($.trim(value) == '') {
                return 'Este campo é obrigatório.';
            }
        }
    });
};

var botao_edicao_tipo_treinamento = function() {
    $('#id_editar_tipo_treinamento').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_tipo_treinamento').editable('toggle');
    });
};

var salvar_informacoes = function() {
    disable_btn("formulario_informacoes");
    if (!$('#formulario_informacoes').parsley().isValid()) {
        enable_btn("formulario_informacoes");
        return false;
    }
    var form = serializaForm('#formulario_informacoes');
    form['carga_horaria'] = form['carga_horaria'].replace(',', '.');
    $.post(URL_SALVAR_INFOS, form)
        .done(function(data) {
            $.dialogs.success('Informações salvas com sucesso.');
            enable_btn("formulario_informacoes");
        });
};

var salvar_estrutura = function() {
    disable_btn("formulario_estrutura");
    if (!$('#formulario_estrutura').parsley().isValid()) {
        enable_btn("formulario_estrutura");
        return false;
    }
    var form = serializaForm('#formulario_estrutura');
    $.post(URL_SALVAR_ESTRT, form)
        .done(function(data) {
            $.dialogs.success('Infra-estrutura salva com sucesso.');
            enable_btn("formulario_estrutura");
        });
};

//-- Recursos

var abre_bloco = function(element) {
    var conteudo = $(element).attr('ref-content');
    location.hash = 'id_cont_recursos_treinamento';
    $('.pill.active').removeClass('active');
    $(element).addClass('active');
    $('.bloco').addClass('hidden');
    $('#' + conteudo).removeClass('hidden');
    $('#listagem_comp_tec').empty();
    $('#listagem_comp_tec').empty();
};

//-- Competências Técnicas

var carregar_ct = function() {
    listagem_Geral('listagem_comp_tec', URL_CT);
};

var carrega_cadastro_ct = function() {
    $.get(URL_GET_CT)
        .done(function(data) {
            $('#cadastrar_comp_tec').html(data.html);
            $('#novo_cadastro_comp_tec').hide();
            $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').show();
            $('#comp_tec').autocomplete({
                source: URL_AUTO_CT,
                minLength: 2,
                select: carrega_selects_ct,
            });
            $('#cadastrar_comp_tec').parsley();
        });
};

var carrega_selects_ct = function() {
    window.setTimeout(function() {
        var ct = $('#comp_tec').val();
        $.get(URL_GET_LABELS_CT + '?ct=' + ct)
            .done(function(data) {
                var html = '';
                for (var item in data) {
                    html += '<option value=' + data[item][0] + '>' + data[item][1] + '</option>';
                }
                $('#nv_min_tec').empty().append(html);
                $('#nv_max_tec').empty().append(html);
                $('#nv_objetivo_tec').empty().append(html);
                configurar_selects_inicio_fim(
                    '#nv_max_tec', '#nv_min_tec',
                    'O Nível Mínimo não deve ser maior que o Nível Máximo.',
                    'O Nível Máximo não deve ser menor que o Nível Mínimo.'
                );
                configurar_selects_inicio_fim(
                    '#nv_objetivo_tec', '#nv_max_tec',
                    'O Nível Máximo não deve ser maior que o Objetivo.',
                    'O Objetivo não deve ser menor que o Nível Máximo.'
                );
            });
    }, 10)
};

var salvar_ct = function() {
    mostrarCarregando();
    disable_btn("cadastrar_comp_tec");
    if (!$('#cadastrar_comp_tec').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_comp_tec");
        return false;
    }
    var form = serializaForm('#cadastrar_comp_tec');
    form['id_programa'] = ID_PROGRAMA;
    $.post(URL_SALVAR_CT, form)
        .done(function(data) {
            $.dialogs.success('Recurso de Aprendizagem salvo com sucesso.');
            carregar_ct();
            $('#novo_cadastro_comp_tec').show();
            $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').hide();
            enable_btn("cadastrar_comp_tec");
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_comp_tec");
        });
};

var excluir_TreinamentoCT = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CT, function(retorno) {
        carregar_ct();
        $('#cancelar_cadastro_comp_tec').click();
    });
};

//-- Competências Comportamentais

var carregar_cc = function() {
    listagem_Geral('listagem_comp_comp', URL_CC);
};

var carregar_cadastro_cc = function() {
    // Carrega a lista de ccs para adição
    $.get(URL_CC_TABLIST)
        .done(function(data) {
            mostrarCarregando();
            $('#add_recursos').html(data.html);
            $('#add_recursos').show();
        })
        .success(function() {
            esconderCarregando();
        });

};

var carrega_cadastro_ccinds = function(element) {
    // Carrega os indicadores da cc aberta
    if (!$(element).attr('open')) {
        var id = $(element).attr('id');
        $.get(URL_CCIND_TABLIST + '&id_cc=' + id)
            .done(function(data) {
                var container = $(element).attr('href');
                $(element).attr('open', 'open');
                $(container).html(data.html);
            });
    }
};

var recurso_check_click = function(element) {
    // Evento de click do checkbos dos indicadores, habilita ou desabilita dos níveis
    if ($(element).is(':checked')) {
        $('#min_' + $(element).val()).removeAttr('disabled');
        $('#obj_' + $(element).val()).removeAttr('disabled');
    } else {
        $('#min_' + $(element).val()).prop('disabled', 'disabled');
        $('#obj_' + $(element).val()).prop('disabled', 'disabled');
    }
};

var verifica_cc_select = function(element) {
    // validação dos níveis escolhidos, executa no change dos niveis
    var element_obj = $(element).attr('id').split('_');
    if (element_obj[0] == 'min') {
        var minimo = $(element).val();
        var objetivo = $('#obj_' + element_obj[1]).val();
        if (objetivo != '' && minimo > objetivo) {
            $.dialogs.error('O Nível Mínimo não deve ser maior que o Objetivo.');
            $(element).val('');
            $('#obj_' + element_obj[1]).val('');
        }
    } else {
        var objetivo = $(element).val();
        var minimo = $('#min_' + element_obj[1]).val();
        if (minimo != '' && minimo > objetivo) {
            $.dialogs.error('O Objetivo não deve ser menor que o Nível Mínimo.');
            $(element).val('');
            $('#min_' + element_obj[1]).val('');
        }
    }

};

var verifica_cc_valido = function() {
    // Valida o preenchimento de tudo em geral, chamado ao salvar os recursos de cc
    var list_items = $("input:checkbox[name=recurso]:checked");
    var valido = true;
    for (var item = 0; item < list_items.length; item++) {
        var id = $(list_items[item]).val();
        var min = $('#min_' + id).val();
        var obj = $('#obj_' + id).val();
        if (min != '' && obj != '') {
            valido = true;
        } else {
            valido = false;
            var cc = $(list_items[item]).attr('data-comp');
            $('#panel_' + cc).addClass('panel-danger');
            $('#lineid_' + $(list_items[item]).val()).addClass('danger');
            break;
        }
    }

    return valido;

};

var adiciona_recursos_cc = function() {
    // Salva as competencias comportamentais
    mostrarCarregando();
    $('[name="adicionar_recursos"]').attr('disabled', true);
    var valido = verifica_cc_valido();
    if (valido) {
        if ($("input:checkbox[name=recurso]:checked").length == 0) {
            $.dialogs.error('Por favor, escolha ao menos um indicador.');
            esconderCarregando();
            $('[name="adicionar_recursos"]').removeAttr('disabled');
        } else {
            $("input:checkbox[name=recurso]:checked").each(function() {
                var min = $('#min_' + $(this).val()).val();
                var obj = $('#obj_' + $(this).val()).val();
                var cc = {
                    'ccind_id': $(this).val(),
                    'id_programa': $('#id_programa').val(),
                    'nv_min': min,
                    'nv_obj': obj
                };
                $.post(URL_SALVAR_CC, cc)
                    .done(function(data) {
                        carregar_cc();
                        $('#add_recursos').html('');
                        $('#cancelar_cadastro_comp_comp').hide();
                        $('#novo_cadastro_comp_comp').show();
                    }).complete(function(data) {
                        esconderCarregando();
                        $('[name="adicionar_recursos"]').removeAttr('disabled');
                    });
            });
        }
    } else {
        $.dialogs.error('Campo(s) preenchido(s) de forma incorreta.');
        esconderCarregando();
        $('[name="adicionar_recursos"]').removeAttr('disabled');
    }

};

var excluir_TreinamentoCC = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CC, function(retorno) {
        $('#cancelar_cadastro_comp_comp').click()
        carregar_cc();
    });
};

// Credenciados

var carregar_credenciados = function(do_after) {
    if (do_after == undefined) {
        completeLoad_do = completeLoad_listas
    } else {
        completeLoad_do = function() {
            completeLoad_listas(do_after);
        }
    }
    listagem_Geral(
        'listagem_credenciados',
        URL_CREDENCIADOS, '',
        completeLoad_do
    );
};

var _editar_Credenciado = function(url) {
    $.get(url)
        .done(function(data) {
            $("#cadastrar_credenciados").html(data["html"]);
            $('#cadastrar_credenciados').parsley();
            $('#cadastrar_credenciados').show();
            $('#cancelar_cadastro_credenciado').show();
            $('#novo_cadastro_credenciado').hide();
        });
};

var editar_Credenciado = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_CREDENCIADO + '&id=' + id;
    _editar_Credenciado(url);
};

var salvar_credenciados = function() {
    mostrarCarregando();
    disable_btn("cadastrar_credenciados");
    if (!$('#cadastrar_credenciados').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_credenciados");
        return false;
    }
    var id_programa = $('#id_programa').val();
    var form = serializaForm('#cadastrar_credenciados');
    form['id_programa'] = id_programa;
    form['carga_horaria'] = form['carga_horaria'].replace(',', '.');
    form['horas_dia'] = form['horas_dia'].replace(',', '.');
    form['investimento'] = form['investimento'].replace(',', '.');
    form['id_credenciado'] = $('#id_credenciado').val();
    $.post(URL_SALVAR_CREDENCIADO, form)
        .done(function(data) {
            $.dialogs.success('Credenciado salvo com sucesso');
            carregar_credenciados();
            $("#cadastrar_credenciados").html("");
            $('#cancelar_cadastro_credenciado').hide();
            $('#novo_cadastro_credenciado').show();

        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_credenciados");
        });
};

var excluir_Credenciado = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    pode_excluir_Credenciado(id, URL_PODE_EXCLUIR_CREDEN)
    $("#cancelar_cadastro_credenciado").click();
};

var pode_excluir_Credenciado = function(id, URL) {
    $.post(URL, { 'id': id  })
    .done(function(retorno) {
        if (retorno["status"]=="nok"){
            $.dialogs.error(retorno["msg"]);
        }
        if (retorno["status"]=="ok"){
            excluir_Geral(id, URL_EXCLUIR_CREDEN, function(retorno) {
                carregar_credenciados();
            });
        }
    });
};

var modal_facilitadores = function(element) {
    // Carrega a Tela de Facilitadores
    var nome = $(element).attr('nome');
    $("#span_credenciado").html(nome);
    var credenciado_id = $(element).attr('id').replace('inst_', '');
    $("#id_credenciado_facilitador").val(credenciado_id);
    $('#div_credenciados').hide();
    $('#div_facilitadores').show();
    carregar_facilitadores();
};

var voltar_credenciados = function(element) {
    // Volta para a tela de credenciados
    $('#div_credenciados').show();
    $('#div_facilitadores').hide();
    $("#span_credenciado").html("");
    $("#id_credenciado_facilitador").val("");
    $('#cancelar_cadastro_facilitador').click();
};

var carregar_facilitadores = function() {
    var id = $("#id_credenciado_facilitador").val();
    listagem_Geral(
        'listagem_facilitadores',
        URL_FACILITADOR + '&id_credenciado=' + id
    );
};

var salvar_facilitadores = function() {
    mostrarCarregando();
    disable_btn("cadastrar_facilitadores");
    if (!$('#cadastrar_facilitadores').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_facilitadores");
        return false;
    }
    var id_credenciado = $('#id_credenciado_facilitador').val();
    var form = serializaForm('#cadastrar_facilitadores');
    form['credenciado'] = id_credenciado;
    form['facilitadores'] = $("#id_facilitadores").val().join("|");
    $.post(URL_SALVAR_FACILITADOR, form)
        .done(function(data) {
            $.dialogs.success('Facilitador(es) salvo(s) com sucesso');
            carregar_facilitadores();
            $('#cadastrar_facilitadores').each(function() {
                this.reset();
            });
            $('#cancelar_cadastro_facilitador').click();
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_facilitadores");
        });
};

var excluir_FacilitadorTreinamento = function(element) {
    var inst_id = $("#id_facilitador_credenciado").val();
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_FACILI, function(retorno) {
        carregar_facilitadores(inst_id);
        $('#cancelar_cadastro_facilitador').click();
    });
};

// Calendario

var carregar_calendarios = function() {
    listagem_Geral('listagem_calendario', URL_CALENDARIOS);
};

var _editar_Calendario = function(url) {
    $.get(url)
        .done(function(data) {
            $("#cadastrar_calendario").html(data["html"]);
            make_datepicker("#id_data_inicio");
            $('#cadastrar_calendario').parsley();
            $('#cadastrar_calendario').show();
            $('#cancelar_cadastro_calendario').show();
            $('#novo_cadastro_calendario').hide();
        });
}

var editar_Calendario = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_CALENDARIO + '?id=' + id + "&id_programa=" + ID_PROGRAMA;
    _editar_Calendario(url);
};

var salvar_calendarios = function() {
    mostrarCarregando();
    disable_btn("cadastrar_calendario");
    if (!$('#cadastrar_calendario').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_calendario");
        return false;
    }
    var id_programa = $('#id_programa').val();
    var id = $('#id__calendario').val();
    var form = serializaForm('#cadastrar_calendario');
    form['id_programa'] = id_programa;
    var url = URL_SALVAR_CALEND;
    if (id.length > 0)
        url += id;
    $.post(url, form)
        .done(function(data) {
            $.dialogs.success('Calendário salvo com sucesso.');
            carregar_calendarios();
            $("#cadastrar_calendario").html("");
            $('#cadastrar_calendario').hide();
            $('#cancelar_cadastro_calendario').hide();
            $('#novo_cadastro_calendario').show();
            enable_btn("cadastrar_calendario");
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_calendario");
        });
};

var excluir_Calendario = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CALEND, function(retorno) {
        $('#cancelar_cadastro_calendario').click();
        carregar_calendarios();
    });
};

// Despesas

var carregar_despesas = function() {
    listagem_Geral('listagem_despesas', URL_DESPESAS);
};

var _editar_TreinamentoDespesas = function(url) {
    $.get(url)
        .done(function(data) {
            $("#cadastrar_despesas").html(data["html"]);
            $('#id_despesa').change(set_despesas);
            $('#id_quantidade').change(calcula_despesas);
            $('#cadastrar_despesas').parsley();
            $('#cadastrar_despesas').show();
            $('#cancelar_cadastro_despesas').show();
            $('#novo_cadastro_despesas').hide();
            set_despesas();
            var addon_button = '<span class="input-group-addon" title="Clique para adicionar este valor como Valor Previsto."><a href="#" id="link_to_previsto"><i class="glyphicon glyphicon-share-alt"></i></a></span>';
            $('#valor_sugerido').parent().append(addon_button);
            $('#link_to_previsto').click(function(e) {
                e.preventDefault();
                set_value_previsto();
            });
            $("[for='quantidade']").append($("#info_qtd_despesas"));
            $('#info_qtd_despesas').popover({
                placement: 'top',
                html: true
            });
        });
};

var editar_TreinamentoDespesas = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_DESPESA + '&id=' + id;
    _editar_TreinamentoDespesas(url);
};

var set_despesas = function() {
    var valor = $('#id_despesa option:selected ').attr('data-value');
    if ($('#id_quantidade').val().length > 0) {
        var resultado = $('#id_quantidade').val().replace(',', '.') * valor.replace(',', '.');
        $('#valor_sugerido').val(valor != 'None' ? parseFloat(resultado).toFixed(2).toString().replace('.', ',') : '');
    } else {
        $('#id_quantidade').val('1');
        $('#valor_sugerido').val(valor != 'None' ? valor : '');

    }
};

var set_value_previsto = function() {
    var value = $('#valor_sugerido').val();
    $('#id_valor_previsto').val(value);
}

var calcula_despesas = function() {
    var multiplicador = $('#id_quantidade').val().replace(',', '.');
    if (multiplicador=='' || parseFloat(multiplicador)==0.00){
      $('#id_quantidade').val('1');
      multiplicador = 1;
    }
    var multiplicando = $('#id_despesa option:selected ').attr('data-value')
    if (multiplicando!=undefined){
        multiplicando = multiplicando.replace(',', '.');
    }
    if (multiplicando=='None' || multiplicando==undefined){
        multiplicando = 0;
    }
    var resultado = multiplicando * multiplicador;
    $('#valor_sugerido').val(parseFloat(resultado).toFixed(2).toString().replace('.', ','));
};

var salvar_despesas = function() {
    mostrarCarregando();
    disable_btn("cadastrar_despesas");
    if (!$('#cadastrar_despesas').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_despesas");
        return false;
    }
    var id_programa = $('#id_programa').val();
    var form = serializaForm('#cadastrar_despesas');
    form['id_programa'] = id_programa;

    var quantd = $('#id_quantidade').val().replace(',', '.');
    if (quantd=='' || parseFloat(quantd)==0.00){
        $('#id_quantidade').val('1');
        form['quantidade'] = 1;
    }

    $.post(URL_SALVAR_DESPESA, form)
        .done(function(data) {
            $.dialogs.success('Despesa salva com sucesso.');
            carregar_despesas();
            $("#cadastrar_despesas").html("");
            $('#cadastrar_despesas').hide();
            $('#cancelar_cadastro_despesas').hide();
            $('#novo_cadastro_despesas').show();
            enable_btn("cadastrar_despesas");
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_despesas");
        });
};

var excluir_TreinamentoDespesas = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_DESPES, function(retorno) {
        carregar_despesas();
        $('#cancelar_cadastro_despesas').click();
    });
};

// PAT

var carregar_pat = function() {
    listagem_Geral('listagem_pat', URL_PAT + '&ano=' + $("#id_buscar_ano").val());
};

var salvar_pat = function() {
    mostrarCarregando();
    disable_btn("cadastrar_pat");
    if (!$('#cadastrar_pat').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_pat");
        return false;
    }
    var id_programa = $('#id_programa').val();
    var form = serializaForm('#cadastrar_pat');
    form['id_programa'] = id_programa;

    var id = $('#id_pat_id').val();
    var url = URL_SALVAR_PAT;
    if (id.length > 0) {
        url += +'&id=' + id;
        form['id'] = id;
    }
    $.post(url, form)
        .done(function(data) {
            $.dialogs.success('Plano Anual de Treinamento salvo com sucesso.');
            carregar_pat();
            $("#cadastrar_pat").html("");
            $('#cadastrar_pat').hide();
            $('#cancelar_cadastro_pat').hide();
            $('#novo_cadastro_pat').show();
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_pat");
        });
};

var _editar_TreinamentoPAT = function(url) {
    $.get(url)
        .done(function(data) {
            $("#cadastrar_pat").html(data["html"]);
            $('#cadastrar_pat').parsley();
            $('#cadastrar_pat').show();
            $('#cancelar_cadastro_pat').show();
            $('#novo_cadastro_pat').hide();
            make_monthyearpickers("#id_ano_mes");
        });
};

var editar_TreinamentoPAT = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_PAT + '&id=' + id;
    _editar_TreinamentoPAT(url);
};

var excluir_TreinamentoPAT = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_PAT, function(retorno) {
        carregar_pat();
        $('#cancelar_cadastro_pat').click();
    });
};


$(function() {


    //-- Geral:
    $('#novo_programa').click(function() {
        mostrarCarregando();
        window.location.href = URL_CADASTRO + MENU_PREFIX;
    });

    $("#novo_programa").insertAfter($(".page-header h1"));
    $("#novo_programa").wrap("<div class='pull-right'> </div>");
    $("#novo_programa").show();

    salva_descricao();
    botao_edicao();
    salva_tipo_treinamento();
    botao_edicao_tipo_treinamento();

    $('#formulario_programa').submit(function(event) {
        event.preventDefault();
        salva_programa();
    });

    if (location.hash) {
        abas = {
            '#id_cont_credenciados': ['#id_tab_credenciados', carregar_credenciados],
            '#id_cont_calendario': ['#id_tab_calendario', carregar_calendarios],
            '#id_cont_despesas': ['#id_tab_despesas', carregar_despesas],
            '#id_cont_pat': ['#id_tab_pat', carregar_pat],
            '#id_infra': ['#id_tab_infra', function() {}],
            '#id_cont_recursos_treinamento': ['#id_tab_recursos_treinamento', function() {
                $('#id_tab_recursos_treinamento').click();
            }],
        };
        monta_hash_aba(abas);
    }

    $('.aba_func').click(abre_aba);

    $('.pill').click(function(e) {
        e.preventDefault();
        abre_bloco(this);
    });


    //-- Informações:

    $('#formulario_informacoes').submit(function(event) {
        event.preventDefault();
        salvar_informacoes()
    });

    //-- Estrutura:

    $('#formulario_estrutura').submit(function(event) {
        event.preventDefault();
        salvar_estrutura();
    });

    //-- Recursos de Desenvolvimento:

    $('#pill_cc').click(carregar_cc);

    $('#pill_ct').click(carregar_ct);


    $('#cadastrar_comp_comp').submit(function(event) {
        event.preventDefault();
        salvar_cc();
    });

    $('#cadastrar_comp_tec').submit(function(event) {
        event.preventDefault();
        salvar_ct();
    });


    $('#novo_cadastro_comp_comp').click(function() {
        $('#add_recursos').html();
        $('#novo_cadastro_comp_comp').hide();
        $('#cancelar_cadastro_comp_comp').show();
        carregar_cadastro_cc();
    });

    $('#cancelar_cadastro_comp_comp').click(function() {
        $('#add_recursos').html('');
        $("#cancelar_cadastro_comp_comp").hide();
        $('#add_recursos').hide();
        $("#novo_cadastro_comp_comp").show();
    });

    $('#novo_cadastro_comp_tec').click(carrega_cadastro_ct);

    $('#cancelar_cadastro_comp_tec').click(function() {
        $('#cadastrar_comp_tec').html("");
        $('#novo_cadastro_comp_tec, #cadastrar_comp_tec').show();
        $('#cancelar_cadastro_comp_tec').hide();
    });

    //-- Credenciados:

    $('#cadastrar_credenciados').submit(function(event) {
        event.preventDefault();
        salvar_credenciados()
    });

    $('#id_tab_credenciados').click(function() {
        carregar_credenciados();
    });

    $('#novo_cadastro_credenciado').click(function() {
        var url = URL_GET_CREDENCIADO + "?id_programa=" + ID_PROGRAMA;
        _editar_Credenciado(url);
    });

    $('#cancelar_cadastro_credenciado').click(function() {
        $("#cadastrar_credenciados").html("");
        $('#cadastrar_credenciados').hide();
        $('#cancelar_cadastro_credenciado').hide();
        $('#novo_cadastro_credenciado').show();
    });

    $('#cadastrar_facilitadores').submit(function(event) {
        event.preventDefault();
        salvar_facilitadores();
    });

    $('#voltar_credenciados').click(function() {
        voltar_credenciados();
    });

    $('#novo_cadastro_facilitador').click(function() {
        var id = $("#id_credenciado_facilitador").val();
        var url = URL_GET_FACILITADOR + "&id_credenciado=" + id;
        $.get(url)
            .done(function(data) {
                $("#cadastrar_facilitadores").html(data["html"]);
                $('#cadastrar_facilitadores').parsley();
                $('#cadastrar_facilitadores').show();
                $('#cancelar_cadastro_facilitador').show();
                $('#novo_cadastro_facilitador').hide();
            });
    });

    $('#cancelar_cadastro_facilitador').click(function() {
        $("#cadastrar_facilitadores").html("");
        $('#cadastrar_facilitadores').hide();
        $('#cancelar_cadastro_facilitador').hide();
        $('#novo_cadastro_facilitador').show();
    });


    //-- Calendario:

    $('#id_tab_calendario').click(function() {
        carregar_calendarios();
    });

    $('#cadastrar_calendario').submit(function(event) {
        event.preventDefault();
        salvar_calendarios();
    });

    $('#cancelar_cadastro_calendario').click(function() {
        $("#cadastrar_calendario").html("");
        $('#cadastrar_calendario').hide();
        $('#cancelar_cadastro_calendario').hide();
        $('#novo_cadastro_calendario').show();
    });

    $('#novo_cadastro_calendario').click(function() {
        var url = URL_GET_CALENDARIO + "?id_programa=" + ID_PROGRAMA;
        _editar_Calendario(url);
    });


    //-- Despesas:

    $('#id_tab_despesas').click(function() {
        carregar_despesas();
    });

    $('#novo_cadastro_despesas').click(function() {
        var url = URL_GET_DESPESA + "?id_programa=" + ID_PROGRAMA;
        _editar_TreinamentoDespesas(url);
    });

    $('#cancelar_cadastro_despesas').click(function() {
        $("#cadastrar_despesas").html("");
        $('#cadastrar_despesas').hide();
        $('#cancelar_cadastro_despesas').hide();
        $('#novo_cadastro_despesas').show();
    });

    $('#cadastrar_despesas').submit(function(event) {
        event.preventDefault();
        salvar_despesas();
    });

    $('#nova_despesas').click(function() {
        mostrarCarregando();
        window.location.href = URL_CADASTRO + MENU_PREFIX;
    });

    //-- PAT:

    $('#id_tab_pat').click(function() {
        carregar_pat();
    });

    $('#novo_cadastro_pat').click(function() {
        var url = URL_GET_PAT + "?id_programa=" + ID_PROGRAMA;
        _editar_TreinamentoPAT(url);
    });

    $('#cancelar_cadastro_pat').click(function() {
        $("#cadastrar_pat").html("");
        $('#cadastrar_pat').hide();
        $('#cancelar_cadastro_pat').hide();
        $('#novo_cadastro_pat').show();
    });

    $('#cadastrar_pat').submit(function(event) {
        event.preventDefault();
        salvar_pat();
    });

    $('#nova_pat').click(function() {
        mostrarCarregando();
        window.location.href = URL_CADASTRO + MENU_PREFIX;
    });

    $("#id_buscar_ano").change(carregar_pat);

});
