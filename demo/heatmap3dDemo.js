//=========================================================
//
//
//========================================================= 
var camera, scene, renderer, controls, canvasMesh;
 
function createCube(scene,jsonData,width,height) {
    
    var jsonObj = JSON.parse(jsonData); 
    var nodesCount = Object.keys(jsonObj.nodes).length;

    for (var i = 0; i < nodesCount; ++i){ // nodesCount
    // Cube
        var geometry = new THREE.BoxGeometry( jsonObj.nodes[i].W, jsonObj.nodes[i].H, jsonObj.nodes[i].L );
 
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.5} );
        var cube = new THREE.Mesh( geometry, material );
        
        cube.position.x =   jsonObj.nodes[i].X - (width/2) + (jsonObj.nodes[i].W/2);  
        cube.position.y =  -(jsonObj.nodes[i].Y - (height/2) + (jsonObj.nodes[i].H/2));
        cube.position.z =  jsonObj.nodes[i].Z + (jsonObj.nodes[i].L/2);//jsonObj.nodes[i].Z;
        
        scene.add( cube );
    //
 
    }
}

function createRenderer( width, height, length) {

    renderer = new THREE.WebGLRenderer(); 
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);

    scene = new THREE.Scene();
     // camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000);
    camera = new THREE.OrthographicCamera( width/-2, width/2, height/2, height/-2, 1, 1000 );
    camera.position.z = 600;
    scene.add(camera);
         
    createCube(scene,tJsonData,width,height);

    renderer.render(scene, camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
 
    animate();
    
}

function animate() {
    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
    controls.update();
}
//=========================================================
//
//
//========================================================= 
$(function() {
  
    $("#Move").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,
        label: 'Move'
    });
  
});  
   
$(document).ready(function () {
 
    var canvases=[]; 
    var canvasWidth = 600;
    var canvasHeight = 600;
    var canvasLength = 100;
    var viewDirection = 1;
    var interval = 10;
    var index;
    
    switch(viewDirection){
        case 1:
            index = canvasLength/interval;
        break;
        case 2:
            index = canvasHeight/interval;
        break;
        case 3:
            index = canvasWidth/interval;
        break;
    }

    var j_heatmap3d = new heatmap3d.create();
    
	j_heatmap3d.setData(tJsonData);
   
    for (var i = 0; i < index; ++i){
         canvases[i] = j_heatmap3d.createHeatmap2dCanvases( canvasWidth, canvasHeight, canvasLength, viewDirection, interval, i);
    }
         
    var j = 0;
	
//---------------------------------- 
     createRenderer( canvasWidth, canvasHeight, canvasLength);  
//---------------------------------- 
    $("#Move").click(function(){ 
 
        if(canvasMesh){
            var selectedObject = scene.getObjectByName(canvasMesh.name);
            scene.remove( selectedObject );
        }
        
        canvasMesh =  j_heatmap3d.createCanvasMesh(canvases[j], canvasWidth, canvasHeight, canvasLength, viewDirection,  j*interval, false );
        scene.add( canvasMesh );
    
        j++;
        if(j>=index){
            j=0;
        }
 

    });
//----------------------------------
 
});