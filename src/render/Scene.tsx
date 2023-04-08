import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function ThreeScene(): JSX.Element {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      renderer: THREE.WebGLRenderer,
      controls: OrbitControls;

    function init() {
      // create a new camera
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.6, 0);

      // create a new scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x008000);

      // add a light to the scene
      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 2, 0);
      scene.add(light);

      // create a new renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current?.appendChild(renderer.domElement);

      // add OrbitControls to the camera
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.6, 0);
      controls.update();

      // add a plane geometry to the scene
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      scene.add(plane);

      // add a cube geometry to the scene
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0.5, 0);
      cube.castShadow = true;
      scene.add(cube);

      // add window resize event listener
      window.addEventListener('resize', onWindowResize);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();
    animate();

    // clean up function
    return () => {
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}

export default ThreeScene;