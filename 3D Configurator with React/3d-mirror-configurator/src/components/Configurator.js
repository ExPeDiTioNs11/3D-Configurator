import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "../styles/Configurator.css";

const Configurator = () => {
    const [dimensions, setDimensions] = useState({ width: 1500, height: 800 }); // Dimensions of the mirror
    const [tilt, setTilt] = useState(0); // tilt angle
    const [sensor, setSensor] = useState(false); // sensor status
    const [switchPosition, setSwitchPosition] = useState(""); // sensor location
    const [tempDimensions, setTempDimensions] = useState({ width: 1500, height: 800 }); // Temporary dimensions
    const errorMessage = useRef(null);   // Reference for error message
    const threeContainer = useRef(null); // Reference for 3D scene

    useEffect(() => {
        // Create Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(600, 400);

        const threeContainerCurrent = threeContainer.current; // Ref değerini bir değişkene kopyala
        if (threeContainerCurrent) {
            threeContainerCurrent.appendChild(renderer.domElement); // Renderer'ı DOM'a ekle
        }

        // Add ambient light (general light)
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        // The geometry and material of the mirror are created
        const mirrorGeometry = new THREE.PlaneGeometry(
            dimensions.width / 1000,
            dimensions.height / 1000
        );
        const mirrorMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            side: THREE.DoubleSide,
        });
        const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirror.rotation.y = THREE.MathUtils.degToRad(tilt);
        scene.add(mirror);

        // Sensor geometry and material
        const sensorGeometry = new THREE.CircleGeometry(0.05, 32);
        const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const sensorMesh = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensorMesh.name = "sensor";

        // Add sensor if selected and reset tilt angle
        if (sensor) {
            scene.add(sensorMesh);
            setTilt(0);
        }

        // Sensor position update function
        const updateSensorPosition = (position) => {
            const width = mirror.scale.x * dimensions.width / 1000;
            const height = mirror.scale.y * dimensions.height / 1000;
            const positions = {
                "1:30": { x: width / 2 - 0.05, y: height / 2 - 0.05 },
                "3:00": { x: width / 2 - 0.05, y: 0 },
                "4:30": { x: width / 2 - 0.05, y: -height / 2 + 0.05 },
                "6:00": { x: 0, y: -height / 2 + 0.05 },
                "7:30": { x: -width / 2 + 0.05, y: -height / 2 + 0.05 },
                "9:00": { x: -width / 2 + 0.05, y: 0 },
                "10:30": { x: -width / 2 + 0.05, y: height / 2 - 0.05 },
                "12:00": { x: 0, y: height / 2 - 0.05 }
            };
            const { x = 0, y = 0 } = positions[position] || {};
            const tiltRad = mirror.rotation.y;
            const cosTilt = Math.cos(tiltRad);
            const sinTilt = Math.sin(tiltRad);
            sensorMesh.position.set(x * cosTilt - y * sinTilt, x * sinTilt + y * cosTilt, 0.01);
        };

        // Update sensor location if sensor and location selected
        if (sensor && switchPosition) {
            updateSensorPosition(switchPosition);
        }

        // Adjust camera position
        camera.position.z = 2;
        
        // animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Cleaning operations
        return () => {
            if (threeContainerCurrent) {
                threeContainerCurrent.removeChild(renderer.domElement);
            }
        };
    }, [dimensions, tilt, sensor, switchPosition]);

    // Update temporary dimensions when dimensions are changed
    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setTempDimensions({ ...tempDimensions, [name]: value });
    };

    // Validate and update when Dimensions field goes out of focus
    const handleDimensionBlur = (e) => {
        const { name, value } = e.target;
        const newValue = Number(value);
        const clampedValue = Math.max(300, Math.min(2500, newValue));
        setDimensions({ ...dimensions, [name]: clampedValue });

        if (newValue < 300 || newValue > 2500) {
            errorMessage.current.innerText = `mirror ${name} must be minimum 300mm or maximum 2500mm.`;
        } else {
            errorMessage.current.innerText = "";
        }
    };

     // Update sensor selection
    const handleSensorChange = (e) => {
        const isSelected = e.target.value === "1";
        setSensor(isSelected);
        if (!isSelected) {
            setTilt(0);
        }
    };

    return (
        <div className="configurator">
            <h1>3D Mirror Configurator</h1>
            <div className="controls">
                <label>Width (mm):</label>
                <input
                    type="number"
                    name="width"
                    value={tempDimensions.width}
                    onChange={handleDimensionChange}
                    onBlur={handleDimensionBlur}
                />
                <label>Height (mm):</label>
                <input
                    type="number"
                    name="height"
                    value={tempDimensions.height}
                    onChange={handleDimensionChange}
                    onBlur={handleDimensionBlur}
                />
                <label>Tilt (degrees):</label>
                <input
                    type="range"
                    min="-45"
                    max="45"
                    value={tilt}
                    onChange={(e) => setTilt(e.target.value)}
                    disabled={sensor} // If the sensor is selected, otherwise disable tilt adjustment
                />
                <label>Add Sensor:</label>
                <select onChange={handleSensorChange}>
                    <option value="0">-- Select Sensor --</option>
                    <option value="1">Touch-Sensor + 49.99 €</option>
                </select>
                {sensor && (
                    <div>
                        <label>Switch Position:</label>
                        <select onChange={(e) => setSwitchPosition(e.target.value)}>
                            <option value="">-- Select Position --</option>
                            <option value="1:30">1:30 Uhr (rechts oben)</option>
                            <option value="3:00">3:00 Uhr (rechts)</option>
                            <option value="4:30">4:30 Uhr (rechts unten)</option>
                            <option value="6:00">6:00 Uhr (unten mittig)</option>
                            <option value="7:30">7:30 Uhr (links unten)</option>
                            <option value="9:00">9:00 Uhr (links)</option>
                            <option value="10:30">10:30 Uhr (links oben)</option>
                            <option value="12:00">12:00 Uhr (oben)</option>
                        </select>
                    </div>
                )}
            </div>
            <div ref={errorMessage} id="error-message"></div>
            <div id="3d-view" ref={threeContainer}></div>
        </div>
    );
};

export default Configurator;
