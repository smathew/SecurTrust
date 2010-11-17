//
// *********** DO NOT MODIFY THIS FILE ***********
// This file was automatically generated from functions.asp.
// Generated: 06/24/2010 9:43:17
//
function getGenDate() {
	return fmtDate( new Date(), "%0D %T" );
}

// ------ Change Log -------
// Date        Programmer Description
if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function getHBLocale() {
	return "en-US";
}


/* Adds object oriented inheritance to Javascript!  Yay! */
function extend(descendant, base_class, extension_dict) {
	function wrap(func, base_class_func) {
		return function() {
			var prev = this.$base_class_func;
			this.$base_class_func = base_class_func;
			try { return func.apply(this, arguments); }
			finally { this.$base_class_func = prev; }
		}
	}
	function wrap_ctor(ctor, old_ctor) {
		return function() {
			var prev = this.$base_ctor;
			this.$base_ctor = old_ctor;
			try { return ctor.apply(this, arguments); }
			finally { this.$base_ctor = prev; }
		}
	}

	/*
	 * Copy over all of base_class's methods
	 */
	for (var m in base_class.prototype) {
		descendant.prototype[m] = base_class.prototype[m];
	}

	/*
	 * Wrap the base constructor
	 */
	var old_base_ctor = base_class.prototype['$base_ctor'];
	if (old_base_ctor) {
		descendant.prototype['$base_ctor'] = wrap_ctor(base_class, old_base_ctor);
	} else {
		descendant.prototype['$base_ctor'] = base_class;
	}

	/*
	 * Now add all of the child methods, wrapping if necessary
	 */
	for (var m in extension_dict) {
		var val = extension_dict[m];
		/*
		 * Make sure we're actually overriding a function, and that the overridden
		 * function is referenced with $base_class_func().
		 */
		if (base_class.prototype[m] && val.toString().indexOf("$base_class_func") != -1) {
			descendant.prototype[m] = wrap(val, base_class.prototype[m]);
		} else {
			descendant.prototype[m] = val;
		}
	}
}

function clone( obj ) {
	var newObj = ( obj instanceof Array ) ? [] : {};
	for ( i in obj ) {
		if ( obj[i] && typeof( obj[i] ) == "object" ) {
			newObj[i] = clone( obj[i] );
		} else {
			newObj[i] = obj[i];
		}
	}
	return newObj;
};

function setAttrs( obj, attrs ) {
	for ( k in attrs ) {
		obj.setAttribute( k, attrs[k] );
	}
}

function getXmlHttp(){
	var xmlhttp=false;
	try {
		xmlhttp = new ActiveXObject( "Msxml2.XMLHTTP" );
	} catch ( e ) {
		try {
			xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
		} catch ( E ) {
			xmlhttp = false;
		}
	}
	if ( !xmlhttp && typeof XMLHttpRequest != 'undefined' ) {
		try {
			xmlhttp = new XMLHttpRequest();
		} catch ( e ) {
			xmlhttp = false;
		}
	}
	if ( !xmlhttp && window.createRequest ) {
		try {
			xmlhttp = window.createRequest();
		} catch ( e ) {
			xmlhttp = false;
		}
	}
	return xmlhttp;
}

function XMLRPCMessage( ) {
	_XMLRPCMessage_( this );
	this.impl = this.IMPL_UNKNOWN;
	this._init();
}

function _XMLRPCMessage_( obj ) {
	if ( obj.prototyped )
		return;

	XMLRPCMessage.prototype = {
		validTypes: ["int", "i4", "string", "double", "boolean", "struct", "array"],

		XMLRPC_UNKNOWN: -1,
		XMLRPC_REQUEST: 1,
		XMLRPC_RESPONSE: 2,

		IMPL_UNKNOWN: -1,
		IMPL_MOZILLA: 1,
		IMPL_IE: 2,

		ELEMENT_NODE: 1,
		TEXT_NODE: 3,

		_init: function() {
			this.type = this.XMLRPC_UNKNOWN;
			this.func = null;
			this.parms = [];
			this.faultCode = 0;
			this.faultText = "";
			this.doc = null;
			if ( this.impl == this.IMPL_UNKNOWN )
				this.impl = this._detectImpl();
		},
		_detectImpl: function () {
			if ( typeof( window) == "undefined" ) {
				// running on the server
				return this.IMPL_IE;
			} else {
				// running in the browser
				if ( document.implementation && document.implementation.createDocument ) {
					if ( typeof ( Element.prototype.selectSingleNode ) == "undefined" ) {
						Element.prototype.selectSingleNode = function(sXPath) {
							var oEvaluator = new XPathEvaluator();
							var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
							if (oResult != null) {
								return oResult.singleNodeValue;
							} else {
								return null;
							}
						};
					}
					return this.IMPL_MOZILLA;
				} else if ( window.ActiveXObject )
					return this.IMPL_IE;
				else
					return this.IMPL_UNKNOWN;
			}
		},
		_createDoc: function( ) {
			var rootNode = "UNDEFINED";
			if ( this.type == this.XMLRPC_REQUEST )
				rootNode = "methodCall";
			else if ( this.type == this.XMLRPC_RESPONSE )
				rootNode = "methodResponse";

			if ( this.impl == this.IMPL_MOZILLA ) {
				return document.implementation.createDocument( "", rootNode, null );
			} else if ( this.impl == this.IMPL_IE ) {
				var doc = null;
				try {
					doc = new ActiveXObject( "MSXML2.DOMDocument" );
				} catch ( e ) {}
				if ( doc == null ) {
					try {
						doc = new ActiveXObject( "MSXML2.DOMDocument.3.0" );
					} catch ( e ) {}
				}
				if ( doc != null )
					doc.documentElement = doc.createElement( rootNode );
				return doc;
			} else {
				return null;
			}
		},
		_getDataType: function( obj ) {
			if ( obj == null )
				return "nil";

			var type = typeof( obj );
			type = type.toLowerCase();
			switch( type ) {
				case "number":
					type = "int";
					if ( Math.round( obj ) != obj )
						type = "double";
					break;
				case "object":
					var con = obj.constructor;
					if ( con == Date )
						type = "date";
					else if ( con == Array )
						type = "array";
					else
						type = "struct";
					break;
			}
			return type;
		},
		_fromElement: function( elem ) {
			var type = elem.nodeName.toLowerCase();
			var node = null;
			var retval = null;
			
			switch ( type ) {
				case "string":
				case "int":
				case "i4":
				case "double":
				case "boolean":
				case "date":
					for ( var i = 0; i < elem.childNodes.length; i++ ) {
						node = elem.childNodes[i];
						if ( node.nodeType == this.TEXT_NODE ) {
							if ( type == "string" )
								retval =  node.nodeValue;
							else if ( type == "int" || type == "i4" )
								retval = parseInt( node.nodeValue );
							else if ( type == "double" )
								retval = parseFloat( node.nodeValue );
							else if ( type == "boolean" )
								retval = node.nodeValue == "1" ? true : false;
							else if ( type == "date" )
								retval = new Date( node.nodeValue );
							break;
						}
					}
					break;
				case "boolean":
				case "array":
					var data = elem.selectSingleNode( "data" );
					if ( data == null )
						throw "Error parsing array element.";

					retval = [];
					var children = data.childNodes;
					for ( var i = 0; i < children.length; i++ ) {
						if ( children[i].nodeType == this.ELEMENT_NODE && children[i].nodeName.toLowerCase() == "value" ) {
							var node = children[i];
							for ( var j = 0; j < node.childNodes.length; j++ ) {
								if ( node.childNodes[j].nodeType == this.ELEMENT_NODE ) {
									retval.push( this._fromElement( node.childNodes[j] ) );
									break;
								}
							}
						}
					}
					break;
				case "struct":
					retval = {};
					var child = null;
					var node = null;
					var val = null;
					var name = null;
					for ( var i = 0; i < elem.childNodes.length; i++ ) {
						child = elem.childNodes[i];
						if ( child.nodeType == this.ELEMENT_NODE && child.nodeName.toLowerCase() == "member" ) {
							name = null;
							val = null;
							for ( var j = 0; j < child.childNodes.length; j++ ) {
								if ( child.childNodes[j].nodeType == this.ELEMENT_NODE ) {
									if ( child.childNodes[j].nodeName.toLowerCase() == "name" )
										name = child.childNodes[j].firstChild.nodeValue;
									else if ( child.childNodes[j].nodeName.toLowerCase() == "value" )
										val = child.childNodes[j];
								}
							}

							if ( name == null )
								continue;
							if ( val == null )
								continue;

							for ( var j = 0; j < val.childNodes.length; j++ ) {
								node = val.childNodes[j];
								if ( node.nodeType == this.ELEMENT_NODE ) {
									retval[name] = this._fromElement( node );
									break;
								}
							}
						}
					}
					break;
			}

			return retval;
			
		},
		_toElement: function( obj ) {
			var type	= this._getDataType( obj );
			var elem	= this.doc.createElement( type );

			switch (type ) {
				case "string":
				case "int":
				case "double":
				case "date":
					elem.appendChild( this.doc.createTextNode( obj ) );
					break;
				case "boolean":
					elem.appendChild( this.doc.createTextNode( obj == true ? 1 : 0 ) );
					break;
				case "array":
					var data = this.doc.createElement( "data" );
					for ( var i = 0; i < obj.length; i++ ) {
						var val = this.doc.createElement( "value");
						val.appendChild( this._toElement( obj[i] ) );
						data.appendChild( val );
					}
					elem.appendChild( data );
					break;
				case "struct":
					for ( var i in obj ) {
						var member = this.doc.createElement( "member" );
						var name = this.doc.createElement( "name" );
						name.appendChild( this.doc.createTextNode( i ) );
						member.appendChild( name );
						var val = this.doc.createElement( "value" );
						val.appendChild( this._toElement( obj[i] ) );
						member.appendChild( val );
						elem.appendChild( member );
					}
					break;					
			}

			return elem;
		},
		createRequest: function( func ) {
			this._init();
			this.type = this.XMLRPC_REQUEST;
			this.meth = func;
		},
		createResponse: function() {
			this._init();
			this.type = this.XMLRPC_RESPONSE;
		},
		addParameter: function( obj ) {
			this.parms.push( obj );
		},
		setFault: function( code, text ) {
			this.faultCode = code;
			this.faultText = text;
		},
		fromXML: function( xml ) {
			var type = xml.documentElement.nodeName.toLowerCase();
			if ( type == "methodcall" )
				this.type = this.XMLRPC_REQUEST;
			else if ( type == "methodresponse" )
				this.type = this.XMLRPC_RESPONSE;
			else
				throw "Unknown message type:" + type;

			if ( this.type == this.XMLRPC_REQUEST ) {
				var mc = xml.getElementsByTagName( "methodName" );
				if ( mc == null || mc.length <= 0 )
					throw "Unable to find methodName.";
				this.meth = mc[0].childNodes[0].nodeValue;
			}

			var pNodes = xml.getElementsByTagName( "params" );
			if ( pNodes != null && pNodes.length > 0 ) {
				var params = pNodes[0].getElementsByTagName( "param" );
				var param = null;
				var val = null;
				var elem = null;
				for ( var i = 0; i < params.length; i++ ) {
					param = params[i];
					for ( var j = 0; j < param.childNodes.length; j++ ) {
						val = param.childNodes[j];
						if ( val.nodeType == this.ELEMENT_NODE && val.nodeName.toLowerCase() == "value" ) {
							for ( var k = 0; k < val.childNodes.length; k++ ) {
								elem = val.childNodes[k];
								if ( val.nodeType == this.ELEMENT_NODE && this.validTypes.indexOf( elem.nodeName.toLowerCase() ) != -1 ) {
									this.parms.push( this._fromElement( elem ) );
									break;
								}
							}
							break;
						}
					}
				}
			}
		},
		fromString: function( str ) {
			this._init();
			var doc = null;
			if ( this.impl == this.IMPL_MOZILLA ) {
				doc = ( new DOMParser() ).parseFromString( str, "application/xml" );
			} else if ( this.impl == this.IMPL_IE ) {
				doc = this._createDoc();
				doc.async = false;
				doc.loadXML( str );
			} else {
				throw "Unknown implementation: " + this.impl;
			}
			return this.fromXML( doc );
		},
		xml: function() {
			if ( this.doc == null ) {
				this.doc = this._createDoc();

				switch ( this.type ) {
					case this.XMLRPC_REQUEST:
						var methNode = this.doc.createElement( "methodName" );
						methNode.appendChild( this.doc.createTextNode( this.meth ) );
						this.doc.documentElement.appendChild( methNode );

						if ( this.parms.length > 0 ) {
							var params = this.doc.createElement( "params" );
							var param = null;
							var val = null;
							for ( var i = 0; i < this.parms.length; i++ ) {
								param = this.doc.createElement( "param" );
								val = this.doc.createElement( "value" );
								val.appendChild( this._toElement( this.parms[i] ) );
								param.appendChild( val );
								params.appendChild( param );
							}
							this.doc.documentElement.appendChild( params );
						}
						break;
					case this.XMLRPC_RESPONSE:
						if ( this.parms.length > 0 ) {
							var params = this.doc.createElement( "params" );
							var param = this.doc.createElement( "param" );
							var val = this.doc.createElement( "value" );
							if ( this.parms.length > 1 ) {
								val.appendChild( this._toElement( this.parms ) );
							} else {
								val.appendChild( this._toElement( this.parms[0] ) );
							}
							param.appendChild( val );
							params.appendChild( param );
							this.doc.documentElement.appendChild( params );
						}
						break;
					default:
						throw "Unknown message type: " + this.type;
				}
				if ( this.faultCode > 0 ) {
					var fault = this.doc.createElement( "fault " );
					var val = this.doc.createElement( "value" );
					val.appendChild( this._toElement( {"faultCode": this.faultCode, "faultString": this.faultText} ) );
					fault.appendChild( val );
					this.doc.documentElement.appendChild( params );
				}
			}

			var resp = '<?xml version="1.0"?>';
			if ( this.impl == this.IMPL_MOZILLA )
				resp +=  ( new XMLSerializer()).serializeToString( this.doc );
			else
				resp +=  this.doc.xml;

			return resp;
		}
	};

	for ( var i in XMLRPCMessage.prototype )
		obj[i] = XMLRPCMessage.prototype[i];
}

function bindFunc( func, self ) {
	var newFunc = function () {
		var args = null;
		var me = arguments.callee;
		if ( me.im_args != null ) {
			args = [].concat( me.im_args );
			for ( var i = 0; i < arguments.length; i++ ) {
				args.push( arguments[i] );
			}
		} else {
			args = arguments;
		}
		var self = me.im_self;
		return me.im_func.apply(self, args);
	};
	newFunc.im_self = self;
	newFunc.im_func = func;
	newFunc.im_args = null;
	var newArgs = [];
	if ( arguments.length > 2 ) {
		for ( var i = 2; i < arguments.length; i++ ) {
			newArgs.push( arguments[i] );
		}
	}
	if ( newArgs.length > 0 )
		newFunc.im_args = newArgs;
	return newFunc;
}

function $HBC( val ) {
	function _getConfig() {
		var obj = HBConfig;
		for ( var i = 0; i < arguments.length; i++ ) {
			obj = obj[arguments[i]];
			if ( obj == null )
				break;
		}
		return obj;
	}

	var args = val.split( "=>" );
	switch ( args[0] ) {
		case "S":
			args[0] = "settings";
			break;
		case "L":
			args[0] = "language";
			break;
		case "E":
			args[0] = "errors";
			break;
		case "D":
			args[0] = "debug";
			break;
		case "C":
			args[0] = "cuParams";
			break;
		default:
			throw "Unknown config type: " + args[0];
	}

	return _getConfig.apply( null, args );
}

function getEnv( ) {
	if ( typeof( window ) == "undefined" )
		return "SERVER";
	else
		return "CLIENT";
}
function debugEnabled() {
	if ( getEnv() == "CLIENT" )
		return window.debugEnabled;
	else
		return $HBC( "D=>enabled" );
}

function errorEnabled() {
	if ( getEnv() == "CLIENT" )
		return window.errorEnabled;
	else
		return $HBC( "E=>enabled" );
}

function debugLine( s ) {
	if( !debugEnabled() )
		return;

	var line = fmtDate( new Date(), "%0D %T: " ) + s;

	if ( getEnv() == "CLIENT" ) {
		if ( typeof( window.console ) != "undefined" && typeof( window.console.debug ) != "undefined" )
			window.console.debug( line.replace( "%", "%%" ) );
	} else {
		var objFSO, objTextFile;
		var sRead, sReadLine, sReadAll;
		var ForReading = 1, ForWriting = 2, ForAppending = 8;
		
		objFSO = new ActiveXObject("Scripting.FileSystemObject");
		objTextFile = objFSO.OpenTextFile( $HBC( "D=>fileName" ), ForAppending, true );
		objTextFile.WriteLine( line );
		objTextFile.Close();
	}
}

function reportError( err, ex ) {
	if ( errorEnabled() ) {
		try {
			var objFSO = new ActiveXObject( "Scripting.FileSystemObject" );
			var objTextFile = objFSO.OpenTextFile( $HBC( "E=>fileName" ), 8, true );
			objTextFile.WriteLine( "=============================================" );
			objTextFile.WriteLine( fmtDate( new Date(), "%D %T" ) + " " + Request.ServerVariables( "SERVER_NAME" ) );
			objTextFile.WriteLine( "Page:     " + Request.ServerVariables( "SCRIPT_NAME" ) );
			var errLines = err.split( "\n" );
			objTextFile.WriteLine( "Error:    " + errLines[0] );
			for ( var i = 1; i < errLines.length; i++ )
				objTextFile.WriteLine( errLines[i] );

			if ( ex != null ) {
				objTextFile.WriteLine( "Type:     " + ex.name );
				objTextFile.WriteLine( "Message:  " + ex.message );
			}
			objTextFile.Close();
		} catch( e ) {
			Response.Clear();
			Response.Write( sprintf( "Page:     %s<br />\n", Request.ServerVariables( "SCRIPT_NAME" ) ) );
			var errLines = err.split( "\n" );
			Response.Write( sprintf( "Error:    %s<br />\n", errLines[0] ) );
			for ( var i = 1; i < errLines.length; i++ )
				Response.Write( sprintf( "%s<br />\n", errLines[i] ) );

			if ( ex != null ) {
				Response.Write( sprintf( "Type:     %s<br />\n", ex.name ) );
				Response.Write( sprintf( "Message:  %s<br />\n", ex.message ) );
			}
			Response.Flush();
			Response.End();
		}
	}
}

function checkEmail( email ) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if ( !filter.test( email ) )
		return false;
	else
		return true;
}

function arrayStringContains( str, sub, sep ) {
	if ( sep == null )
		sep = " ";
	var arr = str.split( sep );
	if ( arr.indexOf( sub ) == -1 )
		return false;
	else
		return true;
}

function stripQuotes( str ) {									
	var strWork  = "" + str;
	var rtnString = "";
	var tmpChar = "";
	for ( i = 0; i < strWork.length; i++ ) {
		tmpChar = strWork.charAt(i);
		if ( tmpChar != "'" )
			rtnString += tmpChar;
	}
	return rtnString;
}

function pad( field, chr, len ) {
	var strField = "";
	if ( field != null && typeof( field ) != "undefined" )
		strField = field.toString();

	while ( strField.length < len )
		strField = strField + chr;

	return strField;
}

function padLeft( field, chr, len ) {
	var strField = "";
	if ( field != null && typeof( field ) != "undefined" )
		strField = field.toString();

	while ( strField.length < len )
		strField = chr + strField;
	return strField;
}

function padRight( field, chr, len ) {
	var strField = "";
	if ( field != null && typeof( field ) != "undefined" )
		strField = field.toString();

	while ( strField.length < len )
		strField = strField + chr;
	return strField;
}

function sprintf() {
	function _format( match, sign ) {
		if ( sign )
			match.sign = match.negative ? '-' : match.sign;
		else
			match.sign = '';

		var l = match.min - match.argument.length + 1 - match.sign.length;
		var pad = new Array( l < 0 ? 0 : l ).join( match.pad );

		return pad + match.sign + match.argument;
	}

	if ( typeof( arguments ) == "undefined" ) return null;
	if ( arguments.length < 1 ) return null;
	if ( typeof( arguments[0] ) != "string" ) return null;
	if ( typeof( RegExp ) == "undefined" ) return null;

	//var exp = new RegExp( /(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g );

	var string		= arguments[0];
	var exp			= new RegExp( /(%([%]|(0)?(\d+)?(\.(\d)?)?([sdf])))/g );
	var matches 	= [];
	var strings 	= [];
	var match		= null;
	var argIdx		= 0;
	var strPosBeg	= 0;
	var strPosEnd	= 0;
	var matchPosEnd	= 0;
	var newstring	= "";

	while ( ( match = exp.exec( string ) ) != null ) {
		if ( match[7] ) argIdx += 1;

		strPosBeg = matchPosEnd;
		strPosEnd = exp.lastIndex - match[0].length;
		strings.push( string.substring( strPosBeg, strPosEnd ) );
		matchPosEnd = exp.lastIndex;

		matches.push( {
			match: match[0],
			pad: match[3] || ' ',
			min : match[4] || 0,
			precision: match[6],
			code: match[7] || "%",
			sign: '',
			negative: parseInt( arguments[argIdx] ) < 0 ? true : false,
			argument: String( arguments[argIdx] )
		} );
	}

	strings.push( string.substring( matchPosEnd ) );

	var subst = "";
	for ( var i = 0; i < matches.length; i++ ) {
		switch ( matches[i].code ) {
			case "%":
				subst = "%";
				break;
			case "d":
				matches[i].argument = String( Math.abs( parseInt( matches[i].argument ) ) );
				subst = _format( matches[i], true );
				break;
			case "f":
				matches[i].argument = String( Math.abs( parseFloat( matches[i].argument ) ).toFixed( matches[i].precision ? matches[i].precision : 6 ) );
				subst = _format( matches[i], true );
				break;
			case "s":
				subst = _format( matches[i], false );
				break;
			default:
				subst = matches[i].match;
		}
		newstring += strings[i];
		newstring += subst;
	}
	newstring += strings[i];

	return newstring;
}

function fmtDate( dateObj, fmt ) {
	if ( dateObj == null || typeof( dateObj ) == "undefined" || dateObj == "" )
		return "";

	// Poor man's strftime()
	var dt = new Date( dateObj );
	
	if ( fmt == "%D" && typeof( vbFmtDate ) != "undefined" ) {
		dt = new Date( dt );
		return vbFmtDate( dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), false );
	}

	var m = String( dt.getMonth() + 1 );
	var d = String( dt.getDate() );
	var y = String( dt.getYear() );
	var y = dt.getFullYear();
	if ( y < 2000 )
		y = String( y % 1900 );
	else
		y = String ( y % 2000 );
	var Y = String( dt.getFullYear() );
	var H = String( dt.getHours() );
	var M = String( dt.getMinutes() );
	var S = String( dt.getSeconds() );

	// %D  == %m/%d/%Y
	// %0D == %0m/%0d/%Y
	// %-D == %-m/%-d/%Y
	// %T  == %H:%0M:%0S

	var str = fmt.replace( /%D/,	"%m/%d/%Y" );
		str = str.replace( /%0D/,	"%0m/%0d/%Y" );
		str = str.replace( /%-D/,	"%-m/%-d/%Y" );
		str = str.replace( /%-m/g,	padLeft( m, " ", 2 ) );
		str = str.replace( /%0m/g,	padLeft( m, "0", 2 ) );
		str = str.replace( /%m/g,	m );
		str = str.replace( /%-d/g,	padLeft( d, " ", 2 ) );
		str = str.replace( /%0d/g,	padLeft( d, "0", 2 ) );
		str = str.replace( /%d/g,	d );
		str = str.replace( /%y/g,	padLeft( y, "0", 2 ) );
		str = str.replace( /%Y/g,	Y);
		str = str.replace( /%T/g,	"%H:%0M:%0S" );
		str = str.replace( /%0T/g,	"%0H:%0M:%0S" );
		str = str.replace( /%-T/g,	"%-H:%-M:%-S" );
		str = str.replace( /%-H/g,	padLeft( H, " ", 2 ) );
		str = str.replace( /%0H/g,	padLeft( H, "0", 2 ) );
		str = str.replace( /%H/g,	H );
		str = str.replace( /%-M/g,	padLeft( M, " ", 2 ) );
		str = str.replace( /%0M/g,	padLeft( M, "0", 2 ) );
		str = str.replace( /%M/g,	M );
		str = str.replace( /%-S/g,	padLeft( S, " ", 2 ) );
		str = str.replace( /%0S/g,	padLeft( S, "0", 2 ) );
		str = str.replace( /%S/g,	S );

	return str;
}

function fmtCurrency( field, addComma ) {
	var num = "0";
	if ( field != null && typeof( field ) != "undefined" && field != "" )
		num = field.toString().replace(/\$|\,/g, "");

	if ( isNaN( num ) )
		num = "0";

	var val = parseFloat(num).toFixed(2);
	var str = val.toString();
	var x = str.split(".");
	var dollars = x[0];
	var cents = pad( ( x.length > 1 ? x[1] : "" ), "0", 2 );

	if ( addComma != false ) {
		var re = /(\d+)(\d{3})/;
		while ( re.test( dollars ) )
			dollars = dollars.replace( re, "$1" + "," + "$2" );
	}

	return dollars + "." + cents;
}

function fmtPostalCode( field ) {
	var fld = "";
	if ( typeof( field ) == "undefined" || String( field ) == "" )
		return "";

	fld = String( field );

	if ( fld.length > 5 && fld.indexOf( "-" ) == -1 )
		fld = fld.substring( 0, 5 ) + "-" + fld.substring( 5 );

	return fld;
}

function fmtPhone( field ) {
	var fld = "";
	if ( typeof( field ) == "undefined" || String( field ) == "" )
		return "";

	fld = String( field );

	fld = fld.replace( /[^0-9]/g, "" );

	if ( fld.length == 7 )
		return fld.substring( 0, 3 ) + "-" + fld.substring( 3 );
	else if ( fld.length == 10 )
		return "(" + fld.substring( 0, 3 ) + ") " + fld.substring( 3, 6 ) + "-" + fld.substring( 6 );
	else
		return fld;
}

function fmtTaxID( field ) {
	var fld = "";
	if ( typeof( field ) == "undefined" || String( field ) == "" )
		return "";

	fld = String( field ).replace( /[^0-9]/g, "" ).trim();
	fld = padLeft( fld, "0", 9 );

	fld = fld.replace( /^([0-9]{3})([0-9]{2})([0-9]{4})$/, "$1-$2-$3" );
	return fld;
}

function buildAcctStr( suffix, desc ) {
	var retStr = sprintf( "%s-%s%s", suffix.account, suffix.suffixType, suffix.Suffix );
	if ( desc == true ) {
		retStr += " " + translate( suffix.description );
		if ( suffix.isClosed )
			retStr += " - " + translate( "Closed" );
	}
	return retStr;
}

function getStates() {
	return [
		"AL",
		"AK",
		"AS",
		"AZ",
		"AR",
		"CA",
		"CO",
		"CT",
		"DE",
		"DC",
		"FM",
		"FL",
		"GA",
		"GU",
		"HI",
		"ID",
		"IL",
		"IN",
		"IA",
		"KS",
		"KY",
		"LA",
		"ME",
		"MH",
		"MD",
		"MA",
		"MI",
		"MN",
		"MS",
		"MO",
		"MT",
		"NE",
		"NV",
		"NH",
		"NJ",
		"NM",
		"NY",
		"NC",
		"ND",
		"MP",
		"OH",
		"OK",
		"OR",
		"PW",
		"PA",
		"PR",
		"RI",
		"SC",
		"SD",
		"TN",
		"TX",
		"UT",
		"VT",
		"VI",
		"VA",
		"WA",
		"WV",
		"WI",
		"WY"
	];
}

function insertAfter( elem, newElem ) {
	var e = $( elem );
	if ( e.nextSibling == null ) {
		e.parentNode.appendChild( newElem );
	} else {
		e.parentNode.insertBefore( newElem, e.nextSibling );
	}
}

function convertChars( str, maxChars ) {					
	var newString = "";
	var c = "";
	var x = "";
	var key = "";
	var specialChars = {
		"&": "&amp;",
		">": "&gt;",
		"<": "&lt;"
	};
	for ( var i = 0; i < str.length; i++ ) {
		c = str.charAt(i);
		x = c;
		for ( key in specialChars ) {
			if ( key == c ) {
				if ( newString.length + specialChars[key].length > maxChars && maxChars != 0)
					x = "";
				else
					x = specialChars[key];
				break;
			}
		}

		// No match
		if ( newString.length + x.length > maxChars && maxChars != 0)
			break;
		else
			newString += x;
	}
	return newString;
}

/*******************************/
/*        DATE ROUTINES        */
/*******************************/
function compareDates( date1, date2 ) {
	var dt = new Date( date1 );
	var dt1 = new Date( dt.getFullYear(), dt.getMonth(), dt.getDate() );

	dt = new Date( date2 );
	var dt2 = new Date( dt.getFullYear(), dt.getMonth(), dt.getDate() );
	if ( dt1 > dt2 )
		return 1;
	else if ( dt2 > dt1 )
		return -1;
	else
		return 0;
}

function getDaysofYear( year )  {
	var feb = 28;
    if ( leapYear( year ) )
        feb = 29;
    return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
}

function leapYear ( year ) {
	return ( ( year % 4 == 0 ) && ( year % 100 != 0 ) ) || ( year % 400 == 0 );
}

function customEndDate( dateObj, fmt ) {
	var dt = new Date( dateObj );
	dt.setDate( getDaysofYear( dt.getFullYear() )[dt.getMonth()] );
	return fmtDate( dt, fmt );
}

function currentDate( fmt ) {
	return fmtDate( new Date(), fmt );
}

function moveDate( days, dt, fmt ) {
	var dateObj = new Date( dt );
	dateObj.setDate( dateObj.getDate() + days );
	return fmtDate( dateObj, fmt );
}

function daysPrior( daysBack, fmt ) {
	return moveDate( -daysBack, new Date(), fmt );
}

function daysAhead( daysAhead, fmt ) {
	return moveDate( daysAhead, new Date(), fmt );
}

function thirtyDaysPrior( dateObj , fmt ) {
	var dt = new Date( dateObj );
	var year = dt.getFullYear();
	var month = dt.getMonth() - 1;
	if ( month == -1 ) {
		year--;
		month = 11;
	}
	var days = getDaysofYear( year )[month];
	var day = Math.abs( dt.getDate() - days );
	day = days - day;

	dt.setFullYear( year, month, day );

	return fmtDate( dt, fmt );
}

function checkPhoneNum( strPhone ) {
	re_PHONE1 = /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/;
	var fld = "";
	if ( typeof( strPhone ) == "undefined" || String( strPhone ).length == 0 )
		return false;
	fld = String( strPhone ).trim();
	if ( re_PHONE1.exec( fld ) )
		return true;
	return false;
}

function checkTaxID( strTaxID ) {
	re_TAX = /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/;
	var fld = "";
	if ( typeof( strTaxID ) == "undefined" || String( strTaxID ) == "" )
		return false;
	fld = String( strTaxID );
	if ( re_TAX.exec( fld.trim() ) )
		return true;

	return false;
}
var DATE_VALID = 0;
var DATE_INVALID_FORMAT = -1;
var DATE_INVALID_DAY = -2;
var DATE_INVALID_MONTH = -3;
var DATE_INVALID_YEAR = -4;
var RE_NUM = /^\-?\d+$/;

function checkDate( strDate ) {
	strDate = String( strDate );
	var arr_date = strDate.split('/');
	if ( arr_date.length != 3 ) return DATE_INVALID_FORMAT;
	
	if ( !arr_date[0] ) return DATE_INVALID_MONTH;
	if ( !RE_NUM.exec( arr_date[0] ) ) return DATE_INVALID_MONTH;
	if ( arr_date[0] < 1 || arr_date[0] > 12 ) return DATE_INVALID_MONTH;

	if ( !arr_date[1] ) return DATE_INVALID_DAY;
	if ( !RE_NUM.exec( arr_date[1] ) ) return DATE_INVALID_DAY;
	if ( arr_date[1] < 1 || arr_date[1] > 31 ) return DATE_INVALID_DAY;

	if ( !arr_date[2] ) return DATE_INVALID_YEAR;
	if ( !RE_NUM.exec( arr_date[2] ) ) return DATE_INVALID_YEAR;
	if ( arr_date[2].length < 4 ) return DATE_INVALID_YEAR;

	var dt_date = new Date( fmtDate( strDate, "%D" ) );
	if ( dt_date.getMonth() != ( arr_date[0] - 1 ) ) return DATE_INVALID_DAY;

	return DATE_VALID;
}

