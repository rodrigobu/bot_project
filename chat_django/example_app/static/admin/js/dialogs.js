'{% load i18n %}';

/*if(!('bootbox' in window)){
   $('head').append(
       "<link rel='stylesheet' type='text/css' href='/static/admin/css/bootbox.css'/>"
   );
   $('head').append(
       "<script src='/static/admin/js/bootbox.min.js'>"+"<"+"/script>"
   );
};*/
$.dialogs = {};
$.dialogs.warning = function (title, message, callback) {
   return bootbox.dialog({
        className: "dialog-alert",
        title: $.isFunction(message)
                ? ''
                : (message != undefined ? title || '' : ''),

        message: "<b class='ace-icon fa fa-exclamation-triangle'></b>" +
                 '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>',
        buttons: {
           close: {
               label: 'Fechar',
               className: "btn-warning btn-sm",
               callback: $.isFunction(message) ? message : callback || function(){}
           }
        }
   });
};
$.dialogs.error = function (title, message, callback) {
   return bootbox.dialog({
        className: "dialog-error",
        title: $.isFunction(message)
                ? ''
                : (message != undefined ? title || '' : ''),

        message: "<b class='ace-icon fa fa-times-circle'></b>" +
                 '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>',
        buttons: {
           close: {
               label: 'Fechar',
               className: "btn-danger btn-sm",
               callback: $.isFunction(message) ? message : callback || function(){}
           }
        }
   });
};

$.dialogs.success = function (title, message, callback) {
   return bootbox.dialog({
        className: "dialog-success",
        title: $.isFunction(message)
                ? ''
                : (message != undefined ? title || '' : ''),

        message: "<b class='ace-icon fa fa-check'></b>" +
                 '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>',
        buttons: {
           close: {
               label: 'Ok',
               className: "btn-success btn-sm",
               callback: $.isFunction(message) ? message : callback || function(){}
           }
        }
   });
};
$.dialogs.info = function (title, message) {
   return bootbox.dialog({
        className: "dialog-info",
        title: $.isFunction(message)
                ? ''
                : (message != undefined ? title || '' : ''),

        message: "<b class='ace-icon fa fa-info'></b>" +
                 '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>'
   });
};
$.dialogs.confirm = function (title, message, callback_yes, callback_no) {
   return bootbox.dialog({
        className: "dialog-confirm",
        title: $.isFunction(message)
                ? ''
                : (message != undefined ? title || '' : ''),

        message: "<b class='ace-icon fa fa-question-circle blue'></b>" +
                 '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>',
        buttons: {
           yes: {
               label: 'Sim',
               className: 'btn-primary btn-sm',
               callback: $.isFunction(message) ? message : callback_yes || function(){}
           },
          no: {
                label: 'Não',
                className: 'btn-inverse btn-sm',
                callback: $.isFunction(message) ? callback_yes : callback_no || function(){}
            },
        }
   });
};

		$.dialogs.confirmCustom = function (title, message, label_yes, label_no, callback_yes, callback_no, callback_cancelar) {
		   return bootbox.dialog({
		        className : "dialog-confirm",
		        title     : $.isFunction(message) ? '' : (message != undefined ? title || '' : ''),
		        message   : "<b class='ace-icon fa fa-question-circle blue'></b>" +
		                    '<div class="text">' + ($.isFunction(message) ? title || 'Default': message || title) + '</div>',
		        buttons   : {
               yes: {
                  label: label_yes,
                  className: 'btn-primary btn-sm',
                  callback: $.isFunction(message) ? message : callback_yes || function(){}
               },
		           no: {
		               label: label_no,
		               className: 'btn-inverse btn-sm',
		               callback: $.isFunction(message) ? callback_yes : callback_no || function(){}
		           },
		           cancel: {
		               label: 'Cancelar',
		               className: 'btn-warning btn-sm',
		               callback: $.isFunction(message) ? message : callback_cancelar || function(){}
		           }
		        }
		   });
		};
