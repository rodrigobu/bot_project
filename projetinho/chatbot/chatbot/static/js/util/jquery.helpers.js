$.fn.extend({
     check: function(){
         $.each(this, function(index, item){
             var obj = $(item);
             if (obj.is(':checkbox')){
                 obj.prop('checked', true);
             }                     
         });
         return $(this);
     },
     uncheck: function(){
         $.each(this, function(index, item){
             var obj = $(item);
             if (obj.is(':checkbox')){
                 obj.removeAttr('checked');
             }                     
         });
         return $(this);
     },
    exists: function(extra){
        if (!extra){
            return $(this).length > 0;
        }else{
            return $(this).find(extra).length > 0;
        };
    },
    checkUncheckAll: function(delegate){
        if ($(this).is(':checked')){
            return $(delegate).check();
        }else{
            return $(delegate).uncheck();
        };
    },
    unaccent: function(){
        var accent = [
            ['á','a'],['à','a'],['ã','a'],['â','a'],['ä','a'],['é','e'],['è','e'],['ê','e'],['ë','e'],['ẽ','e'],['í','i'],['ì','i'],['î','i'],['ï','i'],['ó','o'],['ò','o'],['õ','o'],['ô','o'],['ö','o'],
            ['ú','u'],['ù','u'],['û','u'],['ü','u'],['ç','c'],['Á','A'],['À','A'],['Ã','A'],['Â','A'],['Ä','A'],
            ['É','E'],['È','E'],['Ê','E'],['Ë','E'],
            ['Í','I'],['Ì','I'],['Î','I'],['Ï','I'],['Ó','O'],
            ['Ò','O'],['Õ','O'],['Ö','O'],['Ô','O'],['Ú','U'],['Ù','U'],['Û','U'],['Ü','U'],['Ç','C']
        ];
        return $(_($(this)).map(function(obj, index){
            var value;
            if (obj instanceof $){
                value = obj.val();
            }else if (_.isElement(obj)){
                value = $(obj).val();
            }else if (_.isNumber(obj)){
                value = '' + obj;
            }else{
                value = obj;
            };
            if (value){
                $.each(accent, function(i, array){
                    var ac  = array[0],
                        unc = array[1];
                    value = value.replace(RegExp(ac, 'g'), unc);
                });
                return value;
            };
            return '';
        }));
    },
    only_alphanumeric: function(){
        return $(_($(this)).map(function(obj, index){
            var value;
            if (obj instanceof $){
                value = obj.val();
            }else if (_.isElement(obj)){
                value = $(obj).val();
            }else if (_.isNumber(obj)){
                value = '' + obj;
            }else{
                value = obj;
            };
            if (value){
                value = value.replace(/[^-a-zA-Z0-9-áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ\s]/g,'').replace(/-/g, '');
                return value;
            };
            return '';
        }));
    },
    combine: function(){
        return $(_($(this)).map(function(obj, index){
            var value;
            if (obj instanceof $){
                value = obj.val();
            }else if (_.isElement(obj)){
                value = $(obj).val();
            }else if (_.isNumber(obj)){
                value = '' + obj;
            }else{
                value = obj;
            };
            if (value){
                return value.replace(/\s/g,'');
            };
            return '';
        }));
    },
    icombine: function(){
        return $(
            _($(this).combine()).invoke('toLowerCase')
        );
    }
}); 