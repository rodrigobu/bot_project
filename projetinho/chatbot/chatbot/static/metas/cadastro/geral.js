var salvar_meta = function() {

  if (!$('#form_cad_meta').parsley().validate()) {
    return false;
  }

  var meta_acordada = parseFloat($('#id_meta_acordada').val().replace(",",
    "."));
  if (meta_acordada == 0) {
    $.dialogs.error("O campo Meta Acordada não pode ter valor zero.");
    return false;
  }

  $("[name='escalonamentos']").val(get_dados_escalonamentos());

  if ($("[name='alvo_mes']").length != 0) {
    var alvos = [];
    $.each($("[name='alvo_mes']"), function() {
      var value = $(this).val();
      var mes = $(this).attr("data_value");
      if (value != "") {
        alvos.push(mes + ';' + value);
      }
    });
    if (alvos.length != 12) {
      $.dialogs.error(
        "Para metas fracionadas é necessário o preenchimento de valores para todos os meses."
      );
      return false;
    }
    $("[name='fragmentos']").val(alvos.join("|"));
  }

  mostrarCarregando();
  $("#form_cad_meta").submit();
}


$(function() {

  $("#button-id-bt_salvar").click(salvar_meta);
  init_masks_numeros();

});
