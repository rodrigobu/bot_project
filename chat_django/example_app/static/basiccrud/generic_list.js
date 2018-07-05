var editar_dados = function(e) {
	e.preventDefault();
	mostrarCarregando();
	var id = $(this).attr('id').replace('editar_', "");
	$('#id_campo_id').val(id);
	id_REGS = id;
	$.ajax({
		url : URL_CADASTRO + url_param,
		dataType : 'json',
		type : 'get',
		data : {
			'pk' : id,
			'model' : model,
			'modulo' : modulo,
			'form' : formName
		},
		success : function(retorno) {
			if (retorno["ajax_status"] != undefined) {
				$.dialogs.success(retorno["ajax_msg"]);
				return false;
			}
			$('#cadastro').html(retorno);
			$('#cadastro').load();
			$('#id_campo_id').val(id);
			$("#cadastro").show();
			if (modulo == 'escalact') {
				$("#id_campo_id").val(id);
				$(".sortable").children().sortable({
					items : $(".item:not(.noSortable)")
				});
				$(".sortable").on("sortupdate", function() {
					atualizar_ordem();
				});
				$(".sortable").children().disableSelection();
				form_validations($("#formulario_it"));
			}
			if (modulo == 'ncf_tec'){
				aptidao_action();
			}
			if(modulo == 'ted'){
				if($('#id_status_final').is(':checked') && $('#radio-hide').hasClass('hide')){
					$('#radio-hide').removeClass('hide')
				}else{
					$('#radio-hide').addClass('hide')
				}
			}
			id_escala_ct_alterada= false;

			esconderCarregando();
			make_all_datepickers();
			$("#id_descricao").focus();
		},
		error : function() {
			esconderCarregando();
			$.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato.");
		}
	});
};

var submit_form = function(pre_save) {
	mostrarCarregando();
	var dfd = $.Deferred();
	if ( typeof CKEDITOR != 'undefined') {
		CKEDITOR.instances.id_documento.updateElement();
	}
	if (modulo == 'home' && DESC_ALTERADA == false) {
		$("#id_descricao").val($("#id_nome_tela option:selected").html());
	}
	var per_page = $('.choose-per-page select').val();
	$.ajax({
		url : URL_CADASTRO,
		dataType : 'json',
		async : false,
		type : 'post',
		data : {
			pk : $('#id_campo_id').val(),
			dados : get_hash_from_form('#formulario', ''),
			model : model,
			modulo : modulo,
			form : formName,
			menu_id: menu_id,
			id_escala_ct_alterada : id_escala_ct_alterada
		},
		success : function(retorno) {
			if (retorno['ajax_status'] == 'ok') {
				$('.choose-per-page select').val(per_page);
				$('#listagem_flex').data('djflexgrid').methods.reload();
				if (modulo == 'escalact' && pre_save == true) {
					$('#id_campo_id').val(retorno['id']);
				} else {
					// $.dialogs.success(titulo + ' ' + retorno.msg, function(){document.location.reload();});
					$.dialogs.success(titulo + ' ' + retorno.msg);
					limpar_campos();
					$("#cadastro").hide();
					id_escala_ct_alterada = false;
				};
			} else if (retorno['ajax_status'] == 'nok') {
				gerate_errors(retorno['error_list']);
				if (retorno['error_list'] == 0){
					$.dialogs.error(retorno['ajax_msg']);
				}
				retorno = false;
			} else if (retorno['ajax_status'] == 'recover') {
                $.dialogs.confirm(retorno['ajax_msg'], function(a,b,c){
                    mostrarCarregando("Recuperando registro. Aguarde...");
                    $.get(URL_RECOVER + url_param, {pk: retorno['pk']}, function(data){
                        esconderCarregando();
                        document.location.reload();
                    });
                });
            }
		esconderCarregando();
		},
		error : function() {
			$.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato.");
			esconderCarregando();
		},
	});
	return dfd.resolve();
};

var submit_form_event = function(e){
	e.preventDefault();
	submit_form();
};

var excluir = function() {
	var id = $(this).attr('id').replace('excluir_', "");
	$.dialogs.confirm('Confirmação', 'Deseja realmente excluir?', function(r) {
		if (r) {
			$.ajax({
				url : URL_EXCLUIR,
				dataType : 'json',
				type : 'get',
				data : {
					'pk' : id,
					model : model,
					modulo : modulo,
				},
				success : function(retorno) {
					if (retorno.status == 'ok') {
						$.dialogs.success(retorno.msg);
						$('#listagem_flex').data('djflexgrid').methods.reload();
						limpar_campos();
					} else {
						$.dialogs.error(retorno.msg);
					}
				},
				error : function(retorno) {
					$.dialogs.error("Ocorreu um erro ao encaminhar os dados para a exclusão, por favor entre em contato.");

				},
			});
		};
	});
};

var recuperar_dados = function(id) {

	$.dialogs.confirm('Um registro com essa descrição foi excluído, deseja recuperá-lo ?', 'Confirmação', function(r) {
		if (r) {
			$.ajax({
				url : URL_RECUPERAR,
				dataType : 'json',
				type : 'get',
				data : {
					'pk' : id,
					model : model,
					modulo : modulo,
				},
				success : function(retorno) {
					if (retorno.status == 'ok') {
						$.dialogs.success(retorno.msg);
						$('#listagem_flex').data('djflexgrid').methods.reload();
						limpar_campos();
					} else {
						$.dialogs.error(retorno.msg);
					}
				},
				error : function(retorno) {
					$.dialogs.error('Impossível excluir o registro: há outros registros que são dependentes deste.');
				},
			});
		};
	});
};

limpar_campos = function() {
	$("#formulario input:not(:hidden, :button, :radio)").val('');
	$(".errorlist_img, .errorlist, .jError").remove();
	if (modulo == 'escalact') {
		$("#formulario_it input:not(:button, :radio)").val('');
		$(" .sortable tbody").html('');
	}
    if (modulo == 'ted') {
        $('#id_status_final').removeAttr('checked').change()
	}

	$('#formulario select').val("");
	$('#formulario textarea').html("").val("");
	if ( typeof CKEDITOR != 'undefined') {
		CKEDITOR.instances.id_documento.setData('');
	}
};
$(function() {
	$('#cadastro').hide();

	$('#novo_cadastro').click(function(e) {
		e.preventDefault();
		$('#cadastro').toggle();
		$('#id_campo_id').val(''), limpar_campos();
	});
	$('.edit').live('click', editar_dados);
	$('.excluir').live('click', excluir);

	$("#submit_form").live('click', submit_form_event);
	// salvar com enter:
	//$("#formulario").live('submit', submit_form_event);
	$("#formulario").live('submit', function(){ return false; });

	$("#id_nome_tela").live("change", function(){
		mostrarCarregando();
		$.ajax({
			url : URL_GET_URL,
			dataType : 'json',
			type : 'get',
			data : {
			    'menu_id' : $("#id_nome_tela option:selected").val(),
			},
			success : function(retorno) {
				if (retorno.status == 'ok_group'){
					esconderCarregando();
					$("#id_descricao").val(retorno.descricao);
					$("#id_grupo").val(retorno.grupo);
					$("#id_url_cad").val(retorno.url_cad);
					$("#id_url_import").val(retorno.url_import);
					$("#id_label_url_cad").val(retorno.label_url_cad);
					$("#id_label_url_import").val(retorno.label_url_import);
					$('#id_campo_id').val(retorno.pk);
					DESC_ALTERADA = true;
				}
				if (retorno.status == 'ok') {
					esconderCarregando();
					$("#id_url_cad").val(retorno.url_cad);
					$("#id_url_import").val(retorno.url_import);
					$("#id_label_url_cad").val(retorno.label_url_cad);
					$("#id_label_url_import").val(retorno.label_url_import);
					$("#id_grupo").val(retorno.grupo);
					DESC_ALTERADA = false;
				}
			},
			error : function(retorno) {
				esconderCarregando();
				$.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato.");
			},
		});
	});
});
