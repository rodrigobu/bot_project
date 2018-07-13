var carregar_ct = function(do_after) {
    listagem_Geral('listagem_comp_tec', URL_CT, '', do_after);
};

var salvar_ct = function() {
    disable_btn("cadastrar_comp_tec");
    if (!$('#cadastrar_comp_tec').parsley().isValid()) {
        enable_btn("cadastrar_comp_tec");
        return false;
    }
    var form = serializaForm('#cadastrar_comp_tec');
    form['id_coleta'] = ID_AUTODECLARACAO;
    $.post(URL_SALVAR_CT, form)
        .done(function(data) {
            $.dialogs.success('Competência Técnica salva com sucesso.');
            carregar_ct();
            $('#novo_cadastro_comp_tec').show();
            $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').hide();
            $('#comp_tec').val("");
        }).complete(function(data) {
            enable_btn("cadastrar_comp_tec");
        });
};

var excluir_ColetaDeclaracaoCT = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CT, function(retorno) {
        mostrarCarregando();
        carregar_ct(esconderCarregando);
    });
};

$(function() {

    $('#cadastrar_comp_tec').submit(function(event) {
        event.preventDefault();
        salvar_ct();
    });

    $('#novo_cadastro_comp_tec').click(function() {
        $('#comp_tec').val("");
        $('#novo_cadastro_comp_tec').hide();
        $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').show();
        $('#cadastrar_comp_tec').parsley();
    });
    $('#comp_tec').on("keydown", function(event) {
        $("#comp_tec").attr("id_elem", "");
    }).autocomplete({
        source: URL_AUTO_CT,
        minLength: 2,
    });
    $('#cadastrar_comp_tec').hide();

    $('#cancelar_cadastro_comp_tec').click(function() {
        $('#cadastrar_comp_tec').hide();
        $('#novo_cadastro_comp_tec').show();
        $('#cancelar_cadastro_comp_tec').hide();
    });

    $('#id_tab_ct').click(function() {
        carregar_ct();
    });


});
