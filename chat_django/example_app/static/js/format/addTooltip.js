/* Adiciona classes de tooltip aos elementos conforme as classes existentes:
 * m-error: traz tooltip de erro - vermelho
 * m-info: traz tooltip informativo - azul
 * m-warning: traz tooltip de atenção - amarelo
 * m-help: tra tooltip de ajuda - verde
 * 
 * Para aplicar - Ex com m-error, para os demais substituir a classe. Para tooltip sem formatação deixar sem classe
 * <elmento html title="Texto de Conteúdo" class="m-error">
 * 
 * Adicionar também o arquivo cssTooltip.css - para formatação
 * 
 * Utiliza a biblioteca jquery-ui
 * 
 * Para mais informações:
 * http://api.jqueryui.com/tooltip/
 */

$(document).ready(function (){
    
    $( ".m-error" ).tooltip({ tooltipClass: "tooltip-custom-themes tooltip-error" , track: true});
    $( ".m-info" ).tooltip({ tooltipClass: "tooltip-custom-themes tooltip-info" , track: true});
    $( ".m-warning" ).tooltip({ tooltipClass: "tooltip-custom-themes tooltip-warning" , track: true});
    $( ".m-help" ).tooltip({ tooltipClass: "tooltip-custom-themes tooltip-help", track:true});
    $(document).tooltip({
        track: true
    })
           
});

