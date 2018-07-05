var complete_loader = function(id_lista, after_loader) {
	$('#' + id_lista + ' [title]').tooltip();
	if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
		$("#div_id_per_page label").css({ "vertical-align" : "super" });
		$(".current_records_display").css({ "vertical-align" : "sub" });
	}
	if (after_loader != undefined) {
		after_loader();
	}
};

var recarregar_listagem = function() {
	$('#listagem_flex').djflexgrid({
		url : URL_LISTA_FUNCOES + "?filtro=" + $("#id_filtro").val(),
		completeLoad : function() {
			complete_loader('listagem_flex');
		}
	});
};

var export_flexgrid = function(container, format) {
	window.location = '' + container.data('djflexgrid').list_url + '?export=' + format;
};

$(function() {

	recarregar_listagem();
	$("#btn_limpar").hide()
	
	// Selecionar todos
	$('.selecionar_funcoes').live('click', function() {
		if ($(this).is(':checked')) {
			$(".check_funcao").check();
		} else {
			$(".check_funcao").uncheck();
		};
	});

	// Filtragem
	$("#id_filtro").keydown(function(){
		if ($("#id_filtro").val().length > 1){
			$("#btn_limpar").show();
		}
	});
	$("#btn_filtro").click(function() {
		recarregar_listagem();
	});
	$("#btn_limpar").click(function() {
		$("#id_filtro").val("");
		recarregar_listagem();
	});
	$("#form-filtro").submit(function(event) {
		event.preventDefault();
		recarregar_listagem();
		return false;
	});

	$(window).keydown(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			return false;
		}
	});

	// EXPORT
	$('.flexgrid_export_pdf').on('click', function() {
		export_flexgrid($('#listagem_flex'), 'pdf');
	});
	$('.flexgrid_export_xls').on('click', function() {
		export_flexgrid($('#listagem_flex'), 'xls');
	});


});
