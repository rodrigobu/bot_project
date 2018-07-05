var criar_lista_movimentacoes = function() {
  TABELA_CONSULTA_MV = $.DataTableXenon({
    json: URL_GET_MOVIMENTACOES,
    container: "listagem_movimentacoes",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Data da Ação",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return ' <div valor="' + full["data_realizada_hard"] + '">' +
          full["data_realizada"] + '</div>';
      }
    }, {
      "mData": "Responsável pela Alteração",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["responsavel"];
      }
    }, {
      "mData": "Ação Realizada",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-8',
      "mRender": function(data, type, full) {
        return full["ocorrencia"];
      }
    }]
  });
};

var criar_lista_ocorrencias = function() {
  TABELA_CONSULTA_OC = $.DataTableXenon({
    json: URL_GET_OCORRENCIAS,
    container: "listagem_ocorrencias",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Data da Ocorrência",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return ' <div valor="' + full["data_realizada_hard"] + '">' +
          full["data_realizada"] + '</div>'
        return full["data_realizada"];
      }
    }, {
      "mData": "Cadastrada por",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["responsavel"];
      }
    }, {
      "mData": "Ocorrência",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-7',
      "mRender": function(data, type, full) {
        return full["ocorrencia"];
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML =
          '<a href="#" title="Excluir" class="text-gray point_click_icon" onclick="excluir_ocorrencia(' +
          full["id"] + ')"> <i class="fa fa-trash-o"></i></a>';
        return HTML;
      }
    }]
  });
};

var atualizar_lista_ocorrencias = function() {
  TABELA_CONSULTA_OC.reload();
};

var atualizar_lista_movimentacoes = function() {
  TABELA_CONSULTA_MV.reload();
};

var _editar_ocorrencias = function(url) {
  $.get(url)
    .done(function(data) {
      $("#cadastrar_ocorrencias").html(data["html"]);
      make_datepicker("#id_data");
      $('#cadastrar_ocorrencias').parsley();
      $('#cadastrar_ocorrencias').show();
      $('#cancelar_ocorrencia').show();
      $('#nova_ocorrencia').hide();
      $('#submit_form_ocorrencias').click(salvar_ocorrencias);
    });
};

var editar_ocorrencias = function(id) {
  var url = URL_GET_FORM_OCORRENCIAS + '?id=' + id;
  _editar_ocorrencias(url);
};

var salvar_ocorrencias = function() {
  $(".parsley-errors-list").remove("");
  var Valido = true;
  if ($("#id_data").val() == "") {
    gerar_erros("data", "Este campo é obrigatório.");
    Valido = false;
  }
  if ($("#id_ocorrencia").val().replace(" ", "").replace(/ /g, '') == "") {
    gerar_erros("ocorrencia", "Este campo é obrigatório.");
    Valido = false;
  }
  if (!Valido) {
    return false;
  } else {
    var form = {}
    form['id'] = META_ID;
    form['id_ocorrencia'] = $("#id_id_ocorrencia").val();
    form['ocorrencia'] = $("#id_ocorrencia").val();
    form['data'] = $("#id_data").val();
    var url = URL_SALVAR_OCORRENCIA;
    $.post(url, form)
      .done(function(data) {
        $.dialogs.success('Ocorrência salva com sucesso.');
        atualizar_lista_ocorrencias();
        $("#cadastrar_ocorrencias").html("");
        $('#cadastrar_ocorrencias').hide();
        $('#cancelar_ocorrencia').hide();
        $('#nova_ocorrencia').show();
      });
    return false;
  }

  /**/

};

var excluir_ocorrencia = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir a ocorrência?",
    function() {
      $.ajax({
        url: URL_EXCLUIR_OCORRENCIA + '?id=' + id,
        type: 'post',
        dataType: 'json',
        data: {
          'id': id
        },
        success: function(dados) {
          atualizar_lista_ocorrencias();
          $.dialogs.success("", "Ocorrência excluída com sucesso");
        }
      });

    }
  );
};

$(function() {

  criar_lista_movimentacoes();
  criar_lista_ocorrencias();

  $('#nova_ocorrencia').click(function() {
    _editar_ocorrencias(URL_GET_FORM_OCORRENCIAS);
  });

  $('#cancelar_ocorrencia').click(function() {
    $("#cadastrar_ocorrencias").html("");
    $('#cadastrar_ocorrencias').hide();
    $('#cancelar_ocorrencia').hide();
    $('#nova_ocorrencia').show();
  });

});
