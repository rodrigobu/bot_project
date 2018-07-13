var MEGACACHE = undefined;

var cache_checks = function() {
       var cache = $('#listagem').data();
       var trs   = $('#listagem > .table > tbody > tr');
       $.each(trs, function() {
            var obj = $(this);
            var id = obj.find('td:first').parent().attr("cache-id");
            cache[id] = {
                'check_comp' : obj.find('.comp input[type=checkbox]').is(':checked'),
                'check_tec'  : obj.find('.tec input[type=checkbox]').is(':checked'),
                'check_resp' : obj.find('.resp input[type=checkbox]').is(':checked'),
            };
       });
       return cache;
};

var update_checks = function() {
        var cache = $('#listagem').data();
        var trs   = $('#listagem > .table > tbody > tr');
        $.each(trs, function() {
            var obj = $(this);
            var id  = obj.find('td:first').text();
            if ( id in cache) {
                var data = cache[id];
                if (data.check_comp) {
                    obj.find('.comp input[type=checkbox]').check();
                } else {
                    obj.find('.comp input[type=checkbox]').uncheck();
                };
                if (data.check_tec) {
                    obj.find('.tec input[type=checkbox]').check();
                } else {
                    obj.find('.tec input[type=checkbox]').uncheck();
                };
                if (data.check_resp) {
                    obj.find('.resp input[type=checkbox]').check();
                } else {
                    obj.find('.resp input[type=checkbox]').uncheck();
                };
            };
        });
        return trs;
};

var exists_map_checked = function(mapeamento) {
        return _.filter(cache_checks(), function(item, index) {
            return item['check_' + mapeamento] == true;
        }).length > 0;
};

$(function() {
	
    $('#listagem').djflexgrid({
        list_url    : URL_LISTA_FUNCOES,
        filter_form : '.form-filtro',
        beforeLoad  : function() {
            cache_checks();
        },
        successLoad : function() {
            update_checks();
            $('.select-all:eq(0)').on('click', function(){
                $(this).checkUncheckAll(
                    $('.table tbody tr').find('td:eq(1)').find('[type=checkbox]')
                );
            });
            $('.select-all:eq(1)').on('click', function(){
                $(this).checkUncheckAll(
                    $('.table tbody tr').find('td:eq(2)').find('[type=checkbox]')
                );
            });
            $('.select-all:eq(2)').on('click', function(){
                $(this).checkUncheckAll(
                    $('.table tbody tr').find('td:eq(3)').find('[type=checkbox]')
                );
            });

            $('[title]').tooltip({
                placement: 'bottom'
            });
        }
    });
    
    $('.form-selecao [name=bt_salvar]').on('click', function() {
        var valid           = true,
            data            = new Object,
            cache           = cache_checks(),
            existe_map_comp = null,
            existe_map_tec  = null,
            existe_map_resp = null;

        var lista_existe = new Array;

        if ($('.perspectiva.comp').exists()){
            existe_map_comp = exists_map_checked('comp');
                lista_existe.push(!existe_map_comp);
        };
        if ($('.perspectiva.tec').exists()){
            existe_map_tec = exists_map_checked('tec');
                lista_existe.push(!existe_map_tec);
        };
        if ($('.perspectiva.resp').exists()){
            existe_map_resp = exists_map_checked('resp');
                lista_existe.push(!existe_map_resp);
        };
        
        if ( lista_existe.length >= 1 && _.all(lista_existe) ) {
            valid = false;
            var lista = new Array;

            if (existe_map_comp != null){
                    lista.push(!existe_map_comp);
            };
            if (existe_map_tec != null){
                    lista.push(!existe_map_tec);
            };
            if (existe_map_resp != null){
                    lista.push(!existe_map_resp);
            };
            
            if (lista.length > 1 && _.all(lista)) {
                $.dialogs.error('Perspectivas sem funções', 'Ao menos uma perspectiva deve ser associada a uma função.');
            } else {
                var lista = new Array;

                if (existe_map_comp != null){
                    lista.push(['Comportamental', !existe_map_comp]);
                };
                if (existe_map_tec != null){
                    lista.push(['Técnica', !existe_map_tec]);
                };
                if (existe_map_resp != null){
                    lista.push(['de Responsabilidade', !existe_map_resp]);
                };
                
                var filtro_vdd = _.filter(lista, function(item, index) {
                    return item[1] == true;
                });
                
                if (filtro_vdd.length != 0) {
                    var titulo = 'Perspectiva sem função';
                    var msg    = 'A perspectiva ' + filtro_vdd[0][0] + 
                                 ' não possui função mapeada. Marque pelo menos uma função para esta perspectiva.';
                    $.dialogs.error(titulo, msg);
                };/* else {
                    var titulo = 'Perspectivas sem funções';
                    var msg    = 'As perspectivas ' + filtro_vdd[0][0] + ' e ' + filtro_vdd[1][0] + 
                                 ' não possuem funções mapeadas. Marque pelo menos uma função para cada perspectiva.';
                };*/
                //$.dialogs.error(titulo, msg);
            };
        };
        
        if (valid) {
            console.log(cache);
            MEGACACHE = cache;
            var data = {};
            $.each(cache, function(value, key) {
                console.log(value); 
                console.log(key); 
                console.log([key['check_tec'], key['check_comp'], key['check_resp']]);
                data[value] = [key['check_tec'], key['check_comp'], key['check_resp']];
            });
            console.log(data);
            if (data) {
                $.ajax({
                    data : data,
                    type : 'post',
                    success : function(status) {
                        if (status) {
                            $.dialogs.success('Funções atualizadas com sucesso.', function(){
                                window.location.href = '/avaliacao';
                            });
                        };
                    }
                });
            };
        };
    });
}); 
