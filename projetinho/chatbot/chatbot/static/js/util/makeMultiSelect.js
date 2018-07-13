$(document).ready(function () {
    criar_multiselect = function(){
        try{
            // Multiselect jquery, depende de jquery.multiselect.min.js e jquery.multiselect.filter.js
            $('.jquery_select_multiple').each(function(i, select_multi){
                /// largura menor quando estiver dentro de accordions
                var largura_min = $(select_multi).is('.conteudo_accordion *') ? 325 : 345;
 
                $(select_multi).multiselect({
                    height: 200, 
                    checkAllText: $(select_multi).attr('checkAllText') || "Marcar todos", 
                    uncheckAllText: $(select_multi).attr('uncheckAllText') || "Desmarcar",
                    noneSelectedText: $(select_multi).attr('noneSelectedText') || "Nenhuma opção",
                    minWidth: largura_min, 
                    selectedText: $(select_multi).attr('selectedText') || "# opções selecionadas de #"
                });
            });
            
            if ( $('.jquery_select_multiple.com_filtro').length>0 ){
                $('.jquery_select_multiple.com_filtro').multiselect().multiselectfilter({
                    label: 'Filtro:', placeholder: ''
                });
            }
        }
        catch (erro){
            /* arquivos do multiselect não importados */
            if ($('.jquery_select_multiple').length>0)
                alert('Arquivo "jquery.multiselect.min.js" e/ou "jquery.multiselect.filter.js" não importado.');
        };
        
        transformar_em_multiselect = function(o){
            /*
                Alguns exemplos de uso:
                    transformar_em_multiselect({slct:'id_do_select'}); // com filtro e com largura padrão
                    transformar_em_multiselect({slct:'id_do_select', com_filtro:false}); // sem filtro e com largura padrão
                    transformar_em_multiselect({slct:'id_do_select', dentro_de_accordion:true}); // com filtro e com largura reduzida (para usar dentro de accordions)
            */
            // Valores padrão para os parâmetros opcionais
            o.com_filtro = (typeof o.com_filtro == 'undefined') ? true : o.com_filtro;
            o.dentro_de_accordion = (typeof o.dentro_de_accordion == 'undefined') ? false : o.dentro_de_accordion;
            // largura menor quando estiver dentro de accordions 
            var largura_min = $(o.slct).is('.conteudo_accordion *') ? 325 : 345; 
            
            $(o.slct).multiselect({
                height: 200, 
                checkAllText: $(o.slct).attr('checkAllText') || "Marcar todos", 
                uncheckAllText: $(o.slct).attr('uncheckAllText') || "Desmarcar",
                noneSelectedText: $(o.slct).attr('noneSelectedText') || "Nenhuma opção",
                minWidth: largura_min, 
                selectedText: $(o.slct).attr('selectedText') || "# opções selecionadas de #"
            });
            
            if (o.com_filtro){
                $(o.slct)
                    .multiselect()
                    .multiselectfilter({  label: 'Filtro:', placeholder: '' });
            };
        };
    };

    criar_multiselect();
    
    $('.ui-multiselect').mouseleave(function(){ $('[id^=ui-tooltip-]').hide(); });
});
