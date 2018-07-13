var validar_email_bootbox = function(result, function_validate, callback) {
    var retorno = true;
    $.ajax({
        url : URL_VALIDAR_CAMPO_FORMULARIO,
        type : 'get',
        dataType : 'json',
        data : {
            valor : result,
            tipo : function_validate
        },
        success : function(dados) {
            if (dados == '1') {
                callback(false);
            } else {
                callback(true);
            }
        },
        error : function() {
            callback(false);
        },
    });
};

var enviar_email_teste = function() {
    bootbox.prompt({
      title: "Entre com o e-mail para teste",
      value: '',
      buttons: {
        confirm: {
              label: 'Enviar',
              className: 'btn btn-primary',
        },
        cancel: {
            label: 'Cancelar',
            className: 'btn btn-default'
        }
      },
      callback: function(result) {
        if (result) {
            resultado = result;
            mostrarCarregando();
            validar_email_bootbox(result, 'valida_email', function(retorno){
                if (retorno){
                    $.ajax({
                        url : URL_ENVIAR_EMAIL_TESTE,
                        type : 'GET',
                        cache : false,
                        data : {
                            'email_teste'         : result,
                            'email_origem'        : $("#id_email_rh").val(),
                            'email_host'          : $("#id_serveremail_host").val(),
                            'email_host_user'     : $("#id_serveremail_user").val(),
                            'email_host_password' : $("#id_serveremail_password").val(),
                            'email_port'          : $("#id_serveremail_port").val(),
                        },
                        success : function(retorno) {
                            if (retorno["status"] == 'ok') {
                               $.dialogs.success("E-mail enviado com sucesso.");
                            } else {
                                $.dialogs.error(retorno["msg"]);
                            }
                            esconderCarregando();
                        },
                        error : function() {
                            $.dialogs.error('Houve um erro ao enviar e-mail de teste.');
                        },
                        complete : esconderCarregando
                    });
                }
                else{
                    $.dialogs.error("E-mail inválido.");
                    esconderCarregando();
                }
            });
        }
      }
    });
};