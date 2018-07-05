//-- Geral


var botao_edicao = function() {
    $('#id_editar_descricao').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_descricao').editable('toggle');
    });
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

var botao_edicao_data_inicio = function() {
    $("#id_editar_dt_inicio_format").parent("h5").append($("#div_edit_dt_inicio"));
    $('#id_editar_dt_inicio_format').click(function(e) {
        e.stopPropagation();
        $("#div_edit_dt_inicio").show();
    });
    $('#btn_cancelar_dt_inicio').click(function(e) {
        $("#id_data_inicio").val($("#txt_dt_inicio_label").html());
        $("#div_edit_dt_inicio").hide();
    });
    $("#btn_salvar_dt_inicio").click(function(e) {
        mostrarCarregando();
        var data_inicio = $('#id_data_inicio').val();
        $.post(URL_SALVAR_DT_INICIO, {
            'value': data_inicio,
            'pk': ID_TURMA
        }).done(function(retorno) {
            $("#id_lbl_dt_inicio_format").html($('#id_data_inicio').val());
            $("#div_edit_dt_inicio").hide();
            return false;
        }).complete(function(data) {
            esconderCarregando();
        });
        return false;
    });
};

var botao_edicao_status = function() {
    $("#id_editar_status").parent("h5").append($("#div_edit_status"));
    $('#id_editar_status').click(function(e) {
        e.stopPropagation();
        $("#div_edit_status").show();
    });
    $('#btn_cancelar_status').click(function(e) {
        $('#id_status').val("");
        $("#div_edit_status_cancel").hide();
        $("#div_lbl_status").html("");
        $("#id_data_cancelamento").val("");
        $("#id_motivo_cancelamento").val("");
        $("#div_edit_status").hide();
    });
    $('#id_status').change(function() {
        var opcao = $('#id_status option:selected');
        if (opcao.attr("data-value") == "cancelamento") {
            $("#div_edit_status_cancel").show();
            $("#div_lbl_status").html(opcao.html());
        } else {
            $("#div_edit_status_cancel").hide();
            $("#div_lbl_status").html("");
        }
        $("#id_data_cancelamento").val("");
        $("#id_motivo_cancelamento").val("");
    });
    $('#btn_salvar_status').click(abrir_status_turma);
};

var abrir_status_turma = function() {
    if (!$('#id_status').val()) {
        $.dialogs.error("É necessário preencher o status.");
        return false;
    }
    var tipo_cancelamento = $('#id_status option:checked').attr("data-value") == "cancelamento";
    var status = $('#id_status').val();
    var data_cancelamento = $("#id_data_cancelamento").val();
    var motivo_cancelamento = $("#id_motivo_cancelamento").val();

    if (tipo_cancelamento) {
        if (data_cancelamento == "" || motivo_cancelamento == "") {
            $.dialogs.error("É necessário preencher os dados de Motivo/ Data de Cancelamento.")
        } else {
            mostrarCarregando();
            $.post(URL_SALVAR_STATUS, {
                'pk': ID_TURMA,
                'value': status,
                'data_cancelamento': data_cancelamento,
                'motivo_cancelamento': motivo_cancelamento,
                'tipo': "cancelamento"
            }).done(function(retorno) {
                $.dialogs.success("Turma Cancelada com sucesso.", function() {
                    window.location.href = URL_CADASTRO + ID_TURMA + '/';
                });
            }).complete(function(data) {
                esconderCarregando();
            });
            return false;
        }
    } else {
        mostrarCarregando();
        $.post(URL_SALVAR_STATUS, {
            'pk': ID_TURMA,
            'value': status,
            'tipo': "normal"
        }).done(function(retorno) {
            $("#id_lbl_status").html($('#id_status option:checked').html());
            $("#div_edit_status").hide();
            $("#id_status").val("");
            $.dialogs.success("Status da Turma alterado com sucesso.");
        }).complete(function(data) {
            esconderCarregando();
        });
        return false;
    }
    return false;
};

var salvar_especificacao = function() {
    var form = serializaForm('#formulario_especificacao');
    $.post(URL_SALVAR_ESPECIFICACAO, form)
        .done(function(data) {
            $.dialogs.success('Especificação salva com sucesso.');
        });
};


//-- Facilitadores


var carregar_facilitadores = function() {
    listagem_Geral('listagem_facilitadores', URL_FACILITADORES);
};

var salvar_facilitadores = function() {
    mostrarCarregando();
    disable_btn("cadastrar_facilitadores");
    if (!$('#cadastrar_facilitadores').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_facilitadores");
        return false;
    }
    var form = serializaForm('#cadastrar_facilitadores');
    form['id_turma'] = ID_TURMA;
    form['facilitadores'] = $("#id_facilitadores").val().join("|");
    $.post(URL_SALVAR_FACILITADOR, form)
        .done(function(data) {
            $.dialogs.success('Facilitador(es) salvo(s) com sucesso.');
            carregar_facilitadores();
            $("#cadastrar_facilitadores").html("");
            $('#cadastrar_facilitadores').hide();
            $('#cancelar_cadastro_facilitadores').hide();
            $('#novo_cadastro_facilitadores').show();
            $("#div_alerta_facilitadores").hide();
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_facilitadores");
        });
};

var excluir_Facilitador = function(element) {
    var id = $(element).attr('id').replace('excluir_facilitador_', '');
    excluir_Geral(id, URL_EXCLUIR_FACILITADOR, function(retorno) {
        carregar_facilitadores();
        if (parseInt(retorno["qtde"]) == 0) {
            $("#div_alerta_facilitadores").show();
        }
        $('#cancelar_cadastro_facilitadores').click();
    });
};


//-- Participantes


var carregar_participantes = function() {
    listagem_Geral('listagem_participantes', URL_PARTICIPANTES, atualizar_total_partic);
};

var abre_bloco = function(element) {
    var conteudo = $(element).attr('ref-content');
    location.hash = 'id_cont_participantes';
    $('.pill.active').removeClass('active');
    $(element).addClass('active');
    $('.bloco').addClass('hidden');
    $('#' + conteudo).removeClass('hidden');
};

var carregar_porsetor = function(element) {
    $("#list_colabs_para_add").html("");
    $("#id_setor").val("");
};

var carregar_porcolab = function(element) {
    $('#id_colaborador').on("keydown", function(event) {
        $("#id_colaborador").attr("id_elem", "");
    }).autocomplete({
        source: URL_AUTO_COLAB,
        minLength: 2,
        select: function(event, ui) {
            $("#id_colaborador").attr("id_elem", ui.item.id);
            $("#id_colaborador").val(ui.item.label);
            return false;
        }
    });
    $('#cadastrar_colab').parsley();
    $("#list_colabs_para_add").html("");
    $("#id_setor").val("");
};

var salvar_participantes_colab = function(e) {
    // Realza a validação dos dados, valida a quantidade de participantes e
    // tenta salvar o colaborador
    e.preventDefault();
    if (!$("#id_colaborador").val()) {
        $("#id_colaborador").attr("id_elem", "");
    }
    if (!$("#id_colaborador").attr("id_elem")) {
        $("#id_colaborador").val("");
    }
    disable_btn_id("submit_form_colab");
    if (!$('#cadastrar_colab').parsley().isValid()) {
        enable_btn_id("submit_form_colab");
        return false;
    } else {

        var qtde = 1;
        var total_p = parseInt($("#id_total_participantes").val());
        var total_v = parseInt($("#id_qtde_part").val());

        if (total_p + qtde >= total_v) {
            $.dialogs.confirm(
                "O número de participantes supera a quantidade de vagas cadastrada, tem certeza que deseja incluir este novo participante?",
                validar_mais_de_uma_turma
            );
        } else {
            validar_mais_de_uma_turma();
        }

    }
    return false;
};

var validar_mais_de_uma_turma = function() {
    // Valida se o colaborador esta em outra turma do mesmo programa de treinamento
    $.post(URL_VALIDAR_MAIS_DE_UMA_TURMA, {
        'treinamento_id': ID_TREINAMENTO,
        'colab_id': $("#id_colaborador").attr("id_elem"),
    }).done(function(data) {
        if (data['existe'] == 's') {
            $.dialogs.confirm(
                "O colaborador já está participando de outra turma desse treinamento, deseja prosseguir mesmo assim?",
                __salvar_participantes_colab
            );
        } else {
            __salvar_participantes_colab();
        }
    });
};

var __salvar_participantes_colab = function() {
    // Realiza o salvamento do participante de forma individual
    $.post(URL_SALVAR_PARTICIPANTE, {
        'turma_id': ID_TURMA,
        'treinamento_id': ID_TREINAMENTO,
        'id_colab': $("#id_colaborador").attr("id_elem"),
        'origem_inscricao': $("#id_origem").val()
    }).done(function(retorno) {
        $.dialogs.success("Participante cadastrado com sucesso.");
        carregar_participantes();
        $('#id_colaborador').val("");
        $('#id_origem').val("");
        $("#id_colaborador").attr("id_elem", "");
        $("#id_setor").val("");
        enable_btn_id("submit_form_colab");
    });
};

var change_setor = function() {
    if ($(this).val() != '') {
        $('#label_colabs_para_add, #btns_colabs_para_add').show();
        $("#list_colabs_para_add").html("");
        $.post(URL_AUTO_COLAB_SETOR, {
            'turma_id': ID_TURMA,
            'setor_id': $("#id_setor").val(),
        }).done(function(retorno) {

            $("#list_colabs_para_add").html(retorno["html"]);

            $("#list_colabs_para_add .form-group").removeClass("form-group");

            $("[name='participante_all']").change(function() {
                if ($(this).is(":checked")) {
                    $(".cke_participantes").attr("checked", "checked");
                } else {
                    $(".cke_participantes").removeAttr("checked");
                }
                $(".cke_participantes").change();
            });

            $(".cke_participantes").change(function() {
                var id_p = $(this).attr("id").replace("check_", "");
                console.log("#td_origem_" + id_p + " select");
                if ($(this).is(":checked")) {
                    $("#td_origem_" + id_p + " select").removeAttr("disabled");
                } else {
                    //$("#td_origem_"+id_p+" select").val("");
                    $("#td_origem_" + id_p + " select").attr("disabled", "disabled");
                }
            });
        });
    } else {
        $('#label_colabs_para_add, #btns_colabs_para_add').hide();
        $("#list_colabs_para_add").html("");
    }
};

var __salvar_participantes_setor = function() {
    mostrarCarregando();
    $.post(URL_SALVAR_PARTICIPANTE, {
        'turma_id': ID_TURMA,
        'dados': selecionados,
        'funcao_id': $("#id_setor").val()
    }).done(function(retorno) {
        esconderCarregando();
        $.dialogs.success("Participante(s) cadastrado(s) com sucesso.");
        carregar_participantes();
        $('#label_colabs_para_add, #btns_colabs_para_add').hide();
        $("#list_colabs_para_add").html("");
        $("#id_setor").val("");
        enable_btn_id("adicionar_colabs_setor");
        atualizar_total_partic();
    });

};

var salvar_participantes_setor = function() {
    $("tr").removeClass("danger");
    selecionados = []
    $(".cke_participantes:checked").each(function(idx, value) {
        var id_p = $(value).attr("id").replace("check_", "");
        var origem = $("#td_origem_" + id_p + " select").val();
        if (!origem) {
            $("[cache-id='" + id_p + "']").addClass("danger");
        } else {
            selecionados.push(id_p + ";" + origem);
        }
    });
    disable_btn_id("adicionar_colabs_setor");
    if ($(".danger").length) {
        $.dialogs.error("As linhas em vermelho estão preenchidas de maneira incorreta. A origem é obrigatória para todos os colaboradores selecionados.");
        enable_btn_id("adicionar_colabs_setor");
        return false;
    } else if (selecionados.length == 0) {
        $.dialogs.error("É necessário escolher pelo menos um colaborador.");
        enable_btn_id("adicionar_colabs_setor");
        return false;
    } else {
        var qtde = selecionados.length;
        selecionados = selecionados.join("|");

        var total_p = parseInt($("#id_total_participantes").val());
        var total_v = parseInt($("#id_qtde_part").val());
        if (total_p + qtde >= total_v) {
            $.dialogs.confirm(
                "O número de participantes supera a quantidade de vagas cadastrada, tem certeza que deseja incluir este(s) novo(s) participante(s)?",
                validar_mais_de_uma_turma_setor,
                function() {
                    enable_btn_id("adicionar_colabs_setor");
                }
            );
        } else {
            validar_mais_de_uma_turma_setor();
        }

    }
    return false;
};

var validar_mais_de_uma_turma_setor = function() {
    // Valida se os colaboradores estão em outra turma do mesmo programa de treinamento
    mostrarCarregando();
    $.post(URL_VALIDAR_MAIS_DE_UMA_TURMA_SETOR, {
        'treinamento_id': ID_TREINAMENTO,
        'dados': selecionados,
        'funcao_id': $("#id_setor").val()
    }).done(function(data) {
        esconderCarregando();
        if (data['nomes'].length > 0) {
            var lista_nomes = '';
            for (nome in data['nomes']) {
                lista_nomes += '- ' + data['nomes'][nome] + '<br>';
            }
            $.dialogs.confirm(
                "O(s) colaborador(es) abaixo já participa(m) de outra turma desse treinamento. Deseja prosseguir mesmo assim?<br><br>" + lista_nomes,
                __salvar_participantes_setor,
                function() {
                    enable_btn_id("adicionar_colabs_setor");
                }
            );
        } else {
            __salvar_participantes_setor();
        }
        enable_btn_id("adicionar_colabs_setor");
    });
};

var atualizar_total_partic = function() {
    $.post(URL_QTDE_PARTICIPANTES, {})
    .done(function(data) {
          $("#id_total_participantes").val(data['qtde']);
    });
};

var excluir_Participante = function(element) {
    var id = $(element).attr('id').replace('excluir_participante_', '');
    excluir_Geral(id, URL_EXCLUIR_PARTICIPANTE, function(retorno) {
        $('#btn_cancelar_nota_participante').click();
        carregar_participantes();
        atualizar_total_partic();
    }, 'Participante excluído com sucesso');
};

var abrir_nota_participante = function(element) {
    $('#btn_adicionar_nota_participante').attr('data-pk', $(element).attr('data_pk'));
    $('#id_nota_participante').val($(element).attr('nota_atual').replace(".", ","));
    $('#id_nome_participante_nota').html($(element).attr('nome'));
    $('.div_nota_participante').show();
    $('#form_nota_colab').parsley();
};

var cancelar_nota_Participante = function(element) {
    $('#btn_adicionar_nota_participante').attr('data-pk', "");
    $('#id_nota_participante').val("");
    $('#id_nome_participante_nota').html("");
    $('.div_nota_participante').hide();
};

var adicionar_nota_Participante = function() {
    element = $("#btn_adicionar_nota_participante");
    mostrarCarregando();
    disable_btn_id("btn_adicionar_nota_participante");
    if (!$('#form_nota_colab').parsley().isValid()) {
        esconderCarregando();
        enable_btn_id("btn_adicionar_nota_participante");
        return false;
    }
    $.post(URL_ADICIONAR_NOTA_PARTICIPANTE, {
        id: $(element).attr('data-pk'),
        nota: $('#id_nota_participante').val()
    }).done(function(data) {
        $.dialogs.success('Nota salva com sucesso.');
        carregar_participantes();
        $('.div_nota_participante').hide();
        $('#id_input_nota_participante').val('');
    }).complete(function() {
        esconderCarregando();
        enable_btn_id("btn_adicionar_nota_participante");
    });
};


//-- Despesas


var carregar_despesas = function() {
    listagem_Geral('listagem_despesas', URL_DESPESAS);
};

var _editar_Despesas = function(url) {
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
}

var editar_Despesas = function(element) {
    var id = $(element).attr('id').replace('editar_despesa_', '');
    var url = URL_GET_DESPESA + '&id=' + id;
    _editar_Despesas(url);
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
    if (multiplicador == '' || parseFloat(multiplicador) == 0.00) {
        $('#id_quantidade').val('1');
        multiplicador = 1;
    }
    var multiplicando = $('#id_despesa option:selected ').attr('data-value')
    if (multiplicando != undefined) {
        multiplicando = multiplicando.replace(',', '.');
    }
    if (multiplicando == 'None' || multiplicando == undefined) {
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
    var form = serializaForm('#cadastrar_despesas');
    form['id'] = $('#id_despesa_id').val();
    form['id_turma'] = ID_TURMA;

    var quantd = $('#id_quantidade').val().replace(',', '.');
    if (quantd == '' || parseFloat(quantd) == 0.00) {
        $('#id_quantidade').val('1');
        form['quantidade'] = 1;
    }

    var url = URL_SALVAR_DESPESA;
    $.post(URL_SALVAR_DESPESA, form)
        .done(function(data) {
            $.dialogs.success('Despesa salva com sucesso.');
            carregar_despesas();
            $("#cadastrar_despesas").html("");
            $('#cadastrar_despesas').hide();
            $('#cancelar_cadastro_despesas').hide();
            $('#novo_cadastro_despesas').show();
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_despesas");
        });
};

var excluir_Despesa = function(element) {
    var id = $(element).attr('id').replace('excluir_despesa_', '');
    excluir_Geral(id, URL_EXCLUIR_DESPESA, function(retorno) {
        carregar_despesas();
    });
};


//-- Ausências


var carregar_ausencias = function() {
    listagem_Geral('listagem_ausencias', URL_AUSENCIAS);
};

var _editar_Ausencia = function(url) {
    $.get(url)
        .done(function(data) {
            $("#cadastrar_ausencias").html(data["html"]);
            $('#cadastrar_ausencias').parsley();
            $('#cadastrar_ausencias').show();
            $('#cancelar_cadastro_ausencias').show();
            $('#novo_cadastro_ausencias').hide();
            make_datepicker("#id_data_ausencia");
        });
}

var editar_Ausencias = function(element) {
    var id = $(element).attr('id').replace('editar_ausencia_', '');
    var url = URL_GET_AUSENCIAS + '&id=' + id;
    _editar_Ausencia(url);
};

var salvar_ausencia = function() {
    mostrarCarregando();
    disable_btn("cadastrar_ausencias");
    if (!$('#cadastrar_ausencias').parsley().isValid()) {
        esconderCarregando();
        enable_btn("cadastrar_ausencias");
        return false;
    }
    if (parseFloat($("#periodo_ausencia").val().replace(",", ".")) == 0) {
        $.dialogs.error('Ausência não pode ter Período de Ausência igual a zero.');
        esconderCarregando();
        enable_btn("cadastrar_ausencias");
        return false;
    }
    var form = serializaForm('#cadastrar_ausencias');
    form['id'] = $('#id_ausencia').val();
    form['id_turma'] = ID_TURMA;
    $.post(URL_SALVAR_AUSENCIAS, form)
        .done(function(data) {
            $.dialogs.success('Ausência salva com sucesso.');
            carregar_ausencias();
            $("#cadastrar_ausencias").html("");
            $('#cadastrar_ausencias').hide();
            $('#cancelar_cadastro_ausencias').hide();
            $('#novo_cadastro_ausencias').show();
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_ausencias");
        });
};

var excluir_Ausencia = function(element) {
    var id = $(element).attr('id').replace('excluir_ausencia_', '');
    excluir_Geral(id, URL_EXCLUIR_AUSENCIAS, function(retorno) {
        carregar_ausencias();
    });
};





function somenteNumeros(num) {
    var er = /[^0-9.]{6}/;
    er.lastIndex = 0;
    var campo = num;
    if (er.test(campo.value)) {
        campo.value = "";
    }
}




$(function() {

    ireport = $.iReport({
        usa_porta: false,
        url_name: URL_RPT0082
    });
    ireport.defaults['url_name'] = URL_RPT0082;

    $("#nova_turma").insertAfter($(".page-header h1"));
    $("#nova_turma").wrap("<div class='pull-right'> </div>");
    $("#nova_turma").show();

    $('.div_nota_participante').hide();

    $('#nova_turma').click(function() {
        mostrarCarregando();
        window.location.href = URL_CADASTRO + MENU_PREFIX;
    });

    $('#encerrar_turma').click(function() {
        mostrarCarregando();
        window.location.href = URL_ENCERRAMENTO + MENU_PREFIX;
    });
    $("#encerrar_turma").insertAfter($(".page-header h1"));
    $("#encerrar_turma").wrap("<div class='pull-right'> </div>");
    $("#encerrar_turma").show();

    $('#bt_gerar').click(function() {});
    $("#bt_gerar").insertAfter($(".page-header h1"));
    $("#bt_gerar").wrap("<div class='pull-right'> </div>");
    $("#bt_gerar").show();

    botao_edicao();
    botao_edicao_status();
    botao_edicao_data_inicio();


    //-- Geral:

    if (location.hash) {
        abas = {
            '#id_cont_especificacao': ['#id_tab_especificacao', function() {}],
            '#id_cont_facilitadores': ['#id_tab_facilitadores', carregar_facilitadores],
            '#id_cont_participantes': ['#id_tab_participantes', carregar_participantes],
            '#id_cont_despesas': ['#id_tab_despesas', carregar_despesas],
            '#id_cont_ausencias': ['#id_tab_ausencias', carregar_ausencias],
        };
        monta_hash_aba(abas);
    }

    $('.aba_func').click(abre_aba);


    $('.pill').click(function(e) {
        e.preventDefault();
        abre_bloco(this);
    });

    $('#pill_setor').click(carregar_porsetor);

    $('#pill_colab').click(carregar_porcolab);


    //-- Informações:

    $('#form_nota_colab').submit(function(event) {
        event.preventDefault();
        adicionar_nota_Participante()
    });

    $('#formulario_especificacao').submit(function(event) {
        event.preventDefault();
        salvar_especificacao()
    });

    //-- Participantes:

    $('#id_tab_facilitadores').click(function() {
        carregar_facilitadores();
    });

    $('#novo_cadastro_facilitadores').click(function() {
        $.get(URL_GET_FACILITADOR)
            .done(function(data) {
                $("#cadastrar_facilitadores").html(data["html"]);
                $('#cadastrar_facilitadores').parsley();
                $('#cadastrar_facilitadores').show();
                $('#cancelar_cadastro_facilitadores').show();
                $('#novo_cadastro_facilitadores').hide();
            });
    });

    $('#cancelar_cadastro_facilitadores').click(function() {
        $("#cadastrar_facilitadores").html("");
        $('#cadastrar_facilitadores').hide();
        $('#cancelar_cadastro_facilitadores').hide();
        $('#novo_cadastro_facilitadores').show();
    });

    $('#cadastrar_facilitadores').submit(function(event) {
        event.preventDefault();
        salvar_facilitadores();
    });


    //-- Participantes:

    $('#id_tab_participantes').click(function() {
        carregar_participantes();
    });

    $("#cadastrar_colab").submit(salvar_participantes_colab);
    $('#adicionar_colabs_setor').click(salvar_participantes_setor);

    $('#label_colabs_para_add, #btns_colabs_para_add').hide();
    $("#id_setor").change(change_setor);

    $('#cancelar_add_participantes').click(function() {
        $("#list_colabs_para_add").html("");
        $('.pill.active').removeClass('active');
        $('.bloco').addClass('hidden');
        $('#id_setor').val("");
        $('#label_colabs_para_add, #btns_colabs_para_add').hide();
    });


    //-- Despesas:

    $('#id_tab_despesas').click(function() {
        carregar_despesas();
    });

    $('#novo_cadastro_despesas').click(function() {
        var url = URL_GET_DESPESA;
        _editar_Despesas(url);
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


    //-- Ausencia:

    $('#cadastrar_ausencias').submit(function(event) {
        event.preventDefault();
        salvar_ausencia()
    });


    $('#id_tab_ausencias').click(function() {
        carregar_ausencias();
    });

    $('#novo_cadastro_ausencias').click(function() {
        _editar_Ausencia(URL_GET_AUSENCIAS);
    });

    $('#cancelar_cadastro_ausencias').click(function() {
        $("#cadastrar_ausencias").html("");
        $('#cadastrar_ausencias').hide();
        $('#cancelar_cadastro_ausencias').hide();
        $('#novo_cadastro_ausencias').show();
    });



});
