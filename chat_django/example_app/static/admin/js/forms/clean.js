function clean_required(field){
    var invalid,
        field  = $(field),
        form_group = field.closest('.form-group');
    if (field.is(':checkbox')){
        invalid = !field.is(':checked');
    }else{
        invalid = !field.val();
    };
    if (invalid){
        form_group.addClass('has-error');
        if (form_group.find('.error').length == 0) {
            form_group.append(
                '<p class="error control-label">' + 'Este campo é obrigatório' + '</p>'
            );
        };
        return false;
    }else{
       form_group.removeClass('has-error');
       form_group.find('.error').remove();
       return true;
    };
};
function clean_niveis(avaliar, min, ideal){
    if       (avaliar && (!min && ideal)) {
        return 'O nível mínimo não pode ficar em branco se a opção avaliar estiver marcada';
    }else if  (avaliar && (min && !ideal)) {
        return 'O nível ideal não pode ficar em branco se a opção avaliar estiver marcada';
    }else if  (avaliar && (!min && !ideal)){
        return 'O níveis não podem ficar em branco se a opção avaliar estiver marcada';
    }else if ((min && ideal) && (min > ideal)){
        return 'O nível mínimo não pode ser maior que o ideal';
    };
};

