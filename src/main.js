import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import sphere from './sphere';

// 全局变量
let camera,
    scene,
    renderer,
    stats,
    gui,
    settings = {};

function init() {
    // 场景
    scene = new THREE.Scene();

    //添加物体
    scene.add(sphere);
    scene.background = sphere.material.envMap;

    // 相机
    camera = new THREE.PerspectiveCamera(
        90, // 视野角度
        window.innerWidth / window.innerHeight, // 长宽比
        0.1, // 近截面（near）
        1000 // 远截面（far）
    );
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);

    // 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 5000);
    pointLight.position.set(30, 30, 15);
    scene.add(pointLight);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // window.addEventListener('resize', onWindowResize);
    window.onresize = onWindowResize;
    initHelper();
    initGUI(ambientLight, pointLight);
}

function animate() {
    // 浏览器刷新的时候渲染器重新渲染
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    stats.update();
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
}

function initHelper() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });

    //创建stats对象
    stats = new Stats();
    //stats.domElement:web页面上输出计算结果,一个div元素，
    document.body.appendChild(stats.domElement);
}

function initGUI(ambientLight, pointLight) {
    gui = new GUI();

    settings = {
        clear() {
            gui.reset();
        },
        setDefault() {
            gui.reset();
        },
    };
    gui.add(settings, 'setDefault');

    const objFolder = gui.addFolder('物体');
    const posFolder = objFolder.addFolder('位置');
    const matFolder = objFolder.addFolder('材质');
    const LightFolder = gui.addFolder('光源');
    const EnvLightFolder = LightFolder.addFolder('环境光');
    const PointLightFolder = LightFolder.addFolder('点光源');

    posFolder.add(sphere.position, 'x').min(-20).max(20).step(0.1).name('x坐标');
    posFolder.add(sphere.position, 'y').min(-20).max(20).step(0.1).name('y坐标');
    posFolder.add(sphere.position, 'z').min(-20).max(20).step(0.1).name('z坐标');

    matFolder.addColor(sphere.material, 'color').name('颜色');
    matFolder.add(sphere.material, 'opacity').min(0).max(1).step(0.1).name('透明度');

    EnvLightFolder.addColor(ambientLight, 'color').name('颜色');
    EnvLightFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.1).name('强度');

    PointLightFolder.addColor(pointLight, 'color').name('颜色');
    PointLightFolder.add(pointLight, 'intensity').min(0).max(10000).step(100).name('强度');

    const positionFolder = PointLightFolder.addFolder('位置');
    positionFolder.add(pointLight.position, 'x').min(-45).max(45).step(1).name('x坐标');
    positionFolder.add(pointLight.position, 'y').min(-45).max(45).step(1).name('y坐标');
    positionFolder.add(pointLight.position, 'z').min(-45).max(45).step(1).name('z坐标');

    gui.add(settings, 'clear');
}

init();
animate();
