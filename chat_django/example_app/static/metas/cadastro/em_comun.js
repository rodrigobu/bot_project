var remover_obg_limite = function() {
  $("label[for='limite']").find(".text-danger").hide();
  $("label[for='limite']").find(".badge").show();
  $("#id_limite").removeAttr("required");
}

var colocar_obg_limite = function() {
  $("label[for='limite']").find(".text-danger").show();
  $("label[for='limite']").find(".badge").hide();
  $("#id_limite").attr("required", "required");
}

var remover_obg_tipo_apuracao = function() {
  $("label[for='tipo_apuracao']").find(".text-danger").hide();
  $("label[for='tipo_apuracao']").find(".badge").show();
  $("#id_tipo_apuracao").removeAttr("required");
}

var colocar_obg_tipo_apuracao = function() {
  $("label[for='tipo_apuracao']").find(".text-danger").show();
  $("label[for='tipo_apuracao']").find(".badge").hide();
  $("#id_tipo_apuracao").attr("required", "required");
}
