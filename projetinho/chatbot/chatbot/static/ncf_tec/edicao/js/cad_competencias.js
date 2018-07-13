
var salvar_novact = function(){
	mostrarCarregando("Salvando ...");
    if( $("#id_1-descricao").val().replace(" ","")=='' ){
         $.dialogs.error("O campo Descrição é obrigatório.");
     	 esconderCarregando();
         return;
    }
	var data       = $('#cad_ct_form').serialize()+"&aptidao=false";
    var familia_id = $("#id_1-familia_ct").val();
    console.log(data);
    $.post(URL_CRIAR_CTS, data, function(response){  
     	if(response["status"]=="ok"){
     		// Fecha dialog
     		$('.dialog-cad-cognitiva').dialog("close");
     		// Alerta de sucesso
            $.dialogs.success("Competência cadastrada com sucesso.");
     	    esconderCarregando();
     		// Limpa o form
     		$('#cad_cognitiva_form').html("");
     		// Reload nas listagens
     		console.log("#table_cts_familia_"+familia_id);
     		if ($("#table_cts_familia_"+familia_id).length!=0){
     		    var seletor = "#table_cts_familia_"+familia_id+" table tbody";
     		    var seletor_check = "#table_cts_familia_"+familia_id+" [value='"+response["id"]+"'";
     		} else {
     		    var seletor = "#table_cts table tbody";
     		    var seletor_check = "#table_cts [value='"+response["id"]+"'";
     		}
     		$(seletor).append('<tr>\
                     <td class="center"> \
                         <span>\
                             <input type="checkbox" name="ct" value="'+response["id"]+'" class=""> \
                             <span class="lbl"></span> \
                         </span> \
                     </td> \
                     <td> <span> '+response["descricao"]+' </span> </td> \
                  </tr>');
            $(seletor_check).click();
     	}else{
     		$.dialogs.error(response["msg"]);
     	    esconderCarregando();
     	}
     }).done(function() { esconderCarregando(); }).fail(function() { esconderCarregando(); });
};

// Cadastrar Competências
var abrir_cad_ct_cognitiva = function(){
    var button     = $(this);
    // Gerar Formulário
    $.post(URL_GET_FORM_CTS, { 'tipo' : button.attr("id") }, function(response){  
     	if(response["status"]=="ok"){
     		$('#cad_cognitiva_form').html(response["html"]);
     		$("#id_1-familia_ct option[value='']").remove();
     		// Abrir Dialog
		    $('.dialog-cad-cognitiva').dialog({
		        title: 'Cadastrar Cognitivas',
		        modal     : true,
			    hide      : 'fade',
			    show      : 'fade',
			    ace_theme : true,
			    width     : '40%',
			    close     : function(){
			        $(this).dialog('close').dialog('destroy');
			    },
		        buttons   : {
		        	c: { // Botão Cancelar
		               click  : function () { $(this).dialog('close'); },
		               'class': 'btn btn-xs',
		               text   : 'Cancelar'
		            },
		            s: { // Botão Salvar
		                click : salvar_novact,
		               'class': 'btn btn-xs btn-success pull-right',
		               text   : 'Salvar'
		            }
		         }
		     });
     	}else{
     		$.dialogs.error(response["msg"]);
     	}
    });
     
};

var salvar_novaaptidao = function(){
    if( $("#id_1-descricao").val().replace(" ","")=='' ){
         $.dialogs.error("O campo Descrição é obrigatório.");
         return;
    }		                   
    $.post(URL_CRIAR_CTS, {
    	'aptidao'       : "true",
    	'1-descricao': $("#id_1-descricao").val(),
    	'1-conceito' : $("#id_1-conceito").val(),
    }, function(response){  
     	if(response["status"]=="ok"){
     		// Limpa o form
     		$('#cad_aptidao_form').html("");
     		// Reload nas listagens
     		$("#table_cts_aptidoes tbody").append('<tr>\
                     <td class="center"> \
                         <span>\
                             <input type="checkbox" name="ct" value="'+response["id"]+'" class=""> \
                             <span class="lbl"></span> \
                         </span> \
                     </td> \
                     <td> <span> '+response["descricao"]+' </span> </td> \
                  </tr>');
     		// Fecha dialog
            $("#table_cts_aptidoes [value='"+response["id"]+"'").click();
     		$('.dialog-cad-aptidao').dialog("close");
     		// Alerta de sucesso
            $.dialogs.success("Aptidão cadastrada com sucesso.");
     	}else{
     		$.dialogs.error(response["msg"]);
     	}
    });
};


// Cadastrar Aptidão
var abrir_cad_ct_aptidao = function(){
    // Gerar Formulário
    $.post(URL_GET_FORM_CTS, {}, function(response){  
     	if(response["status"]=="ok"){
     		$('#cad_aptidao_form').html(response["html"]);
     		// Abrir Dialog
		    $('.dialog-cad-aptidao').dialog({
		        title: 'Cadastrar Aptidão',
		        modal     : true,
			    hide      : 'fade',
			    show      : 'fade',
			    ace_theme : true,
			    width     : '30%',
			    close     : function(){
			        $(this).dialog('close').dialog('destroy');
			    },
		        buttons   : {
		        	c: { // Botão Cancelar
		               click  : function () { $(this).dialog('close'); },
		               'class': 'btn btn-xs',
		               text   : 'Cancelar'
		            },
		            s: { // Botão Salvar
		                click : salvar_novaaptidao,
		               'class': 'btn btn-xs btn-success pull-right',
		               text   : 'Salvar'
		            }
		         }
		     });
     	}else{
     		$.dialogs.error(response["msg"]);
     	}
    }).done(function() { esconderCarregando(); }).fail(function() { esconderCarregando(); });
     
};
