

function excluir_recurso(id_pdi) {

  $.dialogs.confirm("Excluir Recurso", "Deseja realmente excluir o Recurso de Aprendizagem?", function() {
    $.ajax({
      url : URL_EXC_RECURSO,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { id : id_pdi },
      success : function(dados) {
        $.dialogs.success("Recurso de Aprendizagem excluído com sucesso.");
        location.reload();
      }
    });
  });
}
