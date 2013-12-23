Acko.SurfaceGeometry = function (n, m) {
  m = m || 1;
  var triangles = (n - 1) * (m - 1) * 2;
  var points = n * m;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('index', Uint16Array, triangles * 3, 1);
  geometry.addAttribute('position', Float32Array, points, 3);
  geometry.addAttribute('edge', Float32Array, points * m, 2);

  var indices   = geometry.attributes.index.array;
  var positions = geometry.attributes.position.array;
  var edges     = geometry.attributes.edge.array;

  var base;

  var j = 0, k = 0;

  for (var y = 0; y < m - 1; ++y) {
    for (var x = 0; x < n - 1; ++x, j += 6, ++k) {
      indices[j] = k;
      indices[j + 1] = k + n;
      indices[j + 2] = k + 1;

      indices[j + 3] = k + 1;
      indices[j + 4] = k + n;
      indices[j + 5] = k + 1 + n;
    }
    ++k;
  }

  j = 0; k = 0;
  for (var y = 0; y < m; ++y) {
    for (var x = 0; x < n; ++x, j += 3) {
      positions[j]     = x;
      positions[j + 1] = y;
      positions[j + 2] = 0;

      edges[k] = (x == 0) ? -1 : (x == n - 1) ? 1 : 0;
      edges[k + 1] = (y == 0) ? -1 : (y == m - 1) ? 1 : 0;
    }
  }

  geometry.offsets = [
    {
      index: 0,
      start: 0,
      count: triangles * 3,
    },
  ];

  return geometry;
}
