import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const textToType = `Hey there !`;    
const typingSpeed = 100 ;
const typingTextElement = document.getElementById('home');



function typeText(){
  let index = 0 ;
  const typingInterval = setInterval( ()=>{
    typingTextElement.textContent = textToType.slice(0, index); // Update the span's content
    index++;
    if(index >textToType.length) {
      clearInterval(typingInterval);
    }


  } , typingSpeed);
}
window.onload = typeText;


// create the scene
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


  //Lighting

const pointLight = new THREE.PointLight(0xffffff);  // point light is like light in all directions ,like a ligt bulb , give positions to the light , its in the center right now when just instantiated .
pointLight.position.set(5, 5, 5 );

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


const controls = new OrbitControls(camera , renderer.domElement);
// #2 .renderer.render(scene, camera);

// instead of calling render method this many times, we can use a recursive function , which will use animate function that tells the browser that there is an animation and this will call the render method automatically , its like a game loop(game developmentreference.)

//STARS

const starsGroup = new THREE.Group();
scene.add(starsGroup);

function addStar(){
  const geometry = new THREE.SphereGeometry(2 , 24 , 35);
  const material = new THREE.MeshStandardMaterial( {
    color : '#FFFFFF',
    emissive :'#000000',
    roughness : '0.222' ,
    metalness : '0.197', 
  });
  const star = new THREE.Mesh(geometry, material);

  // now we need to randomly position these stars, so we generate random values of x , y and z ..
  const[x,y,z] =Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(1000));

  star.position.set(x,y,z);
  starsGroup.add(star);


}
Array(200).fill().forEach(addStar);    //to specify the amount of stars needed 



// scene.background = new THREE.Color('#A9A9A9');



function animateStars() {
  starsGroup.children.forEach(star => {
    star.position.y += 0.5; // Move stars towards the camera

    // Reset stars' position when they come too close to the camera
    if (star.position.y > 100) {
      star.position.y = -100;
      
      
      star.position.x = THREE.MathUtils.randFloatSpread(200);
      star.position.y = THREE.MathUtils.randFloatSpread(200);
    }
  });
}

//Avatar
const MohiniTexture = new THREE.TextureLoader().load('images/new_pic.jpg');

const Mohini = new THREE.Mesh(
new THREE.BoxGeometry(30, 30 ,0),
new THREE.MeshMatcapMaterial({
  map: MohiniTexture ,
  color :'#FFFFFF',
})
);
// Mohini.layers.set(1);
// scene.add(Mohini);
Mohini.position.z = -2;
Mohini.position.y = 3;
Mohini.position.x = 20;



// ripple 



function moveCamera(){
const t = document.body.getBoundingClientRect().top;


if(t<0){
  // Rotate the avatar around the z-axis
  Mohini.rotation.z = t * 0.001;

  // Move the avatar inwards along the z-axis
  Mohini.position.y = -t * 0.1;

}

}

document.body.onscroll = moveCamera;
moveCamera();


const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 3; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;

bloomComposer.addPass(renderScene);
 bloomComposer.addPass(bloomPass);

function handleResize() {
  // Update camera aspect ratio and renderer size when the window is resized
  camera.aspect = window.innerWidth / window.innerHeight;

if(camera.aspect < 1) {
  camera.position.z = 40/camera.aspect;
  camera.position.x = -3/camera.aspect;
} else {
  camera.position.z = 40;
  camera.position.x = -3;

}


  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();

}

window.addEventListener('resize', handleResize);

// moving stars 
let mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  
});

function animate() {
  requestAnimationFrame(animate);


  animateStars();

  controls.update();

  renderer.clear(); 
  renderer.render(scene, camera);


  bloomComposer.render();

  
}

animate();

















