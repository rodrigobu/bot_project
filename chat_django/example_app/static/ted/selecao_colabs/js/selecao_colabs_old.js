var CONFIG_GERAL_MS = {
    multiple : true,
    numberDisplayed : 1,
    enableFiltering : true,
    enableCaseInsensitiveFiltering : true,
    buttonClass : 'btn btn-grey btn-sm col-xs-12',
    filterPlaceholder : 'Filtrar por descrição',
    includeSelectAllOption : true,
    includeSelectAllIfMoreThan : 2,
};

var colabs_list = [];
var cts_values = [];
var ccs_values = [];
var filtred_list = [];

var filtrar = function () {
    var aux_list = filtred_list;
    var selected_funcoes = [];
    var selected_setores = [];
    var selected_filiais = [];

    if(!$('#id_filtro_min').is(':checked') || !$('#id_filtro_max').is(':checked')){
        aux_list = [];
        if(!$('#id_filtro_min').is(':checked')){
            aux_list = aux_list.concat(remover_filtro_minimo());
        }
        if(!$('#id_filtro_max').is(':checked')){
            aux_list = aux_list.concat(remover_filtro_maximo());
        }
    }

    $('#id_filtro_funcao option:selected').each(function(index, brand){
        selected_funcoes.push($(this).val());
    });
    $('#id_filtro_setor option:selected').each(function(index, brand){
        selected_setores.push($(this).val());
    });
    $('#id_filtro_filial option:selected').each(function(index, brand){
        selected_filiais.push($(this).val());
    });
    if(selected_funcoes.length > 0)
        aux_list = _.filter(aux_list, function (colab) {
            return selected_funcoes.includes(colab.funcao);
        });
    if(selected_setores.length > 0)
        aux_list = _.filter(aux_list, function (colab) {
            return  selected_setores.includes(colab.setor);
        });
    if(selected_filiais.length > 0)
        aux_list = _.filter(aux_list, function (colab) {
            return  selected_filiais.includes(colab.filial);
        });
    montar_tabela_colabs(aux_list);
};

var remover_filtro_minimo = function () {
    var aux_list = [];
    for(var i in ccs_values){
        var list = colabs_list.filter(function (colab) {
            if(colab.tipo == 'ccind' && colab.ccind == ccs_values[i].cc_id && colab.media != null)
                return true;
            return false
        });
        aux_list = aux_list.concat(list);
    }
    for(var i in cts_values){
        var list = colabs_list.filter(function (colab) {
            if(colab.tipo == 'ct' && colab.ccind == cts_values[i].cc_id && colab.media != null && colab.media <= cts_values[i].maximo)
                return true;
            return false
        });
        aux_list = aux_list.concat(list);
    }
    return aux_list;
};

var remover_filtro_maximo = function () {
    var aux_list = [];
    for(var i in cts_values){
        var list = colabs_list.filter(function (colab) {
            if(colab.tipo == 'ct' && colab.ccind == cts_values[i].cc_id && colab.media != null && colab.media >= cts_values[i].minimo)
                return true;
            return false
        });
        aux_list = aux_list.concat(list);
    }
    return aux_list;
};

var filtrar_media_ct = function () {
    for(var i in cts_values){
        var list = filtrar_media(colabs_list, 'ct', cts_values[i].minimo, cts_values[i].maximo, cts_values[i].ct_id);
        filtred_list = filtred_list.concat(list);
    }
};

var filtrar_media_cc = function () {
    for(var i in ccs_values){
        var list = filtrar_media(colabs_list, 'ccind', ccs_values[i].minimo, 0, ccs_values[i].cc_id);
        filtred_list = filtred_list.concat(list);
    }
};

var filtrar_media = function(list, tipo, minimo, maximo, id){
    return list.filter(function (colab) {
        if(colab.tipo == 'ccind' && colab.tipo == tipo && colab.ccind == id && colab.media != null && colab.media >= minimo)
            return true;

        if(colab.tipo == 'ct' && colab.tipo == tipo && colab.ct_id == id && colab.media != null && colab.media >= minimo && colab.media <= maximo)
            return true;

        return false
    });
};

var get_colabs_treinamento = function (treinamento) {
    filtred_list = [];
    if(this.value){
        mostrarCarregando();
        $.get(URL_GET_COLABS + '?treinamento=' + this.value)
            .success(function (data) {
                $('.selecao-1-oculto').toggle();
                if(!data.tem_recursos){
                  $.dialogs.error('Não foi cadastrado nenhum recurso de aprendizagem para este programa de treinamento.')
                }
                colabs_list = data.colabs;
                cts_values = data.cts_values;
                ccs_values = data.ccs_values;
                filtrar_media_cc();
                filtrar_media_ct();
                montar_filtros();
                esconderCarregando();
                montar_tabela_colabs(filtred_list);
                $('#acrescentar_nova_turma').removeProp('disabled');
                $('#acrescentar_turma').removeProp('disabled');
                $('#id_filtro_min').removeProp('disabled');
                $('#id_filtro_max').removeProp('disabled');
            });
    }
    else{
        montar_tabela_colabs(filtred_list);
    }
};

var montar_filtros = function () {
    var funcoes = [];
    var filials = [];
    var setores = [];
    for(var i in filtred_list){
        funcoes.push(filtred_list[i].funcao);
        filials.push(filtred_list[i].filial);
        setores.push(filtred_list[i].setor);
    }
    filtro_funcao(funcoes);
    filtro_setor(setores);
    filtro_filial(filials);
};

var filtro_funcao = function (funcoes) {
    funcoes = remove_duplicados(funcoes);
    var component = $('#id_filtro_funcao');
    var html = '';
    for(var i in funcoes){
        html += '<option>'+ funcoes[i] +'</option>'
    }

    component.html('');

    component.multiselect('destroy');

    component.append(html);

    component.multiselect($.extend({
        checkboxName : 'funcao',
        nSelectedText : gettext('Selecionados'),
        nonSelectedText : gettext('Filtre uma ou mais funções'),
        selectAllText : gettext('Filtrar todas funções / Nenhuma'),
        onChange: filtrar
    }, CONFIG_GERAL_MS));
};

var filtro_setor = function (setores) {
    setores = remove_duplicados(setores);
    var component = $('#id_filtro_setor');
    var html = '';
    for(var i in setores){
        html += '<option>'+ setores[i] +'</option>'
    }

    component.html('');

    component.multiselect('destroy');

    component.append(html);

    component.multiselect($.extend({
        checkboxName : 'setor',
        nSelectedText : gettext('Selecionados'),
        nonSelectedText : gettext('Filtre um ou mais setores'),
        selectAllText : gettext('Filtrar toda setores / Nenhum'),
        onChange: filtrar
    }, CONFIG_GERAL_MS));
};

var filtro_filial = function (filials) {
    filials = remove_duplicados(filials);
    var component = $('#id_filtro_filial');
    var html = '';
    for(var i in filials){
        html += '<option>'+ filials[i] +'</option>'
    }

    component.html('');

    component.multiselect('destroy');


    component.append(html);

    component.multiselect($.extend({
        checkboxName : 'filiar',
        nSelectedText : gettext('Selecionados'),
        nonSelectedText : gettext('Filtre uma ou mais filiais'),
        selectAllText : gettext('Filtrar todas filiais / Nenhuma'),
        onChange: filtrar
    }, CONFIG_GERAL_MS));
};

var remove_duplicados = function (list) {
    return list.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
};

var remove_colabs_duplicados = function (list) {

    return _.uniq(list, false, function (item) {
        return item.colab_id;
    });

};

var paginador = function (identificador_css) {
    $(identificador_css).each(function() {
        var currentPage = 0;
        var numPerPage = 10;
        var $table = $(this);
        $table.bind('repaginate', function() {
            $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        });
        $table.trigger('repaginate');
        var numRows = $table.find('tbody tr').length;
        var numPages = Math.ceil(numRows / numPerPage);
        var $pager = $('<div class="pager"></div>');
        for (var page = 0; page < numPages; page++) {
            $('<span class="page-number"></span>').text(page + 1).bind('click', {
                newPage: page
            }, function(event) {
                currentPage = event.data['newPage'];
                $table.trigger('repaginate');
                $(this).addClass('active').siblings().removeClass('active');
            }).appendTo($pager).addClass('clickable');
        }
        $pager.insertAfter($table).find('span.page-number:first').addClass('active');
    });
};

var buscar_turmas = function () {
    if($('#id_treinamento').val() && $('input[name="participantes"]:checked').length > 0) {
        mostrarCarregando();
        var id_treinamento = $('#id_treinamento').val();
        $.get(URL_GET_TURMAS + '?treinamento_id=' + id_treinamento)
            .success(function (data) {
                montar_tabela_turmas(data);
                $('#selecao_colabs').toggle();
                $('#selecao_turmas').toggle();
                esconderCarregando();
            });
    }
    else {
        $.dialogs.error('Por favor selecione um treinamento e os participantes para a turma.')
    }
};

var montar_tabela_turmas = function (turmas) {
    var tabela = $('#id_table_content_turmas');
    if(turmas.length>0){
        tabela.html('');
        var qtd_acrescentar = $('input[name="participantes"]:checked').length;
        var html = '<tr class="ajax_list_row ajax_list_row {{danger}}">' +
            '<td class="ajax_list_value center">' +
            '<input name="turmas" value="{{turma_id}}" type="radio">' +
            '</td>' +
            '<td class="ajax_list_value"><span>{{descricao}}</span></td>' +
            '<td class="ajax_list_value"><span>{{qtd_vagas}}</span></td>' +
            '<td class="ajax_list_value"><span>{{qtd_part}}</span></td>' +
            '<td class="ajax_list_value"><span>{{data_inicio}}</span></td>' +
            '<td class="ajax_list_value"><span>{{status}}</span></td>' +
            '</tr>';
        for(var i in turmas){
            var turma = turmas[i];
            var aux_html = html;
            aux_html = aux_html
                .replace('{{descricao}}', turma.descricao)
                .replace('{{qtd_vagas}}', turma.qtd_vagas ? turma.qtd_vagas : '-' )
                .replace('{{qtd_part}}', turma.qtd_part)
                .replace('{{turma_id}}', turma.turma_id)
                .replace('{{data_inicio}}', turma.data_inicio)
                .replace('{{status}}', turma.status);
            if(turma.qtd_vagas != null && turma.qtd_part + qtd_acrescentar > turma.qtd_vagas)
                aux_html = aux_html.replace('{{danger}}', 'danger');
            tabela.append(aux_html);

        }
    }
    else{
        var html = '<tr class="ajax_list_row ajax_list_row">' +
            '<td class="ajax_list_value" colspan="5">' +
            'Sem turmas para seleção' +
            '</td>' +
            '</tr>';

        tabela.html('');
        tabela.append(html)
    }
};

var montar_tabela_colabs = function (colabs) {
    $('.pager').remove();
    mostrarCarregando();
    var tabela = $('#id_table_content');
    if(colabs.length > 0) {
        colabs = remove_colabs_duplicados(colabs);
        tabela.html('');
        var html = '<tr class="ajax_list_row ajax_list_row">' +
            '<td class="ajax_list_value center">' +
            '<input name="participantes" data-colab="{{colab_id}}" type="checkbox" class="cke_participantes">' +
            '</td>' +
            '<td class="ajax_list_value"><span>{{nome}}</span></td>' +
            '<td class="ajax_list_value"><span>{{funcao}}</span></td>' +
            '<td class="ajax_list_value"><span>{{setor}}</span></td>' +
            '<td class="ajax_list_value"><span>{{status}}</span></td>' +
            '</tr>';

        for(var i in colabs){
            var aux_html = html;
            var colab = colabs[i];
            aux_html = aux_html
                .replace('{{nome}}', colab.nome)
                .replace('{{funcao}}', colab.funcao)
                .replace('{{setor}}', colab.setor)
                .replace('{{colab_id}}', colab.colab_id)
                .replace('{{status}}', colab.status);
            tabela.append(aux_html);
        }

        paginador('table.paginated');
    }
    else{
        var html = '<tr class="ajax_list_row ajax_list_row">' +
            '<td class="ajax_list_value" colspan="5">' +
            'Sem colaboradores para seleção' +
            '</td>' +
            '</tr>';

        tabela.html('');
        tabela.append(html)
    }
    esconderCarregando();
};

var get_institutos_nova_turma = function () {
    var treinamento_id = $('#id_treinamento').val();
    var url = URL_GET_CREDENCIADOS + '?treinamento_id=' + treinamento_id;
    $.get(url).success(function (data) {
        var html = '<option value="">-----</option>';
        $.each(data, function (key, value) {
            html += '<option value="'+ key +'">' + value + '</option>'
        });
        $('#id_inst_ensino').html('').append(html);
    });
};

var get_status_turmas = function () {
    var url = URL_GET_STATUS;
    var html = '<option value="">-----</option>';
    $.get(URL_GET_STATUS)
        .success(function (data) {
            $.each(data, function (key, value) {
                html += '<option value="'+ key +'">' + value + '</option>'
            });
            $('#id_status').html('').append(html);
        });
};

var get_calendarios = function () {
    var id = $(this).val();
    var treinamento_id = $('#id_treinamento').val();
    if(id){
        var url = URL_CALENDARIOS + '?treinamento_id='+treinamento_id+'&instituto_id='+id;
        $.get(url)
            .success(function (data) {
                var html = '<option value="">-----</option>';
                $.each(data, function (key, value) {
                    html += '<option value="'+ value +'">' + value + '</option>'
                });
                $('#id_datas-cadastradas').html('').append(html);
            });
    }
};

var salvar_turma = function(){

    var colabs = [];
    $('input[name="participantes"]:checked').each(function () {
        colabs.push($(this).attr('data-colab'));
    });
    colabs = colabs.join("|");

    if( !$('#nova_turma_form').parsley().validate() ){
        return false;
    }

    mostrarCarregando();
    $.post(URL_NOVA_TURMA, {
        'id_treinamento': $("#id_treinamento").val(),
        'instituto_ensino': $("#id_inst_ensino").val(),
        'status': $("#id_status").val(),
        'descricao': $("#id_descricao").val(),
        'data_inicio': $("#id_data_inicio").val(),
        'colabs': colabs
     }).success(function (data) {
         var win = window.open(data["redirect"], '_blank');
         //win.focus();
         window.location = '/ted/selecao/';
         $("#id_inst_ensino").val("");
         $("#id_inst_ensino").change();
         $("#id_treinamento").val("");
         $("#id_treinamento").change("");
     }).done(function(retorno) {
        esconderCarregando();
     });
};

$(function () {
    filtro_filial([]);
    filtro_setor([]);
    filtro_funcao([]);

    $('#id_treinamento').change(get_colabs_treinamento);

    $('#id_filtro_min').change(filtrar);
    $('#id_filtro_max').change(filtrar);

    $('#check_all').change(function () {
        if($(this).is(':checked')){
            $("input[name='participantes']").each(function (i, k) {
                $(k).prop('checked', true);
            });
        }
        else {
            $("input[name='participantes']").each(function (i, k) {
                $(k).prop('checked', false);
            });
        }
    });


    $('#acrescentar_turma').click(buscar_turmas);

    $('#voltar_selecao').click(function () {
        $('#selecao_colabs').toggle();
        $('#selecao_turmas').toggle();
    });

    $('#voltar_selecao_nova').click(function () {
        $('#selecao_colabs').toggle();
        $('#nova_turma').toggle();
    });

    $('#acrescentar_colabs').click(function () {
        var question = false;
        var checked_radio = $('input[name="turmas"]:checked');
        if(checked_radio.length > 0) {
            var turma_id = checked_radio.val();
            var colabs = [];
            $('input[name="participantes"]:checked').each(function () {
                colabs.push($(this).attr('data-colab'));
            });

            if (checked_radio.parent().parent().hasClass('danger')) {
                $.dialogs.confirm(
                    "O número de participantes supera a quantidade de vagas cadastrada, tem certeza que deseja incluir este(s) novo(s) participante(s)?",
                    function () {
                        $.post(URL_INSERT_COLABS, {
                            'turma_id': turma_id,
                            'colabs': colabs
                        }).success(function (data) {
                            var win = window.open(data.redirect, '_blank');
                            win.focus();
                            window.location = '/ted/selecao/';
                        })
                    },
                    function () {

                    }
                );
            }
            else {
                $.post(URL_INSERT_COLABS, {
                    'turma_id': turma_id,
                    'colabs': colabs
                }).success(function (data) {
                    var win = window.open(data.redirect, '_blank');
                    win.focus();
                    window.location = '/ted/selecao/';
                });
            }
        }
        else {
            $.dialogs.error('Selecione uma turma.')
        }
    });

    $('#acrescentar_nova_turma').click(function () {
        $('#selecao_colabs').toggle();
        $('#nova_turma').toggle();
        get_institutos_nova_turma();
        get_status_turmas();
    });

    $('#id_inst_ensino').change(function(){
        var id = $(this).val();
        if(id==""){
              $("#id_datas_disponiveis").html("");
              $("#form_base").hide();
        } else {
              mostrarCarregando();
              $.post(URL_FORM_DATA, {
                  'id_treinamento': $("#id_treinamento").val(),
                  'id_instituto' : id
              })
              .done(function(retorno) {
                  $("#id_datas_disponiveis").html(retorno["html"]);
                  $("#form_base").hide();
                  esconderCarregando();
              });
       }
    });

    $("#bt_salvar").click(salvar_turma);
    $('#nova_turma_form').parsley();

});
