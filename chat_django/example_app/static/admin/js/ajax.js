$.ajaxSetup({
    cache: false,
    /*beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        };
        $.loading.show();
    },*/
    error: function(xhr, text, error) {
        if (xhr.status == 0){
            $.dialogs.info('O processo foi cancelado.');
        }else if (xhr.status == 404){
            $.dialogs.error('Link indisponível ou inexistente. Tente novamente.');
        }else if (xhr.status == 500){
            $.dialogs.error('O servidor encontrou um erro e não pode completar a solicitação. Tente novamente.');
        }else if (xhr.status == 502 || xhr.status == 503){
            $.dialogs.error('O servidor está indisponível no momento (por sobrecarga ou inatividade para manutenção). Tente novamente.');
        }else{
            $.dialogs.error('Falha de conexão. Tente novamente.');
        };
    },
    complete: function(){
        try{
        $.loading.hide();
      }catch(e){}
    }
});
