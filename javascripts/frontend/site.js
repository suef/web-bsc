var stickyTop;
function sticky() {
	var on = $(window).scrollTop() > stickyTop;
	$('#grouping').toggleClass('sticky',on);
	$('body').toggleClass('stuck',on);
};
function sticky_nav() {
	var on = $(window).scrollTop() > stickyTop;
	$('#navigation').toggleClass('sticky',on);
	$('body').toggleClass('stuck',on);
};
function toggle_secondary_menu() {
	$('#secondary').toggleClass('show');
}
function toggle_menu( i ) {
	if ($('#menu'+i+':visible').length==0)
		pop_open( i );
	else
		pop_shut( i );
}
function mobile() {
	// Return true if we are in mobile mode
	// Base decision on small chunk of CSS added by a media query.
	return $('body').css('padding-bottom') == '1px';
}
$(function(){
	$('.popdown').hover(function(e){
		if (mobile()) return;
		pop_open($(this).data('index'))
	},function(e){
		if (mobile()) return;
		pop_close($(this).data('index'))
	})
})
var pop_id = null;
var timeouts = new Object();
var skip_next_hover_out = false;

function checkIfInView(element){
    var offset = element.offset().top - $(window).scrollTop();
		offset += 60; // if the menu is REALLY close but still ON the bottom of the screen then we still would like a scroll please.
    if (offset > window.innerHeight) {
        // Not in view so scroll to it
        $('html,body').animate({scrollTop: offset}, 1000);
        return false;
    }
   return true;
}

function pop_open( id ) {
	$('#popdown').show();
	$('#popdown .inner > div').hide();
	if (timeouts[id]) {
		clearTimeout( timeouts[id] );
		timeouts[id] = null;
	}
	$('#menu'+id).slideDown( 200 ); // or $('#menu'+id).fadeIn( 100 );
	$('#menu'+id).closest('li').css('z-index','1000');

	//$('#menu'+id)[0].scrollIntoView();
	checkIfInView( $('#menu'+id) );

	// NEW: Un-highlight popped menu option
	if (pop_id!==null) {
		$('#navigation .inner ul li[data-index='+pop_id+']').removeClass('on');
		pop_id = null;
	}

	// NEW: Highlight popped menu option
	$('#navigation .inner ul li[data-index='+id+']').addClass('on');
	pop_id = id;

	// Clear all timeouts
	for(var i in timeouts) {
		if (timeouts[i]) {
			clearTimeout( timeouts[i] )
		}
	}
	timeouts = new Object();
	// Hide everything else immediately
	$('#menu'+id).parent().siblings().find('> div').hide();
}
function pop_shut( id ) {

	// NEW: Un-highlight popped menu option
	if (pop_id!==null) {
		$('#navigation .inner ul li[data-index='+pop_id+']').removeClass('on');
		pop_id = null;
	}

	$('#menu'+id).fadeOut( 250, function() {
		$('#popdown').hide();
	} );
}
function pop_close( id ) {
	$('#menu'+id).closest('li').css('z-index','auto');
	timeouts[id] = setTimeout(function(){pop_shut(id)}, 250 )
}
var equalise_what = null;
var resizeId = null;
var include_padding = false;
var min_equalise_height = 0;
function equalise() {
	var max = min_equalise_height;
	$(equalise_what).each( function() {
	    var height = include_padding ? $(this).outerHeight() : $(this).height();
	    if (height>max) max = height;
	}).css( 'min-height', max+'px' );
}
function equally_high( what ) {
	equalise_what = what;
	$(window).on("load",equalise);
}
function equally_high_with_padding( what ) {
	include_padding = true;
	equalise_what = what;
	$(window).on("load",equalise);
}
function maintain_equally_high( what ) {
	equally_high( what )
	$(window).resize( resizing );
}
function force_equally_high( what ) {
	var tmp = equalise_what;
	equalise_what = what;
	equalise();
	equalise_what = tmp;
}
function resizing() {
    clearTimeout( resizeId );
    resizeId = setTimeout( equalise, 250 );
}
function toggle_search() {
	$('#top-search input').toggle();
}

function setup_sticky_menu() {
	$(function() {
		stickyTop = $('#navigation').offset().top;
		$( "<style>body.stuck { padding-top:"+$('#navigation').height()+"px; } @media screen and (max-width:800px) { body.stuck { padding-top:0px; } }</style>" ).appendTo( "head" )
		$(window).scroll(sticky);
	});
}
function setup_sticky_menu_nav() {
	$(function() {
		stickyTop = $('#navigation').offset().top;
		$( "<style>body.stuck { padding-top:"+$('#navigation').height()+"px; } @media screen and (max-width:800px) { body.stuck { padding-top:0px; } }</style>" ).appendTo( "head" )
		$(window).scroll(sticky_nav);
	});
}
