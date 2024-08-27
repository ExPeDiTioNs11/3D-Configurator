// Definition of HTML elements
const elements = {
    tilt: document.getElementById('tilt'),
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    errorMessage: document.getElementById('error-message'),
    sensorSelect: document.getElementById('sensorSelect'),
    switchPosition: document.getElementById('switchPosition'),
    tiltArea: document.getElementById('tiltSelectorArea'),
    switchPositionDisplay: document.getElementById('switch-position')
};

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 400);
document.getElementById('3d-view').appendChild(renderer.domElement);

// Add lights to the scene
function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-1, -5, 3);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.distance = 10;
    spotLight.castShadow = true;
    scene.add(spotLight);
}

addLights();

// Create mirror object
const mirrorDimensions = { width: 1.5, height: 0.8 }; // 1500 mm x 800 mm
const mirrorGeometry = new THREE.PlaneGeometry(mirrorDimensions.width, mirrorDimensions.height);
const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
scene.add(mirror);

// Create sensor object
const sensorGeometry = new THREE.CircleGeometry(0.05, 32); // Radius 0.05 meters (50 mm)
const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
sensor.name = 'sensor';

// Set camera position
camera.position.z = 2;

// Update mirror dimensions
function updateMirrorDimensions() {
    const width = elements.width.value / 1000; // Convert mm to meters
    const height = elements.height.value / 1000;

    if (width >= 0.4 && width <= 2.5 && height >= 0.4 && height <= 2.5) {
        elements.errorMessage.textContent = '';
        mirror.scale.set(width / mirrorDimensions.width, height / mirrorDimensions.height, 1);
        updateSensorPosition(elements.switchPosition.value);
    } else {
        elements.errorMessage.textContent = 'Please enter valid dimensions (400mm - 2500mm).';
    }
}

// Handle mirror tilt
function handleTiltInput() {
    const tiltValue = elements.tilt.value;
    mirror.rotation.y = THREE.Math.degToRad(tiltValue);
    updateSensorPosition(elements.switchPosition.value);
}

// Handle sensor visibility
function handleSensorVisibility() {
    const selectedSensor = elements.sensorSelect.value;

    elements.switchPositionDisplay.style.display = selectedSensor === '1' ? 'block' : 'none';
    
    if (selectedSensor === '1') {
        elements.tilt.value = 0;
        const event = new Event('input', { bubbles: true });
        elements.tilt.dispatchEvent(event);
        
        scene.add(sensor);
        elements.tiltArea.style.display = 'none';
    } else {
        scene.remove(sensor);
        elements.tiltArea.style.display = 'block';
    }

    // Update sensor position when a sensor is selected
    if (selectedSensor === '1') {
        updateSensorPosition(elements.switchPosition.value);
    } else {
        const sensorObject = scene.getObjectByName('sensor');
        if (sensorObject) {
            sensorObject.position.set(0, 0, -100); // Move sensor out of view
        }
    }
}

// Update sensor position based on switch position
function updateSensorPosition(position) {
    const width = mirror.scale.x * mirrorDimensions.width;
    const height = mirror.scale.y * mirrorDimensions.height;

    const positions = {
        '1:30': { x: width / 2 - 0.05, y: height / 2 - 0.05 },
        '3:00': { x: width / 2 - 0.05, y: 0 },
        '4:30': { x: width / 2 - 0.05, y: -height / 2 + 0.05 },
        '6:00': { x: 0, y: -height / 2 + 0.05 },
        '7:30': { x: -width / 2 + 0.05, y: -height / 2 + 0.05 },
        '9:00': { x: -width / 2 + 0.05, y: 0 },
        '10:30': { x: -width / 2 + 0.05, y: height / 2 - 0.05 },
        '12:00': { x: 0, y: height / 2 - 0.05 }
    };

    const { x = 0, y = 0 } = positions[position] || {};

    const tiltRad = mirror.rotation.y;
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);

    const sensorX = x * cosTilt - y * sinTilt;
    const sensorY = x * sinTilt + y * cosTilt;

    if (Math.abs(sensorX) <= width / 2 && Math.abs(sensorY) <= height / 2) {
        const sensorObject = scene.getObjectByName('sensor');
        if (sensorObject) {
            sensorObject.position.set(sensorX, sensorY, sensorObject.position.z);
            sensorObject.position.z = Math.max(sensorObject.position.z, 0.01);
            console.log(`Sensor moved to position: (${sensorX}, ${sensorY}, ${sensorObject.position.z})`);
        }
    }
}

// Event Listeners
elements.tilt.addEventListener('input', handleTiltInput);
elements.width.addEventListener('input', updateMirrorDimensions);
elements.height.addEventListener('input', updateMirrorDimensions);
elements.sensorSelect.addEventListener('change', handleSensorVisibility);
elements.switchPosition.addEventListener('change', function() {
    updateSensorPosition(this.value);
});

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
