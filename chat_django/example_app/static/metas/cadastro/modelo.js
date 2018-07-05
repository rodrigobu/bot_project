var carregar_modelo = function() {
  mostrarCarregando();
  var tipo_anterior = $("#id_tipo_apuracao").val();
  $.get(URL_FORM_MODELO, {
    "tipo": $("[name='modelo']:checked").val()
  }).done(function(data) {
    $("#div_modelo").html(data["html"]);
    init_masks_numeros();
    $("#id_tipo_apuracao").val(tipo_anterior);


    if ($("[name='modelo']:checked").val() == '2') {

      $("#id_meta_acordada").attr("readonly", "readonly");
      $("[name='alvo_mes'], #painel_fracionada #id_tipo_apuracao").change(
        function() {
          var tipo = $("#id_tipo_apuracao").val();
          if (tipo == '2') {
            var soma = 0;
            $.each($("[name='alvo_mes']"), function(idx, value) {
              if ($(value).val() == "") return;
              soma += parseFloat($(value).val().replace(",", "."));
              soma = Math.round(soma * 100) / 100;
            });
            $("#id_meta_acordada").val(soma.toString().replace(".", ","));
          } else if (tipo == '1') {
            var soma = 0;
            var total = 0;
            $.each($("[name='alvo_mes']"), function(idx, value) {
              if ($(value).val() == "") return;
              soma += parseFloat($(value).val().replace(",", "."));
              total += 1;
            });
            if (total != 0) {
              var media = soma / total;
              media = Math.round(media * 100) / 100;
            } else {
              var media = 0;
            }
            $("#id_meta_acordada").val(media.toString().replace(".",
              ","));
          } else if (tipo == '3') {
            var ultimo = '';
            $.each($("[name='alvo_mes']"), function(idx, value) {
              if ($(value).val() == "") return;
              ultimo = $(value).val();
            });
            $("#id_meta_acordada").val(ultimo);
          } else {
            $("#id_meta_acordada").val();
          }
        });

    } else if ($("[name='modelo']:checked").val() == '1') {

      $("#id_meta_acordada").removeAttr("readonly");
      $("#id_fragmentada_simples").change(function() {
        if ($(this).is(":checked")) {
          $(".show_on_lancamentos").show();
          colocar_obg_tipo_apuracao();
        } else {
          $(".show_on_lancamentos").hide();
          remover_obg_tipo_apuracao();
        }
      });
      $("#id_fragmentada_simples").change();

    } else {
      $("#id_meta_acordada").removeAttr("readonly");
    }

  });
};

$(function() {

  $("[name='modelo']").change(carregar_modelo);
  $("[name='modelo']:first").click();

});
