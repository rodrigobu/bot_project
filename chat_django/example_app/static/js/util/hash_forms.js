// Obtém um hash com os valores dos elementos de um form. As chaves dos elementos do hash são os names dos elementos do form.
// Se os campos tivererm um prefixo no name que deve ser retirado, passar esse prefixo para o parâmetro 'retirar_prefixo'
var get_hash_from_form = function(form, retirar_prefixo) {
	var hash   = {};
	var campos = $(form).find('input[type!=button][type!=submit],textarea,select').filter('[name]:not(:disabled)');
	$.each(campos, function(indice, campo) {
		if ($(campo).is('input[type=file]')) {
			return 1;
		}
		// Um 'continue' para a função $.each(), para não enviar campos de arquivo
		var name = $(campo).attr('name');
		var valor = '';
		if ($(campo).is('select[multiple]'))
			$.each($(campo).find('option:selected'), function(indice, opt) {
				if (valor == '')
					valor = $(opt).val();
				else
					valor += ',' + $(opt).val();
			});
		else if ($(campo).is('input[type=checkbox]'))
			if ($(campo).is(':checked'))
				if (!( name in hash))
					if ($(campo).val())
						valor = $(campo).val();
					else
						valor = "on";
				else
					valor = hash[name] + ',' + $(campo).val();
			else
				return 1;
		// Um 'continue' para não enviar checkboxes desmarcados
		else if ($(campo).is('input[type=radio]'))
			if ($(campo).is(':checked'))
				valor = $(campo).val();
			else
				return 1;
		// Um 'continue' para não enviar radiobuttons desmarcados
		else if (($(campo).parent().is('.vHora') || $(campo).is('.vHora') ) || ($(campo).parent().is('.vMes') || $(campo).is('.vMes') ) || ($(campo).parent().is('.vPorcentagem') || $(campo).is('.vPorcentagem') ))
			valor = $(campo)[0].value;
		else
			valor = $(campo).val();
		if (retirar_prefixo) {
			regex = RegExp('^' + retirar_prefixo);
			if (regex.test(name))
				name = name.split(retirar_prefixo)[1];
		}
		hash[name] = valor == null ? '' : valor;
	});
	return hash;
};
limpar_campo = function() {
	$("#formulario input:not(:hidden, :button, :radio)").val('');
	$('select').val("");
	$('textarea').html("").val("");
	if (typeof CKEDITOR != 'undefined'){
	    CKEDITOR.instances.id_documento.setData('');	
	}
};
