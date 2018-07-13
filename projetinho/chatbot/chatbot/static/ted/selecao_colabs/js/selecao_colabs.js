var COLABS_IDS = [];
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

var limpar_colabs_selecionados = function(){
  $.ajax({
    url : URL_LIMPA_COLABS,
    type : 'POST',
    dataType : 'json',
    async : false,
    data : {},
    success : function(dados) {
      $(".cke_participantes").removeProp("checked");
      COLABS_IDS = [];
    }
  });
};

var marcar_colabs_selecionados = function(){
  var colab_id = $(this).attr("data-colab");
  var marcado = $(this).is(":checked");
  $.ajax({
    url : URL_MARCAR_COLABS,
    type : 'POST',
    dataType : 'json',
    async : false,
    data : {
      colab_id: colab_id,
      marcado: marcado
    },
    success : function(dados) {
      COLABS_IDS = dados.ids_marcados
    }
  });

};


var _set_session_filter = function(funcao_dps) {
  var filial = $("#id_filtro_filial").val();
  filiais = filial ? filial.join("|") : [];

  var setor = $("#id_filtro_setor").val();
  setores = setor ? setor.join("|") : [];

  var funcao = $("#id_filtro_funcao").val();
  funcoes = funcao ? funcao.join("|") : [];

  $.ajax({
    url : URL_SET_SESSION,
    type : 'POST',
    dataType : 'json',
    async : false,
    data : {
      filiais : filiais,
      setores : setores,
      funcoes : funcoes
    },
    success : function(dados) {
      funcao_dps();
    }
  });
};

var _pos_listagem_colab = function(treinamento){
    $.get(URL_GET_INFORMACOES + '?treinamento=' + treinamento)
        .success(function (data) {
            if(!data.tem_recursos){
              $.dialogs.error('Não foi cadastrado nenhum recurso para desenvolvimento para este programa de treinamento.')
            }
        });
    $(".cke_participantes").change(marcar_colabs_selecionados);
};

var listar_colabs = function(){
  var treinamento = $("#id_treinamento").val();
  var filtro_min = $("#id_filtro_min").is(":checked");
  var filtro_max = $("#id_filtro_max").is(":checked");
  var per_page = $("#id_per_page").val();
  var url_listagem = URL_GET_COLABS + '?treinamento=' + treinamento
                   + '&filtro_min=' + filtro_min
                   + '&filtro_max=' + filtro_max;

  listagem_Geral('listagem_colabs', url_listagem, '#selecao_colabs', function(){
     _pos_listagem_colab(treinamento);
  });
};

var get_colabs_treinamento = function () {
    var treinamento = $("#id_treinamento").val();
    _set_session_filter(listar_colabs);
};

var buscar_turmas = function () {
    if($('#id_treinamento').val() && COLABS_IDS.length > 0) {
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
            '<td class="ajax_list_value"><span>{{qtd_part}} {{danger_icon}}</span></td>' +
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
            if(turma.qtd_vagas != null && turma.qtd_part + qtd_acrescentar > turma.qtd_vagas){
                aux_html = aux_html.replace('{{danger}}', 'danger');
                aux_html = aux_html.replace('{{danger_icon}}', '<a class="red" data-original-title=""><i class="ace_icon fa fa-exclamation-triangle bigger-120" title="O número de participantes supera a quantidade de vagas cadastrada."></i></a>');
            } else {
                aux_html = aux_html.replace('{{danger}}', '');
                aux_html = aux_html.replace('{{danger_icon}}', '');
            }
            tabela.append(aux_html);

        }
    }
    else{
        var html = '<tr class="ajax_list_row ajax_list_row">' +
            '<td class="ajax_list_value" colspan="6">' +
            'Sem turmas para seleção' +
            '</td>' +
            '</tr>';

        tabela.html('');
        tabela.append(html)
    }
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

var ver_det_colab = function(id_colab){
  var treinamento = $("#id_treinamento").val();
  var url = URL_DET_COLAB_DESEMPENHO + '?treinamento=' + treinamento
                   + '&id_colab=' + id_colab;

  $.get(url).success(function (dados) {
      $("#modal_detalhes_desemp").html(dados["html"]);
      $("#modal_detalhes_desemp").dialog({
        hide: 'fade',
        show: 'fade',
        ace_theme: true,
        ace_title_icon_left: 'fa fa-edit',
        title: "Detalhes do Desempenho",
        width: '50%',
        buttons: {
          fechar: {
            click: function() {
              $(this).dialog('close');
            },
            'class': 'btn btn-xs btn-danger',
            text: "Cancelar"
          },
        },
        close: function() {
          $.loading.hide();
          $(this).dialog('close').dialog('destroy');
        },
      });
  });
};

var salvar_turma = function(){
    if (COLABS_IDS.length==0){
        $.dialogs.error('Por favor selecione pelo menos um participante para a turma.');
        return false;
    }
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
     }).success(function (data) {
         $('#selecao_colabs').toggle();
         $('#nova_turma').toggle(false);

          var win = window.open(data.redirect, '_blank');
           try { win.focus(); } catch(Exception) {}
           window.location = '/ted/selecao/';
     }).done(function(retorno) {
        esconderCarregando();
     });
};

$(function () {

    $('#id_filtro_min, #id_filtro_max, #id_filtro_filial, #id_filtro_setor, #id_filtro_funcao').change(get_colabs_treinamento);

    $('#id_treinamento').change(function(){
      if($(this).val()!=""){
          $("#div_filtros_extras").show();
          $('#acrescentar_nova_turma').removeProp('disabled');
          $('#acrescentar_turma').removeProp('disabled');
          $('#id_filtro_min').removeProp('disabled');
          $('#id_filtro_max').removeProp('disabled');
      } else {
          $("#div_filtros_extras").hide();
          $('#acrescentar_nova_turma').prop('disabled');
          $('#acrescentar_turma').prop('disabled');
          $('#id_filtro_min').prop('disabled');
          $('#id_filtro_max').prop('disabled');
      }
      limpar_colabs_selecionados();
      get_colabs_treinamento();
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
            var colabs = COLABS_IDS;
            if (checked_radio.parent().parent().hasClass('danger')) {
                $.dialogs.confirm(
                    "O número de participantes supera a quantidade de vagas cadastrada, tem certeza que deseja incluir este(s) novo(s) participante(s)?",
                    function () {
                        $.post(URL_INSERT_COLABS, {
                            'turma_id': turma_id,
                            'colabs': colabs
                        }).success(function (data) {
                            var win = window.open(data.redirect, '_blank');
                            try { win.focus(); } catch(Exception) {}
                            window.location = '/ted/selecao/';
                        })
                    }
                );
            }
            else {
                $.post(URL_INSERT_COLABS, {
                    'turma_id': turma_id,
                    'colabs': colabs
                }).success(function (data) {
                    var win = window.open(data.redirect, '_blank');
                    try { win.focus(); } catch(Exception) {}
                    window.location = '/ted/selecao/';
                });
            }
        }
        else {
            $.dialogs.error('Selecione uma turma.')
        }
    });

    $('#acrescentar_nova_turma').click(function () {
        if (COLABS_IDS.length==0){
            $.dialogs.error('Por favor selecione um treinamento e os participantes para a turma.');
            return false;
        }
        if(!$('#id_treinamento').val()){
            $.dialogs.error('Por favor selecione um treinamento e os participantes para a turma.');
            return false;
        }
        $('#selecao_colabs').toggle();
        $('#nova_turma').toggle();
        get_institutos_nova_turma();
    });

    $('#id_inst_ensino').change(function(){
        var id = $(this).val();
        if(id==""){
              $("#id_datas_disponiveis").html("");
              $("#form_base").hide();
        } else {
              mostrarCarregando();
              /*$.post(URL_FORM_DATA, {
                  'id_treinamento': $("#id_treinamento").val(),
                  'id_instituto' : id
              })
              .done(function(retorno) {
                  $("#id_datas_disponiveis").html(retorno["html"]);
                  $("#form_base").hide();
                  esconderCarregando();
              });*/
              $("#form_base").show();
              esconderCarregando();
       }
    });

    $("#bt_salvar").click(salvar_turma);
    $('#nova_turma_form').parsley();

});
