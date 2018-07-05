/* Funções que são do Cadastro de PDI e servem apenas para Gestor */

/* Funções relacionadas aos campos de colaboradores */

var aplica_comportamento_campo_colaboradores = function() {
  $("#id_colaboradores").change(function() {
    var colabs = $("#id_colaboradores").val();
    if (colabs) {
      $(".hide_without_colab").show();
    } else {
      $(".hide_without_colab").hide();
    }
    $("#competencias_selecionadas");
  });
  $("#id_colaboradores").change();
};

var alertar_mudanca_colabs = function() {
  // Verifica se tem a necessidade de alertar sobre a mudança dos colaboradores
  // se já houver competências selecionadas
  if ($("#table_competencias tr ").length > 0) {
    $("#alerta_mudanca_competencias").show();
  } else {
    $("#alerta_mudanca_competencias").hide();
  }
};

var _ajax_get_form_colabs = function() {
  // Carrega o campo de colaboradores com base nos gestores
  $.ajax({
    url: URL_FORM_COLAB,
    type: 'get',
    dataType: 'json',
    data: {
      id: $("#id_gestores").val()
    },
    success: function(dados) {
      $("#div_colaboradores").html(dados["html"]);
      $.each(PDI_COLABS, function(idx, value) {
        $("#div_colaboradores input[type='checkbox'][value='" + value + "']").click();
      });
      PDI_COLABS = [];
      sumir_erros();
      alertar_mudanca_colabs();
      aplica_comportamento_campo_colaboradores();
    }
  });
};

var get_form_colabs = function() {
  // Carrega o campo de colaboradores com base nos gestores

  if ($("#table_competencias tr ").length > 0) {
    $.dialogs.confirm("Atenção", "Já existem Competências associadas ao PDI. " +
      " A troca de Gestor implica na exclusão dessas informações. " +
      " Deseja realmente trocar o Gestor? Essa ação não pode ser desfeita. ",
      function() {
        GESTOR_ATUAL = $("#id_gestores").val();
        $("#table_competencias").html("");
        $(".hide_without_colab").hide();
        _ajax_get_form_colabs();
      },
      function() {
        $("#id_gestores").val(GESTOR_ATUAL);
      })
  } else {
    GESTOR_ATUAL = $("#id_gestores").val();
    _ajax_get_form_colabs();
    $(".hide_without_colab").hide();
  }
};

var get_colabs_selecionados = function() {
    var colabs = $("#id_colaboradores").val();
    var colabs_ids = "";
    if (colabs) {
      colabs_ids = colabs.join("|");
    }
    return colabs_ids;
};

$(function() {

  $("#id_gestores").change(get_form_colabs);
  $("#id_gestores").change();
  $(".hide_without_colab").hide();

});
