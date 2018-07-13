/**
 *  Pacote de Utilidades para formulários em JavaScript
 * */

var MASCARAS = {
    'vPIS'            : { 'mask': '9.999.999.999-9',    'placeholder': ' ' },
    'vCPF'            : { 'mask': '999.999.999-99',     'placeholder': ' ' },
    'vCNPJ'           : { 'mask': '99.999.999/9999-99', 'placeholder': ' ' },
    'vTel'            : { 'mask': '9999-9999',          'placeholder': ' ' },
    'vData'           : { 'mask': 'd/m/y',              'placeholder': ' ' },
    //'vDDD'            : { 'mask': '9',                  'placeholder': ' ', 'repeat': 3, 'greedy': false },
    //'vCel'            : { 'mask': '9',                  'placeholder': ' ', 'repeat': 9},
    'vHora'           : { 'mask': '99:99',              'placeholder': ' ' },
    'vNumero'         : { 'mask': '9',                  'placeholder': ' ', 'repeat': 1000, 'greedy': false },
    'vNumero2Digitos' : { 'mask': '9',                  'placeholder': ' ', 'repeat': 2,    'greedy': false },
    'vNumero3Digitos' : { 'mask': '9',                  'placeholder': ' ', 'repeat': 3,    'greedy': false },
    'vNumero4Digitos' : { 'mask': '9',                  'placeholder': ' ', 'repeat': 4,    'greedy': false },
    'vNumero5Digitos' : { 'mask': '9',                  'placeholder': ' ', 'repeat': 5,    'greedy': false },
    'vNumero8Digitos' : { 'mask': '9',                  'placeholder': ' ', 'repeat': 8,    'greedy': false },
    'vNumero10Digitos': { 'mask': '9',                  'placeholder': ' ', 'repeat': 10,   'greedy': false },
    'vDDMM'           : { 'mask': 'd/m',                'placeholder': ' ' },
    'vTempoMMSS'      : { 'mask': '99:99',              'placeholder': ' ' },
    'vPorcentagem'    : { 'mask': '99,99 %',            'placeholder': '0' },
    'vDecimalNota'    : { 'mask': '99,99',              'placeholder': '0' },
    'vAltura'         : { 'mask': '9,99',               'placeholder': ' ' },
    'vDataTime'       : { 'mask': 'd/m/y 99:99',         'placeholder': ' ' }
};


var aplicar_mascaras = function(){
	$.extend($.inputmask.defaults, {
        'autounmask': true
    });
    for (classe in MASCARAS)
        $('form.form :input.' + classe).inputmask(MASCARAS[classe]);
};

var validar_campos_obrigatorios = function() {
	// CHECAR CAMPOS OBRIGATÓRIOS DOS RELATÒRIOS
	var to_return = true;
	$.each($(".form")
	       .find('.vObrigatorio input, .vObrigatorio select, .vObrigatorio textarea, input.vObrigatorio , select.vObrigatorio , textarea.vObrigatorio')
	       .filter(":visible"), function(idx, wrapper) {
		try{
			if ($(this).val().replace(/ /g, '')=='') {
				var name = $(this).attr("id");
				gerate_error($(this).attr("id"), "Este campo é obrigatório");
				to_return = false;
		    }
		}catch(err){
			if ($(this).val()==null) {
				var name = $(this).attr("id");
				gerate_error($(this).attr("id"), "Este campo é obrigatório");
				to_return = false;
		    }
		}
	});
	if (!to_return)
		$.dialogs.error("Existem erros no preenchimento do formulário.");
	return to_return;
};

var validar_campos_obrigatorios_em_abas = function(aba_id) {
	// CHECAR CAMPOS OBRIGATÓRIOS
	var to_return = true;
	$.each($("#"+aba_id+" .form").find('.vObrigatorio input, .vObrigatorio select, .vObrigatorio textarea, input.vObrigatorio , select.vObrigatorio , textarea.vObrigatorio'), function(idx, wrapper) {
		//var $_campo = $(wrapper).find('input, select, textarea');
		try{
			if ($(this).val().replace(/ /g, '')=='') {
				var name = $(this).attr("id");
				gerate_error($(this).attr("id"), "Este campo é obrigatório");
				to_return = false;
		    }
		}catch(err){
			if ($(this).val()==null) {
				var name = $(this).attr("id");
				gerate_error($(this).attr("id"), "Este campo é obrigatório");
				to_return = false;
		    }
		}
	});
	
	if (!to_return)
		$.dialogs.error("Existem erros no preenchimento do formulário.", function(e){
			PARA_SALVAR = false;
			$('#'+aba_id.replace("aba_","")).click();
			$('#' + aba_id.replace("aba_","")).tab('show');
		});
	return to_return;
};

var setar_data_picker = function() {
	// - Datas padronizado - com datapicker e mascara
	$.each($('.vData'), function(idx, input) {
		$(this).datepicker({
			showOn          : "button",
			buttonImage     : "/static/img/calendario.png",
			buttonImageOnly : true,
			changeMonth     : true,
			changeYear      : true,
			yearRange       : "1900:2030",
			dateFormat:"dd/mm/yy"
		});//.datepicker("option", "dateFormat", "dd/mm/yy");
	});
};

 // THE SCRIPT THAT CHECKS IF THE KEY PRESSED IS A NUMERIC OR DECIMAL VALUE.
var isNumber = function(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    //console.log(charCode);
    if (charCode==8) return true; //Backspace (deletar)
    if ( charCode!=44 && charCode != 45 && (charCode != 46 || $(this).val().indexOf(',') != -1 || $(this).val().indexOf('.') != -1) && 
                (charCode < 48 || charCode > 57 ))
            return false;

    return true;
};
    
var set_protect_only_number = function(fields) {
	//$(fields).attr('onKeyUp', "$(this).val($(this).val().replace(/\D/ig, ''))");
	$(fields).live('keyup', function(){
		$(this).val($(this).val().replace(/\D/ig, ''));
	});
};

var set_radio_select = function(id_fields){
	$.each(id_fields, function(idx, value){
	    $(value).addClass("radioHor");
	});
};


var valida_email = function(valor){
	if(!validar_campo_formulario(valor,"valida_email")){
	    gerate_error(valor, "E-mail inválido");
		return false;
	}
	return true;
};

var valida_decimal = function(valor){
	if (valor=='') return true;
    var novo_valor = valor.replace('R$', '').replace('.', '').replace(',', '.');
    if (novo_valor != valor)
        valor = novo_valor;
    var x = /^[0-9]*([,|.][0-9]{1,2}|)$/;
    if (!valor.match(x)) return false;
    return true;
};

var valida_decimal_9_99 = function(valor){
	console.log(valor);
	if (valor=='') return true;
    var novo_valor = valor.replace('R$', '').replace('.', '').replace(',', '.');
    if (novo_valor != valor)
        valor = novo_valor;
    var x = /^[0-9]{1,3}([,|.][0-9]{0,2}|)$/;
    if (!valor.match(x)) return false;
};

var valida_em_branco = function(valor){
	console.log("'"+valor+"'");
    valor = valor.replace(/ /g, '');
	if (valor=='') return true; 
	return false;
};

var valida_data = function(valor){
	console.log("'"+valor+"'");
	if (valor=='') return true;
    if ( !/(0[1-9]|[12][0-9]|3[01])[/|-](0[1-9]|1[012])[/|-]\d{4}/.test(valor) )
        return false;    
    valor = valor.replace(/ /g, '').replace(/\//g, '');
    if (valor.length != 8)
        return false;    
};

var validar_moeda = function(campo){
	if( $("#"+campo).val().replace(",","").replace(".","").length>10 ){
		$("#"+campo).val("");
		gerate_error(campo, "Certifique-se de que não tenha <br />  mais de 10 dígitos no total.");
		return false;
	}
	if( $("#"+campo).val().split(",")[0].length>8 ){
		$("#"+campo).val("");
		gerate_error(campo, "Certifique-se de que não tenha mais <br /> de 8 dígitos antes do ponto decimal.");
		return false;
	}
	if ($("#"+campo).val().split(",").length==2){
		if( $("#"+campo).val().split(",")[1].length>2 ){
			$("#"+campo).val("");
			gerate_error(campo, "Certifique-se de que não tenha <br /> mais de 2 casa decimais");
			return false;
		}
	}
	if (!validar_campo_formulario(campo,"valida_moeda")){
		$("#"+campo).val("");
		gerate_error(campo, "Por favor, informe um número <br /> decimal no formato 99999999,99");
		return false;
	}
	clean_errors_field(campo);
	return true;
};

var make_layout_form = function() {
	$('form.form :input.clear').parent().find("br").hide().prepend("<br/>");
	$('form.form :input.vDecimal').keypress(function(event) { return isNumber(event); });
	/*$('form.form :input.vNumero3Digitos').prop("maxlength","3").addClass("vOnlyNumber");
	$('form.form :input.vNumero4Digitos').prop("maxlength","4").addClass("vOnlyNumber");
	$('form.form :input.vNumero8Digitos').prop("maxlength","8").addClass("vOnlyNumber");
	$('form.form :input.vNumero10Digitos').prop("maxlength","10").addClass("vOnlyNumber");
	$('form.form :input.vDecimal').addClass("vOnlyNumber");*/
	
	aplicar_mascaras();
	set_protect_only_number(".vOnlyNumber");
	$(".vOnlyNumber").live('keyup', function(){ 
		$(this).val($(this).val().replace(/\D/ig, ''));
	});
	set_protect_only_number(".vCEP");
	
	/*$('.vDecimal').live('blur', function(){ 
		if($(this).val()=='') return;
		if(!valida_decimal( $(this).val() ) ){
		    jError("Por favor, informe um número decimal no formato 999999,99.");
		    $(this).val("");
		} 
	});*/
	/*$('.vDecimal9_99').live('blur', function(){ 
		if($(this).val()=='') return;
		if(!valida_decimal_9_99( $(this).val() ) ){
		    jError("Por favor, informe um número decimal no formato 9,99.");
		    $(this).val("");
		} 
	});*/
	/*$('.vData').live('blur', function(){
		if($(this).val()=='' || $(this).val()=='  /  /    ') return;
		if(!valida_data( $(this).val() ) ){
		    jError("Por favor, informe uma data válida no formato dd/mm/aaaa.");
		    $(this).val("");
		}  
    });*/
	
	setar_data_picker();
	
	aplicar_all_multiselects();
	
    $("input.qsbox, .no_submit_on_enter").live('keypress', function(e) {
	  	var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) {//Enter keycode
			return false;
		}
	});
	
	$(".jq_ui_button").button();//.css("display","inline");
	
    
};


var form_is_valid = function() {
	// validar decimais
	var to_return = true;
	$.each( $('.vDecimal'), function(idx, value){ 
		if(!valida_decimal( $(value).val() ) ){
		    $(value).val("");
		    to_return = false;
		} 
	});
	if(!to_return){
		jError("Por favor, informe um número decimal no formato 999999,99.");
		return false;
	}
	
	// validar decimais 9.99
	var to_return = true;
	$.each( $('.vDecimal9_99'), function(idx, value){ 
		if(!valida_decimal_9_99( $(value).val() ) ){
		    $(value).val("");
		    to_return = false;
		} 
	});
	if(!to_return){
		jError("Por favor, informe um número decimal no formato 9,99.");
		return false;
	}
	
	// validar datas
	/*var to_return = true;
	$('.vData').live('blur', function(){
		if(!valida_data( $(this).val() ) ){
		    $(this).val("");
		    to_return = false;
		}  
    });*/
	if(!to_return){
		jError("Por favor, informe uma data válida no formato dd/mm/aaaa.");
		return false;
	}
	
	return true;
};

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


function validaPIS(Numero,Digito){
	for (i=0; i<Numero.length; i++){
	  Numero = Numero.replace('.','');
	  Numero = Numero.replace('-','');
	}

	
	var PASEP   = Numero;
	var peso1   = '3298765432';
	var soma1   = 0;
	var digito1 = 0;
	
	
	for (i = 1; i < 10 - Numero.length+1; i++)  {  PASEP = eval("'" + 0 + PASEP + "'") ;}
	
	for (i = 1; i < PASEP.length+1; i++) { soma1 += PASEP.substring(i, i-1) * peso1.substring(i, i-1); } 
	
	
	soma1 %= 11;
	if (soma1  < 2) {  digito1 = 0; }
	else { digito1 = 11 - soma1;  }
	
	if (eval("'" + digito1 +"'") != Digito){
	    return false;
	    alert("false");
	}else {
	    return true;
	    alert("true");
	}
} 

/*
 * Função utilizada para carregar as validações e outros
 */

$(function(){
   // make_layout_form(); // utilizada para carregar as validações quando o documento é carregado.
});
