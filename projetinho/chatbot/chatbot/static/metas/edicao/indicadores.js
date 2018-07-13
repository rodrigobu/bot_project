var criar_lista_indicadores = function() {
  TABELA_CONSULTA_IND = $.DataTableXenon({
    json: URL_GET_INDICADORES,
    container: "listagem_indicadores",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Indicador",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-5',
      "mRender": function(data, type, full) {
        return full["descricao"];
      }
    }, {
      "mData": "Meta Acordada",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-3',
      "mRender": function(data, type, full) {
        return parseFloat(full["meta_acordada"]).toFixed(2).toString()
          .replace(".", ",");
      }
    }, {
      "mData": "Resultado Parcial dos Alvos",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-3',
      "mRender": function(data, type, full) {
        return parseFloat(full["resultado_parcial"]).toFixed(2).toString()
          .replace(".", ",");
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML =
          '<a title="Editar" class="text-gray point_click_icon" onclick="editar_indicadores(' +
          full["id"] + ')"> <i class="fa fa-edit"></i></a>';
        if (PODE_EDITAR_TARGETS)
          HTML +=
          '<a title="Excluir" class="text-gray point_click_icon" onclick="excluir_indicador(' +
          full["id"] + ')"> <i class="fa fa-trash-o"></i></a>';
        return HTML;
      }
    }]
  });
};

var atualizar_lista_indicadores = function() {
  TABELA_CONSULTA_IND.reload();
};

var recalcular_meta_acordada = function(){
  $.post(URL_META_ACORDADA, {
     'tipo_apuracao' : $("#id_tipo_apuracao").val()
  })
    .done(function(data) {
      $("#id_meta_acordada").val(data["meta_acordada"]);
    });
}

var _editar_indicadores = function(url) {
  $.get(url)
    .done(function(data) {
      $("#cadastrar_indicadores").html(data["html"]);
      $('#cadastrar_indicadores').parsley();
      $('#cadastrar_indicadores').show();
      $('#cancelar_indicador').show();
      $('#novo_indicador').hide();
      $('#submit_form_indicadores').click(salvar_indicadores);
      $("#campos_indicadores").wrap("<form id='form-indicador'></form>");
      $("#id_indicador-meta_acordada").attr("readonly", 'readonly');
      $("[name='indicador-alvo_mes'], #id_indicador-tipo_apuracao").change(
        function() {
          var tipo = $("#id_indicador-tipo_apuracao").val();
          if (tipo == '2') {
            var soma = 0;
            $.each($("[name='indicador-alvo_mes']"), function(idx,
              value) {
              if ($(value).val() == "") return;
              soma += parseFloat($(value).val().replace(",", "."));
              soma = Math.round(soma * 100) / 100;
            });
            $("#id_indicador-meta_acordada").val(soma.toString().replace(
              ".", ","));
          } else if (tipo == '1') {
            var soma = 0;
            var total = 0;
            $.each($("[name='indicador-alvo_mes']"), function(idx,
              value) {
              if ($(value).val() == "") return;
              soma += parseFloat($(value).val().replace(",", "."));
              total += 1;
            });
            if (total != 0) {
              var media = soma / total;
              media = Math.round(media * 100) / 100;
            } else {
              var media = 0;
            }
            $("#id_indicador-meta_acordada").val(media.toString().replace(
              ".", ","));
          } else if (tipo == '3') {
            var ultimo = '';
            $.each($("[name='indicador-alvo_mes']"), function(idx,
              value) {
              if ($(value).val() == "") return;
              ultimo = $(value).val();
            });
            $("#id_indicador-meta_acordada").val(ultimo);
          } else {
            $("#id_indicador-meta_acordada").val();
          }
        });
    });
};

var editar_indicadores = function(id) {
  var url = URL_GET_FORM_INDICADORES + '?id_indicador=' + id;
  _editar_indicadores(url);
};

var salvar_indicadores = function() {
  $(".parsley-errors-list").remove("");
  var Valido = true;

  var meta_acordada = parseFloat($('#id_indicador-meta_acordada').val().replace(
    ",", "."));
  if (meta_acordada == 0) {
    gerar_erros("indicador-meta_acordada",
      "O campo Meta Acordada não pode ter valor zero.");
    Valido = false;
    //return false;
  }

  if (!validar_obg_campo("indicador-descricao")) {
    Valido = false;
    //return false;
  }

  if (!validar_obg_campo("indicador-meta_acordada")) {
    Valido = false;
    //return false;
  }

  if (!validar_obg_campo("indicador-tipo_apuracao")) {
    Valido = false;
    //return false;
  }

  var alvos = [];
  $.each($("[name='indicador-alvo_mes']"), function() {
    var value = $(this).val();
    var mes = $(this).attr("data_value");
    if (value != "") {
      alvos.push(mes + ';' + value);
    }
  });
  if (alvos.length != 12) {
    $.dialogs.error(
      "Para salvar as informações do Indicador é necessário o preenchimento de valores para todos os meses."
    );
    Valido = false;
    return false;
  }
  $("[name='indicador-fragmentos']").val(alvos.join("|"));

  if (!Valido) {
    $.dialogs.error("Existem erros no preenchimento do formulário.");
    return false;
  } else {
    var form = serializaForm("#form-indicador");
    //... colocar aqui o serializador do formulário
    var url = URL_SALVAR_INDICADOR;
    $.post(url, form)
      .done(function(data) {
        $.dialogs.success('Indicador salvo com sucesso.');
        atualizar_lista_indicadores();
        $("#cadastrar_indicadores").html("");
        $('#cadastrar_indicadores').hide();
        $('#cancelar_indicador').hide();
        $('#novo_indicador').show();
        recalcular_meta_acordada();
      });
    return false;
  }

};

var excluir_indicador = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o indicador?",
    function() {
      $.ajax({
        url: URL_EXCLUIR_INDICADOR + '?id=' + id,
        type: 'post',
        dataType: 'json',
        data: {
          'id': id
        },
        success: function(dados) {
          atualizar_lista_indicadores();
          recalcular_meta_acordada();
          $.dialogs.success("", "Indicador excluído com sucesso");
        }
      });

    }
  );
};

$(function() {

  criar_lista_indicadores();

  $('#novo_indicador').click(function() {
    _editar_indicadores(URL_GET_FORM_INDICADORES);
  });

  $('#cancelar_indicador').click(function() {
    $("#cadastrar_indicadores").html("");
    $('#cadastrar_indicadores').hide();
    $('#cancelar_indicador').hide();
    $('#novo_indicador').show();
  });

  $("#id_tipo_apuracao").change(recalcular_meta_acordada);
  $("#id_meta_acordada").attr("readonly", "readonly");

});
