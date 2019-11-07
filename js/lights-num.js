// JavaScript Document
// Косинусная Д
var k_isp_svet = [	[0.36, 0.43, 0.48, 0.54, 0.57, 0.6 , 0.64, 0.69, 0.75, 0.79, 0.83, 0.86, 0.89, 0.93, 0.96, 0.99, 0.105],
					[0.35, 0.42, 0.47, 0.51, 0.55, 0.57, 0.6 , 0.63, 0.69, 0.72, 0.75, 0.77, 0.8 , 0.83, 0.86, 0.88, 0.9],
					[0.3 , 0.35, 0.41, 0.45, 0.48, 0.52, 0.55, 0.6 , 0.67, 0.71, 0.75, 0.79, 0.82, 0.86, 0.9 , 0.93, 0.98],
					[0.3 , 0.34, 0.38, 0.43, 0.46, 0.5 , 0.52, 0.56, 0.62, 0.66, 0.69, 0.73, 0.75, 0.79, 0.82, 0.84, 0.88],
					[0.34, 0.4 , 0.45, 0.49, 0.52, 0.55, 0.58, 0.61, 0.67, 0.7 , 0.73, 0.76, 0.78, 0.81, 0.83, 0.85, 0.88],
					[0.28, 0.33, 0.38, 0.43, 0.46, 0.49, 0.51, 0.55, 0.61, 0.65, 0.68, 0.71, 0.73, 0.77, 0.8 , 0.83, 0.85],
					[0.25, 0.28, 0.33, 0.37, 0.41, 0.45, 0.47, 0.5 , 0.55, 0.6 , 0.64, 0.66, 0.69, 0.73, 0.76, 0.79, 0.81],
					[0.22, 0.27, 0.31, 0.36, 0.39, 0.42, 0.44, 0.48, 0.54, 0.57, 0.61, 0.64, 0.66, 0.71, 0.73, 0.76, 0.79]];

var room_index = 	[0.5,  0.6,  0.7,  0.8,  0.9,  1,    1.1,  1.25, 1.5,  1.75, 2,    2.25, 2.5,  3,    3.5,  4,    5];

var req = +$("#req").val();
var length = +$("#length").val();;
var width = +$("#width").val();
var height = +$("#height").val();
var zapas = +$("#zapas").val();
var room_type = +$("#room_type").val();
var room_index_calc = 0;
var room_index_num = -1;
var k_isp_svet_calc = 0.5;
var light_quantity = 0;


function getRoomIndexNum(room_index, val) {
	var min_dif = 1000;
	var num = -1;
	for(var i=0; i<room_index.length; i++) {
		if(min_dif > Math.abs(room_index[i] - val)) {
			min_dif = Math.abs(room_index[i] - val);
			num = i;
		}
	}
	return num;
}


$("#calculateLight input, #calculateLight select").on('change blur input', function() {
		req = +$("#req").val();
		length = +$("#length").val();;
		width = +$("#width").val();
		height = +$("#height").val();
		zapas = +$("#zapas").val();
		room_type = +$("#room_type").val();

		var divider = (length+width)*height;
		room_index_calc = 0;
		light_quantity = 0;
		//if (!divider) return;
		if (divider && req) {
			room_index_calc = (length*width)/((length+width)*height);
			//$("#room_index").html(room_index_calc);
		
			k_isp_svet_calc = k_isp_svet[room_type][getRoomIndexNum(room_index, room_index_calc)];
			//$("#koef_isp").html(k_isp_svet_calc);
		
			light_quantity = Math.round((req*length*width*zapas)/k_isp_svet_calc);
		}
		$('input[name="light_quantity"]').val(light_quantity);
		//$("#light_quantity").html(light_quantity + " Люмен (Лм)");
		//пересчет количества ВСЕХ светильников каталога, выбранных на странице 
		//и не выбранных - которые в popup окне
		$(".numResult").each(function(index, element) {
			var dataLight = parseInt($(this).attr("data-light"));
			if (!dataLight || !light_quantity) $(this).html("0 Шт");
			$(this).html(Math.ceil(light_quantity/dataLight) + " Шт");
		});

	});
//$(".calculateLight input").blur();








$(".light-type").click(function() {
	$('input[name="req"]').val($(this).attr("data-lightning"));
	$('input[name="req"]').change();
});


$("#addLampButton").click(function(event) {
	event.preventDefault();
	$.fancybox.open( $(".allLamps"));
});

$(document).ready(function(e) {
	if ( !$('#noActiveLamps').length ) {
		$( "#activeLamps" ).before( '<p id="noActiveLamps">Нет светильников для расчета. Выберите один или несколько, чтобы расcчитать необходимое количество.</p>');
	}
	$(".theLamp").each(function(index){
		$(this).attr("id", "num"+index);
	});



	$(".allLamps .theLamp").click( function(event){
		event.preventDefault();
		event.stopPropagation();

		if ( $(this).css("opacity")==0.25 )
			return;
		var oldId = $(this).attr("id");
		$(this).attr("id", oldId+ "Active");
		var lampHTML = $(this)[0].outerHTML;
		$(this).attr("id", oldId);
		$(this).css("opacity",0.25);
		$("#activeLamps > div").append(lampHTML);
		$.fancybox.close();

		function changeVisible() {
			if($("#activeLamps .theLamp").length > 0) {
				$("#activeLamps").show();
				$("#noActiveLamps").hide();
			} else {
				$("#activeLamps").hide();
				$("#noActiveLamps").show();
			}
		}

		$("#activeLamps .theLamp .lampClose").click(function(event){
			event.preventDefault();

			var unOpacityId = $(this).closest(".theLamp").attr("id");
			$("#"+unOpacityId.substr(0,unOpacityId.length-6)).css("opacity", 1.0);
			$(this).closest(".theLamp").remove();
			changeVisible();
		});

		changeVisible();
	});
	
	
	$("#makePDF").click(function(){
		event.preventDefault();
		$(this).hide(0.2);
		$("#sendTo").show(0.2);
		
	});

//validation

function keypressNumbers(event) {

  function getChar(event) {
	if (event.which == null) { // IE
	  if (event.keyCode < 32) return null; // спец. символ
	  return String.fromCharCode(event.keyCode)
	}

	if (event.which != 0 && event.charCode != 0) { // все кроме IE
	  if (event.which < 32) return null; // спец. символ
	  return String.fromCharCode(event.which); // остальные
	}

	return null; // спец. символ
  }

  if (event.ctrlKey || event.altKey || event.metaKey) return true;
  var chr = getChar(event);
  if (chr == null) return false;
  if (chr < '0' || chr > '9') {
	return false;
  }
  return true;
};

function toggleError(jsObj, isValid) {
	if (!jsObj) return;
	if (isValid) {
	  //hide error
	  $(jsObj).removeClass('error');    
	}
	else {
	  //show error
	  $(jsObj).addClass('error');  
	}
}

function validateEmail(jsObj) {
	if (!jsObj) return;
	if (jsObj.value == '') return false;

	var regexp = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return regexp.test(jsObj.value);
}

function validValue(obj) {
	if (!obj) return;
	var val = $(obj).val();

	if (val && (val > 0)) {
		toggleError(obj, true);
		return true;
	} 
	toggleError(obj, false);	
	return false;
}

function validateForm() {

	var isValid = true;

	if (!validValue($('#length'))) isValid = false;		
	if (!validValue($('#width'))) isValid = false;		
	if (!validValue($('#height'))) isValid = false;		
	if (!validValue($('#req'))) isValid = false;		

	var mail = $('#calculateLight #mail')[0];
	if ( validateEmail( mail ) ) {
		toggleError(mail, true)
	} else {
		toggleError(mail, false);	
		isValid = false;		
	}

	var $lamps = $("#activeLamps .theLamp");
	if (!$lamps.length) {
		toggleError($("#noActiveLamps"), true)
		isValid = false;
	}
	else 
		toggleError($("#noActiveLamps"), false);

	return isValid;
}

$('#calculateLight').bind('submit', function(event) {

	if (!validateForm()) {
		return false;
	}

	var $lamps = $("#activeLamps .theLamp");
	var arr = [];
	for (var i=0; i<$lamps.length; i++) {
		arr[arr.length] = $($lamps[i]).data('id');
	}	
	var str_id = arr.join(',');
	if (str_id) {
		$("#calculateLight").append('<input type="hidden" name="activeLampsId" value="'+str_id+'" >');
	}
});

$('#calculateLight #length, #calculateLight #width, #calculateLight #height, #calculateLight #req').bind('keypress', keypressNumbers);
$('#calculateLight #length, #calculateLight #width, #calculateLight #height, #calculateLight #req').bind('change', function(){
	validValue(this);
});

$('#calculateLight #mail').bind('change', function(){

	if ( validateEmail(this) ) {
		toggleError(this, true)
	}
	else
		toggleError(this, false);	
});

});