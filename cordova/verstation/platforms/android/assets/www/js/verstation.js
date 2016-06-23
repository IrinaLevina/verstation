var datamass= null,
customDataMass = null;
var globalCurrentDirection = 'left',
	globaCurrentPoint,
	nextPoint = {},
	resultStack = new Array(),
	firstPoint = {},
	resultFromPhoto1 = [];
	globalWidth = null,
	globalHeight = null;
$(document).ready(function(){
	//get beauty
	$('.nav-btn.do-beauty').on('click', function(){
		$('.get-beauty._flower').toggle();
		$('.get-beauty._fly').toggleClass('_show');
	});

	// создаем или находим изображение
	var img = $('.markup'),
	globalWidth = $('.markup').width(),
	globalHeight = $('.markup').height();
	var markup = $("#markup");


	$('.welcome__t').on("click", function(){
		$('.pss-block').removeClass("hidden")
	});



	/*$('.button-generate input[type="file"]').change(function(event) {*/

	$('.button-load input[type="file"]').change(function(event) {
		// создаем или находим canvas
		var canvas = document.getElementById('canvas');
		// получаем его 2D контекст
		var context = canvas.getContext('2d');
		var img = new Image;
		img.src = URL.createObjectURL(event.target.files[0]);
		img.setAttribute('crossOrigin', '');
		img.onload = function() {
			canvas.onload = function() {
				console.log('ok')
			}
			document.body.appendChild(canvas);
			// помещаем изображение в контекст
			context.drawImage(img, 0, 0);
			// получаем объект, описывающий внутреннее состояние области контекста
			var imageData = context.getImageData(0, 0, globalWidth, globalHeight);
			var pixels = imageData.data;
			datamass = pixels;
			analizePixels(pixels);
			/*		// фильтруем
			 imageDataFiltered = sepia(imageData);
			 // кладем результат фильтрации обратно в canvas
			 context.putImageData(imageDataFiltered, 0, 0);*/
		}
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
	globalHeight = height;
	globalWidth = width;
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
	outPut();
	$('.nav-btn').removeClass("hidden");
	algorithmFindContur();
}

	var changeToHSL = function(r,g,b){
		var color = tinycolor({r:r, g:g, b:b});
		/*colorHsl = color.toHsl().l;*/
		/*colorHsl = color.isDark();*/
		colorHsl = r+b+g;
		return colorHsl
	};

	var outPut = function(){
		var htmlTemplate = "";
		for (var i=0; i< customDataMass.length; i++){
			htmlTemplate+=""
			for (var j = 0; j < customDataMass[i].length; j++){
				htmlTemplate+=" "+customDataMass[i][j];
			}
			htmlTemplate+="</br>";
		}
		$('.ouput-mass').html(htmlTemplate);
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
			/*console.log("first position: ") 
			console.log(localFirstPoint);*/
			currentPoint = move(currentPoint, globalCurrentDirection);
			
			while (moving){ 
				currentPoint = move(currentPoint, globalCurrentDirection);
					/*console.log("point after move")
					console.log(currentPoint);
					console.log("direction after move");
					console.log(globalCurrentDirection);*/
				if (customDataMass[currentPoint["i"]][currentPoint["j"]] == 1){
					var newPoint = {};
					newPoint["i"] = currentPoint["i"],
					newPoint["j"] = currentPoint["j"]

					resultStack.push(newPoint);

				}
				if (currentPoint["i"] == localFirstPoint["i"] && currentPoint["j"] == localFirstPoint["j"]){
					moving = false;
				}

			}
			/*console.log("result array");
			console.log(resultStack);*/
			setToZero();
			algorithmFindContur();
		} else {
			console.log("i finish");
			
			var data = getDataFromImgs(),
            outputCont = $('.result');
			if (dragElems) {
				dragElems.unset();
				dragElems = null;
			}
			$('.result__markup').html('')
	        for(var i = 0, len = data.length; i < len; i += 1) {
	            $('.result__markup').append(render(data[i]));
	        }

	        outputCont.addClass('result_show');
	        startEdit();
		}
	}

var setToZero = function(){
	var htmlTemplate ="";
	var htmlTemplate2="";
	var minRow = resultStack[0]["i"];
	var maxRow = resultStack[0]["i"];
	var minCol = resultStack[0]["j"];
	var maxCol = resultStack[0]["j"];
	for (var k = 0; k < resultStack.length; k++){
		/*console.log("i = "+ k);*/
		row = resultStack[k]["i"];
		col = resultStack[k]["j"];
		if (minRow > row){
			minRow = row;
		}
		if (maxRow < row){
			maxRow = row;
		}
		if (minCol > col){
			minCol = col;
		}
		if (maxCol < col){
			maxCol = col;
		}
		customDataMass[row][col] = 0;
	}
	var index = resultFromPhoto1.length;
	resultFromPhoto1[index]= {};
	resultFromPhoto1[index];
	resultFromPhoto1[index]['pos'] = {};
	resultFromPhoto1[index]['pos']["br"] = {};
	resultFromPhoto1[index]['pos']["br"]["x"] = maxCol;
	resultFromPhoto1[index]['pos']["br"]["y"] = maxRow;

	resultFromPhoto1[index]['pos']["bl"] = {};
	resultFromPhoto1[index]['pos']["bl"]["x"] = minCol;
	resultFromPhoto1[index]['pos']["bl"]["y"] = maxRow;

	resultFromPhoto1[index]['pos']["tl"] = {};
	resultFromPhoto1[index]['pos']["tl"]["x"] = minCol;
	resultFromPhoto1[index]['pos']["tl"]["y"] = minRow;

	resultFromPhoto1[index]['pos']["tr"] = {};
	resultFromPhoto1[index]['pos']["tr"]["x"] = maxCol;
	resultFromPhoto1[index]['pos']["tr"]["y"] = minRow;
	var count = 0;
	for (var i=minRow; i< maxRow; i++){
		for (var j = minCol; j < maxCol; j++){
			if (customDataMass[i][j] == 1){
				count++;
			}
			customDataMass[i][j] = 0;
		}
	}
	resultFromPhoto1[index]['pos']["type"] = "div";
	var sqare = (maxCol-minCol)*(maxRow-minRow);
	var perimetr = ((maxCol-minCol)+(maxRow-minRow))*2;
	if (count >= (sqare/3)*2 && count !=0 && sqare != 0){
/*		console.log("button")
		console.log("count = "+count);
		console.log("sqare = "+sqare);*/
		resultFromPhoto1[index]['pos']["type"] = "button";
	}

	if (count >= (sqare/2) && count < (sqare/3)*2 && count !=0 && sqare != 0){
/*		console.log("list")
		console.log("count = "+count);
		console.log("sqare = "+sqare);*/
		resultFromPhoto1[index]['pos']["type"] = "header";
	}

	/*console.log("count = "+ count);
	console.log("perimetr = "+ perimetr);
	if (count < perimetr && count !=0 && perimetr != 0){
		console.log("circle");
	}*/

	resultStack = [];
	/*outPut();*/
	/*$('.ouput-mass').html(htmlTemplate);
	$('.ouput-mass').append(htmlTemplate2);*/
	/*var col = 0;
	var row = 0;
	for (var i = 0; i < resultStack.length; i++){
		row = resultStack[i]["i"];
		col = resultStack[i]["j"];
		customDataMass[row][col] = 0;
	}
	outPut(customDataMass);*/
}

var goAroundContur = function(currentPoint, localFirstPoint){
	var direction = 'right';
	var nextElement = null;
	var directionTo;
	var moving = true;
	/*console.log(resultStack);*/
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

