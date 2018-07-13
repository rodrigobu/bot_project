// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('pt-br', {
    defaultMessage: "Este valor é inválido.",
    type: {
        email: "Este campo deve ter um e-mail válido.",
        url: "Este campo deve ter uma URL válida.",
        number: "Este campo deve ter um número válido.",
        integer: "Este campo deve ter um número inteiro válido.",
        digits: "Este campo deve conter apenas dígitos.",
        alphanum: "Este campo deve ser alfanumérico."
    },
    notblank: "Este campo não pode ficar vazio.",
    required: "Este campo é obrigatório.",
    pattern: "Este campo está fora do padrão.",
    min: "Este campo deve ser maior ou igual a %s.",
    max: "Este campo deve ser menor ou igual a %s.",
    range: "Este campo deve estar entre %s e %s.",
    minlength: "Este campo deve ter %s caracteres ou mais.",
    maxlength: "Este campo deve ter %s caracteres ou menos.",
    length: "Este campo deve ter entre %s e %s caracteres.",
    mincheck: "Você deve escolher pelo menos %s opções.",
    maxcheck: "Você deve escolher %s opções ou mais",
    check: "Você deve escolher entre %s e %s opções.",
    equalto: "Este valor deveria ser igual."
});

Parsley.setLocale('pt-br');
