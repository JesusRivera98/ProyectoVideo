//import * as THREE from 'three';

/********************* variables ******************************/
//Tamaño de pantalla
var ancho = window.innerWidth; // Ancho de pantalla
var alto = window.innerHeight; // Alto de pantalla

//Preparamos el render
console.log("render", Render)
var Render = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
console.log("render", Render)
Render.shadowMap.enabled = true;
console.log("render", Render)
//El escenario
var Escenario = new THREE.Scene();

var angulo = 45;
var aspecto = ancho / alto;
var cerca = 0.1;
var lejos = 10000
//La cámara
var Camara = new THREE.PerspectiveCamera(angulo, aspecto, cerca, lejos);
THREEx.WindowResize(Render, Camara)
//La figura
var Figura;

//El vector
var ElVector

//Cotroles
var controls
var control2

//La textura para el modelo
var textura = new THREE.TextureLoader().load('texturas/muro.jpg');

// textura la misma indicaci�n que maneja las figuras geometricas
var textura_geometrias = new THREE.TextureLoader().load('texturas/muro.jpg');
var material_geometrias = new THREE.MeshLambertMaterial({ map: textura_geometrias, side: THREE.DoubleSide });

// textura la misma indicaci�n que maneja el plano
var textura_plano = new THREE.TextureLoader().load('texturas/cesped.jpg');

//Figuras
var elCubo
var mallaextrusion

//First person
teclado = new THREEx.KeyboardState();
var clock = new THREE.Clock();

//Modelos 3D externos
//var Modelo3D = new THREE.ObjectLoader();
//Modelo3D.load("tinker.obj", funcionAgregarModelo);

//Modelo3D_DAE = THREE.ColladaLoader();
//Modelo3D_DAE.load("rifle.dae", AgregarDae);

var sphere



function AgregarDae(infodae) {
    modeloDAE_Final = infodae.scene;
    modeloDAE_Final.position.set(0, 0, 0);
    //modeloDAE_Final.scale.x = modeloDAE_Final.scale.y = modeloDAE_Final.z = 0.5
    modeloDAE_Final.rotation.y = Math.PI;
    Escenario.add(modeloDAE_Final);
}

/******************************** funciones **************************************/
//Agregar la luz
Luz();
//lucesExample();
//puntoDeLuz();
//rectangleLight();

inicio();
animacion();


/********************* inicio *******************************************/
function inicio() {

    //Activar las sombras
    //Render.shadowMapEnabled = true;
    Render.shadowMap.enabled = true;
    //Tamaño del render
    //Render.setSize(800, 600);
    Render.setSize(ancho, alto);
    //Agregar el render al html
    document.getElementById('render').appendChild(Render.domElement);

    //Acercar la camara a la posición en z
    Camara.position.z = 100;
    Camara.position.y = 10;
    //Agregar la camara al escenario
    Escenario.add(Camara)

    //Territorio
    crear_plano();

    //Cargar nuevos modelos
    cargar_modelo();
    //Cargar el cubo
    crear_cubo();
    //Cargar el cilindro
    crear_cilindro();
    //Cargar la esfera
    crear_esfera();

    //Agregar el escenario y la cámara al render
    //Render.render(Escenario, Camara)
    controls = new THREE.OrbitControls(Camara, Render.domElement);

    //control2 = new THREE.FirstPersonControls(Camara);
    //control2.lookSpeed = 0.1;
    //control2.movementSpped = 100;
    //control2.lookVertical = false;
    //control2.activeLook = true;
}

function cargar_modelo() {
    //Geometría para un punto rojo
    Geometria = new THREE.Geometry()
    ElVector = new THREE.Vector3(10, 0, 0);
    Geometria.vertices.push(ElVector);

    //Geometría para una figura
    GeometriaLinea = new THREE.Geometry()
    var vertices = [
        [2, 7, 0],
        [7, 2, 0],
        [12, 7, 0],
        [12, 17, 0],
        [7, 12, 0],
        [2, 17, 0],
        [2, 7, 0]];

    var long_vertices = vertices.length;
    var array_extrude = [];

    //Se analiza cada vector
    for (i = 0; i < long_vertices; i++) {
        x = vertices[i][0];
        y = vertices[i][1];
        z = vertices[i][2];
        //Se agrega el vector a la geometría
        Vector = new THREE.Vector3(x, y, z);
        //Se agrega el vector a la geometria
        GeometriaLinea.vertices.push(Vector);
        array_extrude.push(Vector)
    }

    //Figura
    var forma_figura = new THREE.Shape(array_extrude);

    //extrusion
    var datos_extrusion = {
        depth: 10, //Cantidad de profundidad
        bevelEnabled: false, //Activado de bisel
        bevelSegments: 1, //Segmentos del bisel
        steps: 5, //profundidad y no. de segmentos de la profundidad
        bevelThickness: 1 //Grosor del bisel
    };


    var extrude_geometria = new THREE.ExtrudeGeometry(forma_figura, datos_extrusion);

    //Generar la textura
    //repetir la textura figura
    textura.repeat.set(0.06, 0.06);
    //repetir la textura de la figura
    textura.wrapS = textura.wrapT = THREE.repeatWrapping;
    //Material de la figura
    var material = new THREE.MeshLambertMaterial({ map: textura, side: THREE.DoubleSide, wireframe: false });

    //La malla
    mallaextrusion = new THREE.Mesh(extrude_geometria, material);

    //agregando al escenario el punto o particula
    ParticulaMaterial = new THREE.PointsMaterial({ color: 0xFF0000 });
    Particula = new THREE.Points(Geometria, ParticulaMaterial);
    Escenario.add(Particula);

    //Agregando al escenario la figura
    Material = new THREE.PointsMaterial({ color: 0xFF0000 });
    Figura = new THREE.Line(GeometriaLinea, Material);
    Escenario.add(Figura)
    Escenario.add(mallaextrusion);
    console.log("extru", mallaextrusion)
}

function crear_plano() {
    //Geometria del plano
    Geometria_plano = new THREE.PlaneGeometry(100, 100, 10, 10);
    //Textura
    Textura_plano = new THREE.TextureLoader().load("texturas/cesped.jpg");
    Textura_plano.wrapS = Textura_plano.wrapT = THREE.RepeatWrapping;
    //Textura_plano.offset.set(0, 0);
    Textura_plano.repeat.set(10, 10);
    //Textura_plano.crossOrigin = ""

    //Materil y agregado la textura
    Material_plano = new THREE.MeshBasicMaterial({ map: Textura_plano, side: THREE.DoubleSide });
    console.log(Material_plano)
    //El plano (Territorio)
    Territorio = new THREE.Mesh(Geometria_plano, Material_plano)
    //Territorio.rotation.y = -0.5;
    Territorio.rotation.x = Math.PI / 2;

    //agregar que se le proyecten las sombras
    Territorio.receiveShadow = true;


    Escenario.add(Territorio);
    console.log("plano", Territorio)
    Axis = new THREE.AxesHelper(100, 100, 100);
    Escenario.add(Axis);
}

function crear_cubo() {

    //Texturas por cara
    var ImgTextura = []

    //Frontal
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("texturas/muro.jpg")
    }));
    console.log(ImgTextura)
    //Trasera
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera.jpg")
    }));
    //superior
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/cuero.jpg")
    }));
    //Inferior
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/muro.jpg")
    }));
    //izquierda
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera3.jpg")
    }));
    //derecha
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera2.jpg")
    }));
    //Generar la geometria del cubo
    geometriaCubo = new THREE.CubeGeometry(10, 10, 10);
    //Material de la figura
    //var material = new THREE.MeshLambertMaterial({ map: textura_geometrias, side: THREE.DoubleSide, wireframe: false });
    //var material = new THREE.MeshLambertMaterial(ImgTextura);

    //Generar la malla con la geometria y el material
    elCubo = new THREE.Mesh(geometriaCubo, ImgTextura);

    //Agregar el cubo al escenario
    Escenario.add(elCubo);
    elCubo.position.set(0, 5, 30);
    elCubo.receiveShadow = true;
    elCubo.castShadow = true
    console.log("cubo", elCubo)
}

function crear_cilindro() {
    geometriaCilindro = new THREE.CylinderGeometry(10, 10, 20, 20, 1, false);
    material = new THREE.MeshLambertMaterial({ map: textura_geometrias });
    var mallaCilindro = new THREE.Mesh(geometriaCilindro, material);
    Escenario.add(mallaCilindro)
    mallaCilindro.castShadow = true
    mallaCilindro.receiveShadow = true
    mallaCilindro.position.set(-20, 10, 25)
    console.log("cilindro", mallaCilindro)
}

function crear_esfera() {
    geometriaEsfera = new THREE.SphereGeometry(10, 10, 10)
    var mallaEsfera = new THREE.Mesh(geometriaEsfera, material);
    Escenario.add(mallaEsfera);
    console.log("esfera", mallaEsfera)
    mallaEsfera.castShadow = true
    mallaEsfera.receiveShadow = true
}

function funcionAgregarModelo(geometry) {
    imagen = new THREE.TextureLoader().load("mario.jpg");
    material = new THREE.MeshLambertMaterial({ map: imagen });
    ModeloFinal = new THREE.Mesh(geometry, material);
    Escenario.add(ModeloFinal);
    ModeloFinal.scale.set(10, 10, 10);
    ModeloFinal.position.set(10, 13, 10);
    ModeloFinal.rotation.y = Math.PI;
    ModeloFinal.castShadow = true;
    ModeloFinal.receiveShadow = true
}

function Luz() {
    var luz = new THREE.PointLight(0xffffff);
    luz.position.set(-100, 200, 100);
    Escenario.add(luz);

    helper = new THREE.PointLightHelper(luz);
    Escenario.add(helper);

    //Luz de ambiente
    var LuzAmbiente = new THREE.AmbientLight(0x000000);
    Escenario.add(LuzAmbiente);

    //más luz
    var sunlight = new THREE.DirectionalLight();
    sunlight.position.set(500, 500, -500);
    sunlight.intensity = 1.3;
    //sunlight.target.position.set(20, 20, 20)

    sunlight.castShadow = true;
    sunlight.shadowVisible = true;

    sunlight.shadow.camera.near = 250;
    sunlight.shadow.camera.far = 20000;

    intensidad = 50;

    sunlight.shadow.left = -intensidad;
    sunlight.shadow.right = intensidad;
    sunlight.shadow.top = intensidad;
    sunlight.shadow.bottom = -intensidad;

    Escenario.add(sunlight)
    Escenario.add(sunlight.target)

    var helper = new THREE.DirectionalLightHelper(sunlight);
    Escenario.add(helper);
    
    /*
    const directionalLight = new THREE.DirectionalLight();
    directionalLight.castShadow = true
    directionalLight.position.set(0, -20, 0)
    //directionalLight.target.position.set(100, 100, 100)
    Escenario.add(directionalLight);
    Escenario.add(directionalLight.target)

    helper2 = new THREE.DirectionalLight(directionalLight);
    Escenario.add(helper2);
    console.log("dun", sunlight)
    console.log("esceke", Escenario)
    */
}

function lucesExample() {
    //Create a WebGLRenderer and turn on shadows in the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //Create a DirectionalLight and turn on shadows for the light
    light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(0, 100, 0); //default; light shining from top
    light.castShadow = true; // default false
    Escenario.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    //Create a sphere that cast shadows (but does not receive them)
    const sphereGeometry = new THREE.SphereBufferGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true; //default is false
    sphere.receiveShadow = false; //default
    Escenario.add(sphere);

    //Create a plane that receives shadows (but does not cast them)
    const planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x23ff00, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    Escenario.add(plane);

    //Create a helper for the shadow camera (optional)
    const helper = new THREE.DirectionalLight(light);
    Escenario.add(helper);

    const ambiente = new THREE.AmbientLight(0x404040); // soft white light
    Escenario.add(ambiente);

    light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(50, 50, 50);
    Escenario.add(light);
}
//lucesExample();
function puntoDeLuz() {
    //Create a WebGLRenderer and turn on shadows in the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //Create a PointLight and turn on shadows for the light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 0);
    light.castShadow = true; // default false
    Escenario.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    //Create a sphere that cast shadows (but does not receive them)
    const sphereGeometry = new THREE.SphereBufferGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true; //default is false
    sphere.receiveShadow = false; //default
    Escenario.add(sphere);

    //Create a plane that receives shadows (but does not cast them)
    const planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    Escenario.add(plane);

    helper = new THREE.PointLightHelper(light);
    Escenario.add(helper);
    helper = new THREE.CameraHelper(Camara);
    //Escenario.add(helper);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    helper = new THREE.CameraHelper(camera);
    //Escenario.add(helper);
}
function rectangleLight() {
    const width = 10;
    const height = 10;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
    rectLight.position.set(5, 5, 0);
    rectLight.lookAt(0, 0, 0);
    Escenario.add(rectLight)

    rectLight.castShadow = true
    console.log(rectLight)
    //helper = new THREE.CameraHelper(rectLight.shadow.camera);
    //Escenario.add(helper);

}

function cambiaCaras() {
    //Texturas por cara
    var ImgTextura = []

    //Frontal
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/muro.jpg")
    }));
    //Trasera
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera.jpg")
    }));
    //superior
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/cuero.jpg")
    }));
    //Inferior
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/muro.jpg")
    }));
    //izquierda
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera3.jpg")
    }));
    //derecha
    ImgTextura.push(new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
            "texturas/madera2.jpg")
    }));

    elCubo.material = ImgTextura
}
function arreglaCaras() {
    console.log("cubo", elCubo)
    for (i = 0; i < 6; i++) {
        elCubo.material[i].map = new THREE.TextureLoader().load(
            "texturas/cesped.jpg")
    }
    console.log(elCubo)

}

function animacion() {
    requestAnimationFrame(animacion);
    render_modelo();
    //Rotación
    mallaextrusion.rotation.x = Math.PI / 2
    //Traslación
    mallaextrusion.position.x = 20
    mallaextrusion.position.y = 20
    //Escalado
    mallaextrusion.scale.x = 3
    mallaextrusion.scale.y = 3
    mallaextrusion.scale.z = 3

    objetivo = elCubo
    //Funciones del teclado
    if (teclado.pressed("up")) {
        objetivo.rotation.x += -.01
    }
    if (teclado.pressed("down")) {
        objetivo.rotation.x -= -.01
    }
    if (teclado.pressed("W")) {
        objetivo.position.z += -1
    }
    if (teclado.pressed("S")) {
        objetivo.position.z -= -1
    }
    if (teclado.pressed("a")) {
        objetivo.position.x += -1
    }
    if (teclado.pressed("d")) {
        objetivo.position.x -= -1
    }

    if (teclado.pressed("m")) {
        objetivo.scale.x += .1
        objetivo.scale.y += .1
        objetivo.scale.z += .1
    }
    if (teclado.pressed("L")) {
        objetivo.scale.x -= .1
        objetivo.scale.y -= .1
        objetivo.scale.z -= .1
    }
    if (teclado.pressed('1')) {
        console.log(1)
        cambiaCaras()
    }
    if (teclado.pressed('2')) {
        console.log(2)
        arreglaCaras()
    }
    //if (teclado.pressed()){
    //console.log(teclado)
    //}


    controls.target.set(objetivo.position.x, objetivo.position.y, objetivo.position.z);
}

function render_modelo() {
    controls.update();
    Figura.rotation.y += 0.01;
    //Agregar el escenario y la cámara al render

    var delta = clock.getDelta();
    //control2.update(delta)

    Render.render(Escenario, Camara)
    //Render.render(Escenario, Camara)
}