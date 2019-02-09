var currentContent = 'contentHome';
var contents = [
  'contentHome',
  'contentEvents',
  'contentAbout',
  'contentContactUs',
]
var invertedDirections = {
  'up': 'down',
  'down': 'up',
  'left': 'right',
  'right': 'left',
}
function padZeros(val, length) {
  val = val.toString()
  if (val.length < length) {
    diff = length-val.length
    for (i=0; i<diff; i++) {
      val = '0' + val;
    }
  }
  return val;
}
function getDateDiff(initialDate, finalDate) {
  oneHour = 1000*60*60
  oneMinute = 1000*60;
  oneSecond = 1000;
  diff = finalDate - initialDate;
  hours = Math.floor(diff/oneHour);
  minutes = Math.floor((diff%oneHour)/oneMinute);
  seconds = Math.floor(((diff%oneHour)%oneMinute)/oneSecond);
  return { 'hours': padZeros(hours, 2), 'minutes': padZeros(minutes, 2), 'seconds': padZeros(seconds, 2), };
}
function updateCounter() {
  eventStartDate = new Date('2019-02-01T10:00:00.000Z')
  setInterval(function () {
    diff = getDateDiff(new Date(), eventStartDate);
    $('#countdown').text(`${diff['hours']}:${diff['minutes']}:${diff['seconds']}`);
  }, 1000);
}
function pushToRight(elementID, callback=null) {
  return({
    targets: '#'+elementID,
    opacity: [1, 0],
    translateX: $('#'+elementID).width(),
    easing: 'easeInSine',
    duration: 200,
    complete: callback,
  });
}
function pushToLeft(elementID, callback=null) {
  return({
    targets: '#'+elementID,
    opacity: [1, 0],
    translateX: -$('#'+elementID).width(),
    easing: 'easeInSine',
    duration: 200,
    complete: callback,
  });
}
function pullFromLeft(elementID, callback=null) {
  return({
    targets: '#' + elementID,
    opacity: [0, 1],
    translateX: [-$('#'+elementID).width(), 0],
    easing: 'easeInOutSine',
    duration: 200,
    complete: callback,
  });
}
function pullFromRight(elementID, callback=null) {
  return({
    targets: '#' + elementID,
    opacity: [0, 1],
    translateX: [$('#'+elementID).width(), 0],
    easing: 'easeInOutSine',
    duration: 200,
    complete: callback,
  });
}
function changeContent(elementID) {
  if (currentContent != elementID) {
    $('.menu-item').css('color', '#8D57D8');
    $('#menu_' + elementID).css('color', '#ffffff');
    slideTimeline = anime.timeline();

    firstAnimationCallback = function () {
      $('#' + currentContent).css('display', 'none');
      $('#' + elementID).css('display', 'flex');
      currentContent = elementID;
    }
    if (contents.indexOf(elementID) > contents.indexOf(currentContent)) {
      firstAnimation = pushToLeft(currentContent, firstAnimationCallback);
      secondAnimation = pullFromRight(elementID)
    } else {
      firstAnimation = pushToRight(currentContent, firstAnimationCallback);
      secondAnimation = pullFromLeft(elementID)
    }

    slideTimeline
      .add(firstAnimation)
      .add(secondAnimation)
  }
}
function directContent(direction) {
  if (direction == 'left') {
    if (contents.indexOf(currentContent)>0) {
      changeContent(contents[contents.indexOf(currentContent)-1])
    }
  } else if (direction == 'right') {
    if (contents.indexOf(currentContent)<contents.length-1) {
      changeContent(contents[contents.indexOf(currentContent)+1])
    }
  }
}
function documentKeypress(e) {
  if ($(e.target).is('input, textarea')) {
    return;
  } else {
    if (e.which == 37) {
      //Left
      directContent("left");
    } else if (e.which == 39) {
      //Right
      directContent("right");
    }
  }
}
function detectswipe(ele,func) {
  swipe_det = new Object();
  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  var min_x = 80;  //min x swipe for horizontal swipe
  var max_x = 100;  //max x difference for vertical swipe
  var min_y = 50;  //min y swipe for vertical swipe
  var max_y = 60;  //max y difference for horizontal swipe
  var direc = ""
  ele.addEventListener('touchstart',function(e){
    var t = e.touches[0];
    swipe_det.sX = t.screenX; 
    swipe_det.sY = t.screenY;
  },false);
  ele.addEventListener('touchmove',function(e){
    e.preventDefault();
    var t = e.touches[0];
    swipe_det.eX = t.screenX; 
    swipe_det.eY = t.screenY;    
  },false);
  ele.addEventListener('touchend',function(e){
    //horizontal detection
    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
      if(swipe_det.eX > swipe_det.sX) direc = "right";
      else direc = "left";
    }
    //vertical detection
    else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
      if(swipe_det.eY > swipe_det.sY) direc = "down";
      else direc = "up";
    }

    if (direc != "") {
      if(typeof func == 'function') func(invertedDirections[direc]);
    }
    direc = "";
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  },false);  
}
function openingAnimation() {
  var logoTimeline = anime.timeline();
  var logoDrawing = {
    targets: 'svg path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 2000,
    delay: function (el, i, l) {
      return (l-i*10)
    },
    loop: false
  };
  var logoFilling = {
    targets: 'path',
    fill: function (el, i, l) {
      retval = ''
      switch(i) {
        case 0:
          retval = '#264da3'
          break;
        case 1:
          retval = '#4db6c8'
          break;
        case 2:
          retval = '#f4bf2a'
          break;
        case 3:
          retval = '#5ca82a'
          break;
        case 12:
        case 15:
          retval = '#171717'
          break;
        default:
          retval = '#264da3'
          break;
      }
      return retval;
    },
    easing: 'easeOutSine',
    offset: '-=3000',
  };
  var countDownShow = {
    targets: '#divCountdown',
    opacity: [0, 1],
    easing: 'easeOutSine',
    offset: '-=3000',
  };
  $('#logoContainer').css('opacity', 1);
  logoTimeline
    .add(logoDrawing)
    .add(logoFilling)
    .add(countDownShow);
  var menuTimeline = anime.timeline();
  menuTimeline
    .add({
      targets: '.menu-item',
      translateY: -250,
      duration: 0,
    })
    .add({
      targets: '.menu-item',
      translateY: 0,
      opacity: 1,
      easing: 'easeOutExpo',
      delay: function(el, i, l) {
        return i * 500;
      }
    });
}
function init() {
  detectswipe(document, directContent);
  $(document).keydown(documentKeypress);
  $('#menu_' + currentContent).css('color', '#ffffff');
  updateCounter();
  openingAnimation();
}
window.onload = init;

var dark = true ;

function changeColor() {
  if( dark ){
    $('.bodyclass').css('background','#ffffff');
    $('#themeselect').text("Dark Theme");
    dark = false;
  }
  else{
    $('.bodyclass').css('background','#171717');
    $('#themeselect').text("Light Theme");
    dark = true;
  }

}