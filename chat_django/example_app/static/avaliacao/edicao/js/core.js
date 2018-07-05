
// Seta os id nos 0 das urls geradas
var set_id = function(url, id){ 
	return url.replace('/0/', '/' + id + '/');  
};

// Listagens
var carregar_lista_c = function(){
    if ($('#avaliadores_c').length > 0){
        $('#avaliadores_c').djflexgrid({
             url          : set_id(URL_LISTAR_AVAL_C, _colab_id),
             completeLoad : function(){
                 $('[title]').tooltip();
                 $('#avaliadores_c').find('tbody tr .excluir').click(function(){
                     delete_evaluator_c( $(this).closest('tr').attr('cache-id'), $(this).attr('tem_resp') );
                 });
                 $('#avaliadores_c').find('tbody tr .edit').click(function(){
                     edit_evaluator_c( $(this).closest('tr').attr('cache-id') );
                 });
             }
        });
    };
};
var carregar_lista_r = function(){
    if ($('#avaliadores_r').length > 0){
        $('#avaliadores_r').djflexgrid({
             url          : set_id(URL_LISTAR_AVAL_R, _colab_id),
             completeLoad : function(){
                 $('[title]').tooltip();
                 $('#avaliadores_r').find('tbody tr .excluir').click(function(){
                     delete_evaluator_r( $(this).closest('tr').attr('cache-id'), $(this).attr('tem_resp') );
                 });
                 $('#avaliadores_r').find('tbody tr .edit').click(function(){
                     edit_evaluator_r( $(this).closest('tr').attr('cache-id') );
                 });
             }
        });
    };
};
var carregar_lista_t = function(){
    if ($('#avaliadores_t').length > 0){
        $('#avaliadores_t').djflexgrid({
             url          : set_id(URL_LISTAR_AVAL_T, _colab_id),
             completeLoad : function(){
                 $('[title]').tooltip();
                 $('#avaliadores_t').find('tbody tr .excluir').click(function(){
                     delete_evaluator_t( $(this).closest('tr').attr('cache-id'), $(this).attr('tem_resp') );
                 });
                 $('#avaliadores_t').find('tbody tr .edit').click(function(){
                     edit_evaluator_t( $(this).closest('tr').attr('cache-id') );
                 });
             }
        });
    };
};
var carregar_listas = function(){
	carregar_lista_c();
    carregar_lista_r();
    carregar_lista_t();
};

// Alterar Questionário
var _change_quest_id = function(){
    var link     = $(this);
    var label    = link.closest('label');
    var span     = label.find('span');
    var quest_id = label.find(':hidden').val();
    var text     = $.trim(link.text());
    var texto_clean = text.split("(")[1].replace(")", "");
    console.log(texto_clean);
    var texto_oposto = texto_clean == 'NCCf' ? 'NCCo' : 'NCCf';
    msg = 'Deseja realmente trocar o questionário deste avaliado? ';
    if ( texto_clean == 'NCCf' )
        msg += 'Na troca da avaliação do tipo NCCo para NCCf, as respostas serão APAGADAS.';
    $.dialogs.confirm( 'Alterar Questionário',  msg,
        function(){  // callback yes
            $.post(set_id(URL_QUEST_TROCA_AVAL, _colab_id), 'quest_id='+quest_id, function(){
               $.dialogs.success('O questionário foi alterado com sucesso.', function(){
                   var link2 = $('<a href="javascript:void(0)" class="grey" title="Clique para mudar para este questionário"> <input type="hidden" name="quest_id" /></a>');
                   var span2 = $('<span class="green"><i class="ace-icon fa fa-check"></i></span>');
                   link2.prepend(span.text());
                   span.replaceWith(link2);
                   span2.prepend(link.text());
                   link.replaceWith(span2);
                   if (quest_id == '0'){
                       link2.find(':hidden').val(_colab_funcao_id);
                   }else{
                       link2.find(':hidden').val('0');
                   };
                   //link2.die("click",_change_quest_id);
                   //link2.live("click",_change_quest_id);
                   link2.tooltip();
                   var settings_flexgrid = $('#avaliadores_c').data('djflexgrid');
                   settings_flexgrid.methods.reload();
               });
            });
        }
    );
};

// Cadastrar Avaliação
var _inserir_avaliacaol  = function (perspectiva, questionario){
	$.post(set_id(URL_INSERE_AVALIACAO, _colab_id), "perspectivas="+perspectiva+"&questionario="+questionario, function(response){
        if (response["status"]=='ok'){
            $.dialogs.success('Avaliação cadastrada com sucesso.', function(){ window.location = URL_EDICAO; });
        }else{
            $.dialogs.error(response["msg"]);
        };
    });
};
var cadastrar_avaliacaol = function (perspectiva, questionario){
	if (perspectiva=="C" && questionario==''){
	    confirm_questionario('Escolha o Tipo de Questionário', 'Não existem avaliações comportamentais cadastradas. Escolha um tipo de questionário, Para a organização (NCCo) ou Para a função (NCCf).',
			function(){ _inserir_avaliacaol(perspectiva,"0");}, 
			function(){ _inserir_avaliacaol(perspectiva,"f");}, 
			function(){ }
		);
	}else{
		_inserir_avaliacaol(perspectiva,"");
	}
};
    
// Detalhes de Avaliadores/Avaliação ('c', delete_evaluator_c, avaliador_id, aval_id)
var abrir_form_edicao = function(tipo, delete_handler, avaliador_id, aval_id){
	
	var extra = "&avaliador=" +avaliador_id + "&aval="+aval_id + "&perspectiva=" +tipo;
	var form  = $("#form_editar_avaliador");
	
    $.getJSON(URL_GET_FORM_AVAL_EDICAO + extra, function(json){
        // Preenchendo informações
        form.html(json.html);
        $("#id_form_edicao-status").find("option[value="+json.status+"]").attr('selected', 'selected');
        if (json.status == 4){ // Avaliação Respondida e Finalizada
            // Desabilitando Formulário
            form.find('[name=relacao]').prop('disabled', true);
            form.closest('.ui-dialog').find('button.editar').addClass('hidden');
            // Link para Liberar Avaliação
            form.append('<a href="javascript:void(0)" class="liberar-avaliacao pull-right"><i class="ace-icon fa fa-unlock"></i> Liberar Avaliação para edição </a>');
            form.find('.liberar-avaliacao').click(function(){
                var link     = $(this);
                var titulo   = 'Liberar Avaliação';
                var mensagem = 'Após a liberação você poderá editar a relação. Deseja Liberar para edição ?';
                $.dialogs.confirm(titulo, mensagem, function(){
                    // Para Liberar Avaliação
                    $.post(URL_SALVA_AVALIADOR + extra+"&relacao="+$(this).find('#id_form_edicao-relacao').val(),  { }, 
                    	function(response){
	                        form.html("");
	                        $(this).dialog('close');
				            if(tipo=='c')carregar_lista_c(); 
				            if(tipo=='r')carregar_lista_r(); 
				            if(tipo=='t')carregar_lista_t(); 
                    }); // Para Liberar Avaliação (FIM)
                });
            });
        }; // Avaliação Respondida e Finalizada (FIM)
        
        // Dialog 
        $('.dialog-editar-avaliador').dialog({
		    ace_theme            : true,
		    ace_title_icon_right : 'fa fa-pencil',
		    hide                 : 'fade',
		    modal                : true,
		    resizable            : false,
		    show                 : 'fade',
		    title                : 'Editar Avaliador',
		    width                : '60%',
		    buttons              : {
		        c: {
		            'class': 'btn btn-xs',
		            text   : 'Cancelar',
		            click  : function(){  $(this).dialog('close'); }
		        },
		        e: {
		            'class': 'btn btn-xs btn-success pull-right editar',
		            text   : 'Salvar',
		            click  : function(){ 
	                     $.get(URL_SALVA_AVALIADOR + extra +"&relacao="+$(this).find('#id_form_edicao-relacao').val(),  {}, 
	                    	function(response){
	                          form.html("");
	                          $('.dialog-editar-avaliador').dialog('close');
				              if(tipo=='c')carregar_lista_c(); 
				              if(tipo=='r')carregar_lista_r(); 
				              if(tipo=='t')carregar_lista_t(); 
				              $.dialogs.success('Avaliador alterado com sucesso.');
	                    }); 
                    }
		        }
		    },
		    close : function(){ $(this).dialog('destroy'); }
        });
    }); // Preenchendo informações (FIM)
};

var abrir_form_c = function(avaliador_id, aval_id){
	abrir_form_edicao('c', delete_evaluator_c, avaliador_id, aval_id);
};
var abrir_form_t = function(avaliador_id, aval_id){
	abrir_form_edicao('t', delete_evaluator_t, avaliador_id, aval_id);
};
var abrir_form_r = function(avaliador_id, aval_id){
	abrir_form_edicao('r', delete_evaluator_r, avaliador_id, aval_id);
};



// Deleção de Avaliadores/Avaliação
var _delete_evaluator = function (tipo, id, flexgrid, tem_resp){
	url = URL_EXCLUIR+tipo+'&avaliador='+id;
	msg = 'Deseja realmente excluir este avaliador?';
	if (tem_resp=="True"){
	    msg = 'O avaliador selecionado já possui respostas para a avaliação. ' +msg;
	}
	$.dialogs.confirm('Excluir Avaliador',msg, function () { 
		$.get(url, {}, function(response){
		if (response["status"]=="ok"){
            $.dialogs.success('Avaliador excluído com sucesso.', function(){
			    if(tipo=='c')carregar_lista_c(); 
				if(tipo=='r')carregar_lista_r(); 
				if(tipo=='t')carregar_lista_t(); 
            });
		}
	});
	});
};
var delete_evaluator_c = function(_id, tem_resp){
    _delete_evaluator('c', _id, '#avaliadores_c', tem_resp);
};
var delete_evaluator_r = function(_id, tem_resp){
    _delete_evaluator('r', _id, '#avaliadores_r', tem_resp);
};
var delete_evaluator_t = function(_id, tem_resp){
    _delete_evaluator('t', _id, '#avaliadores_t', tem_resp);
};


// Recupera a lista dos avaliadores para inserir na avaliação: Gera um JSON com os dados -- tipo: c|t|r 
var _gerar_avaliadores = function(tipo){
    var avals_para_cadastrar = [];
	$.each( $("#avaliadores_para_add"+tipo+" .cbox:checked"), function(idx, value){
	    var id_avaliador = $(value).attr("id").replace("ex_resp_aval_dores_","");
		avals_para_cadastrar.push({ 
		    'id_avaliador': id_avaliador,
			'relacao'     : $("#id_form_relacao_"+_colab_id+"_by_"+id_avaliador+"-relacao").val(),
		});
	});
	return avals_para_cadastrar;
};

// Adicionar avaliador Geral (para a dialog da inserção)
var _add_avaliador_geral = function(perspectiva){
	var avaliador = $("#id_form_new_aval"+perspectiva+"_"+_colab_id+"-colab").val();
	if($("#ex_resp_aval_dores_"+avaliador).length){
		$.dialogs.error("Avaliador já selecionado.");
		return;
	}
	$.post(URL_GET_FORM_AVAL_INDIVIDUAL, 'perspectiva='+perspectiva+'&colaborador='+_colab_id+'&avaliador='+avaliador, 
      function(response){
          if (response["status"]=='ok'){
              $("#avaliadores_para_add"+perspectiva).append(response["html"]);
          }else{
          	  $.dialogs.error(response["msg"]);
          }
	});   
};

var CONFIG_DIALOG_GERAL = {
    title                : 'Inserir Avaliador',
    ace_theme            : true,
    ace_title_icon_right : 'fa fa-users',
    show                 : 'fade',
    width                : '50%',
    hide                 : 'fade',
    modal                : true, 
    resizable            : false,
    close                : function(){ 
    	$("#avaliadores_para_addc, #avaliadores_para_addt, #avaliadores_para_addr").html(""); 
    	$(this).dialog('destroy'); 
    }
};

// Salvar o avaliador para a Comportamental
var bt_inserir_avaliador = function(tipo, prefixo){
    $('#dialog-inserir-avaliador'+tipo).dialog($.extend( CONFIG_DIALOG_GERAL, {
        buttons              : {
            c: {
                'class' : 'btn btn-xs',
                text    : 'Cancelar',
                click   : function(){ 
					$('#avaliadores_para_add'+tipo).html('');
                	$(this).dialog('close'); 
                }
            },
            i: {
                'class': 'btn btn-xs btn-success pull-right',
                text   : 'Inserir',
                click  : function(){ 
                	// Envio dos dados
					if(tipo=='c') dados = { "avalscomp_para_cadastrar": _gerar_avaliadores(tipo) };
					if(tipo=='r') dados = { "avalsresp_para_cadastrar": _gerar_avaliadores(tipo) };
					if(tipo=='t') dados = { "avalstec_para_cadastrar": _gerar_avaliadores(tipo) };
					console.log(dados);
					$.ajax({
						url      : set_id(URL_INSERE_AVALIADOR, _colab_id),
						type     : 'post',
						dataType : 'json',
						data     : dados,
						success : function(response) {
				          if (response["status"]=='ok'){
				              $.dialogs.success('Avaliador(es) inserido(s) com sucesso.', function(){ 
				              	 if(tipo=='c')carregar_lista_c(); 
				              	 if(tipo=='r')carregar_lista_r(); 
				              	 if(tipo=='t')carregar_lista_t(); 
					             $('#dialog-inserir-avaliador'+tipo).dialog('close');
					             $('#avaliadores_para_add'+tipo).html('');
					             $("#id_form_new_aval"+tipo+"_"+_colab_id+"-colab").val('');
				              });
				          }else{
				          	  $.dialogs.error(response["msg"]);
				          }
				        }
					});
                }
            }
        },
    }));
};


$(function(){
    $('.questionario:not(span) a').die("click");
    $('.questionario:not(span) a').live("click", _change_quest_id);
    
    $('#bt_inserir_avaliador_comp').die("click");
    $('#bt_inserir_avaliador_comp').live("click", function(){
    	bt_inserir_avaliador("c", "comp");
    });
    
    $('#bt_inserir_avaliador_tec').die("click");
    $('#bt_inserir_avaliador_tec').live("click", function(){
    	bt_inserir_avaliador("t", "tec");
    });
    
    $('#bt_inserir_avaliador_resp').die("click");
    $('#bt_inserir_avaliador_resp').live("click", function(){
    	bt_inserir_avaliador("r", "resp");
    });
    
    // Adicionar avaliador para a avaliação
	$("#add_avals_btnc").click(function(){ _add_avaliador_geral('c'); });
	$("#add_avals_btnt").click(function(){ _add_avaliador_geral('t'); });
	$("#add_avals_btnr").click(function(){ _add_avaliador_geral('r'); });
    
    carregar_listas();
});
