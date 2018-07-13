var carregar_responsavel = function() {
  mostrarCarregando();
  $.get(URL_FORM_RESPONSAVEL, {
    "tipo_responsavel": $("[name='tipo_responsavel']:checked").val()
  }).done(function(data) {
    $("#div_responsavel").html(data["html"]);
    esconderCarregando();
    // Seleciona automaticamente quando não tem mais que uma opção
    $("#id_responsavel").val($("#id_responsavel option:last").val());
    if ($("#id_gestor option").length == 2) {
      $("#id_gestor").val($("#id_gestor option:last").val())
    }
  });

};

$(function() {
  carregar_responsavel();
});
