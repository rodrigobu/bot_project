var change_param_url = function(url, param, value){
    return url.replace('/'+param+'/0/', '/'+param+'/'+value+'/');
};

var salvar_de_para = function(tipo, funcao_id){
	console.log(tipo);
	console.log(funcao_id);
	
	var URL_SALVAR = '';
	var data       = {};
	
	if (tipo=='de'){
		// Exemplo: ncf/tec/gerenciamento/de/6/para/19/
		console.log("URL_PARA");
		console.log(URL_PARA);
		URL_SALVAR = URL_PARA;
	    URL_SALVAR = change_param_url(URL_SALVAR, 'de',   $("#id_de").val());
	    URL_SALVAR = change_param_url(URL_SALVAR, 'para', funcao_id);
	} else {
		console.log("URL_DE");
		console.log(URL_DE);
		URL_SALVAR = URL_DE;
	    URL_SALVAR = change_param_url(URL_SALVAR, 'de',   funcao_id);
		data = $('#id_para').serialize();
	}
	console.log(URL_SALVAR);
	mostrarCarregando();
	$.ajax({
	    url      : URL_SALVAR,
		type     : 'post',
		dataType : 'json',
		async    : false,
		data     : data,
		success  : function(dados) {
			if (dados["status"]=='ok'){
                $.dialogs.success( 'Cópia concluída', 'A cópia do mapeamento foi realizada com sucesso.' );
                recarregar_listagem();
				$("#modal_depara").dialog('close');
			}
		},
		complete : esconderCarregando
	});
};
            
var criar_dialog_de_para = function(tipo, funcao_id) {
	// Monta a dialog de De/Para da função escolhida
    $.ajax({
	    url      : URL_GET_DE_PARA_DIALOG,
		type     : 'post',
		dataType : 'json',
		async    : false,
		data     : { 
		    'tipo'      : tipo,
			'funcao_id' : funcao_id 
		},
		success  : function(dados) {
		    if(dados["status"]!='ok'){
			    $.dialogs.error(dados["msg"]);
				return;
			} else{ 
	    	    $("#modal_depara").html(dados["html"]);
				$("#modal_depara").dialog({
				    hide                : 'fade',
					show                : 'fade',
					ace_theme           : true,
					ace_title_icon_left : 'fa fa-edit',
					title               : "Copiar",
					width               : 530,
					buttons             : {
					    Cancelar : {
						    click  : function() { $(this).dialog('close'); },
							'class': 'btn btn-xs btn-danger',
							text   : "Cancelar"
						},
						Salvar : {
							click  : function() { salvar_de_para(tipo, funcao_id); },
							'class': 'btn btn-xs btn-success ',
							text   : "Salvar"
						},
					},
					close : function() {
						$.loading.hide();
						$(this).dialog('close').dialog('destroy');
					}
				});
				if (tipo=="para"){
					$("#id_para").multiSelect({
	                    selectableHeader: 'Funções: ',
			            selectionHeader : 'Funções selecionadas: '
	                });
                }
			}
		}
    });
};

$(function() {
	
	$('.copiar_de').die('click');
	$('.copiar_de').live('click', function() {
		if($(this).hasClass('disabled')) return;
        var funcao_id = $(this).attr('funcao_id');
        criar_dialog_de_para('de', funcao_id);    
    });
    
	$('.copiar_para').die('click');
    $('.copiar_para').live('click', function() {
		if($(this).hasClass('disabled')) return;
        var funcao_id = $(this).attr('funcao_id');
        criar_dialog_de_para('para', funcao_id); 
    });
    
});
