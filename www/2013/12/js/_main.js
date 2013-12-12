var $container, scene, renderer, camera, sw, sh, controls;
var ground, groundZero;

$(document).ready( function(){  

  //Scene size
  sw = window.innerWidth;
  sh = window.innerHeight;

  //Setup the renderer
  $container = $('#playground');
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( sw, sh );
  
  //Setup the camera
  camera = new THREE.PerspectiveCamera( 45, sw / sh, 0.1, 10000 );
  camera.position.y = 1000;
  camera.position.z = 1000;

  //Setup the scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xa4e2f2, 0.00025 );
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

  createMap();

});

function renderloop(){
  renderer.render(scene, camera);
  controls.update();  
}

function createMap(){
  createGlobalLight();
  createBaseGround();
  createMoutain( 500, 500, 300, 200, 20, 20, 0xff0000 );
}

function createGlobalLight(){
  for( var i = 0; i < 4; i++ ){
    var spotLight = new THREE.SpotLight( 0xffffff, 0.35 );
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    if( i == 0 ){
      spotLight.position.set( -300, 500, 300 );
    }
    else if( i == 1 ){
      spotLight.position.set( -300, 500, -300 );
    }
    else if( i == 2 ){
      spotLight.position.set( 300, 500, -300 );
    }
    else if( i == 3 ){
      spotLight.position.set( 300, 500, 300 );
    }

    scene.add( spotLight );
  }
}

function createBaseGround(){
  ground = new THREE.Mesh( new THREE.CubeGeometry( 500, 50, 500, 3, 3, 3 ), new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) );
  ground.castShadow = true;
  ground.receiveShadow = true;
  ground.position.y = 100;
  groundZero = ground.position.y + 25;

  scene.add( ground );

  camera.lookAt( ground.position );
}

function createMoutain( width, depth, height, minElevation, xSeg, ySeg, color ){
  var mountain = new THREE.Mesh( new THREE.PlaneGeometry( width, depth, xSeg, ySeg ), new THREE.MeshLambertMaterial( { color: color, shading: THREE.SmoothShading } ) );
  mountain.castShadow = true;
  mountain.receiveShadow = true;

  for( var i = 0; i < mountain.geometry.vertices.length; i++ ){
    mountain.geometry.vertices[ i ].z = Math.floor( ( Math.random() * height + minElevation ) );
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

//UTILS
function degToRad( deg ){
  return (deg * ( Math.PI / 180));
}