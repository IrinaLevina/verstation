var datamass= null,
customDataMass = null;
$(document).ready(function(){
	// создаем или находим изображение
	var img = $('.markup'),
	width = $('.markup').width(),
	height = $('.markup').height();
	var markup = document.getElementById("markup");
	img.load( function() {
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
					console.log(colorSumm);
					console.log("index = " + indexRow+ " "+ indexCol )
					console.log("params = " + canvasPixels[i-3] +" "+ canvasPixels[i-2]+" "+canvasPixels[i-1]+" "+canvasPixels[i])
				}else{
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
		
	}