$('h4').each(function(){
    if(     $(this).text().indexOf("Novas Implementações") >= 0){
        $(this).html('<i class="fa fa-star yellow" aria-hidden="true"></i> ' + $(this).text());
    } else if ( $(this).text().indexOf("Correção Específica") >= 0){
        $(this).html('<i class="fa fa-pencil blue" aria-hidden="true"></i> ' + $(this).text());
    }
});
