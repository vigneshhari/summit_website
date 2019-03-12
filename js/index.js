var lightcolor = "#262216";
var darkcolor = "#f6f1ed";
var currentcolor = darkcolor;


var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
var currentContent = 'contentHome';
var contents = [
  'contentHome',
  'contentEvents',
  'contentCultural',
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
  eventStartDate = new Date('2019-03-29T10:00:00.000Z')
  setInterval(function () {
    diff = getDateDiff(new Date(), eventStartDate);
    days = Math.floor(diff['hours'] / 24) ;
    hours = diff['hours'] - (days * 24)
    $('#countdown').text(`${days} Days ${hours} Hours ${diff['minutes']} Minutes ${diff['seconds']} Seconds`);
    //$('#countdown').text(`19 Days 0 Hours 0 Minutes 0 Seconds`);
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
    $('.menu-item').css('color', currentcolor);
    $('#menu_' + elementID).css('color', '#FBC02D');
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
function refreshTag() {
  var selectedTag = $('#tagCombo').val();
  event_cards = document.querySelectorAll('.event_card');
  for (var i=0; i<event_cards.length; i++) {
    eventTag = event_cards[i].getAttribute('tags');
    if (selectedTag == "All") {
      $(event_cards[i])
        .removeClass('none')
        .outerWidth();
      $(event_cards[i])
        .removeClass('fade-out');
    } else if (eventTag) {
      if (eventTag.indexOf(selectedTag) == -1) {
        $(event_cards[i])
          .addClass('fade-out')
          .one(transitionEnd, function () {
            if ($(this).hasClass('fade-out')) {
              $(this).addClass('none');
            }
          })
      } else {
        $(event_cards[i])
          .removeClass('none')
          .outerWidth();
        $(event_cards[i])
          .removeClass('fade-out');
      }
    }
  }
}
function init() {
  detectswipe(document, directContent);
  $(document).keydown(documentKeypress);
  $('#menu_' + currentContent).css('color', '#FBC02D');
  updateCounter();
  openingAnimation();
  $('#tagCombo').change(refreshTag);
  refreshTag();
}
window.onload = init;

var dark = true ;

function changeColor() {

  if( dark ){
    $('.bodyclass').css('background',"#feffff");
    $('#path1009').attr("fill" , "rgba(255,255,255,1)")
    $('#path1012').attr("fill" , "rgba(255,255,255,1)")
    $('#themeselect').text("Dark Theme");
    $(".bodyclass").css("color" , lightcolor);
    $(".section").css("box-shadow" , lightcolor + " 0px 0px 4px 2px");
    $('.menu-item').css('color', lightcolor);
    currentcolor = lightcolor;
    $('#menu_contentChangeColor').css('color', "#FBC02D");

    menu_contentChangeColor
    dark = false;
  }
  else{
    $('.bodyclass').css('background','#171717');
    $('#path1009').attr("fill" , "rgba(23,23,23,1)")
    $('#path1012').attr("fill" , "rgba(23,23,23,1)")
    $('#themeselect').text("Light Theme");
    $(".bodyclass").css("color" , darkcolor);
    $(".section").css("box-shadow" , darkcolor + " 0px 0px 4px 2px");
    $('.menu-item').css('color', darkcolor);
    $('#menu_contentChangeColor').css('color', darkcolor);
    dark = true;
    currentcolor = darkcolor ;
  }
}