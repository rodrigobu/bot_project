'{% load i18n %}';

jQuery.extend(jQuery.validator.messages, {
    required: 'Este campo é obrigatório.',
    remote: 'Por favor corrigir este campo.',
    email: 'Por favor insira um endereço de e-mail válido.',
    url: 'Por favor, digite uma URL válida.',
    date: 'Digite uma data válida.',
    dateISO: 'Digite uma data válida (ISO).',
    number: 'Por favor insira um número válido.',
    digits: 'Introduza apenas dígitos.',
    creditcard: 'Por favor insira um número de cartão de crédito válido.',
    equalTo: 'Favor digite o mesmo valor novamente',
    accept: 'Please enter a value with a valid extension.',
    maxlength: jQuery.validator.format('Digite não mais do que {0} caracteres.'),
    minlength: jQuery.validator.format('Digite pelo menos {0} caracteres.'),
    rangelength: jQuery.validator.format('Favor insira um valor entre {0} e {1} caracteres'),
    range: jQuery.validator.format('Por favor insira um valor entre {0} e {1}'),
    max: jQuery.validator.format('Favor insira um valor menor ou igual a {0}'),
    min: jQuery.validator.format('Favor insira um valor maior ou igual a {0}'),
    maxWords: jQuery.validator.format('Please enter {0} words or less.'),
    minWords: jQuery.validator.format('Please enter at least {0} words.'),
    rangeWords: jQuery.validator.format('Please enter between {0} and {1} words.'),
    accept: 'Please enter a value with a valid mimetype.',
    alphanumeric: 'Letters, numbers, and underscores only please',
    nowhitespace: 'Por favor, retire os espaços em branco'
})
