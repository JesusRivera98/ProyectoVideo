//import * as THREE from 'three';

/********************* variables ******************************/
//Tamaño de pantalla
WIDTH = window.innerWidth; // Ancho de pantalla
HEIGHT = window.innerHeight; // Alto de pantalla

//Preparamos el render
var Render = new THREE.WebGLRenderer();

//El escenario
var Escenario = new THREE.Scene();

//La cámara
var Camara = new THREE.PerspectiveCamera();

//La figura
var Figura;

//El vector
var ElVector

//Cotroles
//var controls

/******************************** funciones **************************************/
inicio();
animacion();
/********************* inicio *******************************************/
function inicio() {

    //Tamaño del render
    //Render.setSize(800, 600);
    Render.setSize(WIDTH, HEIGHT);
    //Agregar el render al html
    document.getElementById('render').appendChild(Render.domElement);




    //Acercar la camara a la posición en z
    Camara.position.z = 100;
    //Agregar la camara al escenario
    Escenario.add(Camara)

    //Cargar nuevos modelos
    cargar_modelo();

    //Agregar el escenario y la cámara al render
    //Render.render(Escenario, Camara)
    //controls = new THREE.OrbitControls(Camara, Render.domElement);
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
        [2, 7, 0],
        [2, 7, 2],
        [7, 2, 2],
        [12, 7, 2],
        [12, 17, 2],
        [7, 12, 2],
        [2, 17, 2],
        [2, 7, 2]];

    var long_vertices = vertices.length;

    //Se analiza cada vector
    for (i = 0; i < long_vertices; i++) {
        x = vertices[i][0];
        y = vertices[i][1];
        z = vertices[i][2];
        //Se agrega el vector a la geometría
        Vector = new THREE.Vector3(x, y, z);
        GeometriaLinea.vertices.push(Vector);
    }

    //agregando al escenario el punto o particula
    ParticulaMaterial = new THREE.PointsMaterial({ color: 0xFF0000 });
    Particula = new THREE.ParticleSystem(Geometria, ParticulaMaterial);
    Escenario.add(Particula)

    //Agregando al escenario la figura
    Material = new THREE.PointsMaterial({ color: 0xFF0000 });
    Figura = new THREE.Line(GeometriaLinea, Material);
    Escenario.add(Figura)
}

function animacion() {
    requestAnimationFrame(animacion);
    render_modelo();
}

function render_modelo() {
    //controls.update();
    Figura.rotation.y += 0.01;
    //Agregar el escenario y la cámara al render
    Render.render(Escenario, Camara)
}