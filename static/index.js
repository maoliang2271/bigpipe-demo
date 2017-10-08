 var timeStart = Date.now();
 window.addEventListener('DOMContentLoaded', function () {
     console.log(new Date() - timeStart);
 });
 document.addEventListener('click', function (e) {
     if (e.target.id === 'btn') alert('hi')
 });