(function () {

    /*
    This script is written to produce 
    a Canadian flag based on the coordinates given at 
    https://en.wikipedia.org/wiki/Flag_of_Canada#/media/File:Flag_of_Canada_(construction_sheet_-_leaf_geometry).svg
    using Vanilla Javascript and Canvas
    with a resizing function to contract or expand the flag.
    */
    'use strict';
  
    const canvas = document.getElementById('theCanvas');
    const context = canvas.getContext('2d');

    const NUM_TO_RESIZE =1;
  
    function resize(number){
      return number * NUM_TO_RESIZE;
    }

    context.strokeStyle = 'red';
    context.fillStyle = 'red';
    context.fillRect(0, 0, resize(480), resize(960));
    context.fillRect(resize(1440), 0, resize(480), resize(960));
  
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(resize(960-18), resize(960-74));
    context.lineTo(resize(960+18), resize(960-74));
    context.lineTo(resize(960+8.955), resize(480+233.418));
    //spot for arc L
    context.lineTo(resize(960+31.229), resize(480+213.418));
    context.lineTo(resize(960+203),resize(480+244));
    context.lineTo(resize(960+179.705),resize(480+179.999));
    //spot for arc K
    context.lineTo(resize(960+183.740),resize(480+165.45));
    context.lineTo(resize(960+372),resize(480+13));
    context.lineTo(resize(960+329.678),resize(480-6.735));
    //spot for arc J
    context.lineTo(resize(960+322.808),resize(480-22.534));
    context.lineTo(resize(960+360),resize(480-137));
    context.lineTo(resize(960+251.637),resize(480-113.967));
    //spot for arc I
    context.lineTo(resize(960+236.968),resize(480-121.603));
    context.lineTo(resize(960+216),resize(480-171));
    context.lineTo(resize(960+131.369),resize(480-80.245));
    //spot for arc H
    context.lineTo(resize(960+109.101),resize(480-91.591));
    context.lineTo(resize(960+150),resize(480-302));
    context.lineTo(resize(960+84.543),resize(480-264.208));
    //spot for arc G
    context.lineTo(resize(960+66.460),resize(480-269.565));
    context.lineTo(resize(960),resize(480-400));//middle
    context.lineTo(resize(960-66.460),resize(480-269.565));
    //spot for arc F
    context.lineTo(resize(960-84.543),resize(480-264.208));
    context.lineTo(resize(960-150),resize(480-302));
    context.lineTo(resize(960-109.101),resize(480-91.591));
    //spot for arc E
    context.lineTo(resize(960-131.369),resize(480-80.245));
    context.lineTo(resize(960-216),resize(480-171));
    context.lineTo(resize(960-236.968),resize(480-121.603));
    //spot for arc D
    context.lineTo(resize(960-251.637),resize(480-113.967));
    context.lineTo(resize(960-360),resize(480-137));
    context.lineTo(resize(960-322.808),resize(480-22.534));
    //spot for arc C
    context.lineTo(resize(960-329.678),resize(480-6.735));
    context.lineTo(resize(960-372),resize(480+13));
    context.lineTo(resize(960-183.740),resize(480+165.45));
    //spot for arc B
    context.lineTo(resize(960-179.705),resize(480+179.999));
    context.lineTo(resize(960-203),resize(480+244));
    context.lineTo(resize(960-31.229), resize(480+213.418));
    //spot for arc A
    context.lineTo(resize(960-8.955), resize(480+233.418));
    context.lineTo(resize(960-18), resize(960-74));
    context.fill();
  
    //Filling the curves of the arcs with white
    context.fillStyle = 'white';
    context.beginPath();
    context.arc((960+27.929)/2, (480+232.423)/2, 19/2, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc((960+191.921)/2, (480+175.553)/2, 13/2, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc((960+349.172)/2, (480-18.517)/2, 10, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc((960+248.934)/2, (480-126.683)/2, 6.5, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc((960+121.862)/2, (480-89.111)/2, 13/2, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960+78.043), resize(480-275.467), resize(13), 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-78.043), resize(480-275.467), resize(13), 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-121.862), resize(480-89.111), resize(13), 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-248.934), resize(480-126.683), resize(13), 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-349.172), resize(480-18.517), 10, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-191.921), resize(480+175.553), resize(13), 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.arc(resize(960-27.929), resize(480+232.423), resize(19), 0, Math.PI*2);
    context.fill();
  }());