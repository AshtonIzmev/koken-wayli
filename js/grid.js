$(function() {

	var kLazyLoad = $K.lazy.load,
		kLazyLoadInit = $K.lazy.init,
		kPageLoading = false,
		kColLength = $('.column').length,
		themeLazyLoad = function(override) {
			if (override) { kLazyLoad(); }
		},
		themeLazyLoadInit = function(override) {
			$K.lazy.init();
			setTimeout( function() { $K.lazy.load(true); }, 100);
		},
		condensed = $('<div/>').css('width','100%').addClass('column condensed');

	$K.lazy.load = themeLazyLoad;
	$K.lazy.init = kLazyLoadInit;

	var updateGrid = function() {
		kPageLoading = false;
		$('#wrapper > .item').each(function(i,item) {
			var _col = $('.column:eq('+(i%kColLength)+')');
			$(item).appendTo(_col);
			_col.find('.item:last').clone().appendTo(condensed);
		});
		if ($('#grid').hasClass('no-rebalance')) { return; }
		window.setTimeout(function() {
			var longestCol, shortestCol;
			$('.column').each(function(i,column) {
				if (!longestCol || $(column).outerHeight(true) > longestCol.outerHeight(true)) {
					longestCol = $(column);
				}
				if (!shortestCol || $(column).outerHeight(true) < shortestCol.outerHeight(true)) {
					shortestCol = $(column);
				}
			});
			longestCol.find('.item:last').css('display','none');
			if ( longestCol.outerHeight(true) !== shortestCol.outerHeight(true)) {
				longestCol.find('.item:last').appendTo(shortestCol);
			}
			longestCol.find('.item:last').css('display','block');
			themeLazyLoad(true);
		},50);
	}

	$(window).off('.rjs').on('k-scroll.rjs', function() {
		themeLazyLoad(true);
		if (kPageLoading) { return false; }
		if ( $(document).scrollTop() + $('#grid').offset().top > ($('#grid').offset().top + $('#grid').height()) - $(window).height()*3 || $('.k-lazy-loading').length < 15 ) {
			kPageLoading = true;
			$K.infinity.next();
		}
	});

	$K.infinity.check = $.noop;

	var timer;
	var afterResize = function() {
		clearTimeout(timer);
		if (!window.matchMedia || window.matchMedia('(min-width: 767px)').matches) {
			$('.column').show();
			$('.column.condensed').hide();
		} else {
			if (!$('.column.condensed').length) {
				$('.column').parent().append(condensed);
			} else {
				$('.column.condensed').show();
			}
			$('.column:not(".condensed")').hide();
		}
		themeLazyLoadInit();
		$K.responsiveImages();
	}

	$(window).on('k-infinite-loaded', updateGrid).trigger('k-infinite-loaded');
	$(window).on('resize', function() {
		clearTimeout(timer);
		timer = window.setTimeout(afterResize, 200);
	}).trigger('resize');

	themeLazyLoadInit();

});