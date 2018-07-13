/* Funções que são do Cadastro de PDI e da Edição do PDI para todos os usuários  */

/* Funções gerais */

function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 8 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

var sumir_erros = function() {
  $('.parsley-errors-list').hide();
};

/* Funções relacionadas ao tipo de PDI*/

var hide_filtros_compets = function(){
  $("#compt_modal_body .show_on_cc").hide();
  $("#compt_modal_body .show_on_ct").hide();
};

var show_filtros_compets = function(){
  var tipo = $("#id_tipo").val();
  if (tipo == '1') {
    $("#id_dialog_compt .show_on_cc").show();
    $("#id_dialog_compt .show_on_ct").hide();
  } else {
    $("#id_dialog_compt .show_on_cc").hide();
    $("#id_dialog_compt .show_on_ct").show();
  }
};

var on_model_compt_show = function(event) {
  realizar_pesquisa_compt();
  show_filtros_compets();
};

var realizar_pesquisa_compt = function() {

  var tipo = $("#id_tipo").val();
  var filtro_cc = $("#id_dialog_compt [name=filtro_cc]:checked").val();
  var filtro_ct = $("#id_dialog_compt [name=filtro_ct]:checked").val();

  var colabs_ids = get_colabs_selecionados();

  // Competências já selecionadas
  /*var compets = $("#id_competencias").val();
  var compets_ids = "";
  if (compets) {
    compets_ids = compets.join("|");
  }*/
  var compets = [];
  $.each( $("#table_competencias tr"), function(idx, value){
      compets.push($(value).attr("tr_id"));
  });
  var compets_ids = "";
  if (compets) {
    compets_ids = compets.join("|");
  }
  console.log(compets)

  $("#div_competencias").html(" Carregando as competências ...");
  $("#compt_btn_adicionar, #compt_btn_cancelar").hide();
  hide_filtros_compets();
  $.ajax({
    url: URL_FORM_TIPO,
    type: 'post',
    dataType: 'json',
    data: {
      tipo: tipo,
      "colaboradores": colabs_ids,
      "filtro_cc": filtro_cc,
      "filtro_ct": filtro_ct,
      "compets": compets_ids
    },
    success: function(dados) {
      $("#div_competencias").html(dados["html"]);
      if($("#div_competencias input[type='checkbox']").length!=0){
          $.each(compets, function(idx, value) {
            if(value)
            $("#div_competencias input[type='checkbox'][value='" + value + "']").click();
            console.log("#div_competencias input[type='checkbox'][value='" + value + "']");
          });
          $("#compt_btn_adicionar, #compt_btn_cancelar").show();
      } else {
        $("#compt_btn_cancelar").show();
        $("#compt_btn_adicionar").hide();
      }
      esconderCarregando();
      show_filtros_compets();
    },
    complete: function(){
      $("#compt_btn_adicionar, #compt_btn_cancelar").show();
      esconderCarregando();
      show_filtros_compets();
    }
  });

};
/* Função para adição  de Recursos */


var hide_filtros_recursos = function(){
  $("#recurso_modal_body .show_on_cc").hide();
  $("#recurso_modal_body .show_on_ct").hide();
};

var show_filtros_recursos = function(){
  var tipo = $("#id_tipo").val();
  if (tipo == '1') {
    $("#id_dialog_recursos .show_on_cc").show();
    $("#id_dialog_recursos .show_on_ct").hide();
  } else if (tipo == '2') {
    $("#id_dialog_recursos .show_on_cc").hide();
    $("#id_dialog_recursos .show_on_ct").show();
  } else {
    $("#id_dialog_recursos .show_on_ct").hide();
    $("#id_dialog_recursos .show_on_cc").hide();
  }
};

var on_model_recursos_show = function(event) {
  realizar_pesquisa_recurso();
  show_filtros_recursos();
};

var realizar_pesquisa_recurso = function() {

  var tipo = $("#id_tipo").val();
  var filtro_cc = $("#recurso_modal_body [name=rec_filtro_cc]:checked").val();
  var filtro_ct = $("#recurso_modal_body [name=rec_filtro_ct]:checked").val();
  if (tipo == '1') {
    var filtro_recursos = filtro_cc!='todos'? 'c' : '';
  } else if (tipo == '2') {
    var filtro_recursos = filtro_ct!='todos'? 't' : '';
  } else {
    var filtro_recursos = '';
  }

  var colabs_ids = get_colabs_selecionados();

  // Competências já selecionadas
  /*var compets = $("#id_competencias").val();
  var compets_ids = "";
  if (compets) {
    compets_ids = compets.join("|");
  }*/
  var compets = [];
  $.each( $("#table_competencias tr"), function(idx, value){
      compets.push($(value).attr("tr_id"))
  });
  var compets_ids = "";
  if (compets) {
    compets_ids = compets.join("|");
  }

  // Recursos já selecionadas
  /*var recursos = $("#id_recursos").val();
  var recursos_ids = "";
  if (recursos) {
    recursos_ids = recursos.join("|");
  }*/
  var recursos = [];
  $.each( $("#table_recursos tr"), function(idx, value){
      recursos.push($(value).attr("tr_id"))
  });
  var recursos_ids = "";
  if (recursos) {
    recursos_ids = recursos.join("|");
  }

  $("#div_recursos").html(" Carregando os recursos  de aprendizagem ...");
  $("#recurso_btn_adicionar, #recurso_btn_cancelar").hide();
  hide_filtros_recursos();
  $.ajax({
    url: URL_FORM_RECURSO,
    type: 'post',
    dataType: 'json',
    data: {
      tipo: tipo,
      "compets": compets_ids,
      "colaboradores": colabs_ids,
      "filtro_cc": filtro_cc,
      "filtro_ct": filtro_ct,
      "recursos": recursos_ids,
      "filtro_recursos": filtro_recursos
    },
    success: function(dados) {
      $("#div_recursos").html(dados["html"]);
      if($("#div_recursos input[type='checkbox']").length!=0){
          $.each(recursos, function(idx, value) {
            if(value)
            $("#div_recursos input[type='checkbox'][value='" + value + "']").click();
          });
          $("#recurso_btn_adicionar, #recurso_btn_cancelar").show();
      } else {
        $("#recurso_btn_cancelar").show();
        $("#recurso_btn_adicionar").hide();
      }
      esconderCarregando();
      show_filtros_recursos();
    },
    complete: function(){
      esconderCarregando();
      show_filtros_recursos();
    }
  });

};


$(function() {

  console.log($('#id_recursos').children());

  $("#id_tipo").change(trocar_tipo_pdi);
  $("#id_detalhamento").blur(function(){
    $("#alerta_mudanca_recursos").hide();
  });

  $('#id_dialog_compt').on('show.bs.modal',on_model_compt_show);
  $("#compt_btn_adicionar").click(adicionar_competencias);
  $("#id_dialog_compt [name='filtro_cc']").change(realizar_pesquisa_compt);
  $("#id_dialog_compt [name='filtro_ct']").change(realizar_pesquisa_compt);

  $('#id_dialog_recursos').on('show.bs.modal', on_model_recursos_show);
  $("#recurso_btn_adicionar").click(adicionar_recursos);
  $("#id_rec_filtro_cc, #id_rec_filtro_ct").change(realizar_pesquisa_recurso);


});
