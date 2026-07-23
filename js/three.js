// Premium Three.js Environments for STACKLY

document.addEventListener('DOMContentLoaded', () => {
    
    // --- UTILITY: Create Renderer ---
    const createRenderer = (canvas) => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        return renderer;
    };

    // --- SCENE 1: Hero Mesh/Particles ---
    const initHeroScene = () => {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;
        
        const renderer = createRenderer(canvas);

        // Abstract Waves/Particles
        const geometry = new THREE.BufferGeometry();
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            scales[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

        // Custom Shader Material for glowing particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#3B82F6') }, // Accent
                uColor2: { value: new THREE.Color('#10B981') }  // Success
            },
            vertexShader: `
                uniform float uTime;
                attribute float aScale;
                varying vec2 vUv;
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    
                    // Wave motion
                    modelPosition.y += sin(uTime * 0.5 + modelPosition.x * 0.2) * 2.0;
                    modelPosition.x += cos(uTime * 0.3 + modelPosition.y * 0.1) * 1.5;
                    
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectionPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectionPosition;
                    gl_PointSize = 15.0 * aScale * (1.0 / -viewPosition.z);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;
                    
                    vec3 color = mix(uColor1, uColor2, sin(gl_FragCoord.x * 0.01) * 0.5 + 0.5);
                    
                    gl_FragColor = vec4(color, strength * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Mouse Parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        });

        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            material.uniforms.uTime.value = elapsedTime;

            targetX = mouseX * 2;
            targetY = mouseY * 2;
            
            points.rotation.y += 0.05 * (targetX - points.rotation.y);
            points.rotation.x += 0.05 * (targetY - points.rotation.x);
            points.rotation.z = elapsedTime * 0.05;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    // --- SCENE 2: Wealth Globe ---
    const initGlobeScene = () => {
        const canvas = document.getElementById('globe-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        
        // Use container's aspect ratio
        const container = canvas.parentElement;
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 25;
        // Position camera to the left to give space for text
        camera.position.x = -8;
        
        const renderer = createRenderer(canvas);

        // Group to hold globe elements
        const globeGroup = new THREE.Group();
        globeGroup.position.x = 8; // Move globe to the right side of the screen
        scene.add(globeGroup);

        // Globe Sphere
        const sphereGeometry = new THREE.SphereGeometry(8, 64, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x0B1220,
            transparent: true,
            opacity: 0.9,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        globeGroup.add(sphere);

        // Globe Wireframe
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.2 });
        const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(sphereGeometry), wireframeMaterial);
        globeGroup.add(wireframe);

        // Add Points/Cities
        const pointsGeometry = new THREE.BufferGeometry();
        const citiesCount = 100;
        const positions = new Float32Array(citiesCount * 3);
        
        for(let i=0; i<citiesCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / citiesCount);
            const theta = Math.sqrt(citiesCount * Math.PI) * phi;
            
            const r = 8.1; // Slightly larger than sphere
            positions[i*3] = r * Math.cos(theta) * Math.sin(phi);
            positions[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i*3+2] = r * Math.cos(phi);
        }
        
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xF59E0B, // Gold
            transparent: true,
            opacity: 0.8
        });
        const cities = new THREE.Points(pointsGeometry, pointsMaterial);
        globeGroup.add(cities);

        // Animation
        const tick = () => {
            globeGroup.rotation.y += 0.002;
            globeGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
            
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // GSAP ScrollTrigger for Globe entrance
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.from(globeGroup.position, {
                scrollTrigger: {
                    trigger: "#globe-section",
                    start: "top bottom",
                    end: "center center",
                    scrub: 1
                },
                y: -20,
                x: 20
            });
            gsap.from(globeGroup.scale, {
                scrollTrigger: {
                    trigger: "#globe-section",
                    start: "top bottom",
                    end: "center center",
                    scrub: 1
                },
                x: 0.5, y: 0.5, z: 0.5
            });
        }
    };

    // --- SCENE 3: Particles Transition (Floating Coins/Orbs) ---
    const initParticlesScene = () => {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const container = canvas.parentElement;
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 20;
        
        const renderer = createRenderer(canvas);

        const group = new THREE.Group();
        scene.add(group);

        const geometry = new THREE.OctahedronGeometry(0.5, 0); // Diamond like shapes
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x38BDF8,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.9, // glass like
            thickness: 0.5
        });

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x3B82F6, 5, 50);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x10B981, 5, 50);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        const objects = [];
        for (let i = 0; i < 150; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random positions in a wide area
            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Store random speeds for rotation and floating
            mesh.userData = {
                rx: (Math.random() - 0.5) * 0.02,
                ry: (Math.random() - 0.5) * 0.02,
                fy: (Math.random() - 0.5) * 0.02
            };
            
            group.add(mesh);
            objects.push(mesh);
        }

        const tick = () => {
            objects.forEach(obj => {
                obj.rotation.x += obj.userData.rx;
                obj.rotation.y += obj.userData.ry;
                obj.position.y += obj.userData.fy;
                
                // Wrap around
                if (obj.position.y > 10) obj.position.y = -10;
                if (obj.position.y < -10) obj.position.y = 10;
            });

            group.rotation.y += 0.001;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    // Initialize all scenes
    initHeroScene();
    initGlobeScene();
    initParticlesScene();
    
    // Re-init on page transition if needed
    window.addEventListener('pageTransitionComplete', () => {
        initHeroScene();
        initGlobeScene();
        initParticlesScene();
    });
});
