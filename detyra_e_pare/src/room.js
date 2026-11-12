import * as THREE from 'three';
import { FLOOR_Y } from './furniture.js';
import { woodTexture } from './textures.js';

const material = (color, roughness = .8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });

export function buildRoom(scene) {
  const room = new THREE.Group();
  room.name = 'Dhoma dhe dekori mbi tavolinë';
  scene.add(room);

  function mesh(geometry, mat, position, parent = room, shadows = true) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(...position);
    object.castShadow = shadows;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(w, h, d, mat, position) {
    return mesh(new THREE.BoxGeometry(w, h, d), mat, position);
  }
  function cylinder(top, bottom, height, mat, position) {
    return mesh(new THREE.CylinderGeometry(top, bottom, height, 32), mat, position);
  }

  box(6.05, .18, 5.25, material('#cec6b4'), [0, -.091, 0]);
  const floorMap = woodTexture();
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set(2, 1.3);
  const floor = mesh(new THREE.PlaneGeometry(5.8, 5), material('#ffffff', .7, { map: floorMap }), [0, 0, 0], room, false);
  floor.rotation.x = -Math.PI / 2;
  box(5.98, 2.95, .16, material('#f5f5f0'), [0, 1.475, -2.58]);
  box(.16, 2.95, 5.08, material('#8c9b81'), [-2.98, 1.475, 0]);

  const oak = material('#78553a', .65);
  const ceramic = material('#dfd8bd', .45);
  const teaCeramic = material('#7c8b6b', .34);
  const tea = material('#5c3b20', .25);
  const tableTop = .4986410439014435 * 1.52 + FLOOR_Y;
  cylinder(.28, .28, .023, oak, [0, tableTop + .012, 0]);
  const pot = mesh(new THREE.SphereGeometry(.105, 28, 20), teaCeramic, [0, tableTop + .105, -.04]);
  pot.scale.set(1, .8, 1);
  cylinder(.062, .075, .016, teaCeramic, [0, tableTop + .19, -.04]);
  mesh(new THREE.SphereGeometry(.018, 16, 12), oak, [0, tableTop + .214, -.04]);
  const spout = cylinder(.016, .035, .12, teaCeramic, [.11, tableTop + .12, -.04]);
  spout.rotation.z = -.8;
  const handle = mesh(new THREE.TorusGeometry(.065, .012, 10, 30, Math.PI * 1.5), oak, [-.10, tableTop + .12, -.04]);
  handle.rotation.z = Math.PI * .25;
  const cupProfile = [[0, 0], [.027, 0], [.041, .049], [.035, .049], [.023, .008]].map(([x, y]) => new THREE.Vector2(x, y));
  const cupGeometry = new THREE.LatheGeometry(cupProfile, 32);
  for (const [x, z] of [[-.17, .13], [.17, .13], [-.16, -.18], [.17, -.18]]) {
    cylinder(.063, .063, .009, ceramic, [x, tableTop + .03, z]);
    mesh(cupGeometry, teaCeramic, [x, tableTop + .035, z]);
    cylinder(.034, .034, .002, tea, [x, tableTop + .074, z]);
  }

  const ground = mesh(new THREE.PlaneGeometry(200, 200), material('#edeae3', 1), [0, -.185, 0], scene, false);
  ground.rotation.x = -Math.PI / 2;

  const hemisphere = new THREE.HemisphereLight('#f4f4e2', '#a5a38b', 2);
  const sun = new THREE.DirectionalLight('#fff0d1', 3);
  sun.position.set(4, 7, 5);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .1, far: 25 });
  sun.shadow.normalBias = .018;
  sun.shadow.bias = -.00015;
  sun.shadow.radius = 3;
  const fill = new THREE.DirectionalLight('#e7efe6', 1.25);
  fill.position.set(2, 5, 3);
  const warmLight = new THREE.PointLight('#ffd296', 2, 7, 2);
  warmLight.position.set(0, 2.4, 0);
  scene.add(hemisphere, sun, sun.target, fill, warmLight);

  return { room, sun, hemisphere, fill, warmLight, ground };
}
