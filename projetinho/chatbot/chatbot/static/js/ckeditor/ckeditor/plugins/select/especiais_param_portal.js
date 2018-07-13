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
                     for (var this_tag in CAMPOS_ESPECIAIS_COBRANCA){
                        this.add(this_tag,
                                 CAMPOS_ESPECIAIS_COBRANCA[this_tag]
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
CKEDITOR.plugins.add( 'especiais_aval',
{
    init: function( editor )
    {
        var config = editor.config;
        var tags   = []; 
        
        //this.add('value', 'drop_text', 'drop_label');
         
        editor.ui.addRichCombo( 'CampoEspecial_aval',
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
                     for (var this_tag in CAMPOS_ESPECIAIS_AVAL){
                        this.add(this_tag,
                                 CAMPOS_ESPECIAIS_AVAL[this_tag]
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