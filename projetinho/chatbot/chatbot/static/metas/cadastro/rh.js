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
    $("#id_gestor").val(META_GESTOR_ID_ORIGINAL);
    if (tipo == '1') {
      $("#id_responsavel").change(function() {
        let id_resp = $("#id_responsavel").val();
        let id_gest = $("#id_gestor").val();
        if (id_resp && id_gest) {
            if (id_resp == id_gest) {
              $.get(URL_GET_COLAB_NT_SUPERIOR, {
                "colab": $("#id_responsavel").val()
              }).done(function(data) {
                if (data['nt_superior'] == "false") {
                  $("#id_responsavel").val("");
                  gerate_error_novo("id_responsavel",
                  "O Responsável não pode ser o mesmo que o Responsável pela Apuração da Meta."
                )
              }
            });
          }
        }
      });
      $("#id_gestor").change(function() {
          let id_resp = $("#id_responsavel").val();
          let id_gest = $("#id_gestor").val();
          if (id_resp && id_gest) {
            if (id_resp == id_gest) {
              $.get(URL_GET_COLAB_NT_SUPERIOR, {
                "colab": $("#id_responsavel").val()
              }).done(function(data) {
                if (data['nt_superior'] == "false") {
                  $("#id_gestor").val("");
                  gerate_error_novo("id_gestor",
                  "O Responsável pela Apuração da Meta não pode ser o mesmo que o Responsável."
                )
              }
            });
          }
        }
      });
    }
  });
};

$(function() {
  $("[name='tipo_responsavel']").click(carregar_responsavel);
  $("[name='tipo_responsavel']:first").click();
});
