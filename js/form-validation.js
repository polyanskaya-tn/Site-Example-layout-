

(function(){
	var $=jQuery;
	function parse_validate_css(vcss)
	{
		var options=/validate:\{([^}]*)\}/i.exec(vcss);
		if(!options||!options[1])
			return {error:'',ok:''};
		var css=options[1].split('+');
		if(!css)
			return {error:'',ok:''};
		return {error:css[0]||'',ok:css[1]||''};
	}
	function make_validate_rexp(vrexp, $form)
	{
		var rexp=/validate:\{((\/[^}]*\/[igms]*)|([^}]*))\}/i.exec(vrexp);
		if(!rexp[0])
			return (/.+/);
		if(rexp[3])
		{
			return {
				test: function(val)
				{
					var $el=$form.find(rexp[3]);
					if($el.length===0)
						return true;
					return $el.val()==val;
				}
			};
		}
		return eval(decodeURIComponent(rexp[2]));
	}
	function test_item(ev,el)
	{
		var vcss;
		var $this=$(this);
		var $form=$this.closest('form[rel*="validate:"]');
		
		if(!$this.is(':visible') && !$this.hasClass('validate-always') && !$form.hasClass('validate-always'))
			return true;

		if(!(vcss=$form.data('validate-css')))
			$form.data('validate-css',vcss=parse_validate_css($form.attr('rel')));
		var vrexp;
		if(!(vrexp=$this.data('validate-rexp')))
			$this.data('validate-rexp',vrexp=make_validate_rexp($this.attr('rel'), $form));
		if( !vrexp.test($this.val()) || ( $this.is('[rel*=focus]') && $this.val()==$this.prop('defaultValue') ) )
		{
			$this.addClass(vcss.error).removeClass(vcss.ok);
			return false;
		}
		else
		{
			$this.addClass(vcss.ok).removeClass(vcss.error);
		}
		return true;
	}
	function test_checkbox()
	{
		var vcss;
		var $this=$(this);
		
		if(!$this.is(':visible'))
			return true;

		var $form=$this.closest('form[rel*="validate:"]');
		if(!(vcss=$form.data('validate-css')))
			$form.data('validate-css',vcss=parse_validate_css($form.attr('rel')));

		var selector=/required:\{([^}]*)\}/i.exec($this.attr('rel'));
		selector=(selector&&selector[1])||0;
		var $target;
		if($.isNumeric(selector))
			$target=selector>0?$this.parents().eq(selector-1):$this;
		else
			$target=$this.closest(selector);

		if(this.checked)
		{
			$target.removeClass(vcss.error);
			return true;
		}
		$target.addClass(vcss.error);
		return false;
	}
	function test_radio()
	{
		var $this=$(this);
		
		if(!$this.is(':visible'))
			return true;

		var name=$this.attr('name');
		var radios=$('input[name='+name+']:radio');

		var $form=$this.closest('form[rel*="validate:"]');
		if(!(vcss=$form.data('validate-css')))
			$form.data('validate-css',vcss=parse_validate_css($form.attr('rel')));

		var selector=/required:\{([^}]*)\}/i.exec($this.attr('rel'));
		selector=(selector&&selector[1])||0;
		var $target;
		if($.isNumeric(selector))
			$target=selector>0?radios.parents().eq(selector-1):radios;
		else
			$target=radios.closest(selector);

		if(radios.is(':checked'))
		{
			$target.removeClass(vcss.error);
			return true;
		}
		$target.addClass(vcss.error);
		return false;
	}
	function test_value()
	{
		var $this=$(this);
		
		if(!$this.is(':visible'))
			return true;

		var $form=$this.closest('form[rel*="validate:"]');
		if(!(vcss=$form.data('validate-css')))
			$form.data('validate-css',vcss=parse_validate_css($form.attr('rel')));

		var selector=/required:\{([^}]*)\}/i.exec($this.attr('rel'));
		selector=(selector&&selector[1])||0;
		var $target;
		if($.isNumeric(selector))
			$target=selector>0?$this.parents().eq(selector-1):$this;
		else
			$target=$this.closest(selector);

		if($this.val()!=='')
		{
			$target.removeClass(vcss.error);
			return true;
		}
		$target.addClass(vcss.error);
		return false;

	}
	function check_form_items(ev,el)
	{
		var $this=$(this);
		var inputs=$this.find('[rel*="validate"]');
		var checkboxes=$this.find('input[type=checkbox][rel*="required"]');
		var radios=$this.find('input[type=radio][rel*="required"]');
		var selects_and_files=$this.find('select[rel*="required"], input[type=file][rel*="required"]');
		var vfailed=inputs.not(test_item).add(checkboxes.not(test_checkbox)).add(radios.not(test_radio)).add(selects_and_files.not(test_value));
		if(vfailed.length===0)
			return;
		var pos = vfailed.offset();

		$(window).scrollLeft(pos.left).scrollTop(pos.top-$(window).height()/2+vfailed.height()/2);
		return false;
	}
	function input_focused(ev)
	{
		var $this=$(this);
		if(!$this.hasClass('blur'))
			return;
		$this.removeClass('blur');
		if($this.val()!=$this.prop('defaultValue'))
			return;
		$this.val('');
	}
	function input_blured(ev)
	{
		var $this=$(this);
		if($this.val()!=='')
			return;
		$this.val($this.prop('defaultValue'));
		$this.addClass('blur');
	}

	$(function(){
		var forms=$('form[rel*="validate:"]');
		forms.on('submit',check_form_items);
		forms.on('keyup change blur','input[rel*="validate:"], textarea[rel*="validate:"]',test_item);
		forms.on('change','input[type=checkbox][rel*="required"]',test_checkbox);
		forms.on('change','select[rel*="required"]',test_value);
		forms.on('change','input[type=radio][rel*="required"]',test_radio);
		forms.find('input[type=file][rel*="required"]').on('change',test_value);

		$(document).on( { 'focusin': input_focused, 'focusout': input_blured }, 'input[rel*=focus], textarea[rel*=focus]');

	});
}).call(window);
