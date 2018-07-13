validar_duplicidade = function(HASH, cancelar_msg ){

    var dic = { campo: HASH.campo, valor:HASH['valor'].join(), model:HASH.model, pacote:HASH.pacote };
    
    $.ajax({                
        url: "/validar/valida_duplicidade/",  
        type: 'get',
        async: false,
        data: dic,
        success:function(valor_final){
            
            var campo = HASH['campo'].split('_')[0];
            
            if (valor_final != 'vazio'){
                if ( !cancelar_msg ){
                    exibirAlerta('Registros Duplicados','O registro <b>'+lista_valor+'</b> já está cadastrado.' ); 
                };
                $('[name='+campo+']').parent('p').addClass('vErroDuplicidade');
                
                if ( $('p').has( 'input[name='+campo+']' ).children( 'img.vIMGDuplicidade' ).length == 0 ){
                    $('[name='+campo+']').parent('p').append('<img src="/static/images/validacao.png" class="vIMGDuplicidade" />');
                    $('p').has( 'input[name='+campo+']' ).find( 'img.vIMGDuplicidade' ).qtip({ content: 'Este registro já está cadastrado.', position: { adjust: { screen: true } }, style: 'ui-tooltip-youtube ui-tooltip-shadow ui-tooltip-rounded' });;    
                };
                
            }else{
                $('p.vErroDuplicidade').has( 'input[name='+campo+']' ).removeClass('vErroDuplicidade');
                $('p').has( 'input[name='+campo+']' ).children( 'img.vIMGDuplicidade' ).remove();
            } 
        },           
        error: function(){
                exibirErro('Erro', 'Houve uma falha na conexão. Tente Novamente');
                
            }             
        });  
};   