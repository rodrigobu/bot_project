var iniciarcoleta = function() {
  // Valida a seleçlão e starta a coleta
  if ($("[name='checkbox_funcao_ncf_tec']:checked").length != 0) {
    
    mostrarCarregando();
    $("#form_coleta_ncf_tec").submit();

  } else {

    $.dialogs.error(TXT_VAL_ESCOLHER_FUNCAO);
    esconderCarregando();

  }
};

$(function() {

  if ($("[name='checkbox_funcao_ncf_tec']").length == 0) {
    // se nenhuma coleta estiver disponível, remove o botão de avançar
    $("#bnt_iniciarcoleta").hide();
  } else {
    // Se tiver pelo menos uma dispónível, seleicona por padrão a primeira
    $("[name='checkbox_funcao_ncf_tec']:first").click()
  }

});
