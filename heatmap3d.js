/*
 (c) 2015, Jeff Yang
  
 https://github.com/ChihChengYang/js-heatmap3d
*/
var heatmap2d = (function() { 

    var canvas;	
    var viewInterval = 10;  
    var viewIndex = 3;    
	var temperatureFade = false;
    var temperatureMin = 10;
    var temperatureMax = 60;

    function create( width, height, depth, viewdirect ) {
        
        var heat2Darray;
        var viewDirection = viewdirect;
        var maxDataValue = 20;
        var radiusValue = 10;
        var blurValue = 10;       

        canvas = document.createElement('canvas');
        var realWidth, realHeight;
        
        if(viewDirection==1){          
            realWidth = width;
            realHeight = height;
        }
        if(viewDirection==2){ 
            realWidth = width;
            realHeight = depth;
        }
        if(viewDirection==3){ 
            realWidth = depth;
            realHeight = height;
        }
        
        heat2Darray = ArrayMatrix(realWidth,realHeight,1);

        canvas.width = realWidth;
        canvas.height = realHeight;

        var heat = simpleheat(canvas), frame;
 
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        heat.max(maxDataValue);
        heat.radius(radiusValue, blurValue);
 
        function setViewInterval(interval){
            viewInterval = interval;    
        }

        function setViewIndex(index){         
            viewIndex = index;  
        } 

        function draw() {
            heat.draw();
            frame = null;
        }
        
        function ArrayMatrix(numrows, numcols, initial){
            var arr = [];
            for (var i = 0; i < numrows; ++i){
                var columns = [];
                for (var j = 0; j < numcols; ++j){
                    columns[j] = initial;
                }
                arr[i] = columns;
            }
            return arr;
        }

        function heatDataDraw( ){
            for (var x = 0; x < realWidth; x+=radiusValue){
                for (var y = 0; y < realHeight; y+=radiusValue){
                    v = heat2Darray[x][y];
                    heat.add([x, y, v]); 
                }
            }
            draw();
        }

        function heatDataMapping( nodes, nodesCount ){
            var s1 = viewInterval * (viewIndex-1);
            var s2 = viewInterval * viewIndex;
            var temp;
            var temperatureInter = maxDataValue / (temperatureMax-temperatureMin);
            var m = new Map();

            var viewInterval1, viewInterval2;
            
            for (var i = 0; i < nodesCount; ++i){

                switch(viewDirection){
                    case 1:
                        viewInterval1 = nodes[i].Z;
                        viewInterval2 = nodes[i].Z+nodes[i].L;
                    break;
                    case 2:
                        viewInterval1 = nodes[i].Y;
                        viewInterval2 = nodes[i].Y+nodes[i].H;
                    break;
                    case 3:
                        viewInterval1 = nodes[i].Y;
                        viewInterval2 = nodes[i].Y+nodes[i].H;
                    break;
                }

                if(s1 >= viewInterval1 && viewInterval2 >= s2){
                    m.clear();
                    var x1 = parseInt( nodes[i].X / radiusValue );
                    var x2 = parseInt( (nodes[i].X+nodes[i].W) / radiusValue );
                    var y1 = parseInt( nodes[i].Y / radiusValue );
                    var y2 = parseInt( (nodes[i].Y+nodes[i].H) / radiusValue );
                    var z1 = parseInt( nodes[i].Z / radiusValue );
                    var z2 = parseInt( (nodes[i].Z+nodes[i].L) / radiusValue );
                    var tt = 0;
                    /* Z */
                    if(viewDirection == 1 && nodes[i].TD==1){
                        temp =  (nodes[i].TO - nodes[i].TI)/(x2-x1)
                        var c = 0;
                        for (var x = x1; x <= x2 ; ++x){
                            m.set(x, nodes[i].TI + (temp*c));
                            c++;
                        }                       
                        for (var x = x1; x <= x2 ; ++x){
                            temp =  (m.get(x)-temperatureMin)*temperatureInter + 1;
                            var xt = x * radiusValue;                            
                            for (var y = y1; y <= y2 ; ++y){
                                var yt = y * radiusValue;
                                heat2Darray[xt][yt] = temp;
                            }             
                        }
                    }
                    if(viewDirection == 1 && nodes[i].TD==2){
                        temp =  (nodes[i].TO - nodes[i].TI)/(y2-y1)
                        var c = 0;
                        for (var y = y1; y <= y2 ; ++y){
                            m.set(y, nodes[i].TI + (temp*c));
                            c++;
                        }                       
                        for (var y = y1; y <= y2 ; ++y){
                            temp =  (m.get(y)-temperatureMin)*temperatureInter + 1;
                            var yt = y * radiusValue;                            
                            for (var x = x1; x <= x2 ; ++x){
                                var xt = x * radiusValue;
                                heat2Darray[xt][yt] = temp;
                            }             
                        }
                    }
                    /* Y */
                    if(viewDirection == 2 && nodes[i].TD==1){
                        temp =  (nodes[i].TO - nodes[i].TI)/(x2-x1)
                        var c = 0;
                        for (var x = x1; x <= x2 ; ++x){
                            m.set(x, nodes[i].TI + (temp*c));
                            c++;
                        }
                        for (var x = x1; x <= x2 ; ++x){
                            temp =  (m.get(x)-temperatureMin)*temperatureInter + 1;
                            var xt = x * radiusValue;                            
                            for (var z = z1; z <= z2 ; ++z){
                                var zt = z * radiusValue;
                                heat2Darray[xt][zt] = temp;
                            }             
                        }
                    }
                    if(viewDirection == 2 && nodes[i].TD==2){                        
                        temp =  (nodes[i].TO - nodes[i].TI)/(y2-y1)
                        var c = 0;
                        for (var y = y1; y <= y2 ; ++y){
                            m.set(y, nodes[i].TI + (temp*c));
                            c++;
                            if(y*radiusValue >= s1 && tt==0){
                                tt = y;
                            }
                        }
                        if(tt>0){    
                            temp =  (m.get(tt)-temperatureMin)*temperatureInter + 1;
                            for (var z = z1; z <= z2 ; ++z){
                                var zt = z * radiusValue;                            
                                for (var x = x1; x <= x2 ; ++x){
                                    var xt = x * radiusValue;
                                    heat2Darray[xt][zt] = temp;                  
                                }
                            }     
                        }        
                    }
                    /* X */
                    if(viewDirection == 3 && nodes[i].TD==1){
                        temp =  (nodes[i].TO - nodes[i].TI)/(x2-x1)
                        var c = 0;
                        for (var x = x1; x <= x2 ; ++x){
                            m.set(x, nodes[i].TI + (temp*c));
                            c++;
                            if(x*radiusValue >= s1 && tt==0){
                                tt = x;
                            }
                        }
                        if(tt>0){ 
                            temp =  (m.get(tt)-temperatureMin)*temperatureInter + 1;
                            for (var z = z1; z <= z2 ; ++z){
                                var zt = z * radiusValue;                                  
                                for (var y = y1; y <= y2 ; ++y){
                                    var yt = y * radiusValue;
                                    heat2Darray[zt][yt] = temp;
                                }   
                            }          
                        }
                    }
                    if(viewDirection == 3 && nodes[i].TD==2){
                        temp =  (nodes[i].TO - nodes[i].TI)/(y2-y1)
                        var c = 0;
                        for (var y = y1; y <= y2 ; ++y){
                            m.set(y, nodes[i].TI + (temp*c));
                            c++;
                        }
                        for (var y = y1; y <= y2 ; ++y){
                            temp =  (m.get(y)-temperatureMin)*temperatureInter + 1; 
                            var yt = y * radiusValue;                            
                            for (var z = z1; z <= z2 ; ++z){
                                var zt = z * radiusValue;
                                heat2Darray[zt][yt] = temp;
                            }             
                        }
                    }

                }    //  if(s1 >= viewInterval1 && viewInterval2 >= s2)        
            
            } // for (var i = 0; i < nodesCount; ++i)
        }

        function heatDataAdd( data ){
            var jsonObj = JSON.parse(data); 
            var nodesCount = Object.keys(jsonObj.nodes).length;
            //if(jsonObj.nodes[0].X == undefined ||){
              //   return;
            //}
            heatDataMapping( jsonObj.nodes, nodesCount );  
        }

        if(canvas){
            
            canvas.addEventListener('mousemove', function(event) {
                var x = event.offsetX || event.clientX;
                var y = event.offsetY || event.clientY; 
            }, false);
            
            function doMouseDown(event) {  
                var x = event.offsetX || event.clientX;
                var y = event.offsetY || event.clientY;
               
                heat.add([x, y, 20]);
 
                frame = frame || window.requestAnimationFrame(draw);
            }
            
            canvas.addEventListener("mousedown", doMouseDown, false);  

        }

       //Listen to proxy responses
        window.addEventListener(
            "message", 
            onReceiveResponse,
            false
        );

        function onReceiveResponse(event) {
            var data = event.data;
        }

        function sendRequestToProxy(){
                var urlToGet = "http://localhost:9001"; //can be any HTTP request in the 3001 origin
                var proxyParameters = {
                    url : urlToGet
                };
                var originOfProxy = 'http://localhost:9001';   
                 document.getElementById("proxy").contentWindow.postMessage(proxyParameters, originOfProxy);  
        }
 
        this.receivData = function() { 
            $.post( "http://127.0.0.1:8080/T",
                    {name:"ravi",age:"31"},
                    function(data, textStatus, jqXHR){ 
                        //data: Received from server
                    });
        }

        this.getContext = function()  { 
             return canvas;
        }
        
        this.dataAdd = function( data ) {
            heatDataAdd( data );
        }

        this.dataDraw = function() {
            heatDataDraw( );
        }

        this.setViewInterval = function(interval) {
           setViewInterval(interval);
        }

        this.setViewIndex = function(index) {
           setViewIndex(index);
        }        

    } // create(width, height) 
 
    return {
        create:function(width, height, depth, viewdirect  ) {
            var c = new create(width, height, depth, viewdirect  );     
            return c;
        }
    }

}()); // heatmap2d 

var heatmap3d = (function() {
    
    var gJsonData;

    function create() {
    
        this.createCanvasMesh=function(canvas, width, height, length, viewDirection, intervalPos, transparentFlag ) {

            var texture = new THREE.Texture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;

            var material = new THREE.MeshBasicMaterial({ map: texture , transparent: transparentFlag  });
           //   geometry = new THREE.BoxGeometry( 200, 200, 200 ); transparent: true, overdraw: 0.5
            var geometry = new THREE.PlaneBufferGeometry(canvas.width, canvas.height);
           //    var geometry = new THREE.PlaneGeometry(width, height);
            var mesh = new THREE.Mesh( geometry, material );
            mesh.dynamic = true
            material.map.needsUpdate = true;
            mesh.name = "canvasMesh";
    
            if(viewDirection==1){
                mesh.position.z = intervalPos;  
            }
            if(viewDirection==2){
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.z += (length/2);         
                mesh.position.y += (height/2);
                mesh.position.y -= intervalPos;  
            }
            if(viewDirection==3){
                mesh.rotation.y =  -Math.PI / 2; 
                mesh.position.z += (length/2);
                mesh.position.x -= (width/2);
                mesh.position.x += intervalPos;  
            }

            return mesh;
        }
        
        this.createHeatmap2dCanvases=function(width, height, length, viewDirection, interval, index ) {
            
            var j_heatmap2d;

            if(gJsonData){
                j_heatmap2d = new heatmap2d.create( width, height , length, viewDirection );            
                j_heatmap2d.setViewInterval( interval );
                j_heatmap2d.setViewIndex( index );  
                j_heatmap2d.dataAdd(gJsonData);
                j_heatmap2d.dataDraw();
            }

            return j_heatmap2d.getContext();
        }
        
        this.setData=function( data ){
            gJsonData = data;
        } 


    }
    
    return {
        create:function() {
            var c = new create();     
            return c;
        }       
    }

}()); // heatmap3d 

