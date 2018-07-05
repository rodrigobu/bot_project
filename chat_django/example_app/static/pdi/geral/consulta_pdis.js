


function excluir_pdi(id_pdi){

  $.dialogs.confirm("Excluir PDI", "Deseja realmente excluir o PDI?", function() {
    $.ajax({
      url : URL_EXC_PDI,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { id : id_pdi },
      success : function(dados) {
        $.dialogs.success("PDI excluído com sucesso.");
        consultar();
      }
    });
  });

}

function criar() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": "Objetivo do PDI",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3',
      "mRender": function(data, type, full) {
        return '  <span> '
        +'  <span class="hidden-md-up"><b>Objetivo do PDI:</b>&nbsp;</span>'+full["descricao"]
        +'  <span class="hidden-md-up"><b><br>O que será feito?:</b>&nbsp;'+full["detalhamento"]+'</span> '
        +'  <span class="hidden-md-up" title="Data Prevista de Encerramento"><b><br>Prev. Encerram.:</b>&nbsp;'+full["data_prevista"]+'</span> '
        +'  <span class="hidden-md-up" title="Data do Próximo Acompanhamento"><b><br>Próx. Acomp.:</b>&nbsp;'+full["data_proximo_acompanhamento"]+'</span> '
        + '</span> ';

      }
    }, {
      "mData": "O que será feito?",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": function(data, type, full) {
          if (full["detalhamento_abr"] != '') {
            if(full["detalhamento"].length>20){
              return "<span title='" + full["detalhamento"] + "' >" +
                 full["detalhamento_abr"] + "...</span>";
            } else {
              return full["detalhamento"]
            }
          } else {
            return "";
          }
      }
    }, {
      "sTitle": "<span title='Data Prevista de Encerramento'>Prev. Encerram.</span>",
      'sType': 'html',
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": function ( data, type, full ) {
          if (full["data_prevista"]) {
            return ' <span class="hidden">' + full["data_prevista_us"] + '</span>' +
              full["data_prevista"];
          } else {
            return ""
          }
        }
    },
    {
      "sTitle": "<span title='Data do Próximo Acompanhamento'>Próx. Acomp.</span>",
      'sType': 'html',
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": function ( data, type, full ) {
          if (full["data_proximo_acompanhamento"]) {
            return ' <span class="hidden">' + full["data_proximo_acompanhamento_us"] + '</span>' +
              full["data_proximo_acompanhamento"];
          } else {
            return ""
          }
        }
    },
    {
      "sTitle": "<span title='Status do Acompanhamento'>Status</span>",
      'sType': 'html',
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 full_column text-center hidden-xs',
      "mRender": function(data, type, full) {
        return "<span style='background-color: " + full[
            "status_color"] +
          "; color:white' class='col-xs-12 center'>" +
          full["status_desc"] + "</span>"
      }
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-sm-1 col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var CONCLUIDO = full["status_pdi_concluido"]=='t';

        var HTML = '';

        var html_ver_pdi =
          "<a href='"+URL_DETALHES+full["slug"]+"' title='Ver Detalhes' class='text-gray '> <i class='"+ICONES_DETALHES+"'></i> </a>";

        var html_acomp_prog_menu = "<a href='"+URL_MANUT_ACOMP_PROG+full["slug"]+"' title='Lista de Acompanhamentos Programados do PDI' class='big_icons text-gray' onclick='abrir_accomp_manu("
          + full["id"] + ")'><i class=' "+ICONES_CLOCK+"'></i></a>";

        var html_editar_pdi = '<a href="' + URL_PDI + full["slug"] +
          '" title="Editar PDI" class="big_icons text-gray"><i class="' + ICONES_EDIT + '"></i> </a>';

        var html_novo_acompanhamento = "<a href='" + URL_NOVO_ACOMP_N_PROG + full["slug"] + "' title='Novo Acompanhamento Não Programado' class='big_icons text-gray' onclick='ver_pdi_acomp("
          + full["id"] + ",'', true)'> <i class='" + ICONES_ADICIONAR + "'></i></a>";



          if (!TEM_PERMISSAO || CONCLUIDO) {
            HTML += html_acomp_prog_menu;
            HTML += html_ver_pdi;
          } else {
            HTML += html_acomp_prog_menu;
            HTML += html_novo_acompanhamento;
            HTML += html_ver_pdi;

            if (!IS_COLAB) {
              HTML += html_editar_pdi;
              HTML +=
                '<a href="#" title="Excluir PDI" class="text-red" onclick="excluir_pdi(' +
                full["id"] + ')"> <i class="fa fa-trash-o"></i></a>';
            }

          }



        var url = URL_PDI + full.colab_id + '/?ref=' + $("#id_ciclo")
          .val();
        return "<div class='row'>" + HTML + "</div>";
      }
    }]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

function excluir_pdi(id_pdi){
  $.dialogs.confirm("Excluir PDI", "Deseja realmente excluir o PDI?", function() {
    $("[id='" + id_pdi + "']").removeAttr("checked");
    $("#qtde_selecionados").html('0');
    $.ajax({
      url : URL_EXC_PDI,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { id : id_pdi },
      success : function(dados) {
        $.dialogs.success("PDI excluído com sucesso.");
        consultar();
      }
    });
  });

}

$(function() {
  criar();

  $("#filtrar").click(function(e) {
    e.preventDefault();
    consultar();
  });
  $(".collapse-icon").click();
});
