var carregar_participantes = function(do_after) {
    listagem_Geral('listagem_participantes', URL_COLABORADORES, '', do_after);
};


var abre_bloco = function(element) {
    var conteudo = $(element).attr('ref-content');
    location.hash = 'id_colab';
    $('.pill.active').removeClass('active');
    $(element).addClass('active');
    $('.bloco').addClass('hidden');
    $('#' + conteudo).removeClass('hidden');
};


var carregar_porsetor = function(element) {
    $("#list_colabs_para_add").html("");
    $("#id_setor").val("");
    $('#label_colabs_para_add, #btns_colabs_para_add').hide();
};


var change_setor = function() {
    if ($(this).val() != '') {
        $('#label_colabs_para_add, #btns_colabs_para_add').show();
        $("#list_colabs_para_add").html("");
        mostrarCarregando();
        $.post(URL_AUTO_COLAB_SETOR, {
            'aud_id': ID_AUTODECLARACAO,
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
        }).complete(function(data) {
            esconderCarregando();
        });;
    } else {
        $('#label_colabs_para_add, #btns_colabs_para_add').hide();
        $("#list_colabs_para_add").html("");
    }
};

var salvar_colaboradores_setor = function() {
    $("tr").removeClass("danger");
    selecionados = []
    $(".cke_participantes:checked").each(function(idx, value) {
        var id_p = $(value).attr("id").replace("check_", "");
        selecionados.push(id_p);
    });
    disable_btn_id("adicionar_colabs_setor");
    if (selecionados.length == 0) {
        $.dialogs.error("É necessário escolher pelo menos um colaborador.");
        enable_btn_id("adicionar_colabs_setor");
        return false;
    } else {
        var qtde = selecionados.length;
        selecionados = selecionados.join("|");
        var total_p = parseInt($("#id_total_participantes").val());
        mostrarCarregando();
        $.post(URL_SALVAR_COLABORADOR, {
            'aud_id': ID_AUTODECLARACAO,
            'dados': selecionados,
            'funcao_id': $("#id_setor").val()
        }).done(function(retorno) {
            $.dialogs.success("Colaboradores adicionados com sucesso.");
            carregar_participantes();
            $('#label_colabs_para_add, #btns_colabs_para_add').hide();
            $("#list_colabs_para_add").html("");
            $("#id_setor").val("");
        }).complete(function(data) {
            esconderCarregando()
            enable_btn_id("adicionar_colabs_setor");
        });
    }
    return false;
};


var excluir_ColetaDeclaracaoColab = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_COLABORADOR, function(retorno) {
        mostrarCarregando();
        carregar_participantes(esconderCarregando);
    });
};


var carregar_porcolab = function(element) {
    $('#id_colaborador').val("");
    $('#id_colaborador').focus();
    $('#id_colaborador').on("keydown", function(event) {
        $("#id_colaborador").attr("id_elem", "");
    }).autocomplete({
        source: URL_AUTO_COLAB + "&aud_id=" + ID_AUTODECLARACAO,
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
        mostrarCarregando();
        $.post(URL_SALVAR_COLABORADOR, {
            'aud_id': ID_AUTODECLARACAO,
            'id_colab': $("#id_colaborador").attr("id_elem"),
        }).done(function(retorno) {
            $.dialogs.success("Colaboradores adicionados com sucesso.");
            carregar_participantes();
            $('#id_colaborador').val("");
            $("#id_colaborador").attr("id_elem", "");
            $("#id_setor").val("");
        }).complete(function(data) {
            esconderCarregando()
            enable_btn_id("submit_form_colab");
        });

    }
    return false;
};


var add_all_colabs = function() {
    $.dialogs.confirm('Confirmação',
        'Deseja adicionar todos os colaboradores a coleta?',
        function() {
            mostrarCarregando();
            $.post(URL_ADD_ALL_COLAB, {
                'id': ID_AUTODECLARACAO
            }).done(function(retorno) {
                $.dialogs.success('Colaboradores adicionados com sucesso');
                carregar_participantes();
            }).complete(function(data) {
                esconderCarregando()
            });
        });
};


$(function() {

    //-- Geral:
    if (location.hash) {
        abas = {
            '#id_ct': ['#id_tab_ct', carregar_ct],
            '#id_colab': ['#id_tab_colab', carregar_participantes],
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

    //-- Participantes:
    $('#id_tab_colab').click(function() {
        carregar_participantes();
    });

    $("#cadastrar_colab").submit(salvar_participantes_colab);
    $('#adicionar_colabs_setor').click(salvar_colaboradores_setor);
    $("#adicionar_all_colabs").click(add_all_colabs);

    $("#id_setor").change(change_setor);
    $('#label_colabs_para_add', '#btns_colabs_para_add', ).hide();

    $('#cancelar_add_participantes, #cancelar_add_participantes_colab').on("click", function() {
        $("#list_colabs_para_add").html("");
        $('.pill.active').removeClass('active');
        $('.bloco').addClass('hidden');
        $('#id_setor').val("");
        $('#label_colabs_para_add, #btns_colabs_para_add').hide();
    });
});
