$(document).ready(function() {    
    if ($('#loading_overlay').length == 0) {
        $('body').append('<div id="loading_overlay"> <span></span> </div>');
    };

    esta_mostrando_a_tela_de_carregando = false;

    mostrarCarregando = function(texto) {
        if ($('#loading_overlay').length == 0) {
            return;
        };
        esta_mostrando_a_tela_de_carregando = true;
        if (texto) {
            $('#loading_overlay span').html(texto);
        } else {
            $('#loading_overlay span').html('Carregando... Por favor, aguarde.');
        };

        $('#loading_overlay').overlay({
            onBeforeLoad : function(e) {
                $('#loading_overlay').expose({
                    color : '#212121',
                    closeOnEsc : false,
                    closeOnEscape : false,
                    closeOnClick : false
                });
            },
            onBeforeClose : function(e) {
                $.mask.close();
            },
            top : 'center',
            closeOnEscape : false,
            closeOnEsc : false,
            closeOnClick : false
        });
        $('#loading_overlay').overlay().load();
    };

    esconderCarregando = function() {
        try {
            if ($('#loading_overlay').length == 0) {
                return;
            };
            esta_mostrando_a_tela_de_carregando = false;
            $('#loading_overlay').overlay().close();
        } catch(err) {
        };
    };

    // Código correspondente à dialog de alerta com overlay

    if ($('#alert_dialog_overlay').length == 0) {
        var div = $('<div>', {
            id : 'alert_dialog_overlay'
        }).append($('<table>').append($('<thead>').append($('<tr>').append($('<th class="title-overlay">', {
            rowspan : '3'
        })))).append($('<tbody>').append($('<tr class="message-overlay">').append($('<td>'))).append($('<tr class="buttons">').append($('<td>', {
            id : 'alert_dialog_buttons'
        })))));
        $('body').append(div);
    };

    mostrarDialogCustomizada = function(tipo, titulo, texto, botoes, callback) {
        if ($('#alert_dialog_overlay').length == 0) {
            return;
        };
        $('#alert_dialog_overlay').overlay({
            onBeforeLoad : function(e) {
                $('#alert_dialog_overlay').expose({
                    color : '#212121',
                    closeOnEscape : false,
                    closeOnClick : false
                });
                $('#alert_dialog_overlay #alert_dialog_buttons button[value=0]').focus();
            },
            onBeforeClose : function(e) {
                $.mask.close();
            },
            onLoad : function(e) {
                $('#alert_dialog_overlay #alert_dialog_buttons button[value=0]').focus();
            },
            top : 'center',
            closeOnClick : false,
            closeOnEscape : false,
        });

        var imagem_icone = 'attention.png', titulo_dialog = 'Atenção!', texto_dialog = 'Sem texto para exibir!', botoes_dialog = {
            'Ok' : {
                value : 0,
                'class' : 'button-ok'
            }
        };

        if (tipo == 'alerta') {
            titulo_dialog = 'Atenção!';
            imagem_icone = 'attention.png';
            botoes_dialog = {
                'Ok' : {
                    value : 0,
                    'class' : 'button-ok'
                }
            };
        } else if (tipo == 'confirmacao') {
            titulo_dialog = 'Confirmação';
            imagem_icone = 'question.png';
            botoes_dialog = {
                'Não' : {
                    value : 1,
                    'class' : 'button-nao'
                },
                'Sim' : {
                    value : 0,
                    'class' : 'button-sim'
                }
            };
        } else if (tipo == 'erro') {
            imagem_icone = 'error.png';
            titulo_dialog = 'Erro';
            botoes_dialog = {
                'Ok' : {
                    value : 0,
                    'class' : 'button-ok'
                }
            };
        } else if (tipo == 'informacao') {
            imagem_icone = 'information.png';
            titulo_dialog = 'Informação';
            botoes_dialog = {
                'Ok' : {
                    value : 0,
                    'class' : 'button-ok'
                }
            };
        } else if (tipo == 'sucesso') {
            imagem_icone = 'success.png';
            titulo_dialog = 'Sucesso';
            botoes_dialog = {
                'Ok' : {
                    value : 0,
                    'class' : 'button-ok'
                }
            };
        }
        ;

        if (titulo != null) {
            titulo_dialog = titulo;
        };
        if (texto != null) {
            texto_dialog = texto;
        };
        if (botoes != null) {
            botoes_dialog = botoes;
        };
        $('#alert_dialog_overlay tbody tr.buttons td').html(null);
        $.each(botoes_dialog, function(k, v) {
            var value = v.value, classes = v['class'], button = $('<button>', {
                type : 'button'
            }).text(k).val('' + value).addClass('ui-widget-content ui-corner-all ui-button-text-only ' + classes);
            $('#alert_dialog_overlay tbody tr.buttons td').append(button);
        });

        $('#alert_dialog_overlay')[0].callback = null;
        if (callback) {
            $('#alert_dialog_overlay')[0].callback = callback;
        };
        $('#alert_dialog_overlay').css('background-image', 'url(/static/images/modais_sistema/' + imagem_icone + ')');
        $('#alert_dialog_overlay .title-overlay').html('<b>' + titulo_dialog + '</b><br />&nbsp;');
        $('#alert_dialog_overlay tr.message-overlay td').html(texto_dialog + '<br />&nbsp;');

        $('#alert_dialog_overlay #alert_dialog_buttons button').click(function() {
            $('#alert_dialog_overlay').overlay().close();
            if ($('#alert_dialog_overlay')[0].callback) {
                var v1 = $(this).val();
                var v2 = botoes_dialog[$(this).text()];
                var botao_clicado = (v1 != v2 ? v2 : v1);
                $('#alert_dialog_overlay')[0].callback(botao_clicado);
            };
        });

        $('#alert_dialog_overlay').overlay().load();
    };

    exibirAlerta = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('alerta', titulo, mensagem, {
            'Ok' : {
                value : 0,
                'class' : 'button-ok'
            }
        }, callback);
    };

    exibirConfirmacao = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('confirmacao', titulo, mensagem, {
            'Não' : {
                value : 1,
                'class' : 'button-nao'
            },
            'Sim' : {
                value : 0,
                'class' : 'button-sim'
            }
        }, callback);
    };

    exibirSimOuNao = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('confirmacao', titulo, mensagem, {
            'Não' : {
                value : 1,
                'class' : 'button-nao'
            },
            'Sim' : {
                value : 0,
                'class' : 'button-sim'
            }
        }, callback);
    };

    exibirErro = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('erro', titulo, mensagem, {
            'Ok' : {
                value : 0,
                'class' : 'button-ok'
            }
        }, callback);
    };

    exibirInformacao = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('informacao', titulo, mensagem, {
            'Ok' : {
                value : 0,
                'class' : 'button-ok'
            }
        }, callback);
    };

    exibirSucesso = function(titulo, mensagem, callback) {
        mostrarDialogCustomizada('sucesso', titulo, mensagem, {
            'Ok' : {
                value : 0,
                'class' : 'button-ok'
            }
        }, callback);
    };

    confirmarExclusao = function(retorno) {
        if (retorno == 0) {
            $('.vForm input[type=submit][value=Excluir]').attr('confirmado', 'confirmado');
            setTimeout('$(".vForm input[type=submit][value=Excluir]").click();', 250);
        };
    };
});
