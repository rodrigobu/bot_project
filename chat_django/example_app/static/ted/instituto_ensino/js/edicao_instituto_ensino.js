// AJAX atualiza descricao do projeto
var salva_nome = function() {
    $('#id_lbl_nome').editable({
        url: URL_SALVAR_NOME,
        title: 'Entre com o Nome',
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

var botao_nome = function() {
    $('#id_editar_nome').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_nome').editable('toggle');
    });
};

// AJAX atualiza descricao do projeto
var salva_nome_fantasia = function() {
    $('#id_lbl_nome_fantasia').editable({
        url: URL_SALVAR_NOME_FANTASIA,
        title: 'Entre com o Nome Fantasia',
        emptytext: 'Sem Nome Fantasia'
    });
};

var botao_nome_fantasia = function() {
    $('#id_editar_nome_fantasia').click(function(e) {
        e.stopPropagation();
        $('#id_lbl_nome_fantasia').editable('toggle');
    });
};


var salvar_complementos = function() {
    disable_btn("formulario_complementos");
    if (!$('#formulario_complementos').parsley().isValid()) {
        enable_btn("formulario_complementos");
        return false;
    }
    var data = serializaForm('#formulario_complementos');
    var url = URL_SALVAR_COMPLEMENTOS;
    $.post(url, data)
        .done(function(data) {
            $.dialogs.success('Dados Cadastrais salvos com sucesso.');
            enable_btn("formulario_complementos");
            if ($("#id_link_agenda").val().replace(" ", "") != "") {
                link_agenda = $("#id_link_agenda").val();
                if (!link_agenda.includes("http"))
                    link_agenda = "http://" + link_agenda;
                $("#id_link_agenda").val(link_agenda);
                $("#div_acessar_link_agenda a").attr("href", link_agenda);
                $("#div_acessar_link_agenda").show();
            } else {
                $("#div_acessar_link_agenda").hide();
            }
            if ($("#id_site").val().replace(" ", "") != "") {
                site = $("#id_site").val();
                if (!site.includes("http"))
                    site = "http://" + site;
                $("#id_site").val(site);
                $("#div_acessar_site a").attr("href", $("#id_site").val());
                $("#div_acessar_site").show();
            } else {
                $("#div_acessar_site").hide();
            }
        }).complete(function(data) {
            esconderCarregando()
            enable_btn("formulario_complementos");
        });
};

var salvar_contatos = function() {
    disable_btn("formulario_contato");
    if (!$('#formulario_contato').parsley().isValid()) {
        enable_btn("formulario_contato");
        return false;
    }
    var id = $('#id_contato').val();
    var form = serializaForm('#formulario_contato');
    form['id_instituto'] = ID_INSTITUTO;
    form['id'] = id;
    var url = URL_SALVAR_CONTATO + "&id=" + id;
    $.post(url, form)
        .done(function(data) {
            $.dialogs.success('Contato salvo com sucesso.');
            carregar_contatos_flexgrid();
            $("#formulario_contato").html("");
            $('#formulario_contato').hide();
            $('#cancelar_cadastro_contatos').hide();
            $('#novo_cadastro_contatos').show();
        }).complete(function(data) {
            esconderCarregando()
            enable_btn("formulario_contato");
        });
};

var salvar_facilitadores = function() {
    disable_btn("formulario_facilitador");
    if (!$('#formulario_facilitador').parsley().isValid()) {
        enable_btn("formulario_facilitador");
        return false;
    }
    var id = $('#id_facilitador').val();
    var form = serializaForm('#formulario_facilitador');
    form['id_instituto'] = ID_INSTITUTO;
    form['id'] = id;
    form['add_facilitador'] = $('#id_filtro_facilitador').val();
    var url = URL_SALVAR_FACILITADOR + "&id=" + id;
    $.post(url, form)
        .done(function(data) {
            $.dialogs.success('Facilitador salvo com sucesso.');
            carregar_facilitadores_flexgrid();
            $("#formulario_facilitador").html("");
            $('#formulario_facilitador').hide();
            $('#cancelar_cadastro_facilitadores').hide();
            $('#add_cadastro_facilitadores').show();
            $('#cad_cadastro_facilitadores').show();
        }).complete(function(data) {
            esconderCarregando()
            enable_btn("formulario_facilitador");
        });
};

function carregar_treinamentos_flexgrid() {
    listagem_Geral('listagem_treinamentos', URL_TREINAMENTO);
}

function carregar_treinamentos_ministrados_flexgrid() {
    listagem_Geral('treinamentos_ministrado', URL_TREINAMENTO_MINISTRADOS);
}

function carregar_contatos_flexgrid() {
    listagem_Geral('listagem_contatos', URL_CONTATOS);
}

function carregar_facilitadores_flexgrid() {
    listagem_Geral('listagem_facilitadores', URL_FACILITADORES);
}


var _editar_Contatos = function(url) {
    $.get(url)
        .done(function(data) {
            $("#formulario_contato").html(data["html"]);
            $('#formulario_contato').parsley();
            $('#formulario_contato').show();
            $('#cancelar_cadastro_contatos').show();
            $('#novo_cadastro_contatos').hide();
        });
};

var editar_ContatoInstitutoEnsino = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_CONTATO + '&id=' + id;
    _editar_Contatos(url);
};

var _editar_Facilitadores = function(url) {
    $.get(url)
        .done(function(data) {
            $("#formulario_facilitador").html(data["html"]);
            $('#formulario_facilitador').parsley();
            $('#formulario_facilitador').show();
            $('#cancelar_cadastro_facilitadores').show();
            $('#cad_cadastro_facilitadores').hide();
            $('#add_cadastro_facilitadores').hide();
        });
};

var editar_FacilitadorInstitutoEnsino = function(element) {
    var id = $(element).attr('id').replace('editar_', '');
    var url = URL_GET_FACILITADOR + '&id=' + id;
    _editar_Facilitadores(url);
};

var excluir_ContatoInstitutoEnsino = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CONTATO, function(retorno) {
        carregar_contatos_flexgrid();
        $("#cancelar_cadastro_contatos").click();
    });
};

var excluir_FacilitadorInstitutoEnsino = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    pode_excluir_FacilitadorInstitutoEnsino(id, URL_PODE_EXCLUIR_FACILITADOR)
    $("#cancelar_cadastro_facilitadores").click();
};

var pode_excluir_FacilitadorInstitutoEnsino = function(id, URL) {
    $.post(URL, { 'id': id  })
    .done(function(retorno) {
        if (retorno["status"]=="nok"){
            $.dialogs.error(retorno["msg"]);
        }
        if (retorno["status"]=="ok_parcial"){
            excluir_Geral(id, URL_EXCLUIR_FACILITADOR + '&delete_all=', function(retorno) {
                carregar_facilitadores_flexgrid();
            }, '', retorno["msg"]);
        }
        if (retorno["status"]=="ok_total"){
            excluir_Geral(id, URL_EXCLUIR_FACILITADOR + '&delete_all=True', function(retorno) {
                carregar_facilitadores_flexgrid();
            }, '', retorno["msg"]);
        }
    });
};


var ver_treinamento_geral = function(element, url, title) {
    var turma_id = $(element).attr('id').replace('ver_trein_', '');
    var url = url + '&id_turma=' + turma_id;
    var title = "Detalhes do " + title;

    $.get(url).done(function(data) {
        $("#TreinamentoModalBody").html(data["html"]);
        $('#TreinamentoModal').modal('show');
    });

};

var ver_treinamento = function(element) {
    ver_treinamento_geral(element, URL_GET_TREINAMENTO, "Treinamento")
};

var ver_treinamento_min = function(element) {
    ver_treinamento_geral(element, URL_GET_TREINAMENTO_MINISTRADOS, "Treinamento Ministrado")
};


$(function() {
    //-- Geral:

    $('#novo_instituto').click(function() {
        mostrarCarregando();
        window.location.href = URL_CADASTRO + MENU_PREFIX;
    });

    $("#novo_instituto").insertAfter($(".page-header h1"));
    $("#novo_instituto").wrap("<div class='pull-right'> </div>");
    $("#novo_instituto").show();

    salva_nome();
    botao_nome();
    salva_nome_fantasia();
    botao_nome_fantasia();

    if (location.hash) {
        abas = {
            '#id_cont_dados_cadastrais': ['#id_tab_dados_cadastrais', function() {}],
            '#id_cont_contatos': ['#id_tab_contatos', carregar_contatos_flexgrid],
            '#id_cont_facilitadores': ['#id_tab_facilitadores', carregar_facilitadores_flexgrid],
            '#id_cont_treinamentos': ['#id_tab_treinamentos', carregar_treinamentos_flexgrid],
            '#id_cont_treinamentos_ministrados': ['#id_tab_treinamentos_ministrados', carregar_treinamentos_ministrados_flexgrid],
        };
        monta_hash_aba(abas);
    }

    $('.aba_func').click(abre_aba);

    //-- Complementos

    $('#formulario_complementos').submit(function(event) {
        event.preventDefault();
        salvar_complementos();
    });

    //-- Contatos

    $('#id_tab_contatos').click(carregar_contatos_flexgrid);
    $('#formulario_contato').submit(function(event) {
        event.preventDefault();
        salvar_contatos();
    });

    $('#novo_cadastro_contatos').click(function() {
        _editar_Contatos(URL_GET_CONTATO);
    });

    $('#cancelar_cadastro_contatos').click(function() {
        $("#formulario_contato").html("");
        $('#formulario_contato').hide();
        $('#cancelar_cadastro_contatos').hide();
        $('#novo_cadastro_contatos').show();
    });

    //-- Facilitadores

    $('#id_tab_facilitadores').click(carregar_facilitadores_flexgrid);
    $('#formulario_facilitador').submit(function(event) {
        event.preventDefault();
        salvar_facilitadores();
    });

    $('#add_cadastro_facilitadores').click(function() {
        _editar_Facilitadores(URL_GET_FACILITADOR_FORM);
    });

    $('#cancelar_cadastro_facilitadores').click(function() {
        $("#formulario_facilitador").html("");
        $('#formulario_facilitador').hide();
        $('#cancelar_cadastro_facilitadores').hide();
        $('#cad_cadastro_facilitadores').show();
        $('#add_cadastro_facilitadores').show();
    });

    $('#cad_cadastro_facilitadores').click(function() {
        _editar_Facilitadores(URL_GET_FACILITADOR);
    });

    //-- Treinamentos
    $('#id_tab_treinamentos').click(carregar_treinamentos_flexgrid);

    //-- Trienamentos Ministrados
    $('#id_tab_treinamentos_ministrados').click(carregar_treinamentos_ministrados_flexgrid);


});
