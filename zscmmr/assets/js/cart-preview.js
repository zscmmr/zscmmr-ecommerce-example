( function () {
	const storageKey = 'zscmmr-preview-cart';
	const productImages = {
		'water-reactive-cargo': 'zscmmr/assets/images/water-reactive-cargo.svg',
		kaos: 'product-images/kaos1.png',
		hoodie: 'product-images/hoodie1.png',
		caps: 'product-images/caps1.png',
		'kaos-1': 'product-images/kaos1.png',
		'kaos-2': 'product-images/kaos2.png',
		'kaos-3': 'product-images/kaos3.png',
		'kaos-4': 'product-images/kaos4.png',
		'kaos-5': 'product-images/kaos5.png',
		'kaos-6': 'product-images/kaos6.png',
		'kaos-7': 'product-images/kaos7.png',
		'hoodie-1': 'product-images/hoodie1.png',
		'hoodie-2': 'product-images/hoodie2.png',
		'hoodie-3': 'product-images/hoodie3.png',
		'caps-1': 'product-images/caps1.png',
		'caps-2': 'product-images/caps2.png',
		'caps-3': 'product-images/caps3.png',
	};
	const countElements = Array.from( document.querySelectorAll( '.cart-count' ) );
	const productForm = document.querySelector( '[data-preview-product-form]' );
	const cartList = document.querySelector( '[data-cart-list]' );
	const emptyMessage = document.querySelector( '[data-cart-empty]' );
	const cartError = document.querySelector( '[data-cart-error]' );
	const cartNotice = document.querySelector( '[data-cart-preview-notice]' );
	const clearButton = document.querySelector( '[data-cart-clear]' );
	const paymentLink = document.querySelector( '[data-cart-payment-link]' );

	function showError( message ) {
		const errorTarget = cartError || ( productForm && productForm.querySelector( '[data-cart-status]' ) );

		if ( errorTarget ) {
			errorTarget.textContent = message;
			if ( errorTarget === cartError ) {
				errorTarget.hidden = false;
			}
		}
	}

	function readCart() {
		const storedCart = window.localStorage.getItem( storageKey );

		if ( ! storedCart ) {
			return [];
		}

		const items = JSON.parse( storedCart );

		if ( ! Array.isArray( items ) || items.some( function ( item ) {
			return ! item || typeof item.productId !== 'string' || typeof item.name !== 'string' || typeof item.size !== 'string' || ! Number.isInteger( item.quantity ) || item.quantity < 1 || item.quantity > 99;
		} ) ) {
			throw new Error( 'Preview cart data is invalid.' );
		}

		return items;
	}

	function updateCartCount( items ) {
		const totalItems = items.reduce( function ( total, item ) {
			return total + item.quantity;
		}, 0 );

		countElements.forEach( function ( count ) {
			count.textContent = String( totalItems );
		} );
	}

	function saveCart( items ) {
		window.localStorage.setItem( storageKey, JSON.stringify( items ) );
		updateCartCount( items );
	}

	function renderCart( items ) {
		if ( ! cartList ) {
			return;
		}

		cartList.replaceChildren();
		emptyMessage.hidden = items.length > 0;
		if ( clearButton ) {
			clearButton.hidden = items.length === 0;
		}
		if ( paymentLink ) {
			paymentLink.hidden = items.length === 0;
		}

		items.forEach( function ( item, index ) {
			const row = document.createElement( 'li' );
			const image = document.createElement( 'img' );
			const details = document.createElement( 'div' );
			const title = document.createElement( 'h2' );
			const summary = document.createElement( 'p' );
			const removeButton = document.createElement( 'button' );

			row.className = 'cart-preview-item';
			image.className = 'cart-preview-product-image';
			image.src = productImages[ item.productId ] || productImages[ 'water-reactive-cargo' ];
			image.alt = item.name;
			image.loading = 'lazy';
			details.className = 'cart-preview-item-details';
			title.textContent = item.name;
			summary.textContent = 'Size ' + item.size + ' · Qty ' + item.quantity + ' · Price not set';
			removeButton.className = 'cart-remove-button';
			removeButton.type = 'button';
			removeButton.textContent = 'Remove';
			removeButton.setAttribute( 'aria-label', 'Remove ' + item.name + ', size ' + item.size );
			removeButton.addEventListener( 'click', function () {
				const updatedItems = readCart();
				updatedItems.splice( index, 1 );
				saveCart( updatedItems );
				renderCart( updatedItems );
			} );

			details.append( title, summary );
			row.append( image, details, removeButton );
			cartList.append( row );
		} );
	}

	try {
		const initialCart = readCart();
		updateCartCount( initialCart );
		renderCart( initialCart );

		if ( cartNotice && new URLSearchParams( window.location.search ).get( 'checkout' ) === 'preview' ) {
			cartNotice.textContent = 'Buy Now adds the selected item to this demo bag. Checkout and payment are for demonstration only.';
		}
	} catch ( error ) {
		showError( 'Unable to load your bag: ' + error.message );
		console.error( error );
	}

	if ( productForm ) {
		productForm.addEventListener( 'submit', function ( event ) {
			event.preventDefault();

			const submitter = event.submitter;
			const formData = new FormData( productForm );
			const size = formData.get( 'size' );
			const quantity = Number( formData.get( 'quantity' ) );
			const productId = productForm.dataset.productId;
			const productName = productForm.dataset.productName;

			if ( typeof size !== 'string' || ! size || ! productId || ! productName || ! productImages[ productId ] || ! Number.isInteger( quantity ) || quantity < 1 || quantity > 99 ) {
				showError( 'Choose a valid product size and a quantity between 1 and 99.' );
				return;
			}

			try {
				const items = readCart();
				const existingItem = items.find( function ( item ) {
					return item.productId === productId && item.size === size;
				} );

				if ( existingItem ) {
					existingItem.quantity = Math.min( existingItem.quantity + quantity, 99 );
				} else {
					items.push( {
						productId: productId,
						name: productName,
						size: size,
						quantity: quantity,
					} );
				}

				saveCart( items );

				if ( submitter && submitter.value === 'buy' ) {
					window.location.href = 'cart.html?checkout=preview';
					return;
				}

				const status = productForm.querySelector( '[data-cart-status]' );
				status.textContent = productName + ' added to your bag.';
			} catch ( error ) {
				showError( 'Unable to add the product: ' + error.message );
				console.error( error );
			}
		} );
	}

	if ( clearButton ) {
		clearButton.addEventListener( 'click', function () {
			try {
				saveCart( [] );
				renderCart( [] );
			} catch ( error ) {
				showError( 'Unable to clear your bag: ' + error.message );
				console.error( error );
			}
		} );
	}
}() );
