


function criar() {
  var get_status = function(full){
    if(full['programado']=='y'){
      return "<span style='background-color: " + full[
          "status_color"] +
        "; color:white' class='col-xs-12 center'>" +
        full["status_desc"] + "</span>";
    } else {
      return ""
    }
  }

  var get_programado = function(full){
    if(full['programado']=='y'){
      return "<span class='col-xs-12 center text-green'>Programado</span>";
    } else {
      return "<span class='col-xs-12 center text-warning'>Não Programado</span>";
    }
  }

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_LISTA_ACOMPS,
    container: "datatable",
    filterForm: '#form_acomp_n_prog',
    aoColumns: [{
      "mData": "Responsável",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3',
      "mRender": function(data, type, full) {
        return '  <span> '
        +'  <span class="hidden-md-up"><b>Responsável:</b>&nbsp;</span>'+full["responsavel"]
        +'  <span class="hidden-md-up"><b><br>Data Prevista:</b>&nbsp;'+full["data_prevista"]+'</span> '
        +'  <span class="hidden-md-up"><b><br>Data Realizado:</b>&nbsp;'+full["data_realizada"]+'</span> '
        +'  <span class="hidden-md-up"><b><br>Status:</b>&nbsp;'+get_status(full)+'</span> '
        + '</span> ';

      }
    }, {
      "sTitle": "Data Prevista",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-1 text-center hidden-xs',
      "mRender": render_basico("data_prevista")
    },{
      "sTitle": "Data Realizado",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-1 text-center hidden-xs',
      "mRender": render_basico("data_realizada")
    }, {
      "mData": "Acompanhamento",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": function(data, type, full) {
          if (full["acompanhamento_abr"] != '') {
            if(full["acompanhamento"].length>20){
              return "<span title='" + full["acompanhamento"] + "' >" +
                full["acompanhamento_abr"] + "...</span>";
            } else {
              return full["acompanhamento"]
            }
          } else {
            return "";
          }
      }
    },{
      "sTitle": "Status",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 full_column text-center hidden-xs',
      "mRender": function(data, type, full) {
        return get_status(full);
      }
    },{
      "sTitle": "Tipo",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 full_column text-center md_icons',
      "mRender": function(data, type, full) {
        return get_programado(full);
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center md_icons point_click_icon',
      "mRender": render_acoes
    }]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar();

  $("[name='filtro_acomp']").click(consultar);
  $("[name='filtro_programado']").click(consultar);

});
