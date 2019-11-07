(function(){
	var $=jQuery;

	var hide_timer_id;

	function traslate(str)
	{
		var table={
			':':'%3A',
			',':'%2C',
			';':'%3B',
			'[':'%5B',
			']':'%5D'
		};
		return table[str]||str;
	}
	function get_caption(count)
	{
		var text='товаров';
		if (count<10 || count>20)
		{
			switch(count % 10)
			{
				case 1:
					text='товар';
					break;
				case 2:
				case 3:
				case 4:
					text='товара';
					break;
			}
		}
		return text;
	}
	function set_text_values(event, ui)
	{
		var $this=$(this);
		var $container = $this.closest('.param-container');
		var $obj = $container.find('.slider-start');
		if ($obj)
			$obj.val( ui.values[0] );
		$obj = $container.find('.slider-end');
		if ($obj)
			$obj.val( ui.values[1] );

		//var k=$this.data('fractional')?10:1;
		//$this.closest('.param-container')
		//	.find('.slider-start').val(parseInt(values[0], 10)/k).end()
		//	.find('.slider-end').val(parseInt(values[1], 10)/k);
	}
	function set_slider_values()
	{
		var $this=$(this);
		var container=$this.closest('.param-container');
		var slider=container.find('.slider');
		var k=slider.data('fractional')?10:1;

		if ($this.hasClass('slider-start'))  { // start
			var from=parseFloat(container.find('.slider-start').val(), 10)*k;	
			slider.slider('values', 0, from );
		}
		if ($this.hasClass('slider-end')) { // end
			var to=parseFloat(container.find('.slider-end').val(), 10)*k;
			slider.slider('values', 1, to );
		}
//		slider.slider('values', [from, to]);
	}
	function calc_top_position($target) {

		var $elem = null;

		if ($target.hasClass('slider')) { //it is slider
			$elem = $target.closest('.param-container').find('.fields');

		} else if ($target.is(':checkbox')) { //it is checkbox
			$elem = $target;
		}
		if ($elem) {
			var position=$elem.position();
			var heightElem=$elem.outerHeight();
			var heightMessage=$('.apply-box').outerHeight();
			return position.top+(heightElem-heightMessage)/2;
		}
		else 	
			return -1;
	}
	function get_results_count()
	{
		/* Построить строку формата фильтров */
		var $event_target=$(this);
		var filters='';
		var $filters_root=$event_target.closest('.catalog-filters');

		$('.catalog-filters .filters .param-container').each(function(){
			var $this=$(this);
			var $slider=$this.find('.slider');
			if ($slider.length===0)
			{
				/* Это не диапазон, значит список — получаем все выбранные 
				чекбоксы и проверяем что выбраны не все (в этом случае фильтр 
				можно смело снимать*/
				
				/*
				Закомментировано чтобы проверить как будут работать фильтры 
				в случае если выбраны все опции в категории и чтобы при этом
				не отображалось как будто товары не найдены.
				if($this.find('input:checkbox:not(:checked)').length===0)
					return;
				*/

				var checked=$this.find('input:checkbox:checked');
				if(checked.length===0)
					return;

				var list=checked.map(function(){
					return encodeURIComponent($(this).attr('value').replace(/,|:|;|\[|\]/gi, traslate));
				}).get().join(',');

				if (list)
					filters+= encodeURIComponent($this.data('field-name').replace(/,|:|;|\[|\]/gi, traslate))+':'+list+';';
			} else {
				/* диапазон. Проверяем что его начальные и конечные занчения
				не соответствуют минимуму и максимуму. */
				var options=$slider.slider('option');
				var min=options.min;
				var max=options.max;
				var values=$slider.slider('values');
				if ((min!=values[0]) || (max!=values[1])) {

					var k=$slider.data('fractional')?10:1;

					filters+=encodeURIComponent($this.data('field-name').replace(/,|:|;|\[|\]/gi, traslate))+
						':['+encodeURIComponent(parseInt(values[0], 10)/k)+','+
						encodeURIComponent(parseInt(values[1], 10)/k)+'];';
				}
			}
		});
		//if(filters==='')
			//return;

		var root=$('.catalog-content[data-catalog-root]').data('catalog-root');
		var id=$('.catalog-content[data-group-id]').data('group-id');
		//if(!root || !id)
		//	return;
		
		var url=window.location.pathname+(filters?'?filters='+filters:'');
		$('.catalog-filters button.apply').data('href', url).prop('disabled', true);

		//$.get(root+'api/json/filter/'+id+'/count/?filters='+filters, function(data){
			var count= 1; //data.count;
			if (parseInt(count, 10))
			{
				$('.apply-box .show').attr('href', 
					window.location.pathname+(filters?'?filters='+filters:''));

				var text = get_caption(count);
				$('.apply-box .items-text').text(count+' '+text);
				$('.catalog-filters button.apply').prop('disabled', false);

				$('.apply-box').removeClass('not-found');
				$filters_root.removeClass('not-found');
			} else {
				$('.apply-box').addClass('not-found');
				$filters_root.addClass('not-found');
			}
			
			var box_top = calc_top_position($event_target);
			$('.apply-box').css('top', box_top+'px' ).show();

			clearTimeout(hide_timer_id);
			hide_timer_id=setTimeout(function(){$('.apply-box').fadeOut('fast');}, 10000);
		//});
	}
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

	$(function(){
		$('.catalog-filters .filters .param-container .slider').each(function(){
			var $this=$(this);
			var from=parseFloat($this.data('from'), 10);
			var to=parseFloat($this.data('to'), 10);
			var input_from=$this.closest('.param-container').find('.slider-start');
			var input_to=$this.closest('.param-container').find('.slider-end');
			var cfrom=parseFloat(input_from.val(), 10) || from;
			input_from.val(cfrom);
			var cto=parseFloat(input_to.val(), 10) || to;
			input_to.val(cto);
			if(to-from < 50 )
			{
				to=to*10;
				from=from*10;
				cfrom=cfrom*10;
				cto=cto*10;
				$this.data('fractional', true);
			}
			$this.slider({
				range: true,
				min: from,
				max: to,
				values: [ Math.floor(cfrom), Math.ceil(cto) ]
			});
		});

		
		$('.catalog-filters')
			.on('slide', '.slider', set_text_values)
			.on('slidechange', '.slider', get_results_count)
			.on('change', 'input:checkbox', get_results_count)
			.on('change', '.slider-start, .slider-end', set_slider_values)
			//.on('keydown', '.slider-start, .slider-end', function(ev){if(ev.which==13) return set_slider_values.call(this);})
			.on('click', '.state-collapsible .title, .state-collapsed .title', function(){
				$(this).closest('.param-container').toggleClass('state-collapsible state-collapsed');
			}).on('click', 'button.apply', function(){
				var url=$(this).data('href');
				if(url)
					window.location=url;
				else
					window.location.reload();
			});

		$('.catalog-filters input[type="text"]').bind('keypress', keypressNumbers);
	});
})();