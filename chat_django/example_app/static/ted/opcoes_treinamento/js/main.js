var CONFIG_GERAL_MS = {
    multiple: true,
    numberDisplayed: 1,
    enableFiltering: true,
    enableCaseInsensitiveFiltering: true,
    buttonClass: 'btn btn-grey btn-sm col-xs-12',
    filterPlaceholder: 'Filtrar por descrição',
    includeSelectAllOption: true,
    includeSelectAllIfMoreThan: 2,
};

var abrir_treinamento = function(id_programa) {
    window.open(URL_PROGRAMA + "" + id_programa);
}

var abre_bloco = function(element) {
    var conteudo = $(element).attr('ref-content');
    $('.pill.active').removeClass('active');
    $(element).addClass('active');
    $('.bloco').addClass('hidden');
    $('#' + conteudo).removeClass('hidden');
};

var carregar_busca = function() {
    listagem_Geral('listagem_busca', URL_BUSCAR);
}

var carregar_cc_geral = function(URL) {
    $.get(URL)
        .done(function(data) {
            $('#listagem_comp_comp').html(data.html);
            $('#listagem_comp_comp').show();
        });
};

var carregar_cc = function() {
    carregar_cc_geral(URL_LISTAR_CC);
};

var carregar_ccind = function() {
    carregar_cc_geral(URL_LISTAR_CCIND);
};

var carregar_ct = function() {

    $.get(URL_LISTAR_CT)
        .done(function(data) {
            $('#listagem_comp_tec').html(data.html);
            $('#listagem_comp_tec').show();
        });
};

var carrega_selects_ct = function() {
    window.setTimeout(function() {
        var ct = $('#comp_tec').attr("id_elem");
        $.get(URL_GET_LABELS_CT + '?ct=' + ct)
            .done(function(data) {
                var html = '';
                for (var item in data) {
                    html += '<option value=' + data[item][0] + '>' + data[item][1] + '</option>';
                }
                $('#nv_min_tec').empty().append(html);
                $('#nv_max_tec').empty().append(html);
                configurar_selects_inicio_fim(
                    '#nv_max_tec', '#nv_min_tec',
                    'O Nível Mínimo não deve ser maior que o Nível Máximo.',
                    'O Nível Máximo não deve ser menor que o Nível Mínimo.'
                );
            }).error(function() {
                $('#comp_tec').attr("id_elem", "");
                $('#comp_tec').val("");
            });
    }, 10)
};


// -- Competências Comportamentais

var carrega_indicadores = function() {
    var id = $(this).val();
    $.get(URL_CCIND_SELECT + '?id=' + id)
        .done(function(data) {
            var html = '<option value="">-----</option>';
            for (var item in data) {
                html += '<option value=' + data[item][0] + '>' + data[item][1] + '</option>';
            }
            $('#id_indicador').empty().append(html);
        });
};

var carrega_selects_comp_geral = function(URL, do_after) {
    mostrarCarregando();
    $.get(URL)
        .done(function(data) {
            $('#add_comp_comp').html(data["html"]);
            $('#add_comp_comp').show();
            esconderCarregando();
            do_after();
        });
};

var carrega_selects_comp_cc = function() {
    carrega_selects_comp_geral(URL_CC_FORM, function() {});
};

var carrega_selects_comp_ccind = function() {
    carrega_selects_comp_geral(URL_CCIND_FORM, function() {
        $('#id_competencia').change(carrega_indicadores);
    });
};


var adiciona_ccs = function() {
    var competencias = $("#id_ccs").val();
    if (!competencias) {
        $.dialogs.error("É obrigatório selecionar pelo menos uma Competência Comportamental.");
    } else {
        competencias = competencias.join("|");
        $.get(URL_ADICIONAR_CC + '?id_comps=' + competencias)
            .done(function(data) {
                carregar_cc();
                carrega_selects_comp_cc();
            });
    }
};

var adiciona_ccinds = function() {
    var id_indicador = $("#id_indicador").val();
    if (!id_indicador) {
        $.dialogs.error("É obrigatório selecionar pelo menos um Indicador.");
    } else {
        var id_nivel_min = $("#id_nivel_min").val();
        $.get(URL_ADICIONAR_CCIND + '?ccind_id=' + id_indicador + "&nivel_min=" + id_nivel_min)
            .done(function(data) {
                carregar_ccind();
                carrega_selects_comp_ccind();
            });
    }
};

var remover_cc = function(id_cc) {

    $.get(URL_REMOVER_CC + '?id_cc=' + id_cc)
        .done(function(data) {
            carregar_cc();
            carrega_selects_comp_cc();
        });
};

var remover_ccind = function(id_ccind) {

    $.get(URL_REMOVER_CCIND + '?id_ccind=' + id_ccind)
        .done(function(data) {
            carregar_ccind();
            carrega_selects_comp_ccind();
        });
};

// -- Competências Técnicas

var limpar_ct = function() {
    $("#comp_tec").attr("id_elem", "");
    $("#comp_tec").val("");
    $("#nv_min_tec option").remove();
    $("#nv_max_tec option").remove();
};


var limpar_campos = function() {
    carregar_ct();
    if ($(".radio_comp:checked").attr("value") == "comp") {
        carregar_cc();
    } else {
        carregar_ccind();
    }
};

var adiciona_cts = function(id) {
    if (!$("#comp_tec").val()) {
        $("#comp_tec").attr("id_elem", "");
    }
    if (!$("#comp_tec").attr("id_elem")) {
        $("#comp_tec").val("");
    }
    var comp_tec_id = $("#comp_tec").attr("id_elem");
    if (!comp_tec_id) {
        $.dialogs.error("É obrigatório selecionar pelo menos uma Competência Técnica.");
        return false;
    } else {
        var nivel_min = $("#nv_min_tec").val();
        var nv_max_tec = $("#nv_max_tec").val();
        $.get(URL_ADICIONAR_CT + '?id_ct=' + comp_tec_id +
                "&nivel_min=" + nivel_min +
                "&nivel_max=" + nv_max_tec)
            .done(function(data) {
                limpar_ct();
                carregar_ct();
            });
    }
};

var remover_ct = function(id_ct) {

    $.get(URL_REMOVER_CT + '?id_ct=' + id_ct)
        .done(function(data) {
            limpar_ct();
            carregar_ct();
        });
};


$(function() {

    $('.pill').click(function(e) {
        e.preventDefault();
        abre_bloco(this);
    });

    $(".radio_comp").click(function() {
        if ($(this).attr("value") == "comp") {
            carrega_selects_comp_cc();
        } else {
            carrega_selects_comp_ccind();
        }
    });

    $('#comp_tec').on("keydown", function(event) {
        $("#comp_tec").attr("id_elem", "");
    }).autocomplete({
        source: URL_AUTO_CT,
        minLength: 2,
        select: function(event, ui) {
            $("#comp_tec").attr("id_elem", ui.item.id);
            $("#comp_tec").val(ui.item.label);
            carrega_selects_ct();
            return false;
        }
    });

    $("#bt_consultar").click(function() {
        $("#tabs_comp, #comp, #tec, #bt_consultar, #bt_limpar").hide();
        $("#bt_refinar_consulta, #bt_nova_consulta, #div_busca, #bt_gerar_pdf").show();
        carregar_busca();
    });

    $("#bt_refinar_consulta").click(function() {
        $("#tabs_comp, #comp, #tec, #bt_consultar, #bt_limpar").show();
        $("#bt_refinar_consulta, #bt_nova_consulta, #div_busca, #bt_gerar_pdf").hide();
    });

    $("#bt_nova_consulta").click(function() {
        $.dialogs.confirm(
            "Deseja realmente fazer uma nova consulta? Todas as competências e indicadores selecionados serão perdidos.",
            function() {
                $.get(URL_LIMPAR_CONSULTA).done(function(data) {
                    $("#tabs_comp, #comp, #tec, #bt_consultar, #bt_limpar").show();
                    $("#bt_refinar_consulta, #bt_nova_consulta, #div_busca, #bt_gerar_pdf").hide();
                    limpar_campos();
                    carrega_selects_comp_cc();
                });
            }
        );
    });


    $("#bt_limpar").click(function() {
        $.dialogs.confirm(
            "Deseja realmente limpar os dados de consulta? Todas as competências e indicadores selecionados serão perdidos.",
            function() {
                $.get(URL_LIMPAR_CONSULTA).done(function(data) {
                    limpar_campos()
                });
            }
        );
    });

    $(".radio_comp:first").click();
    carregar_cc();
    carregar_ct();
    $("#tab_comp").click();

});
