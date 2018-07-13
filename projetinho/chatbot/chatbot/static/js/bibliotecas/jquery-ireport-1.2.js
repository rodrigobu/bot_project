/**
 * jquery.ireport.js v1.2.0
 *
 * Licensed under the MIT license.
 *
 * Copyright 2012 Ancorarh
 */

$.iReport = function(options){

    'use strict';

    var obj = {};

    obj.defaults = {
        // CONF
        form: 'form',  // seletor do form

        // AJAX
        url_name: '',  // url do relatório
        url_output: 'http://' + window.location.hostname + '/Rpt_gca/tmp/',
        data: '',      // data do ajax
        type: 'POST',
        datatype: '',
        crossdomain: false,
        timeout: 30,   // em minutos

        // TOMCAT
        porta: '8080',
        usa_porta: false,

        // LABELS
        titulo_em_andamento  : 'Gerando relatório...',
        titulo_de_finalizacao: 'O relatório foi gerado com sucesso',
        text_cronometro: 'Criando Páginas... Por favor, aguarde',

        // REDIMENSIONAMENTO
        width: 400,
        height: 'auto',

    };

    // ATRIBUTOS PRIVADOS
    obj._hrs =  0;
    obj._min =  0;
    obj._sec = -1;
    obj._objxhr = {};
    obj._cronometro  = null;
    obj._cronometrar = false;
    obj._progressbar = null;

    // OPCOES
    obj.options = $.extend(true, {}, obj.defaults, options);

    if (obj.options.usa_porta){
        obj.options.url_output = 'http://' + window.location.hostname + ':' + obj.options.porta + '/Rpt_gca/tmp/';
    };

    // CONTAINER
    obj.container = $('#id_dialog_ireport');
    if (obj.container.length == 0){
        var div = $('<div>', { id: 'id_dialog_ireport' })
                       .addClass('ui-helper-hidden');
        $('body').append(div);
        obj.container = $('#id_dialog_ireport');
    };

    // MÉTODOS
    var metodos = {
        fmtt_int: function(integer){
            if ( integer <= 9 ){
                return '0' + integer;
            };
            return integer;
        },
        gerar_cronometro: function(){
            var span = $('<span>', { id: 'id_cronometro',})
                                     .text('00: 00');
            if ($(obj.container).find('#id_cronometro').length == 0){
                $(obj.container).append(span);
                obj._cronometro = span;
                return obj;
            }else{
                obj._cronometro = $(obj.container).find('#id_cronometro');
                return obj;
            };
        },
        inicializar_cronometro: function(){
            var container = obj.container,
                crom      = obj._cronometro;
            obj._hrs = 0;
            obj._min = 0;
            obj._sec = -1;

            function contador(){
                obj._sec++;

                if ( obj._sec == 60 ) {
                    obj._sec= 0;
                    obj._min++;
                };

                if ( obj._min <= 9 ) {
                    obj._min = obj._min;
                };

                obj._cronometro.text(obj.fmtt_int(obj._min) + ': ' + obj.fmtt_int(obj._sec));
                if ( obj._cronometrar ){
                    obj.cron_interval = setTimeout(contador, 1000);
                };
            };

            if (!obj._cronometrar){
                obj = obj.gerar_cronometro(obj);
                crom = obj._cronometro;
                obj._cronometrar = true;
                contador();
            };

            return obj;
        },
        parar_cronometro : function(){
            clearInterval(obj.cron_interval);
            obj._cronometrar = false;
            return obj;
        },
        remover_cronometro: function(){
            obj._cronometro.remove();
            return obj;
        },
        gerar_progressbar: function(){
            var div_progressbar = $('<div>', { id: 'id_progressbar' }),
                div_overlay_progressbar  = $('<div>', { id: 'id_ovarlay_progressbar' }).addClass('ui-progressbar-overlay'),
                progressbar = null;

            div_progressbar.append(div_overlay_progressbar);
            progressbar = div_progressbar.progressbar({ value:  false });
            obj._progressbar = progressbar;

            $(obj.container).find('#id_progressbar').remove();
            $(obj.container).append(obj._progressbar);
            return obj;
        },
        remover_progressbar: function(){
            obj._progressbar.remove();
            return obj;
        },
        gerar_dialog: function(){
            obj.container.dialog({
                ace_theme: true,
                autoOpen: false,
                buttons :{
                    Cancelar:{
                        click:
                            function() {
                            $(this).dialog('close');
                        },
                        text: 'Cancelar',
                        'class': 'btn btn-xs'
                    },

                    'Tentar Novamente':{
                         click:  obj.run,
                         text: 'Tentar Novamente',
                         class: 'btn btn-xs btn-success'
                    },

                    Fechar:{
                        click:
                            function() {
                            $(this).dialog('close');
                        },
                        text: 'Fechar',
                        'class': 'btn btn-xs'
                    },
                },
                beforeClose: function(e, u){
                    if (obj._objxhr.readyState == 1){
                        $.dialogs.confirm(
                            'Deseja cancelar?',
                            'Tem certeza de que deseja cancelar este processo?',
                        function(){
                            if ( obj._objxhr ){
                                obj.abort();
                            };
                            obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
                            $(e.target).dialog('destroy');
                        });
                        return false;
                    }else{
                        obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
                        $(e.target).dialog('destroy');
                    };
                },
                closeOnEscape: false,
                modal: true,
                height: obj.options.height,
                hide: 'fade',
                position: obj.options.position,
                open: function(){
                    obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
                    obj.gerar_cronometro().gerar_progressbar();
                },
                show: 'fade',
                title: obj.options.titulo_em_andamento,
                width: obj.options.width,
            });
            return obj;
        },
        abrir_dialog: function(){
            if ($(obj.container).length == 0){
                var div = $('<div>', { id: 'id_dialog_ireport' })
                               .addClass('ui-helper-hidden');
                $('body').append(div);
                obj.container = $('#id_dialog_ireport');
                obj.gerar_dialog();
            }else if (!obj.container.data('dialog')){
                obj.gerar_dialog();
            };

            var buttons = obj.container.closest('.ui-dialog').find('.ui-dialog-buttonpane');
            $(buttons).find('button').hide();
            $(buttons).find('button:first').show();

            obj.gerar_cronometro().gerar_progressbar();
            obj.container.dialog('open');

            return obj;
        },
        serializar_form: function(){
            var data = obj.options.data;
            if ( data && data.length > 0 ){
                if ( data instanceof $ ){
                    return data.serialize();
                };
            }else if( $.isPlainObject(data) ){
                return data;
            }else{
                return $(obj.options.form).serialize();
            };

            return obj.options.data;
        },
        erro: function(erro){
            if (obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').length > 0){
                obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
            };

            var div = $('<div>', { id: 'id_div_ireport_erro'})
                            .addClass('ui-state-error ui-corner-all ui-helper-hidden'),
                ul  = $('<ul>', { id: 'id_ul_ireport_erro'}).css('list-style', 'none'),
                li  = $('<li>', { id: 'id_ireport_erro'   }),
                tempo = $('<span>', { id: 'id_ireport_tempo'}).text('Tempo: '+ (obj.fmtt_int(obj._min) + ': ' + obj.fmtt_int(obj._sec)));

            li.html(erro);
            ul.append(li);

            // tempo
            var li_tempo = li.clone().html(tempo);
            ul.append(li_tempo);

            div.append(ul);
            obj.container.prepend(div);
            div.show('fade');
            return obj;
        },
        info: function(info, excluir_tempo){
            if (obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').length > 0){
                obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
            };

            var div = $('<div>', { id: 'id_div_ireport_info'})
                           .addClass('ui-state-highlight ui-corner-all ui-helper-hidden'),
                ul  = $('<ul>', { id: 'id_ul_ireport_info'}).css('list-style', 'none'),
                li  = $('<li>', { id: 'id_ireport_info'   }),
                tempo = $('<span>', { id: 'id_ireport_tempo'}).text('Tempo: '+ (obj.fmtt_int(obj._min) + ': ' + obj.fmtt_int(obj._sec)));

            li.html(info);
            ul.append(li);

            if (!excluir_tempo){
                // tempo
                var li_tempo = li.clone().html(tempo);
                ul.append(li_tempo);
            };

            div.append(ul);
            obj.container.prepend(div);
            div.show('fade');
            return obj;
        },
        sucesso: function(url, qtd_pag_rel, tamanho_rel){
            if (obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').length > 0){
                obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();
            };

            if (/^\/media\/tmp/.test(url)){ // PARA RELATÓRIOS EM REPORTLAB
                var url = url;
            }else{
                var lista_url = url.split('/'),
                    arquivo   = lista_url.reverse()[0],
                    url = obj.options.url_output + arquivo;
            };

            var div = $('<div>', { id: 'id_div_ireport_sucesso'})
                           .addClass('ui-helper-hidden'),
                ul  = $('<ul>', { id: 'id_ul_ireport_sucesso'}).css('list-style', 'none'),
                li  = $('<li>', { id: 'id_ireport_sucesso'   }),
                a_href = $('<a>', { href: url, target:'_blank' }).text('Clique aqui para baixá-lo.').css('color', 'rgb(4, 124, 235)'),
                qtd_pag = $('<span>', { id: 'id_ireport_qtd_pag'}).text(' Páginas: '+qtd_pag_rel+' - '),
                tamanho = $('<span>', { id: 'id_ireport_tamanho'}).text('Tamanho: '+tamanho_rel+' - '),
                tempo = $('<span>', { id: 'id_ireport_tempo'}).text('Tempo: '+ (obj.fmtt_int(obj._min) + ': ' + obj.fmtt_int(obj._sec)));

            // msg
            li.html('Relatório gerado com sucesso!');
            ul.append(li);
            // link
            var li_a = li.clone().html(a_href);
            ul.append(li_a);
            // qtd de pag
            if (!/(.zip)$/.test(arquivo) && qtd_pag_rel && qtd_pag_rel != 'undefined' && qtd_pag_rel > 0){
                var li_qtd = li.clone().html(qtd_pag).css('display', 'inline');
                ul.append(li_qtd);
            };
            if (tamanho_rel && tamanho_rel != 'undefined'){
                // tamanho do rel
                var li_tam = li.clone().html(tamanho).css('display', 'inline');
                ul.append(li_tam);
            };
            // tempo
            var li_tempo = li.clone().html(tempo).css('display', 'inline');
            ul.append(li_tempo);

            div.append(ul);
            obj.container.prepend(div);
            div.show('fade');
            return obj;
        },
        run: function(){

            obj.container.find('#id_div_ireport_sucesso, #id_div_ireport_erro, #id_div_ireport_info').remove();

            var container = $(obj.container),
                dialog    = container.closest('.ui-dialog'),
                titulo    = dialog.find('.ui-dialog-titlebar .ui-dialog-title');

            titulo.text(obj.options.titulo_em_andamento);

            var settings = $.extend({}, $.ajaxSettings);

            var contexto = {
                url: obj.options.url_name,
                type: obj.options.type,
                crossDomain: obj.options.crossdomain,
                data: obj.serializar_form(),
                dataType: obj.options.datatype,
                timeout: (obj.options.timeout * 60500),
                progress: function(jqXHR, progressEvent) {
                    if (progressEvent.lengthComputable) {
                        console.log("Loaded " + (Math.round(progressEvent.loaded / progressEvent.total * 100)) + "%");
                    } else {
                        console.log("Loading...");
                    };
                },
                beforeSend: function(xhr, settings){
                    //settings.beforeSend(xhr, settings);
                    obj.inicializar_cronometro().abrir_dialog();
                },
                success: function(rel){
                    var container = $(obj.container),
                        dialog    = container.closest('.ui-dialog'),
                        titulo    = dialog.find('.ui-dialog-titlebar .ui-dialog-title').find('.smaller');

                    if (rel.invalido){
                        obj.erro('Filtros inválidos.');
                        titulo.text('Processo cancelado');
                        obj.remover_cronometro().remover_progressbar();
                    }else if (rel.status == 'ok'){
                        if (/(.zip)$/.test(rel.arquivo) || rel.paginas > 0){
                            var download = '';
                            if (rel.link){
                                download = rel.link;
                            }else if(rel.arquivo){
                                download = rel.arquivo;
                            };
                            obj.sucesso(download, rel.paginas, rel.tamanho);
                            titulo.text(obj.options.titulo_de_finalizacao);
                        }else{
                            obj.erro('Não existem registros no intervalo selecionado.');
                            titulo.text('Processo cancelado');
                        };
                    }else if(rel.status == 'to_request'){
                        obj.parar_cronometro().remover_cronometro().remover_progressbar();
                        obj.inicializar_cronometro();
                        obj.gerar_progressbar();

                        $.ajax({
                            url: rel.url_to_request,
                            type: 'POST',
                            crossDomain: true,
                            data: rel.data,
                            dataType: obj.options.datatype,
                            timeout: (obj.options.timeout * 60500),
                            success: function(data){
                                obj.parar_cronometro().remover_cronometro().remover_progressbar();
                                var rel = JSON.parse(data);
                                if (/(.zip)$/.test(rel.arquivo) || rel.paginas > 0){
                                    var download = '';
                                    if (rel.link){
                                        download = rel.link;
                                    }else if(rel.arquivo){
                                        download = rel.arquivo;
                                    };
                                    obj.sucesso(download, rel.paginas, rel.tamanho);
                                    titulo.text(obj.options.titulo_de_finalizacao);
                                }else{
                                    obj.erro('Não existem registros no intervalo selecionado.');
                                    titulo.text('Processo cancelado');
                                };
                            },error: function (xhr, text, error) {
                            //settings.error(xhr, text, error);
                              console.log("estou aqui 2...");
                              obj.remover_progressbar();
                              console.log(xhr.status);
                              var buttons = obj.container.closest('.ui-dialog').find('.ui-dialog-buttonpane');
                              $(buttons).find('button').show();
                              if (xhr.status ==503 ||  xhr.status ==504){
                                $(buttons).find('button:first').hide();
                                $(buttons).find('button:nth-child(2)').hide();
                                obj.info(
                                   'O processo de geração do relatório ainda está em andamento.<br/>\
                                   <br/>Você será notificado assim que estiver disponível para download em suas Notificações.', true
                                );
                                obj.remover_cronometro();
                              } else {
                                $(buttons).find('button:first').hide();
                              }
                          }
                        });
                    }else {
                        if (rel.celery){
                            obj.info(
                                'O processo de geração de relatórios foi iniciado.<br/><br/>Você será notificado por e-mail assim que estiver disponível para download.', true
                            );
                        }else{
                            obj.erro('Não foi possível gerar o relatório. <br/>Por favor, tente novamente.');
                            titulo.text('Processo cancelado');
                            var buttons = obj.container.closest('.ui-dialog').find('.ui-dialog-buttonpane');
                            $(buttons).find('button').show();
                            $(buttons).find('button:first').hide();
                        };
                        obj.remover_cronometro().remover_progressbar();
                    };
                },
                complete: function(xhr){
                    //settings.complete();
                    //obj.parar_cronometro();
                    if (xhr.status == 200){
                        var buttons = obj.container.closest('.ui-dialog').find('.ui-dialog-buttonpane');
                        $(buttons).find('button').hide();
                        $(buttons).find('button:last').show();
                    };
                }
            };
            obj._objxhr = $.ajax(contexto);
        },

        abort: function(){
            obj._objxhr.abort();
        }
    };

    obj = $.extend(true, {}, metodos, obj); // ADD MÉTODOS AO OBJ
    obj.gerar_cronometro().gerar_progressbar().gerar_dialog(); // CRIANDO OBJ
    return obj;
};
