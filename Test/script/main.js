$(document).ready(function()  {
	
	var renderer, scene, camera, mesh;

    init();
    animate();

    function init(){
        // on initialise le moteur de rendu
        renderer = new THREE.WebGLRenderer();

        // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
        // renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(renderer.domElement);

        // on initialise la scène
        scene = new THREE.Scene();

        // on initialise la camera que l’on place ensuite sur la scène
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set(0, 0, 1000);
        scene.add(camera);
        
        // on créé un  cube au quel on définie un matériau puis on l’ajoute à la scène 
        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { color: 0x000FFFF, wireframe: false } );
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        // on ajoute une lumière blanche
        var lumiere = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
        lumiere.position.set( 0, 0, 400 );
        scene.add( lumiere );
    }

    function animate(){
        // on appel la fonction animate() récursivement à chaque frame
        requestAnimationFrame( animate );
        // on fait tourner le cube sur ses axes x et y
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        mesh.position.y += 1;
        // on effectue le rendu de la scène
        renderer.render( scene, camera );
    }
});
