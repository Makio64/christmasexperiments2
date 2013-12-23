Acko.ParticlesGeometry = function (n, m) {
  m = m || 1;
  var triangles = n * m * 2;
  var points = n * m * 4;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('index', Uint16Array, triangles * 3, 1);
  geometry.addAttribute('position', Float32Array, points, 3);
  geometry.addAttribute('particle', Float32Array, points, 2);

  var indices   = geometry.attributes.index.array;
  var positions = geometry.attributes.position.array;
  var particles = geometry.attributes.particle.array;

  var i = 0, j = 0, k = 0, o = 0;
  for (var y = 0; y < m; ++y) {
    for (var x = 0; x < n; ++x) {

      indices[i++] = o;
      indices[i++] = o + 1;
      indices[i++] = o + 2;

      indices[i++] = o + 2;
      indices[i++] = o + 1;
      indices[i++] = o + 3;

      o += 4;

      for (var l = 0; l < 4; ++l) {
        positions[j++] = x;
        positions[j++] = y;
        positions[j++] = 0;

        particles[k++] = (l & 1) * 2 - 1;
        particles[k++] = (l >> 1) * 2 - 1;
      }
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
