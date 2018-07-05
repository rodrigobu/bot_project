/* Funções que são do Cadastro de PDI e servem para todos os tipos de usuários */

/* Funções relacionadas ao tipo de PDI*/

var trocar_tipo_pdi = function() {
  var tipo = $("#id_tipo").val();
  if ($("#table_competencias tr ").length > 0) {
    $.dialogs.confirm("Atenção", "Já existem Competências associadas ao PDI. " +
      " A troca de tipo de PDI implica na exclusão dessas informações. " +
      " Deseja realmente trocar o tipo de PDI? Essa ação não pode ser desfeita. ",
      function() {
        TIPO_ATUAL = $("#id_tipo").val();
        $("#table_competencias").html("");
        if (tipo == "1" || tipo == "2") {
          $("#bt_add_compt").show();
        } else {
          $("#bt_add_compt").hide();
        }
      },
      function() {
        $("#id_tipo").val(TIPO_ATUAL);
      })
  } else {
    TIPO_ATUAL = $("#id_tipo").val();
    if (tipo == "1" || tipo == "2") {
      $("#bt_add_compt").show();
    } else {
      $("#bt_add_compt").hide();
    }
  }
};

var adicionar_competencias = function() {
  competencias = []
  $.each($("#id_competencias").val(), function(idx, value) {
    competencias.push({
      'id': value,
      'descricao': $("#id_competencias [value='" + value + "']").html(),
      'grupo': $("#id_competencias [value='" + value + "']").parent().attr("label")
    })
  });
  montar_tabela_competencias(competencias);
  $("#id_competencias_selecionadas").val($("#id_competencias").val());
  $("#alerta_mudanca_competencias").hide();
}

var montar_tabela_competencias = function(competencias) {
  var tipo = $("#id_tipo").val();
  $("#table_competencias").html("");
  if (!competencias) {
    return false; // senão tiver competencias apenas limpa a tabela
  }
  var TABLE = $('<table>', {
    class: 'table responsive table-striped table-hover',
  });

  if (tipo == '1') { // comportamental
    var HEADER = " <thead> <tr> " +
      "  <th class='col-md-3'>Competência</th> " +
      "  <th class='col-md-8'>Indicador</th> " +
      "  <th class='col-md-1 text-center md_icons'>Excluir</th> " +
      " </tr> </thead>";
    var BODY = " <tbody class='text-black'> ";
    $.each(competencias, function(idx, value) {
      BODY += " <tr tr_id='" + value['id'] + "'> " +
        "  <td>" + value['grupo'] + "</td> " +
        "  <td>" + value['descricao'] + "</td> " +
        "  <td class='text-center big_icons'><a href='#'' title='Excluir indicador' class='text-gray' onclick='excluir_competencia_cc(" + value['id'] + ")'> <i class=' fa fa-trash-o'></i></a></td> " +
        " </tr> ";
    });
    BODY += ' </tbody> ';
  } else {
    var HEADER = " <thead> <tr> " +
      "  <th class='col-md-11'>Competência</th> " +
      "  <th class='col-md-1 text-center md_icons'>Excluir</th> " +
      " </tr> </thead>";
    var BODY = " <tbody class='text-black'> ";
    $.each(competencias, function(idx, value) {
      BODY += " <tr tr_id='" + value['id'] + "'> " +
        "  <td>" + value['descricao'] + "</td> " +
        "  <td class='text-center big_icons'><a href='#'' title='Excluir Competência' class='text-gray' onclick='excluir_competencia_ct(" + value['id'] + ")'> <i class='text-gray fa fa-trash-o'></i></a></td> " +
        " </tr> ";
    });
    BODY += ' </tbody> ';
  }
  TABLE.html(HEADER + BODY)
  $("#table_competencias").append(TABLE);
};

var excluir_competencia_ct = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir a competência?",
    function() {
        $("#table_competencias [tr_id='" + id + "']").remove()
        var comps = [];
        $.each( $("#table_competencias tr"), function(idx, value){
            comps.push($(value).attr("tr_id"))
        });
         $("#id_competencias").val(comps);
    }
  );
};

var excluir_competencia_cc = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o indicador?",
    function() {
      $("#table_competencias [tr_id='" + id + "']").remove()
      var comps = [];
      $.each( $("#table_competencias tr"), function(idx, value){
          comps.push($(value).attr("tr_id"))
      });
       $("#id_competencias").val(comps);
    }
  );
};

/* Função para adição  de Recursos */

var adicionar_recursos = function() {
  recursos = []
  var detalhamento =  $("#id_detalhamento").val()
  $.each($("#id_recursos").val(), function(idx, value) {
    especificacao = $("#id_recursos [data-value='" + value + "']").attr("especificacao");
    // pega somente o texto da descrição, sem o html do ícone ao lado
    descricao = $("#id_recursos [value='" + value + "']").text().split('\n').filter(i => i != '')[0].trim();
    recursos.push({
      'id': value,
      'descricao': descricao,
      'grupo': $("#id_recursos [value='" + value + "']").parent().attr("label"),
      'especificacao': especificacao
    });
    if(especificacao){
       detalhamento += "- " + especificacao + "\n";
    }
  });
  montar_tabela_recursos(recursos);
  $("#id_recursos_selecionados").val($("#id_recursos").val());
  $("#id_detalhamento").val(detalhamento);
  if($("#id_detalhamento").val().replace(" ","")!=""){
      $("#alerta_mudanca_recursos").show();
  } else {
      $("#alerta_mudanca_recursos").hide();
  }
}

var montar_tabela_recursos = function(recursos) {
  var tipo = $("#id_tipo").val();
  $("#table_recursos").html("");
  if (!recursos) {
    return false; // senão tiver recursos apenas limpa a tabela
  }
  var TABLE = $('<table>', {
    class: 'table responsive table-striped table-hover',
  });

  var HEADER = " <thead> <tr> " +
    "  <th class='col-md-11'>Recurso de Aprendizagem</th> " +
    "  <th class='col-md-1 text-center md_icons'>Excluir</th> " +
    " </tr> </thead>";
  var BODY = " <tbody class='text-black'> ";
  $.each(recursos, function(idx, value) {
    BODY += " <tr tr_id='" + value['id'] + "' especificacao='" + value['especificacao'] + "'> " +
      "  <td>" + value['descricao'] + "</td> " +
      "  <td class='text-center big_icons'><a href='#'' title='Excluir Recurso de Aprendizagem' class='text-gray' onclick='excluir_recurso(" + value['id'] + ")'> <i class='fa fa-trash-o'></i></a></td> " +
      " </tr> ";
  });
  BODY += ' </tbody> ';

  TABLE.html(HEADER + BODY)
  $("#table_recursos").append(TABLE);
};

var excluir_recurso = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o recurso?",
    function() {
      var elemento = "#table_recursos [tr_id='" + id + "']";
      var detalhamento =  $("#id_detalhamento").val();
      var especificacao =  $(elemento).attr("especificacao");
      detalhamento = detalhamento.replace( "- " + especificacao + "\n", "");
      $("#id_detalhamento").val(detalhamento);
      $(elemento).remove()

      var comps = [];
      $.each( $("#table_recursos tr"), function(idx, value){
          comps.push($(value).attr("tr_id"))
      });
      $("#id_recursos_selecionados").val(comps);
      if($("#id_detalhamento").val().replace(" ","")!=""){
          $("#alerta_mudanca_recursos").show();
      } else {
          $("#alerta_mudanca_recursos").hide();
      }
    }
  );
};


/* Funções para as datas dos acompanhamentos */

var text_date = function(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "/").split("/").reverse().join("/");
};

var _gerar_data = function (qntd_acomp_colab, qtde_dias, data_de_inicio, ajuste) {
  var lista_datas = [];
  var data_de_inicio = new Date(data_de_inicio);
  for (var i = 0; i < qntd_acomp_colab; i++) {
    data_de_inicio = new Date(
      data_de_inicio.getFullYear(),
      data_de_inicio.getMonth(),
      data_de_inicio.getDate() + parseInt(qtde_dias) + ajuste
    );
    lista_datas.push(
      '<span>' + data_de_inicio.toISOString().slice(0, 10).replace(/-/g, "/").split("/").reverse().join("/") + '</span>'
    );
    ajuste = 0;
  }
  return lista_datas;
};

var validar_preenchimento = function(campo, mensagem) {
  if (!$("#id_" + campo).val()) {
    return true;
  }
  if (parseInt($("#id_" + campo).val()) == 0) {
    $("#help_block_" + campo).html(mensagem + " não pode ser zero.");
    $("#id_" + campo).val("");
    return false;
  }
  if (parseInt($("#id_" + campo).val()) < 0) {
    $("#help_block_" + campo).html(mensagem + " não pode ser negativo.");
    $("#id_" + campo).val("");
    return false;
  }
  return true;
};

const getQuantidade = (tipo) => {
  let qntdConcluidos = $(`#div_datas_${tipo} span span.concluido`).length;

  if (qntdConcluidos) {
    return parseInt($(`#id_n_acomp_${tipo}_edit`).val()) - qntdConcluidos;
  } else {
    return $(`#id_n_acomp_${tipo}_edit`).val();
  }
}

const getDataInicio = (tipo) => {
  return $("#id_dt_inicio").val().length
    ? $("#id_dt_inicio").val().split("/").reverse()
    : null;
}


var gerar_data_prevista = function(){
    // Gera a data prevista para o encerramento do PDI
    var datas_colab = [];
    if($("#id_datas_acomp_colab").val()!=""){
       var datas_colab = $("#id_datas_acomp_colab").val().split(",")
    }
    var datas_gestor = [];
    if($("#id_datas_acomp_gestor").val()!=""){
       var datas_gestor = $("#id_datas_acomp_gestor").val().split(",")
    }
    datas_todas = datas_colab.concat(datas_gestor)

    if(datas_todas){
        var ultima_data = datas_todas.sort(function(a,b){
          return new Date(b.replace(" ","").split("/").reverse().join("-")) - new Date(a.replace(" ","").split("/").reverse().join("-"));
        });
        if(ultima_data.length!=0){
            ultima_data = ultima_data[0].replace(" ","");
        } else {
            ultima_data = "";
        }
    } else {
      ultima_data = "";
    }
    $("#id_data_prevista").val(ultima_data);
};

var montar_acompanhamentos_gestor = function () {
  // - Ao trocar alguns campos, realiza a validação e montagem das datas de
  // acompanhamento do PDI
  // Se nada for alterado, não executa nada.
  if ($('#id_n_acomp_gestor_edit').val() === document.n_acomp_gestor_edit_inicial && $('#id_facomp_gestor_edit').val() === document.facomp_gestor_edit_inicial)
    return;

  // Limpa os erros
  $("#table_acompanhamentos .help-block").html("");

  $(".danger").removeClass("danger");

  // Validação do preenchimento dos campos de frequencia e quantidade
  if (!validar_preenchimento("n_acomp_gestor_edit", "Apenas números acima de 0.")) {
    return;
  }
  if (!validar_preenchimento("facomp_gestor_edit", "Apenas números acima de 0.")) {
    return;
  }

  // Capta a data de star dos acompanhamentos
  var data = getDataInicio('gestor');

  if (!data) {
    $.dialogs.error('Data de Início não preenchida.');
    return; // Cancela a operação se não houver data de início.
  }

  data[2] = parseInt(data[2]);
  var ajuste_auto = data[2] == 31;
  if (data[2] != 31) {
    data[2] = (data[2] + 1).toString();
  }
  if (parseInt(data[2]) < 10) data[2] = "0" + data[2];
  var data_de_inicio = data.join("-");

  var n_acomp_gestor = getQuantidade('gestor');
  var facomp_gestor = $("#id_facomp_gestor_edit").val();
  if (n_acomp_gestor != "" && facomp_gestor != "") {
    // Se ambos os campos estão preenchidos, gera as datas
    var ajuste = ajuste_auto ? 1 : 0;
    var qntd_acomp_gestor = parseInt(n_acomp_gestor);
    var lista_datas_gestor = _gerar_data(qntd_acomp_gestor, facomp_gestor, data_de_inicio, ajuste);
    var datas = lista_datas_gestor.join(", ");
    var datas_list = lista_datas_gestor.map(e => $(e).text());

    $.get(URL_VALIDA_DATAS_ACOMP, {
        'datas_list[]': datas_list,
        'tipo': 'gestor'
      })
      .done((res) => {
        let datasNaoConcluidas = $("#div_datas_gestor span span:not(.concluido)");

        if (res.ok) {
          datasNaoConcluidas.remove();

          // let htmlToAppend = datas_all.length !== datasConcluidas.length ? '' : ', ';
          let htmlToAppend = '';

          let datasToUpdate = [];
          $.each(res.datas_list, (idx, value) => {
            htmlToAppend += value != res.datas_list[res.datas_list.length - 1] ?
              `<span>${value}, </span>` :
              `<span>${value}.</span>`;
            datasToUpdate.push(value);
          });

          // $("#div_datas_gestor > span").text('');
          $("#div_datas_gestor > span").append(htmlToAppend);
          $("#id_datas_acomp_gestor").val(datasToUpdate.join(','));

          gerar_data_prevista();

        } else {
          datasNaoConcluidas.remove();
          $("#id_datas_acomp_gestor").val('');
          let msg = res.msg === 'supera' ?
            `As datas geradas ultrapassam a data limite: ${res.data_limite}.` :
            'As datas limite dos acompanhamentos de Colaborador e Gestor não foram cadastradas.\nFavor entrar em contato com o RH.'
          $.dialogs.error(msg);
        }
      });
  } else if (n_acomp_gestor == '' || facomp_gestor == '') {
    // Se uma delas esta vazia, apaga as datas
    $("#div_datas_gestor span span:not(.concluido)").remove();
    $("#id_datas_acomp_gestor").val('');
  }
};


var montar_acompanhamentos_colab = function () {
  // - Ao trocar alguns campos, realiza a validação e montagem das datas de
  // acompanhamento do PDI
  // Se nada for alterado, não executa nada.

  // Limpa os erros
  $("#table_acompanhamentos .help-block").html("");

  $(".danger").removeClass("danger");

  // Validação do preenchimento dos campos de frequencia e quantidade
  if (!validar_preenchimento("n_acomp_colab_edit", "Apenas números acima de 0.")) {
    return;
  }
  if (!validar_preenchimento("facomp_colab_edit", "Apenas números acima de 0.")) {
    return;
  }

  // Capta a data de star dos acompanhamentos
  var data = getDataInicio('colab');

  if (!data) {
    $.dialogs.error('Data de Início não preenchida.');
    return; // Cancela a operação se não houver data de início.
  }

  data[2] = parseInt(data[2]);
  var ajuste_auto = data[2] == 31;
  if (data[2] != 31) {
    data[2] = (data[2] + 1).toString();
  }
  if (parseInt(data[2]) < 10) data[2] = "0" + data[2];
  var data_de_inicio = data.join("-");

  var n_acomp_colab = getQuantidade('colab');
  var facomp_colab = $("#id_facomp_colab_edit").val();
  if (n_acomp_colab != "" && facomp_colab != "") {
    // Se ambos os campos estão preenchidos, gera as datas
    var ajuste = ajuste_auto ? 1 : 0;
    var qntd_acomp_colab = parseInt(n_acomp_colab);
    var lista_datas_colab = _gerar_data(qntd_acomp_colab, facomp_colab, data_de_inicio, ajuste);
    var datas = lista_datas_colab.join(", ");
    let datas_list = lista_datas_colab.map(e => $(e).text());

    $.get(URL_VALIDA_DATAS_ACOMP, {
        'datas_list[]': datas_list,
        'tipo': 'colab'
      })
      .done((res) => {
        let datasNaoConcluidas = $("#div_datas_colab span span:not(.concluido)");

        if (res.ok) {
          datasNaoConcluidas.remove();

          // let htmlToAppend = datas_all.length !== datasConcluidas.length ? '' : ', ';
          let htmlToAppend = '';
          let datasToUpdate = [];
          if (res.datas_list) {
            $.each(res.datas_list, (idx, value) => {
              htmlToAppend += value != res.datas_list[res.datas_list.length - 1] ?
                `<span>${value}, </span>` :
                `<span>${value}.</span>`;
              datasToUpdate.push(value);
            });
          }
          // $("#div_datas_colab > span").text('');
          $("#div_datas_colab > span").append(htmlToAppend);
          $("#id_datas_acomp_colab").val(datasToUpdate.join(','));

          gerar_data_prevista();

        } else {
          datasNaoConcluidas.remove();
          $("#id_datas_acomp_gestor").val('');
          let msg = res.msg === 'supera' ?
            `As datas geradas ultrapassam a data limite: ${res.data_limite}.` :
            'As datas limite dos acompanhamentos de Colaborador e Gestor não foram cadastradas.\nFavor entrar em contato com o RH.'
          $.dialogs.error(msg);
        }
      });
  } else if (n_acomp_colab == '' || facomp_colab == '') {
    // Se uma delas esta vazia, apaga as datas
    $("#div_datas_colab span span:not(.concluido)").remove();
    $("#id_datas_acomp_colab").val('');
  }
};

var abrir_edicao_datas = function(tipo){
  var datas = $("#div_datas_"+tipo).find("span").html().replace(" ", "").split(",")
  $("#div_datas_"+tipo).append("<div id='div_datas_"+tipo+"_edita'></div>");
  $.each( datas, function(idx, value){
     $("#div_datas_"+tipo+"_edita").append(
         ' <div class="col-md-7"><div class="input-group" style="margin: 2px;"> '
        +'    <div class="input-group-addon"> <i class="linecons-calendar"></i> </div> '
        +'    <input class="form-control  datepicker" value="'+value+'" id="id_data_'+tipo+'_'+idx+'" '
        +'     format="dd/mm/yyyy" inputmask="dd/mm/yyyy">  '
        +' </div> </div> '
     );
     make_datepicker("#id_data_"+tipo+"_"+idx);
  });
  $("#div_datas_"+tipo+"_edita").append(
     '<div class="col-md-3">'
    +' <a id="salva_datas_'+tipo+'" class="point_click_icon big_icons text-gray" title="Confirmar a edição" onclick="salvar_edicao_datas(\''+tipo+'\')" > <i class="fa fa-floppy-o"></i>  </a> '
    +' <a id="calcel_datas_'+tipo+'" class="point_click_icon big_icons text-gray" title="Cancelar a edição" onclick="cancelar_edicao_datas(\''+tipo+'\')" > <i class="fa fa-remove"></i>  </a> '
    +' </div> '
  );
  $("#div_datas_"+tipo+" span, #edit_datas_"+tipo).hide();
};

var cancelar_edicao_datas = function(tipo){
    $("#div_datas_"+tipo+"_edita").remove();
    $("#div_datas_"+tipo+" span, #edit_datas_"+tipo).show();
};

var salvar_edicao_datas = function(tipo){
  var datas = [];
  var todas_preenchidas = true;
  var repetida = false;
  $.each($("#div_datas_"+tipo+"_edita .datepicker"), function(idx, value){
     var data = $(value).val();
     if(data.replace(" ","")=="" && todas_preenchidas){
         todas_preenchidas = false
     }
     if(datas.indexOf(data)!=-1 && !repetida){
         repetida = true
     }
     datas.push(data);
  });

  if(!todas_preenchidas){
     $.dialogs.error("","É necessário preencher todas as datas para confirmar a edição.");
     return false;
  }
  if(repetida){
     $.dialogs.error("","Existem datas repetidas. Favor corrigir antes de confirmar a edição das datas.");
     return false;
  }

  $("#div_datas_"+tipo+"_edita").remove();
  $("#div_datas_"+tipo+" span, #edit_datas_"+tipo).show();
  datas =  datas.sort(function(a,b){
    return new Date(b.replace(" ","").split("/").reverse().join("-")) - new Date(a.replace(" ","").split("/").reverse().join("-"));
  }).reverse()
  $("#div_datas_"+tipo).find("span").html(datas.join(","))
  $("#id_datas_acomp_"+tipo).val(datas.join(","));
  gerar_data_prevista();
};

var validar_pdi = function() {
  $(".danger").removeClass("danger");
  if(!$('#form_pdi').parsley().validate()){
    return false;
  }
  // Checar campos de acompanhamentos
  $("#id_n_acomp_gestor_edit").val($("#id_n_acomp_gestor_edit").val().replace(/ /g, ''));
  var n_acomp_gestor = $("#id_n_acomp_gestor_edit").val();
  var n_acomp_gestor_prrench = n_acomp_gestor != "";

  $("#id_facomp_gestor_edit").val($("#id_facomp_gestor_edit").val().replace(/ /g, ''));
  var facomp_gestor = $("#id_facomp_gestor_edit").val();
  var facomp_gestor_prrench = facomp_gestor != "";

  $("#id_n_acomp_colab_edit").val($("#id_n_acomp_colab_edit").val().replace(/ /g, ''));
  var n_acomp_colab = $("#id_n_acomp_colab").val();
  var n_acomp_colab_prrench = n_acomp_colab != "";

  $("#id_facomp_colab_edit").val($("#id_facomp_colab_edit").val().replace(/ /g, ''));
  var facomp_colab = $("#id_facomp_colab_edit").val();
  var facomp_colab_prrench = facomp_colab != "";

  var gestor_embranco = !n_acomp_gestor_prrench && !facomp_gestor_prrench;
  var colab_embranco = !n_acomp_colab_prrench && !facomp_colab_prrench;

  var colabValid = ($('#id_n_acomp_colab_edit').val().length > 0 && $('#id_facomp_colab_edit').val().length > 0);
  var gestorValid = ($('#id_n_acomp_gestor_edit').val().length > 0 && $('#id_facomp_gestor_edit').val().length > 0);

  let dataGestor = $('#div_datas_gestor > span span')

  if ( colab_embranco && gestor_embranco ) {
    $.dialogs.error("É necessário inserir ao menos um acompanhamento (Gestor ou Colaborador).");
    return false;
  }

  if (!($('#id_n_acomp_colab_edit').val().length > 0 && $('#id_facomp_colab_edit').val().length > 0) && !($('#id_n_acomp_gestor_edit').val().length > 0 && $('#id_facomp_gestor_edit').val().length > 0)) {
    $.dialogs.error("É necessário inserir tanto a quantidade quanto a frequência do acompanhamento.");
    if (!gestorValid) {
      $("#tr_gestor").addClass("danger");
    }
    if (!colabValid) {
      $("#tr_colab").addClass("danger");
    }
    return false;
  }




  // Case das competências obrigatórias para o tipo de PDI
  var tipo = $("#id_tipo").val();
  if (tipo == "1" || tipo == "2") {
    if ($("#table_competencias tr").length == 0) {
      $.dialogs.error("É obrigatório a adição de pelo menos uma competência para o tipo de PDI escolhido.");
      return false;
    }
  }

};

const validateQntdeAcomp = tipo => {
  let qntde_acomps = $(`#id_n_acomp_${tipo}_edit`).val();
  let qntde_acomps_elem = $(`#id_n_acomp_${tipo}_edit`);

  if (!qntde_acomps.length) {
    $.dialogs.error('O campo de quantidade não foi preenchido.');
    return;
  }

  let datasConcluidas = $(`#div_datas_${tipo} span span.concluido`);

  if (qntde_acomps < datasConcluidas.length) {
    $.dialogs.error(`A quantidade de acompanhamentos não pode ser menor que o número de acompanhamentos já concluídos.`);
    qntde_acomps_elem.val(datasConcluidas.length);
    return;
  }

  $.get(URL_VALIDA_QNTDE_ACOMP, {
      'qntde_acomps': qntde_acomps,
      'tipo': tipo
    })
    .done(function (data) {
      let elem_edit = $(`#id_n_acomp_${data.tipo}_edit`);

      if (!data.ok) {
        let tipoColab = data.tipo === 'colab' ? 'Colaborador' : 'Gestor';
        let msg = `A quantidade máxima de acompanhamentos do ${tipoColab} é ${data.qntde_max}.`;
        elem_edit.val(data.qntde_max);
        $.dialogs.error(msg);
      } else {
        if (tipo === 'colab') montar_acompanhamentos_colab()
        else montar_acompanhamentos_gestor();
      }
    });
}

$(function() {
  $('#id_n_acomp_colab_edit').focus(() => {
    document.n_acomp_colab_anterior = $('#id_n_acomp_colab_edit').val();
  });
  $('#id_n_acomp_gestor_edit').focus(() => {
    document.n_acomp_gestor_anterior = $('#id_n_acomp_gestor_edit').val();
  });

  $('#id_n_acomp_colab_edit, #id_facomp_colab_edit').on('input', () => {
    if ($('#id_n_acomp_colab_edit').val().length) {
      validateQntdeAcomp('colab');
    }
  });

  $('#id_n_acomp_gestor_edit, #id_facomp_gestor_edit').on('input', () => {
    if ($('#id_n_acomp_gestor_edit').val().length) {
      validateQntdeAcomp('gestor');
    }
  });

  // $('#id_n_acomp_colab, #id_facomp_colab').change(montar_acompanhamentos_colab);
  // $('#id_n_acomp_gestor, #id_facomp_gestor').change(montar_acompanhamentos_gestor);

  $('#form_pdi').submit(validar_pdi);

});
