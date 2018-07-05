var ENV_MODE = '{{ ENV_MODE }}';
var rpt0052 = false;
var rpt0056 = false;
var rpt0071 = false;
var rpt0075 = false;
var rpt0081 = false;
var rpt0082 = false;

var validar_periodos = function(id_campo){
	if($("#"+id_campo).val()==""){
		return true;
	}
	var periodo_val = $("#"+id_campo).val().split("/");

	if(periodo_val.length!=2){
	   return false;
	}
	if(periodo_val[0].length!=4 || isNaN(periodo_val[0]) ){
	    return false;
	}
	if(periodo_val[1].length!=2 || isNaN(periodo_val[1]) ){
	    return false;
	}
	return true;
};

var ireport = null;

$(function() {

		ireport = $.iReport({
			usa_porta : false
		});

	/*################# FILTRAGEM (INICIO)  #####################*/

	var CONFIG_GERAL_MS = {
		multiple                       : true,
		numberDisplayed                : 1,
		enableFiltering                : true,
		enableCaseInsensitiveFiltering : true,
		buttonClass                    : 'btn btn-grey btn-sm col-xs-12',
		includeSelectAllOption         : true,
		includeSelectAllIfMoreThan     : 2,
	};

	$('#id_FUNCAO').multiselect($.extend({
		checkboxName    : 'FUNCAO',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtrar por função',
		selectAllText   : 'Filtrar todas funções / Nenhuma',
		filterPlaceholder: 'Filtrar por função',
	}, CONFIG_GERAL_MS));

    $('#id_COLAB').addClass('row col-xs-12 col-md-12');

	$('#id_SETORES').multiselect($.extend({
		checkboxName    : 'SETORES',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtrar por setor',
		selectAllText   : 'Filtrar todos setores / Nenhuma',
		filterPlaceholder : 'Filtrar por setor',
	}, CONFIG_GERAL_MS));

	$('#id_AVALIADOR').multiselect($.extend({
		checkboxName    : 'AVALIADOR',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtrar por avaliador',
		selectAllText   : 'Filtrar todos avaliadores / Nenhum',
		filterPlaceholder : 'Filtrar por avaliador',
	}, CONFIG_GERAL_MS));

	$('#id_AVALIADO').multiselect($.extend({
		checkboxName    : 'AVALIADO',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtrar por avaliado',
		selectAllText   : 'Filtrar todos avaliados / Nenhum',
		filterPlaceholder : 'Filtrar por avaliado',
	}, CONFIG_GERAL_MS));

	$('#id_GESTORES').multiselect($.extend({
		checkboxName    : 'GESTORES',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtrar por gestor',
		selectAllText   : 'Filtrar todos gestores / Nenhum',
		filterPlaceholder : 'Filtrar por gestor',
	}, CONFIG_GERAL_MS));

	$('#id_COLABORADOR').multiselect($.extend({
		checkboxName    : 'COLABORADORES',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtrar por Colaborador',
		selectAllText   : 'Filtrar todos Colaboradores / Nenhum',
		filterPlaceholder : 'Filtrar por Colaborador',
	}, CONFIG_GERAL_MS));

	$('#id_FILIAL').multiselect($.extend({
		checkboxName    : 'FILIAL',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtrar por filial',
		selectAllText   : 'Filtrar todas filiais / Nenhum',
		filterPlaceholder : 'Filtrar por filial',
	}, CONFIG_GERAL_MS));

	$('#id_METAS').multiselect($.extend({
		checkboxName    : 'METAS',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtrar por Meta',
		selectAllText   : 'Filtrar todas Metas / Nenhum',
		filterPlaceholder : 'Filtrar por meta',
	}, CONFIG_GERAL_MS));


	 $('#bt_gerar').click(function(){
	 	if(rpt0052){
	 		if ( $("#id_IMPRIMIR_GRAFICOS").is(":checked")|| $("#id_IMPRIMIR_TBL_NIVEIS").is(":checked")||  $("#id_IMPRIMIR_RANKING").is(":checked") ){
                ireport.run();
			} else {
			   $.dialogs.warning("É necessário escolher pelo menos uma opção de impressão (Gráficos e/ou Tabelas)");
			}
	 	} else if(rpt0056){
	        if ($("#id_IMPRIMIR_COMENTARIO_FRANCAMENTE").is(':checked')
	            || $("#id_IMPRIMIR_COMENTARIO_RESPOSTA").is(':checked')
	            || $("#id_IMPRIMIR_COMENTARIO_FAZERMELHOR").is(':checked')){
	            ireport.run();
	        }
	        else{
	            $.dialogs.error("É necessário selecionar ao menos um comentário para gerar o relatório.");
       		 };
	 	} else if(rpt0071){
	        if ($("#id_IMPRIMIR_STATUS_RE").is(':checked')
	            || $("#id_IMPRIMIR_STATUS_RNE").is(':checked')
	            || $("#id_IMPRIMIR_STATUS_EA").is(':checked')
	            || $("#id_IMPRIMIR_STATUS_NR").is(':checked')){
	            ireport.run();
	        }
	        else{
	            $.dialogs.error("É necessário selecionar ao menos um status para gerar o relatório.");
       		 };
		} else if(rpt0081){
	        if ($("#id_lista_cc").is(':checked')
	            || $("#id_lista_ct").is(':checked')){
	            ireport.run();
	        }
	        else{
	            $.dialogs.error("É necessário escolher pelo menos uma opção em Listar Competências para gerar o relatório.");
       		 };
	 	} else{
	 	    ireport.run();
	 	}
	 });
	 //--  Especificos
	 $("#div_id_GERA label span:first").remove();
	 $("#div_id_GERA").removeClass("radio");
	 $("#div_id_GERA").live("change", function(){
	 	if($("#div_id_GERA [type=radio]:checked").val()=="3"){
	 		$("#filtro_setores").show();
	 	} else{
	 		$("#filtro_setores").hide();
	 	}
	 });
	 $("#div_id_ORDEM_TAREFARESP label span:first").remove();
	 $("#div_id_ORDEM_TAREFARESP").removeClass("radio");
	 $("#div_id_TIPO_SAIDA label span:first").remove();
	 $("#div_id_TIPO_SAIDA").removeClass("radio");
	 $("#div_id_TIPO_SAIDA_SEM_EXCEL label span:first").remove();
	 $("#div_id_TIPO_SAIDA_SEM_EXCEL").removeClass("radio");
	 $("#div_id_TIPO_NCC label span:first").remove();
	 $("#div_id_TIPO_NCC").removeClass("radio");
	 $("#div_id_TIPO_GRAFICO").css("padding-left","0px");

	 $("input[type=checkbox]").removeClass("ace");
	 $('input[type=checkbox]').bind('click.checks').unbind('click.checks', function(e){
	 	$(this).attr('checked', $(this).is(':checked'));
	 });

	 $("#bt_sair").click(function(e){
	 	e.preventDefault();
		window.location.href= URL_HOME;
	 });

	 $("#id_periodo_ini").change(function(){
	     if ( !validar_periodos("id_periodo_ini") ){
	 	     $.dialogs.error("Período Inicial Inválido");
	 	     $(this).val("");
	 	 }
	 });
	 $("#id_periodo_fin").change(function(){
	     if ( !validar_periodos("id_periodo_fin") ){
	 	     $.dialogs.error("Período Final Inválido");
	 	     $(this).val("");
	 	 }
	 });
});
