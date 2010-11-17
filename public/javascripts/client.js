function setupHandler( obj, event, func, useCapture ) {
	if ( useCapture == null )
		useCapture = false;
	if ( "addEventListener" in obj ) {
		obj.addEventListener( event, func, useCapture );
	} else if ( "attachEvent" in obj )
		obj.attachEvent( "on" + event, func );
}

function addOption( sel, id, desc ) {
	var optn = document.createElement( "option" );
	optn.text = desc;
	optn.value = id;
	sel.options.add( optn );
}

function getElement( id ) {
	if ( typeof( id ) == "string" )
		return document.getElementById( id );
	else
		return id;
}

function $(elem) {
	return getElement( elem );
}

function addElementClass(element, className) {
	var obj = getElement(element);
	var cls = obj.className;
	if (cls == undefined || cls.length == 0) {
		obj.className = className;
		return true;
	}

	if ( arrayStringContains( cls, className ) ) {
		return false;
	} else {
		obj.className = cls + " " + className;
		return true;
	}
}

function hasElementClass(element, className) {
	var obj = getElement(element);
	var cls = obj.className;
	if (!cls)
		return false;

	return arrayStringContains( cls, className );
}

function removeElementClass(element, className) {
	var obj = getElement(element);
	var cls = obj.className;
	if (cls == undefined || cls.length == 0)
		return false;

	if (cls == className) {
		obj.className = "";
		return true;
	}

	var classes = cls.split(" ");
	for (var i = 0; i < classes.length; i++) {
		if (classes[i] == className) {
			classes.splice(i, 1);
			obj.className = classes.join(" ");
			return true;
		}
	}
	return false;
}

function setVisible( element, isVisible ) {
	var elem = $( element );
	if ( isVisible )
		removeElementClass( elem, "invisible" );
	else
		addElementClass( elem, "invisible" );	
}

function isVisible( element ) {
	var elem = $( element );
	if ( hasElementClass( elem, "invisible" ) )
		return false;
	else
		return true;
}

function replaceChildren( element, newChild ) {
	var elem = $( element );
	var child = null;
	while ( ( child = elem.firstChild ) != null )
		elem.removeChild( elem.firstChild );
	if ( newChild != null )
		elem.appendChild( newChild );
}

function switchView( id1, id2 ) {
	setVisible( id1, false );
	setVisible( id2, true );
}

function getForm( form ) {
	if ( typeof( form ) === "string" )
		return document.forms[form];
	else
		return form;
}

function selectValue( obj, elementName, elementValue ) {
	var form = getForm( obj );
	if ( form != null ) {
		var elem = form.elements[elementName];
		if ( elem != null ) {
			for ( var i = 0; i < elem.length; i++ ) {
				if ( elem.options[i].value == elementValue ) {
					elem.options[i].selected = true;
					break;
				}
			}
		}
	}
}

function getSelectValue( obj, elementName ) {
	var form = getForm( obj );
	if ( form != null ) {
		var elem = form.elements[elementName];
		var idx = elem.selectedIndex;
		if ( idx >= 0 ) {
			var val = elem.options[idx].value;
			var txt = elem.options[idx].text;
			return {'value': val, 'text': txt};
		}
	}
	return null;
}

function getSelectedRadio( obj, elementName ) {
	var form = getForm( obj );
	if ( form != null ) {
		var elem = form.elements[elementName];
		if ( elem != null ) {
			for ( var i = 0; i < elem.length; i++ ) {
				if ( elem[i].checked )
					return elem[i].value;
			}
		}
	}
	return null;
}

function setFocus( obj, fieldName ) {
	var form = getForm( obj );
	if ( form != null ) {
		var fld = form.elements[fieldName];
		if (fld != null)
			fld.focus();
	}
}

function enableButton( obj, btn ) {
	var form = getForm( obj );
	if ( form != null ) {
		var elem = form.elements[btn ? btn : "submitButton"];
		if ( elem != null ) {
			elem.disabled = false;
			if ( elem.enabledText )
				elem.value = elem.enabledText;
		}
	}	
}

function disableButton( obj, btn, text ) {
	var form = getForm( obj );
	if ( form != null ) {
		var elem = form.elements[btn ? btn : "submitButton"];
		if ( elem != null ) {
			elem.disabled = true;
			elem.enabledText = elem.value;
			elem.value = text ? text : "Please wait...";
		}
	}	
}

function createFormElement( type, name, id ) {	
	/*@cc_on
	if (lteIE7) {
		var elemString = "";
		if ( type == "select" ) {
			elemString = '<select';
		} else {
			elemString = '<input type="' + type + '"';
		}
		elemString += ' name="' + name + '"';
		if ( id != null )
			elemString += ' id="' + id + '">';
		return document.createElement( elemString );
	}
	@*/
	var elem = null;
	if ( type == "select" ) {
		elem = document.createElement( "select" );
	} else {
		elem = document.createElement( "input" );
		elem.setAttribute( "type", type );
	}
	elem.setAttribute( "name", name );
	elem.setAttribute( "id", id );
	return elem;
}

function forceIntoForm( obj, elem ) {
	var form = getForm( obj );
	if ( form.elements[elem.name] == null )
		form.elements[elem.name] = elem;
}

function createCalLink( element, name, allowPast, allowFuture ) {
	var elem = $( element );
	if ( elem != null ) {
		elem.calLink = document.createElement( "a" );
		addElementClass( elem.calLink, "calLink" );
		elem.calLink.calendar = new calendar( elem );
		elem.calLink.calendar.name = name;
		if ( allowPast == false )
			elem.calLink.calendar.allowPast = false;
		if ( allowFuture == false )
			elem.calLink.calendar.allowFuture = false;

		setupHandler( elem.calLink, "click", bindFunc( elem.calLink.calendar.popup, elem.calLink.calendar ) );

		insertAfter( elem, elem.calLink );
	}
}

function openWindow(url, width, height, scrollbars, resizable, extras) {
	var opts = [];
	if (scrollbars != null && scrollbars == true)
		opts.push("scrollbars");
	if (resizable != null && resizable == true)
		opts.push("resizable");
	if (width != null)
		opts.push("width=" + width);
	if (height != null)
		opts.push("height=" + height);

	if ( extras != null ) {
		for ( var attr in extras ) {
			opts.push( attr + "=" + extras[attr] );
		}
	}
	return window.open(url, 'remote', opts.join(','))
}

var keyInfo = {
	"code": 0,
	"char": 0,
	"nonChar": false,
	"event": null
};

function keyDownDocument( event ) {
	var c;
	keyInfo["char"] = "";
	keyInfo["event"] = event;
	if ( lteIE7 )
		c = window.event.keyCode;
	else
		c = event.which;
	if ( c < 16 ||                    // non printables
		( c > 16 && c < 32 ) ||     // avoid shift
		( c > 32 && c < 41 ) ||     // navigation keys
		c == 46 ||                  // Delete Key (Add to these if you need)
		( c > 112 && c < 123 ) ) {    // Function keys
		keyInfo["code"] = c;
		keyInfo["nonChar"] = true;
	} else if ( event.which == 9 ) {
		keyInfo["code"] = 9;
		keyInfo["nonChar"] = true;
	} else if ( ( event.which >= 112 && event.which <= 123 ) ) {
		keyInfo["code"] = event.which;
		keyInfo["nonChar"] = true;
	} else {
		keyInfo["code"] = event.which;
		keyInfo["nonChar"] = false;
	}
}

function getEvent(event) {
	var evt = null;
	if (event)
		evt = event;
	else
		evt = window.event;

	return evt;
}

function getEvtSrc(evt) {
	var e = getEvent(evt);
	return (e.target) ? e.target : e.srcElement;
}

function stopEvent(evt) {
	var e = getEvent(evt);
	e.cancelBubble = true;
	if ( e.stopPropagation ) e.stopPropagation();
	if ( e.preventDefault ) e.preventDefault();
}

function fireEvent( obj, evt ) {
	var elem = $( obj );

	if ( document.createEvent ) {
		var event = document.createEvent( "HTMLEvents" );
		event.initEvent( evt, true, true );
		return !elem.dispatchEvent( event );
	} else {
		var event = document.createEventObject();
		return elem.fireEvent( "on"+evt, event );
	}
}

function getKeyCode( evt ) {
	if ( keyInfo["nonChar"] == false )
		keyInfo["char"] = ( evt.charCode ) ? evt.charCode : evt.keyCode;
	else
		keyInfo["char"] = "";
}


function preventEnter( event ) {

}

function isSpace() {
	return keyInfo["char"] == 32;
}

function isNumeric(  ) {
	if ( keyInfo["nonChar"] )
		return false;

	return ( keyInfo["char"] > 45 && keyInfo["char"] < 58 );
}

function isAlpha() {
	if ( keyInfo["nonChar"] )
		return false;

	return ( ( isSpace() ) || ( keyInfo["char"] == 39 ) || ( keyInfo["char"] > 64 && keyInfo["char"] < 91 ) || ( keyInfo["char"] > 96 && keyInfo["char"] < 123 ) );
}

function isModified() {
	return keyInfo["event"].ctrlKey || keyInfo["event"].altKey;
}

function isNav( ) {
	if ( keyInfo["nonChar"] == false && !isModified )
		return false;

	return (
		( keyInfo["code"] >= 35 && keyInfo["code"] < 40 ) || // arrows/home/delete
		keyInfo["code"] == 46 || // delete
		keyInfo["code"] == 8 || // backspace
		keyInfo["code"] == 9 || // tab
		( keyInfo["code"] >= 112 && keyInfo["code"] <= 123 ) || // function keys
		keyInfo["event"].ctrlKey ||
		keyInfo["event"].altKey
	);
}

function isBackspace( ) {
	if ( keyInfo["nonChar"] == false )
		return false;

	return keyInfo["code"] == 8;
}

function isEnter( ) {
	if ( keyInfo["nonChar"] == false )
		return false;

	return keyInfo["code"] == 13;
}

function allowAlpha( event ) {
	getKeyCode( event );

	if ( isNav( ) || isAlpha( ) )
		return true;

	stopEvent( event );
	return false;
}

function allowNumeric( event ) {
	getKeyCode( event );

	if ( isNav( ) || isNumeric( ) )
		return true;

	stopEvent( event );
	return false;
}

function allowDate( event ) {
	getKeyCode( event );

	if ( isNav( ) )
		return true;

	if ( isNumeric(  ) )
		return true;

	if ( keyInfo["char"] == 191 )
		return true;

	stopEvent( event );
	return false;
}

function allowIntDash( event ) {
	getKeyCode( event );

	if ( isNav( ) )
		return true;

	if ( isNumeric( ) || keyInfo["char"] == 45 )
		return true;

	stopEvent( event );
	return false;
}

function getSelRange( inp )
{
	var startPos = 0;
	var endPos = 0;
	var txt = '';
	if ( "selectionStart" in inp ) {
		startPos = inp.selectionStart;
		endPos = inp.selectionEnd;
	} else {
		var bookmark = document.selection.createRange().getBookmark();
		var sel = inp.createTextRange();
		sel.moveToBookmark( bookmark );
		var selLeft = inp.createTextRange();
		selLeft.collapse( true );
		selLeft.setEndPoint("EndToStart", sel);

		startPos = selLeft.text.length;
		endPos = selLeft.text.length + ( ( sel.text.length == 0 ) ? 1 : sel.text.length );
	}

	return {'start': startPos, 'end': endPos};
}

function replaceSelection( inp, newText ) {
	var selRange = getSelRange( inp );

	var beg = "";
	var end = "";
	if ( selRange["start"] > 0 )
		beg = inp.value.substring( 0, selRange["start"] );
	if ( selRange["end"] < inp.value.length )
		end = inp.value.substring( selRange["end"] );
	return beg + newText + end;
}

function allowCurr( event ) {
	var src = getEvtSrc( event );
	getKeyCode( event );

	if ( isAlpha( ) ) {
		stopEvent( event );
		return false;
	}

	if ( isNumeric( ) ) {
		var val = replaceSelection( src, String.fromCharCode( keyInfo["char"] ) );
		var idx = val.indexOf( "." );
		var dec = val.length - idx - 1;
		if ( ( idx != -1 ) && ( dec > 2 ) ) {
			stopEvent( event );
			return false;
		}
	}
	/*
  	
	if ( keyInfo["char"] == 46 ) {
		if ( src.value.indexOf( '.' ) != -1 ) {
			stopEvent( evt );
			return false;
		}
	}
	*/

	return true;
}		

function checkAlpha(event) {
	// Get ASCII value of key that user pressed
	var key = getKeyCode( event );
	// Was key that was pressed an alpha character?
	if ( isAlpha( key ) )
		return true;

	if ( isNav( event ) )
		return true;

	stopEvent( event );
	return false;
}
	    
function checkNumeric(event) {
	// Get ASCII value of key that user pressed
	var key = getKeyCode(event);
	// Was key that was pressed a numeric character (0-9)?

	if ( isNumeric( key ) )
		return true;

	if ( isNav( event ) )
		return true;

	stopEvent( event );
	return false;
}

function getElementPos(e) {
	var elem = getElement(e);

	if (!elem) return {'x': -1, 'y': -1};

	var left = 0;
	var top = 0;

	if (elem.offsetParent) {
		do {
			left += elem.offsetLeft;
			top += elem.offsetTop;
		} while ( ( elem = elem.offsetParent) != null );
	}

	return {'x': left, 'y': top};
}

function getElementDims(e) {
	var elem = getElement( e );

	if ( !elem ) {
		return {"width": -1, "height": -1};
	}

	var isHidden = hasElementClass( elem, "invisible" );
	var oldVisibility = elem.style.visibility;
	var oldPosition = elem.style.position;
	if ( isHidden ) {
		elem.style.visibility = "hidden";
		elem.style.position = "absolute";
		setVisible( elem, true );
	}

	var width = elem.offsetWidth;
	var height = elem.offsetHeight;

	if ( isHidden ) {
		setVisible( elem, false );
		elem.style.visibility = oldVisibility;
		elem.style.position = oldPosition;
	}

	return {"width": width, "height": height};
}

function getWindowSize() {
	var width = 0;
	var height = 0;

	if ( typeof( window.innerWidth ) == "number" ) {
		width = window.innerWidth;
		height = window.innerHeight;
	} else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
	} else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		width = document.body.clientWidth;
		height = document.body.clientHeight;
	}

	return {"width": width, "height": height};
}

function getScrollXY() {
	var scrOfX = 0, scrOfY = 0;
	if ( typeof( window.pageYOffset ) == 'number' ) {
		//Netscape compliant
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	} else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		//DOM compliant
		scrOfY = document.body.scrollTop;
		scrOfX = document.body.scrollLeft;
	} else if ( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		//IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
		scrOfX = document.documentElement.scrollLeft;
	}
	return {"x": scrOfX, "y": scrOfY};
}

function getQueryParm(p) {
	var re = new RegExp('&'+p+'=([^&]*)','i');
	var c = window.location.search;
	return (c=c.replace(/^\?/,'&').match(re)) ?c=c[1] :c='NULL';
}

function appear( elem, time ) {
	var e = $( elem ).id;
	
	changeOpacity( e, 0 );
	setVisible( e, true );

	if ( time == null )
		time = 3;

	var steps = time * 10; // Adjust 5 times a second
	var perStep = 100 / steps;

	for ( var i = 1; i <= steps; i++ ) {
		setTimeout( "changeOpacity('" + e + "', " + ( i * perStep ) + ")", ( 100 * i ) );
	}
}

function disappear( elem ) {
	var e = $( elem ).id;
	changeOpacity( e, 100 );
	

	for ( var i = 1; i <= 5; i++ ) {
		setTimeout( "changeOpacity('" + e + "', " + ( ( 5 - i ) * 20 ) + ")", (100 * i ) );
	}

	setTimeout( "setVisible('" + e + "', false )", (100 * i ) );
}

function blindDown( elem ) {
	var e = $( elem ).id;

	var dims = getElementDims( e );

	$( elem ).style.height = "0px";
	setVisible( elem, true );
	var overflow = $( elem ).style.overflow;
	$( elem ).style.overflow = "hidden";

	for ( var i = 1; i <= 5; i++ ) {
		setTimeout( "$('" + e + "').style.height = '" + ( dims.height * ( i * .2 ) ) + "px';", ( 100 * i ) );
	}

	setTimeout( "$('" + e + "').style.height = 'auto';", 500 );
	/*@cc_on
	if ( isIE )
		setTimeout( "$('" + e + "').style.zoom = 1;", 500 );
	@*/

	if ( overflow != null && overflow != "" )
		setTimeout( "$('" + e + "').style.overflow = '" + overflow + "';", ( 100 * i ) );
}

function blindUp( elem ) {
	var e = $( elem ).id;

	var dims = getElementDims( e );

	setVisible( elem, true );
	var overflow = $( elem ).style.overflow;
	$( elem ).style.overflow = "hidden";

	for ( var i = 1; i <= 5; i++ ) {
		setTimeout( "$('" + e + "').style.height = '" + ( .20 * ( 5 - i ) * dims.height ) + "px';", ( 100 * i ) );
	}
	if ( overflow != null && overflow != "" )
		setTimeout( "$('" + e + "').style.overflow = '" + overflow + "';", ( 100 * i ) );
	setTimeout( "setVisible( '" + e + "', false );", ( 100 * 5 ) );
	setTimeout( "$('" + e + "').style.height = 'auto';", ( 100 * 5 ) );
}

function changeOpacity( elem, opacity ) {
	var e = getElement( elem );
	e.style.opacity = opacity / 100;
	e.style.MozOpacity = opacity / 100;
	e.style.KhtmlOpacity = opacity / 100;
	e.style.filter = "alpha(opacity=" + opacity + ")";
}

function scrollToElement( e ) {
	var elem = getElement( e );

	var windowSize = getWindowSize();
	var windowScroll = getScrollXY();

	var elemSize = getElementDims( elem );
	var elemPos = getElementPos( elem );

	if ( elemPos.x < windowScroll.x || elemPos.y < windowScroll.y )
		window.scrollTo( elemPos.x, elemPos.y );
	else if ( ( elemPos.x + elemSize.width ) > ( windowScroll.x + windowSize.width ) )
		window.scrollTo( elemPos.x, elemPos.y );
	else if ( ( elemPos.y + elemSize.height ) > ( windowScroll.y + windowSize.height ) )
		window.scrollTo( elemPos.x, elemPos.y );
}

function showError( text ) {
	function createErrorHolder() {
		var dl = document.createElement( "dl" );
		addElementClass( "messages", "invisible" );
		addElementClass( dl, "error");
		var title = document.createElement( "dt" );
		title.appendChild( document.createTextNode( "Review the following message(s):" ) );
		dl.appendChild( title );
		$("messages").appendChild( dl );
		return dl;
	}

	if ( $( "messages" ) == null ) return;

	var errLines	= null;
	var msgList		= null;
	var msgLine		= null;

	if ( typeof ( text ) == "string" )
		errLines = text.split( "\n" );
	else if ( text.constructor == Array )
		errLines = text;
	else
		errLines = String( text );

	var dls = $( "messages").getElementsByTagName( "dl" );
	if ( dls.length > 0 ) {
		for ( var i = 0; i < dls.length; i++ ) {
			if ( hasElementClass( dls[i], "error" ) )
				msgList = dls[i];
		}
	}

	if ( msgList == null )
		msgList = createErrorHolder();
	
	var msgHdr = msgList.getElementsByTagName( "dt" )[0];
	while ( msgHdr.nextSibling != null )
		msgList.removeChild( msgHdr.nextSibling );

	for ( var i = 0; i < errLines.length; i++ ) {
		msgLine = document.createElement( "dd" );
		msgLine.appendChild( document.createTextNode( errLines[i] ) );
		msgList.appendChild( msgLine );
	}

	appear( "messages" );
	scrollToElement( "messages" );
}

function hideError() {
	setVisible( $( "messages" ), false );
}

function setInputLabels() {
	var labels = document.getElementsByTagName( "label" );
	var elem = null;
	for ( var i = 0; i < labels.length; i++ ) {
		elem = document.getElementById( labels[i].htmlFor );
		if ( elem )
			elem.label = labels[i];
	}	
}

function startTimeout() {
	setTimeout("onTimeout()", session_timeout * 1000 );
}

function onTimeout() {
	window.location = "hblayoutsignoff.asp?timeout=y";
}

function pageInit() {
	// This can be overridden by any page that needs to do init code
}

function pageUninit() {
	
}

/*
 * inspectLinkRels()
 *
 * Allows specifying "javascript behavior" for links without introducing non-standard markup.
 * We are making use of the rel="" attribute on <a> tags to make this possible.  Currently,
 * there are 3 values for rel="" that will be honored by this function:
 *
 *   external: Sets the "target" of the link to point to "_blank", causing the link to
 *             open in a new window.  Yes, you could just specify target="_blank" in the
 *             markup for the link, but this causes validation errors, which taste bad.
 *
 *   confirm:  Calls the javascript leaveConfirmation() to be called before actually following
 *             the link.  This gives the member an indication that they are leaving the 
 *             credit union's website, and gives them an option to decline.
 *
 *   popup:    This allows for links to open a new popup window, and also allows specifying
 *             parameters for the created popup.  The format of the string is:
 *                popup:<width>:<height>:<scrollbars>:<resizable>
 *             Any portion of the format string that is left blank will be treated as being
 *             set to 0.  For example:
 *                popup:750:550::1
 *             would open a new popup window, 750px x 550px, containing neither an address bar or
 *             a status bar, but being resizable.
 *
 *   button:   Converts the standard text link into a button.
 */
function inspectLinkRels() {
	function isExternal( txt ) {
		return arrayStringContains( txt, "external" );
	}
	function isConfirm( txt ) {
		return arrayStringContains( txt, "confirm" );
	}
	function isPopup( txt ) {
		var rels = txt.split( " " );
		for ( var i = 0; i < rels.length; i++ ) {
			if ( rels[i].indexOf( "popup" ) == 0 )
				return true;
		}
		return false;
	}

	if ( !document.getElementsByTagName ) return;
	var popup_link = false;
	var confirm_link = false;
	var rel_text = "";
	var anchor = null;

	var anchors = document.getElementsByTagName( "a" );
	for ( var i = 0; i < anchors.length; i++ ) {
		anchor = anchors[i];
		rel_text = anchor.getAttribute( "rel" );
		if ( rel_text != null) {
			if ( isExternal( rel_text ) ) {
				anchor.target = "_blank";
				anchor.title = "Opens in new window";
			}

			if ( isConfirm( rel_text ) ) {
				if ( window.leaveConfirmation != null ) {
					anchor.confirm_handler = function( event ) {
						return leaveConfirmation();
					};
				}
			}
			if ( isPopup( rel_text ) ) {
				if ( window.openWindow != null ) {
					anchor.popup_handler = function( event ) {
						var opts = {};
						var rel_text = this.getAttribute( "rel" );
						if ( rel_text != null) {
							var rels = rel_text.split( " " );
							for ( var i = 0; i < rels.length; i++ ) {
								if ( rels[i].indexOf( "popup" ) == 0 ) {
									var args = rels[i].split( ":" );
									if ( args.length > 1 ) opts["width"] = args[1];
									if ( args.length > 2 ) opts["height"] = args[2];
									if ( args.length > 3 ) opts["scrollbars"] = args[3];
									if ( args.length > 4 ) opts["resizable"] = args[4];
								}
							}
						}
						openWindow( this.getAttribute( "href" ), null, null, null, null, opts );
					}
				}
			}

			if ( isConfirm( rel_text ) || isPopup( rel_text ) ) {
				setupHandler( anchor, "click", function( event ) {
					var src = getEvtSrc( event );
					//
					// Just in case there is an image or some other element inside
					// the <a> that received the actual click.
					//
					while ( src.tagName != "A" ) { src = src.parentNode; }
					if ( src.confirm_handler != null ) {
						if ( !src.confirm_handler( event ) ) {
							stopEvent( event );
							return false;
						}
					}
					if ( src.popup_handler != null ) {
						src.popup_handler( event );
						stopEvent( event );
						return false;
					}
					return true;
				} );
			}
		}
	}
};

function replaceLinkSubmits() {
	var inputs = document.getElementsByTagName( "input" );
	for ( var i = 0; i < inputs.length; i++ ) {
		if ( inputs[i].type == "submit" && hasElementClass( inputs[i], "linksubmit" ) ) {
			var parent = inputs[i].parentNode;
			do {
				if ( parent.nodeName.toLowerCase() == "form" )
					break;
			} while ( ( parent = parent.parentNode ) != null );
			if ( parent != null ) {
				var link = document.createElement( "a" );
				link.href = "javascript: void(0);";
				setupHandler( link, "click", bindFunc( function( event ) {
					this.submit();
				}, parent ) );
				link.appendChild( document.createTextNode( inputs[i].value ) );
				inputs[i].parentNode.replaceChild( link, inputs[i] );
			}
		}
	}
}

function replaceButtonLinks() {
	var atags = document.getElementsByTagName( "a" );
	for ( var i = 0; i < atags.length; i++ ) {
		if ( hasElementClass( atags[i], "buttonlink" ) ) {
			var button = document.createElement( "button" );
			button.href = atags[i].href;
			setupHandler( button, "click", bindFunc( function( event ) {
				stopEvent( event );
				window.location = this.href;
			}, button ) );
			button.className = atags[i].className;
			button.appendChild( document.createTextNode( atags[i].childNodes[0].nodeValue ) );
			atags[i].parentNode.replaceChild( button, atags[i] );
		}
	}
}

window.cuName = "KIT FCU";
function leaveConfirmation() {
	var question  = "You are now leaving " + window.cuName + "'s website.\r\nYou are linking to an alternate ";
		question += "website that is not operated by the credit union.\r\n" + window.cuName + " does not ";
		question += "control this site or its privacy practices and makes no warranty for its contents, ";
		question += "products and services\r\nDo you really want to leave " + window.cuName + "'s web site?";
	return confirm( question );
}

function openPrintDialog() {
	if ( window.print )
		window.print();
}

function closeWindow() {
	if ( window.close )
		window.close();
}

function remoteCall( func, args ) {
	this.func = func;
	this.args = [];
	for ( var i = 1; i < arguments.length; i++ )
		this.args.push( arguments[i] );
	this.onsuccess = null;
	this.onfault = null;
	this.onerror = null;
	this.xmlhttp = null;
}

remoteCall.prototype = {
	_stateChange: function() {
		if ( this.xmlhttp.readyState == 4 ) {
			if ( this.xmlhttp.status == 200 ) {
				var resp = new XMLRPCMessage();
				resp.fromXML( this.xmlhttp.responseXML );
				if ( this.onsuccess != null ) {
					this.onsuccess.apply(null, resp.parms[0] );
				}
			}
		}
	},
	execute: function() {
		var msg = new XMLRPCMessage();
		msg.createRequest( this.func );
		for ( var i = 0; i < this.args.length; i++ )
			msg.addParameter( this.args[i] );

		this.xmlhttp = getXmlHttp();
		this.xmlhttp.onreadystatechange = bindFunc( this._stateChange, this );
		this.xmlhttp.open( "POST", "jsRequest.asp?rnd=" + Math.random(), true );
		this.xmlhttp.send( msg.xml() );
	}
}

/**** PAGE INITIALIZATION ****/

window.initFuncs = [];
if ( !( "siteInit" in window ) ) {
	window.siteInit = function() {}
}

window.initFuncs	= [];
window.unInitFuncs	= [];

function onPageInit() {
	//
	// Adjust any links that have external, confirm, etc.
	//
	inspectLinkRels();

	//
	// Associate labels with their respective input elements.
	//
	setInputLabels();

	//
	// Replace link buttons and submit links
	//
	replaceButtonLinks();
	replaceLinkSubmits();

	//
	// Set our handler to deal with keydown events.
	//
	setupHandler( document, "keydown", keyDownDocument, true );

	//
	// Deal with the missing console object.
	//
	if ( !( "console" in window ) ) {
		var names = ["log", "debug", "warn", "error"];
		console = {};
		for ( var i in names ) {
			console[i] = function() {};
		}
		window.console = console;
	} else {
		if ( !( "debug" in window.console ) ) {
			console.debug = function( s ) { console.log( s ); };
		}
	}

	//
	// Run any requested initialization functions.
	//
	for ( var i = 0; i < window.initFuncs.length; i++ ) {
		window.initFuncs[i]();
	}

	//
	// Call this site's init function
	//
	window.siteInit();
}

function onPageUninit() {
	for ( var i = 0; i < window.unInitFuncs.length; i++ ) {
		window.unInitFuncs[i]();
	}
}

setupHandler( window, "load", onPageInit, false );
setupHandler( window, "unload", onPageUninit, false );