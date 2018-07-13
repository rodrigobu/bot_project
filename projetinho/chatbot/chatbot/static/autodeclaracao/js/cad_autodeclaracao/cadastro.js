// AJAX atualiza coleta de autodeclaracao
var salva_descricao = function() {
    $('#id_lbl_descricao').editable({
        url: URL_SALVAR_DESCRICAO,
        title: 'Entre com a Descrição',
        error: function(response, newValue) {
            return response.responseText;
        },
        validate: function (value) {
            if($.trim(value) == '') {
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

// AJAX atualiza disponibilidade da coleta de autodeclaracao
var salva_coleta_disp = function() {
    $('#id_lbl_coleta_disp').editable({
        url: URL_SALVAR_COLETA_DISP,
        title: 'Escolha a disponibilidade da coleta',
        source: [{
                value: 'False',
                text: 'Indisponível'
            },
            {
                value: 'True',
                text: 'Disponível'
            },
        ]
    });
};

var botao_edicao_coleta_disp = function() {
    $('#id_editar_coleta_disp').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_coleta_disp').editable('toggle');
    });
};

$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'inline';

    $("#novo_autodeclaracao").insertAfter($(".page-header h1"));
    $("#novo_autodeclaracao").wrap("<div class='pull-right'> </div>").show();

    salva_descricao();
    botao_edicao();

    salva_coleta_disp();
    botao_edicao_coleta_disp();

    carregar_ct();
});
