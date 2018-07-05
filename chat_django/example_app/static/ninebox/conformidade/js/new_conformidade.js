var colabs;
var pathname = window.location.pathname;
var path = pathname.split('/');
var id = path[path.length-2];

// Add itens to colab select

var popula_select = function(){
	var html = "<option value='' disabled selected hidden>---</option>";
	var colab_id = $('#colab_id').val();
	$('#colaborador option')
		.filter(function(i, e) { return $(e).val() == colab_id }).prop('selected', true);
	var previusColab = '';
	var tempColabs = [];
	for(var item in colabs){
		var duplicate = false;
		for(var index in tempColabs)
			if(colabs[item].nome == tempColabs[index].nome)
				duplicate = true;
		if(!duplicate)
			tempColabs.push(colabs[item])
	}
	for (var item in tempColabs){
		if(tempColabs[item].colab_id == colab_id){
			html += "<option selected   value="+ tempColabs[item].colab_id +">"+ tempColabs[item].nome +"</option>"
		}else{
			html += "<option   value="+ tempColabs[item].colab_id +">"+ tempColabs[item].nome +"</option>"
		}
	}
	$("#colaborador").empty().append(html);
};

// serialize itens from form

var serializaForm = function serializaForm(form_id) {
	var data = $(form_id).serializeArray();
	var dict = {};
	$.map(data, function(n, i){
		dict[n['name']] = n['value'];
	});
	dict['funcao'] = $("#funcao").val();
	dict['registrado'] = $("#registrado").val();
	return dict;
}

// Tipo de lançamento

var tipo_lancamento = function(){
	$('#formulario_conformidade input').change(function(e) {
			e.preventDefault();
			var label_checked = $('input[name=opt_conformidade]:checked', '#formulario_conformidade').val();
			if( label_checked == '1'){
				$('#selecionar_filtro').show();
				$('#valor_cdc').attr('atribute', 'merito');
				$('#valor_cdc').attr('data-max', 'p');
				$('#valor_max').addClass('hidden');
				$('#ajuste_coeficiente').removeClass('hidden');
			}else{
				$('#selecionar_filtro').show();
				$('#valor_cdc').attr('atribute', 'demerito');
				$('#valor_max').removeClass('hidden');
				$('#valor_cdc').attr('data-max', max_value);
				$('#aplicar_valor_deme').removeClass('hidden');
				$('#ajuste_coeficiente').addClass('hidden');
			};
	});
};

// Gestor Filtro

var _gestor = function(){
	$('#gestor_filtro').change(function(){

		var url_get_colab =  URL_GET_COLAB;
		var gestor = $('#gestor_filtro').val();
		var setor = $('#setor').val();
		$('#funcao').val('');
		if(gestor != ''){
			if(setor > 0){
				$('#form_cadastro_coeficiente').show();
				$('#envia_form').show();
				url_get_colab += "?gestor=" + gestor + "&setor=" + setor;
				$.get(url_get_colab)
				.done(function(data){
					colabs = data;
					popula_select();

				});
			}else{
				$('#form_cadastro_coeficiente').show();
				$('#envia_form').show();
				url_get_colab += "?gestor=" + gestor;
				$.get(url_get_colab)
				.done(function(data){
					colabs = data;
					popula_select();

				});
			}
		}else {
			var setor = $('#setor').val();
			if(setor > 0){
				url_get_colab += "?setor=" + setor;
				$.get(url_get_colab)
				.done(function(data){
					colabs = data;
					popula_select();
				});
			}else{
			 $('#colaborador').empty().append('<option value="">---</option>');
		 }
		}
	});
};

// Setor Filtro
var _setor = function(){
	$('#setor').change(function(){
		var url_get_colab =  URL_GET_COLAB;
		var gestor = $('#gestor_filtro').val();
		var setor = $('#setor').val();
		if(setor != ''){
			if(gestor > 0){
				$('#form_cadastro_coeficiente').show();
				$('#envia_form').show();
				url_get_colab += "?gestor=" + gestor + "&setor=" + setor;
				$.get(url_get_colab)
				.done(function(data){
					colabs = data;
					popula_select();
				});
			}else{
				$('#form_cadastro_coeficiente').show();
				$('#envia_form').show();
				url_get_colab += "?setor=" + setor;
				$.get(url_get_colab)
				.done(function(data){
					colabs = data;
					popula_select();
				});
			}
	 }else {
		 var gestor = $('#gestor_filtro').val();
		 if(gestor > 0){
			 url_get_colab += "?gestor=" + gestor;
			 $.get(url_get_colab)
			 .done(function(data){
				 colabs = data;
				 popula_select();

			 });
		 }else{
		 	$('#colaborador').empty().append('<option value="">---</option>');
		}
	 }
	});
};

// Carrega colab select

var carrega_colab = function(){
	$('#colaborador').change(function(){
		var html = "<option value='' disabled selected hidden>---</option>";
		var colab = $('#colaborador').val();
		var gestores = $.grep(colabs, function(item) {
    	return item.colab_id == colab;
		});
		for (var item in gestores){
			if(gestores[item].gestor_id == $('#gestor_hidden_id').val()){
				html += "<option selected   value="+ gestores[item].gestor_id +">"+ gestores[item].gestor +"</option>"
			}else{
				html += "<option   value="+ gestores[item].gestor_id  +">"+ gestores[item].gestor +"</option>"
			}
		}
		$("#gestor_select").empty().append(html);

		for (var item in colabs){
			if(colabs[item].colab_id == colab){
				$("#funcao").val(colabs[item].funcao);
				$("#funcao_id").val(colabs[item].funcao_id);
				break;
			}
		}
	});
};

// Tratamento para o input de valor

var valor_coeficiente = function(){
	$('#valor_cdc').change(function(){
		var valor_cdc = $('#valor_cdc').attr('data-max');
		var valor_input = $('#valor_cdc').val();
		valor_input = valor_input.replace(',', '.');


		if($.isNumeric(valor_input)){
			var max = parseInt(valor_cdc);
			if(valor_input > max){
				$('#grau_valor_max').addClass('has-error');
				$('#valor_cdc').val('');
				$('.help-block').removeClass('hidden');
			}else{
				valor_input < max;
				$('#grau_valor_max').removeClass('has-error');
			};
		}else{
			$.dialogs.error('Existem erros de preenchimento na conformidade.');
		};

	});
};

var submit_conformidade = function(){
	$('#formulario_conformidade').submit(function (event){
		event.preventDefault();
		var form = serializaForm('#formulario_conformidade');
		form.valor_cdc = form.valor_cdc.replace(',', '.');

		if($.isNumeric(id)){
			$.post('/conformidade/cadastro/'+ id +'/', form)
			.done(function(event, data){
				$.dialogs.success('Conformidade salva com sucesso.', function(){
					window.location.href = '/conformidade/?t=confcdc';
				});
			})
			.error(function (data) {
								$.dialogs.error('Existem erros de preenchimento na conformidade.');
						});
		}
		else{
			var titulo   = 'Salvar conformidade';
			var mensagem = 'Após salvar a conformidade não será mais possível alterar o colaborador. Confirma o cadastro da conformidade?';
			$.dialogs.confirm(titulo, mensagem, function(){
				$.post('/conformidade/cadastro/', form).done(function(data){
							window.location.href = '/conformidade/?t=confcdc';
				})
				.error(function (data) {
									$.dialogs.error('Existem erros de preenchimento na conformidade.');

							});

			});
		}
	});
};

$( document ).ready(function() {

	$('#valor_cdc').mask('000000,00', {'reverse': true});
  $('#formulario_conformidade').parsley();


	tipo_lancamento();

	_gestor();

	_setor();

	carrega_colab();

	valor_coeficiente();

	submit_conformidade();

	$('#formulario_conformidade input').change(function(e) {

		var label_checked = $('input[name=opt_conformidade]:checked', '#formulario_conformidade').val();
		if( label_checked == '0'){
			var valor_cdc = $('#valor_cdc').attr('data-max');
			var max = parseInt(valor_cdc);
			var valor_input = $('#valor_cdc').val();
			valor_input = valor_input.replace(',', '.');
			if(valor_input > max){
				$('#grau_valor_max').addClass('has-error');
				$('#valor_cdc').val('');
				$('.help-block').removeClass('hidden');
			}else{
				valor_input < max;
				$('#grau_valor_max').removeClass('has-error');
			};
		}
	});

	if($.isNumeric(id)){
		var label_checked = $('input[name=opt_conformidade]:checked', '#formulario_conformidade').val();
		$('#selecionar_filtro').addClass('hidden');
		if( label_checked == '1'){
			$('#valor_max').addClass('hidden');
			$('#ajuste_coeficiente').removeClass('hidden');
		}else{
			$('#valor_max').removeClass('hidden');
			$('#ajuste_coeficiente').addClass('hidden');
		};
		$('#selecionar_filtro').hide();
		$('#aplicar_valor_deme').removeClass('hidden');
		$('#form_cadastro_coeficiente').show();
		$('#envia_form').show();

			$('#formulario_conformidade input').change(function(e) {

				var label_checked = $('input[name=opt_conformidade]:checked', '#formulario_conformidade').val();
				if( label_checked == '0'){
					var valor_cdc = $('#valor_cdc').attr('data-max');
					var max = parseInt(valor_cdc);
					var valor_input = $('#valor_cdc').val();
					valor_input = valor_input.replace(',', '.');
					if(valor_input > max){
						$('#grau_valor_max').addClass('has-error');
						$('#valor_cdc').val('');
						$('.help-block').removeClass('hidden');
					}else{
						valor_input < max;
						$('#grau_valor_max').removeClass('has-error');
					};
				}
			});

	}

});
