
import './style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LightProbeHelper } from 'three/examples/jsm/helpers/LightProbeHelper.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';



const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setY(23);

let loadedModel;

//load GLTF 
const gLTFLoader = new GLTFLoader();
gLTFLoader.load('./public/GLTF/piano.gltf', (gltfscene) => {

  gltfscene.scene.scale.set(10, 10, 10)
  gltfscene.scene.position.set(0, 0, 0)
  scene.add(gltfscene.scene)

  loadedModel = gltfscene.scene;
});






//test add object
//const geometry= new THREE.TorusGeometry(10,3,16,100)
//const material= new THREE.MeshStandardMaterial({color: 0xFF6347});

//const torus = new THREE.Mesh(geometry,material);
//scene.add(torus)



//add light 
const pointLightRight = new THREE.PointLight(0xffffff, 2525);
const pointLightLeft = new THREE.PointLight(0xffffff, 2525);
const pointLightBack = new THREE.PointLight(0xffffff, 2525);
pointLightRight.position.set(15, 15, 4)
pointLightLeft.position.set(-12, 15, 4)
pointLightBack.position.set(7, 20, -22)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLightLeft, pointLightRight, pointLightBack)

const lightHelperRight = new THREE.PointLightHelper(pointLightRight)
const lightHelperLeft = new THREE.PointLightHelper(pointLightLeft)
const lightHelperBack = new THREE.PointLightHelper(pointLightBack)


const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper, lightHelperRight, lightHelperLeft, lightHelperBack)




const controls = new OrbitControls(camera, renderer.domElement);

//set focus point
controls.target.set(0, 5, 0);
camera.position.set(30, 23, 30);
camera.lookAt(controls.target);




//using HDRI load background 
//const pmremGenerator = new THREE.PMREMGenerator(renderer);

//const hdriLoader = new RGBELoader();
//hdriLoader.load('../HDRI/rural_crossroads_2k.hdr',function (texture){
//  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
//  texture.dispose();
//  scene.environment= envMap
//})


// using exr 
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new EXRLoader().load('./public/EXR/forest.exr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;

  // blur the exr
  const blurScene = new THREE.Scene();
  blurScene.background = texture;

  const blur = 0.02;
  const blurredEnvMap = pmremGenerator.fromScene(blurScene, blur).texture;

  scene.environment = envMap;
  scene.background = blurredEnvMap;


  //set light strength
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  texture.dispose();
});


function animate() {

  if (loadedModel) {
    loadedModel.rotation.y += 0.01;
  }

  controls.update
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate()