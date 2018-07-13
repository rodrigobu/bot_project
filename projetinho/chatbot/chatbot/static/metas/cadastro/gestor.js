var carregar_responsavel = function() {
  mostrarCarregando();
  var tipo = $("[name='tipo_responsavel']:checked").val();

  $.get(URL_FORM_RESPONSAVEL, {
    "tipo_responsavel": tipo
  }).done(function(data) {
    $("#div_responsavel").html(data["html"]);
    if ($("#id_gestor option").length <= 2) {
      $("#id_gestor").val($("#id_gestor option:last").val())
    }
    if ($("#id_responsavel option").length <= 2) {
      $("#id_responsavel").val($("#id_responsavel option:last").val())
    }
    if (tipo == '1') {
      $("#id_responsavel").change(function() {
        $("#id_gestor").val("");
        if ($("#id_responsavel").val() == COLAB_LOGADO_ID) {
          // Evita a seleção de gestor=responsável
          $("#id_gestor option").show();
          $("#id_gestor option[value='" + $("#id_responsavel").val() +
            "']").hide()
        } else if ($("#id_responsavel").val() == "") {
          $("#id_gestor option").show();
        } else {
          $("#id_gestor option").hide();
          $("#id_gestor option[value='']").show()
          $("#id_gestor option[value='" + COLAB_LOGADO_ID + "']").show()
          $("#id_gestor").val(COLAB_LOGADO_ID);
        }
      });
      $("#id_responsavel").change();
    }
  });
};

$(function() {
  $("[name='tipo_responsavel']").click(carregar_responsavel);
  $("[name='tipo_responsavel']:first").click();
});
