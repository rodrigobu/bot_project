var criar_lista_ocorrencias = function() {
  TABELA_CONSULTA_OC = $.DataTableXenon({
    json: URL_LISTA_OCORRENCIAS+$('#id_indicador').val()+"/",
    container: "listagem_ocorrencias",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Data",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return ' <div valor="' + full["data_hard"] + '">' +
          full["data"] + '</div>'
      }
    }, {
      "mData": "Mês",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["mes_desc"];
      }
    }, {
      "mData": "Valor",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["valor_bruto"];
      }
    }, {
      "mData": "Cálculo Realizado",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["tipo_calculo_desc"];
      }
    }, {
      "mData": "Observações",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["observacao"];
      }
    }, ]
  });
};

var atualizar_lista_ocorrencias = function() {
  TABELA_CONSULTA_OC.reload();
};

var editar_ocorrencias = function() {
  $.get(URL_FORM_OCORRENCIAS+$('#id_indicador').val()+"/")
    .done(function(data) {
      $("#cadastrar_ocorrencias").html(data["html"]);
      make_datepicker("#id_data");
      $('#cadastrar_ocorrencias').parsley();
      $('#cadastrar_ocorrencias').show();
      $('#cancelar_ocorrencia').show();
      $('#nova_ocorrencia').hide();
      $('#submit_form_ocorrencias').click(salvar_ocorrencias);
      $("#campos_ocorrencia").wrap("<form id='form-ocorrencia'></form>");
      init_masks_numeros()
      $("#id_mes").change(function() {
        var valor = $("#id_mes").val();
        var valor_atual = $("[name='valor_mes_"+valor+"']").val();
        var meses = $("#id_meses_ja_adicionados").val();
        if (meses.indexOf(valor) !== -1 && valor_atual!='' && valor_atual!='-') {
          $("#div_tipo_calculo").show();
        } else {
          $("#div_tipo_calculo").hide();
        }
        $("[name='tipo_calculo'][value='sut']").click();
      });
      $("[name='tipo_calculo']").change(function(){
          if($(this).val()=='exc'){
              $("#id_valor").parent().parent().hide();
              $("#id_valor").val();
          } else {
              $("#id_valor").parent().parent().show();
          }
      });

    })
};

var salvar_ocorrencias = function() {
  $(".parsley-errors-list").remove("");
  var Valido = true;
  if ($("#id_mes").val() == "") {
    gerar_erros("mes", "Este campo é obrigatório.");
    Valido = false;
  }
  if ($("#id_tipo_calculo:checked").val() != "exc") {
    if ($("#id_valor").val() == "") {
      gerar_erros("valor", "Este campo é obrigatório.");
      Valido = false;
    }
  }
  if ($("#id_observacao").val().replace(" ", "").replace(/ /g, '') == "") {
    gerar_erros("observacao", "Este campo é obrigatório.");
    Valido = false;
  }
  if (!Valido) {
    return false;
  } else {
    var form = serializaForm("#form-ocorrencia");
    var url = URL_SALVAR_OCORRENCIAS+$('#id_indicador').val()+"/";
    $.post(url, form)
      .done(function(data) {
        $.dialogs.success('Lançamento feito com sucesso.');
        atualizar_lista_ocorrencias();
        $("#cadastrar_ocorrencias").html("");
        $('#cadastrar_ocorrencias').hide();
        $('#cancelar_ocorrencia').hide();
        $('#nova_ocorrencia').show();
        carregar_indicador();
      });
    return false;
  }
};

var carregar_indicador = function() {
  if($('#id_indicador').val()!=''){
    $.get(URL_PAINEL_INDICADOR+$('#id_indicador').val()+"/")
      .done(function(data) {
        $("#div_dados_indicador").html(data["html"]);
        $('#nova_ocorrencia').click(editar_ocorrencias);
        $('#cancelar_ocorrencia').click(function() {
          $("#cadastrar_ocorrencias").html("");
          $('#cadastrar_ocorrencias').hide();
          $('#cancelar_ocorrencia').hide();
          $('#nova_ocorrencia').show();
        });
        criar_lista_ocorrencias();
    });
  } else {
    $("#div_dados_indicador").html("");
  }
};

var gerar_dados_meta = function() {
  $.get(URL_DADOS_META)
    .done(function(data) {
      $("#dados_meta").html(data["html"]);

      $('#id_indicador').on("change",function() {
        carregar_indicador();
      });
    });

}

$(function() {

  criar_lista_ocorrencias();
  gerar_dados_meta();
  $('#nova_ocorrencia').click(editar_ocorrencias);

  $('#cancelar_ocorrencia').click(function() {
    $("#cadastrar_ocorrencias").html("");
    $('#cadastrar_ocorrencias').hide();
    $('#cancelar_ocorrencia').hide();
    $('#nova_ocorrencia').show();
  });


})
