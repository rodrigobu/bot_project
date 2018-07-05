var make_obrigatorio_check = function(id) {
    $("#" + id).addClass("vObrigatorio");
    $("#div_" + id).show().find('label').addClass('requiredField').find('span').remove();
    $("#div_" + id).show().find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
};

var remove_obrigatorio_check = function(id) {
    $("#" + id).removeClass("vObrigatorio");
    $("#div_" + id).hide().find('label').removeClass('requiredField').find('span').remove();
};

var verifica_check_usa_escala_comp = function(sufixo) {

    if ($("#id_usa_avalc_" + sufixo).is(":checked")) {
        make_obrigatorio_check("id_lbl_avalc_" + sufixo);
        $("#div_id_conceito_avalc_" + sufixo).show();

        if ($("#id_mostra_justif_c").is(":checked")) {
            $("#div_id_obrigar_justif_avalc_" + sufixo).show();
        }
    } else {
        remove_obrigatorio_check("id_lbl_avalc_" + sufixo);
        $("#div_id_conceito_avalc_" + sufixo).hide();

        if ($("#id_mostra_justif_c").is(":checked")) {
            $("#id_obrigar_justif_avalc_" + sufixo).removeAttr('checked');
            $("#div_id_obrigar_justif_avalc_" + sufixo).hide();
        }
    }
};

var verifica_check_usa_nivel = function(sufixo) {
    if ($("#id_usa_nivel" + sufixo).is(":checked")) {
        make_obrigatorio_check("id_lbl_nivel" + sufixo);

        if ($("#id_mostra_justif_t").is(":checked")) {
            $("#div_id_obrigar_justif_aval" + sufixo.replace('ct','t')).show();
        }
    } else {
        remove_obrigatorio_check("id_lbl_nivel" + sufixo);

        if ($("#id_mostra_justif_t").is(":checked")) {
            $("#id_obrigar_justif_aval" + sufixo.replace('ct','t')).removeAttr('checked');
            $("#div_id_obrigar_justif_aval" + sufixo.replace('ct','t')).hide();
        }
    }
};

var verifica_check_usa_escala_resp = function(sufixo) {

    if ($("#id_usa_descescala" + sufixo).is(":checked")) {
        make_obrigatorio_check("id_descescala" + sufixo);
        make_obrigatorio_check("id_porcentual" + sufixo);

        if ($("#id_mostra_justif_r").is(":checked")) {
            $("#div_id_obrigar_justif_avalr" + sufixo).show();
        }
    } else {
        remove_obrigatorio_check("id_descescala" + sufixo);
        remove_obrigatorio_check("id_porcentual" + sufixo);

        if ($("#id_mostra_justif_r").is(":checked")) {
            $("#id_obrigar_justif_avalr" + sufixo).removeAttr('checked');
            $("#div_id_obrigar_justif_avalr" + sufixo).hide();
        }
    }
};

var verifica_check_nao_se_aplica = function(sufixo) {
    var LISTA = [
        "id_lbl_nao_se_aplica_" + sufixo, "id_conceito_nao_se_aplica_" + sufixo,
    ];
    if ($("#id_opcao_nao_se_aplica_" + sufixo).is(":checked")) {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#" + value).addClass("vObrigatorio");
                $("#div_" + value).show().find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
            }
        });
    } else {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#div_" + value).hide().find('label').removeClass('requiredField').find('span').remove();
                $("#" + value).removeClass("vObrigatorio");
            }
        });
    }
};

var verifica_check_comentario_obrigatorio = function(sufixo, array) {
    if ($("#id_mostra_justif_" + sufixo).is(":checked")) {
        $.each(new Array(array), function(n){
            $("#div_id_obrigar_justif_aval" + sufixo + "_" + n).show();

            if(sufixo=='t'){
                $("#div_id_obrigar_justif_aval" + sufixo + "_nc_" + n).show();
            }
        });
    } else {
        $.each(new Array(array), function(n){
            $("#id_obrigar_justif_aval" + sufixo + "_" + n).removeAttr('checked');
            $("#div_id_obrigar_justif_aval" + sufixo + "_" + n).hide();

            if(sufixo=='t'){
                $("#id_obrigar_justif_aval" + sufixo + "_nc_" + n).removeAttr('checked');
                $("#div_id_obrigar_justif_aval" + sufixo + "_nc_" + n).hide();
            }
        });
    }
};

var verifica_check_fale_francamente = function() {
    var LISTA = [
        "id_lbl_fale_francamente_c", "id_orientacao_fale_francamente_c",
    ];
    if ($("#id_usa_fale_francamente_c").is(":checked")) {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#" + value).addClass("vObrigatorio");
                $("#div_" + value).show().find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
            }
        });
        /*campo id_textopadrao_fale_francamente_c não é obrigatorio */
        $("#div_id_textopadrao_fale_francamente_c").show();
    } else {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#div_" + value).show().hide().find('label').removeClass('requiredField').find('span').remove();
                $("#" + value).removeClass("vObrigatorio");
            }
        });
        /*campo id_textopadrao_fale_francamente_c não é obrigatorio */
        $("#div_id_textopadrao_fale_francamente_c").hide();
    }
};

var verifica_check_dominio_relevancia = function() {
    var LISTA = [
        "id_lbl_dominio_r", "id_lbl_nivel_dominio_1", "id_lbl_nivel_dominio_2", "id_lbl_nivel_dominio_3",
        "id_lbl_relevancia_r", "id_lbl_nivel_relevancia_1", "id_lbl_nivel_relevancia_2", "id_lbl_nivel_relevancia_3",
    ];
    if ($("#id_usa_dominio_relevancia").is(":checked")) {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#" + value).addClass("vObrigatorio");
                $("#div_" + value).find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
            }
        });
        $(".dominio_fieldset").show();
    } else {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#div_" + value).find('label').removeClass('requiredField').find('span').remove();
                $("#" + value).removeClass("vObrigatorio");
            }
        });
        $(".dominio_fieldset").hide();
    }
};

var verifica_check_fazer_para_melhor = function() {
    var LISTA = [
        "id_lbl_fazer_para_melhor_c", "id_orientacao_fazer_para_melhor_c",
        "id_nivel_fazer_para_melhor_c", "id_qtd_fazer_para_melhor_c",
    ];
    if ($("#id_usa_fazer_para_melhor_c").is(":checked")) {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#" + value).addClass("vObrigatorio");
                $("#div_" + value).show().find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
            }
        });
        /*campo id_textopadrao_fazer_para_melhor_c não é obrigatorio */
        $("#div_id_textopadrao_fazer_para_melhor_c").show();
    } else {
        $.each(LISTA, function(idx, value) {
            if ($("#" + value).length != 0) {
                $("#div_" + value).hide().find('label').removeClass('requiredField').find('span').remove();
                $("#" + value).removeClass("vObrigatorio");
            }
        });
        /*campo id_textopadrao_fazer_para_melhor_c não é obrigatorio */
        $("#div_id_textopadrao_fazer_para_melhor_c").hide();
    }
};

var valida_percentual_individual = function() {
    var valor = $(this).val().replace(" ", "").replace("0", "");
    if (valor == '99' || valor == '98') {
        $.dialogs.error("Os percentuais das escalas não podem ser iguais a 99 ou 98.");
        $(this).val("");
        return false;
    }
    return true;
};

var valida_percentuais = function() {
    var to_return = true;
    lista = ["#id_porcentual_1", "#id_porcentual_2", "#id_porcentual_3", "#id_porcentual_4", "#id_porcentual_5", "#id_porcentual_6"];
    $.each(LISTA, function(idx, value) {
        var valor = $("#" + value).val().replace(" ", "").replace("0", "");
        if (valor == '99' || valor == '98') {
            $("#" + value).val("");
            to_return = false;
        }
    });
    return to_return;
};

var PARA_SALVAR = true;
var submit_form = function(btn_salvar) {

    if (!PARA_SALVAR) {
        PARA_SALVAR = true;
        return true;
    }

    mostrarCarregando();
    aba_anterior = $("#id_aba_anterior").val();
    aba_atual = $("#id_aba_atual").val();

    if(btn_salvar){
        validar = validar_campos_obrigatorios_em_abas("aba_" + aba_atual);
    } else {
        validar = validar_campos_obrigatorios_em_abas("aba_" + aba_anterior);
    }

    if (!validar) {
        esconderCarregando();
        var aba = $('.errorlist:first').parentsUntil(".tab-pane").parent()[0];
        var aba_erro = $(aba).attr("id").replace("aba_", "");
        PARA_SALVAR = false;
        $('#' + aba_erro).click();
        return false;
    }  else {
        // Upload CKEDITOR
        for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].updateElement();
        };
        // Salvamento por Aba
        if (click_aba) {
            forms = FORMS[aba_anterior];
            var data = {
                aba_anterior: aba_anterior
            };
            $.each(forms, function(key, value) {
                data[value] = get_hash_from_form("#" + value, '');
            });
        } else { // Salvamento por botão Salvar
            forms = FORMS[aba_atual];
            var data = {
                aba_anterior: aba_atual
            };
            $.each(forms, function(key, value) {
                data[value] = get_hash_from_form("#" + value, '');
            });
        }
        // Salvamento
        var to_return = true;
        $.ajax({
            url: URL_SALVAR_ABAS,
            dataType: 'json',
            type: 'post',
            data: data,
            async: false,
            success: function(retorno) {
                if (retorno['status'] == 'nok') {
                    if (!click_aba) {
                        aba_anterior = aba_atual;
                    }
                    $('#' + aba_anterior).tab('show');
                    $("#id_aba_atual").val(aba_anterior);
                    $.each(retorno['error_list'], function(key, value) {
                        if (value == "Enter a number." || value == "Informe um número.") {
                            value = "Decimal inválido";
                        }
                        gerate_error("id_" + key, value);
                        $("#id_"+ key).focus()
                    });
                    $.dialogs.error("Existem erros no preenchimento do formulário.");
                    esconderCarregando();
                    to_return = false;
                } else if (retorno['status'] == 'ok') {
                    esconderCarregando();
                    if (!click_aba) {
                        $.dialogs.success("Parâmetros salvo com sucesso.");
                    }
                    to_return = true;
                    clean_errors();
                }
                click_aba = false;
            },
            error: function() {
                $.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato.");
                esconderCarregando();
                to_return = false;
            },
        });
        return to_return;
    }
};

var configuracao_ckeditor = function() {
    CKEDITOR.config.extraPlugins = 'especiais_email';
    tool = [{
        name: 'edit',
        items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    }, {
        name: 'component',
        items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    }, {
        name: 'others',
        items: ['Maximize', '-', 'Source']
    }, {
        name: 'styles',
        items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/', {
        name: 'indent',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    }, {
        name: 'especiais_login',
        items: ['/', "CampoEspecial_email"]
    }, {
        name: 'styles2',
        items: ['Styles', 'Format']
    }];
    tool_comum = [{
        name: 'edit',
        items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    }, {
        name: 'component',
        items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    }, {
        name: 'others',
        items: ['Maximize', '-', 'Source']
    }, {
        name: 'styles',
        items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/', {
        name: 'indent',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    }, {
        name: 'styles2',
        items: ['Styles', 'Format']
    }];
    CKEDITOR.config.removePlugins = 'elementspath';

    var LISTA_CKEDITORS_COMUN = [
        // NCFs
        'id_ncf_comp_instrucao', 'id_ncf_comp_agradecimento', 'id_ncf_comp_encerra',
        'id_ncf_tec_instrucao', 'id_ncf_tec_agradecimento', 'id_ncf_tec_encerra',
        //AVALs
        'id_avalc_instrucao', 'id_avalc_agradecimento', 'id_avalc_encerra', 'id_avalc_instrucao_consenso',
        'id_avalt_instrucao', 'id_avalt_agradecimento', 'id_avalt_encerra', 'id_avalr_instrucao',
        'id_avalr_agradecimento', 'id_avalr_encerra',
    ];
    $.each(LISTA_CKEDITORS_COMUN, function(idx, value) {
        if ($("#" + value).length != 0) {
            CKEDITOR.replace(value, {
                toolbar: tool_comum
            });
        }
    });

    // CKEDITORS ESPECIAIS
    var LISTA_CKEDITORS_ESPECIAIS = [
        'id_ncf_conteudo_convocacao', 'id_ncf_conteudo_reconvocacao', 'id_ncf_conteudo_cobranca',
    ];
    $.each(LISTA_CKEDITORS_ESPECIAIS, function(idx, value) {
        if ($("#" + value).length != 0) {
            CKEDITOR.replace(value, {
                extraPlugins: 'especiais_email',
                toolbar: tool
            });
        }
    });

    CKEDITOR.config.extraPlugins = 'especiais_aval';
    tool_aval = [{
        name: 'edit',
        items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    }, {
        name: 'component',
        items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    }, {
        name: 'others',
        items: ['Maximize', '-', 'Source']
    }, {
        name: 'styles',
        items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/', {
        name: 'indent',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    }, {
        name: 'especiais_login',
        items: ['/', "CampoEspecial_aval"]
    }, {
        name: 'styles2',
        items: ['Styles', 'Format']
    }];

    // CKEDITORS ESPECIAIS
    var LISTA_CKEDITORS_ESPECIAIS_2 = [
        'id_aval_conteudo_convocacao', 'id_aval_conteudo_reconvocacao', 'id_aval_conteudo_cobranca',
        'id_cons_email_adm', 'id_cons_colab_email', 'cons_texto_explicativo'
    ];
    $.each(LISTA_CKEDITORS_ESPECIAIS_2, function(idx, value) {
        if ($("#" + value).length != 0) {
            CKEDITOR.replace(value, {
                extraPlugins: 'especiais_aval',
                toolbar: tool_aval
            });
        }
    });

    if (CKEDITOR.instances != undefined) {
        for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].on('blur', function(event) {
                this.updateElement();
            });
        }
    }

    CKEDITOR.config.extraPlugins = 'especiais_autodec';
    tool_autodec = [{
        name: 'edit',
        items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    }, {
        name: 'component',
        items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    }, {
        name: 'others',
        items: ['Maximize', '-', 'Source']
    }, {
        name: 'styles',
        items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/', {
        name: 'indent',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    }, {
        name: 'especiais_login',
        items: ['/', "CampoEspecial_autodec"]
    }, {
        name: 'styles2',
        items: ['Styles', 'Format']
    }];

    // CKEDITORS ESPECIAIS
    var LISTA_CKEDITORS_ESPECIAIS_3 = [
        'id_coleta_declaracao_conteudo_convocacao',
         'id_coleta_declaracao_conteudo_reconvocacao',
         'id_coleta_declaracao_conteudo_cobranca',
    ];
    $.each(LISTA_CKEDITORS_ESPECIAIS_3, function(idx, value) {
        if ($("#" + value).length != 0) {
            CKEDITOR.replace(value, {
                extraPlugins: 'especiais_autodec',
                toolbar: tool_autodec
            });
        }
    });

    if (CKEDITOR.instances != undefined) {
        for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].on('blur', function(event) {
                this.updateElement();
            });
        }
    }
};


var configuracao_checks = function() {

    verifica_check_nao_se_aplica('c');
    $("#id_opcao_nao_se_aplica_c").bind("change", function() {
        verifica_check_nao_se_aplica('c');
    });
    verifica_check_nao_se_aplica('t');
    $("#id_opcao_nao_se_aplica_t").bind("change", function() {
        verifica_check_nao_se_aplica('t');
    });
    verifica_check_nao_se_aplica('t_nc');
    $("#id_opcao_nao_se_aplica_t_nc").bind("change", function() {
        verifica_check_nao_se_aplica('t_nc');
    });
    verifica_check_nao_se_aplica('r');
    $("#id_opcao_nao_se_aplica_r").bind("change", function() {
        verifica_check_nao_se_aplica('r');
    });
    verifica_check_fale_francamente();
    $("#id_usa_fale_francamente_c").bind("change", function() {
        verifica_check_fale_francamente();
    });
    verifica_check_fazer_para_melhor();
    $("#id_usa_fazer_para_melhor_c").bind("change", function() {
        verifica_check_fazer_para_melhor();
    });

    verifica_check_comentario_obrigatorio('c', 6);
    $("#id_mostra_justif_c").bind("change", function() {
        verifica_check_comentario_obrigatorio('c', 6);
    });

    verifica_check_comentario_obrigatorio('t', 6);
    $("#id_mostra_justif_t").bind("change", function() {
        verifica_check_comentario_obrigatorio('t', 6);
    });

    verifica_check_comentario_obrigatorio('r', 7);
    $("#id_mostra_justif_r").bind("change", function() {
        verifica_check_comentario_obrigatorio('r', 7);
    });


    verifica_check_usa_escala_comp('0');
    $("#id_usa_avalc_0").bind("change", function() {
        verifica_check_usa_escala_comp('0');
    });

    verifica_check_usa_escala_comp('1');
    $("#id_usa_avalc_1").bind("change", function() {
        verifica_check_usa_escala_comp('1');
    });

    verifica_check_usa_escala_comp('2');
    $("#id_usa_avalc_2").bind("change", function() {
        verifica_check_usa_escala_comp('2');
    });

    verifica_check_usa_escala_comp('3');
    $("#id_usa_avalc_3").bind("change", function() {
        verifica_check_usa_escala_comp('3');
    });

    verifica_check_usa_escala_comp('4');
    $("#id_usa_avalc_4").bind("change", function() {
        verifica_check_usa_escala_comp('4');
    });

    verifica_check_usa_escala_comp('5');
    $("#id_usa_avalc_5").bind("change", function() {
        verifica_check_usa_escala_comp('5');
    });


    verifica_check_usa_nivel('ct_0');
    $("#id_usa_nivelct_0").bind("change", function() {
        verifica_check_usa_nivel('ct_0');
    });
    verifica_check_usa_nivel('ct_1');
    $("#id_usa_nivelct_1").bind("change", function() {
        verifica_check_usa_nivel('ct_1');
    });
    verifica_check_usa_nivel('ct_2');
    $("#id_usa_nivelct_2").bind("change", function() {
        verifica_check_usa_nivel('ct_2');
    });
    verifica_check_usa_nivel('ct_3');
    $("#id_usa_nivelct_3").bind("change", function() {
        verifica_check_usa_nivel('ct_3');
    });
    verifica_check_usa_nivel('ct_4');
    $("#id_usa_nivelct_4").bind("change", function() {
        verifica_check_usa_nivel('ct_4');
    });
    verifica_check_usa_nivel('ct_5');
    $("#id_usa_nivelct_5").bind("change", function() {
        verifica_check_usa_nivel('ct_5');
    });
    verifica_check_usa_nivel('ct_nc_0');
    $("#id_usa_nivelct_nc_0").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_0');
    });
    verifica_check_usa_nivel('ct_nc_1');
    $("#id_usa_nivelct_nc_1").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_1');
    });
    verifica_check_usa_nivel('ct_nc_2');
    $("#id_usa_nivelct_nc_2").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_2');
    });
    verifica_check_usa_nivel('ct_nc_3');
    $("#id_usa_nivelct_nc_3").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_3');
    });
    verifica_check_usa_nivel('ct_nc_4');
    $("#id_usa_nivelct_nc_4").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_4');
    });
    verifica_check_usa_nivel('ct_nc_5');
    $("#id_usa_nivelct_nc_5").bind("change", function() {
        verifica_check_usa_nivel('ct_nc_5');
    });
    verifica_check_dominio_relevancia();
    $("#id_usa_dominio_relevancia").bind("change", function() {
        verifica_check_dominio_relevancia();
    });




    verifica_check_usa_escala_resp('_0');
    $("#id_usa_descescala_0").live("change", function() {
        verifica_check_usa_escala_resp('_0');
    });
    verifica_check_usa_escala_resp('_1');
    $("#id_usa_descescala_1").live("change", function() {
        verifica_check_usa_escala_resp('_1');
    });
    verifica_check_usa_escala_resp('_2');
    $("#id_usa_descescala_2").live("change", function() {
        verifica_check_usa_escala_resp('_2');
    });
    verifica_check_usa_escala_resp('_3');
    $("#id_usa_descescala_3").live("change", function() {
        verifica_check_usa_escala_resp('_3');
    });
    verifica_check_usa_escala_resp('_4');
    $("#id_usa_descescala_4").live("change", function() {
        verifica_check_usa_escala_resp('_4');
    });
    verifica_check_usa_escala_resp('_5');
    $("#id_usa_descescala_5").live("change", function() {
        verifica_check_usa_escala_resp('_5');
    });
    verifica_check_usa_escala_resp('_6');
    $("#id_usa_descescala_6").live("change", function() {
        verifica_check_usa_escala_resp('_6');
    });


    lista_avals = [
        'avalc_ant_auto_usar_nota',
        'avalc_ant_sup_usar_nota',
        'avalc_ant_par_usar_nota',
        'avalc_ant_sub_usar_nota',
        'avalc_ant_cli_usar_nota',
        'avalc_ant_outro_usar_nota',

        'avalt_ant_auto_usar_nota',
        'avalt_ant_sup_usar_nota',
        'avalt_ant_par_usar_nota',
        'avalt_ant_sub_usar_nota',
        'avalt_ant_cli_usar_nota',
        'avalt_ant_outro_usar_nota',

        'avalr_ant_auto_usar_nota',
        'avalr_ant_sup_usar_nota',
        'avalr_ant_par_usar_nota',
        'avalr_ant_sub_usar_nota',
        'avalr_ant_cli_usar_nota',
        'avalr_ant_outro_usar_nota',
    ]

    $.each(lista_avals, function(idx, value) {

        $("#id_" + value).change(function() {
            if ($(this).is(":checked")) {
                $("#" + value + "_div").show();
            } else {
                $("#" + value + "_div").hide();
            }
        });
        $("#id_" + value).change();

    });

};


var default_click = function(e) {
    e.preventDefault();
    // BKP
    var id_aba_anterior = $("#id_aba_anterior").val();
    var id_aba_atual = $("#id_aba_atual").val();
    // Nova Aba
    $("#id_aba_anterior").val($("#id_aba_atual").val());
    $("#id_aba_atual").val($(this).attr("id"));
    click_aba = true;
    // Salvação
    var retorno = submit_form(false);
    // Deu merda
    if (!retorno) {
        $('#' + $(this).attr("id")).tab('show');
        $("#id_aba_anterior").val(id_aba_anterior);
        $("#id_aba_atual").val(id_aba_atual);
        click_aba = false;
        return false;
    }
    return true;
};

$(function() {

    // -- Aba Mapeamento
    $('#config_map').click(); //- Aba default
    $('#config_map').click(default_click);

    // -- Aba Mensagens do Mapeamento
    $('#config_msg_map').click(default_click);

    // -- Aba Avaliações
    $('#config_aval').click(default_click);
    $('#config_avalc').click(default_click);
    $('#config_avalt').click(default_click);
    $('#config_avalr').click(default_click);
    $('#config_metas').click(default_click);

    // -- Aba Autodeclaração
    $('#config_autodec').click(default_click);

    // -- Botão Salvar
    $("#submit_form").live('click', function(e) {
        e.preventDefault();
        submit_form(true);
    });

    configuracao_ckeditor();
    configuracao_checks();

    if (!usa_familia_ct) {
        $("#div_id_familia_ct_default").hide();
    }

    $("#abas ul li").click(function(e) {
        e.preventDefault();
    });


    //-- Validações
    set_protect_only_number("#id_porcentual_1");
    set_protect_only_number("#id_porcentual_2");
    set_protect_only_number("#id_porcentual_3");
    set_protect_only_number("#id_porcentual_4");
    set_protect_only_number("#id_porcentual_5");
    set_protect_only_number("#id_porcentual_6");

    $("#id_porcentual_1").live("blur", valida_percentual_individual);
    $("#id_porcentual_2").live("blur", valida_percentual_individual);
    $("#id_porcentual_3").live("blur", valida_percentual_individual);
    $("#id_porcentual_4").live("blur", valida_percentual_individual);
    $("#id_porcentual_5").live("blur", valida_percentual_individual);
    $("#id_porcentual_6").live("blur", valida_percentual_individual);

    $("#id_peso_rel1_c, #id_peso_rel2_c, #id_peso_rel3_c, #id_peso_rel4_c, #id_peso_rel5_c, #id_peso_rel6_c").live("blur", function() {
        if (!valida_decimal($(this).val())) {
            $.dialogs.error("Por favor, informe um número decimal no formato 999999,99.");
            $(this).val("");
        }
    });

    $("#id_peso_rel1_t, #id_peso_rel2_t, #id_peso_rel3_t, #id_peso_rel4_t, #id_peso_rel5_t, #id_peso_rel6_t").live("blur", function() {
        if (!valida_decimal($(this).val())) {
            $.dialogs.error("Por favor, informe um número decimal no formato 999999,99.");
            $(this).val("");
        }
    });

    $("#id_peso_resp1, #id_peso_resp2, #id_peso_resp3, #id_peso_resp4, #id_peso_resp5, #id_peso_resp6").live("blur", function() {
        if (!valida_decimal($(this).val())) {
            $.dialogs.error("Por favor, informe um número decimal no formato 999999,99.");
            $(this).val("");
        }
    });
});
