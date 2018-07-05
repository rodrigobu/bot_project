// ### --- Listagem e Filtros --- ### //
var HAB_MORE_PAGES = false;
var NUM_PAGINA     = 1;
var TOTALIZADOR    = 0;

var popular_colabs = function(dados, novo, tudo){
	if (dados['error'] != undefined) {
		jError(dados['error'], config_jnotify);
	}
	if (dados['rows'] != undefined) {
		if (novo || tudo==true) {
			$('#grid-table tbody').html("");
            TOTALIZADOR = 0;
		}
		if (novo && dados['rows'].length==0){
            $.dialogs.warning("Nenhum colaborador para os filtros selecionados.");
		    $('#totalizador').html("Mostrando 0 de 0 registros");
            TOTALIZADOR = 0;
            return;
		}
	    $.each( dados['rows'], function(ind, value){
			var registro = value;
	        $('#grid-table tbody').append(
                '<tr id="'+registro['id']+'" class="ui-widget-content jqgrow ui-row-ltr" >'+
                    '<td class="center"> <label class="position-relative"> '+registro['check']+' </td>'+
                    '<td class=""> <label class="position-relative"> '+registro['nome']+' </td>'+
                '</tr>'
	        );
	    });
	    TOTALIZADOR += parseInt(dados['per_page_total']);
		$('#totalizador').html("Mostrando "+TOTALIZADOR+" de "+dados['total']+" registros");
		if(dados['has_more_pages']=='1'){
			HAB_MORE_PAGES = true;
		}else{
			HAB_MORE_PAGES = false;
		}
   }
};    

var realizar_pesquisa = function(novo, tudo){
   mostrarCarregando("Carregando ... ");
   $.ajax({
      url      : URL_FILTRAR_COLABSJSON,
      type     : 'GET',
      dataType : 'json', 
      data     : { 
		'participa_aval_filtro': $("#id_participa_aval_filtro").val(),
		'inativos'             : $("#id_inativos").val(),
		'page'                 : NUM_PAGINA,
		'tudo'                 : tudo==true ? 'all' : 'not'
      },
      success  : function(dados) { popular_colabs(dados, novo, tudo); },
      complete : function() {  
        esconderCarregando();
      },
   });
};

var realizar_ver_mais = function(tudo){
    NUM_PAGINA=NUM_PAGINA+1; 
    if(!HAB_MORE_PAGES){
        $.dialogs.warning("Não existem mais registros a serem carregados");
        return;
    }
	realizar_pesquisa(novo=false, tudo=tudo);
};

var campos = [];

var remover_tudo = function() {
	$("#campos_para_add .form-group").hide();
	$("#campos_para_add .form-group").parent().hide();
	$("#campos_para_add .form-group input").attr("name", '');
	$("#campos_para_add .form-group select").attr("name", '');
    campos = [];
};

var esconder_campo = function(){
	var campo = $(this).attr("id").replace("bt_hide_", '');
	//$.dialogs.confirm("Remover Campo", "Deseja remover esse campo selecionado da tela?", function(){
	    $('#campos_para_add #div_id_' + campo).parent().hide();
	    $('#id_' + campo).attr("name", '');
	    $('#bt_hide_' + campo).remove();

        var index = campos.indexOf(campo);
        campos.splice(index, 1); 

    //});
};

var no_repeat_campo = function(classe, id_campo, valor, msg) {
	if (valor) {
		if ($('.'+classe+'[id!="' + id_campo + '"]').length != 0) {
			var outros_selects_funcao = $('.'+classe+'[id!="' + id_campo + '"]');
			$.each(outros_selects_funcao, function(idx, slct) {
				if ($(slct).val() == valor) {
					$('#' + id_campo).find('option:first').attr('selected', 'selected');
					$.dialogs.error(msg);
					return;
				}
			});
		}
	}
};

var no_repeat_superior = function() {
	no_repeat_campo('select_superior', $(this).attr('id') , $(this).val(), 'Superior já escolhido: Esse superior já foi selecionado anteriormente.');
};


var adicionar_campos = function(){
    var campo = $("#id_campos_add").val();
    
    if (campo=='superiores'){
        adicionar_campo_superiores();	
	    campos.push(campo);
    } else {
	    // Aparece o campo
		$('#campos_para_add #div_id_' + campo).show();
		$('#campos_para_add #div_id_' + campo).parent().show();
		$('#campos_para_add #div_id_' + campo).attr("class", "col-md-8");
		$('#id_' + campo).attr("name", campo);
		$('#id_' + campo).attr("class", "col-md-8");
	    $('#div_id_' + campo+ ' .radio input').attr("name", campo);
		$('#div_id_' + campo).parentsUntil("fieldset").parent().show();
		// Adiciona botão
		$('#bt_hide_' + campo).remove();
		$("#div_id_" + campo).before('<div id="bt_hide_' + campo + '" class="linha_campo bt_hide row col-xs-1 col-md-1"><a>Remover Ação</a></div>');
		$('#bt_hide_' + campo).click(esconder_campo);
		// Movimenta exclusão
		$("#div_id_"+campo+"_excluir").attr('style', 'float: right!important;  margin-left: 15px;').attr("class", "form-inline");
	    $("#id_"+campo+"_excluir").attr("name", campo+"_excluir");
	    $("#div_id_"+campo+" label").after($("#div_id_"+campo+"_excluir"));
	    campos.push(campo);
    }
};

var INDEX_FORM_SUPERIOR = 0;
var adicionar_campo_superiores = function() {
	$.ajax({
		url      : URL_GET_FORM_SUPERIOR,
		type     : 'get',
		dataType : 'json',
		async    : false,
		data     : { 'index' : INDEX_FORM_SUPERIOR },
		success : function(dados) {
			$("#superiores_div").append(dados);
			$("#fieldset_superiores_group").show();
			INDEX_FORM_SUPERIOR += 1;
            init_superior();
		}
	});
};

		
var submit_bnt = function(){
    if( $("#div_id_nt_superior").is(":visible") ){
	    if ( $("[name='nt_superior']:checked").val()=='1' ){
		    $.dialogs.confirm("Atenção", 
		        "Deseja realmente realizar a ação de 'Não possui Superior' para os colaboradores selecionados?<br/>"+
		        "Caso os colaboradores tenham superiores cadastrados, esses serão excluidos. Essa ação não poderá ser desfeita.", 
		        function(){
		            salvar_form_massa();
		        },
		        function(){
		            
		        }
		    );
		} else { 	
		    salvar_form_massa();
		}
	} else{ 	
	    salvar_form_massa();
	}
};

var salvar_form_massa = function(){
	if ($('.colab_check:checked').length <= 0) {
	    $.dialogs.error('Escolha ao menos um colaborador');
		return false;
	} else {
		
		var colabs_ids = '';
		$.each( $('.colab_check:checked') , function(idx, value){
		  colabs_ids += $(value).attr("id").replace("colab_check_","") +  "|";
		});
		$("#colabs_ids").val(colabs_ids);
		
		
		var selected_fields = campos.join('|');
		if (selected_fields == '') {
			$.dialogs.error('Escolha ao menos um campo para alteração.');
			return false;
		}
		$("#selected_fields").val(selected_fields);
		
		// Validação de superior
		var retorno = true;
		var superiores = [];
		$.each( $("select.select_superior") , function(idx, value){
		    if ( $(this).val()=='' ) { 
		      retorno = false; 
		    } else {
		      valor = $(this).val();
		      id_sup = $(this).attr("id").replace("-superior","").replace("id_superior_","");
		      excluir = $("#id_superior_"+id_sup+"-superior_excluir").is(":checked") ? "1" : "0";
		      superiores.push( valor+":"+excluir );
		    }
		});
		superiores = superiores.join("|");
		if (!retorno){
		    $.dialogs.error('O campo Superior é obrigatório.');
		    return false;
		}
		$("#id_superiores").val(superiores);

		if ( ! $("#id_data_demissao_excluir").is(":checked") ){
		  if ( $("#id_data_demissao").val()=='' && $("#id_data_demissao").attr("name")!='') {
			  $.dialogs.error('Entre com a data de demissão.');
		      return false;
		  }
		}
		
		var lista  = [ 'id_setor', 'id_funcao', 'id_filial' ];
		var labels = [ 'Setor',    'Função',    'Filial', ];
				  
		for( i=0 ; i<lista.length ; i++){
			var campo = lista[i];
			if ( $("#"+campo).val()=='' && $("#"+campo).attr("name")!='' ) {
			    $.dialogs.error('Campo '+ labels[i]+' é obrigatório.');
				return false;
		    }
		}
		
		$("#form_colaborador_em_massa").submit();
		
	}
};


