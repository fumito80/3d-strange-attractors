import * as attractors from './attractors';
import { rK } from './runge-kutta';
import * as R from 'ramda';
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', init);

function init() {

  const width = 1600;
  const height = 900;

  const canvas = document.querySelector('#myCanvas') as HTMLCanvasElement;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
 
  // シーンを作成
  const scene = new THREE.Scene();

  // Attractorを生成
  const attractor = new attractors['Rossler']();
  
  // カメラを作成
  const camera = new THREE.PerspectiveCamera(attractor.fov, width / height, 1, 100000);
  camera.position.set(0, 0, attractor.cameraPos);
 
  // main
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const geometry = new THREE.Geometry();
  R.range(0, 50000).reduce((acc, i) => {
    const inputXYZ = R.last(acc) as XYZ;
    const xyz = rK(inputXYZ, attractor);
    const [x, y, z] = xyz;
    geometry.vertices.push(new THREE.Vector3(x, y, z));
    return acc.concat([xyz]);
  }, [attractor.initXYZ]);

  const line = new THREE.Line(geometry, material);
  // シーンに追加
  scene.add(line);

  // 平行光源
  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1);

  // シーンに追加
  scene.add(light);
 
  // 初回実行
  tick();
 
  function tick() {
    requestAnimationFrame(tick);
 
    // 箱を回転させる
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
 
    // レンダリング
    renderer.render(scene, camera);
  }
}
