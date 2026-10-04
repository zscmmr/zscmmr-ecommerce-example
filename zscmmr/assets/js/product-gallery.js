( function () {
	document.querySelectorAll( '[data-product-gallery]' ).forEach( function ( gallery ) {
		const images = Array.from( gallery.querySelectorAll( '.gallery-image' ) );
		const dots = Array.from( gallery.querySelectorAll( '.gallery-dot' ) );
		const previous = gallery.querySelector( '.gallery-previous' );
		const next = gallery.querySelector( '.gallery-next' );
		const zoomTrigger = gallery.querySelector( '.gallery-zoom-trigger' );
		const zoomDialog = gallery.querySelector( '.product-image-zoom' );
		const zoomContent = gallery.querySelector( '[data-zoom-image]' );
		const zoomClose = gallery.querySelector( '.product-image-zoom-close' );

		if ( images.length === 0 || images.length !== dots.length || ! previous || ! next || ! zoomTrigger || ! zoomDialog || ! zoomContent || ! zoomClose ) {
			throw new Error( 'Product gallery requires matching slides, controls, and image zoom elements.' );
		}

		let activeIndex = images.findIndex( function ( image ) {
			return image.classList.contains( 'is-active' );
		} );

		if ( activeIndex < 0 ) {
			activeIndex = 0;
		}

		function showImage( index ) {
			activeIndex = ( index + images.length ) % images.length;

			images.forEach( function ( image, imageIndex ) {
				const isActive = imageIndex === activeIndex;
				image.classList.toggle( 'is-active', isActive );
				image.setAttribute( 'aria-hidden', String( ! isActive ) );
			} );

			dots.forEach( function ( dot, dotIndex ) {
				const isActive = dotIndex === activeIndex;
				dot.classList.toggle( 'is-active', isActive );
				dot.setAttribute( 'aria-current', String( isActive ) );
			} );

			if ( zoomDialog.open ) {
				updateZoomImage();
			}
		}

		function updateZoomImage() {
			zoomContent.replaceChildren( images[ activeIndex ].cloneNode( true ) );
		}

		if ( images.length > 1 ) {
			previous.addEventListener( 'click', function () {
				showImage( activeIndex - 1 );
			} );

			next.addEventListener( 'click', function () {
				showImage( activeIndex + 1 );
			} );

			dots.forEach( function ( dot, index ) {
				dot.addEventListener( 'click', function () {
					showImage( index );
				} );
			} );
		} else {
			gallery.querySelector( '.gallery-controls' ).hidden = true;
		}

		zoomTrigger.addEventListener( 'click', function () {
			updateZoomImage();
			zoomDialog.showModal();
		} );

		zoomClose.addEventListener( 'click', function () {
			zoomDialog.close();
		} );

		zoomDialog.addEventListener( 'click', function ( event ) {
			if ( event.target === zoomDialog ) {
				zoomDialog.close();
			}
		} );

		showImage( activeIndex );
	} );
}() );
