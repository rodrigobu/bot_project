$(function() {

  $("#btn_salvar_simples").click(function() {
    var valor = $("#id_valor_atingido").val();
    $.ajax({
      url: URL_LANCAMENTO_SIMPLES,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        valor: valor
      },
      success: function(dados) {
        $.dialogs.success("Valor salvo com sucesso.");
      }
    });
  });

})
