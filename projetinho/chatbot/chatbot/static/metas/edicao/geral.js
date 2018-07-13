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
        $("#id_meta_acordada").val(media.toString().replace(".", ","));
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

});
