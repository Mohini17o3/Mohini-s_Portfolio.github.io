import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight ,0.1,1000);
 // arguments in Perspective Camera--> field of view, aspect ratio (user browser window ) , view frustum (objects visible relative to camera )

const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);  // to have it render on the full screen
camera.position.setZ(30);  
camera.position.setX(-3);

renderer.render(scene, camera);
// camera was earlier positioned on the middle , here we move it along z axis 

// #1. renderer.render(scene, camera);   //assume render as drawing 

//now create the object , three js has many geometry objects in their documentation , use them , they have dimaension specified as coordinates

const geometry = new THREE.TorusGeometry(20, 3, 16, 100 );  //constructor with arguments
//we need to provide it material now , its like wrapping paper for an object 
// const material = new THREE.MeshStandardMaterial(
//   {color : '#966fd6' } );  // We can use WebGL to make our own custom shaders , no light source in this basic one is MeshBasicMaterial , light required for MeshStandardMaterial.

  // now create mesh with geometry and the material 

const torusTexture  = new THREE.TextureLoader().load('silver_sparkle.jpg');
new THREE.MeshBasicMaterial({
  map: torusTexture
})
const torus = new THREE.Mesh(
 geometry,
  new THREE.MeshBasicMaterial({
    map: torusTexture
  })
  );
 
scene.add(torus);   // to see it we are adding the mesh on the scene .
const pointLight = new THREE.PointLight(0xffffff);  // point light is like light in all directions ,like a ligt bulb , give positions to the light , its in the center right now when just instantiated .
pointLight.position.set(5, 5, 5 );

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera , renderer.domElement);
// #2 .renderer.render(scene, camera);

// instead of calling render method this many times, we can use a recursive function , which will use animate function that tells the browser that there is an animation and this will call the render method automatically , its like a game loop(game developmentreference.)

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25 , 24 , 24);
  const material = new THREE.MeshStandardMaterial( {
    color : 0xffffff
  });
  const star = new THREE.Mesh(geometry, material);

  // now we need to randomly position these stars, so we generate random values of x , y and z ..
  const[x,y,z] =Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);

}
Array(200).fill().forEach(addStar);    //to specify the amount of stars needed 

const spaceTexture = new THREE.TextureLoader().load('space2.jpg');
scene.background = spaceTexture;

const MohiniTexture  = new THREE.TextureLoader().load('Background.png');

const Mohini = new THREE.Mesh(
new THREE.BoxGeometry(3, 3, 3),
new THREE.MeshBasicMaterial({
  map: MohiniTexture
})
);
scene.add(Mohini);


//moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map : moonTexture,
    normalMap : normalTexture
  })
);
scene.add(moon);
moon.position.z =30 ;
moon.position.setX(-10);

Mohini.position.z = -5;
Mohini.position.x = 2;

function moveCamera(){
const t = document.body.getBoundingClientRect().top;
moon.rotation.x += 0.05 ; 
moon.rotation.y += 0.75 ; 
moon.rotation.z += 0.05 ; 

Mohini.rotation.y += 0.01 ;
Mohini.rotation.z += 0.01 ;

camera.position.z = t * -0.01;
camera.position.x = t * -0.0002;
camera.position.y = t * -0.0002;


}

document.body.onscroll = moveCamera;
moveCamera();



function handleResize() {
  // Update camera aspect ratio and renderer size when the window is resized
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  
  // Mohini.rotation.y += 0.005;
  moon.rotation.x += 0.005;
controls.update();

  renderer.render(scene, camera);
}
animate();