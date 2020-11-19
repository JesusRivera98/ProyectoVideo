//Tamaño de pantalla
WIDTH = window.innerWidth; // Ancho de pantalla
HEIGHT = window.innerHeight; // Alto de pantalla

//Render dentro de <div>
Render = new THREE.WebGLRenderer();
//Render.setSize(800, 600);
Render.setSize(WIDTH, HEIGHT);
document.getElementById('render').appendChild(Render.domElement);

//Escenario
Escenario = new THREE.Scene();

//Cámara
Camara = new THREE.PerspectiveCamera();
Camara.position.z=100;
Escenario.add(Camara)

//Geometría para un punto rojo
Geometria = new THREE.Geometry()
ElVector = new THREE.Vector3(10,0,0);
Geometria.vertices.push(ElVector);

//Geometría para una figura
GeometriaLinea = new THREE.Geometry()
var vertices = [[2,7,0], [7,2,0], [12,7,0], [12,17,0], [7,12,0], [2,17,0], [2,7,0]];
var long_vertices = vertices.length;
//Se analiza cada vector
for(i = 0; i < long_vertices; i++){
    x = vertices[i][0];
    y = vertices[i][1];
    z = vertices[i][2];
    //SE agrega el vector a la geometría
    Vector = new THREE.Vector3(x,y,z);
    GeometriaLinea.vertices.push(Vector);
}

//agregando al escenario el punto o particula
ParticulaMaterial = new THREE.ParticleBasicMaterial({color:0xFF0000});
Particula = new THREE.ParticleSystem(Geometria, ParticulaMaterial);
Escenario.add(Particula)

//Agregando al escenario la figura
Material = new THREE.ParticleBasicMaterial({color:0xFF0000});
Figura = new THREE.Line(GeometriaLinea, Material);
Escenario.add(Figura)

Render.render(Escenario, Camara)