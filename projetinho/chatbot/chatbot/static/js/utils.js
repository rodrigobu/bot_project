$(function() {

	/*################# FILTRAGEM (INICIO)  #####################*/

	var CONFIG_GERAL_MS = {
		multiple                       : true,
		numberDisplayed                : 1,
		enableFiltering                : true,
		enableCaseInsensitiveFiltering : true,
		buttonClass                    : 'btn btn-grey btn-sm col-xs-12',
		filterPlaceholder              : 'Filtrar por função',
		includeSelectAllOption         : true,
		includeSelectAllIfMoreThan     : 2,
	};

	$('#id_FUNCAO').multiselect($.extend({
		checkboxName    : 'FUNCAO',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtre uma ou mais funções',
		selectAllText   : 'Filtrar todas funções / Nenhuma'
	}, CONFIG_GERAL_MS));

    $('#id_COLAB').addClass('row col-xs-12 col-md-12');

});
