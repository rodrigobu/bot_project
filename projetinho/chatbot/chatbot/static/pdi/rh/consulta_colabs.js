
var consultar = function() {
  if($("#id_setor").val()==null){
      $.dialogs.error("É preciso escolher pelo menos um setor.");
  } else {
      TABELA_CONSULTA.reload();
  }
}
