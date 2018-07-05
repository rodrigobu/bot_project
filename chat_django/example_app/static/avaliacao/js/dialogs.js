var confirm_questionario = function (title, message, callback_ncco, callback_nccf, callback_cancel) {
     bootbox.dialog({
         className: 'dialog-confirm',
         title: title,
         message: "<b class='ace-icon fa fa-question-circle blue'></b>" +
                 '<div class="text">' + message + '</div>',
         buttons: {
             ncco: {
                 label: 'Gerar como NCCo',
                 className: 'btn-inverse btn-sm',
                 callback: callback_ncco
             },
             nccf: {
                 label: 'Gerar como NCCf',
                 className: 'btn-primary btn-sm',
                 callback: callback_nccf
             },
             cancelar: {
                 label: 'Cancelar',
                 className: 'btn-warning btn-sm',
                 callback: callback_cancel
             }
         }
     });
 };
