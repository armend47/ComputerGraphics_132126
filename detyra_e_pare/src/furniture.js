import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const SOURCES = {
  table: 'https://polyhaven.com/a/chinese_tea_table',
  chair: 'https://polyhaven.com/a/painted_wooden_chair_02',
};

export const CHAIR_LAYOUT = [
  { name: 'Karrigia 01 · Veri', position: [0, 0, -1.14], rotationY: 0 },
  { name: 'Karrigia 02 · Lindje', position: [1.14, 0, 0], rotationY: -Math.PI / 2 },
  { name: 'Karrigia 03 · Jug', position: [0, 0, 1.14], rotationY: Math.PI },
  { name: 'Karrigia 04 · Perëndim', position: [-1.14, 0, 0], rotationY: Math.PI / 2 },
];

export const CHAIR_SCALE = 0.78;
export const FLOOR_Y = 0;

function prepareModel(root, anisotropy) {
  root.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) {
        if (material[key]) material[key].anisotropy = anisotropy;
      }
    }
  });
}

function groundModel(model) {
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const wrapper = new THREE.Group();
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= bounds.min.y;
  wrapper.add(model);
  return wrapper;
}

export async function loadFurniture(scene, renderer) {
  const loader = new GLTFLoader();
  const base = import.meta.env.BASE_URL;
  const [tableAsset, chairAsset] = await Promise.all([
    loader.loadAsync(`${base}chinese_tea_table_4k.gltf/chinese_tea_table_4k.gltf`),
    loader.loadAsync(`${base}painted_wooden_chair_02_4k.gltf/painted_wooden_chair_02_4k.gltf`),
  ]);

  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  prepareModel(tableAsset.scene, anisotropy);
  prepareModel(chairAsset.scene, anisotropy);

  const table = groundModel(tableAsset.scene);
  table.name = 'Tavolina · Chinese Tea Table';
  table.scale.set(1.90, 1.52, 1.90);
  table.position.set(0, FLOOR_Y, 0);
  table.userData.source = SOURCES.table;
  scene.add(table);

  const chairs = CHAIR_LAYOUT.map((layout, index) => {
    const chair = groundModel(chairAsset.scene.clone(true));
    chair.name = layout.name;
    chair.scale.setScalar(CHAIR_SCALE);
    chair.position.set(layout.position[0], FLOOR_Y, layout.position[2]);
    chair.rotation.y = layout.rotationY;
    chair.userData = { chairIndex: index, source: SOURCES.chair };
    scene.add(chair);
    return chair;
  });

  return { table, chairs };
}
