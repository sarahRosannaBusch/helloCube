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
    var elem = {}; //store dom elems once on load for efficiency
    var vars = {}; //variables available to all functions in main

    that.init = function() {
        _initSpinningCubes();
        _initExtrudeHeart();
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

        const scene = new THREE.Scene();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const cubes = [
            makeInstance(geometry, 0x44aa88,  0),
            makeInstance(geometry, 0x8844aa, -2),
            makeInstance(geometry, 0xaa8844,  2),
        ];

        renderer.render(scene, camera);

        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            //to make responsive (so blocks don't stretch)
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();   

            cubes.forEach((cube, ndx) => {
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
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

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({color});           
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);           
            cube.position.x = x;           
            return cube;
        }
    }
    
    function _initExtrudeHeart() {
        const canvas = f.html.getElem('#d');
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

            heart.rotation.y = time;

            //to make responsive (so blocks don't stretch)
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();   
        
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