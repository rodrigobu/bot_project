var criar_lista_movimentacoes = function() {
  TABELA_CONSULTA_MV = $.DataTableXenon({
    json: URL_GET_MOVIMENTACOES,
    container: "listagem_movimentacoes",
    filterForm: '#filtro_consulta',
    order:  [[ 0, "desc" ]],
    aoColumns: [{
      "mData": "Data da Ação",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return ' <div valor="' + full["data_realizada_hard"] + '">' +
          full["data_realizada"] + '</div>';
      }
    }, {
      "mData": "Responsável pela Alteração",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full["responsavel"];
      }
    }, {
      "mData": "Ação Realizada",
      'orderable': false,
      'searchable': true,
      'class': 'col-md-8',
      "mRender": function(data, type, full) {
        return full["ocorrencia"];
      }
    }]
  });
};

var atualizar_lista_movimentacoes = function() {
  TABELA_CONSULTA_MV.reload();
};

$(function() {

  criar_lista_movimentacoes();

});
