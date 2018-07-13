'{% load url from future %}';

/**
 * Created by douglas on 24/04/14.
 */


$.fn.dialog_de_para = function(options) {
    var container = this,
        m = {
            'get_title': function(){
                return $(container).find('.title').val();
            },
            'set_funcao': function(dialog, field, f){
            	console.log('#set_funcao');
            	console.log('#id_' + field);
            	console.log('#id_' + f);
                var field = $(dialog).find('#id_' + field);
            	console.log($(field));
                field.val(f);
                return field;
            },
            'close': function(){
                $(container).dialog('close');
            },
            'change_param_url': function(url, param, value){
                return url.replace('/'+param+'/0/', '/'+param+'/'+value+'/');
            },
            'jq_multiselect': function(field){
                $(field).multiSelect({
                    selectableHeader: 'Funções: ',
		            selectionHeader: 'Funções selecionadas: '
                });
            }
        },
        settings = $.extend(
            {
                // conf jquery dialog
                modal: true,
                width: 530,
                height: 'auto',
                buttons: {},
                title: m.get_title(),
                ace_theme: true,

                // conf dialog de_para
                de: {},
                para: {},
                url_action: '',
                settings_name: 'dialog_de_para',
                afterOpen: function(dialog, settings, methods){},
                beforeOpen: function(settings, methods){},
                beforeLoad: function(settings, methods){},
                successLoad: function(retorno, settings, methods){},
                completeLoad: function(settings, methods){}

            }, options
        );
    container.data(
        settings.settings_name, settings
    );

    container = $(container).clone(false);

    // Função
    settings.de = $.extend(
        { id: '', 'field_readonly': 'de', 'value': '' }, settings.de
    );
    settings.para = $.extend(
        { id: '', 'field_readonly': 'para', 'value': '' }, settings.para
    );

    m.settings_ajax = function(){
        var data = {},
            url = settings.url_action;

        if (settings.para.id){
        	console.log("settings.para.id");
        	console.log($(container).find('[name=de]').val());
        	console.log(settings.para.id);
            url = m.change_param_url(url, 'de', $(container).find('[name=de]').val());
            url = m.change_param_url(url, 'para', settings.para.id);
        }else if (settings.de.id){
        	
        	console.log("settings.de.id");
        	console.log(settings.de.id);
            url = m.change_param_url(url, 'de', settings.de.id);
            data = $(container).find('#id_para').serialize();
        };

        return {
            url: url,
            type: 'post',
            data: data,
            success: function(r){
                settings.successLoad(r, settings, m);
                if (r.status == 'ok'){
                    m.close();
                    $.dialogs.success(
                        'Cópia concluída',
                        'A cópia do mapeamento foi realizada com sucesso.',
                        $('#listagem').data('djflexgrid').methods.reload
                    );
                };
                settings.completeLoad(settings, m);
            }
        };
    };
    m.exec_copy = function(){
        if (/*validarForm($(container).find('form')) == undefined*/true){
            var data = {};
            if (settings.para.id){
                data.funcao = settings.para.id;
            }else if (settings.de.id){
                data.funcoes = $(container).find('#id_para').val().join(',');
            };
            $.ajax({
                url: '{% url "ncf_comp:tem_mapeamento" %}',
                type: 'post',
                data: data,
                success: function(retorno){
                    if ('funcao' in data){
                        if (_.isBoolean(retorno) && retorno){
                            var de = $(container).find('option[value='+$(container).find('#id_de').val()+']').text(),
                                msg = '' +
                                'A função "'+settings.para.value+'" já possui mapeamento comportamental, ' +
                                'tem certeza que deseja excluir o mapeamento atual e executar a cópia do mapeamento ' +
                                'comportamental da função "'+de+'" para a função "'+settings.para.value+'"?';

                            m.close();
                            $.dialogs.confirm('Confirmar', msg, function(){
                               var settings_ajax = m.settings_ajax();
                               settings.beforeLoad(settings, m);
                               $.ajax(settings_ajax);
                            });
                        }else{
                            var settings_ajax = m.settings_ajax();
                            settings.beforeLoad(settings, m);
                            $.ajax(settings_ajax);
                        };
                    }else if ('funcoes' in data){
                        if (_.isArray(retorno) && retorno.length > 0){
                            m.close();
                            var msg = 'As funções "'+retorno.join(', ')+'"  já possuem mapeamento comportamental, ' +
                                      'tem certeza que deseja excluir o mapeamento atual e executar a cópia do ' +
                                      'mapeamento comportamental a partir da  função "'+retorno[0]+'"?';
                            $.dialogs.confirm('Confirmar', msg, function(){
                               var settings_ajax = m.settings_ajax();
                                settings.beforeLoad(settings, m);
                                $.ajax(settings_ajax);
                            });
                        }else{
                            var settings_ajax = m.settings_ajax();
                            settings.beforeLoad(settings, m);
                            $.ajax(settings_ajax);
                        };
                    };
                }
            });
        };
    };

    // Botões
    settings.buttons = $.extend({
        Cancelar: {
            click: m.close,
            text: 'Cancelar',
            'class': 'btn btn-xs',
            icons: { primary: 'ace-icon fa fa-times' }
        },
        Copiar: {
            text: 'Copiar',
            click: m.exec_copy,
            'class': 'btn btn-xs btn-success'
        }
        }, settings.buttons
    );

    settings.beforeOpen(settings, m);
    var dialog = $(container).dialog(settings);
    settings.afterOpen(dialog, settings, m);

    if (settings.para.value) {
        var field = settings.para.field_readonly,
            value = settings.para.value;
    }else if (settings.de.value) {
        var field = settings.de.field_readonly,
            value = settings.de.value;
    }else{
        var field, value;
    };

    m.set_funcao(
        dialog, field, value
    );

    if (dialog.find('select[multiple]').length > 0){
        m.jq_multiselect(
            dialog.find('select[multiple]')
        );
    };

    //init_validacao(dialog.find('form'));

    return container;
};

$.fn.dialog_de = function(options){
    var settings = $.extend({
        url_action: '',
        settings_name: 'dialog_de',
        ace_title_icon_left: 'fa fa-download'
    }, options);
    settings.de = {};
    $(this).dialog_de_para(settings);
};

$.fn.dialog_para = function(options){
    var settings = $.extend({
        url_action: '',
        settings_name: 'dialog_para',
        ace_title_icon_left: 'fa fa-upload'
    }, options);
    settings.para = {};
    $(this).dialog_de_para(settings);
};