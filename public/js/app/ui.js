/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'wf-global', 'jquery-ui'], function($, $g) {
	
	var toggleMenu = function() {
		
	    var show    = ($g.menu.css('display') === 'none') ? false : true;
	    $g.menuOpen = !show;
	    
	    if (show) {
	        $g.menu.hide('slide', {
	            direction : 'left'
	        }, 200);
	        
	        $g.menuToggle.animate({
	            left : 0
	        }, 200)
	        .removeClass('rotate180')
	        .addClass('rotate0');
	    }
	    else {

	        $g.menu.show('slide', {
	            direction : 'left'
	        }, 200);
	                        
	        $g.menuToggle.animate({
	            left : $g.menu.outerWidth() + 2
	        }, 200)
	        .removeClass('rotate0')
	        .addClass('rotate180');
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
	        $g.menuLoaded = true;
	    }
	};
	
	
	/**
	 * position the menu in the viewport
	 */
	var positionElements = function() {
		
		// update the height of the viewport
		$g.viewport.css('height', $(window).height());
		$g.menu.css('height', $(window).height());
		
		if ($g.menuLoaded) {
			$g.itemSelect.accordion('refresh');
		}
		
	    $g.menu.position({
	        my: 'left top',
	        at: 'left top',
	        of: $g.viewport
	    });
	    
	    
		if (!$g.menuOpen) {
			
			// add the menu toggle
			$g.menuToggle.position({
				my : 'left center',
				at : 'left center',
				of : $g.viewport
			});
		}
		else {
			// add the menu toggle
			$g.menuToggle.position({
				my : 'left center',
				at : 'right center',
				of : $g.menu
			});
		}
	    

	    
		$g.toolbar.show().position({
			my: 'center bottom',
			at: 'center bottom',
			of: $g.viewport
		});
		
		$g.droparea.show()
		.width($g.viewport.width() - $g.menu.width())
		.height($g.viewport.height())
		.position({
			my: 'right bottom',
			at: 'right bottom',
			of: $g.viewport
		});
		
		$g.editModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.modaltop,
			of: $(document)
		});
		
		$g.wfModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.modaltop,
			of: $(document)
		});
		
		$g.verModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.modaltop,
			of: $(document)
		});
		$g.confirmModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		});
		$g.errorModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		});
		$g.okModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.smmodaltop,
			of: $(document)
		});
		
		
		$g.loadingModal.dialog('option', 'position', {
			my: 'center top',
			at: 'center top' + $g.loadtop,
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
	var positionWorkarea = function(position) {
		
		$g.viewport.css('height', $(window).height());
		
		// reposition the work area
		$g.workarea.position({
			using: function(pos, fb) {
				
				if (position) {
					$(this).css('top', position.top);
					$(this).css('left', position.left);
				}
				else {
					$(this).css('top', -(fb.element.height / 2 ));
					$(this).css('left', -(fb.element.width / 2 ));
				}

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
	
	/**
	 * update ui positions
	 */
	var updateUiPositions = function() {
		
		// get the workarea dimensions
		var left = $g.workarea.width() / 2;
		var top  = $g.workarea.height() / 2;

		// set the workarea position
		$g.wf.ui = $g.workarea.position();
		
		// get each connectable and set their offset
		$('.connectable').each(function() {
			var jqo  = $(this);
			var oset = jqo.offset();
			$g.steps[jqo.attr('id')].ui = {
				left: left + oset.left,
				top: top + oset.top
			};
		});
		
		console.log($g.steps);
		
	};
	
	
	// return the functions
	return {
		toggleMenu: toggleMenu,
		positionElements: positionElements,
		makeMenuDraggable: makeMenuDraggable,
		positionWorkarea: positionWorkarea,
		updateUiPositions: updateUiPositions
	};
});