/**
 * @author Patricia Alves Bonfim
 */
window.onload = function(){
	
	$('.ms-selectable').each( function(){
		var id_parent = $(this).parent().attr('id').split('ms-')[1];
		var img_select = '<img id="select_all_' + id_parent + '" class="icon select_all" src="/static/images/control-double-icon.png">';
		var img_deselect = '<img id="deselect_all_' + id_parent + '" class="icon deselect_all" src="/static/images/control-double-180-icon.png">';
		$(this).after('<div class="ms-arrow">'+img_select+img_deselect+'</div>');
	});
	
	$('.select_all').each( function(){
		var id_parent = $(this).attr('id').split('select_all_')[1];
		$(this).click(function() {
			$("#"+id_parent).multiSelect('select_all');
			return false;
		});
	});

	$('.deselect_all').each( function(){
		var id_parent = $(this).attr('id').split('deselect_all_')[1];
		$(this).click(function() {
			$("#"+id_parent).multiSelect('deselect_all');
			return false;
		});
	});
	
};