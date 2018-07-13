CKEDITOR.plugins.add( 'especiais_login',
{
    init: function( editor )
    {
        var config = editor.config;
        var tags   = []; 
        
        //this.add('value', 'drop_text', 'drop_label');
         
        editor.ui.addRichCombo( 'CampoEspecial_login',
        {   
            label      : 'Campos Especiais',
            voiceLabel : 'Campos Especiais',
            command    : 'insertTimestamp',
            className  : 'cke_format',
            panel      : {
               css        : [ config.contentsCss, CKEDITOR.getUrl( 'editor.css' ) ],
               voiceLabel : 'Campos Especiais',
            },
        
            init : function()
                 {
                     for (var this_tag in CAMPOS_ESPECIAIS_ADM){
                     	console.log(this_tag);
                     	console.log(CAMPOS_ESPECIAIS_ADM[this_tag]);
                        this.add("["+CAMPOS_ESPECIAIS_ADM[this_tag]+"]", this_tag    );
                     }
                     
                  },
            onClick : function( value )
                {         
                   editor.focus();
                   editor.fire( 'saveSnapshot' );
                   editor.insertHtml(" "+value+" ");
                   editor.fire( 'saveSnapshot' );
                },
        } );
        
    }
} );