var criar_lista_competencias_cc = function() {
  TABELA_CONSULTA_CC = $.DataTableXenon({
    json: URL_GET_COMPS + "cc/",
    container: "listagem_comp_cc",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Competência",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-5',
      "mRender": function(data, type, full) {
        return full["cc_desc"];
      }
    }, {
      "mData": "Indicador",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-6',
      "mRender": function(data, type, full) {
        return full["ccind_desc"];
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '<a href="#" title="Excluir" class="text-gray" onclick="excluir_competencia_cc(' + full["id"] + ')"> <i class="fa fa-trash-o"></i></a>';
        return HTML;
      }
    }]
  });
};

var criar_lista_competencias_ct = function() {
  TABELA_CONSULTA_CT = $.DataTableXenon({
    json: URL_GET_COMPS + "ct/",
    container: "listagem_comp_ct",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Competência",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-5',
      "mRender": function(data, type, full) {
        return full["ct_desc"];
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '<a href="#" title="Excluir" class="text-gray" onclick="excluir_competencia_ct(' + full["id"] + ')"> <i class="'+ICONES_DELETE+'"></i></a>';
        return HTML;
      }
    }]
  });
};

var criar_lista_competencias = function(prefixo) {
  if (prefixo == 'cc') criar_lista_competencias_cc();
  if (prefixo == 'ct') criar_lista_competencias_cc();
};

var atualizar_lista_competencias = function(prefixo) {
  if (prefixo == 'cc') TABELA_CONSULTA_CC.reload();
  if (prefixo == 'ct') TABELA_CONSULTA_CT.reload();
};

var abrir_competencias = function(prefixo) {
  $("#add_comp_" + prefixo).html(" Carregando as competências ...");
  $("#add_comp_" + prefixo).html("");
  $.ajax({
    url: URL_FORM_COMP + prefixo + "/",
    type: 'post',
    dataType: 'json',
    success: function(dados) {
      $("#add_comp_" + prefixo).html(dados["html"]);
      console.log("#add_comp_" + prefixo)
      $("#novo_cadastro_comp_" + prefixo).hide();
      $("#cancelar_cadastro_comp_" + prefixo).show();
      $("#salvar_cadastro_comp_" + prefixo).click(function(e) {
        e.preventDefault();
        adicionar_competencias(prefixo);
      });
    },
    error: function() {
      $("#novo_cadastro_comp_" + prefixo).show();
      $("#cancelar_cadastro_comp_" + prefixo).hide();
    }
  });
};

var cancelar_competencias = function(prefixo) {
  $("#add_comp_" + prefixo).html("");
  $("#novo_cadastro_comp_" + prefixo).show();
  $("#cancelar_cadastro_comp_" + prefixo).hide();
};

var adicionar_competencias = function(prefixo) {
  var compets = $("#id_competencias").val();
  var compets_ids = "";
  if (compets) {
    compets_ids = compets.join(",");
  }
  $.ajax({
    url: URL_SALVAR_COMP + prefixo + "/",
    type: 'post',
    dataType: 'json',
    data: {
      'competencias_selecionadas': compets_ids
    },
    success: function(dados) {
      cancelar_competencias(prefixo);
      atualizar_lista_competencias(prefixo);
      $.dialogs.success("", dados["msg_sucesso"]);
    }
  });
};

var excluir_competencia = function(id_comp, prefixo, msg_confirm) {
  $.dialogs.confirm("Atenção", msg_confirm,
    function() {
      console.log(  {
          'id_comp': id_comp
        })
      $.ajax({
        url: URL_EXCLUIR_COMP + prefixo + "/",
        type: 'post',
        dataType: 'json',
        data: {
          'id_comp': id_comp
        },
        success: function(dados) {
          atualizar_lista_competencias(prefixo);
          cancelar_competencias(prefixo);
          $.dialogs.success("", dados["msg_sucesso"]);
        }
      });

    }
  );
};

var excluir_competencia_cc = function(id_comp) {
  excluir_competencia(id_comp, "cc", "Deseja realmente excluir o indicador?");
};

var excluir_competencia_ct = function(id_comp) {
  excluir_competencia(id_comp, "ct", "Deseja realmente excluir a competência?");
};

$(function() {

  $('#abas a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
    $(".form_comps_cancel").click();
  });

  $('#novo_cadastro_comp_cc').click(function(e) {
    e.preventDefault();
    abrir_competencias('cc');
  });

  $('#cancelar_cadastro_comp_cc').click(function(e) {
    e.preventDefault();
    cancelar_competencias('cc');
  });


  $('#novo_cadastro_comp_ct').click(function(e) {
    e.preventDefault();
    abrir_competencias('ct');
  });

  $('#cancelar_cadastro_comp_ct').click(function(e) {
    e.preventDefault();
    cancelar_competencias('ct');
  });

  criar_lista_competencias_cc();
  criar_lista_competencias_ct();


  $(".form_comps_cancel").click();

});
