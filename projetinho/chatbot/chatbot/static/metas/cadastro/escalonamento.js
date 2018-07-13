var toggle_select_tipo_meta = function() {
  var tipo = $(this).val();
  if (tipo == '1') {
    if ($("#listagem_escalonamentos tbody tr").length != 0) {
      // valida  se existem escalonamentos e alerta o usuario
      $.dialogs.confirm("Atenção",
        "Deseja realmente mudar de Escalonada para Proporcional? \
								 Existem escalonamentos vinculados a essa meta e eles serão \
								 excluídos ao salvar a meta. ",
        function() {
          $("#div_escalonamentos").hide();
          colocar_obg_limite();
        },
        function() {
          $("[name='tipo_resultado'][value='2']").click();
        }
      );
    } else {
      $("#div_escalonamentos").hide();
      colocar_obg_limite();
    }

  } else {
    $("#div_escalonamentos").show();
    remover_obg_limite();
  }
};

var excluir_escalonamento = function(botao) {
  $.dialogs.confirm("Atenção", "Deseja realmente excluir o escalonamento?",
    function() {
      var parents = $(botao).parentsUntil("tbody");
      tr = parents[parents.length - 1];
      $(tr).remove();

    }
  );
}

var montar_lista_escalonamento = function(de, ate, resultado) {
  $("#listagem_escalonamentos tbody").append(
    '\
    				<tr class="">\
    					<td><span>' + de +
    '</span></td>\
    					<td><span>' + ate +
    '</span></td>\
    					<td><span>' + resultado +
    '</span></td>\
    					<td class="col-xs-1 text-center md_icons">\
    						<a href="javascript:void(0)" onclick="excluir_escalonamento(this)" class="red center excluir_escalonamento">\
    									 <i class="ace_icon fa fa-trash-o bigger-120" title="" \
    									 data-original-title="Excluir"></i></a>\
    					</td>\
				</tr>'
  );
}

var salvar_escalonamento = function() {
  var de_original = $("#id_de").val();
  var ate_original = $("#id_ate").val();
  var resultado_original = $("#id_resultado").val();
  if (!de_original || !ate_original || !resultado_original) {
    $.dialogs.error("Os três campos de escalonamento são obrigatórios.");
    return false;
  }
  var de = parseFloat(de_original.replace(",", "."));
  var ate = parseFloat(ate_original.replace(",", "."));
  var resultado = parseFloat(resultado_original.replace(",", "."));

  if (de >= ate) {
    $.dialogs.error("O valor de 'De' deve ser menor que o valor de 'Até'.");
    return false;
  }
  // Valida existencia
  var encontrado = false;
  var msg_error = "";
  $.each($("#listagem_escalonamentos tbody tr"), function(idx, value) {
    var colunas = $(value).find("td");
    var de_aux = parseFloat($(colunas[0]).find("span").html().replace(",",
      "."));
    var ate_aux = parseFloat($(colunas[1]).find("span").html().replace(
      ",", "."));
    if (de == de_aux || ate == ate_aux || de == ate_aux || ate == de_aux) {
      encontrado = true;
      msg_error =
        "Já existe um escalonamento com os mesmos valores de 'De' e/ ou 'Até'.";
    } else if (
      (de < de_aux && ate > de_aux) || // inicia antes
      (de > de_aux && de < ate_aux) || // (estao no meio)
      (ate > de_aux && ate < ate_aux) // (estao no meio)
    ) {
      encontrado = true;
      msg_error =
        "Não foi possível inserir esta faixa de escalonamento,\
             pois já existe outra que utiliza toda ou parte da faixa a ser inserida.";
    }
  });
  if (encontrado) {
    $.dialogs.error(msg_error);
    $("#id_de").val("");
    $("#id_ate").val("");
    $("#id_resultado").val("");
    return false;
  }
  montar_lista_escalonamento(de_original, ate_original, resultado_original);
  $("#id_de").val("");
  $("#id_ate").val("");
  $("#id_resultado").val("");
}

var get_dados_escalonamentos = function() {
  var escalonamentos = [];

  $.each($("#listagem_escalonamentos tbody tr"), function(idx, value) {
    var colunas = $(value).find("td");
    var de = $(colunas[0]).find("span").html();
    var ate = $(colunas[1]).find("span").html();
    var resultado = $(colunas[2]).find("span").html();
    escalonamentos.push(de + ";" + ate + ";" + resultado)
  });

  escalonamentos = escalonamentos.join("|");
  return escalonamentos;
}


$(function() {

  $("[name='tipo_resultado']").change(toggle_select_tipo_meta);
  $("[name='tipo_resultado']:first").change();

  $("#novo_cadastro_escalonamentos").click(salvar_escalonamento);

});
