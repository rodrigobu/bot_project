
/* Não deixa selecionar no segundo select uma opção que vem
 antes da opção selecionada do primeiro. Também não deixa
 selecionar no primeiro uma opção que vem depois da opção
 selecionada no segundo.
 */
var combinacao_valida_selects = function(select1, select2) {
	if ($(select1).val() && $(select2).val()) {
		var indice1 = $(select1).find('option').index($(select1).find('option:selected'));
		var indice2 = $(select2).find('option').index($(select2).find('option:selected'));
		var valido = indice1 <= indice2;
		return valido;
	}
	return true;
};

var configurar_selects_inicio_fim = function(select1, select2, error_msg_inicial, error_msg_final) {
  if(!error_msg_inicial){
    error_msg_inicial = "A opção inicial não deve ficar depois da opção final.";
  }
  if(!error_msg_final){
    error_msg_final = "A opção inicial não deve ficar depois da opção final.";
  }
	$(select1).change(function() {
		if (!combinacao_valida_selects(select1, select2)) {
      $.dialogs.error(error_msg_inicial);
			$(select1).find('option:first').attr('selected', 'selected');
		}
	});
	$(select2).change(function() {
		if (!combinacao_valida_selects(select1, select2)) {
      $.dialogs.error(error_msg_final);
			$(select2).find('option:first').attr('selected', 'selected');
		}
	});
};

// Transferida de forms.js para cá devida a organização
var set_protect_only_number = function(fields) {
  //$(fields).attr('onKeyUp', "$(this).val($(this).val().replace(/\D/ig, ''))");
  $(fields).live('keyup', function(){
    $(this).val($(this).val().replace(/\D/ig, ''));
  });
};

var init_masks_numeros = function(){
	    $('.vCEP').mask('00000-000');
	    $('.money2').mask("000000,00", {reverse: true});
	    $('.float-field').mask('00000000,00', {reverse: true});
	    $('.float-field-4').mask('00,00', {reverse: true});
	    $('.float-field-5').mask('000,00', {reverse: true});
	    $('.float-field-6').mask('0000,00', {reverse: true});
	    $('.float-field-8').mask('000000,00', {reverse: true});
	    $('.float-field-8-4').mask('0000,0000', {reverse: true});
	    $('.float-field-10').mask('00000000,00', {reverse: true});
	    $('.float-field-12').mask('0000000000,00', {reverse: true});
	    set_protect_only_number('.only-number');
}

$(document).ready(function () {
    init_masks_numeros();

});
