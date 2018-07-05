var get_form_colabs = function() {
  // Carrega o campo de colaboradores com base nos setores
  $.ajax({
    url: URL_GET_FORM,
    type: 'get',
    dataType: 'json',
    async:false,
    data: {
      setores: $("#id_setores").val(),
      colaborador: $("#id_colaborador").val() || ID_FEEDBACK_COLAB
      //id_colabs: ID_FEEDBACK_COLAB
    },
    success: function(dados) {
      $("#div_colaboradores").html(dados["html"]);
    }
  });
};

$(function() {

  $("#id_setores").change(get_form_colabs);

});
