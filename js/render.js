//import * as THREE from 'three';

/********************* variables ******************************/
//Tamaño de pantalla
var ancho = window.innerWidth; // Ancho de pantalla
var alto = window.innerHeight; // Alto de pantalla

//Preparamos el render
var Render = new THREE.WebGLRenderer();

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

//La textura para el modelo
var textura = new THREE.ImageUtils.loadTexture('texturas/muro.jpg');

// textura la misma indicaci�n que maneja las figuras geometricas
var textura_geometrias = new THREE.ImageUtils.loadTexture('texturas/muro.jpg');
var material_geometrias = new THREE.MeshBasicMaterial({ map: textura_geometrias, side: THREE.DoubleSide, wireframe: false });

// textura la misma indicaci�n que maneja el plano
var textura_plano = new THREE.ImageUtils.loadTexture('texturas/cesped.jpg');

var elCubo
var mallaextrusion

/******************************** funciones **************************************/
inicio();
animacion();
/********************* inicio *******************************************/
function inicio() {

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
    //crear_cilindro();
    //Cargar la esfera
    //crear_esfera();

    //Agregar el escenario y la cámara al render
    //Render.render(Escenario, Camara)
    controls = new THREE.OrbitControls(Camara, Render.domElement);
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
        amount: 10, //Cantidad de profundidad
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
    var material = new THREE.MeshBasicMaterial({ map: textura, side: THREE.DoubleSide, wireframe: false });

    //La malla
    mallaextrusion = new THREE.Mesh(extrude_geometria, material);

    //agregando al escenario el punto o particula
    ParticulaMaterial = new THREE.ParticleBasicMaterial({ color: 0xFF0000 });
    Particula = new THREE.ParticleSystem(Geometria, ParticulaMaterial);
    Escenario.add(Particula);

    //Agregando al escenario la figura
    Material = new THREE.ParticleBasicMaterial({ color: 0xFF0000 });
    Figura = new THREE.Line(GeometriaLinea, Material);
    Escenario.add(Figura)
    Escenario.add(mallaextrusion);
}

function crear_plano() {
    //Geometria del plano
    Geometria_plano = new THREE.PlaneGeometry(100, 100, 10, 10);
    //Textura
    Textura_plano = new THREE.ImageUtils.loadTexture("texturas/cesped.jpg");
    Textura_plano.wrapS = Textura_plano.wrapT = THREE.RepeatWrapping;
    Textura_plano.repeat.set(10, 10);
    //Textura_plano.crossOrigin = ""

    //Materil y agregado la textura
    Material_plano = new THREE.MeshBasicMaterial({ map: Textura_plano, side: THREE.DoubleSide });
    //El plano (Territorio)
    Territorio = new THREE.Mesh(Geometria_plano, Material_plano)
    //Territorio.rotation.y = -0.5;
    Territorio.rotation.x = Math.PI / 2;
    Escenario.add(Territorio);
}

function crear_cubo() {
    //Generar la geometria del cubo
    geometriaCubo = new THREE.CubeGeometry(10, 10, 10);
    //Material de la figura
    var material = new THREE.MeshBasicMaterial({ map: textura_geometrias, side: THREE.DoubleSide, wireframe: false });

    //Generar la malla con la geometria y el material
    elCubo = new THREE.Mesh(geometriaCubo, material);
    
    //Agregar el cubo al escenario
    Escenario.add(elCubo);
}

function crear_cilindro() {
    geometriaCilindro = new THREE.CylinderGeometry(10,10,20,20,1, false);
    var mallaCilindro = new THREE.Mesh(geometriaCilindro, material_geometrias);
    Escenario.add(mallaCilindro)
}

function crear_esfera() {
    geometriaEsfera = new THREE.SphereGeometry(10,10,10)
    var mallaEsfera = new THREE.Mesh(geometriaEsfera, Material_plano);
    Escenario.add(mallaEsfera);
}

function animacion() {
    requestAnimationFrame(animacion);
    render_modelo();
    //Rotación
    mallaextrusion.rotation.x = Math.PI/2
    //Traslación
    mallaextrusion.position.x = 20
    mallaextrusion.position.y = 20
    //Escalado
    mallaextrusion.scale.x = 3
    mallaextrusion.scale.y = 3
    mallaextrusion.scale.z = 3
}

function render_modelo() {
    controls.update();
    Figura.rotation.y += 0.01;
    //Agregar el escenario y la cámara al render
    Render.render(Escenario, Camara)
}