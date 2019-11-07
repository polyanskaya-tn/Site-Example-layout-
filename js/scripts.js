
/* All Pages */ 
$(function() {

$('.mainMenu').touchMenuHover({
    'forceiOS': true
});

//for search form 
$('#search-button a').bind('click', function(event) {
    event.preventDefault();
    $('#search-button').hide();
    $('#search-field').fadeIn('slow');
});  

$('#search-field').bind('submit', function(event) {
    $('#search-field').hide();
    $('#search-button').css('display','flex');
    //validation - input is empty, don't send 
    if ( $(this).find('input').val().length == 0) {
      event.preventDefault();
    }
});
//end search form 

//if mobile menu button is visible then add event handler 
$('#collapse').bind('click', function(event) {
  event.preventDefault();
  $(this).parent().find('.mainMenu').slideToggle();
});  
//init state (open or hide) on change sizes
$(window).bind('resize', function() {
  if ( $('#collapse:hidden').length )
    $('.mainMenu').show();
  if ( $('#collapse:visible').length )
    $('.mainMenu').hide();
}); 


//fixed panel for header and top-message
var $window = $(window);
var $header = $('#header-panel');
var $topMessage = $('#top-message');
var $topMessageBack = $('#top-message-back');
var $headerBack = $('#header-panel-back');
var mesHeight = 0;
var headHeight = 0;
var headIsFixed = false;
var mesIsFixed = false;

// set max Y where changed fixed position
if ($topMessage.length) {
  mesHeight = $topMessage.outerHeight(true);
  mesIsFixed = $topMessage.hasClass('fixed');
  $topMessage.data('top',0);
}
if ($header.length) {
  headHeight = $header.outerHeight(true);
  headIsFixed = $header.hasClass('fixed');
  $header.data('top',0);
}

//minY, maxY - when panel do fixed or not fixed
function changeFixed($elem, $panel, minY, maxY, isFixed) {

  var wndScrollTop = $window.scrollTop();
  var prevTop = $elem.data('top');

  if (!isFixed && (wndScrollTop > minY) && (wndScrollTop > prevTop)) 
  {
    //if scroll down and scrollTop > minY 
    isFixed = true;
    $elem.addClass('fixed'); 
    $panel.show();
  }
  else if (isFixed && (wndScrollTop < maxY) && (wndScrollTop < prevTop)) 
  {
    //if scroll up and scrollTop < maxY 
    isFixed = false;
    $elem.removeClass('fixed');
    $panel.hide();
  }
  //save previous position
  $elem.data('top', wndScrollTop); 
  return isFixed;
}

$(window).bind('scroll', function() {

  var isTopExists = ($topMessage.length && ($topMessage.height() > 0));
  if (isTopExists) {
    mesIsFixed = changeFixed($topMessage, $topMessageBack, 0, mesHeight, mesIsFixed);
  }
  if ($header.length) {
    if (isTopExists) {
      if ($header.css('top') != mesHeight) {
        $header.css('top', mesHeight);
      }
      headIsFixed = changeFixed($header, $headerBack, mesHeight, mesHeight+headHeight, headIsFixed)
    }
    else {
      if ($header.css('top') != 0) 
        $header.css('top', 0);
      headIsFixed = changeFixed($header, $headerBack, 0, headHeight, headIsFixed);
    }
  }
});

$(window).bind('resize', function() {
  mesHeight = $topMessage.outerHeight(true);
  if ($header.css('top') != mesHeight) {
        $header.css('top', mesHeight);
  }
});

//close top message panel
$('#close-message').bind('click', function(event) {
  event.preventDefault();

  var $header = $('#header-panel');
  var delta = '-='+$('#top-message').height();
  var isFixed;

  if ($header.length) {
    isFixed = $header.hasClass('fixed');
  }
  //if top panel hide then header up to top window
  $(this).parent().parent().slideUp('slow', function () {
    //hide top back panel
    $('#top-message-back').hide();
    //header up to top=0 
    if (isFixed) {
      $header.animate({ 
        duration: 'slow',
        top: delta, 
      });
    }
  });

});

});

$(function() {

if ($.fancybox) {
  $.fancybox.defaults.i18n.ru = {
        CLOSE: "Закрыть",
        NEXT: "Вперед",
        PREV: "Назад",
        ERROR: "Невозможно загрузить контент. <br/> Обратитесь к администратору сайта.",
        PLAY_START: "Автопросмотр слайдов",
        PLAY_STOP: "Остановить автопросмотр",
        FULL_SCREEN: "На весь экран",
        THUMBS: "Эскизы",
        DOWNLOAD: "Загрузить",
        SHARE: "Общий доступ",
        ZOOM: "Увеличить"
  };
  $.fancybox.defaults.lang = "ru";
}
});

/* Main Page */ 
$(document).on('ready', function() {
  $(".gallery-slider").slick({

    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    /*adaptiveHeight: true, */
    /*variableWidth: true,*/
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnFocus: false,
    pauseOnHover: false,
    pauseOnDotsHover: false,
  });
});

/* Contact page */ 
$(function() {
  if (! $( "#map" ).length ) return;
 
  //show Yandex map
  ymaps.ready(init);
  var myMap, myPlacemark;
  
  function init() {     
    myMap = new ymaps.Map (
      "map", {
        center: [47.25078115, 38.88841551],
        zoom: 16,
    });
    
    myMap.controls.add("zoomControl");
    myPlacemark = new ymaps.Placemark(
      [47.25078115, 38.88841551], { 
        content: 'СтанкоТехЦентр — ремонт и продажа станков', 
        balloonContent: '<span class="mainContent"><b>СтанкоТехЦентр</b><br>347910, Россия, Таганрог, улица Котлостроительная, 37/9<br>Телефон: +7 (928) 1-888-1-8-1</span>' 
      }, 
      {
        iconImageHref: 'images/pointer.png',
        iconImageSize: [43, 59],
        iconImageOffset: [-21,-59]
    });
    myMap.geoObjects.add(myPlacemark);
  }
});

/* retail page */ 
$(function() {
//select personal data type  
$('#order input[type="radio"]').bind('click', function(event) {

    if (this.value == 'individual') {
      $('#type-jur').hide();
      $('#type-indiv').show();
    }
    if (this.value == 'juristic') {
      $('#type-indiv').hide();
      $('#type-jur').show();
    }

}); 

function calculateOrder() {

	//calculate sum as price*quantity, 
	//idInput - id row It is same for all fields of the row
	function calcSum(idRow, quantity) {
	  var price = parseInt( $('#order .price[data-row="'+idRow+'"]').html());
	  if (!price) return;

	  var sum = quantity*price;
	  //recalc total sum
	  calcTotalSum(idRow, sum);

	  $('#order .sum[data-row="'+idRow+'"]').html(sum+' ₽');
	}

	//calculate all sum - total sum
	function calcTotalSum(idRow, summa) {
	  var sum = 0;
	  var $items = $('#order .sum');
	  var len = $items.length;
	  for (var i = 0; i < len; i++) {
	    if ((idRow != '') && (summa > -1)) {
	      if ($($items[i]).data('row') == idRow ) {
	        console.log('row '+idRow+' sum '+summa);
	        sum += summa;
	        continue;
	      }
	    }
	    item_sum = parseInt( $($items[i]).html() );
	    if (!item_sum) continue;
	    sum += item_sum;
	  }
	  $('#totalSum').html(sum+' ₽');
	}

	//product quantity - plus button - inc quantity and recalc sum
	$('#order .plus').bind('click', function(event) {
	  event.preventDefault();
	  
	  var idRow = $(this).data('row');
	  var quantity = $("#"+idRow).val(); //from input value
	  if (!quantity) return;

	  quantity++;
	  if (quantity > 9999) { quantity = 9999; }
	  //recalc sum
	  calcSum(idRow, quantity);
	  //set input value
	  $('#'+idRow).val(quantity);
	});
	//product quantity - minus button
	$('#order .minus').bind('click', function(event) {
	  event.preventDefault();
	  
	  var idRow = $(this).data('row');
	  var quantity = $("#"+idRow).val(); //from input value
	  if (!quantity) return;

	  quantity--;
	  if (quantity < 1) { quantity = 1; }
	  //set input value
	  $("#"+idRow).val(quantity);
	  //recalc sum
	  calcSum(idRow, quantity);
	});
	//delete row
	$('#order .delete').bind('click', function(event) {
	  event.preventDefault();

	  $(this).parents('tr').remove();
	  calcTotalSum();
	});

	//calc sum on input field
	$('#order input[name^="amount"]').bind('input', function() {
	  
	  var quantity = $(this).val();
	  if (!$.isNumeric(quantity)) return;

	  var idRow = this.id;
	  calcSum(idRow, quantity);
	});

	//init calculate total sum
	calcTotalSum();
}

if ( $('#order').length )
	calculateOrder();	
});

//catalog page
$(document).on('ready', function() {

//button compare on calalog item popup
$('.compare').bind('click', function(event) {
    event.preventDefault();

    var constRemove = "Удалить";
    var $this = $(this);

    if ((($this.data('remove') != "") && ($this.text() == $this.data('remove'))) ||
    ($this.text() == constRemove)) {
      $this.text($this.data('add'));  
      return; 
    }

    $this.data('add', $this.text());
    if ($this.data('remove')) {
      $this.text($this.data('remove'));
    }
    else
      $this.text(constRemove); 
}); 

//mobile filter button - add event handler 
$('#filter-button').bind('click', function(event) {
  event.preventDefault();
  $('#filters').slideToggle();
}); 

//mobile filter button init state (open or hide) on change sizes
$(window).bind('resize', function() {
  if ( $('#filter-button:hidden').length ) {
    $('#filters').show();
  }
  if ( $('#filter-button:visible').length ) {
    /*$('#filters').hide();*/
  }
});  

});