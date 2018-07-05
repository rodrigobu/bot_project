
var recarregar_listagem = function(){
    $('#colaboradores').djflexgrid({
        url         : URL_LISTA_AVAL,
        filter_form : '#filter_form form', completeLoad: function () {
        $('[title]').tooltip();
    } });
};

var _inserir = function(form, colaborador, dialog){
    $.dialogs.confirm('Você realmente deseja inserir a avaliação?', function () { // callback yes
	    console.log("Dados:");
	    console.log(form.serialize()+"&colaborador="+colaborador);
	    $.post(URL_INSERE_AVAL,  form.serialize()+"&colaborador="+colaborador,  function(response){
	        if(response["status"]=="ok"){
	            dialog.dialog('close');
		        $.dialogs.success('Avaliação inserida com sucesso.', function(){
		            location.href = URL_EDICAO_AVAL.replace('/0/', '/' + colaborador + '/');
		        });
	        }else{
		        $.dialogs.success(response["msg"]);
	        };
	    });
    }, function(){ // callback no;
	    form.find('[name=questionario]').val(null);
	}); 
};

var salvar_avaliacao = function(form, colab_id, dialog){
	    var colaborador   = colab_id;//form.attr("colaborador");
	    console.log("colaborador:"); console.log(colaborador);
	    var perspectivas  = form.find('[name=perspectivas]');
	    clean_required(perspectivas);
	    
	    if (form.find('.error').length == 0) {
		    if ( $('[name=perspectivas][value=C]:checked').length!=0 ){
			    var questionario  = form.find('[name=questionario]');
			    console.log(questionario.val());
			    if (questionario.val()==""){
			    	confirm_questionario('Escolha o Tipo de Questionário', 'Não existem avaliações comportamentais cadastradas.\
		                    Escolha um tipo de questionário,\
		                    Para a organização (NCCo) ou Para a função (NCCf).',
			            function(){ // callback ncco
			              var field_questionario = form.find('[name=questionario]');
			              field_questionario.val('0');
		                  _inserir(form, colab_id, dialog);
			            }, function(){ // callback nccf
			              var field_questionario = form.find('[name=questionario]');
			              field_questionario.val('f');
		                  _inserir(form, colab_id, dialog);
			            }, function(){ }
			         );
			    } else{
			    	_inserir(form, colab_id, dialog);
			    }
		    }else{
		      _inserir(form, colab_id, dialog);
		    };
	    }
	    return false;
};

var inserir_avaliacao = function(colab_id){
	$.post(URL_GET_FORM_AVAL,  "colaborador="+colab_id,  function(response){
		$("#dialog_avaliacao").html(response["html"]);
	    var dialog = $('.dialog-inserir-avaliacao').clone(false);
	    dialog.dialog({
	        ace_theme            : true,
	        ace_title_icon_right : 'fa fa-pencil',
	        title     : 'Inserir Avaliação',
	        buttons: {
	            c: {
	                'class' : 'btn btn-xs',
	                text    : 'Cancelar',
	                click   : function(){ $(this).dialog('close'); }
	            },
	            i: {
	                'class' : 'btn btn-xs btn-success pull-right',
	                text    : 'Inserir',
	                click   : function(){ 
	                	salvar_avaliacao($(this).find('form'), colab_id, dialog);
	                	//$(this).find('form').submit(); 
	                }
	            }
	        },
	        close     : function(){ $(this).dialog('destroy'); },
	        hide      : 'fade',
	        modal     : true,
	        resizable : false,
	        open      : function(){ 
                var form = dialog.find('form');
                form.attr("colaborador",colab_id);
            }, 
	        show      : 'fade',
	        width     : '45%'
	    });
	    
	});

};
// Deleção de Avaliadores/Avaliação
var delete_avaliacao_colab = function (url, id){
	// Ação de excluir 
    function _xhr (url, data){
        // POST
        $.post(url, data, function(response){
            if (response['status'] == 'ok'){
                $.dialogs.success('Avaliação excluída com sucesso.', function(){
                    var settings = $('#colaboradores').data('djflexgrid');
                    settings.methods.reload();
                });
            }else{
                $.dialogs.error("Não foi possível excluir esta avaliação.");
            };
        });
    };
    $.dialogs.confirm(
        'Excluir Avaliação',
        'Ao excluir esta avaliação, as respostas também serão excluídas. Deseja realmente prosseguir?',
        function(){
            _xhr(url, 'id='+id);
        }
    );
};
$(function(){
	
	recarregar_listagem();
	$(".excluir").live('click', function(){
		var id = $(this).attr('id').replace('excluir_', "");
		delete_avaliacao_colab(URL_EXCLUIR_AVAL, id);
	});
	// Filtragem
	$("#filter_form").blur(function() {
		recarregar_listagem();
	});


});
