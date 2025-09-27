import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, model, mixer;
const container = document.getElementById('container');

document.addEventListener('DOMContentLoaded', function () {
    // Ensure container is available
    if (!container) {
        console.error("Container element not found!");
        return;
    }

    function init() {
        scene = new THREE.Scene();

        // Use container dimensions here
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1, 2);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 5;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        controls.target.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 15);
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        function loadModel(path) {
            loader.load(
                path,
                function (gltf) {
                    if (model) {
                        scene.remove(model);
                    }
                    if (path === '3d Models/Full Device.glb') {
                        gltf.scene.scale.set(0.002, 0.002, 0.002);
                    } else {
                        gltf.scene.scale.set(20, 20, 20);
                    }

                    model = gltf.scene;
                    model.rotation.z = Math.PI / -3.8;
                    scene.add(model);

                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    model.position.set(-center.x, -center.y, -center.z);

                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = camera.fov * (Math.PI / 180);
                    let cameraZ = Math.abs(maxDim / 2.0 / Math.tan(fov / 2));
                    cameraZ *= 1.5;

                    camera.position.z = cameraZ;
                    controls.target.set(0, 0, 0);

                    controls.maxDistance = camera.position.z * 1.5;

                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach(clip => {
                            mixer.clipAction(clip).play();
                        });
                    } else {
                        mixer = null;
                    }
                },
                undefined,
                function (error) {
                    console.error('An error happened loading the model:', error);
                }
            );
        }

        window.loadModelForSelectedItem = function (selectedItemId, modelpaths) {
            const path = modelpaths[selectedItemId];
            if (path) {
                loadModel(path);
            }
        };

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (!container) return; // Add check for container
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        if (mixer) {
            const delta = clock.getDelta();
            mixer.update(delta);
        }

        renderer.render(scene, camera);
    }

    const clock = new THREE.Clock();

    init();
    animate();

    const items = [
        { id: 1, name: 'Full device' },
        { id: 2, name: 'Microcontroller (MCU)' },
        { id: 3, name: 'Iridium 9603n' },
        { id: 4, name: 'Pressure / Depth Sensor' },
        { id: 5, name: 'IMU ( Acceerometer + Gyroscope )' },
        { id: 6, name: 'Hydrophone' },
        { id: 7, name: 'GPS' },
        { id: 8, name: 'Temperature Sensor' },
    ];

    const modelpaths = {
        1: '3d Models/Mighty Borwo (1).glb',
        2: '3d Models/control.glb',
        3: '3d Models/iridium.glb',
        4: '3d Models/depth sensor.glb',
        5: '3d Models/gyroscope and acceleration.glb',
        6: '3d Models/hydrophone.glb',
        7: '3d Models/Gps.glb',
        8: '3d Models/temp sensor.glb',
    };

    let selectedItemId = items[0].id;

    function initPieChart() {
        const pieChartCanvas = document.getElementById('pieChart');
        if (pieChartCanvas) {
            const ctx = pieChartCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
                    datasets: [{
                        label: 'Sample Data',
                        data: [300, 50, 100, 75],
                        backgroundColor: [
                            'rgba(100, 150, 255, 0.8)',
                            'rgba(150, 100, 255, 0.8)',
                            'rgba(100, 255, 150, 0.8)',
                            'rgba(255, 150, 100, 0.8)'
                        ],
                        borderColor: [
                            'rgba(100, 150, 255, 1)',
                            'rgba(150, 100, 255, 1)',
                            'rgba(100, 255, 150, 1)',
                            'rgba(255, 150, 100, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
                // Removed options object to simplify and potentially resolve syntax errors
            });
        }
    }

    function initLineChart() {
        const lineChartCanvas = document.getElementById('lineChart');
        if (lineChartCanvas) {
            const ctx = lineChartCanvas.getContext('2d');
            // Simplified Chart.js configuration to isolate syntax errors
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Performance Trend',
                        data: [65, 59, 80, 81, 56, 55, 40, 70, 90, 85, 75, 60],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }
                // Removed options object to simplify and potentially resolve syntax errors
            });
        }
    }

    function renderItems() {
        const itemsList = document.getElementById('items-list');
        if (!itemsList) return; // Add check for element
        itemsList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.textContent = item.name;
            itemElement.dataset.id = item.id;

            if (selectedItemId === item.id) {
                itemElement.classList.add('selected');
            }

            itemElement.addEventListener('click', () => {
                selectedItemId = item.id;
                renderItems();
                window.loadModelForSelectedItem(selectedItemId, modelpaths);
            });

            itemsList.appendChild(itemElement);
        });
    }

    function handlePrev() {
        if (selectedItemId === null) {
            selectedItemId = items[0].id;
        } else {
            const currentSelectedIndex = items.findIndex(item => item.id === selectedItemId);
            let newIndex = currentSelectedIndex - 1;
            if (newIndex < 0) {
                newIndex = items.length - 1;
            }
            selectedItemId = items[newIndex].id;
        }
        renderItems();
        window.loadModelForSelectedItem(selectedItemId, modelpaths);
    }

    function handleNext() {
        if (selectedItemId === null) {
            selectedItemId = items[0].id;
        } else {
            const currentSelectedIndex = items.findIndex(item => item.id === selectedItemId);
            let newIndex = currentSelectedIndex + 1;
            if (newIndex >= items.length) {
                newIndex = 0;
            }
            selectedItemId = items[newIndex].id;
        }
        renderItems();
        window.loadModelForSelectedItem(selectedItemId, modelpaths);
    }

    function initNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const toggleRotateBtn = document.getElementById('toggle-rotate-btn');

        if (prevBtn) prevBtn.addEventListener('click', handlePrev);
        if (nextBtn) nextBtn.addEventListener('click', handleNext);
        if (toggleRotateBtn) {
            toggleRotateBtn.addEventListener('click', () => {
                controls.autoRotate = !controls.autoRotate;
                toggleRotateBtn.textContent = controls.autoRotate ? 'Auto-Rotate ON' : 'Auto-Rotate OFF';
            });
        }
    }

    initPieChart();
    initLineChart();
    renderItems();
    initNavigation();
    // Initial model load
    window.loadModelForSelectedItem(selectedItemId, modelpaths);
});