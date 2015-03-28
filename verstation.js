var datamass= null,
customDataMass = null;
var globalCurrentDirection = 'left',
	globaCurrentPoint,
	nextPoint = {},
	resultStack = new Array(),
	firstPoint = {};
$(document).ready(function(){
	// создаем или находим изображение
	var img = $('.markup'),
	width = $('.markup').width(),
	height = $('.markup').height();
	var markup = document.getElementById("markup");
	$('.button-generate').click( function() {
		// создаем или находим canvas
		var canvas = document.getElementById('canvas');
		// получаем его 2D контекст
		var context = canvas.getContext('2d');
		// помещаем изображение в контекст
		context.drawImage(markup, 0, 0);
		// получаем объект, описывающий внутреннее состояние области контекста
		var imageData = context.getImageData(0, 0, width, height);
		var pixels = imageData.data;
		datamass = pixels;
		analizePixels(pixels);
/*		// фильтруем
		imageDataFiltered = sepia(imageData);
		// кладем результат фильтрации обратно в canvas
		context.putImageData(imageDataFiltered, 0, 0);*/
	});
});

var analizePixels = function(canvasPixels){
	var i = 0,
	j = 0,
	indexRow = 0,
	indexCol = 0,
	originalWidth = 0,
	customWidth = 0,
	width = $('.markup').width(),
	height = $('.markup').height();
	/*width = 0, height = 0;*/
	pixMas = new Array(height);

		for (var k = 0; k < pixMas.length; k++){ // create array
			pixMas[k] = new Array (width);
		}

		originalWidth = width*4;

		for (i=3; i < width*height*4; i+=4){

			indexRow = parseInt(i/originalWidth);
			indexCol = parseInt((i%originalWidth)/4);
			/*if (canvasPixels[i]<200){
				pixMas[indexRow][indexCol] = 0;
			} else {*/
				var colorSumm = changeToHSL(canvasPixels[i-3], canvasPixels[i-2], canvasPixels[i-1]);
				if (colorSumm < 300 && canvasPixels[i]!=0){
					pixMas[indexRow][indexCol] = 1
					/*console.log(colorSumm);
					console.log("index = " + indexRow+ " "+ indexCol )
					console.log("params = " + canvasPixels[i-3] +" "+ canvasPixels[i-2]+" "+canvasPixels[i-1]+" "+canvasPixels[i])
				*/}else{
					pixMas[indexRow][indexCol] = 0
				}

			/*}*/

		/*if (ins%4 == 0){
			if (canvasPixels[i]<200){
				canvasPixels[i] = 0; // empty element. it's not need in checking
				var selectPixel = changeToHSL(canvasPixels[i-3], canvasPixels[i-2], canvasPixels[i-1]);
			}
		}*/

		}
	customDataMass = pixMas;
	outPut(pixMas);
	algorithmFindContur();
}

	var changeToHSL = function(r,g,b){
		var color = tinycolor({r:r, g:g, b:b});
		/*colorHsl = color.toHsl().l;*/
		/*colorHsl = color.isDark();*/
		colorHsl = r+b+g;
		return colorHsl
	};

	var outPut = function(mass){
		var htmlTemplate = "";
		for (var i=0; i< mass.length; i++){
			htmlTemplate+=""
			for (var j = 0; j < mass[i].length; j++){
				htmlTemplate+=" "+mass[i][j];
			}
			htmlTemplate+="</br>";
		}
		$('.ouput-mass').append(htmlTemplate);
	};



	var algorithmFindContur = function(){
		var currentColor = 0,
			moving = false;
		var i = 0; 
		var j = 0;
		var currentPoint = {};
		var current = false;
		var localFirstPoint = {};
		currentPoint["i"] = 0;
		currentPoint["j"] = 0;
		for (i = 0; i < customDataMass.length; i++){
			if (!current){
				for (j = 0; j < customDataMass[i].length; j++){
					if (!current){
						if (customDataMass[i][j] != currentColor){
							current = true;
							currentPoint["i"] = i;
							currentPoint["j"] = j;
						}
					}
				}
			}
		}
		localFirstPoint["i"]  = currentPoint["i"];
		localFirstPoint["j"]  = currentPoint["j"];
		/*globaCurrentPoint = currentPoint;*/
		moving = true;
		if (current){// if we founded black point
			/*goAroundContur(globaCurrentPoint, localFirstPoint);*/
			console.log("first position: ") 
			console.log(localFirstPoint);
			currentPoint = move(currentPoint, globalCurrentDirection);
			
			while (moving){
				currentPoint = move(currentPoint, globalCurrentDirection);
					console.log("point after move")
					console.log(currentPoint);
					console.log("direction after move");
					console.log(currentPoint);
				if (customDataMass[currentPoint["i"]][currentPoint["j"]] == 1){
					resultStack.push(currentPoint);
				}
				if (currentPoint["i"] == localFirstPoint["i"] && currentPoint["j"] == localFirstPoint["j"]){
					moving = false;
				}

			}
			console.log("result array");
			console.log(resultStack);
		}

	}
var goAroundContur = function(currentPoint, localFirstPoint){
	var direction = 'right';
	var nextElement = null;
	var directionTo;
	var moving = true;
	
	
	
	console.log(resultStack)
}

var move = function(point, direction){
	if (customDataMass[point["i"]][point["j"]] == 1){
		switch(direction) {
		    case "left":
		        globalCurrentDirection = "bottom";
		        point["i"] = point["i"]-1;
		        point["j"] = point["j"];
		        break;
		    case "right":
		        globalCurrentDirection = "top";
		        point["i"] = point["i"]+1;
		        point["j"] = point["j"];
		        break; 
		    case "top":
		        globalCurrentDirection = "left";
		        point["i"] = point["i"];
		        point["j"] = point["j"]+1;
		        break;
	        case "bottom":
		        globalCurrentDirection = "right";
		        point["i"] = point["i"];
		        point["j"] = point["j"]-1;
		        break;
		}
	} else if (customDataMass[point["i"]][point["j"]] == 0) {
		switch(direction) {
		    case "left":
		        globalCurrentDirection = "top";
		        point["i"] = point["i"]+1;
		        point["j"] = point["j"];
		        break;
		    case "right":
		        globalCurrentDirection = "bottom";
		        point["i"] = point["i"]-1;
		        point["j"] = point[ "j"];
		        break; 
		    case "top":
		        globalCurrentDirection = "right";
		        point["i"] = point["i"];
		        point["j"] = point["j"]-1;
		        break;
	        case "bottom":
		        globalCurrentDirection = "left";
		        point["i"] = point["i"];
		        point["j"] = point["j"]+1;
		        break;
		}
	}
	return point;
}