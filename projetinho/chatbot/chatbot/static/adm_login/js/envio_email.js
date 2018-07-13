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

var criar_dialog_salvar_email = function() {
	$("#modal_email_troca_body").dialog({
		hide                : 'fade',
		show                : 'fade',
		ace_theme           : true,
		ace_title_icon_left : 'fa fa-edit',
		title               : "Configurar E-mail para Envio",
		width               : '40%',
		buttons             : {
			Cancelar : {
				click : function() {
					$(this).dialog('close');
				},
				'class' : 'btn btn-xs btn-danger',
				text : "Cancelar"
			},
			"Enviar E-mail" : {
				click : function() {
					/*
					var assunto  = $("#id_loginsenha_assunto").val();
					var conteudo = $("#id_loginsenha_conteudo").val();
					$.ajax({
						url      : URL_SALVAR_PARAMEMAIL,
						type     : 'post',
						dataType : 'json',
						async    : false,
						data     : {
							assunto : assunto,
							conteudo : conteudo,
						},
						success  : function(dados) {
							if (dados['status'] == 'ok') {
								$("#envio_form").submit();
							} else {
								$.dialogs.error(gettext(dados["msg"]));
							}
						}
					});*/
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


var _set_session_filter = function(URL, param){
    $.ajax({
	    url      : URL,
	    type     : 'POST',
	    dataType : 'json', 
		async    : false,
	    data     : { param : $("#id_"+param).val() },
	    success  : function(dados) { }
    });
};

var _selecionar_lote = function(adicionar){
	var ids = [];
	$.each($(".checkbox_colab"), function(idx, value) {
	    ids.push($(value).attr("name").replace("-colab", ""));
	});
	console.log(ids);
    $.ajax({
	    url      : URL_SET_SESSION_SELECIONADOS_LOTE,
	    type     : 'POST',
	    dataType : 'json',
		async    : false, 
	    data     : { 
	    	"ids" : ids,
	    	"tipo": adicionar ? "add" : "rm" 
	    },
	    success  : function(dados) { 
	    	$("#label_selecionados").html(dados["count"] + " Selecionados");
			if (adicionar){
				$(".checkbox_colab").attr("checked","checked");
				$("#param_texto").show();
			}else{
				$(".checkbox_colab").removeAttr("checked");
				if(dados["count"] < 1) {
					$("#param_texto").hide();
				}
			}
	    }
    });
};

var _selecionar = function(colab_id, adicionar){
    $.ajax({
	    url      : URL_SET_SESSION_SELECIONADOS,
	    type     : 'POST',
	    dataType : 'json', 
		async    : false,
	    data     : { 
	    	"colab_id" : colab_id,
	    	"tipo"     : adicionar ? "add" : "rm" 
	    },
	    success  : function(dados) { 
	    	$("#label_selecionados").html(dados["count"] + " Selecionados");
	    	if (dados["count"] > 0){
	    		$("#param_texto").show();
	    	} else {
	    		$("#param_texto").hide();
	    	}
	    }
    });
};

var _limpar_tudo = function(){
	$.ajax({
	    url      : URL_LIMPAR_SELECIONADOS,
		type     : 'POST',
		dataType : 'json', 
		async    : false,
		data     : { },
		success  : function(dados) { 
		    $(".checkbox_colab").removeAttr("checked");
	    	$("#label_selecionados").html("0 Selecionados");
	    	$("#param_texto").hide();
		}
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

	$('#id_term_setor').on('change', function() {
		_set_session_filter(URL_SET_SESSION_SETOR, "term_setor");
	});
	$('#id_term_funcao').on('change', function() {
		_set_session_filter(URL_SET_SESSION_FUNCAO, "term_funcao");
	});
	$('#id_term_filial').on('change', function() {
		_set_session_filter(URL_SET_SESSION_FILIAL, "term_filial");
	});
	

	$('#listagem_adm_login').djflexgrid({
		url          : URL_LISTAR_LOGINS,
		filter_form  : '#envio_form_filter',
		completeLoad : function() {
			$('#listagem_adm_login [title]').tooltip();
			
			 $.ajax({
			    url      : URL_GET_SESSION_SELECIONADOS,
			    type     : 'POST',
			    dataType : 'json', 
			    data     : { },
			    success  : function(dados) { 
			    	selecionados = dados["selecionados"];
			    	$.each(selecionados, function(idx, value){
			    		console.log($("input[name="+value+"-colab]"));
			    	    $("input[name="+value+"-colab]").attr("checked","checked");
			    	});
			    }
		    });
		}
	});
	
    $('#filtrar-colabs').on('click', function() {
		_set_session_filter(URL_SET_SESSION_SETOR, "term_setor");
		_set_session_filter(URL_SET_SESSION_FUNCAO, "term_funcao");
		_set_session_filter(URL_SET_SESSION_FILIAL, "term_filial");
		$('#listagem_adm_login').djflexgrid({
			url          : URL_LISTAR_LOGINS,
			filter_form  : '#envio_form_filter',
			completeLoad : function() {
				$('#listagem_adm_login [title]').tooltip();
			}
		});
        _limpar_tudo();
	});
	
	$(".checkbox_colab").live("click", function(){
		_selecionar($(this).attr("name").replace("-colab", ""), $(this).is(":checked") );
	});
	
	$("[name='selecionar-todas']").live("click", function(){
		_selecionar_lote($(this).is(":checked"));
	});
	
	$("#button-id-bt_limpar_selecionados").live("click", function(){
		_limpar_tudo();
	});
	
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
		var selecionados = [];
		$.ajax({
			    url      : URL_GET_SESSION_SELECIONADOS,
			    type     : 'POST',
			    dataType : 'json', 
			    async    :  false,
			    success  : function(dados) { selecionados = dados["selecionados"]; }
		    });
		if (selecionados.length == 0) {
			$.dialogs.error('Por favor, selecione um ou mais colaboradores para continuar');
		} else {
			$.dialogs.confirm('Você realmente deseja enviar e-mail para os colaboradores selecionados?', function() {
	        	
                    CKEDITOR.instances.id_loginsenha_conteudo.updateElement();
                    
					if($("#id_loginsenha_assunto").val()==''){
					    $.dialogs.error("O Campo assunto é obrigatório.");
						return false;
					}
					
					if($("#id_loginsenha_conteudo").val()==''){
					    $.dialogs.error("O Campo conteúdo é obrigatório.");
						return false;
					}
					
					var assunto  = $("#id_loginsenha_assunto").val();
					var conteudo = $("#id_loginsenha_conteudo").val();
					$.ajax({
						url      : URL_SALVAR_PARAMEMAIL,
						type     : 'post',
						dataType : 'json',
						async    : false,
						data     : {
							assunto  : assunto,
							conteudo : conteudo,
						},
						success  : function(dados) {
							if (dados['status'] == 'ok') {
								$("#envio_form").submit();
							} else {
								$.dialogs.error(dados["msg"]);
							}
						}
					});
			});
		};
	});
	
	
	
	/*******  Configurações do CK Editor *******/
	
    CKEDITOR.config.extraPlugins = 'especiais_login';
	tool = [
			{ name: 'edit',           items:[ 'Cut' ,'Copy', 'Paste','Undo','Redo' ,'/' ]},
			{ name: 'component',      items:[ 'Table', 'HorizontalRule', 'SpecialChar','/' ]},
			{ name: 'others',         items:[ 'Maximize' ,'-','Source']},
			{ name: 'styles',         items:[ 'Bold', 'Italic','Strike' , 'Underscore','RemoveFormat']},'/',
			{ name: 'indent',         items:[ 'NumberedList','BulletedList','Outdent','Indent','Blockquote', ]},
			{ name: 'especiais_login', items:[ '/',"CampoEspecial_login"] },
			{ name: 'styles2',        items:[  'Styles','Format']}
	];
    CKEDITOR.config.removePlugins  = 'elementspath';
        
	CKEDITOR.replace( 'id_loginsenha_conteudo', {extraPlugins : 'especiais_login', toolbar : tool });
		
    $('input, select, textarea').live('blur', function() {
        CKEDITOR.instances.id_loginsenha_conteudo.updateElement();
    });
    $('.cke_wysiwyg_frame').live('keyup', function() {
        CKEDITOR.instances.id_loginsenha_conteudo.updateElement();
    });
    $('.cke_wysiwyg_frame').live('keypress', function() {
        CKEDITOR.instances.id_loginsenha_conteudo.updateElement();
    });
    $("#param_texto").hide();

});
