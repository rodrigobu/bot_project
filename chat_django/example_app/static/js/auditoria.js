'{% load i18n %}';

function OptIndicadores (indicadores) {
    var opt_template = _(
            '<option value>{% trans "Selecione um Indicador" %}</option>' +
            '<% _.each(i, function(desc, id) { %>' +
                '<option value="<%= id %>"><%= desc %></option>' +
            '<% }); %>'
        ),
        obj = opt_template.template({ i: indicadores }),
        obj = $(obj);
    return obj;
};

$(function(){
    $('.tree-folder-header').on('click', function(){
        $(this).next().toggle();
        var add, remove;
        if ($(this).next().is(':visible')){
            add = 'fa-caret-down';
            remove = 'fa-caret-right';
        }else{
            add = 'fa-caret-right';
            remove = 'fa-caret-down';
        };
        $(this).find('i.fa')
            .addClass(add)
            .removeClass(remove);
    });

    // Indicadores com Erro
    $('.error.editar-indicador').on('click', function(){
        var item = $(this),
            field_ind = item.find('.indicador'),
            indicador = field_ind.val(),
            field_compt = item.closest('.tree-folder').find('.competencia'),
            competencia = field_compt.val(),
            field_importancia = item.find('.importancia'),
            importancia = field_importancia.val(),
            _compt_associada = item.find('[name=associar_compt]'),
            _indicador_associado = item.find('[name=associar_indicador]');

        var obj = $('.editar-indicador-form').clone(false);

        // Preenchendo formulário
        obj.find('[name=indicador]').val(indicador).end()
           .find('[name=competencia]').val(competencia).end()
           .find('[name=importancia]').val(importancia).end()

           // Deletando a competência do indicador selecionado
           .find('[name=associar_compt]').children().filter(function(){
                return $(this).text() == competencia;
            }).remove().end().end()

            // Evento para carregar os indicadores da competência associada
           .on('change', function(){
               // Disable
               obj.find('[name=associar_indicador]')
                  .prop('disabled', true).val(null);

               // GET
               if (this.value){
                   obj.find('.fa-spin').show();
                   var url = '{% url "ncf_comp:json-cc-indicadores" 0 %}'.replace('0/', this.value + '/');
                   $.get(url, function(response){
                       obj.find('[name=associar_indicador]')
                          .prop('disabled', false)
                          .html(OptIndicadores(response));
                       if (_indicador_associado.exists()){
                           obj.find('[name=associar_indicador]').val(_indicador_associado.val()).change();
                       };
                   })
                   .always(function(){
                       obj.find('.fa-spin').hide();
                   });
                   $.loading.hide();
               };
           }).end()

           // Modal
           .dialog({
               modal: true,
               hide: 'fade',
               show: 'fade',

               ace_theme: true,
               ace_title_icon_left: 'fa fa-edit',
               buttons: {
                   c: {
                       click: function(){
                           obj.dialog('close');
                       },
                       'class': 'btn btn-xs',
                       text: '{% trans "Cancelar" %}'
                   },
                   e: {
                       click: function(){
                           $.loading.show();
                           var compt_associada = obj.find('[name=associar_compt]'),
                               indicador_associado = obj.find('[name=associar_indicador]');

                           if (compt_associada.val() && indicador_associado.val()){
                               if (_compt_associada.exists()){
                                   _compt_associada.val(compt_associada.val());
                               }else{
                                   item.prepend(
                                       $('<input>', {
                                           type: 'hidden',
                                           name: 'associar_compt',
                                           value: compt_associada.val()
                                       })
                                   );
                               };
                               if (_indicador_associado.exists()){
                                   _indicador_associado.val(indicador_associado.val());
                               }else{
                                   item.prepend(
                                       $('<input>', {
                                           type: 'hidden',
                                           name: 'associar_indicador',
                                           value: indicador_associado.val()
                                       })
                                   );
                               };
                               item.removeClass('tooltip-error').tooltip('destroy')
                                 .prop('data-original-title', '')
                                 .find('small').removeClass('text-danger').addClass('text-success').end()
                                 .find('.icon-error').removeClass('fa-times red').addClass('fa-check green');
                           }else{
                               _compt_associada.remove();
                               _indicador_associado.remove();
                               item.addClass('tooltip-error').tooltip()
                                 .prop('data-original-title', '{% trans "Este indicador já existe para essa competência." %}')
                                 .find('small').removeClass('text-success').addClass('text-danger').end()
                                 .find('.fa-check').removeClass('fa-check green').addClass('fa-times red');
                           };

                           field_importancia.val(obj.find('[name=importancia]').val());
                           obj.dialog('close');
                       },
                       text: '{% trans "Editar" %}',
                       'class': 'btn btn-xs btn-success pull-right'
                   }
               },
               close: function(){
                   $.loading.hide();
                   $(this).dialog('close').dialog('destroy');
               },
               title: '{% trans "Editar Indicador" %}',
               width: '80%'
        }).parent().keyup(function(e) {
            if(e.keyCode == 13) {
                obj.data('uiDialog').options.buttons.e.click();
            };
        });
        if (_compt_associada.exists()){
            obj.find('[name=associar_compt]').val(_compt_associada.val()).change();
        };
    }).prop('title', '{% trans "Este indicador já existe para essa competência." %}')
      .addClass('tooltip-error')
      .tooltip();



    // Indicadores corretos
    $('.ok.editar-indicador').on('click', function(){
        var item = $(this),
            field_ind = item.find('.indicador'),
            indicador = field_ind.val(),
            field_compt = item.closest('.tree-folder').find('.competencia'),
            competencia = field_compt.val(),
            field_importancia = item.find('.importancia'),
            importancia = field_importancia.val();

        var obj = $('.indicador-form').clone(false);

        // Preenchendo formulário
        obj.find('[name=indicador]').val(indicador).end()
           .find('[name=competencia]').val(competencia).end()
           .find('[name=importancia]').val(importancia).end()

           .dialog({
               modal: true,
               hide: 'fade',
               show: 'fade',

               ace_theme: true,
               ace_title_icon_left: 'fa fa-edit',
               buttons: {
                   c: {
                       click: function(){
                           obj.dialog('close');
                       },
                       'class': 'btn btn-xs',
                       text: '{% trans "Cancelar" %}'
                   },
                   e: {
                       click: function(){
                           $.loading.show();
                           field_importancia.val(obj.find('[name=importancia]').val());
                           obj.dialog('close');
                       },
                       text: '{% trans "Editar" %}',
                       'class': 'btn btn-xs btn-success pull-right'
                   }
               },
               close: function(){
                   $.loading.hide();
                   $(this).dialog('close').dialog('destroy');
               },
               title: '{% trans "Editar Indicador" %}',
               width: '80%'
        }).parent().keyup(function(e) {
            if(e.keyCode == 13) {
                obj.data('uiDialog').options.buttons.e.click();
            };
        });
    });

    // Botão Concluir
    $('.actions-buttons').on('click', 'button', function(){
        if ($('.fa-times').exists()){
            $.dialogs.error('{% trans "Existem indicadores que não foram editados" %}', function(){
                $('body, html').animate({
                    scrollTop : $('.fa-times').offset().top - 100
                });
            });
        }else{
            $.dialogs.confirm('{% trans "Você realmente deseja finalizar?" %}', function(){
                var competencias = new Array(),
                    compt_associadas = new Array(),
                    indicadores  = new Array(),
                    ind_associados = new Array(),
                    importancias = new Array();

                // Serializando os dados para enviar
                $('.competencia').each(function(index, competencia){
                    var _key_cc = 'cc_nova_' + _.uniqueId(),
                        data_compt = new Object;
                    data_compt[_key_cc] = competencia.value;
                    competencias.push(
                        $.param(data_compt)
                    );
                    $(competencia).parent().find('.indicador').each(function(index, indicador){
                        var _key_ind = 'ind_' + _.uniqueId() + '_' + _key_cc,
                            data_ind = new Object;
                        data_ind[_key_ind] = indicador.value;
                        indicadores.push(
                            $.param(data_ind)
                        );
                        if ($(indicador).parent().find('[name=associar_compt]').exists()){
                            compt_associadas.push(
                               'ca_' + _key_ind + '=' + $(indicador).parent().find('[name=associar_compt]').val()
                            );
                            ind_associados.push(
                               'ia_' + _key_ind + '=' + $(indicador).parent().find('[name=associar_indicador]').val()
                            );
                        };
                        importancias.push(
                           'impt_ind_' + _key_ind + '=' + $(indicador).next('.importancia').val()
                        );
                    });
                });

                var data = competencias    .join('&') + '&'
                         + indicadores     .join('&') + '&'
                         + compt_associadas.join('&') + '&'
                         + ind_associados  .join('&') + '&'
                         + importancias    .join('&');

                // POST
                $.post('{% url "ncf_comp:atualizar-inventario" %}', data, function(response){
                    if (response == 'concluido'){
                        $.dialogs.success('{% trans "O inventário foi atualizado com sucesso" %}', function(){
                           window.location.href = '{% url "ncf_comp:gerenciar-map" %}';
                        });
                    };
                });
            });
        };
    });
});