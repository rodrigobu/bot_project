var editar_it = function(){
		mostrarCarregando();
        var id = $(this).attr('id').replace('editar_', "");
        $.ajax({
            url : URL_CAD_ITEM,
            dataType : 'json',
            type : 'get',
            data : {
                'escala_ct' : $('#id_campo_id').val(),
                'id'        : id,
            },
            success : function(retorno) {
                if(retorno["ajax_status"]!=undefined){
                    $.dialogs.success(retorno["ajax_msg"]);
                    esconderCarregando();
                    return false;
                }
                $('#item_cad').html(retorno);
                $('#id_campo_it_id').val(id);
                $("#item_cad").show();
                $("#id_descricao").focus();
                form_validations($("#formulario_it"));
                esconderCarregando();
            },
            error : function() {
                $.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato.");
                esconderCarregando();
            }
        });
    };
var excluir_it = function() {
    var id = $(this).attr('id').replace('excluir_', "");
    $.dialogs.confirm('Deseja realmente excluir ?', 'Confirmação', function(r) {
        if (r) {
            var ordenacao = [];
            $(".item").each(function() {
                ordenacao.push($(this).prop("id").replace("linha_", ""));
            });
            $.ajax({
                url : URL_EXC_ITEM,
                dataType : 'json',
                type     : 'get',
                data     : {
                    'pk'     : id,
                    "valor"  : ordenacao,
                },
                success : function(retorno) {
                    if (retorno.status == 'ok') {
                    	$("#linha_"+id).remove();
                        $.dialogs.success(retorno.msg);
                        atualizar_ordem();
                        
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
var atualizar_ordem = function() {
	mostrarCarregando();
    var ordenacao = [];
    $(".item").each(function() {
        ordenacao.push($(this).prop("id").replace("linha_", ""));
    });
    $.ajax({
        url : URL_ATT_ORDEM,
        dataType : 'get',
        data : {
            "valor" : ordenacao,
            "pk"    : $("#id_campo_id").val()
        },
        success : function(retorno) {
        	esconderCarregando();
        },
        error : function(retorno) {
        	$(".fixed").each(function(key) {
		        $(this).html('<span width="5px">'+ key + '</span>');
		    });
		    esconderCarregando();
        },
    });
    
};
$(function(){
    $(".editar_it").live('click', editar_it);
    $(".excluir_it").live('click', excluir_it);
    $("#id_submit_form").live('click', function(){
        $("#formulario_it").valid();
        form_validations($("#formulario_it"));
        mostrarCarregando();
        $.when(submit_form(pre_save=true)).then(function(retorno){
        $.ajax({
            url      : URL_CAD_ITEM,
            async    : false,
            dataType : 'json',
            type     : 'post',
            data     : {
                escala_ct : $('#id_campo_id').val(),
                id        : $('#id_campo_it_id').val(),
                dados     : get_hash_from_form('#formulario_it', ''),
            },
            success : function(retorno) {
                if (retorno['ajax_status'] == 'ok') {
                    $.dialogs.success(titulo+' '+retorno.msg);
                    $("#listagem_itens").html(retorno['html_list']);
                    $(".sortable").children().sortable();
                    $(".sortable").on("sortupdate", function(){
                        atualizar_ordem(); 
                    });
                    $(".sortable").children().disableSelection();
                    $("#item_cad").hide();
                    atualizar_ordem();
                    $("#formulario_it input:not(:button, :radio)").val('');
                    form_validations($("#formulario_it"));
                } else {
                    //$.dialogs.error(retorno["ajax_msg"]);
                    gerate_errors(retorno['error_list']);
					retorno = false;
                }
                
                esconderCarregando();
            },
            error : function() {
            	esconderCarregando();
                $.dialogs.error("Ocorreu um erro ao encaminhar os dados, por favor entre em contato."); 
            },
        });
    });
    });     
});
