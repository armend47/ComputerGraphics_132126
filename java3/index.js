import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const pointLight = new THREE.PointLight( 0xffffff, 1 );
const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( pointLight, ambientLight );

//Diellin
const sunGeometry = new THREE.SphereGeometry( 1, 32, 32 );

const sunMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
const sunMesh = new THREE.Mesh( sunGeometry, sunMaterial );
scene.add( sunMesh );

const earthOrbit = new THREE.Object3D();

//Toka
const earthGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
const earthMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff, wireframe: true } );
const earthMesh = new THREE.Mesh( earthGeometry, earthMaterial );
earthMesh.position.x = 2;
earthOrbit.add( earthMesh );


//Hena 
const moonGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const moonMaterial = new THREE.MeshStandardMaterial( { color: 0x888888, wireframe: true } );
const moonMesh = new THREE.Mesh( moonGeometry, moonMaterial );
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add( moonOrbit );

moonMesh.position.x = 0.8;
moonOrbit.add( moonMesh );
scene.add( earthOrbit );

const marsOrbit = new THREE.Object3D();

//Marsi
const marsGeometry = new THREE.SphereGeometry( 0.4, 32, 32 );
const marsMaterial = new THREE.MeshStandardMaterial( { color: 0xff4500, wireframe: true } );
const marsMesh = new THREE.Mesh( marsGeometry, marsMaterial );
marsMesh.position.x = 3.5;
marsOrbit.add( marsMesh );

//Sateliti i Marsit
const marsMoonGeometry = new THREE.SphereGeometry( 0.08, 32, 32 );
const marsMoonMaterial = new THREE.MeshStandardMaterial( { color: 0xaaaaaa, wireframe: true } );
const marsMoonMesh = new THREE.Mesh( marsMoonGeometry, marsMoonMaterial );
const marsMoonOrbit = new THREE.Object3D();
marsMoonOrbit.position.x = 3.5;
marsOrbit.add( marsMoonOrbit );

marsMoonMesh.position.x = 0.6;
marsMoonOrbit.add( marsMoonMesh );
scene.add( marsOrbit );


camera.position.z = 8;




const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
   
    sunMesh.rotation.y += 0.01;
    earthOrbit.rotation.y += 0.01;
    earthMesh.rotation.y += 0.01;
    moonMesh.rotation.y += 0.01;
    moonOrbit.rotation.y += 0.03;
    marsOrbit.rotation.y += 0.006;
    marsMesh.rotation.y += 0.01;
    marsMoonMesh.rotation.y += 0.01;
    marsMoonOrbit.rotation.y += 0.04;
    renderer.render(scene, camera);
}
animate();