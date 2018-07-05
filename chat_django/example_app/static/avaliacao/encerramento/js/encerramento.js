var TEM_INCONSISTENCIA = false;
var listagens_encerramento = function(){
    TEM_INCONSISTENCIA = false;
    // Não finalizados
	if ($('#comp_n_finalizados').length!=0){
	    $('#comp_n_finalizados').djflexgrid({ url : URL_N_FINALIZA_C });
		$('#comp_n_finalizados .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#comp_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
				        
	if ($('#tec_n_finalizados').length!=0){
	    $('#tec_n_finalizados').djflexgrid({ url : URL_N_FINALIZA_T });
		$('#tec_n_finalizados .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#tec_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
				        
	if ($('#resp_n_finalizados').length!=0){
	    $('#resp_n_finalizados').djflexgrid({ url : URL_N_FINALIZA_R });
		$('#resp_n_finalizados .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#resp_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
	
	// Sem avaliação
	if ($('#comp_sem_avaliadores').length!=0){
	    $('#comp_sem_avaliadores').djflexgrid({ url : URL_SEM_AVAl_C });
		$('#comp_sem_avaliadores .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#comp_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
	
	if ($('#tec_sem_avaliadores').length!=0){
	    $('#tec_sem_avaliadores').djflexgrid({ url : URL_SEM_AVAl_T });
		$('#tec_sem_avaliadores .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#tec_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
	    
	if ($('#resp_sem_avaliadores').length!=0){
	    $('#resp_sem_avaliadores').djflexgrid({ url : URL_SEM_AVAl_R });
		$('#resp_sem_avaliadores .ajax_list_page').live('click', function (event) {
		    var page = $(this).data('page-number');
			reload_djflexgrid($('#resp_n_finalizados'), page);
		});
		TEM_INCONSISTENCIA = true;
	}
								
};
    
$(function() {
		
	// Acerta os icones de help (para avals já encerradas)
	$.each($(".help-button"), function(idx, value) {
		$(value).parent().find(".form-group label .lbl").append($(value));
	});

	$("#submit-id-avancar").live('click', function(){
			
        // verificação de escolha de perspectiva
        if( !$("#id_comportamental").is(":checked") && !$("#id_tecnica").is(":checked") && !$("#id_responsabilidade").is(":checked") ){
            $.dialogs.error("É necessário escolher pelo menos uma perspectiva para essa ação.");
            return false;
        }
        
        mostrarCarregando("Carregando ... ");
		$.ajax({
			url      : URL_GET_CONT_AVAl,
			type     : 'get',
			dataType : 'json',
			data     : { 
				'comp' : $("#id_comportamental").is(":checked")   ? "T"  : "F",
				'tec'  : $("#id_tecnica").is(":checked")          ? "T"  : "F",
				'resp' : $("#id_responsabilidade").is(":checked") ? "T"  : "F",
			},
			success : function(dados) {
				if (dados["status"] == 'ok') {
					$("#container_acoes").html(dados["html"]);	
					listagens_encerramento();
					$("#submit-id-avancar").hide();			
					$("#submit-id-encerrar").show();	
					if(!TEM_INCONSISTENCIA){
						$("#submit-id-encerrar").click();
					}
				}else{
					$.dialogs.error(dados["msg"]);
				}
			},
			complete : function() {  
			    esconderCarregando();
			},
		});

    });
		
	$("#submit-id-encerrar").live('click', function(){
			
        //var MSG = 'Você realmente deseja encerrar as avaliações selecionadas e enviar e-mail para os colaboradores participantes?';	
	    var MSG = 'Você realmente deseja encerrar as avaliações selecionadas?';
		
		if(TEM_INCONSISTENCIA){
			MSG = MSG +' As avaliações não respondidas ou sem avaliadores, listadas, serão excluídas automaticamente.';
		}
		
	    $.dialogs.confirm(MSG, function() {
		    //CKEDITOR.instances.id_aval_encerramento_conteudo.updateElement();
		    
	        // verificação de escolha de perspectiva
	        if( !$("#id_comportamental").is(":checked") && !$("#id_tecnica").is(":checked") && !$("#id_responsabilidade").is(":checked") ){
	            $.dialogs.error("É necessário escolher pelo menos uma perspectiva para essa ação.");
	            return false;
	        }
        
	        /*if($("#id_aval_encerramento_assunto").val()==''){
			    $.dialogs.error(gettext("O Campo assunto é obrigatório."));
				return false;
			}
			
			if($("#id_aval_encerramento_conteudo").val()==''){
				$.dialogs.error(gettext("O Campo conteúdo é obrigatório."));
				return false;
			}*/
			
			/*var assunto  = $("#id_aval_encerramento_assunto").val();
			var conteudo = $("#id_aval_encerramento_conteudo").val();
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
					   $("#encerramento_form").submit();
					} else {
					    $.dialogs.error(gettext(dados["msg"]));
					}
				}
			});*/
			$("#encerramento_form").submit();
	    });
			
	});
		
	/*CKEDITOR.config.extraPlugins = 'especiais_login';
	tool = [
		{ name: 'edit',            items:[ 'Cut' ,'Copy', 'Paste','Undo','Redo' ,'/' ]},
		{ name: 'component',       items:[ 'Table', 'HorizontalRule', 'SpecialChar','/' ]},
		{ name: 'others',          items:[ 'Maximize' ,'-','Source']},
		{ name: 'styles',          items:[ 'Bold', 'Italic','Strike' , 'Underscore','RemoveFormat']},'/',
		{ name: 'indent',          items:[ 'NumberedList','BulletedList','Outdent','Indent','Blockquote', ]},
		{ name: 'especiais_login', items:[ '/',"CampoEspecial_login"] },
	    { name: 'styles2',         items:[  'Styles','Format']}
	];
	CKEDITOR.config.removePlugins  = 'elementspath';
	CKEDITOR.replace( 'id_aval_encerramento_conteudo', {extraPlugins : 'especiais_login', toolbar : tool });
	
	$('input, select, textarea').live('blur', function() {
	    CKEDITOR.instances.id_aval_encerramento_conteudo.updateElement();
	});
	$('.cke_wysiwyg_frame').live('keyup', function() {
	    CKEDITOR.instances.id_aval_encerramento_conteudo.updateElement();
	});
	$('.cke_wysiwyg_frame').live('keypress', function() {
	    CKEDITOR.instances.id_aval_encerramento_conteudo.updateElement();
	});*/
	
	
		
		
	}); 