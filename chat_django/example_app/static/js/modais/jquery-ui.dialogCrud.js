/*
 * jQuery DialogCrud UI Widget 1.0
 * Copyright (c) 2012 Doug
 *
 * http://
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/

;(function($,window,undefined) {
  var pluginName = 'dialogCrud',
      defaults = {
          options : {
              id: '' || [],
              tipo: 'cad',
              model: ['', ''],
              form: ['', ''],
              infos: {},
              errors: {},
              validators: [],
              hide: { effect: 'fade' },
              show: { effect: 'fade' },
              beforeOpen: function(){},
              afterOpen: function(){},
              afterGet: function(){},
              afterSaved: function(){},
              ifError: null,
              close: function( event, ui ) { $(event.target).filter('*').val(''); $(this).dialog('destroy');  },
              width: 500,
              height: 350,
              resizable: false,
              dialogClass: null,
              disabled: true,
              open: function( e, u ){
                  $(e.target).find('#erro').hide();
                  $(e.target).find('button:last').hide();
              },
              buttons: { 
                  Salvar: function( e, u ){
                      var modal = this;
                      var id = pl.id;
                      $(e.currentTarget).button('disable');
                          
                      $(modal).contextmenu().parent().find('button:last').show('fade').focus();
                      pl._postData(function(){ $(modal).dialog('close'); });
                  },
                  
                  'Salvar e continuar':function(){ pl._postData(function(){}); },
                  
                  Cancelar: function( e, u ){ $(this).dialog('close'); },
              },
              custom_buttons: {},
              ajaxOptions:{
                  urlget: '/utils/ajax_get_data',
                  urlpost: '/utils/ajax_modal_crud/',
                  data: {},
                  beforeSend: function(){ 
                      $('.ui-dialog-crud').parent().find('.ui-dialog-buttonpane button').button('disable');
                      $('.ui-dialog-crud').hide();
                      $('#modal_loading').show();
                  },
                  error : function(jXHR, textStatus, errorThrown) { exibirErro(null, ''+jXHR+' '+textStatus+' '+errorThrown); },
                  complete: function(){ 
                      $('.ui-dialog-crud').parent().find('.ui-dialog-buttonpane button').button('enable');
                      $('#modal_loading').hide();
                      $('.ui-dialog-crud').show();
                  },  
            },
       }
   }
    
  function Plugin(element, options) {
    this.container = $(element).hide();
    var ajaxOptionsDefault = defaults.options.ajaxOptions;
    this.options = $.extend(defaults.options, options);
    this.options.ajaxOptions = $.extend(ajaxOptionsDefault, this.options.ajaxOptions);
    this.init();
  }

  Plugin.prototype.init = function() {
      pl = this;
      var o = this.options;
      if ( (o.tipo.toLocaleLowerCase() == 'cad' && o.continuar == true) || (o.tipo.toLocaleLowerCase() == 'edit' && $.isArray( o.id ) && o.id.length > 1) ){
          var buttons = o.buttons;
          o.buttons = $.extend( buttons, o.custom_buttons );
      };
      
      this._create();
      if ( o.tipo.toLocaleLowerCase() == 'edit' && o.id ){ this._getData(); };
      if ( $.isArray( o.infos ) && o.infos.length > 0 ){ this._updateMsgs( 'info', o.infos ); };
      if ( $.isArray( o.errors ) && o.errors.length > 0 ){ this._updateMsgs( 'error', o.errors ); };
      if ( !$.isArray( o.id ) || ($.isArray( o.id ) && o.id.length == 1) ){ $(this.container).parent().find('.ui-dialog-buttonpane button:eq(1)').hide(); };
      
  };

  Plugin.prototype._createDivError = function() { 
      errors = $( '<div>' ) // div
                 .attr({ id: 'div_error' })
                 .css({ padding: '2px .7em', 'font-size': '11px', 'display': 'none', margin: '7px auto' })
                 .addClass( 'ui-state-error ui-corner-all' )
                 .append( $( '<ul id="errors">' ) // ul
                          .append( $('<li>') // li
                                   .html('Foram encontrados alguns erros: '.bold())
                                   .css({ 'float': 'left', 'clear': 'both', 'width': '100%', 'text-align':'left' })
                                   .append( $('<span>') // span
                                            .addClass( 'ui-icon ui-icon-alert' )
                                            .css({ 'float':'left', 'margin-right':'.3em' }) )));
      return errors;                                       
  };
  
  Plugin.prototype._createDivInfo = function() { 
      infos = $( '<div>' ) // div
              .attr({ id: 'div_info' })
              .css({ padding: '2px .7em', 'display': 'none', margin: '7px auto' })
              .append( $( '<ul id="infos">' ) // ul
               .css({ 'float': 'left', 'width': '100%', 'text-align':'left', 'margin-bottom': '12px', 'margin-top': '12px' })
                       .append( $('<li>') // li
                                .css({ 'float': 'left', 'clear': 'both', 'width': '100%', 'text-align':'left' })
                                .append( $('<span>') // span
                                         .css({ 'float':'left', 'margin-right':'.3em' }) )));
      return infos;                                       
  };
  
  Plugin.prototype._updateID = function(){
      if ( $.isArray( this.options.id ) && this.options.id.length > 0 ){
          var ids = this.options.id;
          this.id_old = this.options.id[0];
          var value = ids.reverse().pop();
          this.options.id = ids.reverse();
          return value;    
      };
  };
  
  Plugin.prototype._updateMsgs = function( type, obj ){
      if ( type && !$.isEmptyObject(obj) ){
          var msgs = $('<ul>');
          $.each(obj, function(k,v){ msgs.append( $('<li>').html(''+k+': '+v) ); }); 
          
          this.container.closest('.ui-dialog').find('#div_'+type+' ul li:first ~ *').remove();
          this.container.closest('.ui-dialog').find('#div_'+type+' ul').append( msgs.find('li') );
          this.container.closest('.ui-dialog').find('#div_'+type).show('fade');
      }else{
          this.container.closest('.ui-dialog').find('#div_'+type+' ul li:first ~ *').remove();
          this.container.closest('.ui-dialog').find('#div_'+type).hide();
      };
  };
  
  Plugin.prototype._loading = function(){
      var pl = this,
          container = pl.container;
      container.parent().find('.ui-dialog-buttonpane button').button('disable');
      container.hide();
      container.parent().find('#modal_loading').show();
  };
  
  Plugin.prototype._cancel_loading = function(){
      var pl = this,
          container = pl.container;
      container.parent().find('.ui-dialog-buttonpane button').button('enable');
      container.parent().find('#modal_loading').hide();
      container.show();
  };
  
  Plugin.prototype._create = function() {
      var options = this.options;
        if ( $.isArray(options.id) ){ id = options.id[0]; } else { id = options.id; };
        dialog = $(this.container)
                 .attr({ style:'display:none' })
                 .addClass('ui-dialog-crud');
        
        infos = this._createDivInfo();
        errors = this._createDivError();            
      
      if ( $(window.document).find(id).length == 0 ) {
          if ( this.options.title ){ options.title = options.title.replace('#', ' '+id) };
          dialog.dialog( options ).before( errors ).before( infos );
          
          if ( dialog.find('#modal_dialog').length == 0 ){
              dialog.before( $('<div>')
                             .attr('id', 'modal_loading')
                             .css({ display:'none', clear: 'both', margin: '10px auto' })
                             .append("<img src='/static/images/carregando.gif' >").hide() );
          };
                  
          this.id = id;
          this.initialized = true;
          if ( $.isFunction( options.afterOpen ) ){ options.afterOpen(this, this.container) };
      };  
  }; 
  
  Plugin.prototype._generateData = function(){
      var o = this.options;
      if ( this.initialized ){ 
          if ( $.isArray(o.id) ){ 
              var id = o.id[0]; 
          }else{ 
              var id = o.id; 
          };
          this.id = id; 
      };
      o.title = o.title.replace( this.id_old, id );
      $(this.container).closest('.ui-dialog').find('.ui-dialog-title').text( o.title );
      var container = $(this.container);
      var fields = 'input;select;textarea'.split(';');
      var selector = fields.join('[name], ') + '[name]';
      var data = container.find(selector).serialize();
      var crud = $.param({ id: id, model: o.model, tipo: o.tipo, form: o.form });
      o.ajaxOptions['data'] = data + '&' + crud;
      return o.ajaxOptions['data']
  };
  
  
  Plugin.prototype._exec_validators = function (){
      var pl = this,
          container = $(this.container);
          o = this.options,
          is_valid = true;
      if ( o.validators ){
          $( o.validators ).each(function(){
              if ( $.isFunction(this) ){ 
                  if ( is_valid && this(pl) == false ){
                      is_valid = false;
                  }; 
              }; 
          });   
      };
      return is_valid;      
  };
  
  
  Plugin.prototype._getData = function( include ) {
        this._generateData();
        var obj = this;
        var o = obj.options;
        var include = include || null;
        var container = $(this.container);
        var options = $.extend({ url: this.options.ajaxOptions.urlget,
                                 dataType:'json', 
                                 type:'get',
                                 success: function( retorno ){
                                     if ( retorno ){ $.each(retorno, function(k, v){ container.find('#'+k).val(v); }); };
                                     if ( include ){ include() };
                                     if ( $.isFunction( o.afterGet ) ){ o.afterGet(obj, obj.container, retorno) };
                                 }, }, this.options.ajaxOptions);
                                 
        if ( !this.id ){ $(this.container).dialog('close') }else{ $.ajax(options); };                         
    };
    
    
    Plugin.prototype._postData = function( include ){
        var pl = this;
        pl._generateData();
        include = include || null;
        var container = $(this.container);
        var o = this.options;
        var iferror = o.ifError;
        var options = $.extend({ url: o.ajaxOptions.urlpost,
                                 dataType:'json', 
                                 type:'post',
                                 success: function( retorno ){
                                     if ( $.isArray( o.infos ) && o.infos.length > 0 ){ pl._updateMsgs( 'info', o.infos ); };
                                     if ( retorno ){
                                         if ( retorno.status == 'bad' ){ 
                                             if ( iferror && $.isFunction(iferror) ){
                                                iferror(container, pl, retorno);    
                                             }else{
                                                pl._updateMsgs('error', retorno.errors);
                                             }; 
                                         
                                         }else{
                                             pl._updateMsgs('error', {}); 
                                             if ( $('#div_error ul li').length < 2 ){
                                                $(container).filter('*').val('');
                                                pl._updateID();
                                                pl._getData();
                                                if ( include && $.isFunction(include) ){ include(); };
                                                if ( o.afterSaved && $.isFunction(o.afterSaved) ){ o.afterSaved(this.container, o, retorno); };
                                            }; 
                                         };
                                     };
                                     
                                 }, }, o.ajaxOptions);
                                 
        var is_valid = pl._exec_validators();                         
        if ( is_valid ){
            $.ajax(options);    
        }else{
            $('.ui-dialog-crud').parent().find('.ui-dialog-buttonpane button').button('enable');
            return false;
        };
    };
  
  // Prevent against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
    });
  }

}(jQuery, window));
