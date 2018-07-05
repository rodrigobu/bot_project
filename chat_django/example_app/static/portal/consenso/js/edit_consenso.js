var get_ids = function(compt){
    var ids = [];
     $.each($("#lista-"+compt+" tbody tr"), function(){
        ids.push($(this).attr('id')
                 +"|"+
                 $(this).find('.'+compt+'_auto').val()
                 +"|"+
                 $(this).find('.'+compt+'_sup').val()
        );
    });
    return ids;
};


var edit_competencia = function(){
	mostrarCarregando();
	var id_comp = get_ids('comp');
	var id_tec = get_ids('tec');
    var id_resp = get_ids('resp');
    var user_id = $(".colab").attr('id').replace('user_id_', '');
    var superior_id = $(".superior").attr('id').replace('user_id_', '');
	$.ajax({
		url : URL_EDIT_COMPET,
		dataType : 'json',
		type : 'post',
		data : {
			'id_comp' : id_comp,
            'id_tec' : id_tec,
            'id_resp' : id_resp,
			'user_id': user_id,
            'superior_id': superior_id
		},
		success : function(retorno) {
			if (retorno["status"] != undefined) {
                esconderCarregando();
				$.dialogs.success(retorno["ajax_msg"], function(){
                    window.location.href = '/portal/consenso/revisao';
                });
			}
			esconderCarregando();
			//$("#id_descricao").focus();
		},
		error : function() {
			esconderCarregando();
			$.dialogs.error("Ocorreu um erro ao retornar os dados, por favor entre em contato.");
		}
	});
};


$(function(){
    if (!$("#lista-comp tr").hasClass('notregister')){
        $("#lista-comp").dataTable({
            "bPaginate": false,
            "bFilter": false,
            "oLanguage": {
                "sProcessing": "Aguarde enquanto os dados são carregados ...",
                "sLengthMenu": "Mostrar _MENU_ registros por pagina",
                "sZeroRecords": "Nenhum registro correspondente ao criterio encontrado",
                "sInfoEmtpy": "Exibindo 0 a 0 de 0 registros",
                "sInfo": "Exibindo de _START_ a _END_ de _TOTAL_ registros",
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sSearch": "Procurar",
                "oPaginate": {
                    "sFirst":    "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext":     "Próximo",
                    "sLast":     "Último"
                }
            }
        });
    };

    if (!$("#lista-tec tr").hasClass('notregister')){
        $("#lista-tec").dataTable({
            "bPaginate": false,
            "bFilter": false,
            "oLanguage": {
                "sProcessing": "Aguarde enquanto os dados são carregados ...",
                "sLengthMenu": "Mostrar _MENU_ registros por pagina",
                "sZeroRecords": "Nenhum registro correspondente ao criterio encontrado",
                "sInfoEmtpy": "Exibindo 0 a 0 de 0 registros",
                "sInfo": "Exibindo de _START_ a _END_ de _TOTAL_ registros",
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sSearch": "Procurar",
                "oPaginate": {
                    "sFirst":    "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext":     "Próximo",
                    "sLast":     "Último"
                }
            }
        });
    };

    if (!$("#lista-resp tr").hasClass('notregister')){
        $("#lista-resp").dataTable({
            "bPaginate": false,
            "bFilter": false,
            "oLanguage": {
                "sProcessing": "Aguarde enquanto os dados são carregados ...",
                "sLengthMenu": "Mostrar _MENU_ registros por pagina",
                "sZeroRecords": "Nenhum registro correspondente ao criterio encontrado",
                "sInfoEmtpy": "Exibindo 0 a 0 de 0 registros",
                "sInfo": "Exibindo de _START_ a _END_ de _TOTAL_ registros",
                "sInfoFiltered": "",
                "sInfoEmpty": "",
                "sSearch": "Procurar",
                "oPaginate": {
                    "sFirst":    "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext":     "Próximo",
                    "sLast":     "Último"
                }
            }
        });
    };
});
