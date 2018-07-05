var classes_e_mascaras = {
    'vCPF' : {
        'mask' : '999.999.999-99',
        'placeholder' : ' '
    },
    'vData' : {
        'mask' : 'd/m/9999',

    },
    'vMes' : {
        'mask' : 'm/9999',
        'placeholder' : ' '
    },
    'vAnoMes' : {
        'mask' : '9999/m',
        'placeholder' : ' '
    },
    'vHora' : {
        'mask' : '99:99',
        'placeholder' : ' '
    },
    'vTel' : {
        'mask' : '99999999N',
        'repeat' : 1,
        'greedy' : true,
        'placeholder' : '',
        'definitions' : {
            '9' : {
                'validator' : '[1234567890]',
                'cardinality' : 1,
                'prevalidator' : null
            },
            'N' : {
                'validator' : '[ 0-9]',
                'cardinality' : 1,
                'prevalidator' : null
            }
        }
    },
    'vCNPJ' : {
        'mask' : '99.999.999/9999-99',
        'placeholder' : ' '
    },
    'vCEP' : {
        'mask' : '99999-999',
        'placeholder' : ' '
    },
    'vDDD' : {
        'mask' : '9',
        'repeat' : 3,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNome' : {
        'mask' : 'n',
        'repeat' : 1000,
        'greedy' : false,
        'placeholder' : ' ',
        'definitions' : {
            'n' : {
                'validator' : '[A-Za-z0-9 \']',
                'cardinality' : 1,
                'prevalidator' : null
            }
        }
    },
    'vRazao' : {
        'mask' : 'n',
        'repeat' : 1000,
        'greedy' : false,
        'placeholder' : ' ',
        'definitions' : {
            'n' : {
                'validator' : '[A-Za-z0-9 \']',
                'cardinality' : 1,
                'prevalidator' : null
            }
        }
    },
    'vNumero' : {
        'mask' : '9',
        'repeat' : 1000,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNumero2Digitos' : {
        'mask' : '9',
        'repeat' : 2,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNumero3Digitos' : {
        'mask' : '9',
        'repeat' : 3,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNumero4Digitos' : {
        'mask' : '9',
        'repeat' : 4,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNumero8Digitos' : {
        'mask' : '9',
        'repeat' : 8,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vNumero10Digitos' : {
        'mask' : '9',
        'repeat' : 10,
        'greedy' : false,
        'placeholder' : ' '
    },
    'vEmail' : {
        'mask' : '@',
        'repeat' : 1000,
        'greedy' : false,
        'placeholder' : ' ',
        'definitions' : {
            '@' : {
                'validator' : '[@0-9A-Za-z._-]',
                'cardinality' : 1,
                'prevalidator' : null
            }
        }
    },
    'vPuro' : {
        'mask' : 'P',
        'repeat' : 1000,
        'greedy' : false,
        'placeholder' : ' ',
        'definitions' : {
            'P' : {
                'validator' : '[0-9A-Za-z]',
                'cardinality' : 1,
                'prevalidator' : null
            }
        }
    },
    'vPorcentagem' : {
        'mask' : '9?9,99',
        'placeholder' : '0'
    },
    vUrl: undefined
};

var classes_sem_mascaras = {
    'vDecimal' : '',
    'vDecimalNotMoney' : ''
};

$(document).ready(function() {
    $.extend($.inputmask.defaults, {
        'autounmask' : true
    });
    aplicar_mascaras = function(elemento_pai) {
        for (classe in classes_e_mascaras) {
            $(elemento_pai).find('input.' + classe).inputmask(classes_e_mascaras[classe]);
        };

        $(elemento_pai).find('.vMaxLength').each(function() {
            var max = $(this).attr('max-length') || '100', vMaxLength = {
                mask : 'n',
                repeat : parseInt(max),
                greedy : false,
                placeholder : ' ',
                definitions : {
                    n : {
                        cardinality : 1,
                        prevalidator : null
                    }
                }
            };

            //função que add o '[...]'
            event_mouse = function() {
                var value = $(this).val();
                if (value.length == 200) {
                    if (!$(this).hasClass('mask-limit')) {
                        $(this).addClass('mask-limit').removeClass('mask-no-limit').val(value.slice(0, 194) + ' [...]');
                    };
                } else {
                    if (!$(this).hasClass('mask-no-limit')) {
                        $(this).addClass('mask-no-limit').removeClass('mask-limit').val(value.replace(' [...]', ''));
                    };
                };
            };

            //inicializando eventos.
            $(this).keyup(event_mouse).change(event_mouse);

            //add +
            var events_to_method_on = {}, all_events = 'blur focus mouseenter mouseleave click dbclick'.split(' ');

            //criando hash com todos os eventos da lista para o método on.
            $.each(all_events, function() {
                events_to_method_on[this] = function() {
                    $(this).change();
                };
            });

            //add eventos
            $(this).inputmask(vMaxLength).on(events_to_method_on);
        });

        $('.vUrl').bind('click', function(e){
            if($.trim($(e.target).val())=='') $(e.target).val('http://');
        });

        // vObrigatorio
        $('.vObrigatorio:enabled').each(function(){
            var p = $(this).closest('p'),
                label = p.find('label'),
                span = $('<span>').text('*').addClass('required');

            if (label.find('.required').length==0){
                label.append(span);
            };
        });

        // Porcentagens
        $(elemento_pai).find('input.vPorcentagem').css({
            'text-align' : 'right'
        });
        //$(elemento_pai).find('input.vPorcentagem').each(function(idx, input) {
            //$(input).after(" %");
            // sinal de porcentagem na frente dos inputs
        //});

        // decimal (dinheiro)
        $(elemento_pai).find('input.vDecimal').addClass('auto').css({
            'text-align' : 'right'
        });
        $(elemento_pai).find('.auto').autoNumeric({
            aSep : '.',
            aDec : ',',
            aSign : 'R$'
        });
        $(elemento_pai).find('.auto').each(function(index, item) {
            var c = $(item);
            if (c.val() != '') {
                c.val($.fn.autoNumeric.Format(c.attr('id'), c.val(), {
                    aSep : '.',
                    aDec : ',',
                    aSign : 'R$'
                }));
            };
        });
        // decimal (não dinheiro)
        $(elemento_pai).find('input.vDecimalNotMoney').addClass('autoNotMoney').css({
            'text-align' : 'right'
        });
        $(elemento_pai).find('.autoNotMoney').autoNumeric({
            aSep : '',
            aDec : ',',
            aSign : ''
        });
        $(elemento_pai).find('.autoNotMoney').each(function(index, item) {
            var c = $(item);
            /*if (c.val() != '') {
                c.val($.fn.autoNumeric.Format(c.attr('id'), c.val(), {
                    aSep : '',
                    aDec : ',',
                    aSign : ''
                }));
            };*/
        });

        $(elemento_pai).find('.vForm input, .vForm select, .vForm textarea').each(function(index, item) {
            if ($(item).attr('mask')) {
                $(item).inputmask(JSON.parse($(item).attr('mask')));
            };
        });

        if ($(elemento_pai).find('input:enabled.vData').length > 0) {
            $(elemento_pai).find('input:not([type=hidden]):enabled.vData').datepicker({
                inline : true,
                showOtherMonths : true,
                changeMonth : true,
                changeYear : true,
                prevText : 'Anterior', // Display text for previous month link
                nextText : 'Próximo',
                currentText : 'Hoje',
                dateFormat : "dd-mm-yyyy",
                yearRange : 'c-100:c+100',
                minDate : new Date(1990, 1 - 1, 1),
                maxDate : "+1y",
                onClose : function(dateText, inst) {
                    var element = inst.input;
                    if (element.data('qtip')){
                          element.qtip('destroy');
                      };
                    element.closest('p').removeClass('vErro');
                },
                onSelect : function(dateText, inst) {
                    var element = inst.input;
                    if (element.data('qtip')){
                        element.qtip('destroy');
                    };
                    element.closest('p').removeClass('vErro');
                },
            });
            $('#ui-datepicker-div').attr('style', 'display: none');

            $(".vData:enabled").on('blur', function() {
                this_data = this.value.split("/");
                var this_label = $("label[for=" + this.id + "]").text();
                var currentTime = new Date();
                var prox_ano = currentTime.getFullYear() + 1;
            });
        };

        options_monthpicker = {
            pattern : 'mm/yyyy',
            monthNames : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        };
    };
    aplicar_mascaras(document);
});
