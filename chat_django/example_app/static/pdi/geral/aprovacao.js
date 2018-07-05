
function marcar_ck_todos(){
  // - Atualiza o check de marcar todos de acordo com os cks marcados
  var todos_marcados = true;
  $.each($("[name=selecionar-colab]"), function(chk, idx) {
    if(!$(idx).is(":checked")){
        todos_marcados = false;
    }
  });
  if(todos_marcados & $("[name=selecionar-colab]").length!=0){
     $("[name=selecionar-todas]").attr("checked", "checked");
     $("[name=selecionar-todas]").prop("checked", "checked");
  } else {
     $("[name=selecionar-todas]").removeAttr("checked");
  }
};

function salvar_marcacao_checkbox(checkbox) {
  // - Seleciona o pdi e grava na lista (individual)
  marcado = $(checkbox).is(":checked");
  marcar_ck_todos();

  $.ajax({
    url: URL_MARCAR_PDIS,
    type: 'get',
    dataType: 'json',
    data: {
      id_pdi: $(checkbox).attr("id"),
      marcado: marcado
    },
    success: function(dados) {
      atualizar_qtde(dados["qtde"]);
    }
  });
};

function salvar_marcacao_todos(){
    // - Seleciona os pdis e grava na lista (em lote)
    if(  $('[name=selecionar-colab]').length != 0 ){

      marcado = $(this).is(":checked");
      if (marcado) {
        $("[name=selecionar-colab]").attr("checked", "checked");
        $("[name=selecionar-colab]").prop("checked", "checked");
      } else {
        $("[name=selecionar-colab]").removeAttr("checked");
      }

      var ids_pdis = $.map($("[name=selecionar-colab]"), function(chk, idx) {
        return $(chk).attr("id");
      }).join(',');

      $.ajax({
        url: URL_MARCAR_PDIS,
        type: 'get',
        dataType: 'json',
        data: {
          'ids_pdis': ids_pdis,
          'marcado': marcado
        },
        success: function(dados) {
          atualizar_qtde(dados["qtde"]);
        }
      });
      return true;

  } else {
    $(this).removeAttr("checked");
    return false;

  }
}

function selecionar_nenhum() {
  // - Remove todos os PDI's selecionados
  $.dialogs.confirm('Limpar Seleção', 'Deseja realmente desmarcar todos os PDI\'s?', function() {
    mostrarCarregando();
    $.ajax({
      url: URL_DESMARCAR_TODOS,
      type: 'get',
      data: {},
      dataType: 'json',
      success: function() {
        $("[name='selecionar-colab']").removeAttr("checked");
        $("[name='selecionar-todas']").removeAttr("checked");
        atualizar_qtde('0');

      },
      complete: esconderCarregando
    });
  });
};

function remove_checked() {
  // Limpa todos os checked na exclusão
    $.ajax({
      url: URL_DESMARCAR_TODOS,
      type: 'get',
      data: {},
      dataType: 'json',
      success: function() {
        $("[name='selecionar-colab']").removeAttr("checked");
        $("[name='selecionar-todas']").removeAttr("checked");
        atualizar_qtde('0');

      },
      complete: esconderCarregando
    });
}

function selecionar_marcados(){
  // Seleciona os ids marcados que estão na página
  $.ajax({
    url: URL_GET_MARCADOS,
    type: 'get',
    cache: false,
    dataType: 'json',
    async: false,
    success: function(retorno) {
      $.each(retorno["ids"], function(idx, value) {
        if (value!=""){
            $("input#"+ value).attr("checked", "checked");
        }
      });
      atualizar_qtde(retorno["ids"].length);
      marcar_ck_todos();
    }
  });
};

function atualizar_qtde(qtde) {
  //-- Atualiza a quantidade de PDI's marcados
  $("#qtde_selecionados").html(qtde);
};

function aprovar_pdi(id_pdi) {
  //-- Aprova um pdi
  $.dialogs.confirm("Aprovar PDI", "Deseja realmente aprovar o PDI?", function() {
    $.ajax({
      url: URL_APROVAR_UNICO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        id_pdi: id_pdi
      },
      success: function(dados) {
        $.dialogs.success("PDI aprovado com sucesso.");
        consultar();
      }
    });
  });
};

function aprovar_todos(){
    //-- Aprovar todos os PDI's
    $.dialogs.confirm("Aprovar PDI's", "Deseja realmente aprovar todos os PDI's selecionados?", function() {
      $.ajax({
        url: URL_APROVAR,
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        success: function(dados) {
            $.dialogs.success("PDI(s) aprovado(s) com sucesso.");
            consultar();
        }
      });
    });
};

function excluir_pdi(id_pdi){
  var qtde = $("#qtde_selecionados").html();
  var t = parseInt(qtde);
  var qtde_att = t - 1;
  var qtde_att_final = String(qtde_att);
  $("#qtde_selecionados").html('0');
  // $("#qtde_selecionados").html(qtde_att);

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

function excluir_todos_pdi(){
  var checks = $(".checkbox_colab");
  // var checkeds = $("input[checked]");
  var escape = 0;
  var i = 0;
  $.dialogs.confirm("Excluir PDI's", "Deseja realmente excluir todos os PDI's selecionados?", function() {
    for(i = 0; i < checks.length; i++){
      if (checks[i].checked == true){
        escape = 1;
        $.ajax({
          url : URL_EXC_PDI,
          type : 'get',
          dataType : 'json',
          async : false,
          data : { id : checks[i].id },
          success : function(dados) {
            consultar();
          }
        });
        }
      }
      remove_checked();
      if (escape == 1){
        $.dialogs.success("PDI's excluídos com sucesso.");
    }
  });
}

function criar() {
  //-- Criação e configuração da listagem
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable",
    filterForm: '#filtro_consulta',
    order: [[ 1, "asc" ]],
    aoColumns: [
    {
      "sTitle": "<input class='center' name='selecionar-todas' type='checkbox'>",
      'sType': 'html',
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center',
      "mRender": function(data, type, full) {
        return "<input class='center checkbox_colab' id='" + full["id"] + "' name='selecionar-colab' type='checkbox'>";
      }
    }, {
        "mData": "Colaborador",
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4 hidden-md-up',
        "mRender": function ( data, type, full ) {
            var html = '<div class="row" data="'+ full.colab_nome +'"> <div class="col-xs-12 col-md-1 text-center">	<div class="center"> <span class="profile-picture center">';
            html += ' <img src="'+ VER_FOTO + full.colab_id+'" class="img-circle img-inline userpic-52" width="52">';
            html += '  </span>	</div> </div>	<div class="col-xs-12 col-md-11 user-name">';
            html += ' 	<p class="text-primary">'+ full.colab_nome +'</p> '
            +'  <span><b><br>O que será feito?:</b>&nbsp;'+full["detalhamento"]+'</span> '
            +'  <span><b><br>Data Prevista:</b>&nbsp;'+full["data_prevista"]+'</span> ';
            html += '  </div>';
            return html;
        }
      },
      {
        "mData": "Foto",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 center hidden-xs',
        "mRender": function ( data, type, full ) {
            return '<img src="'+ VER_FOTO +full.colab_id+'" class="img-circle img-inline userpic-32" width="42">';
        }
     }, {
      "mData": "Colaborador",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3 hidden-xs',
      "mRender": render_basico("colab_nome")
    }, {
      "mData": "Objetivo do PDI",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": function(data, type, full) {
            return full["descricao"];
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
    },{
      "mData": "Data Prevista",
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": render_basico("data_prevista")
    }, {
      "mData": "Ações",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = "<a href='#' title='Aprovar PDI' class='text-green' onclick='aprovar_pdi(" +
        full["id"] + ")'><i class='fa fa-check'></i></a>";
        HTML += "<a href='"+URL_DETALHES+full["slug"]+"' title='Ver Detalhes' class='text-gray'> <i class='fa fa-eye'></i> </a>";
        if (IS_SUPERUSER == 'False'){
          HTML += "<a href='"+URL_PDI_BREADCUMBS_GESTOR+full["slug"]+"' title='Editar PDI' class='text-gray'> <i class='fa fa-edit'></i> </a>";
          HTML += "<a href='#' title='Excluir PDI' class='text-gray' onclick='excluir_pdi("+full["id"]+")'> <i class='fa fa-trash-o'> </i> </a>";
        } else {
          HTML += "<a href='"+URL_PDI_BREADCUMBS_RH+full["slug"]+"' title='Editar PDI' class='text-gray'> <i class='fa fa-edit'></i> </a>";
          HTML += "<a href='#' title='Excluir PDI' class='text-gray' onclick='excluir_pdi("+full["id"]+")'> <i class='fa fa-trash-o'> </i> </a>";
        }

        return HTML;
      }
    }],
    complete: function(){
        selecionar_marcados();
        //-- Cria a ação de selecionar todos os colaboradores da pagina
        $("[name=selecionar-todas]").change(salvar_marcacao_todos);
        $("[name=selecionar-colab]").change(function() {
          salvar_marcacao_checkbox(this);
        });
    }
  });
  selecionar_marcados();
}

function consultar() {
  //-- Reload na listagem
  TABELA_CONSULTA.reload();
};


$(function() {
  criar();

  $("#filtrar").click(function(e) {
    e.preventDefault();
    consultar();
  });

  $('#selecionar_nenhum').click(selecionar_nenhum);
  $('#aprovar_todos').click(aprovar_todos);


});
