'{% load i18n %}';
'{% load url from future %}';

$(function () {

    $('#id_filtro').blur(function () {
        if ($('#id_filtro').val().length == 0) {
            reload_djflexgrid('#listagem');
        }
        ;
    });

    // CONF FLEXGRID
    function conf_flexgrid() {
        $('[title]').tooltip();

        // SELECIONAR TODOS
        $('.check-uncheck').on('click', function () {
            var obj = $(this),
                objs = obj.closest('table').find('tbody > tr td span input[type=checkbox]');
            if (obj.is(':checked')) {
                objs.check();
            } else {
                objs.uncheck();
            }
            ;
        });
        // ENCERRAR
        $('.encerrar').on('click', function () {
            var obj = $(this),
                funcao_id = obj.closest('tr').find('td:eq(1) > span').text();
            $.dialogs.confirm('Confirmar encerramento',
                'Você deseja encerrar este mapeamento?', function () {
                    var url = CONF.encerrar_url.replace('0', funcao_id);

                    $.ajax({
                        url: url,
                        type: 'POST',
                        success: function (data) {
                            if (data) {
                                if (!data.encerrado && data.erros) {
                                    $.dialogs.error('Não foi possível encerrar o mapeamento.', data.erros);
                                } else if (data.encerrado) {
                                    obj.closest('tr').addClass('success');
                                    $.dialogs.success('O mapeamento foi encerrado com sucesso.', function () {
                                        $('#listagem').data('djflexgrid').methods.reload();
                                    });
                                }
                                ;
                            }
                            ;
                        }
                    });
                });
        });
        try {
            $('.copiar_de').not('.disabled').on('click', function () {
                var tr        = $(this).closest('tr');
                var funcao_id = tr.attr('cache-id');
                var funcao    = $("tr[cache-id='"+funcao_id+"']").find('td:eq(1)').text();
                $('#dialog_de').dialog_de({
                    url_action: CONF.para,
                    para: {
                        id: funcao_id,
                        value: funcao
                    }
                });
            });
            $('.copiar_para').not('.disabled').on('click', function () {
                var tr        = $(this).closest('tr');
                var funcao_id = tr.attr('cache-id');
                var funcao    = $("tr[cache-id='"+funcao_id+"']").find('td:eq(1)').text();
                $('#dialog_para').dialog_para({
                    url_action: CONF.de,
                    de: {
                        id: funcao_id,
                        value: funcao
                    },
                    completeLoad: function () {
                        $('#alert_dialog_buttons [value=0]').click(function () {
                            $('#listagem').data('djflexgrid').methods.reload();
                        });
                    }
                });
            });
        } catch (e) {
            console.warn('Faltou importar o plugin "de_para".');
        }
        ;
    };
    // EXPORT
    function export_flexgrid(container, format) {
        var settings = container.data('djflexgrid'),
            url = '' + settings.list_url + '?export=' + format;
        window.location = url;
    };
    $('.flexgrid_export_pdf').on('click', function () {
        export_flexgrid($('#listagem'), 'pdf');
    });
    $('.flexgrid_export_xls').on('click', function () {
        export_flexgrid($('#listagem'), 'xls');
    });

    // LISTAGEM
    $('#listagem').djflexgrid({
        list_url: CONF.listar_funcoes,
        beforeLoad: $.loading.show,
        successLoad: function () {
            conf_flexgrid();
        },
        completeLoad: function () {
            $('#listagem').show('fade');
            $.loading.hide();
        },
        filter_form: '.form-filtro'
    });

    // AÇÕES EM MASSA
    $('.encerrar-selecao').on('click', function () {
        var value = 'encerrar';
        var checks = $('#listagem > table > tbody tr td span input:checked');
        $('#listagem > table > tbody > tr').removeClass('danger');

        switch ((checks.length > 0) == true) {
            case (value == 'encerrar'):
            {
                var abertas = _.filter(checks, function (item, index) {
                    return $(item).closest('tr').find('td:eq(4) > span').text() == 'Aberta';
                });
                if (abertas.length > 0) {
                    $(abertas).closest('tr').addClass('danger');
                    $.dialogs.error('Existem mapeamentos em aberto selecionados.');
                } else {
                    if (checks.length > 1) {
                        var msg = 'Você deseja encerrar os mapeamentos selecionados?';
                    } else {
                        var msg = 'Você deseja encerrar o mapeamento selecionado?';
                    }
                    ;
                    $.dialogs.confirm('Confirmar encerramento', msg, function () {
                        var url = CONF.encerrar_em_massa;

                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: {
                                funcoes: _.map(checks.closest('tr').find('td:eq(1)'), function (item, index) {
                                    return $(item).text();
                                }).join()
                            },
                            success: function (data) {
                                if (data) {
                                    if (!data.encerrado && data.erros) {
                                        $.dialogs.error(
                                            'Não foi possível encerrar os mapeamentos.', data.erros
                                        );
                                    } else if (data.encerrado) {
                                        checks.closest('tr').addClass('success');
                                        $.dialogs.success(
                                            'Os mapeamentos foram encerrados com sucesso.', function () {
                                                $('#listagem').data('djflexgrid').methods.reload();
                                            });
                                    }
                                    ;
                                }
                                ;
                            }
                        });
                    });
                }
                ;
                break;
            }
                ;
            default :
            {
                $.dialogs.warning(
                    'Nenhum mapeamento selecionado.',
                    'Por favor, para realizar o encerramento a tabela deve conter pelo menos um mapeamento selecionado.'
                );
            }
                ;
        }
        ;


    });
});