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
      $(".cke_colaboradores").removeProp("checked");
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
  /* Envia uma request para salvar os filtros em sessão para não extourar o
  method GET da flexgrid */
  var filial = $("#id_filtro_filial").val();
  filiais = filial ? filial.join("|") : [];

  var setor = $("#id_filtro_setor").val();
  setores = setor ? setor.join("|") : [];

  var funcao = $("#id_filtro_funcao").val();
  funcoes = funcao ? funcao.join("|") : [];

  // Palavras-chave - tag_input
  if($("#form-field-tags").length) {
      var palavras = $('#form-field-tags').val();

      palavras = palavras.split(',');
      palavras = $.grep(palavras, function(item){ return item != ""; });
      palavras = $.map(palavras, function(item){ return unaccent($.trim(item.toLowerCase())); });

      palavras = palavras.join("|");
  }


  $.ajax({
    url : URL_SET_SESSION,
    type : 'POST',
    dataType : 'json',
    async : false,
    data : {
      filiais : filiais,
      setores : setores,
      funcoes : funcoes,
      palavras: palavras
    },
    success : function(dados) {
      funcao_dps();
    }
  });
};

/* Remove acentos de strings */
function unaccent(str) {
    str = str.replace(/[àáâãäå]/,"a");
    str = str.replace(/[òóõô]/,"o");
    str = str.replace(/[ùúũû]/,"u");
    str = str.replace(/[ìíîĩ]/,"i");
    str = str.replace(/[èéêẽ]/,"e");
    str = str.replace(/[ç]/,"c");

    return str.replace(/[^a-z 0-9]/gi,'');
}

var listar_colabs = function(){
    /* Listagem principal, coloca os filtros basicos e curtos da url
    de listagem e envia o pedido. */
    // mostrarCarregando();
    var projeto = $("#id_projeto").val();
    var filtro_min = $("#id_filtro_min").is(":checked");
    var filtro_max = $("#id_filtro_max").is(":checked");
    var filtro_declaracao = $("#id_filtro_declaracao").is(":checked");
    var per_page = $("#id_per_page").val();
    var url_listagem = URL_GET_COLABS + '?projeto_id=' + projeto
                   + '&filtro_declaracao=' + filtro_declaracao
                   + '&filtro_min=' + filtro_min
                   + '&filtro_max=' + filtro_max;
    listagem_Geral('listagem_colabs', url_listagem, '#selecao_colabs', function(){

      $(".cke_colaboradores").change(marcar_colabs_selecionados);
    //   esconderCarregando();

    });

};

var get_colabs_projeto = function () {
    /* Chamada principal da listagem */
    _set_session_filter(listar_colabs);
};


var ver_det_aval_colab = function(id_colab){
  /* Monta a dialog de detalhes do desempenho */
  var projeto = $("#id_projeto").val();
  var url = URL_DET_COLAB_DESEMPENHO + '?projeto=' + projeto
                   + '&id_colab=' + id_colab;

  $.get(url).success(function (dados) {
      $("#modal_detalhes").html(dados["html"]);
      $('[data-toggle="popover"]').popover();
      $("#modal_detalhes").dialog({
        hide: 'fade',
        show: 'fade',
        ace_theme: true,
        ace_title_icon_left: 'fa fa-edit',
        title: "Detalhes da Avaliação de Desempenho do Colaborador",
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

var ver_det_mini_colab = function(id_colab){
  /* Monta a dialog de detalhes do perfil */
  var projeto = $("#id_projeto").val();
  var url = URL_DET_COLAB_PERFIL + '?projeto=' + projeto
                   + '&id_colab=' + id_colab;

  $.get(url).success(function (dados) {
      $("#modal_detalhes").html(dados["html"]);
      $("#modal_detalhes").dialog({
        hide: 'fade',
        show: 'fade',
        ace_theme: true,
        ace_title_icon_left: 'fa fa-edit',
        title: "Detalhes do Perfil do Colaborador",
        width: '60%',
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

      //-- Iniciando o comportamento dos dados da dialog
      $(".bloco").hide();
      $("#pill_dados_pessoais").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_dados_pessoais").addClass("btn-info");
        $("#div_dados_pessoais").show();
      });
      $("#pill_dados_pessoais").click();
      $("#pill_cts").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_cts").addClass("btn-info");
        $("#div_cts").show();

        url_cts = URL_GET_COLAB_CTS + '?referencia_id=' + REF_PROJETO
                               + '&id_colab=' + id_colab;
        listagem_Geral('listagem_colabs_cts', url_cts, '#selecao_colabs_id');
      });
      $("#pill_cursos").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_cursos").addClass("btn-info");
        $("#div_cursos").show();

        url_curso = URL_GET_COLAB_CURSOS + '?id_colab=' + id_colab;
        listagem_Geral('listagem_colabs_cursos', url_curso, '#selecao_colabs_id');
      });


  });
};

var ver_det_9box_colab = function(id_colab){
    /* Desvia para a ela da matriz ninebox travada no colaborador */
    var url = URL_DET_COLAB_9BOX + '?tk=' + id_colab
                     + '&ref=' + REF_PROJETO;
    window.open(url, '_blank');
};

var ver_det_cdc_colab = function(id_colab){
    /* Desvia para a ela do painel de desempenho travada no colaborador */
    var url = URL_DET_COLAB_PAINEL + '?tk=' + id_colab
                     + '&ref=' + REF_PROJETO;
    window.open(url, '_blank');

};

var salvar_estudo = function(){
  disable_btn("form_estudo_colab");
  if (!$('#form_estudo_colab').parsley().isValid()) {
      enable_btn("form_estudo_colab");
      return false;
  }
  var form = serializaForm('#form_estudo_colab');
  form["projeto_id"] = $("#id_projeto").val();
  mostrarCarregando();
  $.post(URL_SALVAR_ESTUDO, form)
      .done(function(data) {
          $.dialogs.success('Estudo salvo com sucesso.');
          $("#btn_cancelar_estudo_colab").click();
          $("#id_estudo_nome").val("");
          limpar_colabs_selecionados();
      }).complete(function(data) {
          esconderCarregando()
          enable_btn("form_estudo_colab");
      });
}

var inicia_tag_input = function() {
    var tag_input = $('#form-field-tags');
    try{
       tag_input.tag({
          placeholder: tag_input.attr('placeholder'),
          caseInsensitive: true,
          //source: ['tag 1', 'tag 2'],//static autocomplet array

          //or fetch data from database, fetch those that match "query"
          source: function(q, process) {
             $.ajax({url: URL_GET_PALAVRAS+'?projeto_id='+$('#id_projeto').val()})
              .done(function(result_items){
                 process(result_items.lista_palavras);
             });
        },
       });
    }
    catch(e) {
       //display a textarea for old IE, because it doesn't support this plugin or another one I tried!
       tag_input.after('<textarea id="'+tag_input.attr('id')+'" name="'+tag_input.attr('name')+'" rows="3">'+tag_input.val()+'</textarea>').remove();
    }
}

var limpar_filtros = function() {
    mostrarCarregando();
    $('#id_projeto option[value=""]').attr("selected", "selected");
    $('#id_filtro_filial, #id_filtro_setor, #id_filtro_funcao').val(null);
    $('#id_filtro_filial, #id_filtro_setor, #id_filtro_funcao').multiselect('refresh');
    $('#id_filtro_min, #id_filtro_max, #id_filtro_declaracao').attr('checked', true);
    $('#id_filtro_min').attr('disabled','disabled');
    $('#id_filtro_max').attr('disabled','disabled');
    $('#id_filtro_declaracao').attr('disabled','disabled');
    $('#container_palavra').children().hide();
    $('#id_btn_buscar').attr('disabled','disabled');
    $('#limpar-filtros').attr('disabled','disabled');
    get_colabs_projeto();
    esconderCarregando();
}

$(function () {

    $(".div_filtros_extras").hide();
    $("#salvar_estudo").attr('disabled','disabled');
    $('#id_btn_buscar').attr('disabled','disabled');
    $('#limpar-filtros').attr('disabled','disabled');

    $('#id_projeto').change(function(){
      $("#div_alert_nada").hide();
      $("#div_alert_so_pc").hide();
      $("#salvar_estudo").attr("disabled","disabled");
      $('#id_btn_buscar').attr('disabled','disabled');
      $('#limpar-filtros').attr('disabled','disabled');
      limpar_colabs_selecionados();
      mostrarCarregando();

      if($(this).val()!=""){
          // Tem projeto Selecionado
          /* Verifica se o projeto tem ou não competências e palavras-chave e alerta o usuário*/
          var projeto_id = $("#id_projeto").val();
          $.get(URL_GET_PALAVRAS, {
            'projeto_id' : projeto_id
          })
          .done(function(data) {
              $('#container_palavra').html(data['html']);
              inicia_tag_input(); //inicia o tag_input das palavras-chave
              $("#id_filtro_palavra").off("change");
              if(!data.tem_recursos){
                  if(!data.tem_pc){
                      $("#div_alert_nada").show();
                      $("#salvar_estudo").attr('disabled','disabled');
                  } else {
                      $("#div_alert_so_pc").show();
                      $("id_btn_buscar").click();
                      $(".div_filtros_extras").show();
                      $("#salvar_estudo").removeAttr('disabled','disabled');
                  }
                  $('#id_filtro_min').attr('disabled','disabled');
                  $('#id_filtro_max').attr('disabled','disabled');
                  $('#id_filtro_declaracao').attr('disabled','disabled');
              } else {
                $(".div_filtros_extras").show();
                $('#id_filtro_min').removeAttr('disabled');
                $('#id_filtro_max').removeAttr('disabled');
                $('#id_filtro_declaracao').removeAttr('disabled');
                $("#salvar_estudo").removeAttr('disabled','disabled');
                $('#id_btn_buscar').removeAttr('disabled');
                $('#limpar-filtros').removeAttr('disabled');

              }

              if(data.referencia_projeto){
                  REF_PROJETO = data.referencia_projeto
              }

              get_colabs_projeto();

              esconderCarregando();
          });
      } else {
          // Tem projeto selecionado
          $(".div_filtros_extras").hide();
          $('#id_filtro_min').attr('disabled','disabled');
          $('#id_filtro_max').attr('disabled','disabled');
          $('#id_filtro_declaracao').attr('disabled','disabled');
          $("#salvar_estudo").attr('disabled','disabled');
          $("#btn_cancelar_estudo_colab").click();
          limpar_colabs_selecionados();
      }

    //   get_colabs_projeto();

    //   esconderCarregando();
    });



    $('#id_btn_buscar').click(get_colabs_projeto);
    $('#limpar-filtros').click(limpar_filtros);

    $("#salvar_estudo").click(function(){
      $("#div_estudo_colab").show();
      $("#id_estudo_nome").val("");
    });

    $("#btn_cancelar_estudo_colab").click(function(){
      $("#div_estudo_colab").hide();
      $("#id_estudo_nome").val("");
    });

    $('#form_estudo_colab').submit(function(event) {
        event.preventDefault();
        salvar_estudo()
    });

    // get_colabs_projeto();

});
