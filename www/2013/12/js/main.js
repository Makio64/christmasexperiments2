var $container, scene, renderer, camera, sw, sh, controls, snowParticuleEmitter, snowParticuleParticules;
var ground, groundZero, tileSize, tilePerSide, mountainMaps, animatedObjects;
var mountains, trees, cycle;
var treeColors = [
  [ 0x442c4c, 0x0f022e, 0x463964 ],
  [ 0x21b45c, 0x217b45, 0x06381a ],
  [ 0xffffff, 0xffb5c1, 0xffe1b5 ]
];

$(document).ready( function(){  
  $( '#info' ).hide();

  $( '#infoBtn' ).mouseover( function(){
    $( '#info' ).fadeIn();
  } );
  $( '#infoBtn' ).mouseout( function(){
    $( '#info' ).fadeOut();
  } );

  $( window ).click( function(){
    controls.autoRotate = false;
  } );

  $( document ).keydown( function(e){
    if( e.keyCode == 82 ){
      controls.autoRotate = !controls.autoRotate;
    }
  } );

  //Scene size
  sw = window.innerWidth;
  sh = window.innerHeight;

  //Setup the renderer
  $container = $('#playground');
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( sw, sh );
  
  //Setup the camera
  camera = new THREE.PerspectiveCamera( 45, sw / sh, 0.1, 10000 );
  camera.position.y = 2000;
  camera.position.z = 2000;

  //Setup the scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xa4e2f2, 0.0002 );
  scene.add( camera );
  $container.append( renderer.domElement );

  //Handling window resize
  window.addEventListener('resize', function() {
    sw = window.innerWidth;
    sh = window.innerHeight;
    renderer.setSize(sw, sh);
    camera.aspect = sw / sh;
    camera.updateProjectionMatrix();
  });

  //Launch the drawing loop!
  setInterval( function(){
    renderloop();
  }, 1000/60 );

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  cycle = 0;
  createMap();

});

function renderloop(){
  renderer.render(scene, camera);
  animateSnow();
  controls.update();  
}

function createMap(){
  tilePerSide = 4;
  tileSize = 1000 / tilePerSide;

  createGlobalLight();
  createBaseGround();
  createSnow();
  createFloor( 1000, 1000, 50, 5, 5, 0xffffff );
  createObjects();
}

function createObjects(){
  animatedObjects = 0;
  //Define if a tile is a mountain tile or not
  mountainMaps = [];
  var maxMountainTiles = 7;
  for( var i = 0; i < tilePerSide; i++ ){
    var row = [];
    for( var j = 0; j < tilePerSide; j++ ){
      if( Math.round( Math.random() ) ){
        if( maxMountainTiles > 0 ){
          maxMountainTiles--;
          row.push( 1 );
        }
        else{
          row.push( 0 );
        }
      }
      else{
        row.push( 0 );
      }
    }
    mountainMaps.push( row );
  }

  var maxTreePerTile = 10;
  mountains = [];
  trees = [];

  //Generate objects on tiles
  for( var i = 0; i < tilePerSide; i++ ){
    for( var j = 0; j < tilePerSide; j++ ){
      if( mountainMaps[i][j] ){
        createMountainTile( i, j, 250 * Math.random() + 100, 4, 4, 0xb6f6f7 );
      }
      else{
        var maxTreeOnThisTile = Math.round( maxTreePerTile * Math.random() );
        for( var k = 0; k < maxTreeOnThisTile; k++ ){
          createTree( i, j, treeColors[ cycle%3 ][ Math.floor( Math.random() * treeColors.length ) ] );
        }
      }
    }
  }

  growAnimation();
}

function destroyObjects(){
 for( var i = 0; i < trees.length; i++ ){
    var t = scene.getObjectById( trees[ i ].id );
    scene.remove( t );
  }

  for( var i = 0; i < mountains.length; i++ ){
    var m = scene.getObjectById( mountains[ i ].id );
    scene.remove( m );
  }  

  cycle++;

  setTimeout( function(){
    createObjects();
  }, 2000 );
}

function createGlobalLight(){
  for( var i = 0; i < 4; i++ ){
    var spotLight = new THREE.SpotLight( 0xffffff, .75 );
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    if( i == 0 ){
      spotLight.position.set( -750, 700, 750 );
    }
    else if( i == 1 ){
      spotLight.position.set( -750, 700, -750 );
    }
    else if( i == 2 ){
      spotLight.position.set( 750, 700, -750 );
    }
    else if( i == 3 ){
      spotLight.position.set( 750, 700, 750 );
    }

    scene.add( spotLight );
  }
}

function createBaseGround(){
  ground = new THREE.Mesh( new THREE.CubeGeometry( 1000, 500, 1000, 3, 3, 3 ), new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } ) );
  ground.position.y = -150;
  groundZero = ground.position.y + 250 - 3;
  scene.add( ground );

  camera.lookAt( ground.position );
}

function createFloor( width, depth, height, xSeg, ySeg, color ){
  var mountain = new THREE.Mesh( new THREE.PlaneGeometry( width, depth, xSeg, ySeg ), new THREE.MeshLambertMaterial( { color: color, shading: THREE.FlatShading } ) );
  mountain.castShadow = true;
  mountain.receiveShadow = true;

  for( var i = 0; i < mountain.geometry.vertices.length; i++ ){
    mountain.geometry.vertices[ i ].z = Math.floor( ( Math.random() * height ) );
  }

  var currentRow = 0;
  for( var i = 0; i < mountain.geometry.vertices.length; i++ ){
    if( i != 0 && i % ( xSeg + 1 ) == 0 ){
      currentRow++;
    }
    //First row
    if( i <= xSeg ){
      mountain.geometry.vertices[i].z = 0;
    }
    //left row
    if( i % xSeg == currentRow ){
      mountain.geometry.vertices[i].z = 0;
    }
    //right row
    if( i % ( xSeg + 1 ) == 0 ){
      mountain.geometry.vertices[i].z = 0;
    }
    //Last row
    if( i >= mountain.geometry.vertices.length-1 - ySeg){
      mountain.geometry.vertices[i].z = 0;
    }
  }

  mountain.rotation.x = degToRad( -90 );
  mountain.position.y = groundZero;

  scene.add( mountain );
}

function createMountainTile( tileX, tileZ, height, xSeg, ySeg, color ){
  var mountain = new THREE.Mesh( new THREE.PlaneGeometry( tileSize, tileSize, xSeg, ySeg ), new THREE.MeshLambertMaterial( { color: color, shading: THREE.FlatShading } ) );
  mountain.castShadow = true;
  mountain.receiveShadow = true;

  for( var i = 0; i < mountain.geometry.vertices.length; i++ ){
    mountain.geometry.vertices[ i ].z = Math.floor( ( Math.random() * height ) );
  }

  var currentRow = 0;
  for( var i = 0; i < mountain.geometry.vertices.length; i++ ){
    if( i != 0 && i % ( xSeg + 1 ) == 0 ){
      currentRow++;
    }
    //First row
    if( i <= xSeg ){
      mountain.geometry.vertices[i].z = 0;
    }
    //left row
    if( i % xSeg == currentRow ){
      mountain.geometry.vertices[i].z = 0;
    }
    //right row
    if( i % ( xSeg + 1 ) == 0 ){
      mountain.geometry.vertices[i].z = 0;
    }
    //Last row
    if( i >= mountain.geometry.vertices.length-1 - ySeg){
      mountain.geometry.vertices[i].z = 0;
    }
  }

  mountain.rotation.x = degToRad( -90 );
  
  mountain.position.x = ( -tileSize * tilePerSide ) / 2 + ( tileSize * tileX ) + ( tileSize / 2 );
  mountain.position.z = ( -tileSize * tilePerSide ) / 2 + ( tileSize * tileZ ) + ( tileSize / 2 );

  
  mountain.position.y = groundZero;
  mountains.push( mountain );
  animatedObjects++;
  scene.add( mountain );
}

function createTree( tileX, tileZ, color ){
  var trunkHeight = Math.random() * 50 + 15;
  var leafHeight = Math.random() * 100 + 100;
  var leafRadius = Math.random() * 30 + 15;

  var trunk = new THREE.Mesh( new THREE.CylinderGeometry( 3, 10, trunkHeight, 5, 1 ), new THREE.MeshLambertMaterial( { color: 0x342205, shading: THREE.FlatShading } ) );
  trunk.position.y = trunkHeight / 2;

  var leaf = new THREE.Mesh( new THREE.CylinderGeometry( 0, leafRadius, leafHeight, 8, 1 ), new THREE.MeshLambertMaterial( { color: color, shading: THREE.FlatShading } ) );
  leaf.castShadow = true;
  leaf.receiveShadow = true;
  leaf.position.y = leafHeight / 2 + trunk.position.y;

  var tree = new THREE.Object3D();
  tree.add( trunk );
  tree.add( leaf );

  tree.position.x = ( -tileSize * tilePerSide ) / 2 + ( tileSize * tileX ) + ( tileSize / 2 ) + ( Math.random() * tileSize ) - tileSize / 2;
  tree.position.y = groundZero;
  tree.position.z = ( -tileSize * tilePerSide ) / 2 + ( tileSize * tileZ ) + ( tileSize / 2 ) + ( Math.random() * tileSize ) - tileSize / 2;

  if( tree.position.x - leafRadius < -500 ){
    tree.position.x = -500 + leafRadius * 2;
  }
  else if( tree.position.x + leafRadius > 500 ){
    tree.position.x = 500 - leafRadius * 2;
  }

  if( tree.position.z - leafRadius < -500 ){
    tree.position.z = -500 + leafRadius * 2;
  }
  else if( tree.position.z + leafRadius > 500 ){
    tree.position.z = 500 - leafRadius * 2;
  }
  tree.rotation.y = degToRad( 360 * Math.random() );

  trees.push( tree );
  animatedObjects++;
  scene.add( tree );
}

function createSnow(){
  snowParticuleParticules = new THREE.Geometry;
  for (var i = 0; i < 500; i++) {
     var particle = new THREE.Vector3( ( Math.random() * 1000 ) - 500, Math.random() * 750 + groundZero, ( Math.random() * 1000 ) - 500);
     snowParticuleParticules.vertices.push(particle);
  }
  var snowParticuleEmitterTexture = THREE.ImageUtils.loadTexture('img/snowflake.png');
  var snowParticuleEmitterMaterial = new THREE.ParticleBasicMaterial({ map: snowParticuleEmitterTexture, transparent: true, blending: THREE.AdditiveBlending, size: 12 * Math.random(), color: 0xFFFFFF });

  snowParticuleEmitter = new THREE.ParticleSystem(snowParticuleParticules, snowParticuleEmitterMaterial);
  snowParticuleEmitter.sortParticles = true;
  snowParticuleEmitter.position.z = 0;
  scene.add(snowParticuleEmitter);
}

function animateSnow(){
  var particleCount = snowParticuleParticules.vertices.length;
  while (particleCount--) {
   var particle = snowParticuleParticules.vertices[particleCount];
   particle.x -= 1;
   particle.y -= 2;
   particle.z -= 1;
   
   if( particle.x < -500 ) {
      particle.x = 500;
   } 
   if( particle.y < groundZero ) {
      particle.y = Math.random() * 750 + groundZero;
   }
   if( particle.z < -500 ) {
      particle.z = 500;
   }

  }
  snowParticuleParticules.__dirtyVertices = true;
}

function growAnimation(){
  for( var i = 0; i < mountains.length; i++ ){
    var m = mountains[ i ];
    m.scale.z = 0;
    TweenMax.to( m.scale, 2, { z: 1, delay: i * 0.25, ease:Elastic.easeOut} );
  }

  for( var i = 0; i < trees.length; i++ ){
    var t = trees[ i ];
    var goalY = t.position.y;
    t.position.y = -100;
    t.scale.x = 0;
    t.scale.z = 0;
    TweenMax.to( t.position, 2, { y: goalY, delay: i * 0.25 + mountains.length * 0.25, ease:Elastic.easeOut} );
    TweenMax.to( t.scale, 2, { x: 1, z: 1, delay: i * 0.25 + mountains.length * 0.25, ease:Elastic.easeOut} );
    TweenMax.to( t.rotation, 2, { y: t.rotation.y + degToRad( 360 * Math.random() ), delay: i * 0.25 + mountains.length * 0.25} );
  }

  setTimeout( function(){
    hideAnimation();
  }, 15000 );
}

function hideAnimation(){
  for( var i = 0; i < trees.length; i++ ){
    var t = trees[ i ];
    TweenMax.to( t.position, 2, { y: -100, delay: i * 0.15, onComplete: objDestroyed} );
    TweenMax.to( t.scale, .25, { x: 0.25, z: 0.25, delay: i * 0.15 } );
  }

  for( var i = 0; i < mountains.length; i++ ){
    var m = mountains[ i ];
    TweenMax.to( m.scale, 2, { z: 0, delay: i * 0.25 + trees.length * 0.15, onComplete: objDestroyed } );
  }  
}

function objDestroyed(){
  animatedObjects--;
  if( animatedObjects == 0 ){
    destroyObjects();
  }
}

function degToRad( deg ){
  return (deg * ( Math.PI / 180));
}