// Limpas erros de validação
var clean_errors = function() {
	$(".errorlist").remove();
};

var clean_errors_field = function(id_field) {
	$(id_field).parent().find(".errorlist").remove();
};

var gerate_perm_warnnings = function(mensagem_para){
	$(".errorlist_img, .errorlist, .jError").remove();
	jWarning("Você não tem permissão para "+mensagem_para, config_jnotify);
};

// Gera mensagens de erros - Para cadastros Ajax.
var gerate_errors = function(errors, prefix, sem_prefix) {
	$(".errorlist_img, .errorlist, .jError").remove();
	// Apaga todas as mensagens de erro

	if (prefix == undefined || prefix == "") {
		prefix = "id_";
		// Ajusta prefixo de formulário
	}

	var all = "";
	$.each(errors, function(index, value) {
		console.log(index);
		console.log(value);
		value = value.replace('<ul class="errorlist"><li>','').replace('</li></ul>','');
		gerate_error(prefix + index, value);
		return;
		/*if (index == 'erro') {
			all += value + '<br>';
		} else {
			if ( !(value == 'Este campo é obrigatório.')){
				console.log("#" + prefix + index);
				$("#" + prefix + index).parent().find(".errorlist").remove();
				$("#" + prefix + index).parent()
				.append(' <em for="id_'+index+'" class="error red errorlist">'+'<i class="fa fa-exclamation-triangle red error"> </i> '+value+'</em>');
					//'<ul class="errorlist"><li>' + '<span><img class="errorlist" title="' + value + '" alt="' + value + '"' + value + '</span></li></ul>');
			}
		}*/
	});

	if (all != "") {
		$.dialogs.error("Erros: " + all);
	};

	if ($(".errorlist").length) {
		$.dialogs.error("Existem erros no preenchimento do formulário.");
	};
};


// Gera mensagem de erros - Para um único campo.
var gerate_error = function(field_id, error_msg) {
    $("#" + field_id).parent().find(".errorlist").remove();
  	$("#" + field_id).parent().append('<ul class="errorlist"><li>' +
		'<span><img class="errorlist" title="' + error_msg + '" alt="' + error_msg +
		 '" src="/static/images/exclamation.gif" align="top">' + error_msg + '</span></li></ul>');
};

// Gera mensagem de erros - Para um único campo. - Padrão novo - mesmo do parsley

var gerate_error_novo = function(field_id, error_msg, com_img) {
	var objeto = undefined;
	if($("#" + field_id).parent().hasClass("date")){
		objeto = $("#" + field_id).parent().parent();
	} else {
		objeto = $("#" + field_id).parent();
	}
  objeto.find(".parsley-errors-list").remove();
	if (com_img){
		objeto.append('<ul class="parsley-errors-list filled errorlist">\
		    <li><span><img class="errorlist" title="' + error_msg + '" alt="' + error_msg +
				 '" src="/static/images/exclamation.gif" align="top">' +error_msg+'</span></li>\
				</ul>');
	} else {
		objeto.append('<ul class="parsley-errors-list filled"><li class="parsley-required">'+error_msg+'</li></ul>');
	}
};

var clean_errors_novo = function() {
	$(".parsley-errors-list").remove();
};

var clean_errors_field_novo = function(id_field) {
	$(id_field).parent().find(".parsley-errors-list").remove();
};
