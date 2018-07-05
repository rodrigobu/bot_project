
var validar_niveis = function(avaliar, min, ideal) {
  // Níveis - Validação dos Níveis
  if (avaliar && (!min && ideal)) {
    return TXT_VAL_NIVEL_1;
  } else if (avaliar && (min && !ideal)) {
    return TXT_VAL_NIVEL_2;
  } else if (avaliar && (!min && !ideal)) {
    return TXT_VAL_NIVEL_3;
  } else if ((min && ideal) && (min > ideal)) {
    return TXT_VAL_NIVEL_4;
  };
};


var validar_ct = function(tr) {
  // Faz a validação das funções (avaliar, nivel e nivel minimo) tanto de cognitivas qnt das aptidões
  var id_ct = tr.attr("ct_id");

  tr.find("#erro_" + id_ct).remove();
  tr.removeClass('danger').removeAttr("title");

  var avaliar = $("[name='avaliar_ct_" + id_ct + "']").is(':checked');
  var min = $("[name='nivel_min_" + id_ct + "']").val();
  if (min == '-1') {
    min = "";
  }
  var ideal = $("[name='nivel_ideal_" + id_ct + "']").val();
  if (ideal == '-1') {
    ideal = "";
  }

  var msg_niveis_invalidos = validar_niveis(avaliar, min, ideal);
  if (msg_niveis_invalidos) {
    var html_alerta = '<i id="erro_' + id_ct +
        '" class="red fa fa-exclamation-triangle bigger-120" data-original-title="" title="' +
        msg_niveis_invalidos + '"></i>';
    tr.find("#td_descricao_" + id_ct).prepend(html_alerta);
    tr.addClass('danger').attr("title", msg_niveis_invalidos);
    return false;
  }

  return true;
};


var validar_descricao_ct = function(tr) {
  // valida se já existe uma ct com a descricao informada
  var id_ct = tr.attr('ct_id');
  tr.removeClass('danger');

  var texto = tr.find("[name='texto_ct_" + id_ct + "']").val();
  var to_return = false;

  mostrarCarregando()
  $.ajax({
    url: URL_VALIDAR_DESCR_CT_VALIDAR,
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {
      'id_ct': id_ct,
      'texto': texto
    },
    success: function(data) {
      if (data['status'] == "nok") {
        $.dialogs.error(data['msg']);
        to_return = false;
      } else {
        to_return = true;
      }
    },
    complete: esconderCarregando
  });

  return to_return;
};


var aplicar_change_cts = function() {
  //-- Aplica os eventos de change das cts
  /* Ao alterar qualquer campo da mesma linha, envia o elemento da linha para
  validação/ salvamento
  */

  $('#div_questao .select_nivel_min, #div_questao .select_nivel_ideal').on('change', function(e) {
    // para os selects precisa disso uma vez que não atualiza os valores durante o evento de change
    $(this.options).not(this.options[this.options.selectedIndex]).removeAttr('selected');
    $(this.options[this.options.selectedIndex]).prop('selected', true).attr('selected', 'selected');
    if (validar_ct($(this).closest('tr')))
      atualizar_ct($(this).closest('tr'));
  });

  $('#div_questao .avaliar_ct').on('change', function(e) {
    if (validar_ct($(this).closest('tr')))
      atualizar_ct($(this).closest('tr'));
  });


};


var aplicar_change_cts_validar = function() {
  //-- Aplica os eventos de change das cts que são novas
  /* Ao alterar qualquer campo da mesma linha, envia o elemento da linha para
  validação/ salvamento
  */

  $('#div_questao_validar .select_nivel_min, #div_questao_validar .select_nivel_ideal').live('change', function(e) {
    e.preventDefault();
    $(this.options).not(this.options[this.options.selectedIndex]).removeAttr('selected');
    $(this.options[this.options.selectedIndex]).prop('selected', true).attr('selected', 'selected');
    return atualizar_ct_validar($(this).closest('tr'));
  });

  $('#div_questao_validar .avaliar_ct').live('change', function(e) {
    e.preventDefault();
    return atualizar_ct_validar($(this).closest('tr'));
  });

  $('#div_questao_validar .texto_ct').live('change', function(e) {
    e.preventDefault();
    return atualizar_ct_validar($(this).closest('tr'));
  });

  $('#div_questao_validar .remover_ct').live('click', function(e) {
    e.preventDefault();
    return remover_ct_validar($(this).closest('tr'));
  });

};


var gerar_questao = function(tipo) {
  // Monta as tabelas de competẽncias e novas competências ou a tabela com as
  // aptidões para coleta
  mostrarCarregando()
  $.ajax({
    url: URL_GERAR_QUESTAO,
    type: 'POST',
    dataType: 'json',
    data: {
      'tipo': tipo
    },
    success: function(data) {
      if (tipo == INDICE_CT) {
        // Geração de competências
        $("#coletaController").html(data['html']);
        aplicar_change_cts();
        gerar_questao_para_validar();
      } else if (tipo == INDICE_APTIDAO) {
        // Geração de Aptidões
        // Aplica o evento para remover/ adicionar a aptidão sempre que for selecionada
        $("#coletaController").html(data['html']);
        $('#coletaController .avaliar_ct').on('change', function(e) {
          atualizar_ct_nc($(this).closest('tr'));
        });
      } else if (tipo == INDICE_FINALIZAR) {
        // redireciona para o encerramento
        if(data['valida']){
          window.location.href = URL_FINALIZAR;
        } else {
          $.dialogs.error(data['msg']);
        }
      }
      esconderCarregando();
    }
  });

};


var gerar_questao_para_validar = function(tipo) {
  // Monta as tabelas de novas competências
  mostrarCarregando()
  $.ajax({
    url: URL_GERAR_QUESTAO_VALIDAR,
    type: 'POST',
    dataType: 'json',
    data: {
      'tipo': tipo
    },
    success: function(data) {
      $("#div_questao_validar").html(data['html']);
      esconderCarregando();
    }
  });

};


var atualizar_ct = function(tr) {
  //-- Salva a configuração da competencia tecnica
  mostrarCarregando();
  var id_ct = tr.attr('ct_id');

  var avaliar = $("[name='avaliar_ct_" + id_ct + "']").is(':checked');
  var min = $("[name='nivel_min_" + id_ct + "']").val();
  if (min == '-1') {
    min = "";
  }

  var ideal = $("[name='nivel_ideal_" + id_ct + "']").val();
  if (ideal == '-1') {
    ideal = "";
  }

  $.ajax({
    url: URL_GERAR_QUESTAO,
    type: 'post',
    assync: false,
    data: {
      id_ct: id_ct,
      nivel: ideal ? ideal : '',
      nivel_min: min ? min : '',
      avaliar: avaliar ? 'on' : ''
    },
    success: function(dados) {
      if (dados['status'] == 'nok') {
        $.dialogs.error(dados['msg']);
      }
    },
    complete: esconderCarregando
  });
};


var atualizar_ct_nc = function(tr) {
  mostrarCarregando();
  var id_ct = tr.attr('ct_id');
  var avaliar = $("[name='avaliar_ct_" + id_ct + "']").is(':checked');
  $.ajax({
    url: URL_GERAR_QUESTAO,
    type: 'post',
    assync: false,
    data: {
      id_ct: id_ct,
      avaliar: avaliar ? 'on' : ''
    },
    success: function(dados) {
      if (dados['status'] == 'nok') {
        $.dialogs.error(dados['msg']);
      }
    },
    complete: esconderCarregando
  });
};


var atualizar_ct_validar = function(tr) {
  // Valida e atualiza as cts novas para cadastro
  var id_ct = tr.attr('ct_id');
  tr.removeClass('danger');

  var texto = tr.find("[name='texto_ct_" + id_ct + "']").val();

  var avaliar = tr.find("[name='avaliar_ct_" + id_ct + "']").is(':checked');
  var min = tr.find("[name='nivel_min_" + id_ct + "']").val();
  if (min == '-1') {
    min = "";
  }

  var ideal = tr.find("[name='nivel_ideal_" + id_ct + "']").val();
  if (ideal == '-1') {
    ideal = "";
  }

  if (texto.replace(/ /g, '') == '') {

    $.dialogs.error(TXT_VAL_PREENCHER_CT_DESCRICAO);
    tr.addClass('danger');
    to_return = false;
    valor = tr.find("[name='texto_ct_" + id_ct + "']").attr("data-default-value");
    tr.find("[name='texto_ct_" + id_ct + "']").val(valor)

  } else if (!validar_descricao_ct(tr)) {
    tr.addClass('danger');
    valor = tr.find("[name='texto_ct_" + id_ct + "']").attr("data-default-value");
    tr.find("[name='texto_ct_" + id_ct + "']").val(valor);
    to_return = false;

  } else if (!avaliar && ideal == "" && min == "") {

    $.dialogs.error(TXT_VAL_PREENCHER_CT_VALIDAR);
    tr.addClass('danger');
    to_return = false;

  } else {

    var to_return = false;
    if (validar_ct(tr)) {

      mostrarCarregando();
      tr.find("[name='texto_ct_" + id_ct + "']").attr("data-default-value", texto)
      $.ajax({
        url: URL_GERAR_QUESTAO_VALIDAR,
        type: 'post',
        assync: false,
        data: {
          'salvar': 'salvar',
          id_ct: id_ct,
          texto: texto,
          nivel: ideal ? ideal : '',
          nivel_min: min ? min : '',
          avaliar: avaliar ? 'on' : ''
        },
        success: function(dados) {
          if (dados['status'] == 'nok') {
            $.dialogs.error(dados['msg']);
          } else {
            to_return = true;
            if( id_ct=='' ) {
               gerar_questao_para_validar();
               $("#btn_add_ct_para_validar").attr("onclick", "add_ct_para_validar()").removeClass('btn-disable');
            } else {
              if( $("[name='texto_ct_']").length == 0 ){
                  $("#btn_add_ct_para_validar").attr("onclick", "add_ct_para_validar()").removeClass('btn-disable');
              }
            }

          }
        },
        complete: esconderCarregando
      });

    }

  }
  return to_return;
};


var add_ct_para_validar = function() {
  // Adiciona uma nova linha na tabela de competencias para adicionar.

  var HTML = ' <tr class="linha_ct" ct_id=""> ' +
    '<td class="col-md-6" id="td_descricao_"> ' +
    '<input class="col-md-12 texto_ct" type="text" name="texto_ct_" data-default-value="" max_length="' + MAX_LEGTH_DESC_C_VALIDAR + '" />' +
    '</td>' +
    '<td class="col-md-1 center"  style=" margin-left: 8px;">' +
    '<input type="checkbox" name="avaliar_ct_" value="true" class="avaliar_ct" checked="checked"/>' +
    '</td>' +
    '<td class="col-md-2 center">' +
    '<select class="col-md-12 select_nivel_min" style=" margin-left: 8px;" name="nivel_min_">' + HTML_OPTIONS_ESCALA + '</select>' +
    '</td>' +
    '<td class="col-md-2 center">' +
    '<select class="col-md-12 select_nivel_ideal"  style=" margin-left: 8px;"  name="nivel_ideal_">' + HTML_OPTIONS_ESCALA + '</select>' +
    '</td>' +
    '<td class="col-md-1 center" id="td_remover_ct_">' +
    '<a class="remover_ct" title="'+ TXT_REMOVER +'" > <i class="' + ICONE_DELETE + '"></i></a>' +
    '</td>' +
  '</tr>';
  $("#tbody_validar").append(HTML);
  $("#btn_add_ct_para_validar").removeAttr("onclick").addClass('btn-disable');
}


var remover_ct_validar = function(tr){
  // Remove uma competência para adicão
  $.dialogs.confirm(  TXT_TITLE_CONFIRM, TXT_MSG_CONFIRM, function(){
      var id_ct = tr.attr('ct_id');
      if ( id_ct == "" ){
         // Removendo algo que não foi salvo ainda
         tr.remove()
         $("#btn_add_ct_para_validar").attr("onclick", "add_ct_para_validar()").removeClass('btn-disable');
      } else {
        // Removendo uma ct_validar já salva
        mostrarCarregando();
        $.ajax({
          url: URL_REMOVER_QUESTAO_VALIDAR,
          type: 'post',
          assync: false,
          data: {
            id_ct: id_ct,
          },
          success: function(dados) {
            if (dados['status'] == 'nok') {
              $.dialogs.error(dados['msg']);
            } else {
              to_return = true;
              tr.remove()
            }
          },
          complete: esconderCarregando
        });
      }
    }
  )

}


$(function() {
  $(window).off('resize.ace_hover');
  gerar_questao(INDICE_CT);
  aplicar_change_cts_validar();
});
