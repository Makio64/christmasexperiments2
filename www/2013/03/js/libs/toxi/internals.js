// define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @module toxi/libUtils
 * contains the helper functions for the library,
 * these are intended as 'protected', you can use them but it isnt
 * intended to be used directly outside of the library.
 */

var internals = {};

var hasProperties = function(subject,properties){
	if(subject === undefined || typeof subject != 'object'){
		return false;
	}
	var i = 0,
		len = properties.length,
		prop;
	for(i = 0; i < len; i++){
		prop = properties[i];
		if(!(prop in subject)){
			return false;
		}
	}
	return true;
};

internals.tests = {
	hasXY: function( o ){
		return hasProperties(o, ['x','y']);
	},
	hasXYZ: function( o ){
		return hasProperties(o, ['x','y','z']);
	},
	hasXYWidthHeight: function( o ){
		return hasProperties( o, ['x','y','width','height']);
	},
	// isArray: isArray,
	isAABB: function ( o ){
		return hasProperties(o, ['setExtent','getNormalForPoint']);
	},
	isCircle: function( o ){
		return hasProperties( o, ['getCircumference','getRadius','intersectsCircle']);
	},
	isLine2D: function( o ){
		return hasProperties(o, ['closestPointTo','intersectLine','getLength']);
	},
	isMatrix4x4: function( o ){
    	return hasProperties( o, ['identity', 'invert', 'setFrustrum']);
	},
	isRect: function( o ){
		return hasProperties(o, ['x','y','width','height','getArea','getCentroid','getDimensions']);
	},
	isSphere: function( o ){
		return hasProperties(o, ['x','y','z','radius','toMesh']);
	},
	isTColor: function( o ){
		return hasProperties(o, ['rgb','cmyk','hsv']);
	},
	isParticleBehavior: function( o ){
		return hasProperties(o, ['applyBehavior','configure']);
	},
	isVerletParticle2D: function( o ){
		return hasProperties(o, ['x','y','weight']);
	}
};