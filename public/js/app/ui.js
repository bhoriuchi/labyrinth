/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'jquery-ui'], function($, $g) {
	
	var toggleMenu = function() {
		
	    var show = ($g.menu.css('display') === 'none') ? false : true;

	    if (show) {
	        $g.menu.hide('slide', {
	            direction : 'left'
	        }, 200);
	        $g.menuToggle.animate({
	            left : '-=' + $g.menu.width()
	        }, 200);
	        $g.menuToggle.removeClass('rotate180').addClass('rotate0');
	    }
	    else {

	        $g.menu.show('slide', {
	            direction : 'left'
	        }, 200);
	                        
	        $g.menuToggle.animate({
	            left : '+=' + $g.menu.width()
	        }, 200);
	        $g.menuToggle.removeClass('rotate0').addClass('rotate180');
	    }
	    
	    if (!$g.menuLoaded) {
	    	
	        $g.itemSelect.accordion({
	            heightStyle : "fill",
	            clearStyle: true,
	            autoHeight: false,
	            animate: 200,
	            icons: {
	                header: 'ui-icon-circle-triangle-e',
	                activeHeader: 'ui-icon-circle-triangle-s'
	            }
	        });
	    }
	    else {
	        $g.menuLoaded = true;
	    }
	};
	
	
	/**
	 * position the menu in the viewport
	 */
	var positionElements = function() {
	    $g.menu.position({
	        my: 'left top',
	        at: 'left top',
	        of: $g.viewport
	    });
	    
		$g.toolbar.show().position({
			my: 'center bottom',
			at: 'center bottom',
			of: $g.viewport
		});
		
		$g.droparea.show()
		.width($g.viewport.width() - $g.menu.width())
		.position({
			my: 'right bottom',
			at: 'right bottom',
			of: $g.viewport
		});
		
		$g.editModal.dialog('option', 'position', {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		});
		
		$g.wfModal.dialog('option', 'position', {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		});
		
		$g.verModal.dialog('option', 'position', {
			my: 'center top' + $g.modaltop,
			at: 'center top',
			of: $(document)
		});
		$g.confirmModal.dialog('option', 'position', {
			my: 'center top' + $g.smmodaltop,
			at: 'center top',
			of: $(document)
		});
		$g.errorModal.dialog('option', 'position', {
			my: 'center top' + $g.smmodaltop,
			at: 'center top',
			of: $(document)
		});
		$g.okModal.dialog('option', 'position', {
			my: 'center top' + $g.smmodaltop,
			at: 'center top',
			of: $(document)
		});
	};
	
	
	var makeMenuDraggable = function() {
	    $('.menuObject').draggable({
	    	containment: '#wf-viewport',
	    	helper: 'clone',
	    	appendTo: 'body',
	    	zIndex: 510,
	    	revert: true,
	    	revertDuration: 200
	    });
	};
	
	/**
	 * position the workarea
	 */
	var positionWorkarea = function() {

		
		// reposition the work area
		$g.workarea.position({
			using: function(pos, fb) {
				$(this).css('top', -(fb.element.height / 2 ));
				$(this).css('left', -(fb.element.width / 2 ));
			},
			of : $g.viewport
		});
		
		// add the menu toggle
		$g.menuToggle.position({
			my : 'left center',
			at : 'left center',
			of : $g.viewport
		});
	};
	
	
	// return the functions
	return {
		toggleMenu: toggleMenu,
		positionElements: positionElements,
		makeMenuDraggable: makeMenuDraggable,
		positionWorkarea: positionWorkarea
	};
});