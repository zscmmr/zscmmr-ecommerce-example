( function () {
	const storageKey = 'zscmmr-preview-cart';
	const checkoutList = document.querySelector( '[data-checkout-list]' );
	const checkoutCount = document.querySelector( '[data-checkout-count]' );
	const checkoutTotal = document.querySelector( '[data-checkout-total]' );
	const payButton = document.querySelector( '[data-pay-button]' );
	const countElements = Array.from( document.querySelectorAll( '.cart-count' ) );

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

	function renderCheckout( items ) {
		if ( ! checkoutList ) {
			return;
		}

		const totalItems = items.reduce( function ( total, item ) {
			return total + item.quantity;
		}, 0 );

		if ( checkoutCount ) {
			checkoutCount.textContent = String( totalItems );
		}

		checkoutList.replaceChildren();

		if ( ! items.length ) {
			const emptyItem = document.createElement( 'li' );
			emptyItem.className = 'checkout-summary-empty';
			emptyItem.textContent = 'Your bag is empty.';
			checkoutList.append( emptyItem );
			if ( checkoutTotal ) {
				checkoutTotal.textContent = 'Price not set';
			}
			if ( payButton ) {
				payButton.disabled = true;
			}
			return;
		}

		items.forEach( function ( item ) {
			const row = document.createElement( 'li' );
			const name = document.createElement( 'span' );
			const meta = document.createElement( 'small' );

			row.className = 'checkout-summary-item';
			name.textContent = item.name;
			meta.textContent = 'Size ' + item.size + ' · Qty ' + item.quantity;
			row.append( name, meta );
			checkoutList.append( row );
		} );

		if ( checkoutTotal ) {
			checkoutTotal.textContent = 'Price not set';
		}

		if ( payButton ) {
			payButton.disabled = false;
		}
	}

	try {
		const items = readCart();
		updateCartCount( items );
		renderCheckout( items );
	} catch ( error ) {
		console.error( error );
		if ( checkoutList ) {
			checkoutList.innerHTML = '<li class="checkout-summary-empty">Unable to load your bag.</li>';
		}
		if ( payButton ) {
			payButton.disabled = true;
		}
	}

	if ( payButton ) {
		payButton.addEventListener( 'click', function () {
			window.alert( 'This page is an e-commerce demo. Payments are not processed.' );
		} );
	}
}() );
