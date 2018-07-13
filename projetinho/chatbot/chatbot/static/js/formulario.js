$(function() {

        var CONFIG_GERAL_MS = {
		multiple                       : true,
		numberDisplayed                : 1,
		enableFiltering                : true,
		enableCaseInsensitiveFiltering : true,
		buttonClass                    : 'btn btn-grey btn-sm col-xs-12',
		filterPlaceholder              : 'Filtrar por responsável da função',
		includeSelectAllOption         : true,
		includeSelectAllIfMoreThan     : 2,
	    };

      $('#id_responsavel_funcao').multiselect($.extend({
            checkboxName    : 'FUNCAO',
            nSelectedText   : 'Selecionadas',
            nonSelectedText : 'Filtre um ou mais responsável',
            selectAllText   : 'Filtrar todos responsáveis / Nenhuma'
        }, CONFIG_GERAL_MS));

        $('#id_responsavel_funcao').addClass('row col-xs-12 col-md-12');

});
