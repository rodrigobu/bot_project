

// Inicialização
$(function(){

    $('input[type=checkbox]').bind('click.checks').unbind('click.checks', function(e){
        $(this).attr('checked', $(this).is(':checked'));
    });
    
    // Recarregar Flexgrids
    $('.recarregar-aptidao').live('click', recarregar_aptidoes);
    recarregar_aptidoes();
    $('.recarregar-cognitiva').live('click', recarregar_cognitiva);
    recarregar_cognitiva();


    // Ações dos botões de excluir, e salvamento automatico.
    criar_acoes_automaticas();
    
    // Deletar em Massa
    $('.deletar').on('click', function () { 
    	deletar_em_massa(this);  
    });

    $('.concluir').on('click', function(){
	    var flexgrids = $('#cognitivas, #aptidoes').find('.ajax_list');
	    var invalidos = flexgrids.find('tr.danger');
	    
	    // -- Não deixa concluir senão tiver pelo menos uma
	    // -- Não deixa concluir se houver alguma pendencia.
	    if( $("#cognitivas .ajax_list_row").length==0 && $("#aptidoes .ajax_list_row").length==0 ){
	        $.dialogs.error('É necessário pelo menos uma competência cognitiva ou aptidão para concluir as edições.');
	        return;
	    }else if (invalidos.length > 0) {
	        $.dialogs.error('Existem competências inválidas. Para continuar faça a correção.');
	        return;
	    } else { 
	    	$.dialogs.confirm('Você realmente deseja concluir?', function(){
	    		$("#form_cts_gerenciamento").submit();
	    	});
	    }
	    
    });
    
	// Adicionar Competências
    $('.add-cognitiva').on('click', function(){
        $('.dialog-add-cognitiva').dialog({
        	modal     : true,
	        hide      : 'fade',
	        show      : 'fade',
	        ace_theme : true,
	        buttons   : {},
	        close: function(){
	             $(this).dialog('close').dialog('destroy');
	        },
            buttons: {
               s: { // Botão Adicionar
                   click: function(){ salvar_competencia( $(this), 'competencia', 'competência'); },
                   'class' : 'btn btn-xs btn-success pull-right',
                   text    : 'Adicionar'
               }
            },
            open: function(){
                get_familiasct($(this));
            },
            title: 'Adicionar Cognitivas',
            width: '80%'
        });
    });
    
    // Adicionar Aptidões
    $('.add-aptidao').on('click', function(){
        $('.dialog-add-aptidao').dialog({
        	modal     : true,
	        hide      : 'fade',
	        show      : 'fade',
	        ace_theme : true,
	        buttons   : {},
	        close: function(){
	             $(this).dialog('close').dialog('destroy');
	        },
            buttons: {
               s: { // Botão Adicionar
                   click   : function(){ salvar_competencia( $(this), 'aptidao', 'aptidão'); },
                   'class' : 'btn btn-xs btn-success pull-right adiciona',
                   text    : 'Adicionar'
               }
           },
           open: function(){
                get_aptidoes($(this));
           },
           title: 'Adicionar Aptidões',
           width: '80%'
        });
    });

    
});
