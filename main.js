"use strict"

/** 
 * @filename    main.js
 * @brief       Hello Cube - three.js fundamentals
 * @author      Sarah Rosanna Busch
 * @version     0
 * @date        24 July 2022
 */

var main = (function() {
    var that = {}; //public methods and objects
    var elem = {}; //dom elements

    that.init = function() {
        _initSpinningCubes();
        _initExtrudeHeart();
        _customShape();
        _solidPrimitives();
        _solarSystem();
    }

    function _initSpinningCubes() {
        const canvas = f.html.getElem('#c');
        const renderer = new THREE.WebGLRenderer({canvas});

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2; 
        camera.position.y = 1;
        camera.position.x = 0;

        const scene = new THREE.Scene();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const cubes = [
            makeInstance(geometry, 0x44aa88,  -2),
            makeInstance(geometry, 0x8844aa, 0),
            makeInstance(geometry, 0xaa8844,  2),
        ];       

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({color});           
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);           
            cube.position.x = x;        
            return cube;
        }

        renderer.render(scene, camera);

        let bounceUp = true; //goes false when boxes go down
        let turn = 0; //which cube's turn is it to go
        let x0 = true; //go right
        let x2 = true;
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }  

            cubes.forEach((cube, i) => {
                if(turn !== i) return;
                let speed = .01;  

                if(bounceUp && cube.position.y > 2) {
                    bounceUp = false;
                } else if(!bounceUp && cube.position.y < 0) {
                    bounceUp = true;
                    turn++;
                    if(turn > 2) turn = 0;
                }      
                if(!bounceUp) {
                    speed *= -1;
                }    
                cube.position.y += speed; 

                switch(i) {
                    case 2:
                        cube.rotation.z += speed; 
                        if(x0 && cube.position.x > 2) {
                            x0 = false;
                        } else if(!x0 && cube.position.x < 1) { 
                            x0 = true;
                        }
                        if(x0) {
                            cube.position.x += 0.001;
                        } else {
                            cube.position.x -= 0.001;
                        }
                    break;
                    case 0:
                        cube.rotation.x += speed;                        
                        if(x2 && cube.position.x > -1) {
                            x2 = false;
                        } else if(!x2 && cube.position.x < -2) { 
                            x2 = true;
                        }
                        if(x2) {
                            cube.position.x += 0.001;
                        } else {
                            cube.position.x -= 0.001;
                        }
                    break;
                    case 1:
                        cube.rotation.y += speed;
                    break;
                    default: break;
                }
            });          
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    
    function _initExtrudeHeart() {
        const canvas = elem.canvasD = f.html.getElem('#d');
        const renderer = new THREE.WebGLRenderer({canvas});

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 30;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        renderer.render(scene, camera);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        //heart
        const shape = new THREE.Shape();
        const x = -2.5;
        const y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const extrudeSettings = {
            steps: 2,  // ui: steps
            depth: 1,  // ui: depth
            bevelEnabled: true,  // ui: bevelEnabled
            bevelThickness: 1,  // ui: bevelThickness
            bevelSize: 1,  // ui: bevelSize
            bevelSegments: 1,  // ui: bevelSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({color: 0xff00ff});           
        const heart = new THREE.Mesh(geometry, material);
        heart.position.x = 0;
        heart.position.y = 0;
        heart.rotation.x = 3; //rads
        scene.add(heart); 

        //animate
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            let offsetTop = elem.canvasD.offsetTop - window.pageYOffset;
            heart.rotation.y = offsetTop * 0.01;   
        
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser
    }

    function _customShape() {
        const canvas = f.html.getElem('#e');
        const renderer = new THREE.WebGLRenderer({canvas, antialias: true}); //antialias smooths lines

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 40;
        camera.position.y = 0;
        camera.position.x = -10;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        renderer.render(scene, camera);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        //puzzle piece
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(10, 0);
        shape.lineTo(10, 10);
        shape.lineTo(7, 10);
        shape.arc(-2,1.5, 2, -0.7, 3.9, false);
        shape.lineTo(0, 10);
        shape.lineTo(0, 7);
        shape.arc(1.5,-2, 2.1, 2.4, 3.75, true);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps: 2,  // ui: steps
            depth: 2.5,  // ui: depth
            curveSegments: 30, //higher = smoother
            bevelEnabled: true,  // ui: bevelEnabled
            bevelThickness: 0.2,  // ui: bevelThickness
            bevelSize: 0.2,  // ui: bevelSize
            bevelSegments: 1,  // ui: bevelSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({color: 0x00ff00});           
        const puzzle = new THREE.Mesh(geometry, material);
        puzzle.position.x = -10;
        puzzle.position.y = -10;
        puzzle.position.z = 10;
        puzzle.rotation.x = -45;
        scene.add(puzzle); 

        //animate
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            //puzzle.rotation.y = time; 
        
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser
    }

    function _solidPrimitives() {
        const canvas = f.html.getElem('#f');
        const renderer = new THREE.WebGLRenderer({canvas, antialias: true}); //antialias smooths lines

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 120;
        camera.position.y = 0;
        camera.position.x = -10;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        renderer.render(scene, camera);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        const objects = [];
        const spread = 15;
         
        // Create mesh and add to scene
        function addSolidGeometry(x, y, geometry) {
            const mesh = new THREE.Mesh(geometry, createMaterial());
            addObject(x, y, mesh);

            function addObject(x, y, obj) {
                obj.position.x = x * spread;
                obj.position.y = y * spread;         
                scene.add(obj);
                objects.push(obj);
              }
      
              function createMaterial() { //with random colour
                  const material = new THREE.MeshPhongMaterial();           
                  const hue = Math.random(); // 0=red .33=green .66=blue
                  const saturation = 1; // 0=no colour
                  const luminance = .5; // 0=black 1=white .5=max colour
                  material.color.setHSL(hue, saturation, luminance);           
                  return material;
              }
        }

        function createBox(x, y) {
            const width = 8;
            const height = 8;
            const depth = 8;
            const geometry = new THREE.BoxGeometry(width, height, depth);
            addSolidGeometry(x, y, geometry);
        }

        function createCone(x, y) {
            const radius = 6;  // ui: radius
            const height = 8;  // ui: height
            const radialSegments = 25;  // ui: radialSegments
            const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
            addSolidGeometry(x, y, geometry);
        }

        function createCylinder(x, y) {
            const radiusTop = 4;  // ui: radiusTop
            const radiusBottom = 4;  // ui: radiusBottom
            const height = 8;  // ui: height
            const radialSegments = 12;  // ui: radialSegments
            const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
            addSolidGeometry(x, y, geometry);
        }

        function createD12(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.DodecahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD20(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.IcosahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD8(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.OctahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD10(x, y) {
            //vertices and faces taken from https://aqandrew.com/blog/10-sided-die-react/
            const sides = 10;
            const vertices = [
              [0, 0, 1],
              [0, 0, -1],
            ].flat();
          
            for (let i = 0; i < sides; ++i) {
              const b = (i * Math.PI * 2) / sides;
              vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
            }

            const faces = [
                [0, 2, 3],
                [0, 3, 4],
                [0, 4, 5],
                [0, 5, 6],
                [0, 6, 7],
                [0, 7, 8],
                [0, 8, 9],
                [0, 9, 10],
                [0, 10, 11],
                [0, 11, 2],
                [1, 3, 2],
                [1, 4, 3],
                [1, 5, 4],
                [1, 6, 5],
                [1, 7, 6],
                [1, 8, 7],
                [1, 9, 8],
                [1, 10, 9],
                [1, 11, 10],
                [1, 2, 11],
            ].flat();

            const radius = 7;  
            const detail = 0;
            const geometry = new THREE.PolyhedronGeometry(vertices, faces, radius, detail);
            addSolidGeometry(x, y, geometry);
        }

        function createSphere(x, y) {
            const radius = 7;  
            const widthSegments = 24;  
            const heightSegments = 24;  
            const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
            addSolidGeometry(x, y, geometry);
        }

        function createD4(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.TetrahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createTorus(x, y) {
            const radius = 5;  // ui: radius
            const tubeRadius = 2;  // ui: tubeRadius
            const radialSegments = 8;  // ui: radialSegments
            const tubularSegments = 24;  // ui: tubularSegments
            const geometry = new THREE.TorusGeometry(
                radius, tubeRadius,
                radialSegments, tubularSegments);
            addSolidGeometry(x, y, geometry);
        }

        function createTorusKnot(x, y) {
            const radius = 3.5;  // ui: radius
            const tubeRadius = 1.5;  // ui: tubeRadius
            const radialSegments = 8;  // ui: radialSegments
            const tubularSegments = 64;  // ui: tubularSegments
            const p = 2;  // ui: p
            const q = 3;  // ui: q
            const geometry = new THREE.TorusKnotGeometry(
                radius, tubeRadius, tubularSegments, radialSegments, p, q);
            addSolidGeometry(x, y, geometry);
        }

        createCone(-2, 2);
        createSphere(0, 2);
        createCylinder(2, 2);

        createD4(-4, 0);
        createBox(-2, 0);
        createD8(0, 0);
        createD12(2, 0);
        createD20(4, 0);

        createD10(-2, -2);
        createTorus(0, -2);
        createTorusKnot(2, -2);

        //animate
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            objects.forEach((obj, i) => {
                obj.rotation.y = time;
                obj.rotation.x = time;
            });

            //to make responsive (so blocks don't stretch)
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();   
        
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser
    }

    function _solarSystem() {
        const canvas = elem.canvasD = f.html.getElem('#g');
        const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 30, 260);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        renderer.render(scene, camera);

        //point light emanates from center of the scene
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);

        // an array of objects whose rotation to update
        const objects = [];
        const sunScale = 109; //is actually 109
        
        // use just one sphere for everything
        const radius = 1;
        const widthSegments = 26;
        const heightSegments = 26;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        //create Solar System
        const solarSystem = new THREE.Object3D(); //like a mesh w/out mat or geom, represens a local space
        scene.add(solarSystem);
        objects.push(solarSystem);
        
        //create Sun
        const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00}); //emissive = glowing object
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(sunScale, sunScale, sunScale);  //scale relative to Earth
        solarSystem.add(sunMesh);
        objects.push(sunMesh);

        //create Earth orbit
        const earthOrbit = new THREE.Object3D();
        earthOrbit.position.x = 9.3 + sunScale;
        solarSystem.add(earthOrbit);
        objects.push(earthOrbit);

        //create Earth
        const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.add(earthMesh);
        objects.push(earthMesh);

        //create Moon orbit
        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);
        
        //create Moon
        const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonMesh.scale.set(.27, .27, .27);
        moonOrbit.add(moonMesh);
        objects.push(moonMesh);

        //create Mercury
        const mercuryMaterial = new THREE.MeshPhongMaterial({color: 'orange', emissive: 'gold'});
        const mercuryMesh = new THREE.Mesh(sphereGeometry, mercuryMaterial);
        mercuryMesh.scale.set(.33, .33, .33);
        mercuryMesh.position.x = -3.5 - sunScale; //in orbit instead
        solarSystem.add(mercuryMesh);
        objects.push(mercuryMesh);

        //create Venus
        const venusMaterial = new THREE.MeshPhongMaterial({color: 'green', emissive: 'forestgreen'});
        const venusMesh = new THREE.Mesh(sphereGeometry, venusMaterial);
        venusMesh.scale.set(.9, .9, .9);
        venusMesh.position.x = -6.7 - sunScale; //in orbit instead
        venusMesh.position.z = -6.7 - sunScale;
        solarSystem.add(venusMesh);
        objects.push(venusMesh);

        //create Mars
        const marsMaterial = new THREE.MeshPhongMaterial({color: 'red', emissive: 'red'});
        const marsMesh = new THREE.Mesh(sphereGeometry, marsMaterial);
        marsMesh.scale.set(.5, .5, .5);
        marsMesh.position.x = 14.2 + sunScale; //in orbit instead
        marsMesh.position.z = -14.2 - sunScale;
        solarSystem.add(marsMesh);
        objects.push(marsMesh);

        //create Jupiter
        const jupiterMaterial = new THREE.MeshPhongMaterial({color: 0x241234, emissive: 0x241234});
        const jupiterMesh = new THREE.Mesh(sphereGeometry, jupiterMaterial);
        jupiterMesh.scale.set(11, 11, 11);
        jupiterMesh.position.x = 48.4 + sunScale; //in orbit instead
        marsMesh.position.z = -48.4 - sunScale;
        solarSystem.add(jupiterMesh);
        objects.push(jupiterMesh);

        //create Saturn
        const saturnMaterial = new THREE.MeshPhongMaterial({color: 0x451234, emissive: 0x451234});
        const saturnMesh = new THREE.Mesh(sphereGeometry, saturnMaterial);
        saturnMesh.scale.set(9, 9, 9);
        saturnMesh.position.z = 88.9 + sunScale;
        solarSystem.add(saturnMesh);
        objects.push(saturnMesh);

        //create Uranus
        const uranusMaterial = new THREE.MeshPhongMaterial({color: 'dodgerblue', emissive: 'dodgerblue'});
        const uranusMesh = new THREE.Mesh(sphereGeometry, uranusMaterial);
        uranusMesh.scale.set(4, 4, 4);
        uranusMesh.position.z = -179 - sunScale;
        solarSystem.add(uranusMesh);
        objects.push(uranusMesh);

        //create Neptune
        const neptuneMaterial = new THREE.MeshPhongMaterial({color: 'cornflowerblue', emissive: 'cornflowerblue'});
        const neptuneMesh = new THREE.Mesh(sphereGeometry, neptuneMaterial);
        neptuneMesh.scale.set(3.9, 3.9, 3.9);
        neptuneMesh.position.x = 288 + sunScale; //in orbit instead
        neptuneMesh.position.z = -288 - sunScale;
        solarSystem.add(neptuneMesh);
        objects.push(neptuneMesh);

        //animate
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            objects.forEach((obj, i) => {
                obj.rotation.y = time;
            }); 
        
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser
    }

    //return true if the canvas resolution needs to change
    function _resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    return that;
}());