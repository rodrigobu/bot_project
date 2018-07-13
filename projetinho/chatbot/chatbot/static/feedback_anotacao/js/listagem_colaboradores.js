var TABELA_CONSULTA = undefined;
function criar_lista_feedback() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_FEEDBACK,
    container: "datatable_feedback",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TITULO_COLABORADOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": function(data, type, full) {
          var html = '<div class="row" data="' + full.nome + '"> <div class="col-xs-12 col-md-1 text-center">	<div class="center"> <span class="profile-picture center">';
          html += ' <img src="'+ VER_FOTO + full.colab_id + '" class="img-circle img-inline userpic-52" width="52">';
          html += '  </span>	</div> </div>	<div class="col-xs-12 col-md-11 user-name">';
          html += ' 	<p class="text-primary">' + full.nome + '</p> ';
          html += ' 	<span><b>'+TITULO_SETOR+':</b> ' + full.setor_desc + '</span><br> ';
          html += ' 	<span><b>'+TITULO_FUNCAO+':</b> ' + full.funcao_desc + '</span> ';
          html += '  </div>';
          return html;
        }
      },
      {
        "mData": TITULO_DETALHES,
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          return '<a href="colab/' + full.colab_id + '/' +  $("#id_ciclo").val() + '" title="'+TITULO_DETALHES+'" class="text-gray">' +
            ' <i class="center ' + ICONES_DETALHES + '"></i>' +
            '</a>';
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar_lista_feedback();
});

$("#filtrar").click(function(e) {
  e.preventDefault();
  consultar();
});
