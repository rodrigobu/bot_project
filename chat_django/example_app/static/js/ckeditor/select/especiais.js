CKEDITOR.plugins.add( 'especiais',
{
    init: function( editor )
    {
        var config = editor.config;
        
        var tags = []; 
        
        //this.add('value', 'drop_text', 'drop_label');
         
        editor.ui.addRichCombo( 'CampoEspecial',
        {   
            label : 'Campos Especiais',
            voiceLabel : 'Campos Especiais',
            command: 'insertTimestamp',
            className : 'cke_format',
            panel : {
               css : [ config.contentsCss, CKEDITOR.getUrl( 'editor.css' ) ],
               voiceLabel : 'Campos Especiais',
            },
        
            init : function()
                 {
                     this.startGroup( 'Campos do Candidato' );
                     for (var this_tag in CAMPOS_ESPECIAIS_CANDIDATO){
                        this.add(
                        	     "[["+CAMPOS_ESPECIAIS_CANDIDATO[this_tag]+"]]",
                                 CAMPOS_ESPECIAIS_CANDIDATO[this_tag].split(".")[1]
                                 );
                     }
                     this.startGroup( 'Campos do Cliente' );
                     for (var this_tag in CAMPOS_ESPECIAIS_CLIENTE){
                        this.add(
                        	     "[["+CAMPOS_ESPECIAIS_CLIENTE[this_tag]+"]]",
                                 CAMPOS_ESPECIAIS_CLIENTE[this_tag].split(".")[1]
                                 );
                     }
                     this.startGroup( 'Campos da Vaga' );
                     for (var this_tag in CAMPOS_ESPECIAIS_VAGA){
                        this.add(
                        	     "[["+CAMPOS_ESPECIAIS_VAGA[this_tag]+"]]",
                        	     CAMPOS_ESPECIAIS_VAGA[this_tag].split(".")[1]
                        );
                     }
                     this.startGroup( 'Outros' );
                     for (var this_tag in CAMPOS_ESPECIAIS_OUTROS){
                        this.add(
                        	     "[["+CAMPOS_ESPECIAIS_OUTROS[this_tag]+"]]",
                        	     CAMPOS_ESPECIAIS_OUTROS[this_tag].split(".")[1]
                        );
                     }
                     
                  },
            onClick : function( value )
                {         
                   editor.focus();
                   editor.fire( 'saveSnapshot' );
                   editor.insertHtml( value );
                   editor.fire( 'saveSnapshot' );
                },
        } );
        
    }
} );