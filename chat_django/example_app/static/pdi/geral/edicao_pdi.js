var trocar_tipo_pdi = function() {
  var tipo = $("#id_tipo").val();
  if (tipo == "1" || tipo == "2") {
    var mensagem = " A troca de tipo de PDI implica na exclusão dessas informações quando forem adicionadas as novas competências.";
  } else {
    var mensagem = " A troca de tipo de PDI implica na exclusão dessas informações quando o PDI for salvo.";
  }
  if ($("#table_competencias tr ").length > 0) {
    $.dialogs.confirm("Atenção", "Já existem Competências associadas ao PDI. " + mensagem +
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
    montar_tabela_competencias();
  }
};

var adicionar_competencias = function() {
    var tipo = $("#id_tipo").val();
    var compets = $("#id_competencias").val();
    var compets_ids = "";
    if (compets) {
      compets_ids = compets.join(",");
    }
    $.ajax({
      url: URL_SALVAR_COMPETENCIAS,
      type: 'post',
      dataType: 'json',
      data: {
        'tipo': tipo,
        'competencias_selecionadas':compets_ids
      },
      success: function(dados) {
        montar_tabela_competencias();
        $("#alerta_mudanca_competencias").hide();
      }
    });
}

var montar_tabela_competencias = function() {
  $.ajax({
    url: URL_GET_COMPETENCIAS,
    type: 'post',
    dataType: 'json',
    data: {
      tipo_atual : $("#id_tipo").val()
    },
    success: function(dados) {
      $("#table_competencias").html(dados["html"]);
    }
  });
};

var excluir_competencia_ct = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir a competência?",
    function() {
      $.ajax({
        url: URL_EXCLUIR_COMPETENCIAS,
        type: 'post',
        dataType: 'json',
        data: {
          'competencias_id': id
        },
        success: function(dados) {
          montar_tabela_competencias();
        }
      });
    }
  );
};

var excluir_competencia_cc = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o indicador?",
    function() {
      $.ajax({
        url: URL_EXCLUIR_COMPETENCIAS,
        type: 'post',
        dataType: 'json',
        data: {
          'competencias_id': id
        },
        success: function(dados) {
          montar_tabela_competencias();
        }
      });

    }
  );
};

var adicionar_recursos = function() {
    var tipo = $("#id_tipo").val();
    var recursos = $("#id_recursos").val();
    var recursos_ids = "";
    if (recursos) {
      recursos_ids = recursos.join(",");
    }
    $.ajax({
      url: URL_SALVAR_RECURSOS,
      type: 'post',
      dataType: 'json',
      data: {
        'tipo': tipo,
        'recursos_selecionados':recursos_ids
      },
      success: function(dados) {
        montar_tabela_recursos();
        var detalhamento =  $("#id_detalhamento").val();
        $.each($("#id_recursos").val(), function(idx, value) {
          especificacao = $("#id_recursos [data-value='" + value + "']").attr("especificacao");
          if(especificacao!=""){
             detalhamento += "- " + especificacao + "\n";
          }
        });
        $("#id_detalhamento").val(detalhamento);
        if($("#id_detalhamento").val().replace(" ","")!=""){
            $("#alerta_mudanca_recursos").show();
        } else {
            $("#alerta_mudanca_recursos").hide();
        }
      }
    });
}

var montar_tabela_recursos = function(recursos) {
  $.ajax({
    url: URL_GET_RECURSOS,
    type: 'post',
    dataType: 'json',
    data: {},
    success: function(dados) {
      $("#table_recursos").html(dados["html"]);
    }
  });
};

var excluir_recurso = function(id) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o recurso?",
    function() {
        var elemento = "#table_recursos [reg_id='" + id + "']";
        var detalhamento =  $("#id_detalhamento").val();
        var descricao =  $(elemento).attr("descricao");
        var especificacao =  $(elemento).attr("especificacao");
        $.ajax({
          url: URL_EXCLUIR_RECURSOS,
          type: 'post',
          dataType: 'json',
          data: {
            'recursos_id': id
          },
          success: function(dados) {
            montar_tabela_recursos();
            detalhamento = detalhamento.replace( " - " + descricao + ": " + especificacao, "");
            $("#id_detalhamento").val(detalhamento);
            $(elemento).remove()
            if($("#id_detalhamento").val().replace(" ","")!=""){
                $("#alerta_mudanca_recursos").show();
            } else {
                $("#alerta_mudanca_recursos").hide();
            }
          }
        });

    }
  );
};

var validar_pdi = function() {
  if(!$('#form_pdi').parsley().validate()){
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

  let colabValid = ($('#id_n_acomp_colab_edit').val().length > 0 && $('#id_facomp_colab_edit').val().length > 0);
  let gestorValid = ($('#id_n_acomp_gestor_edit').val().length > 0 && $('#id_facomp_gestor_edit').val().length > 0);

  if (colab_embranco && gestor_embranco) {
    $.dialogs.error("É necessário inserir ao menos um acompanhamento (Gestor ou Colaborador).");
    return false;
  }

  if (!colabValid || !gestorValid) {
    $.dialogs.error("É necessário inserir tanto a quantidade quanto a frequência do acompanhamento.");
    if (!gestorValid) {
      $("#tr_gestor").addClass("danger");
    }
    if (!colabValid) {
      $("#tr_colab").addClass("danger");
    }
    return false;
  }
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
      '<span>'+data_de_inicio.toISOString().slice(0, 10).replace(/-/g, "/").split("/").reverse().join("/")+'</span>'
    );
    ajuste = 0;
  }
  return lista_datas;
};

var validar_preenchimento = function (campo, mensagem) {
  if (!$("#id_" + campo).val()) {
    return true;
  }
  if (parseInt($("#id_" + campo).val()) == 0) {
    $("#help_block_" + campo).html(mensagem);
    $("#id_" + campo).val("");
    return false;
  }
  if (parseInt($("#id_" + campo).val()) < 0) {
    $("#help_block_" + campo).html(mensagem);
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
  let datas_concluidas = $(`#div_datas_${tipo} span span.concluido`);
  if (datas_concluidas.length) {
    return $(datas_concluidas[datas_concluidas.length - 1]).text().replace(', ','').split("/").reverse();
  } else {
    return $("#id_dt_inicio").val().split("/").reverse();
  }
}

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
            htmlToAppend += value != res.datas_list[res.datas_list.length - 1]
              ? `<span>${value}, </span>`
              : `<span>${value}.</span>`;
            datasToUpdate.push(value);
          });

          // $("#div_datas_gestor > span").text('');
          $("#div_datas_gestor > span").append(htmlToAppend);
          $("#id_datas_acomp_gestor").val(datasToUpdate.join(','));

        gerar_data_prevista();

        } else {
          datasNaoConcluidas.remove();
          $("#id_datas_acomp_gestor").val('');
          let msg = res.msg === 'supera'
            ? `As datas geradas ultrapassam a data limite: ${res.data_limite}.`
            : 'As datas limite dos acompanhamentos de Colaborador e Gestor não foram cadastradas.\nFavor entrar em contato com o RH.'
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
              htmlToAppend += value != res.datas_list[res.datas_list.length - 1]
                ? `<span>${value}, </span>`
                : `<span>${value}.</span>`;
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
          let msg = res.msg === 'supera'
            ? `As datas geradas ultrapassam a data limite: ${res.data_limite}.`
            : 'As datas limite dos acompanhamentos de Colaborador e Gestor não foram cadastradas.\nFavor entrar em contato com o RH.'
          $.dialogs.error(msg);
        }
      });
  } else if (n_acomp_colab == '' || facomp_colab == '') {
    // Se uma delas esta vazia, apaga as datas
    $("#div_datas_colab span span:not(.concluido)").remove();
    $("#id_datas_acomp_colab").val('');
  }
};

var gerar_data_prevista = function () {
  // Gera a data prevista para o encerramento do PDI
  var datas_colab = [];
  if ($("#id_datas_acomp_colab").val() != "") {
    datas_colab = $("#id_datas_acomp_colab").val().split(",")
  }
  var datas_gestor = [];
  if ($("#id_datas_acomp_gestor").val() != "") {
    datas_gestor = $("#id_datas_acomp_gestor").val().split(",")
  }
  if (datas_colab && datas_gestor)
    datas_todas = datas_colab.concat(datas_gestor);

  if (datas_todas.length) {
    var ultima_data = datas_todas.sort(function (a, b) {
      return new Date(b.replace(" ", "").split("/").reverse().join("-")) - new Date(a.replace(" ", "").split("/").reverse().join("-"));
    });
  } else {
    ultima_data = "";
  }
  $("#id_data_prevista").val(ultima_data[0]);
}

var salvar_edicao_datas = function (tipo) {
  var datas = [];
  var todas_preenchidas = true;
  var repetida = false;
  let datasNaoConcluidas = $(`#div_datas_${tipo} span span:not(.concluido)`);

  $.each($("#div_datas_" + tipo + "_edita .datepicker"), function (idx, value) {
    var data = $(value).val();
    if (data.replace(" ", "") == "" && todas_preenchidas) {
      todas_preenchidas = false
    }
    if (datas.indexOf(data) != -1 && !repetida) {
      repetida = true
    }
    datas.push(data);
  });

  if (!todas_preenchidas) {
    $.dialogs.error("", "É necessário preencher todas as datas para confirmar a edição.");
    return false;
  }
  if (repetida) {
    $.dialogs.error("", "Existem datas repetidas. Favor corrigir antes de confirmar a edição das datas.");
    return false;
  }

  $("#div_datas_" + tipo + "_edita").remove();
  $("#div_datas_" + tipo + " span, #btn_edit_acomp_" + tipo).show();
  let datas_list = datas.sort(function (a, b) {
    return new Date(b.replace(" ", "").split("/").reverse().join("-")) - new Date(a.replace(" ", "").split("/").reverse().join("-"));
  }).reverse();

  $.get(URL_VALIDA_DATAS_ACOMP, {
      'datas_list[]': datas_list,
      'tipo': `${tipo}`
    })
    .done((res) => {
      let datasConcluidas = $(`#div_datas_${tipo} span span.concluido`);
      let datasNaoConcluidas = $(`#div_datas_${tipo} span span:not(.concluido)`);
      let hasConcluidas = Boolean(datasConcluidas.length);

      if (res.ok) {
        datasNaoConcluidas.remove();
        $(`#div_datas_${tipo} > span`).append(datas_list.map(e => {
          return e != datas_list[datas_list.length - 1]
          ? `<span>${e}, </span>`
          : `<span>${e}.</span>`;
        }).join(""));

        $("#id_datas_acomp_" + tipo).val(datas_list.join(","));
        $("#id_data_prevista").val(res.datas_list[datas_list.length - 1]);

      } else {
        $(`#id_datas_acomp_${tipo}`).val('');
        let msg = res.msg === 'supera'
          ? `As datas geradas ultrapassam a data limite: ${res.data_limite}.`
          : 'As datas limite dos acompanhamentos de Colaborador e Gestor não foram cadastradas.\nFavor entrar em contato com o RH.'
        $.dialogs.error(msg);
        cancelar_edicao_datas(tipo);
      }
    });
};

var cancelar_edicao_datas = function (tipo) {
  $("#div_datas_" + tipo + "_edita").remove();
  $("#div_datas_" + tipo + " span, #btn_edit_acomp_" + tipo).show();
};

var abrir_edicao_datas = function (tipo) {
  var datas = $(`#div_datas_${tipo} span span:not(.concluido)`).get().map(e => $(e).text());
  $("#div_datas_" + tipo).append("<div id='div_datas_" + tipo + "_edita'></div>");
  $.each(datas, function (idx, value) {

    $("#div_datas_" + tipo + "_edita").append(
      ' <div class="col-md-7"><div class="input-group" style="margin: 2px;"> ' +
      '    <div class="input-group-addon"> <i class="linecons-calendar"></i> </div> ' +
      '    <input class="form-control  datepicker" value="' + value + '" id="id_data_' + tipo + '_' + idx + '" ' +
      '     format="dd/mm/yyyy" inputmask="dd/mm/yyyy">  ' +
      ' </div> </div> '
    );
    make_datepicker("#id_data_" + tipo + "_" + idx);
  });
  $("#div_datas_" + tipo + "_edita").append(
    '<div class="col-md-3">' +
    `<a id="salva_datas_' + tipo + '" class="point_click_icon big_icons text-gray" title="Confirmar a edição" onclick="salvar_edicao_datas('${tipo}')" > <i class="fa fa-floppy-o"></i>  </a> ` +
    `<a id="calcel_datas_' + tipo + '" class="point_click_icon big_icons text-gray" title="Cancelar a edição" onclick="cancelar_edicao_datas('${tipo}')" > <i class="fa fa-remove"></i>  </a> ` +
    ' </div> '
  );
  $(`#div_datas_${tipo} span, #btn_edit_acomp_${tipo}`).hide();
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

const escondeBtnEdicaoDatas = tipo => {
  if (!$(`#div_datas_${tipo} span span:not(.concluido)`).length)
    $(`#btn_edit_acomp_${tipo}`).hide()
  else
    $(`#btn_edit_acomp_${tipo}`).show();
}

const escondeBtnEdicaoDatasAmbos = () => {
  escondeBtnEdicaoDatas('colab');
  escondeBtnEdicaoDatas('gestor');
}

var STATUS_OLD = $("#id_status").val();

$(function() {

  escondeBtnEdicaoDatasAmbos();

  $('#btn_edit_acomp_colab').click(() => {
    abrir_edicao_datas('colab');
  });
  $('#btn_edit_acomp_gestor').click(() => {
    abrir_edicao_datas('gestor');
  });

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

   if($("#id_tipo").val()=='1' || $("#id_tipo").val()=='2' ){
       montar_tabela_competencias();
   }
   $("#id_tipo").change();
   montar_tabela_recursos();
   $('#form_pdi').submit(validar_pdi);

   $("#id_status").change(function(){
        if( $(this).val() == "A" || STATUS_OLD != "A") {
          STATUS_OLD = $(this).val();
          return;
        }
        var acao = $(this).val()=='E' ? "encerrar" : "cancelar";
        $.dialogs.confirm("Alteração de Status do PDI", "Deseja realmente "+acao+" o PDI? Os acompanhamentos não realizados serão encerrados automaticamente.", function(){
            STATUS_OLD = $(this).val();
        }, function(){
           $("#id_status").val(STATUS_OLD);
        })
   })

});
