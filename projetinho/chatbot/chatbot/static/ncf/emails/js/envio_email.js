var ANUNCIAR_FILTRO = false;

var criar_dialog_edita_email = function() {
	$("#editar-email-form").dialog({
		hide                : 'fade',
		show                : 'fade',
		ace_theme           : true,
		ace_title_icon_left : 'fa fa-edit',
		title               : "Editar E-mail do Colaborador",
		width               : '30%',
		buttons             : {
			Cancelar : {
				click : function() {
					$(this).dialog('close');
				},
				'class' : 'btn btn-xs btn-danger',
				text : "Cancelar"
			},
			Salvar : {
				click : function() {
					var id_colab = $("#id_idcolab").val();
					$.ajax({
						url      : URL_SALVAR_EMAIL,
						type     : 'get',
						dataType : 'json',
						async    : false,
						data     : $("#modal_email_troca").serialize(),
						success  : function(dados) {
							if (dados['status'] == 'ok') {
								$("#email_inv_icon_" + id_colab).parent().append('<input type="checkbox" name="' + id_colab + '-colab" class="center checkbox_colab">');
								$("#email_inv_icon_" + id_colab).remove();
								$("#editar-email-form").dialog('close');
							} else {
								$.dialogs.error(dados["msg"]);
								$("#id_envio_email-email").val('');
							}
						}
					});
				},
				'class' : 'btn btn-xs btn-success ',
				text : "Salvar"
			},
		},
		close : function() {
			$.loading.hide();
			$(this).dialog('close').dialog('destroy');
		},
	});

};

$(function() {

	/*################# FILTRAGEM (INICIO)  #####################*/

	var CONFIG_GERAL_MS = {
		multiple                       : true,
		numberDisplayed                : 1,
		enableFiltering                : true,
		enableCaseInsensitiveFiltering : true,
		buttonClass                    : 'btn btn-grey btn-sm col-xs-12',
		filterPlaceholder              : 'Filtrar por descrição',
		includeSelectAllOption         : true,
		includeSelectAllIfMoreThan     : 2,
	};

	$('#id_term_funcao').multiselect($.extend({
		checkboxName    : 'term_funcao',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtre uma ou mais funções',
		selectAllText   : 'Filtrar todas funções / Nenhuma'
	}, CONFIG_GERAL_MS));

	$('#id_term_filial').multiselect($.extend({
		checkboxName    : 'term_filial',
		nSelectedText   : 'Selecionadas',
		nonSelectedText : 'Filtre uma ou mais filiais',
		selectAllText   : 'Filtrar todas filiais / Nenhuma'
	}, CONFIG_GERAL_MS));

	$('#id_term_setor').multiselect($.extend({
		checkboxName    : 'term_setor',
		nSelectedText   : 'Selecionados',
		nonSelectedText : 'Filtre um ou mais setores',
		selectAllText   : 'Filtrar todos setores / Nenhum'
	}, CONFIG_GERAL_MS));

	$('#id_term_filial, #id_term_funcao, #id_term_setor').multiselect('refresh');

	$('#filtrar-colabs').on('click', function() {
	   mostrarCarregando("Carregando ... ");
	   $.ajax({
	      url      : URL_FILTRAR_COLABSJSON,
	      type     : 'POST',
	      dataType : 'json', 
	      data     : { 
	      	'tipo'        : $("[name='tipo']:checked").val(),
			'term_setor'  : $("#id_term_setor").val(),
			'term_funcao' : $("#id_term_funcao").val(),
			'term_filial' : $("#id_term_filial").val(),
	      },
	      success  : function(dados) { 
	      	if (dados['error'] != undefined) {
				$.dialogs.error(dados['error']);
				return;
			}
			if (dados['rows'] != undefined) {
				$('#listagem_colab tbody').html("");
				if (dados['rows'].length==0){
					if (ANUNCIAR_FILTRO){
		                $.dialogs.warning("Nenhum colaborador para os filtros selecionados.");
		            }
			        $('#listagem_colab tbody').append(
		                '<tr class="ajax_list_row ajax_list_row" >\
		                    <td class="ajax_list_value center" colspan="2"> \
		                        <label class="position-relative"><span>Nenhum colaborador para os filtros selecionados.</span></td>'+
		                '</tr>'
			        );
		            return;
				}
			    $.each( dados['rows'], function(ind, value){
					var registro = value;
			        $('#listagem_colab tbody').append(
		                '<tr id="'+registro['id']+'" class="ajax_list_row ajax_list_row" >\
		                    <td class="ajax_list_value center"> \
		                        <label class="position-relative"><span>'+registro['check']+'</span></td>'+
		                    '<td class="ajax_list_value"> <label class="position-relative"> '+registro['nome']+' </td>'+
		                '</tr>'
			        );
			    });
			    $('[title]').tooltip();
				$('[data-toggle="popover"]').popover({
					placement : 'top',
					html      : true
				});
		        ANUNCIAR_FILTRO = true;
		   }	      	
	      },
	      complete : function() {  
	        esconderCarregando();
	      },
	   });
		
	});
	
	$('#filtrar-colabs').click();

	$('#limpar-colabs').on('click', function() {
	    mostrarCarregando("Carregando ... ");
		$('#id_term_setor, #id_term_funcao, #id_term_filial').val(null);
		$('#id_term_filial, #id_term_funcao, #id_term_setor').multiselect('refresh');
		$('#filtrar-colabs').click();
	    esconderCarregando();
	});

	$("input[name='tipo']").change(function() {
		$('#filtrar-colabs').click();
	});

	/*################# FILTRAGEM (FIM)  #####################*/

	/*################# EDIÇÃO DE E-MAIL (INICIO)  #####################*/

	$(".email_inv_icon").live("click", function() {
		$.ajax({
			url      : URL_EDITAR_EMAIL,
			type     : 'get',
			dataType : 'json',
			async    : false,
			data     : { 'id' : $(this).attr("id").replace("email_inv_icon_", "") },
			success  : function(dados) {
				$("#editar-email-form").html(dados['html']);
				if (dados['status'] == 'nok') {
					$.dialogs.error(dados["msg"]);
				} else {
					criar_dialog_edita_email();
				}
			}
		});
	});

	/*################# EDIÇÃO DE E-MAIL (FIM)  #####################*/


	$("#checkbox_colab_all").live("change", function(){
	    if( $(this).is(":checked") ){
	       $(".checkbox_colab").attr("checked","checked");
	    }else{
	       $(".checkbox_colab").removeAttr("checked","checked");
	    }
    });
    
	$('#submit-id-avancar').on('click', function() {
		if ($(".checkbox_colab:checked").length == 0) {
			$.dialogs.error('Por favor, selecione um ou mais colaboradores para continuar');
		} else {
			$.dialogs.confirm('Você realmente deseja enviar e-mail para os colaboradores selecionados?', function() {
	        	$("#id_tipo_envio").val( $("input[name='tipo']:checked").val() );
				$('#envio_form').submit();
			});
		};
	});
	
	
});
