

// Rever isso
var remover_um = function(){
    var campo = $(this).attr("id").replace("bt_hide_", '');
    // Esconde o campo escolhido
	$('#campos_para_add #div_id_' + campo).hide();
	$('#campo_' + campo).hide();
	// Coloca o name novamente
	$('#id_' + campo).attr("name", '');
	// Caso seja o último de seu grupo, esconde o grupo tmbm
	if ($('#campo_' + campo).parent().find(".linha_campo:visible").length == 0) {
	    $('#campo_' + campo).parent().hide();
	}

};

var adicionar_campos = function(){
  var campo = $("#id_campos_add").val();

  if(campo==''){
    $.dialogs.error('Escolha um campo para ação.');
		return false;
  }

  // Mostrar o campo escolhido (caso seja o primeiro de seu grupo, revela o grupo tmbm)
	$('#campos_para_add #div_id_' + campo).show();
	$("#campo_"+campo+" * ").show();
	$('#div_id_' + campo).parentsUntil("fieldset").parent().show();
	// Coloca o name novamente
	$('#id_' + campo).attr("name", campo);
};

var salvar_acoes = function(){
    if ($("#id_funcoes").val()==null || $("#id_funcoes").val().length == 0) {
	    $.dialogs.error('Escolha ao menos uma função');
		return false;
    } else if ($(".linha_campo:visible").length == 0) {
		$.dialogs.error('Escolha ao menos um campo para alteração.');
	    return false;
	}else {
        // Validações de campos especiais
		var lista  = [ 'id_escolaridade_qualif_id', 'id_escolaridade_req_id' ];
		var labels = [ 'Qualificação - Escolaridade', 'Requisito Mínimo - Escolaridade' ];
		for( i=0 ; i<lista.length ; i++){
		    var campo = lista[i];
			if ( $("#"+campo+"_excluir").is(":checked") ) continue;
			if ( $("#"+campo).val()=='' && $("#"+campo).attr("name")!='' ) {
			    $.dialogs.error('Campo '+ labels[i]+' é obrigatório.');
				return false;
			}
		}
		// Gera e valida os campos visiveis(selecionados) para edição
		var selected_fields = '';
		$.each($(".linha_campo:visible"), function(i, v) {
			var id_field = $(v).attr("id").replace("campo_","");
			selected_fields += id_field + "|";
		});
		$("#selected_fields").val(selected_fields);
		$("#form_funcao_em_massa").submit();
		return true;

    }
};

var remover_tudo = function(){
   // Esconder os grupos
   $(".grupo_campos_add ").hide();
   // Esconder as linhas de campos da tabela
   $("#campos_para_add .form-group div").parent().parent().parent().hide();
   // Remover os names para não passar pelo formulário
   $("#campos_para_add .form-group div select").attr("name", "");
   $("#campos_para_add .form-group div input").attr("name", "");
   $("#campos_para_add .form-group div textarea").attr("name", "");
};

$(function() {
    // Escolha das funções, setores, empresas e subordinadas
    $('#id_funcoes').bootstrapDualListbox({
        nonSelectedListLabel    : 'Funções para seleção:',
        selectedListLabel       : 'Funções selecionadas:',
        preserveSelectionOnMove : 'moved',
        moveOnSelect            : false,
        nonSelectedFilter       : '',
        sortOptionsOnSelect     : false
    });

    // Adição de campos
    $('#submit-id-bt_add').click(adicionar_campos);

    // Esconder todos os campos
    remover_tudo();

    // Esconder um campo
    $(".bt_hide").live("click", remover_um);

    // Submit
    $('#submit-id-bt_salvar').click(salvar_acoes);
});
