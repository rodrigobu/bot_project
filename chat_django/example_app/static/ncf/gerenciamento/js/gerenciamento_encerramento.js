
$(function() {
	// Encerramento individual
    $('.encerrar').live('click', function () {
        var obj       = $(this);
        var funcao_id = $(this).attr("funcao_id");
        $.dialogs.confirm('Confirmar encerramento', 'Você deseja encerrar este mapeamento?', function () {
            $.ajax({
                url     : URL_ENCERRAR,
                type    : 'POST',
                data    : { 'funcao' : funcao_id },
                success : function (data) {
                    if (data) {
                        if (!data.encerrado && data.erros) {
                            $.dialogs.error('Não foi possível encerrar o mapeamento.', data.erros);
                        } else if (data.encerrado) {
                            $.dialogs.success('O mapeamento foi encerrado com sucesso.');
                            recarregar_listagem();
                        }
                    }
                }
            });
        });
    });

	// Encerramento em massa
	$('.encerrar-selecao').on('click', function () {
	    var value  = 'encerrar';
	    var checks = $('.check_funcao:checked');
	    $(".check_funcao").closest('tr').removeClass('danger');

	    if (checks.length > 0) {
	    	 // Valida mapeamentos abertos
	    	 var abertas = _.filter($('.check_funcao:checked'), function (item, index) { return $(item).attr("status") == 'aberto';  });
	         if (abertas.length > 0){
	         	$(abertas).closest('tr').addClass('danger');
	            $.dialogs.error('Existem mapeamentos em aberto selecionados.');
	         } else {
		         $.dialogs.confirm('Confirmar encerramento', 'Você deseja encerrar o(s) mapeamento(s) selecionado(s)?', function () {
		             $.ajax({
		                 url  : URL_ENCERRAR,
		                 type : 'POST',
		                 data : {
		                      funcoes: _.map($('.check_funcao:checked'), function (item, index) { return $(item).attr("value"); }).join("|")
		                 },
		                 success: function (data) {
		                     if (!data["encerrado"] && data["erros"]) {
		                         $.dialogs.error('Não foi possível encerrar os mapeamentos.');
		                     } else if (data["encerrado"]) {
		                         $.dialogs.success('Os mapeamentos foram encerrados com sucesso.');
		                         recarregar_listagem();
		                     }
		                 }
		             });
		         });
	         }
	    } else {
	    	$.dialogs.warning( 'Nenhum mapeamento selecionado.',
	            'Selecione pelo menos um mapeamento com Status Pendente p/ Revisão para realizar o encerramento.'
	        );
	    }
	});

	$('.liberar_coleta_ncf').live('click', function () {
			var obj       = $(this);
			var funcao_id = $(this).attr("funcao_id");
			$.dialogs.confirm('Confirmar liberação', 'Você deseja liberar este mapeamento?', function () {
					$.ajax({
							url     : URL_LIBERAR,
							type    : 'POST',
							data    : { 'funcao' : funcao_id },
							success : function (data) {
									if (data) {
											if (!data.liberado && data.erros) {
													$.dialogs.error('Não foi possível liberar o mapeamento.', data.erros);
											} else if (data.liberado) {
													$.dialogs.success('O mapeamento foi liberado com sucesso.');
													recarregar_listagem();
											}
									}
							}
					});
			});
	});

});

// Encerramento em massa
$('.liberar-selecao').on('click', function () {
		var value  = 'liberar';
		var checks = $('.check_funcao:checked');
		$(".check_funcao").closest('tr').removeClass('danger');

		if (checks.length > 0) {
			 // Valida mapeamentos abertos
			 var abertas = _.filter($('.check_funcao:checked'), function (item, index) { return $(item).attr("status") == 'aberto';  });
				 if (abertas.length > 0){
					$(abertas).closest('tr').addClass('danger');
						$.dialogs.error('Existem mapeamentos em aberto selecionados.');
				 } else {
					 $.dialogs.confirm('Confirmar liberação', 'Você deseja liberar o(s) mapeamento(s) selecionado(s)?', function () {
							 $.ajax({
									 url  : URL_LIBERAR,
									 type : 'POST',
									 data : {
												funcoes: _.map($('.check_funcao:checked'), function (item, index) { return $(item).attr("value"); }).join("|")
									 },
									 success: function (data) {
											 if (!data["liberado"] && data["erros"]) {
													 $.dialogs.error('Não foi possível liberar os mapeamentos.');
											 } else if (data["liberado"]) {
													 $.dialogs.success('Os mapeamentos foram liberarados com sucesso.');
													 recarregar_listagem();
											 }
									 }
							 });
					 });
				 }
		} else {
			$.dialogs.warning( 'Nenhum mapeamento selecionado.',
						'Selecione pelo menos um mapeamento com Status Encerrado para realizar a liberação.'
				);
		}
});




	$('.remover_map').live('click', function () {
			var obj       = $(this);
			var funcao_id = $(this).attr("funcao_id");
			$.dialogs.confirm('Confirmar Remoção', 'Você deseja remover este mapeamento?', function () {
					$.ajax({
							url     : URL_REMOVER,
							type    : 'POST',
							data    : { 'funcao' : funcao_id },
							success : function (data) {
									if (data) {
											if (!data.removido && data.erros) {
													$.dialogs.error('Não foi possível remover o mapeamento.', data.erros);
											} else if (data.removido) {
													$.dialogs.success('O mapeamento foi removido com sucesso.');
													recarregar_listagem();
											}
									}
							}
					});
			});
	});


// Encerramento em massa
$('.remover_map-selecao').on('click', function () {
		var value  = 'remover';
		var checks = $('.check_funcao:checked');
		$(".check_funcao").closest('tr').removeClass('danger');

		if (checks.length > 0) {
			 // Valida mapeamentos abertos
					 $.dialogs.confirm('Confirmar Remoção', 'Você deseja remover o(s) mapeamento(s) selecionado(s)?', function () {
							 $.ajax({
									 url  : URL_REMOVER,
									 type : 'POST',
									 data : {
												funcoes: _.map($('.check_funcao:checked'), function (item, index) { return $(item).attr("value"); }).join("|")
									 },
									 success: function (data) {
											 if (!data["removido"] && data["erros"]) {
													 $.dialogs.error('Não foi possível remover os mapeamentos.');
											 } else if (data["removido"]) {
													 $.dialogs.success('Os mapeamentos foram removidos com sucesso.');
													 recarregar_listagem();
											 }
									 }
							 });
					 });
		} else {
			$.dialogs.warning( 'Nenhum mapeamento selecionado.',
						'Selecione pelo menos um mapeamento para realizar a remoção.'
				);
		}
});

/*
         switch ((checks.length > 0) == true) {
            case (value == 'encerrar'):
            {
                var abertas = _.filter(checks, function (item, index) {
                    return $(item).closest('tr').find('td:eq(4) > span').text() == 'Aberta';
                });
                if (abertas.length > 0) {
                    $(abertas).closest('tr').addClass('danger');
                    $.dialogs.error('Existem mapeamentos em aberto selecionados.');
                } else {
                    if (checks.length > 1) {
                        var msg = 'Você deseja encerrar os mapeamentos selecionados?';
                    } else {
                        var msg = 'Você deseja encerrar o mapeamento selecionado?';
                    }
                    ;
                    $.dialogs.confirm('Confirmar encerramento', msg, function () {
                        var url = CONF.encerrar_em_massa;
                        var checks_encerrar = '';
                        $.each(checks.closest('tr').find('td:eq(0) :checkbox'), function (item, index) {
                            checks_encerrar += $(this).val()+"|";
                        });
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: {
                                funcoes: checks_encerrar
                            },
                            success: function (data) {
                                if (data) {
                                    if (!data.encerrado && data.erros) {
                                        $.dialogs.error(
                                            'Não foi possível encerrar os mapeamentos.', data.erros
                                        );
                                    } else if (data.encerrado) {
                                        checks.closest('tr').addClass('success');
                                        $.dialogs.success(
                                            'Os mapeamentos foram encerrados com sucesso.', function () {
                                                $('#listagem').data('djflexgrid').methods.reload();
                                            });
                                    }
                                    ;
                                }
                                ;
                            }
                        });
                    });
                }
                ;
                break;
            }
                ;
            default :
            {
                $.dialogs.warning(
                    'Nenhum mapeamento selecionado.',
                    'Por favor, para realizar o encerramento a tabela deve conter pelo menos um mapeamento selecionado.'
                );
            }
                ;
        }
        ;
 * */
