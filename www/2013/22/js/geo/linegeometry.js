Acko.LineStripGeometry = function (n, m, transpose) {
  m = m || 1;

  if (transpose) {
    t = n;
    n = m;
    m = t;
  }

  var triangles = (n - 1) * 2;
  var points = n * 2;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('index', Uint16Array, triangles * 3 * m, 1);
  geometry.addAttribute('position', Float32Array, points * m, 3);
  geometry.addAttribute('line', Float32Array, points * m, 2);

  var indices   = geometry.attributes.index.array;
  var positions = geometry.attributes.position.array;
  var lines     = geometry.attributes.line.array;

  var base;
  for (var l = 0; l < m; ++l) {
    base = l * triangles / 2;

    for (var i = 0, j = base * 6; i < triangles; i += 2) {
      var k = i + base * 2 + 2 * l;

      indices[j++] = k;
      indices[j++] = k + 1;
      indices[j++] = k + 2;

      indices[j++] = k + 2;
      indices[j++] = k + 1;
      indices[j++] = k + 3;
    }

    base = l * n;

    for (var i = 0, j = base * 6, k = base * 4; i < n; i++) {
      var x = transpose ? l : i;
      var y = transpose ? i : l

      var edge = (x == 0) ? -1 : ((x == n - 1) ? 1 : 0);

      positions[j++] = x;
      positions[j++] = y;
      positions[j++] = 0;

      positions[j++] = x;
      positions[j++] = y;
      positions[j++] = 0;

      lines[k++] = edge;
      lines[k++] = 1;

      lines[k++] = edge;
      lines[k++] = -1;
    }
  }

  geometry.offsets = [
    {
      index: 0,
      start: 0,
      count: triangles * 3 * m,
    },
  ];

  return geometry;
}

Acko.LinesGeometry = function (n, m, transpose) {
  n = Math.floor(n/2) * 2;
  m = m || 1;

  if (transpose) {
    t = n;
    n = m;
    m = t;
  }

  var points = n * 2;
  var triangles = n;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('index', Uint16Array, triangles * 3 * m, 1);
  geometry.addAttribute('position', Float32Array, points * m, 3);
  geometry.addAttribute('line', Float32Array, points * m, 2);

  var indices   = geometry.attributes.index.array;
  var positions = geometry.attributes.position.array;
  var lines     = geometry.attributes.line.array;

  var base;
  for (var l = 0; l < m; ++l) {
    base = l * n;

    for (var i = 0, j = base * 6, k = base * 4; i < triangles; i++, k += 4) {
      indices[j++] = k;
      indices[j++] = k + 1;
      indices[j++] = k + 2;

      indices[j++] = k + 2;
      indices[j++] = k + 1;
      indices[j++] = k + 3;
    }

    base = l * n;

    for (var i = 0, j = base * 6, k = base * 4; i < n; i++) {

      var x = transpose ? l : i;
      var y = transpose ? i : l

      var edge = x%2 ? 1 : -1;

      positions[j++] = x;
      positions[j++] = y;
      positions[j++] = 0;

      positions[j++] = x;
      positions[j++] = y;
      positions[j++] = 0;

      lines[k++] = edge;
      lines[k++] = 1;

      lines[k++] = edge;
      lines[k++] = -1;
    }
  }

  geometry.offsets = [
    {
      start: 0,
      count: triangles * 3 * m,
    },
  ];

  return geometry;
}
