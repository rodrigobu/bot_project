/**
 * @author AncoraRh Informática.
 *
 */


function to_date(date){ 
    /* Esta função converte uma string por ex.: '18/08/2013'
     * em um obj Date(). */
    
    if ( date && date.length == 10){
       return new Date(date.split('/').reverse().join('/'));
        }else{
            return null;
        };  
    };
    
function setDay(date, days){ 
    /* Esta função recebe como param um obj Date() e dias sendo 
     * inteiros. Ela add dias em um obj Date() */
    return new Date(date.getTime()+(days*(1000 * 60 * 60 * 24)));
};
   
function format_date(date, format){
    /* Esta função recebe como param um obj Date() e a sua formatação
     * sendo por ex.: 'dd/mm/yyyy' e retorna uma string de acordo. */
    
    var date = date || new Date(),
        string_datetime = date.toISOString(),
        string_date = string_datetime.split('T')[0],
        string_time = string_datetime.split('T')[1],
        list_date = string_date.split('-'),
        dict_date = { yyyy: list_date[0], mm: list_date[1], dd: list_date[2] };
    if ( format ){
        format = format.replace('dd', dict_date.dd );
        format = format.replace('mm', dict_date.mm );
        format = format.replace('yyyy', dict_date.yyyy );
        return format;
    }else{
        return string_date;     
    };     
};

function jqobj_to_date(selector){
    /* Esta função retorna um obj Date() do javascript
     * ref ao obj $('selector') msm se o campo estiver desabilitado.
     * A conversão só deve acontece com datas dd/mm/yyyy ou ddmmyyyy.*/
    
    if ( selector ){
        var obj   = $(selector),
            valor = obj.val();
        if ( obj.length == 1 ){
            if (valor != undefined && 
              ((valor.search('/') > 0) && (valor.split('/').length == 3)) &&
               ($.isNumeric(valor.split('/').join('')))){
                return to_date(valor);
            }else if (valor != undefined &&
                            valor.length >= 8 && $.isNumeric(valor)){
                var date = [valor.slice(0, 2),
                            valor.slice(2, 4),
                            valor.slice(4),].join('/');
                return to_date(date);                      
            }else{
                return null;
            };
        };
    };
};
