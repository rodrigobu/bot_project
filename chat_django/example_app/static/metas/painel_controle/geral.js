function excluir_meta(id_meta) {

  $.dialogs.confirm("Excluir Meta", "Deseja realmente excluir a meta?",
    function() {
      $.ajax({
        url: URL_EXC_META,
        type: 'get',
        dataType: 'json',
        async: false,
        data: {
          id: id_meta
        },
        success: function(dados) {
          $.dialogs.success("Meta excluída com sucesso.");
          consultar();
        }
      });
    });

}

function aprovar_meta(id_meta) {

  $.dialogs.confirm("Aprovar Meta", "Deseja realmente aprovar a meta?",
    function() {
      $.ajax({
        url: URL_APROVAR_META,
        type: 'get',
        dataType: 'json',
        async: false,
        data: {
          id: id_meta
        },
        success: function(dados) {
          $.dialogs.success("Meta aprovada com sucesso.");
          consultar();
        }
      });
    });

}


function criar() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Descrição",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3',
      "mRender": function(data, type, full) {
        return '  <span> <i class="fa fa-circle text-' +  full["class_status"] + '" title="Total Atingido: ' + full["resultado_parcial"] + ', Meta: ' +  full["meta_acordada"] + ' (' + full["unidade"] + ')"></i> ' +
          '  <span class="hidden-md-up"><b>Descrição:</b>&nbsp;</span>' +  full["descricao"] +
          '  <span class="hidden-md-up"><b><br>Tipo:</b>&nbsp;' + full["tipo_responsavel_desc"] + '</span> ' +
          '  <span class="hidden-md-up"><b><br>Responsável:</b>&nbsp;' +  full["responsavel"] + '</span> ' +
          '  <span class="hidden-md-up"><b><br>Data Prevista:</b>&nbsp;' +  full["data_prevista"] + '</span> ' +
          '  <span class="hidden-md-up"><b><br>Data de Encerramento:</b>&nbsp;' + full["data_conclusao"] + '</span> ' +
          '</span> ';
      }
    }, {
      "sTitle": "Responsável",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3 hidden-xs',
      "mRender": function(data, type, full) {
        return '  <span valor="' + full["responsavel"] + '"> ' +
          '  <b>Tipo:</b>&nbsp;' + full["tipo_responsavel_desc"] +
          '  <b><br>Responsável:</b>&nbsp;' + full["responsavel"] +
          '</span> ';
      }
    }, {
      "mData": "Data Prevista",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": function(data, type, full) {
        if (full["data_prevista"]) {
          return ' <div valor="' + full["data_prevista_us"] + '">' +
            full["data_prevista"] + '</div>';
        } else {
          return ""
        }
      }
    }, {
      "mData": "Data de Encerramento",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": function(data, type, full) {
        if (full["data_conclusao"]) {
          return ' <div valor="' + full["data_conclusao_us"] + '">' +
            full["data_conclusao"] + '</div>';
        } else {
          return ""
        }
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        var aprovada = full['aprovada']

        var ver_meta = "<a href='" + URL_DETALHES + full["slug"] + "' title='Ver Detalhes' target='_blank'  class='text-gray'> <i class='"+ICONES_DETALHES+"'></i> </a>";

        if (!TEM_PERMISSAO) {
          HTML += ver_meta;
        } else {
          if (!full["data_conclusao"] && aprovada) {
            HTML += '<a href="' + URL_CADASTRO + full["slug"] +  '" title="Editar Meta" target="_blank" class="text-gray point_click_icon"><i class="'+ICONES_EDIT+'"></i> </a>';
            HTML += '<a href="' + URL_LANCAMENTO + full["slug"] + '" title="Realizar Lançamentos para a Meta" target="_blank" class="text-gray point_click_icon"><i class="fa fa-wrench"></i> </a>';
            HTML += '<a href="' + URL_ENCERRAMENTO + full["slug"] + '" title="Encerrar a Meta" target="_blank" class="text-gray point_click_icon"><i class="fa fa-flag"></i> </a>';
            HTML += '<a title="Excluir Meta" class="text-gray point_click_icon" onclick="excluir_meta(' +  full["metas_id"] + ')"> <i class="'+ICONES_DELETE+'"></i></a>';
          } else {
            HTML += ver_meta;
          }
        }

        if (!aprovada) {
          HTML += '<a title="Aprovar Meta" class="text-green point_click_icon" onclick="aprovar_meta(' +  full["metas_id"] + ')"><i class="'+ICONES_APROVAR+'"></i> </a>';
        }
        return HTML;
      }
    }]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("[name='tipo']").click();
  $("[name='tempo'][value='4']").click();
  $("[name='aprov'][value='3']").click();
  $("#filtro_consulta .collapse-icon").click();
  criar();

  $("#filtrar").click(function(e) {
    e.preventDefault();
    consultar();
  });

});
