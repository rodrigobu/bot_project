// AJAX atualiza descricao do projeto
var salva_descricao = function() {
    $('#id_lbl_descricao').editable({
        url: URL_SALVAR_DESCRICAO,
        title: 'Entre com uma descrição',
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

// AJAX atualiza responsavel do projeto
var salva_responsavel = function() {
    $('#id_lbl_responsavel').editable({
        url: URL_SALVAR_RESPONSAVEL,
        title: 'Entre com um responsável',
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

var botao_edicao_responsavel = function() {
    $('#id_editar_responsavel').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_responsavel').editable('toggle');
    });
};

// AJAX atualiza especificacao do projeto
var salvar_especificacao = function() {

    disable_btn("formulario_especificacao");
    if (!$('#formulario_especificacao').parsley().isValid()) {
        enable_btn("formulario_especificacao");
        return false;
    }
    var form = serializaForm('#formulario_especificacao');
    form["projeto_id"] = ID_PROJETO;
    mostrarCarregando();
    $.post(URL_SALVAR_ESPECIFICACAO, form)
        .done(function(data) {
            $.dialogs.success('Especificação salva com sucesso.');
            enable_btn("formulario_especificacao");
        }).complete(function(data) {
            esconderCarregando()
            enable_btn("formulario_especificacao");
        });


};


$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'inline';
    salva_descricao();
    botao_edicao();
    salva_responsavel();
    botao_edicao_responsavel();
    $('#formulario_especificacao').submit(function(event) {
        event.preventDefault();
        salvar_especificacao()
    });

});
