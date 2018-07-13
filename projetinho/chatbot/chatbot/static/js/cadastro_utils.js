var MSG_EXCLUSAO = 'Item excluído com sucesso.';

var monta_hash_aba = function(abas){
  $('.tab-pane.active').removeClass('active').addClass('fade');
  $(location.hash).addClass('active').removeClass('fade');
  try{
    acoes = abas[location.hash];
    $(acoes[0]).trigger('click');
    acoes[1]();
  }catch(err){};
};


var abre_aba = function() {
    var conteudo = $(this).attr('ref-content');
    $('.tab-pane.active').removeClass('active').addClass('fade');
    $('#' + conteudo).addClass('active').removeClass('fade');
    location.hash = '#' + conteudo;
};


function serializaForm(form_id) {
    var data = $(form_id).serializeArray();
    var dict = {};
    $.map(data, function(n, i) {
        dict[n['name']] = n['value'];
    });
    return dict;
}

var ajustar_paginacao = function(id_listagem){
	    $('.ajax_list_page').click(function (event) {
				 var page = $(this).data('page-number');
				 reload_djflexgrid($('#'+id_listagem), parseInt(page));
		});
}

var completeLoad_listas = function(do_after, id_lista) {
    if(id_lista!=undefined){
       $('#'+id_lista+' [title]').tooltip();
   } else{
       $('[title]:not(.multiselect)').tooltip();
    }

    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        $("#div_id_per_page label").css({
            "vertical-align": "super"
        });
        $(".current_records_display").css({
            "vertical-align": "sub"
        });
    }
    try {
        do_after();
    } catch (err) {}
};

var listagem_Geral = function(id_listagem, URL, filter_form, completeLoad_do){

    if(completeLoad_do!=undefined){
       funcao = completeLoad_do
    } else {
       funcao = completeLoad_listas
    }

    var opcoes = {
        url : URL,
        completeLoad: function(){
          ajustar_paginacao(id_listagem);
          completeLoad_listas(funcao, id_listagem);
        }
    }

    if(filter_form!=undefined && filter_form!=null && filter_form!=""){
      opcoes['filter_form'] = filter_form;
    }
    $("#"+id_listagem).djflexgrid(opcoes);
};


var excluir_Geral = function(id, URL, do_after_success, msg_exc, msg){
    if (msg==undefined){
        var msg = 'Deseja realmente excluir?';
    }
    $.dialogs.confirm('Confirmação', msg, function(r) {
        if (r) {
            mostrarCarregando();
            $.post(URL, { 'id': id  })
            .done(function(retorno) {
                if(msg_exc==undefined || msg_exc==""){
                    $.dialogs.success(MSG_EXCLUSAO);
                } else {
                    $.dialogs.success(msg_exc);
                }
                do_after_success(retorno);
            }).complete(function(data) {
                esconderCarregando();
            });
        }
    });
};


var disable_btn_id = function(btn_id){
    $("#"+btn_id).attr('disabled', true);
};


var enable_btn_id = function(btn_id){
    $("#"+btn_id).removeAttr('disabled');
};


var disable_btn = function(form_id){
    $("#"+form_id+" [name='bt_salvar']").attr('disabled', true);
};


var enable_btn = function(form_id){
    $("#"+form_id+" [name='bt_salvar']").removeAttr('disabled');
};
