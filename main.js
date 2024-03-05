import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const textToType = `Hi I am \n Mohini `;    
const typingSpeed = 100 ;
const typingTextElement = document.getElementById('home');

function typeText(){
  let index = 0 ;
  const typingInterval = setInterval( ()=>{
    typingTextElement.textContent = textToType.slice(0,index);
    index++;

    if(index >textToType.length) {
      clearInterval(typingInterval);
    }

  } , typingSpeed);
}
window.onload = typeText;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight ,0.1,1000);
 // arguments in Perspective Camera--> field of view, aspect ratio (user browser window ) , view frustum (objects visible relative to camera )

const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);  // to have it render on the full screen
camera.position.setZ(40);  
camera.position.setX(-3);

renderer.render(scene, camera);
// camera was earlier positioned on the middle , here we move it along z axis 

// #1. renderer.render(scene, camera);   //assume render as drawing 

//now create the object , three js has many geometry objects in their documentation , use them , they have dimaension specified as coordinates




  //navbar 

  document.addEventListener('DOMContentLoaded' , ()=>{
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll' , ()=> {
      const scrollPosition = window.scrollY;
      const navbarHeight = navbar.offsetHeight ;

      if(scrollPosition > navbarHeight){
        document.body.classList.add('navbar-scrolled');
      }else{
        document.body.classList.remove('navbar-scrolled');
      }
    })
  } )



const pointLight = new THREE.PointLight(0xff00ff);  // point light is like light in all directions ,like a ligt bulb , give positions to the light , its in the center right now when just instantiated .
pointLight.position.set(5, 5, 5 );

const ambientLight = new THREE.AmbientLight(0xff00ff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera , renderer.domElement);
// #2 .renderer.render(scene, camera);

// instead of calling render method this many times, we can use a recursive function , which will use animate function that tells the browser that there is an animation and this will call the render method automatically , its like a game loop(game developmentreference.)

//STARS

const starsGroup = new THREE.Group();
scene.add(starsGroup);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25 , 24 , 24);
  const material = new THREE.MeshStandardMaterial( {
    color : '#FFFFFF'
  });
  const star = new THREE.Mesh(geometry, material);

  // now we need to randomly position these stars, so we generate random values of x , y and z ..
  const[x,y,z] =Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  starsGroup.add(star);

}
Array(400).fill().forEach(addStar);    //to specify the amount of stars needed 

scene.background = new THREE.Color(0x000000);


//Avatar
const MohiniTexture  = new THREE.TextureLoader().load('Background.png');
const Mohini = new THREE.Mesh(
new THREE.BoxGeometry(20, 20, 20),
new THREE.MeshBasicMaterial({
  map: MohiniTexture ,
})
);
scene.add(Mohini);
Mohini.position.z = -2;
Mohini.position.y = 3;
Mohini.position.x = 20;

function moveCamera(){
const t = document.body.getBoundingClientRect().top;


// Mohini.rotation.y += 0.01 ;
if(t<0){
  // Rotate the avatar around the z-axis
  Mohini.rotation.z = t * 0.001;

  // Move the avatar inwards along the z-axis
  Mohini.position.z = t * 0.1;
// Mohini.rotation.z += 0.01 ;

// camera.position.z = t * -0.01;
// camera.position.x = t * -0.0002;
// camera.position.y = t * -0.0002;
}

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

  
// Mohini.rotation.y += 0.005;
 
 controls.update();
 starsGroup.children.forEach(star => {
  star.position.x += 0.1 * Math.sin(Date.now() * 0.001);
  star.position.y += 0.1 * Math.sin(Date.now() * 0.001);
 });
  renderer.render(scene, camera);
 
}
animate();