
var lista_entrega = ['id_nbox_natende_hor', 'id_nbox_desenv_hor', 'id_nbox_atende_hor']; //, 'id_nbox_supera_hor'];
var lista_competencia = ['id_nbox_natende_ver', 'id_nbox_desenv_ver'];
var lista_todas_metricas = lista_entrega.concat(lista_competencia);

var valida_lista_metricas = function(lista_dados, limite_utilizado, entrega) {
    valido = true;
    $.each(lista_dados, function(idx, value) {
        var valor = $("#" + value).val();
        if (valor == "") return;
        if (!valido) return;

        // Validação de limite
        if (parseInt(valor) >= limite_utilizado) {
            tipo = entrega? "entrega": "competência";
            mensagem = "Os valores dos campos de métricas de "+tipo+" não podem ultrapassar ou serem iguais a " + limite_utilizado;
            $.dialogs.error(mensagem);
            $("#" + value).val("");
            valido = false;
        }
        if (!valido) return;

        // Validação de igualdade
        lista_campos = lista_dados.slice(0);
        valido_igual = true;
        $.each(lista_campos, function(idx, value_sub) {
            if (value_sub == value) return;
            if (!valido_igual) return;
            if (parseInt($("#" + value_sub).val()) == parseInt(valor)) {
                $.dialogs.error("Os valores dos campos de métricas de entrega não podem se repetir ");
                $("#" + value).val("");
                valido = false;
            }
        });
        if (!valido) return;

        $("#" + value).val(parseInt(valor));
    });
    return valido;
};

var valida_campos_metricas = function() {
    // Entrega
    $("#id_nbox_natende_hor").val(parseInt($("#id_nbox_natende_hor").val()));
    $("#id_nbox_desenv_hor").val(parseInt($("#id_nbox_desenv_hor").val()));
    $("#id_nbox_atende_hor").val(parseInt($("#id_nbox_atende_hor").val()));
    //--- Validação de consistencia de limites
    valido = valida_lista_metricas(lista_entrega, limite_entrega, true);
    if (!valido) return false;
    //--- Validação de consistencia de ordem
    var supera = parseInt($('#id_nbox_supera_hor').val());
    var atende = parseInt($('#id_nbox_atende_hor').val());
    if (supera < atende) {
        $.dialogs.error("O campo Atende das métricas de entrega não pode ser maior que o campo Supera.");
        return false;
    }
    var desenv = parseInt($('#id_nbox_desenv_hor').val());
    if (atende < desenv) {
        $.dialogs.error("O campo Atende das métricas de entrega não pode ser menor que o campo Em desenvolvimento.");
        return false;
    }
    var natende = parseInt($('#id_nbox_natende_hor').val());
    if (desenv < natende) {
        $.dialogs.error("O campo Em desenvolvimento das métricas de entrega não pode ser menor que o campo Não Atende.");
        return false;
    }

    // Competências
    $("#id_nbox_natende_ver").val(parseInt($("#id_nbox_natende_ver").val()));
    $("#id_nbox_desenv_ver").val(parseInt($("#id_nbox_desenv_ver").val()));
    //--- Validação de consistencia de limites
    valido = valida_lista_metricas(lista_competencia, limite_compt, false);
    if (!valido) return false;
    //--- Validação de consistencia de ordem
    var supera = parseInt($('#id_nbox_supera_ver').val());
    var desenv = parseInt($('#id_nbox_desenv_ver').val());
    if (supera < desenv) {
        $.dialogs.error("O campo Em desenvolvimento das métricas de competência não pode ser maior que o campo Supera.");
        return false;
    }
    var natende = parseInt($('#id_nbox_natende_ver').val());
    if (desenv < natende) {
        $.dialogs.error("O campo Em desenvolvimento das métricas de competência não pode ser menor que o campo Não Atende.");
        return false;
    }

    return true;

}

$(function() {

    $("#submit_form, #bt_submit_form").live('click', function(e) {
        if (!validar_campos_obrigatorios()) {
            //$.dialogs.error("Existem erros no preenchimento do formulário.");
            return false;
        }
        if (!valida_campos_metricas()) {
            return false;
        }
        $("#formulario-sis_geral").submit();
        return true;
    });

    if (SUCESSO) {
        $.dialogs.success("Parâmetros salvos com sucesso.");
    }

    $.each(lista_todas_metricas, function(idx, value) {
        $("#" + value).die("blur");
        $("#" + value).live("blur", function() {
            $(this).val(parseInt($(this).val()));
        });
    });

    $('#id_nbox_supera_hor').val(limite_entrega);
    $('#id_nbox_supera_hor').attr("readonly", "readonly");

    $('#id_nbox_supera_ver').val(limite_compt);
    $('#id_nbox_supera_ver').attr("readonly", "readonly");

});
