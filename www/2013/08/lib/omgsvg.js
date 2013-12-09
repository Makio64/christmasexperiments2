// (c) Dean McNamee <dean@gmail.com>, 2012.
//
// https://github.com/deanm/omgsvg
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

function subdivCubic(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, t) {
  // Using the naming convention of 00, 10, xy where x is the iteration step
  // of the recursive and y is the point (each step one less).  The first
  // p0 would be 00, p1 would be 01, etc.

  // de Casteljau.
  var x10 = p0x + (p1x-p0x)*t;
  var x11 = p1x + (p2x-p1x)*t;
  var x12 = p2x + (p3x-p2x)*t;
  var x20 = x10 + (x11-x10)*t;
  var x21 = x11 + (x12-x11)*t;
  var x30 = x20 + (x21-x20)*t;  // Point on the curve at |t|.
  var y10 = p0y + (p1y-p0y)*t;
  var y11 = p1y + (p2y-p1y)*t;
  var y12 = p2y + (p3y-p2y)*t;
  var y20 = y10 + (y11-y10)*t;
  var y21 = y11 + (y12-y11)*t;
  var y30 = y20 + (y21-y20)*t;  // Point on the curve at |t|.

  return [p0x, p0y, x10, y10, x20, y20, x30, y30,
          x30, y30, x21, y21, x12, y12, p3x, p3y];
}

// Subdivide a bezier based on |tolerance| flatness.  Expects |tolerance| to be
// pre-adjusted as 16*tol^2.
// Appends the points to |points| in place.
// See "Piecewise Linear Approximation of Bezier Curves" by Kaspar Fischer.
function doCubicSubdivFlatness(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                               points, tolerance) {
  var bezs = [p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y];

  for (;;) {
    var new_bezs = [ ];
    var did_subdiv = false;
    for (var i = 7, il = bezs.length; i < il; i += 8) {
      // Subdivide one cubic bezier (4 control points) in half, producing
      // 8 new control points (well, the original endpoints will remain).
      var q0x = bezs[i-7], q0y = bezs[i-6], q1x = bezs[i-5], q1y = bezs[i-4],
          q2x = bezs[i-3], q2y = bezs[i-2], q3x = bezs[i-1], q3y = bezs[i];

      var ux = 3.0*q1x - 2.0*q0x - q3x, uy = 3.0*q1y - 2.0*q0y - q3y,
          vx = 3.0*q2x - 2.0*q3x - q0x, vy = 3.0*q2y - 2.0*q3y - q0y;
      if (vx > ux) ux = vx;
      if (vy > uy) uy = vy;

      if (ux*ux + uy*uy > tolerance) {  // Subdivide if not flat enough...
        did_subdiv = true;
        var n = subdivCubic(q0x, q0y, q1x, q1y, q2x, q2y, q3x, q3y, 0.5);
        new_bezs.push(n[0], n[1],  n[2] , n[3],  n[4],  n[5],  n[6],  n[7],
                      n[8], n[9], n[10], n[11], n[12], n[13], n[14], n[15]);
      } else {  // Flat enough, keep the undivided bezier.
        new_bezs.push(q0x, q0y, q1x, q1y, q2x, q2y, q3x, q3y);
      }
    }
    bezs = new_bezs;

    if (did_subdiv === false) break;  // Nothing left to subdivide.
  }

  for (var i = 7, il = bezs.length; i < il; i += 8) {
    // Assume start point is already pushed (bezs[j-7] and bezs[j-6]).
    points.push(bezs[i-5], bezs[i-4], bezs[i-3], bezs[i-2], bezs[i-1], bezs[i]);
  }

  return points;
}

function doCubicSubdivFixed(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                            points, steps) {

  var n = 1 / (steps + 1);

  for (var t = n, i = 0; i < steps; ++i, t += n) {
    // Preform Horner's method (but only on one of the terms, the complication
    // for doing the bivariate or basis change doesn't seem worth it).  Forward
    // differencing is likely also too complicated, |steps| is likely small.
    var ti = 1 - t, ti2 = ti * ti, ti3 = ti2 * ti;
    var x30 = ti3*p0x + t*(3*ti2*p1x + t*(3*ti*p2x + t*p3x));
    var y30 = ti3*p0y + t*(3*ti2*p1y + t*(3*ti*p2y + t*p3y));
    points.push(x30, y30);
  }

  points.push(p3x, p3y);  // Assume start is already pushed, but push end.
}

function doCubicSubdiv(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                       points, subdiv_opts) {

  if (subdiv_opts.tolerance !== undefined) {  // Flatness based subdivision.
    var tolerance = 16 * subdiv_opts.tolerance * subdiv_opts.tolerance;
    doCubicSubdivFlatness(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                          points, tolerance);
  } else {  // Fixed interval evaluation.
    var steps = subdiv_opts.steps !== undefined ? subdiv_opts.steps : 1;
    doCubicSubdivFixed(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                       points, steps);
  }
}

function doCubicSubdivRel(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y,
                          points, subdiv_opts) {
  return doCubicSubdiv(p0x, p0y,
                       p0x+p1x,p0y+p1y,
                       p0x+p2x, p0y+p2y,
                       p0x+p3x, p0y+p3y,
                       points, subdiv_opts);
}

function doQuadSubdiv(p0x, p0y, p1x, p1y, p2x, p2y, points, subdiv_opts) {
  // TODO(deanm): subdivQuadratic... currently the code just elevates the
  // degree from quadratic to cubics beziers.
  return doCubicSubdiv(p0x, p0y,
                       p0x + 2/3 * (p1x-p0x), p0y + 2/3 * (p1y-p0y),
                       p2x + 2/3 * (p1x-p2x), p2y + 2/3 * (p1y-p2y),
                       p2x, p2y, points, subdiv_opts);
}

function doQuadSubdivRel(p0x, p0y, p1x, p1y, p2x, p2y, points, subdiv_opts) {
  return doQuadSubdiv(p0x, p0y,
                      p0x+p1x, p0y+p1y,
                      p0x+p2x, p0y+p2y,
                      points, subdiv_opts);
}

// NOTE(deanm): SVG numbers can also be in exponential notation, follow the
// grammar from the SVG spec:
//
// http://www.w3.org/TR/SVG/paths.html
//
// integer-constant:
//   digit-sequence
// number:
//   sign? integer-constant
//   | sign? floating-point-constant
// floating-point-constant:
//   fractional-constant exponent?
//   | digit-sequence exponent
// fractional-constant:
//   digit-sequence? "." digit-sequence
//   | digit-sequence "."
// exponent:
//   ( "e" | "E" ) sign? digit-sequence
// sign:
//   "+" | "-"
// digit-sequence:
//   digit
//   | digit digit-sequence
//
// NOTE(deanm): Handling of leading space/commas not conformant but should
// work well enough.  If we simplify the above BNF just for the case of
// number, we get something more like:
//
// number:
//   sign? (digit-sequence | fractional-constant) exponent?
//
// NOTE(deanm): At least how I looked at the BNF there is no special
// handling of leading zeros, so 000.3 should be for example.  I believe
// this would different form the JSON spec for numbers, for example.  But
// I think parseFloat should be okay with it, even though it's not a valid
// JavaScript numerical constant.
function parseSVGNumberList(str) {
    var num_re = /[+-]?(?:[0-9]*\.[0-9]+|[0-9]+\.?)(?:[eE][+-]?[0-9]+)?/g;
    var m, nums = [ ];
    while ((m = num_re.exec(str)) !== null) nums.push(parseFloat(m[0]));
    return nums;
}

// Multiply a 2x3 (implicit 3x3) matrix by another, in place.
function mul_mat_2x3(mat, A, B, C, D, E, F) {
  var a = mat[0], b = mat[1],
      c = mat[2], d = mat[3],
      e = mat[4], f = mat[5];

  mat[0] = a*A + B*c;
  mat[1] = A*b + B*d;
  mat[2] = a*C + c*D;
  mat[3] = b*C + d*D;
  mat[4] = a*E + c*F + e;
  mat[5] = b*E + d*F + f;

  return mat;  // Multiplication was in place, but return for convenience.
}

// Multiply a matrix |mat| by the operations specified in an SVG transform
// string, ie: "scale(1 2) translate(.5,8)" etc.
function applyTransformStringToMatrix(mat, transform_string) {
  var re_commands = /\s*([A-Za-z]+)\(([^\)]*)\)/g;  // Should be good enough.
  var res;
  while ((res = re_commands.exec(transform_string)) !== null) {
    var cmd = res[1];
    var args = parseSVGNumberList(res[2]);

    switch (cmd) {
      case 'matrix':  // matrix(<a> <b> <c> <d> <e> <f>)
        if (args.length !== 6) throw cmd;
        mul_mat_2x3(mat,
                    args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      case 'translate':  // translate(<tx> [<ty>])
        if (args.length === 1) args.push(0);  // default <ty>.
        if (args.length !== 2) throw cmd;
        mul_mat_2x3(mat, 1, 0, 0, 1, args[0], args[1]);
        break;
      case 'scale':  // scale(<sx> [<sy>])
        if (args.length === 1) args.push(args[0]);  // default <sy> to <sx>.
        if (args.length !== 2) throw cmd;
        mul_mat_2x3(mat, args[0], 0, 0, args[1], 0, 0);
        break;
      case 'rotate':  // rotate(<rotate-angle> [<cx> <cy>])
        if (args.length !== 1 && args.length !== 3) throw cmd;
        var a = args[0] * 0.0174532925199433;  // degrees to radians.
        var ac = Math.cos(a), as = Math.sin(a);
        if (args.length === 3) mul_mat_2x3(mat, 1, 0, 0, 1, args[1], args[2]);
        mul_mat_2x3(mat, ac, as, -as, ac, 0, 0);
        if (args.length === 3) mul_mat_2x3(mat, 1, 0, 0, 1, -args[1], -args[2]);
        break;
      case 'skewX':  // skewX(<skew-angle>)
        if (args.length !== 1) throw cmd;
        mul_mat_2x3(mat, 1, 0, Math.tan(args[0]), 1, 0, 0);
        break;
      case 'skewY':  // skewY(<skew-angle>)
        if (args.length !== 1) throw cmd;
        mul_mat_2x3(mat, 1, Math.tan(args[0]), 0, 1, 0, 0);
        break;
      default:
        throw 'Unhandled transform command: ' + cmd;
        break;
    }
  }

  return mat;  // Multiplication was in place, but return for convenience.
}


function SVGPathParser(svgstr) {
  var p = -1;
  var pl = svgstr.length;

  this.cur_cmd = function() {
    return p >= 0 && p < pl ? svgstr[p] : null;
  };

  function find_cmd(s) {
    while (s < pl) {
      switch (svgstr[s]) {
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
        case '+': case '-': case '.':
        case 'e': case 'E':
        case ',': case ' ': case '\t': case '\r': case '\n':
          ++s; break;
        default:
          return s;
      }
    }

    return null;
  }

  this.seek_next_cmd = function() {
    p = find_cmd(p + 1);
    return p !== null;
  };

  this.parse_cur_args = function() {
    var end = find_cmd(p + 1);
    var argpart = svgstr.substr(p + 1, (end === null ? pl : end) - p - 1);
    return parseSVGNumberList(argpart);
  };
}

// Contruct a series of straight line polygons from an SVG path string.
// Returns an array of arrays, one for each subpath.  Paths are represented
// as a flat array of [x, y, x, y, ...].
//
// |svgstr|: SVG path string, ex: "M123 456 L56 18".
// |subdiv_opts|: Option dictionary for how to process beziers.  |tolerance|
// specifies the minimum desired "flatness error", while |steps| evaulations
// the curve along equal spaced values for t.
function constructPolygonFromSVGPath(svgstr, subdiv_opts) {
  var paths = [ ];
  var points = null;

  var pp = new SVGPathParser(svgstr);

  var last_control_x = null, last_control_y = null;

  var curx = 0, cury = 0;

  while (pp.seek_next_cmd()) {
    var cmd = pp.cur_cmd();
    var args = pp.parse_cur_args();

    switch (cmd) {
      case 'M':  // Move, also handle extra arguments like they are an L.
        var points = [ ];
        paths.push(points);
        for (var j = 1, jl = args.length; j < jl; j += 2) {
          curx = args[j-1]; cury = args[j];
          points.push(curx, cury);
        }
        break;
      case 'm':  // Move, also handle extra arguments like they are an l.
        var points = [ ];
        paths.push(points);
        for (var j = 1, jl = args.length; j < jl; j += 2) {
          curx += args[j-1]; cury += args[j];
          points.push(curx, cury);
        }
        break;
      case 'c':  // Relative cubic.
        for (var j = 5, jl = args.length; j < jl; j += 6) {
          doCubicSubdivRel(curx, cury,
                           args[j-5], args[j-4], args[j-3], args[j-2],
                           args[j-1], args[j], points, subdiv_opts);
          last_control_x = curx + args[j-3]; last_control_y = cury + args[j-2];
          curx += args[j-1]; cury += args[j];
        }
        break;
      case 'C':  // Absolute cubic.
        for (var j = 5, jl = args.length; j < jl; j += 6) {
          doCubicSubdiv(curx, cury,
                        args[j-5], args[j-4], args[j-3], args[j-2],
                        args[j-1], args[j], points, subdiv_opts);
          last_control_x = args[j-3]; last_control_y = args[j-2];
          curx = args[j-1]; cury = args[j];
        }
        break;
      case 'q':  // Relative quadratic.
        for (var j = 3, jl = args.length; j < jl; j += 4) {
          doQuadSubdivRel(curx, cury,
                          args[j-3], args[j-2],
                          args[j-1], args[j],
                          points, subdiv_opts);
          last_control_x = curx + args[j-3]; last_control_y = cury + args[j-2];
          curx += args[j-1]; cury += args[j];
        }
        break;
      case 'Q':  // Absolute quadratic.
        for (var j = 3, jl = args.length; j < jl; j += 4) {
          doQuadSubdiv(curx, cury,
                       args[j-3], args[j-2], args[j-1], args[j],
                       points, subdiv_opts);
          last_control_x = args[j-3]; last_control_y = args[j-2];
          curx = args[j-1]; cury = args[j];
        }
        break;
      case 'l':  // Relative line.
        //if (args[0] === 0 && args[1] === 0) break;
        for (var j = 1, jl = args.length; j < jl; j += 2) {
          curx += args[j-1]; cury += args[j];
          points.push(curx, cury);
        }
        break;
      case 'L':  // Absolute line.
        for (var j = 1, jl = args.length; j < jl; j += 2) {
          curx = args[j-1]; cury = args[j];
          points.push(curx, cury);
        }
        break;
      case 'h':  // Relative horizontal.
        // As the spec says: Multiple x values can be provided (although
        // usually this doesn't make sense).
        for (var j = 0, jl = args.length; j < jl; ++j) {
          curx += args[j];
          points.push(curx, cury);
        }
        break;
      case 'H':  // Absolute horizontal.
        // As the spec says: Multiple x values can be provided (although
        // usually this doesn't make sense).
        for (var j = 0, jl = args.length; j < jl; ++j) {
          curx = args[j];
          points.push(curx, cury);
        }
        break;
      case 'v':  // Relative vertical.
        // As the spec says: Multiple y values can be provided (although
        // usually this doesn't make sense).
        for (var j = 0, jl = args.length; j < jl; ++j) {
          cury += args[j];
          points.push(curx, cury);
        }
        break;
      case 'V':  // Absolute vertical.
        // As the spec says: Multiple y values can be provided (although
        // usually this doesn't make sense).
        for (var j = 0, jl = args.length; j < jl; ++j) {
          cury = args[j];
          points.push(curx, cury);
        }
        break;
      case 'Z': case 'z':  // Close.
        if (args.length !== 0) throw args.join(',');

        // TODO(deanm): Have a mechanism to mark subpaths as closed.  We are
        // currently not saving this information, so you must just assume that
        // are paths are open or closed.  Additionally for closed paths we try
        // not to duplicate the start and end points (although this can happen
        // anyway when a curve comes back to the starting point).  Close is
        // more of a flag than an actual operation.
        //points.push(points[0]); points.push(points[1]);

        // Sort of an extra sanity measure, to make sure that we aren't pushing
        // new points onto an old (closed) subpath, in case a moveTo is missing
        // and we didn't create a new subpath.
        points = null;
        break;
      case 's':  // Relative smooth.
        // Reflect previous control point across endpoint.  Assumes previous
        // command was a c or s (see comment in w3c spec).
        // Since it's a relative command, makes the reflection math even easier.
        for (var j = 3, jl = args.length; j < jl; j += 4) {
          var rx1 = curx - last_control_x, ry1 = cury - last_control_y;
          doCubicSubdivRel(curx, cury, rx1, ry1, args[j-3], args[j-2],
                           args[j-1], args[j], points, subdiv_opts);
          last_control_x = curx + args[j-3]; last_control_y = cury + args[j-2];
          curx += args[j-1]; cury += args[j];
        }
        break;
      case 'S':  // Absolute smooth.
        for (var j = 3, jl = args.length; j < jl; j += 4) {
          var rx1 = curx - last_control_x, ry1 = cury - last_control_y;
          doCubicSubdiv(curx, cury, curx+rx1, cury+ry1, args[j-3], args[j-2],
                           args[j-1], args[j], points, subdiv_opts);
          last_control_x = args[j-3]; last_control_y = args[j-2];
          curx = args[j-1]; cury = args[j];
        }
        break;
      // TODO(deanm): Support t/T (shorthand quadratic) and a/A (arc).
      default:
        throw 'Unhandled path command: ' + cmd;
        break;
    }
  }

  return paths;
}

try {  // Module JS
  exports.parseSVGNumberList = parseSVGNumberList;
  exports.applyTransformStringToMatrix = applyTransformStringToMatrix;
  exports.SVGPathParser = SVGPathParser;
  exports.constructPolygonFromSVGPath = constructPolygonFromSVGPath;
} catch(e) { }
