import * as THREE from 'three';

// 纹理贴图加载器TextureLoader
const textLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象
const texture = textLoader.load('../src/assets/earth.jpg');

const textureCube = new THREE.CubeTextureLoader().setPath('../src/assets/env/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

const geomery = new THREE.SphereGeometry(40);
const material = new THREE.MeshStandardMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture, // map表示材质的颜色贴图属性,
    envMap: textureCube,
    transparent: true
});

const mesh = new THREE.Mesh(geomery, material);
mesh.castShadow = true;

export default mesh;
