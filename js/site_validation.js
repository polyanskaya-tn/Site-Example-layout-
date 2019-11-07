/* feedback page */
$(function() {

  function validateContactForm() {

    $('#phone').mask('+7 000 000 00 00');

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

    function validateText(jsObj, len) {
      if (!jsObj) return;
      if (jsObj.value.length >= len) {
        return true;
      }
      return false;
    }

    function validateEmail(jsObj) {
      if (!jsObj) return;
      if (jsObj.value == '') return true;

      var regexp = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return regexp.test(jsObj.value);
    }

    /* phone format: +7 987 654 32 10 */
    function validatePhone(jsObj) {
      if (!jsObj) return;
      if (jsObj.value == '') return false;

      var phone = jsObj.value;
      phone = phone.replace(/\s+/g,''); 
  
      var regexp = /^\+7(\d{10})$/;
      return regexp.test(phone);
    }

    function validateTypes(jsObj) {
      if (!jsObj) return;
      var isValid = false;

      if (jsObj.name == 'your-name') {
        isValid = validateText(jsObj, 3);
        return (isValid?1:0);
      }
      else if (jsObj.name == 'your-message') {
        isValid = validateText(jsObj, 10);
        return (isValid?1:0);
      }
      else if (jsObj.name == 'phone') {
        isValid = validatePhone(jsObj);
        return (isValid?1:0);
      }
      else if (jsObj.type == 'email') {
        isValid = validateEmail(jsObj);  
        return (isValid?1:0);
      }

      return -1;
    }

    function validateInputs($elems) {
      var isValidRequired = true;
      var isValidOptional = false;
      var ret;

      if (!$elems)
        $elems = $('[type=text], textarea, [type=email]');

      for (var i=0; i<$elems.length; i++) {

        ret = validateTypes($elems[i]);
        if (ret == 0) { //not validate at least one

          if (($elems[i].name == 'your-name') ||
            ($elems[i].name == 'your-message')) {
            isValidRequired = false;
            toggleError($elems[i], isValidRequired);
          }
        }
        else if (ret == 1) { //validate at least one
          if (($elems[i].name == 'phone') || 
            ($elems[i].type == 'email')) {
            isValidOptional = true;
          }
        }
      }
      //not validate email or phone
      
      if (!isValidOptional) {
        toggleError($($elems).filter('[name=phone]'), false);
      }
        
      if (isValidRequired && isValidOptional) {
        var $privacy = $('.privacy'); 
        var $checkbox= $privacy.find('input:checkbox');
        var isOk = false;
        if (($checkbox.length>0) && $checkbox.is(':checked')) 
          isOk = true;
        toggleError($privacy, isOk);
        return isOk;
      }
      return false;
    }

    function validateInit() {
      var $elems = $('[type=text], textarea, [type=email]');
      var $arrElems = [];
      for (var i=0; i<$elems.length; i++) {
        if ($elems[i].value != '')
          $arrElems[$arrElems.length] = $elems[i];
      }
      validateInputs($arrElems);
    }

    function showPopup(isValid) {
      if (isValid) {
        //show message about successful send
        var $popup = $('.popup');
        $popup.find('p').text('Ваше сообщение успешно отправлено на сервер');
        $popup.css('display','block');
      }
      else {
        var $popup = $('.popup');
        $popup.find('p').text(
          'Заполните корректно поля формы и повторите попытку');
        $popup.css('display','block');
      }
    }

    $('.popup').bind('click', function(event) {
      event.preventDefault();
      $('.popup').css('display','none'); 
    });

    $('form').bind('submit', function(event) {
      var isValid = validateInputs();
      if (!isValid) event.preventDefault();
      showPopup(isValid);
    });

    $('[type=text], textarea, [type=email]').bind('change', function() 
    {
      var ret = validateTypes(this);
      if (ret >= 0) toggleError(this, (ret>0)?true:false);
    });

    validateInit();
  }

  if ( $("#contact-form").length )
    validateContactForm();
});

/* retail page */
$(function() {

  function validateOrderForm(form_id) {
 
    //show error state
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
    //max length
    function validLength(jsObj,min, max) {
      if (!jsObj) return;
      if ((jsObj.value.length >= min) && (jsObj.value.length <= max)) {
        return true;
      }
      return false;
    }
    //only numbers
    function validNumber(jsObj,len) {
      if (!jsObj) return;
      if (jsObj.value == '') return false;
      if (len && !validLength(jsObj, 1, len))
        return false;

      var num = jsObj.value;
      var regexp = /^\d+$/;
      return regexp.test(num);
    }
    //russian letters and space
    function validRussian(jsObj, len) {
      if (!jsObj) return;
      if (jsObj.value == '') return false;
      if (len && !validLength(jsObj, 1, len))
        return false;

      var fio = jsObj.value;
      var regexp = /^[А-Яа-я\s]+$/;
      return regexp.test(fio);
    }
    function validAddress(jsObj) {
    	if (!jsObj) return;
      if (jsObj.value == '') return false;
      if (!validLength(jsObj, 1, 255))
        return false;

      var address = jsObj.value;
      var regexp = /^[А-Яа-я\s\d]+$/;
      return regexp.test(address);
    }
    //email is not required field, may be empty
    function validEmail(jsObj) {
      if (!jsObj) return;
      if (jsObj.value == '') return true;

      var regexp = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return regexp.test(jsObj.value);
    }
    // phone format: +7 987 654 32 10 
    function validPhone(jsObj) {
      if (!jsObj) return;
      if (jsObj.value == '') return false;

      var phone = jsObj.value;
      phone = phone.replace(/\s+/g,''); 
  
      var regexp = /^\+7(\d{10})$/;
      return regexp.test(phone);
    }
    function validINN(jsObj) {
    	if (!jsObj) return;
      if (jsObj.value == '') return false;
      
      var num = jsObj.value;
      var regexp = /^\d{10}$/;
      return regexp.test(num);
    }
    //all fields by their name
    function validTypes(jsObj) {
      if (!jsObj) return;
      var isValid = false;

      if ((jsObj.name == 'your-name') || (jsObj.name == 'contact-name')) {
        isValid = validRussian(jsObj, 100);
        return (isValid?1:0);
      }
      else if ((jsObj.name == 'delivery') || (jsObj.name == 'contact-delivery')) {
        isValid = validRussian(jsObj, 255);
        return (isValid?1:0);
      }
      else if ((jsObj.name == 'address') || (jsObj.name == 'contact-address')) {
        isValid = validAddress(jsObj);
        return (isValid?1:0);
      }
      else if ((jsObj.name == 'phone') || (jsObj.name == 'contact-phone')) {
        isValid = validPhone(jsObj);
        return (isValid?1:0);
      }
      else if (jsObj.type == 'email') {
        isValid = validEmail(jsObj);  
        return (isValid?1:0);
      }
      else if (jsObj.name == 'company') {
        isValid = validLength(jsObj, 1, 50);
        return (isValid?1:0);
      }
      else if (jsObj.name == 'inn') {
        isValid = validINN(jsObj);
        return (isValid?1:0);
      }
      else if ( jsObj.name.substr(0,6) == 'amount' ) {
        isValid = parseInt(jsObj.value) > 0;
        return (isValid?1:0);
      } 
      return -1;
    }

    function validInputs($elems) {
      var isValidRequired = true;
      var isValidOptional = false;
      var ret;

      if (!$elems)
        $elems = $(form_id+' [type=text], '+form_id+' textarea, '+form_id+' [type=email]');
      console.log(form_id+' [type=text], '+form_id+' textarea, '+form_id+' [type=email]');

      for (var i=0; i<$elems.length; i++) {

      	//check only visible elems
      	if ( !$($elems[i]).is(':visible') ) continue;

        ret = validTypes($elems[i]);
        if (ret == 0) { //not validate at least one

          if (($elems[i].name != 'phone') && ($elems[i].name != 'contact-phone') &&
            ($elems[i].type != 'email') ) {
            isValidRequired = false;
            toggleError($elems[i], isValidRequired);
          }
        }
        else if (ret == 1) { //validate at least one
          if (($elems[i].name == 'phone') || 
          	($elems[i].name == 'contact-phone') || 
            ($elems[i].type == 'email')) {
            isValidOptional = true;
          }
        }
      }
      //not validate email or phone
      if (!isValidOptional) {
        toggleError($($elems).filter('[name=phone]'), false);
      }
        
      if (isValidRequired && isValidOptional) {

      	//check products 
      	if (!$('#order table:visible').length) {
      		toggleError( $('#order .products'), false);
      		$('.popup p').text('Для оформления заказа необходимо добавить товары в корзину.');
      		return false;
      	}

				var totalSum = parseInt( $("#totalSum").html() );
				if ( !( totalSum > 0 )) {
					//toggleError( $('#order .products'), false );
					return false;
  			}
 
 				//check privacy
        var $privacy = $('.privacy'); 
        var $checkbox= $privacy.find('input:checkbox');
        var isOk = false;
        if (($checkbox.length>0) && $checkbox.is(':checked')) 
          isOk = true;
        toggleError($privacy, isOk);
        if (!isOk)
        	$('.popup p').text('Заполните корректно поля формы и повторите попытку');

        return isOk;
      }
      return false;
    }

    function showPopup(isValid) {
      if (isValid) {
        //show message about successful send
        var $popup = $('.popup');
        $popup.find('p').text('Ваше сообщение успешно отправлено на сервер');
        $popup.css('display','block');
      }
      else {
        $('.popup').css('display','block');
      }
    }

    $('.popup').bind('click', function(event) {
      event.preventDefault();
      $('.popup').css('display','none'); 
    });

    $(form_id).bind('submit', function(event) {
      var isValid = validInputs();
      if (!isValid) {
        event.preventDefault();
        
      }
      showPopup(isValid);
    });

    $(form_id+' [type=text], '+form_id+' textarea, '+form_id+' [type=email]').bind('change', function() 
    {
      var ret = validTypes(this);
      if (ret >= 0) toggleError(this, (ret>0)?true:false);
    });

    $('#phone').mask('+7 000 000 00 00');
    $('#contact-phone').mask('+7 000 000 00 00');
  }

  if ( $("#order").length )
    validateOrderForm('#order');
});

$(function() {

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

$('#order input[name^="amount"]').bind('keypress', keypressNumbers);

});
