

/* ADIÇÃO DE CAMPOS  (INICIO) */

// indices dos formulários
var INDEX_FORM_CT    = 0;
var INDEX_FORM_CCIND = 0;
var INDEX_FORM_ATB   = 0;

var verifica_check_avaliar = function(prefixo, check){

    if($(check).is(":checked")){
        $("#"+prefixo+'nivel_min').addClass("vObrigatorio");
        $("#div_"+prefixo+'nivel_min').find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
        $("#"+prefixo+'nivel').addClass("vObrigatorio");
        $("#div_"+prefixo+'nivel').find('label').addClass('requiredField').append('<span class="asteriskField">*</span>');
    } else{
        $("#"+prefixo+'nivel_min').removeAttr("vObrigatorio");
        $("#div_"+prefixo+'nivel_min')
        .find('label').removeClass('requiredField').find('span').remove();
        $("#"+prefixo+'nivel').removeAttr("vObrigatorio");
        $("#div_"+prefixo+'nivel')
        .find('label').removeClass('requiredField').find('span').remove();
    }
};
$(".checkbox_avaliar").find("[type='checkbox']").live('click', function(){
		var prefixo = $(this).attr('id').replace('avaliar', '');
		verifica_check_avaliar(prefixo, $(this));
	});

var verifica_nivel = function(){
	var has_bucha = 0;
	$.each($(".checkbox_avaliar").find("[type='checkbox']"), function(index){
		var prefixo = $(this).attr('id').replace('avaliar', '');
		if($(this).is(":checked")){
			if ($("#"+prefixo+'nivel_min').val() == ''){
				gerate_error(prefixo+'nivel_min', "Este campo é obrigatório.");
				has_bucha +=1;
			}
			if ($("#"+prefixo+'nivel').val() == ''){
				gerate_error(prefixo+'nivel', "Este campo é obrigatório.");
				has_bucha +=1;
			}
		}

	});
	if (has_bucha > 0){
		return false;
	}else{
		return true;
	}
};

var adicionar_campo = function(url , index, div_dados, fieldset_id) {
	$.ajax({
		url      : url,
		type     : 'get',
		dataType : 'json',
		async    : false,
		data     : { 'index' : index },
		success : function(dados) {
			$("#"+div_dados).append(dados);
			$("#"+fieldset_id).show();
		}
	});
};

// Add indicador comportamental
var adicionar_campo_ccind = function() {
	adicionar_campo(URL_GET_CCIND_FORM, INDEX_FORM_CCIND, 'ccind_div', 'fieldset_ccind_group');
	INDEX_FORM_CCIND += 1;
};

// Add competencia tecnica
var adicionar_campo_ct = function() {
	adicionar_campo(URL_GET_CT_FORM, INDEX_FORM_CT, 'cts_div', 'fieldset_cts_group');
	INDEX_FORM_CT += 1;
};

// Add atribuição
var adicionar_campo_atribuicoes = function() {
	adicionar_campo(URL_GET_ATB_FORM, INDEX_FORM_ATB, 'atribuicoes_div', 'fieldset_atribuicoes_group');
	INDEX_FORM_ATB += 1;
};

/* ADIÇÃO DE CAMPOS  (FIM) */



/* VALIDAÇÃO DE ESCOLHAS DUPLICADAS (INICIO) */

var no_repeat_campo = function(classe, id_campo, valor, msg) {
	if (valor) {
		if ($('.'+classe+'[id!="' + id_campo + '"]').length != 0) {
			var outros_selects_funcao = $('.'+classe+'[id!="' + id_campo + '"]');
			$.each(outros_selects_funcao, function(idx, slct) {
				if ($(slct).val() == valor) {
					$('#' + id_campo).find('option:first').attr('selected', 'selected');
					$.dialogs.error(msg);
					return;
				}
			});
		}
	}
};

var no_repeat_ccind = function() {
	no_repeat_campo('select_ccind', $(this).attr('id') , $(this).val(), 'Indicador Comportamental já escolhido: Esse indicador já foi selecionado anteriormente.');
};

var no_repeat_cts = function() {
	no_repeat_campo('select_cts', $(this).attr('id') , $(this).val(), 'Competência Técnica já escolhida: Essa competência já foi selecionada anteriormente.');
};

var no_repeat_atribuicoes = function() {
	no_repeat_campo('select_atrib', $(this).attr('id') , $(this).val(), 'Atribuição já escolhida: Essa atribuição já foi selecionada anteriormente.');
};

/* VALIDAÇÃO DE ESCOLHAS DUPLICADAS (FIM) */


$(function() {
	$('#id_responsavel_funcao').bootstrapDualListbox({
        nonSelectedListLabel    : 'Funções para seleção:',
        selectedListLabel       : 'Funções selecionadas:',
        preserveSelectionOnMove : 'moved',
        moveOnSelect            : false,
        nonSelectedFilter       : '',
        sortOptionsOnSelect     : false
    });

	// Submit
	$('#submit-id-bt_salvar').click(function() {

		if ($('#bootstrap-duallistbox-selected-list_responsavel_funcao').find("option").length <= 0) {

			$.dialogs.error('Escolha ao menos uma função');
			return false;

		} else {
			var retorno = true;
			$.each( $("select.select_cts") , function(idx, value){
			  if ( $(this).val()=='' ) { retorno = false; }
			});
			if (!retorno){
			    $.dialogs.error('O campo Competencia técnica é obrigatório.');
			    return false;
			}

			if (!verifica_nivel()){
				$.dialogs.error('Existem erros no preenchimento do formulário.');
				return false;
			}

			var retorno = true;
			$.each( $("select.select_atrib") , function(idx, value){
			  if ( $(this).val()=='' ) { retorno = false; }
			});
			if (!retorno){
			    $.dialogs.error('O campo Atribuição é obrigatório.');
			    return false;
			}

			var retorno = true;
			$.each( $("input.select_atrib_ordem") , function(idx, value){
			  var id_ordem = $(this).val().replace("id_atrib_","").replace("-ordem","");
              if( $("#id_atrib_"+id_ordem+"-atribuicao_excluir").is(":checked") ) return true;
			  if ( parseInt($(this).val())==0 ) { retorno = false; }
			});
			if (!retorno){
			    $.dialogs.error('O campo Ordem da Atribuição não pode ser zero.');
			    return false;
			}

			var retorno = true;
			$.each( $("select.select_ccind") , function(idx, value){
			  if ( $(this).val()=='' ) { retorno = false; }
			});
			if (!retorno){
			    $.dialogs.error('O campo Indicador Comportamental é obrigatório.');
			    return false;
			}


			var campos = $("select.select_cts").length + $("select.select_atrib").length + $("select.select_ccind").length;
			if (campos==0){
				$.dialogs.error('Escolha pelo menos uma alteração a ser realizada');
				return false;
			}

            return true;

		}

	});

    // Indicador comportamental
	$(".select_ccind").live('change', no_repeat_ccind);
	$("#bt_add_ccind").click(adicionar_campo_ccind);

	// Competencia tecnica
	$(".select_cts").live('change', no_repeat_cts);
	$("#bt_add_cts").click(adicionar_campo_ct);

	// Atribuição
    $(".select_atrib").live('change', no_repeat_atribuicoes);
	$("#bt_add_atribuicoes").click(function(){
		adicionar_campo_atribuicoes();
		$('[data-toggle="popover"]').popover();

	});


	$("#filter_table").keyup(function () {
	    var data = this.value;
	    var jo   = $("#ms-id_responsavel_funcao .ms-list:first li:not(.ms-selected)");
		if (this.value == "") {
		    jo.show();  return;
		}
		jo.hide();
		jo.filter(function (i, v) { return $(this).is(":contains('" + data.toUpperCase() + "')"); }).show();
	}).focus(function () {
		$(this).unbind('focus');
	});

});
