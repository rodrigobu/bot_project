$.re = {
    compile : function(regex, value) {
        var regex = new RegExp(regex);
        return regex.test(value);
    },
};

$.each({
    'cep' : /^(([0-9]{2}[.][0-9]{3})|([0-9]{5}))-[0-9]{3}$/,
    'cpf' : /^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/,
    'cnpj' : '(^[0-9]{2,3}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$)',
    'data_ddmmyyyy' : /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/\d{4}$/,
    'data_mmddyyyy' : '^(((((((0?[13578])|(1[02]))[.-/]?((0?[1-9])|([12]d)|(3[01])))|(((0?[469])|(11))[.-/]?((0?[1-9])|([12]d)|(30)))|((0?2)[.-/]?((0?[1-9])|(1d)|(2[0-8]))))[.-/]?(((19)|(20))?([d][d]))))|((0?2)[.-/]?(29)[.-/]?(((19)|(20))?(([02468][048])|([13579][26])))))$',
    'dominio_http' : /(.*?)[^w{3}\.]([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/igm,
    'dominio_n_www' : /[^w{3}\.]([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/igm,
    'dominio_alternativo' : /(.*?)\.(com|net|org|info|coop|int|com\.au|co\.uk|org\.uk|ac\.uk|)/igm,
    'email' : /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/g,
    'hex_color' : /(#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/gm,
    'imagem_jpg_gif_png' : /([^\s]+(?=\.(jpg|jpeg|gif|png))\.\2)$/,
    'ip' : '^(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:[.](?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}$',
    'telefone' : '^(?:(?([0-9]{2}))?[-. ]?)?([0-9]{4,5})[-. ]?([0-9]{4})$',
    'rgb' : /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
    'sub_dominio' : /(http:\/\/|https:\/\/)?(www\.|dev\.)?(int\.|stage\.)?(travel\.)?(.*)+?/igm,
    'tag_js' : /<script.+?src=\"(.+?\.js(?:\?v=\d)*).+?script>/ig,
    'tag_css' : /<link.+?href=\"(.+?\.css(?:\?v=\d)*).+?>/ig,
    'tag_imagem' : /<img.+?src=\"(.*?)\".+?>/ig,
    'tag_html' : '/^<([a-z]+)([^<]+)*(?:>(.*)<\/\>|\s+\/>)$/',
    'url' : /^((http)|(https)|(ftp)):\/\/(.*?)[^w{3}\.]([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/igm,
    'url_com_query' : /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-=?]*)*\/?/
}, function(name, regex) {
    $.re[name] = function(value) {
        return $.re.compile(regex, value);
    };
});

        /* TRATA ERROS DE AJAX */
/*-------------------------------------//------------------------------------*/
function tratar_erro_de_ajax(xhr, text, error) {
    if (xhr.status == 0){
        exibirInformacao('Processo cancelado', 'O processo foi cancelado.'); 
    }else if (xhr.status == 404){
        exibirErro('Erro', 'Link indisponível ou inexistente. Tente novamente.');
    }else if (xhr.status == 500){
        exibirErro('Erro', 'O servidor encontrou um erro e não pode completar a solicitação. Tente novamente.');    
    }else if (xhr.status == 502 || xhr.status == 503){
        exibirErro('Erro', 'O servidor está indisponível no momento (por sobrecarga ou inatividade para manutenção). Tente novamente.');    
    }else{
        exibirErro('Erro', 'Falha de conexão. Tente novamente.');
    };    
};

        /* MENSAGENS */
/*-------------------------------------//------------------------------------*/
$(document).ready(function() {
    var classes_e_mensagens = {
        'vObrigatorio'     : 'Este campo é de preenchimento obrigatório',
        'vCPF'             : 'Por favor, informe um CPF válido no formato 999.999.999-99',
        'vData'            : 'Por favor, informe uma data válida no formato dd/mm/aaaa',
        'vMes'             : 'Por favor, informe um mês válido no formato mm/aaaa',
        'vHora'            : 'Por favor, informe uma hora válida, de 00:00 até 23:59',
        'vTel'             : 'Por favor, informe um telefone válido no formato 99999999 ou 999999999',
        'vCNPJ'            : 'Por favor, informe um CNPJ válido no formato 99.999.999/9999-99',
        'vCEP'             : 'Por favor, informe um CEP válido no formato 99999-999',
        'vDDD'             : 'Por favor, informe um DDD válido no formato 999 ou 99',
        'vEmail'           : 'Por favor, informe um e-mail válido no formato a@a.aaa',
        'vDecimal'         : 'Por favor, informe um número decimal no formato 999.999,99',
        'vDecimalNotMoney' : 'Por favor, informe um número decimal no formato 999,99',
        'vUrl'             : 'Por favor, informe uma url válida.<br/><br/>Ex.: http://www.google.com.br',
    };
      
    validarCampoPreenchidoCorretamente = function(campo, classe) {
        var valor = campo.val();
        
        /* CPF*/
/*------------------------------------//------------------------------------*/
        if (classe == 'vCPF') {
            if(!$.re.cpf(valor)){
                return false;
            };

        /* URL*/
/*------------------------------------//------------------------------------*/        
        } else if (classe == 'vUrl') {
            if(!$.re.url(valor)){
                return false;
            };            

        /* DATA*/
/*------------------------------------//------------------------------------*/        
        } else if (classe == 'vData') {
            if(!$.re.data_ddmmyyyy(valor)){
                return false;
            };
            
        /* MES*/
/*-------------------------------------//------------------------------------*/
        } else if (classe == 'vMes') {
            valor = valor.replace(/ /g, '').replace(/\//g, '');
            
            if (!/^(0[1-9]|1[012])(\d{4})$/.test(valor)){
                return false;
            };
            
        /* HORA*/
/*------------------------------------//------------------------------------*/    
        } else if (classe == 'vHora') {
            valor = valor.replace(/ /g, '').replace(/:/g, '');

            if (valor.length != 4){
                return false;
            };
            
            var hora   = valor.substring(0, 2),
                minuto = valor.substring(2, 4),
                data = new Date(2011, 0, 1, hora, minuto, 0);

            if (data.getHours() != hora || data.getMinutes() != minuto){
                return false;
            };
       
        /* TEL*/
/*------------------------------------//------------------------------------*/            
        } else if (classe == 'vTel') {
            valor = valor.replace(/ /g, '');

            if (valor.length != 8 && valor.length != 9){
                return false;
            };
            
        /* CNPJ*/
/*------------------------------------//------------------------------------*/            
        } else if (classe == 'vCNPJ') {
            if (!$.re.cnpj(valor)){
                return false;
            };
            
        /* CEP*/
/*-------------------------------------//------------------------------------*/                               
        } else if (classe == 'vCEP') {
            if (!$.re.cep(valor)){
                return false;
            };     
            
        /* DDD*/
/*-------------------------------------//------------------------------------*/            
        } else if (classe == 'vDDD') {
            valor = valor.replace(/ /g, '');

            if (!($.inArray(valor.length, [2, 3]) >= 0 )){
                return false;
            };
            
        /* EMAIL*/
/*-------------------------------------//------------------------------------*/                
        } else if (classe == 'vEmail') {
            if (!$.re.email(valor)){
                return false;
            };
            
        /* DECIMAL*/
/*-------------------------------------//------------------------------------*/                
        } else if (classe == 'vDecimal') {
            var novo_valor = valor.replace('R$', '').replace('.', '').replace(',', '.');

            if (novo_valor != valor){
                valor = novo_valor;
            };
            var x = /^(([0-9]+(\.[0-9]{1,2}))|([0-9]+))$/;

            if (!valor.match(x)){
                return false;
            };
            
        /* DECIMAL NÃO DINHEIRO*/
/*-------------------------------------//------------------------------------*/           
        } else if (classe == 'vDecimalNotMoney') {
            var novo_valor = valor.replace('.', '').replace(',', '.');

            if (novo_valor != valor){
                valor = novo_valor;
            };
            
            var x = /^(([0-9]+(\.[0-9]{1,2}))|([0-9]+))$/;

            if (!valor.match(x)){
                return false;
            };
            
        /* NUMEROS*/
/*-------------------------------------//------------------------------------*/              
        } else if (classe == 'vNumero' || classe == 'vNumero2Digitos' || classe == 'vNumero3Digitos' || classe == 'vNumero4Digitos' || classe == 'vNumero8Digitos' || classe == 'vNumero10Digitos') {
            var x = /[0-9]*/;
            if (!valor.match(x)) {
                return false;
            };
        };
        return true;
    };
    
        /* CAMPOS OBRIGATÓRIOS */
/*-------------------------------------//------------------------------------*/
    validarCampoObrigatorio = function(campo) {
        /* Necessário pegar o primeiro elemento pois o elemento 
         * do jQuery é como se fosse uma lista de elementos */
        var valor = '',
            tipo = campo[0].tagName;
        
        if        (tipo == 'INPUT'){
            valor = campo.val();
        } else if (tipo == 'SELECT'){
            valor = campo.val();
        } else if (tipo == 'TEXTAREA') {
            valor = campo.val();
        };
        return valor ? true : false;
    };

        /* FUNÇÃO QUE EXEC VALIDAÇÃO DO CAMPO */
/*-------------------------------------//------------------------------------*/
    validarCampo = function(eventObject) {
        if (eventObject.currentTarget.id && $(eventObject.currentTarget).hasClass('ui-multiselect')) {
            var id = eventObject.currentTarget.id.split('multiselect_')[1],
                campo = $('#' + id);
        } else {
            var campo = $(eventObject.currentTarget);
        };
        
        if (campo.data('qtip')){
            campo.qtip('destroy');
            campo.removeData('qtip');
             try {
                var data_hasqtip = campo.attr('data-hasqtip');
                campo.qtip('destroy');
                $('#qtip-'+data_hasqtip).remove();
            } catch (erro){
                console.warn('Não foi possível excluir o qtip do campo "'+campo.attr('name') || campo.attr('id')+ '" :' + erro);
            };    
            campo.closest('p').removeClass('vErro');
        };

        var valor = campo.val(),
            obrigatorio = false,
            classe = '',
            campo_classes = [''],
            valido_preenchido = true,
            valido_preenchido_corretamente = true;
        
        var attr_class = campo.attr('class');
        
        if (attr_class){
            var campo_classes = campo.attr('class').split(' ');    
        };     

        /* Aqui testamos apenas se o campo está preenchido ou vazio */
        $.each(campo_classes, function(index, item) {
            if (item == 'vObrigatorio') {
                obrigatorio = true;
                if ($(campo).is(':enabled')) {
                    valido_preenchido = validarCampoObrigatorio(campo);
                };
            };
        });

        /* Aqui testamos se o campo está preenchido corretamente */
        $.each(campo_classes, function(index, item) {
            if ( item in classes_e_mascaras || item in classes_sem_mascaras) {
                classe = item;
                if (item == 'vData'){
                    valor = valor.replace(/ /g, '').replace(/\//g, '');
                };    
                valido_preenchido_corretamente = validarCampoPreenchidoCorretamente(campo, item);
            };
        });

        var valido = false;
        if (obrigatorio && valido_preenchido && valido_preenchido_corretamente){
            valido = true;
        } else if (!obrigatorio && valor == ''){
            valido = true;
        } else if (!obrigatorio && valor != '' && valido_preenchido_corretamente){
            valido = true;
        };
         
        var s = campo.parent();
        campo.parent().removeClass('vErro');
         try {
            var data_hasqtip = campo.parent().find('button.ui-multiselect').attr('data-hasqtip');
            campo.parent().find('button.ui-multiselect').qtip('destroy');
            $('#qtip-'+data_hasqtip).remove();
        } catch (erro){
            console.warn('Não foi possível excluir o qtip do campo "'+campo.attr('name') || campo.attr('id')+ '" :' + erro);
        };    

        if (!valido) {
            var erros = '';
            campo.parent().addClass('vErro');
            if (obrigatorio){
                erros += classes_e_mensagens['vObrigatorio'];
            };    
            if (!valido_preenchido_corretamente) {
                if (erros != ''){
                    erros += '<br /><br />';
                };    
                erros += classes_e_mensagens[classe];
            };
            
            if (!campo.data('qtip')){
                campo.parent().find('button.ui-multiselect').qtip({
                    content : erros,
                    position : {
                        my : 'top center',
                        at : 'bottom center',
                        target : $(campo.parent().find('.ui-multiselect')),
                    },
                    style : 'qtip-red qtip-shadow',
                });
                campo.qtip({
                    content : erros,
                    position : {
                        my : 'top center',
                        at : 'bottom center',
                        target : campo,
                    },
                    style : 'qtip-red qtip-shadow',
                });
            };
        }else {
            try {
                var data_hasqtip = campo.attr('data-hasqtip');
                campo.qtip('destroy');
                $('#qtip-'+data_hasqtip).remove();
            } catch (erro){
                console.warn('Não foi possível excluir o qtip do campo "'+campo.attr('name') || campo.attr('id')+ '" :' + erro);
            };    
        };
        return valido;
    };

        /* VALIDANDO GRUPO */
/*-------------------------------------//------------------------------------*/
    validarGrupo = function(eventObject) {
        var campo = $(eventObject.currentTarget),
            group = $(campo).parents('.vGroup'),
            selected = false,
            valido = true;

        group.removeClass('vErroGroup');
        group.find('input').each(function() {
            if ($(this).is(':checked')){
                selected = true;
            };    
        });

        if (selected == false) {
            valido = false;
            group.addClass('vErroGroup');
        };
        return valido;
    };
    /*  Clique nos botões Salvar das dialogs - Chamar essa função no clique do botão Salvar
     de cada dialog que precise de validação antes de ser postada.
     Exemplo:    (...)
     'Salvar': function() {
     validarDialog(this, funcaoSucesso);
     }
     (...)
     PARÂMETROS
     dialog: a div que será validada
     callbackSucesso: função que será executada (sem receber nenhum parâmetro) se o form passar na validação
     funcaoOutrasValidacoes: função que fará mais validações (como checar se uma data está antes de outra). Esta função
     será executada depois da validação padrão de formulário, e apenas se o formulário estiver válido.
     Se for passada, a função passada pelo parâmetro callbackSucesso só será executada
     se a função passada pelo parâmetro funcaoOutrasValidacoes retornar true.
     */
    validarDialog = function(dialog, callbackSucesso, funcaoOutrasValidacoes) {
        $(dialog).find('input:visible, select:visible, textarea:visible').blur();
        if ($(dialog).find('.vErro').length != 0) {
            alert('Existem inconsistências no preenchimento do formulário.' +
                  'Verifique os campos marcados em vermelho para que possa prosseguir.');
                  
            $(dialog).find('.vErro :visible:enabled:first').focus();
        } else {
            /* Corrigir decimais */
            $(dialog).find('.auto').each(function(index, item) {
                var c = $(item);
                var v = c.val();
                if (v.search(/R\$/) > -1){
                    v = v.replace('R$', '').replace('.', '').replace(',', '.');
                };    
                if (v == 0.00){
                    v = '';
                };    
                c.val(v);
            });
            $(dialog).find('.autoNotMoney').each(function(index, item) {
                var c = $(item);
                var v = c.val();
                v = v.replace('.', '').replace(',', '.');
                if (v == 0.00){
                    v = '';
                };    
                c.val(v);
            });
            if ( typeof (funcaoOutrasValidacoes) == 'function') {
                if (funcaoOutrasValidacoes() == true){
                    callbackSucesso();
                };    
            } else {
                callbackSucesso();
            };
        };
    };

        /* INICIALIZANDO OS CAMPOS COM AS VALIDAÇÕES */
/*-------------------------------------//------------------------------------*/    

	
	init_validacao = function(seletor) {
		$(seletor).find('input[class]:enabled, ' + 'select[class]:enabled, ' + 'textarea[class]:enabled, ' + 'button[id^=multiselect_]').on({

			blur : validarCampo,

			mouseleave : function() {
				var element = $(this), paragraf = element.closest('p');

				if (element.data('qtip') && !paragraf.hasClass('vErro')) {
					element.qtip('destroy');
				};
			},
		});
	};


   $(function() {
        $('.vForm input[class]:enabled, '    +
          '.vForm select[class]:enabled, '   + 
          '.vForm textarea[class]:enabled, ' +
          '.vForm button[id^=multiselect_]').on({
        
              blur: validarCampo,
              
              mouseleave: function(){
                  var element  = $(this),
                      paragraf = element.closest('p');
              
                  if (element.data('qtip') && !paragraf.hasClass('vErro')){
                      element.qtip('destroy');    
                  };    
              },
        });      
    });

        /* VALIDANDO O FORMULÁRIO INTEIRO */
/*-------------------------------------//------------------------------------*/
    validarForm = function(elemento) {
        $('form.vForm .erros_validacao_aba').remove();
        /* msg de erro das abas */
        $('.msg_remover_na_troca_de_abas').remove();
        /* msg de salvo */
        if ($(elemento).find('.vSaved').is(':disabled')){/* Internet Explorer stuff... */
            return;
        };    

        $(elemento).find('input, select, textarea').filter(':not(.cep):not(input[type=hidden]):not(label.vData input[type=hidden][name^=initial])').filter(':not(.nao_validar_quando_escondido:not(:visible))').blur();
        $(elemento).find('select:not(.estado):not(.no_change_on_submit):not(.no_change_on_trocar_aba)').filter(':not(input[type=hidden])').change();

        if ($(elemento).find('.vErro').length != 0) {
            $(elemento).find('.vErro :visible:enabled:first').focus();
            try {
                $('html,body').animate({
                    scrollTop : $(elemento).find('.vErro :visible:enabled:first').parent().offset().top - 20
                });
            } catch (error) {
                $('html,body').animate({
                    scrollTop : 0
                });
            };
            
            if ($('.abas').length > 0) {/* ERROS QUANDO TEM ABAS */
                var campos_erros = ['Os dados não foram salvos, pois há erros no preenchimento dos seguintes campos:', ''];

                $.each($('#dados_gerais').find('label.vErro'), function(i, lbl) {
                    var txt_campo = $(lbl).find('span:first').text().replace(':', '');
                    campos_erros.push(txt_campo);
                });

                $.each($('.aba'), function(i_aba, div_aba) {
                    var id_menu_aba = 'ABA__' + $(div_aba).attr('id');
                    var txt_menu_aba = $('#' + id_menu_aba).text();
                    $.each($(div_aba).find('label.vErro'), function(i, lbl) {
                        var txt_campo = $(lbl).find('span:first').text().replace(':', '');
                        campos_erros.push(txt_campo + ' [aba ' + txt_menu_aba + ']');
                    });
                });

                $('form.vForm').prepend('<p class="mensagem msg_erro erros_validacao_aba"></p>');
                $('form.vForm .erros_validacao_aba').html(campos_erros.join('<br/>'));
                try {
                    $('html,body').animate({
                        scrollTop : $('form.vForm .erros_validacao_aba').offset().top - 20
                    });
                } catch (error) {
                    $('html,body').animate({
                        scrollTop : 0
                    });
                };
            } else {
                $('#loading_overlay').remove();
            };    
            exibirErro('Formulário', 'Há erros de preenchimento no formulário.\n\n' +
                                     'Os campos estão destacados em vermelho para indicar os erros.\n\n' +
                                     'Passando o mouse sobre os campos você terá informações mais detalhadas sobre o ocorrido.');
            return false;
        };

        /* Valida os grupos de elementos,onde pelo menos 1 
         * elemento tem que ser selecionado */
        if ($(elemento).find('.vErroGroup').length != 0) {
            $(elemento).find('.vErroGroup :visible:enabled:first').focus();
            try {
                $('html,body').animate({
                    scrollTop : $(elemento).find('.vErroGroup :visible:enabled:first').parent().offset().top - 20
                });
            } catch (error) {
                $('html,body').animate({
                    scrollTop : 0
                });
            };

            var campos_erros = ['Os dados não foram salvos, pois é necessário selecionar pelo menos um item.', ''];
            if ($('.abas').length > 0) {/* ERROS QUANDO TEM ABAS */

                $.each($('.aba'), function(i_aba, div_aba) {
                    var id_menu_aba = '__' + $(div_aba).attr('id');
                    var txt_menu_aba = $('#' + id_menu_aba).text();
                    $.each($(div_aba).find('.vErroGroup'), function(i, lbl) {
                        var txt_campo = $(elemento).attr('title');
                        campos_erros.push(txt_campo + ' [aba ' + txt_menu_aba + ']');
                    });
                });
            };

            $('form.vForm').prepend("<p class='mensagem msg_erro erros_validacao_aba'></p>");
            $('form.vForm .erros_validacao_aba').html(campos_erros.join('<br/>'));
            try {
                $('html,body').animate({
                    scrollTop : $('form.vForm .erros_validacao_aba').offset().top - 20
                });
            } catch (error) {
                $('html,body').animate({
                    scrollTop : 0
                });
            };
            return false;
        };

        if ($('.vErro:visible').length == 0) {
            mostrarCarregando();
        };

        $(elemento).find('.auto').each(function(index, item) {
            var c = $(item),
                v = c.val();
                
            if (v.search(/R\$/) > -1){
                v = v.replace('R$', '').replace('.', '').replace(',', '.');
            };    
            if (v == 0.00){
                v = '';
            };    
            c.val(v);
        });

        $(elemento).find('.autoNotMoney').each(function(index, item) {
            var c = $(item),
                v = c.val();
                
            v = v.replace('.', '').replace(',', '.');
            if (v == 0.00){
                v = '';
            };    
            c.val(v);
        });
    };
    
    /* Submits dos forms */
    $('.vForm').bind('submit', function() {
        return validarForm(this);
    });
}); 