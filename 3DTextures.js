"use strict"

/** 
 * @filename    3DTextures.js
 * @brief       Hello Cube - three.js fundamentals
 * @author      Sarah Rosanna Busch
 * @version     0
 * @date        8 Aug 2022
 */

/** DESCRIPTION
 * Need to run a server to develop with textures since they need to
 * request the image files
 */

var Textures = (function() {
    var that = {}; //public methods and objects

    that.init = function() {
        _initTextureCube();
    }

    function _initTextureCube() {
        const canvas = f.html.getElem('#h');
        const renderer = new THREE.WebGLRenderer({canvas});

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2; 
        camera.position.y = 0;
        camera.position.x = 0;

        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); 
        const textures = [
            loader.load('three/examples/textures/alphaMap.jpg'),
            loader.load('three/examples/textures/brick_bump.jpg'),
            loader.load('three/examples/textures/brick_diffuse.jpg'),
            loader.load('three/examples/textures/brick_roughness.jpg'),
            loader.load('three/examples/textures/colors.png'),
            loader.load('three/examples/textures/crate.gif')
        ];

        textures[0].offset.set(0.5, 0.25); //(xOffset, yOffset)

        textures[2].center.set(.5, .5);
        textures[2].rotation = THREE.MathUtils.degToRad(45);

        textures[4].wrapS = THREE.RepeatWrapping;
        textures[4].wrapT = THREE.RepeatWrapping;
        const timesToRepeatHorizontally = 4;
        const timesToRepeatVertically = 2;
        textures[4].repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

        const materials = [
            new THREE.MeshBasicMaterial({map: textures[0]}),
            new THREE.MeshBasicMaterial({map: textures[1]}),
            new THREE.MeshBasicMaterial({map: textures[2]}),
            new THREE.MeshBasicMaterial({map: textures[3]}),
            new THREE.MeshBasicMaterial({map: textures[4]}),
            new THREE.MeshBasicMaterial({map: textures[5]}),
        ];          
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);      

        renderer.render(scene, camera);

        function render(time) {
            time *= 0.001;  // convert time to seconds  
            let speed = 0.8 * time;
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }  

            cube.rotation.x = speed;
            cube.rotation.y = speed;
            cube.rotation.z = speed;
         
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser

        // const color = 0xFFFFFF;
        // const intensity = 1;
        // const light = new THREE.DirectionalLight(color, intensity);
        // light.position.set(-1, 2, 4);
        // scene.add(light);
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