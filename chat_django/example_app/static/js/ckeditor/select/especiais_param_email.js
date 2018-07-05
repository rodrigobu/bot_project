CKEDITOR.plugins.add( 'especiais_email',
{
    init: function( editor )
    {
        var config = editor.config;
        var tags   = []; 
        
        //this.add('value', 'drop_text', 'drop_label');
         
        editor.ui.addRichCombo( 'CampoEspecial_email',
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
                     this.startGroup( 'Campos' );
                     for (var this_tag in CAMPOS_ESPECIAIS_EMAIL){
                        this.add("["+CAMPOS_ESPECIAIS_EMAIL[this_tag]+"]",
                                 CAMPOS_ESPECIAIS_EMAIL[this_tag].split(".")[1]
                                 );
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