var arToolkitContext=false;


function init_three()
{
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

	renderer.setSize(window.innerWidth, window.innerHeight); // <canvas> - "розтягування" холста до розмірів вікна
	document.body.appendChild(renderer.domElement); // додавання холста до документа

	scene = new THREE.Scene();
	// Create a camera
	camera = new THREE.Camera();
	camera.position.z=500;
	scene.add(camera);

		spheregeometry=new THREE.SphereGeometry(6, 64, 32);
		loader = new THREE.TextureLoader();
		spherematerial = new THREE.MeshBasicMaterial({map: loader.load('texture.jpg')});
		spheremesh=new THREE.Mesh(spheregeometry, spherematerial);
		spheremesh.position.set(Math.PI, 0, 0);
		spheremesh.rotation.set(-Math.PI/2, 0, 0);

		ring1geometry = new THREE.RingGeometry(6.7, 7.45, 5.0);
		ring1material = new THREE.MeshBasicMaterial({color: "black", side: THREE.DoubleSide});
		ring1mesh = new THREE.Mesh(ring1geometry, ring1material);
		ring1mesh.rotation.set(0, 0, 0);

		ring2geometry = new THREE.RingGeometry(7.45, 9.2, 5.0);
		ring2material = new THREE.MeshBasicMaterial({color: "#49403B", side: THREE.DoubleSide});
		ring2mesh = new THREE.Mesh(ring2geometry, ring2material);
		ring2mesh.rotation.set(0, 0, 0);

		ring3geometry = new THREE.RingGeometry(9.2, 11.7580, 5.0);
		ring3material = new THREE.MeshBasicMaterial({color: "#D4BEA2", side: THREE.DoubleSide});
		ring3mesh = new THREE.Mesh(ring3geometry, ring3material);
		ring3mesh.rotation.set(0, 0, 0);

		ring4geometry = new THREE.RingGeometry(11.7580, 12.2, 5.0);
		ring4material = new THREE.MeshBasicMaterial({color: "#1B0A20", side: THREE.DoubleSide});
		ring4mesh = new THREE.Mesh(ring4geometry, ring4material);
		ring4mesh.rotation.set(0, 0, 0);

		ring5geometry = new THREE.RingGeometry(12.2170, 13.6775, 5.0);
		ring5material = new THREE.MeshBasicMaterial({color: "#978672", side: THREE.DoubleSide});
		ring5mesh = new THREE.Mesh(ring5geometry, ring5material);
		ring5mesh.rotation.set(0, 0, 0);

		group = new THREE.Group();
		group.add(spheremesh);
		group.add(ring1mesh);
		group.add(ring2mesh);
		group.add(ring3mesh);
		group.add(ring4mesh);
		group.add(ring5mesh);
		scene.add(group);
		group.rotation.z = 27*Math.PI/180; //для нахилу осі
		group.rotation.x = Math.PI/16; //для видимості кілець

	scene.visible = false

	requestAnimationFrame(animate);
}

function onResize() 
{
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if (window.arToolkitContext.arController !== null) {
		arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas)
	}
}


function initARContext() 
{ // create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: "https://raw.githack.com/AR-js-org/AR.js/master/data/data/camera_para.dat",
		detectionMode: 'mono'
	})

	// initialize it
	arToolkitContext.init(() => { // copy projection matrix to camera
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
		arToolkitContext.arController.orientation = 'landscape';
		arToolkitContext.arController.options.orientation = 'landscape';
		console.log('arToolkitContext', arToolkitContext);
		window.arToolkitContext = arToolkitContext;
	})

	arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type: 'pattern',
		patternUrl: 'https://raw.githack.com/AR-js-org/AR.js/master/data/data/patt.hiro',
		changeMatrixMode: 'cameraTransformMatrix'
	})

	console.log('ArMarkerControls', arMarkerControls);
	window.arMarkerControls = arMarkerControls;
}


function onReady() 
{
	arToolkitSource.domElement.addEventListener('canplay', () => {
		console.log("Камера працює");
		initARContext();
	});
	window.arToolkitSource = arToolkitSource;
	setTimeout(() => { onResize() }, 100);
}


function init_ar()
{
	arToolkitSource = new THREEx.ArToolkitSource({sourceType: 'webcam', sourceWidth: 640, sourceHeight: 480})

	arToolkitSource.init(onReady);

	window.addEventListener('resize', function () {
		onResize()
	})

}


function animate() 
{
	requestAnimationFrame(animate);

	if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
		return;
	}

	arToolkitContext.update(arToolkitSource.domElement)

	// update scene.visible if the marker is seen
	scene.visible = camera.visible

	spheremesh.rotation.y += 0.01;
	renderer.render(scene, camera);
}
