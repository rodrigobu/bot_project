$(function() {
	$('#listagem_flex').djflexgrid({
		url          : URL_LISTAR,
		filter_form  : '#filter_form form',
		completeLoad : function() {
			$('[title]').tooltip();
			if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
				$("#div_id_per_page label").css({ "vertical-align" : "super" });
				$(".current_records_display").css({ "vertical-align" : "sub" });
			}
			$("[name='selecionar-todas']").bind("click", function() {
				var all = $(this);
				$('input:checkbox').each(function() {
					$(this).prop("checked", all.prop("checked"));
				});
			});
		}
	});
	$("#div_id_term label").html("Filtrar Função: ");
});
