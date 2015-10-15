/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
define(['jquery', 'jsplumb'], function($, jsPlumb) {
	
	return {
	    codefield:      document.getElementById('wf-tab-code'),
	    confirmModal:   $('#wf-confirm-modal'),
	    loadingModal:   $('#wf-loading-modal'),
	    diagram:        jsPlumb.getInstance(),
	    droparea:       $('#wf-droparea'),
	    errorModal:     $('#wf-error-modal'),
	    editing:        false,
	    editTabs:       $('#wf-editTabs'),
	    editModal:      $('#wf-edit-step'),
	    header:         $('#wf-header'),
	    iconSize:       'small',
	    itemSelect:     $("#itemSelect"),
	    menu:           $('#wf-menu'),
	    menuLoaded:     false,
	    menuOpen:       false,
	    menuToggle:     $('#wf-menuToggle'),
	    okModal:        $('#wf-ok-modal'),
	    toolbar:        $('#wf-toolbar'),
	    toolbarReset:   $('#wf-toolbar-reset'),
	    toolbarEdit:    $('#wf-toolbar-edit'),
	    toolbarVersion: $('#wf-toolbar-version'),
	    toolbarSave:    $('#wf-toolbar-save'),
	    verModal:       $('#wf-version-workflow'),
	    viewport:       $('#wf-viewport'),
	    workarea:       $('#wf-workarea'),
	    wfModal:        $('#wf-edit-workflow'),
	    okheight:       300,
	    okwidth:        400,
	    editheight:     570,
	    editwidth:      750,
	    activetab:      0,
	    modaltop:       '+10%',
	    smmodaltop:     '+20%',
	    loadtop:        '+22%',
	    wfpath:         '/api/wf',
	    wf:              null,
	    codemirror:      null,
	    panzoom:         null,
		steps:           {},
		attributes:      [],
		inputs:          [],
		outputs:         [],
		elements:        [],
		conn: {
			success: 'Right',
			fail: 'Bottom',
			exception: 'Top',
			target: 'Left'
		}
	};
});