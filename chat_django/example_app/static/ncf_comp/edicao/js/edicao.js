$(function(){

    $('.form-filtro').find("#id_term").blur(function(){   
    	if ($('.form-filtro').find("#id_term").val().length == 0 ) {
    	    reload_djflexgrid('#listagem');
        };
    });

   function config_flexgrid(){
       $('.check-uncheck').on('click', function(){
           $(this).checkUncheckAll('#listagem tbody input');
       });
       $('[title]').tooltip();
   };
   $('#listagem').djflexgrid({
       url          : CONF.url_listagem,
       filter_form  : '.form-filtro',
       successLoad  : function() { 
       	   config_flexgrid(); 
       },
       completeLoad : function(){
           $('#listagem').show('fade');
       }
   });

    $('form.form-editar-map').on('submit', function(){
      mostrarCarregando();
        var checkeds = [];
        var cache    = $('#listagem').data('djflexgrid').methods._create_cache();
        $.each(cache, function(key, obj){
            if ($(obj[0]).find('[type=checkbox]').is(':checked')){
                checkeds.push(key);
            };
        });
        if (checkeds.length < 1) {
          esconderCarregando();
          $.dialogs.error('Selecione ao menos um Indicador');
          return false;
        }

        var data = 'funcao=' + _funcao_id,
            forte = _.filter(
                $(_.keys(cache)), function(item, index){
                    return ($.inArray(item, checkeds) == -1);
                }
            ),
            mt_forte = checkeds;

        if (forte.length > 0){
            data += '&forte=' + forte.join('&forte=') + '&';
        };
        if (mt_forte.length > 0){
            data += '&mt_forte=' + mt_forte.join('&mt_forte=');
        };

        $.post(
          URL_NCF_ATUALIZAR.replace('/0/', '/' + _funcao_id + '/'), 
          data, function(response){
            if (response.status == 'success'){
              esconderCarregando();
                $.dialogs.success(
                   'Concluído',
                   'O Mapeamento da função "'+CONF.funcao+'" foi editado com sucesso.', function(){
                   window.location.href = URL_NCF_GERENCIAR;
                });
            }else{
                var errors = new Array;
                $.each(response.errors, function(k, v){
                    $.each(v, function(){
                        errors.push('' + this);
                    });
                });
                esconderCarregando();
                $.dialogs.error('Erro ao editar o NCF', errors.join('<br/>'));
            };
        });
       return false;
   });
});