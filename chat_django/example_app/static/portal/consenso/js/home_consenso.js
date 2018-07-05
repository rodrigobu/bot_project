var montar_campo_colab = function() {
	$('#id_term_gestores').on('change', function() {
		$.ajax({
			url : URL_GET_COLABORADORES,
			type : 'POST',
			dataType : 'json',
			data : {
				param : $("#id_term_gestores").val()
			},
			success : function(dados) {
				if (dados["status"] == "ok") {
					$("#id_colaborador").html(dados["html"]);
				}
			}
		});
	});
};
montar_campo_colab();
$('#id_term_gestores').change();


var verifica_consenso = function(){
	mostrarCarregando();
	$.ajax({
		url : URL_GET_COLAB_CONSENSO,
		type : 'POST',
		dataType : 'json',
		data : {
			sup : $("#id_term_gestores").val(),
			colab : $("#id_colaborador").val(),
			perspectiva : $("input[type='radio']:checked").val()
		},
		success : function(dados) {
			if (dados["status"] == "ok") {
				esconderCarregando();
				$("#form_filtro_consenso").submit();
			}
			else{
				esconderCarregando();
				$.dialogs.error("Já foi efetuada alteração de nota para este colaborador. Se quiser alterá-la novamente, favor entrar em contato com o RH.");
			}
		}
	});
};