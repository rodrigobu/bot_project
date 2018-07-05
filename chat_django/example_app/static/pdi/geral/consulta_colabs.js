
var TABELA_CONSULTA = undefined;

function criar() {
  var get_status = function(full){
      var status = full["status"].split("|");
      return "<span style='background-color: " + status[1] +
        "; color:white' class='col-xs-12 center'>" +
        status[0] + "</span>"
  }
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable",
    filterForm: '#filtro_consulta',
    order: [[ 0, "asc" ]],
    aoColumns: [{
        "mData": "Colaborador",
        'orderable': true,
        'searchable': true,
        'class': 'col-md-5',
        "mRender": function ( data, type, full ) {
            var html = '<div class="row" data="'+ full.nome +'"> <div class="col-xs-12 '+CLASSE_FOTO_COLAB+' text-center">	<div class="center"> <span class="profile-picture center">';
            html += ' <img src="'+ VER_FOTO +full.colab_id+'" class="img-circle img-inline userpic-52" width="52">';
            html += '  </span>	</div> </div>	<div class="col-xs-12  '+CLASSE_DET_COLAB+' user-name">';
            html += ' 	<p class="text-primary">'+ full.nome +'</p> ';
            html += ' 	<span><b>Setor:</b> '+ full.setor_desc +'</span><br> ';
            html += ' 	<span><b>Função:</b> '+ full.funcao_desc +'</span> '
            +'  <span class="hidden-md-up"><b><br>Nº de Acomp.:</b>&nbsp;'+full["n_acomp"]+'</span> '
            +'  <span class="hidden-md-up"><b><br>Nº de PDI\'s:</b>&nbsp;'+full["n_pdi"]+'</span> '
            +'  <span class="hidden-md-up"><b><br>Status:</b>&nbsp;'+get_status(full)+'</span> ';
            html += '  </div>';
            return html;
        }
      },{
        "mData": "Nº de PDI's",
        'orderable': true,
        'searchable': true,
        'class':'col-md-2 text-center hidden-xs',
        "mRender": render_basico("n_pdi")
      }, {
        "sTitle": "<span title='Nº de Acompanhamentos'>Nº de Acomp.</span>",
        'sType': 'html',
        "mData": "Nº de Acompanhamentos",
        'orderable': true,
        'searchable': true,
        'class':'col-md-2 text-center hidden-xs',
        "mRender": render_basico("n_acomp")
      }, {
        "sTitle": "<span title='Status dos Acompanhamentos'>Status do Acomp.</span>",
        'sType': 'html',
        "mData": "Status",
        'orderable': true,
        'searchable': true,
        'class':'col-md-2 full_column text-center hidden-xs',
        "mRender":  function(data, type, full) {
          return get_status(full)
        }
      },{
        "mData": "Detalhes",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center md_icons',
        "mRender": function(data, type, full) {
          var url = URL_CONSULTA + full.colab_id + '/?ref=' + $("#id_ciclo").val();
          return '<a href="' + url + '" title="Ver PDI\'s" class="big_icons text-gray" >' +
            ' <i class="'+ICONES_PDI+'"></i>' +
            '</a>';
        }
      }
    ]

  });
};

var consultar = function() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar();

  $("#filtrar").click(function(e) {
    e.preventDefault();
    consultar();
  });

});
