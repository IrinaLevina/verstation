var start_button = document.getElementById('start_button'),
    recognizing = false, // флаг идет ли распознование
    final_transcript = '';
var editable_elements = document.querySelectorAll("[contenteditable=false]");
start_button.style.display = "none";
function edit() {
    editable_elements[0].setAttribute("contentEditable", true);
    start_button.style.display = "block";
};
// проверяем поддержку speach api
if (!('webkitSpeechRecognition' in window)) {

    start_button.style.display = "none";

} else { /* инициализируем api */

    /* создаем объект 	*/
    var recognition = new webkitSpeechRecognition();

    /* базовые настройки объекта */

    recognition.lang = 'ru'; // язык, который будет распозноваться. Значение - lang code
    recognition.continuous = true; // не хотим чтобы когда пользователь прикратил говорить, распознование закончилось
    recognition.interimResults = true;  // хотим видеть промежуточные результаты. Т.е. мы можем некоторое время видеть слова, которые еще не были откорректированы

    /* метод вызывается когда начинается распознование */
    recognition.onstart = function () {

        recognizing = true;
        start_button.style.background = 'url(../img/mic-animate.gif)'; // меняем вид кнопки
    };
    /* обработчик ошибок */
    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            start_button.style.background = 'url(../img/mic.gif)';
        }
        if (event.error == 'audio-capture') {
            start_button.style.background = 'url(../img/mic.gif)';
        }
    };

    /* метод вызывается когда распознование закончено */
    recognition.onend = function () {
        recognizing = false;
        start_button.style.background = 'url(../img/mic.gif)';
    };

    /*
     метод вызывается после каждой сказанной фразы. Параметра event используем атрибуты:
     - resultIndex - нижний индекс в результирующем массиве
     - results - массив всех результатов в текущей сессии
     */
    recognition.onresult = function (event) {

        var interim_transcript = '';

        /*
         обход результирующего массива
         */
        for (var i = event.resultIndex; i < event.results.length; ++i) {

            /* если фраза финальная (уже откорректированная) сохраняем в конечный результат */
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else { /* иначе сохраянем в промежуточный */
                interim_transcript += event.results[i][0].transcript;
            }
        }

        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
    };
}

/* обработчик клика по микрофону */
function startButton(event) {
    if (recognizing) { // если запись уже идет, тогда останавливаем
        recognition.stop();
        return;
    }

    recognition.start();

}
