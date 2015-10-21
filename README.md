
================ 
heatmap3D
================

Convert a 2D heatmap into a 3D Model observes the heatmap of objects from X,Y,Z three driections.
 
 
##  Reference

 ### Constructor 
 
 ```js
  var j_heatmap3d = new heatmap3d.create();
  ```		
  
 ### Create 2d heatmap canvas

 ```js
  j_heatmap3d.createHeatmap2dCanvases( width, height, length, viewDirection, interval, index)
  ```	

  * width: space  width (relate to X)
  * height: space  height (relate to Y)
  * length: space  length (relate to Z)
  * viewDirection: view direction from X,Y,Z
  * interval: length of space slice
  * index: which interval
  
 ### Create the mesh from 2d heatmap canvas

 ```js
   j_heatmap3d.createCanvasMesh(canvas, width, height, length, viewDirection, intervalPos, transparentFlag);
  ```	

  * intervalPos: position of space slice (interval multiply by index)
  * transparentFlag: transparent canvas true or false
  
 ### Add objects' data

  Json format 

  ```js
  j_heatmap3d.setData(data);
  ```

  ```js
  var tJsonData = '{"nodes":[{ "X":100, "Y":100, "Z":20, "W":50, "L":20, "H":50, "TI":19, "TO":40, "TD":1},{ "X":100, "Y":100, "Z":60, "W":50, "L":20, "H":50, "TI":19, "TO":40, "TD":2}]}';
  ```

  * X: position X
  * Y: position Y
  * Z: position Z
  * W: width
  * L: length
  * H: height
  * TI: temperature input
  * TO: temperature output
  * TD: temperature direction 1:X , 2:Y
  
##  Demo
	
	* Press the 'Move' button repeatedly...
	* Press mouse left button on canvas to control the camera...
	

	
	


 