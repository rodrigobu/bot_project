var valida_decimal_dft = function(valor) {
    if (valor == '') return true;
    var novo_valor = valor.replace('R$', '').replace('.', '').replace(',', '.');
    if (novo_valor != valor)
        valor = novo_valor;
    var x = /^[+-]?[0-9]{1,8}([,|.][0-9]{0,4}|)$/;
    if (!valor.match(x)) return false;
    return true;
};

var valida_em_branco_dft = function(valor) {
    valor = valor.replace(/ /g, '');
    if (valor == '') return true;
    return false;
};

var validacao_campos_dft = function() {
    if (isNaN($(this).val().replace(",", ""))) {
        $.dialogs.error("Valor inválido, apenas digitos são permitidos")
        $(this).val("");
    }
    if (!valida_decimal_dft($(this).val())) {
        $.dialogs.error("Valor inválido, precisa estar no formato 9999,9999")
        $(this).val("");
    }
}

function get_dft_ajax() {
    /* Gera a tabela do DFT */
    $('.hide_on_dft').addClass('hidden');
    $('.show_on_dft').removeClass('hidden');
    mostrarCarregando();
    start_timer();
    $.ajax({
        url: URL_GET_DFT_MAPA + SETOR_ID,
        dataType: 'json',
        type: 'get',
        data: {},
        success: function(data) {
            // Renderiza o Mapa/DFT
            map = new TableObject(mapa, data, context,
                URL_SALVAR_DFT + SETOR_ID,
                get_dft_ajax
            );
            map.render_all();
            esconderCarregando();
            /// -- O Componente do mapa não mostra o valor se for zero.
            // esse codigo é um ajuste para mostrar o zero, mesmo quando for zero.
            $.each($("[name='percentual_execucao']"), function(idx, value) {
                var valor = $(value).val();
                if (valor == "") {
                    $(value).val(0);
                    $(value).blur();
                }
            });

        },
        error: function(xhr, status, text) {
            $.dialogs.error("Houve um erro ao abrir o DFT");
            $('.show_on_map').show();
            $('.hide_on_dft').removeClass('hidden');
            $('.show_on_dft').addClass('hidden');
            esconderCarregando();
        }
    });
}

function retornar_dft() {
    /* Renderiza o DFT novamente, usado nas telas auxiliares do DFT */
    get_dft_ajax();
    $("#mapa-wrapper").show();
    $('#dialog-parametros_dft').addClass('hide');
    $('#dialog-resumo_dft').addClass('hide');
}

function oculta_dft() {
    /* Oculta a tela do DFT, usado nas telas auxiliares do DFT */
    $("#mapa-wrapper").hide();
}

function atualiza_analise_dft(valor) {
    ANALISE_DFT_TOTAL = valor;
    if (ANALISE_DFT_TOTAL) {
        $("#id_analise_dft_total[value='True']").click();
    } else {
        $("#id_analise_dft_total[value='False']").click();
    }
}

function get_dft_parametros(e) {
    /* Abre a Tela de Parâmetros do DFT*/
    e.preventDefault();
    $.ajax({
        url: URL_GET_PARAM_DFT + SETOR_ID,
        dataType: 'json',
        type: 'get',
        data: {},
        success: function(retorno) {
            oculta_dft();
            $('#dialog-parametros_dft').removeClass('hide');
            $("#body_cargos").html(retorno['html_cargos']);
            $("#id_horas_produtivas").val(retorno['horas_produtivas']);
            atualiza_analise_dft(retorno['analise_dft_total']);
        },
        error: function(xhr, status, text) {
            erro_att = xhr;
            $.dialogs.error("Houve um erro ao abrir os parâmetros do DFT.");
        },
    });
}

function corrigir_percentual_execucao(){
    var valor = $(this).val();
    if (isNaN(valor)) {
        valor = 0;
        $.dialogs.error("O Percentual de Execução Atual deve ser um número.");
    } else if (valor != "") {
        valor = parseInt(valor)
        if (valor > 100 || valor < 0) {
            valor = 0;
            $.dialogs.error("O Percentual de Execução Atual deve ser um número entre 0 e 100.");
        }
    } else {
        valor = 0;
    }
    $(this).val(valor);
}

function add_novo_cargo_dft(e) {
    /* Adiciona um novo formulário do dft */
    e.preventDefault();
    $.ajax({
        url: URL_GET_PARAM_DFT_CARGO + SETOR_ID,
        dataType: 'json',
        type: 'get',
        data: {},
        success: function(retorno) {
            $("#body_cargos").append(retorno['html_cargos']);
        },
    });
}

function cancelar_cargo_dft(e) {
    /* Remove o formulário de um cargo ainda não salvo */
    botao = $(e);
    $.dialogs.confirm("Confirmação",
        "Deseja realmente excluir o cargo ?",
        function() {
            botao.parent().parent().parent().remove();
        });
}

function excluir_cargo_dft(id) {
    /* Exclusão de cargo */
    $.dialogs.confirm("Confirmação",
        "Deseja realmente excluir o cargo ?",
        function() {
            $.ajax({
                url: URL_EXCLUIR_PARAM_DFT,
                dataType: 'json',
                type: 'get',
                data: {
                    'id': id,
                },
                success: function(retorno) {
                    $.dialogs.success(
                        "Cargo do DFT excluido com sucesso.",
                        function() {
                            $("tr[data-id='" + id + "']").remove();
                        }
                    );
                },
            });
        });
}

function valida_descricoes() {
    // Validação de duplicidade e preenchimento
    var descricoes_validas = true;
    var descricoes = [];
    $.each($("#table-nivel [name='descricao']"), function(idx, value) {
        descricoes.push($(value).val());
    });
    descricoes = descricoes.slice().sort();
    var results = [];
    for (var i = 0; i < descricoes.length - 1; i++) {
        if (descricoes[i + 1] == descricoes[i]) {
            results.push(descricoes[i]);
        }
        if (descricoes[i].replace(" ", "") == "") {
            descricoes_validas = false;
            break;
        }
    }
    if (!descricoes_validas) {
        $.dialogs.error("Existem descrições não preenchidas. Preencha todas para salvar.")
        return false;
    }
    if (results.length > 0) {
        $.dialogs.error("Não deve haver mais que um cargo com a mesma descrição.  <br/> Existem descrições duplicadas para o(s) seguinte(s) cargo(s): " + results.join(", ") + ".")
        return false;
    }
    return true;
}

function monta_cargo() {

    var tratar = function(elemento) {
        return elemento.val().replace(";;;", ";").replace("|", ",");
    }
    // Captura dos cargos
    cargos = [] // "id;;;descricao;;;quadro_atual;;;aposentadoria;;;detalhes|..."
    $.each($("#body_cargos tr"), function(idx, value) {
        linha = $(value).find("td");
        id = $(linha[0]).html();
        descricao = tratar($(linha[1]).find("input"));
        quadro_atual = tratar($(linha[2]).find("input"));
        aposentadoria = tratar($(linha[3]).find("input"));
        detalhes = tratar($(linha[4]).find("textarea"));
        lista = [id, descricao, quadro_atual, aposentadoria, detalhes].join(";;;")
        cargos.push(lista)
    });
    return cargos.join("|")
}

function salvar_dft_parametros(e) {
    e.preventDefault();
    if (valida_descricoes()) {
        $.ajax({
            url: URL_SALVAR_PARAM_DFT,
            dataType: 'json',
            type: 'post',
            data: {
                'setor_id': SETOR_ID,
                'horas_produtivas': $("#id_horas_produtivas").val(),
                'analise_dft_total': $("#id_analise_dft_total:checked").val(),
                'cargos': monta_cargo()
            },
            success: function(retorno) {
                $.dialogs.success(
                    "Parâmetros do DFT salvo com sucesso.",
                    function() {
                        retornar_dft();
                    }
                );
            },
        });
    }

}


function get_dft_resumo(e) {
    /* Abre a Tela de Resumo do DFT*/
    e.preventDefault();
    $.ajax({
        url: URL_GET_RESUMO_DFT + SETOR_ID,
        dataType: 'json',
        type: 'get',
        data: {},
        success: function(retorno) {
            oculta_dft();
            $('#dialog-resumo_dft').removeClass('hide');
            $("#body_cargos_resumo").html(retorno['html_cargos']);
            $("#id_justificativa_dft").val(retorno['justificativa_dft']);
            $("#id_oport_otimizacao_dft").val(retorno['oport_otimizacao_dft']);
        },
        error: function(xhr, status, text) {
            erro_att = xhr;
            $.dialogs.error("Houve um erro ao abrir o resumo do DFT.");
        },
    });
}

function salvar_dft_resumo(e){
    /* Salva os campos da Tela de Resumo do DFT*/
    e.preventDefault();
    $.ajax({
        url: URL_SALVAR_RESUMO_DFT,
        dataType: 'json',
        type: 'post',
        data: {
            'setor_id': SETOR_ID,
            'justificativa_dft': $("#id_justificativa_dft").val(),
            'oport_otimizacao_dft': $("#id_oport_otimizacao_dft").val(),
        },
        success: function(retorno) {
            $.dialogs.success("Os campos foram salvos com sucesso.");
        },
    });
}


function abrir_totalizacao_dft(id_cargo){
    /* Abre a Tela de Edição do Cargo do Resumo do DFT*/
    $.ajax({
        url: URL_GET_RESUMO_DFT_CARGO,
        dataType: 'json',
        type: 'get',
        data: {
          'id_cargo':id_cargo
        },
        success: function(retorno) {
           $('#dialog-resumo_dft').hide();
           $('#dialog-resumo_dft_cargo').removeClass('hide');
            $("#form_resumo_dft_cargo").html(retorno['html_cargos']);
            $("#span_nome_cargo_dft").html(retorno['descricao']);
        },
        error: function(xhr, status, text) {
            erro_att = xhr;
            $.dialogs.error("Houve um erro ao abrir o cargo.");
        },
    });

}
function salvar_dft_resumo_cargo(e){
    /* Salva os campos da Tela de Resumo do DFT*/
    e.preventDefault();
    $.ajax({
        url: URL_SALVAR_RESUMO_DFT_CARGO,
        dataType: 'json',
        type: 'post',
        data: {
           'id_cargo':$("#id_mapa_cargo_dft_id").val(),
            'quadro_atual': $("#id_carg_dft_quadro_atual").val(),
            'ajuste_neces_inf': $("#id_carg_dft_ajuste_neces_inf").val(),
            'aposentadoria_imediata': $("#id_carg_dft_aposentadoria_imediata").val(),
            'detalhes': $("#id_carg_dft_detalhes").val(),
        },
        success: function(retorno) {
            $.dialogs.success("Os campos foram salvos com sucesso.", function(){
                $("#fechar-resumo_dft_cargo").click();
          });
        },
    });
}

function retorna_valor_sugerido(){
    /* Salva os campos da Tela de Resumo do DFT*/
    $.ajax({
        url: URL_RETORNA_VALOR_SUGERIDO,
        dataType: 'json',
        type: 'post',
        data: {
           'id_cargo':$("#id_mapa_cargo_dft_id").val()
        },
        success: function(retorno) {
           $("#id_carg_dft_ajuste_neces_inf").val(retorno["valor"]);
           $.dialogs.success("O valor foi retornado com sucesso.");
           $("#retorna-valor-sugerido").hide();
        },
    });
}


$(function() {

    $('#open-dft').click(function(e) {
        e.preventDefault();
        get_dft_ajax();
    });

    $('#btn-config-parametros_dft').click(get_dft_parametros);
    $('#btn-config-cargos').click(get_dft_resumo);

    $("[name='percentual_execucao']").die("blur");
    $("[name='percentual_execucao']").live("blur", corrigir_percentual_execucao);

    $('#fechar-parametros_dft, #fechar-resumo_dft').click(function(e) {
        e.preventDefault();
        retornar_dft();
    });
    $("#fechar-resumo_dft_cargo").click(function(e) {
        e.preventDefault();
        get_dft_resumo(e);
        $("#dialog-resumo_dft").show();
        $('#dialog-resumo_dft_cargo').addClass('hide');
    });

    $('#save-parametros_dft').click(salvar_dft_parametros);
    $('#save-resumo_dft').click(salvar_dft_resumo);
    $('#save-resumo_dft_cargo').click(salvar_dft_resumo_cargo);

    $("#add_cargo_dft").click(add_novo_cargo_dft);

    $(".float-field-dft").die("blur");
    $(".float-field-dft").live("blur", validacao_campos_dft);

});
