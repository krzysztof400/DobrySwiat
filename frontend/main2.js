
import{OrbitControls} from "./OrbitControls.js"
import { Clock, MeshStandardMaterial, Vector2, Vector3 } from "./three.module.js";
import { EXRLoader } from './EXRLoader.js';
import { GLTFLoader } from "./GLTFLoader.js";



let camera, scene, renderer, canvas,controls,clock,uniformData,plane,model
let sorted = false;
let pointerX;
let pointerY;
function init(){

    const canvas = document.querySelector('#c');
    scene = new THREE.Scene();

  

    const aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default
    const near = 0.1;
    const far = 1000;

 

    const Plight = new THREE.PointLight( 0xf2f2f2, 1, 0 );
Plight.position.set( 5, 5, 5 );
scene.add( Plight );
var textureLoader = new EXRLoader();
    textureLoader.load("./park.exr", function(texture){
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;


    })
    camera = new THREE.PerspectiveCamera(15, aspect, near, far);
    if(canvas.clientWidth<600){
      camera.position.set(-2,0,20);
    }
    else{
      camera.position.set(-2,0,15);
    }
    
    camera.lookAt(0,0,0)
    renderer = new THREE.WebGLRenderer({canvas,antialias: true,alpha:true});
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.4
    THREE.ColorManagement.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor( 0x000000, 0 ); // the default

  
    document.body.querySelector('.main').appendChild(renderer.domElement);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    controls.enablePan=false
    controls.enableRotate=false
    controls.enableZoom=false
    

    clock= new THREE.Clock();
      clock.running=true;
      uniformData={
      u_time:{
        type:'f',
        value: clock.getElapsedTime(),
      },

      }
    const render =() =>{
      uniformData.u_time.value = clock.getElapsedTime();
      window.requestAnimationFrame(render)
   
  }
  render();

  const loader = new GLTFLoader()
   loader.load("./Eye.glb",function(gltf){
   model = gltf.scene
    model.children[0].children[1].material.side=1
    model.children[0].children[1].material.roughness=0.2
    model.children[0].children[1].material.metalness=.1
    model.children[0].children[0].material.roughness=0
    model.children[0].children[0].material.metalness=0.1
    model.children[0].children[0].material.map.offset=new Vector2(0.06,0.03)
  

    scene.add(model)
    model.position.y=-0.5
 
   })
  

}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
  
    }
   
    return needResize;
    
  };

 
 
  

 
function animate(){ 

    requestAnimationFrame(animate);
     
    renderer.render(scene, camera);
 
    controls.update();
    if (resizeRendererToDisplaySize(renderer)) {
      canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    
      
    };
    if(model){
      model.position.y=Math.sin(uniformData.u_time.value/2.)/4.-0.5
  
    }
   look()
  




}

init()
function look(e){

  if(e){
     pointerX = ((e.clientX/renderer.domElement.clientWidth)-0.7)*2
     pointerY= -e.clientY/renderer.domElement.clientHeight+0.5
  }
 model.lookAt(new Vector3(pointerX,pointerY,2 ))


 
}
document.addEventListener("mousemove",look)
animate();



