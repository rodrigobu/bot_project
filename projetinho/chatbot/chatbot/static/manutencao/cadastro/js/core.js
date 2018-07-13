$(function(){
    $('#colaboradores').djflexgrid({
        url: '{% url "avaliacao:cadastro.flexgrid" %}',
        filter_form: '#filter_form form', completeLoad: function () {
        $('[title]').tooltip();
    } });

    $('#bt_inserir_avaliacao').click(function(){
         var dialog = $('.dialog-inserir-avaliacao').clone(false);
         dialog.dialog({
             ace_theme: true,
             ace_title_icon_right: 'fa fa-pencil',
             buttons: {
                 c: {
                     'class': 'btn btn-xs',
                     text: 'Cancelar',
                     click: function(){
                         $(this).dialog('close');
                     }
                 },
                 i: {
                     'class': 'btn btn-xs btn-success pull-right',
                     text: 'Inserir',
                     click: function(){
                         $(this).find('form').submit();
                     }
                 }
             },
             close: function(){
                 $(this).dialog('destroy');
             },
             hide: 'fade',
             modal: true,
             resizable: false,
             open: function(){
                 dialog.find('#id_colaborador').multiselect({
                     numberDisplayed: 1,
                     enableFiltering: true,
                     enableCaseInsensitiveFiltering: true,
                     checkboxName: 'colaborador',
                     buttonClass: 'btn btn-grey btn-sm col-xs-12',
                     filterPlaceholder: 'Filtrar por nome',
                     nSelectedText: 'Selecionados',
                     nonSelectedText: 'Selecione um ou mais colaboradores',
                     includeSelectAllOption: true,
                     includeSelectAllIfMoreThan: 2,
                     selectAllText: 'Marque / Desmarque todos'
                 });
                 var form = dialog.find('form');
                 form.find('#id_colaborador, [name=perspectivas]').change(function(){
                     clean_required(this); });
                 form.submit(function(){
                     var colaboradores = form.find('#id_colaborador'),
                         perspectivas  = form.find('[name=perspectivas]');
                     clean_required(perspectivas);
                     clean_required(colaboradores);
                     var msg_confirm = 'Você realmente deseja inserir ?';
                     if (form.find('.error').length == 0) {
                         $.dialogs.confirm(msg_confirm, function () { // callback yes
                             $.post('{% url "avaliacao:inserir" %}', form.serialize(), function(response){
                                 if (!response.success){
                                     if ('questionario' in response.errors){
                                         var mensagem = response.errors['questionario'];
                                         delete response.errors['questionario'];
                                         confirm_questionario(
                                                 'Escolha o tipo de questionário',
                                                 mensagem, function(){ // callback ncco
                                                     var field_questionario = form.find('[name=questionario]');
                                                     field_questionario.val('0');
                                                     form.submit();
                                                 }, function(){ // callback nccf
                                                     var field_questionario = form.find('[name=questionario]');
                                                     field_questionario.val('f');
                                                     form.submit();
                                                 });
                                     };
                                 }else{ // SUCCESS
                                     dialog.dialog('close');
                                     $.dialogs.success('Inserção concluída com sucesso.', function(){
                                         location.href = '{% url "avaliacao:edicao" 0 %}'
                                                 .replace('/0/', '/' + form.find('#id_colaborador').val() + '/');
                                     });
                                 };
                             });
                         }, function(){ form.find('[name=questionario]').val(null); }); // callback no;
                     };
                     return false;
                 });
                 form.bind('keypress', function(e) {
                     if(e.keyCode == $.ui.keyCode.ENTER){
                         form.submit();
                     };
                 });
             },
             show: 'fade',
             title: 'Inserir Avaliação',
             width: '60%'
         });
    });
});
