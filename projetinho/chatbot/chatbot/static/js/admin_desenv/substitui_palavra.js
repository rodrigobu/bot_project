$(function() {
	
	$('#remove_termo').hide();
	$('.errorlist').hide();
	$('#mostra_adiciona_termo').hide();
	
	
	$('#id_TIPO_ADICIONAR_0').click(function() {
		$('#remove_termo').hide();
		$('#mostra_adiciona_termo').toggle();
		$("#botao_finalizar").click(function(){
			var validar = validarForm('.vForm');
	
			if(validar==undefined){
				alert('Os termos foram inserídos com sucesso!');
			}
	
		});
	});

	$('#sheepItForm').sheepIt({
		separator : '<div style="width:100%; border-top:1px solid #329BBA; margin: 10px 0px;"></div>',
		allowRemoveLast : true,
		allowAdd : true,
		minFormsCount : 1,
		iniFormsCount : 1,
		removeLastConfirmation : true,
		removeLastConfirmationMsg : 'Você tem que certeza que deseja remover o último termo adicionado?',
		afterClone : 
		//Cada clonagem que fizer irá adicionar 1 no name
		function afterClone_plugin (source, clone) {
			function troca_atributos(obj, contador) {
				var name = obj.attr('name'), novo_name = name + '_' + contador;
				obj.attr('name', novo_name);
			};
			var contador = $(window).data('_countform');
			if (contador == undefined) {
				$(window).data('_countform', 0);
				contador = $(window).data('_countform');
			} else if ($.isNumeric(contador)) {
				$(window).data('_countform', contador + 1);
				contador = $(window).data('_countform');
			}
			
			var palavra_antiga = clone.find('#id_palavra_antiga'), 
			palavra_antiga_plural = clone.find('#id_palavra_antiga_plural'), 
			palavra_nova = clone.find('#id_palavra_nova'),
			palavra_nova_plural = clone.find('#id_palavra_nova_plural');
			troca_atributos(palavra_antiga, contador);
			troca_atributos(palavra_antiga_plural, contador);
			troca_atributos(palavra_nova, contador);
			troca_atributos(palavra_nova_plural, contador);
			init_validacao(clone);
		}
	});
	
	$('#id_TIPO_ADICIONAR_1').click(function(){
		$('#mostra_adiciona_termo').hide();
		$('[name^="palavra_"]').removeClass('vObrigatorio');
		$("#remove_termo").toggle();
		$("#botao_finaliza_exclusao").click(function(){
			$.ajax({
				type: "post",
      			url: "/admin-desenv/exclui_termo_ajax/",
      			dataType: "json",
      			data: {exclui_termo: $('#id_exclui_termo').val()},    
      			success: function(retorno){
					if (retorno){
						exibirSucesso('Excluído','O termo foi excluído com sucesso!');
					}else{
						exibirErro('Erro','Não existe esse termo cadastrado!');
					}
				}	
				
			});
		});		
	});
});