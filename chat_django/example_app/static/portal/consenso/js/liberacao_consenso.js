var editar_liberacao = function(){
	var id = $(this).attr('id').replace('editar_', "");
	var persp = $("input[type='radio']:checked").val();
	var sup = $("#id_term_gestores").val();
	$.dialogs.confirm('Você realmente confirma uma nova liberação da Revisão das Notas da Avaliação?', function(){
		$.ajax({
			url : URL_SALVAR_LIBERACAO,
			dataType : 'json',
			type : 'post',
			data : {
				'id': id,
				'sup': sup,
				'persp': persp
			},
			success : function(retorno) {
				if (retorno["ajax_status"] != undefined) {
					esconderCarregando();
					$.dialogs.success(retorno["ajax_msg"]);
					$('#listagem_liberacao').data('djflexgrid').methods.reload();
					return false;
				}
				esconderCarregando();
			},
			error : function() {
				esconderCarregando();
				$.dialogs.error("Ocorreu um erro ao retornar os dados, por favor entre em contato.");
			}
		});
	});
};

var executar_listagem_liberacao = function(){
	if( $("#id_GESTOR").val()!="" ){
	    mostrarCarregando();
		$('#listagem_liberacao').djflexgrid({
			url          : URL_LISTAR_LIB,
			filter_form  : '#form_filtro_consenso',
			completeLoad : function() {
				esconderCarregando();
				$('#listagem_liberacao [title]').tooltip();
			}
		});
	}
};

var submit_form_event = function(e){
	e.preventDefault();
	editar_liberacao.apply(this);
};