var motivo_json = function () {
  $.get(URL_MOTIVO_ANOTACAO)
    .done(function (data) {
      $("#True").html(data["html"]);
      $('#True').parsley();
      $('#True').show();
      $('#cancelar_modificar_senha').show();
      $('#modificar_senha').hide();
      $("#user_id").change(function () {
        data = serializaForm("#form_feedback");
        $("#campos_extra").html("");

      });
    });
};

$(function () {
  $("#True").html("");
  $('#True').hide();
  $('#motivo').click(motivo_json);
  $('#feedback').click(function () {
    $("#True").html("");
    $('#True').hide();

  });

});

