( function () {
	const imageFolder = 'product-images/';
	const categories = [
		{
			id: 'kaos',
			name: 'T-Shirt',
			price: 'IDR 249,000',
			description: 'ZSCMMR T-shirt featuring the design shown in the product photos. Choose your size using the available size guide.',
			files: [ 'kaos1.png', 'kaos2.png', 'kaos3.png', 'kaos4.png', 'kaos5.png', 'kaos6.png', 'kaos7.png' ],
			sizeChart: 'size chart kaos.png',
			sizes: [ 'S', 'M', 'L', 'XL', 'XXL' ],
		},
		{
			id: 'hoodie',
			name: 'Hoodie',
			price: 'IDR 589,000',
			description: 'ZSCMMR hoodie featuring the design shown in the product photos. Choose your size using the available size guide.',
			files: [ 'hoodie1.png', 'hoodie2.png', 'hoodie3.png' ],
			sizeChart: 'size chart hoodie.png',
			sizes: [ 'S', 'M', 'L', 'XL', 'XXL' ],
		},
		{
			id: 'caps',
			name: 'Cap',
			price: 'IDR 189,000',
			description: 'ZSCMMR cap featuring the design shown in the product photos.',
			files: [ 'caps1.png', 'caps2.png', 'caps3.png' ],
			sizes: [ 'One Size' ],
		},
	];
	const products = categories.reduce( function ( catalog, category ) {
		category.files.forEach( function ( file, index ) {
			const number = index + 1;

			catalog.push( {
				id: category.id + '-' + number,
				name: 'ZSCMMR ' + category.name + ' ' + number,
				category: category.name,
				price: category.price,
				description: category.description,
				file: file,
				sizeChart: category.sizeChart || '',
				sizes: category.sizes,
			} );
		} );
		return catalog;
	}, [] );
	const productGrid = document.querySelector( '[data-storefront-products]' );
	const relatedGrid = document.querySelector( '[data-related-products]' );
	const productForm = document.querySelector( '[data-preview-product-form]' );

	function createProductCard( product ) {
		const item = document.createElement( 'li' );
		const link = document.createElement( 'a' );
		const artwork = document.createElement( 'div' );
		const image = document.createElement( 'img' );
		const info = document.createElement( 'div' );
		const title = document.createElement( 'h2' );
		const price = document.createElement( 'p' );

		item.className = 'featured-product-card';
		link.className = 'featured-product-link';
		link.href = 'product.html?product=' + encodeURIComponent( product.id );
		artwork.className = 'featured-product-art';
		image.src = imageFolder + product.file;
		image.alt = product.name;
		image.loading = 'lazy';
		artwork.append( image );
		info.className = 'featured-product-info';
		title.textContent = product.name;
		price.textContent = product.price;
		info.append( title, price );
		link.append( artwork, info );
		item.append( link );

		return item;
	}

	if ( productGrid ) {
		products.forEach( function ( product ) {
			productGrid.append( createProductCard( product ) );
		} );
	}

	if ( relatedGrid ) {
		const currentId = new URLSearchParams( window.location.search ).get( 'product' ) || 'kaos-1';

		relatedGrid.replaceChildren();
		products.filter( function ( product ) {
			return product.id !== currentId;
		} ).slice( 0, 4 ).forEach( function ( product ) {
			relatedGrid.append( createProductCard( product ) );
		} );
	}

	if ( productForm ) {
		const productId = new URLSearchParams( window.location.search ).get( 'product' ) || 'kaos-1';
		const product = products.find( function ( item ) {
			return item.id === productId;
		} );

		if ( ! product ) {
			throw new Error( 'The selected product is unavailable: ' + productId );
		}

		const title = document.querySelector( '#product-title' );
		const description = document.querySelector( '[data-product-description]' );
		const price = document.querySelector( '[data-product-price]' );
		const specifications = document.querySelector( '[data-product-specifications]' );
		const sizeSelect = productForm.querySelector( '[name="size"]' );
		const sizeGuide = document.querySelector( '[data-size-guide]' );
		const gallery = document.querySelector( '[data-product-gallery]' );
		const galleryButton = gallery && gallery.querySelector( '.gallery-zoom-trigger' );
		const dots = gallery && gallery.querySelector( '.gallery-dots' );

		if ( ! title || ! description || ! price || ! specifications || ! sizeSelect || ! sizeGuide || ! galleryButton || ! dots ) {
			throw new Error( 'Required product detail elements are missing.' );
		}

		title.textContent = product.name;
		description.textContent = product.description;
		price.textContent = product.price;
		document.title = product.name + ' — ZSCMMR';
		productForm.dataset.productId = product.id;
		productForm.dataset.productName = product.name;
		sizeGuide.replaceChildren();
		if ( product.sizeChart ) {
			const chart = document.createElement( 'img' );
			chart.className = 'product-size-chart';
			chart.src = imageFolder + product.sizeChart;
			chart.alt = product.category + ' ZSCMMR size guide in centimeters';
			chart.loading = 'lazy';
			sizeGuide.append( chart );
		} else {
			sizeGuide.textContent = 'This product is available in one size: One Size.';
		}

		specifications.replaceChildren();
		[
			[ 'Category', product.category ],
			[ 'Collection', 'ZSCMMR' ],
			[ 'Available sizes', product.sizes.join( ', ' ) ],
		].forEach( function ( detail ) {
			const row = document.createElement( 'div' );
			const label = document.createElement( 'dt' );
			const value = document.createElement( 'dd' );

			label.textContent = detail[ 0 ];
			value.textContent = detail[ 1 ];
			row.append( label, value );
			specifications.append( row );
		} );

		sizeSelect.replaceChildren();
		const placeholder = document.createElement( 'option' );
		placeholder.value = '';
		placeholder.textContent = 'Choose a size';
		sizeSelect.append( placeholder );
		product.sizes.forEach( function ( size ) {
			const option = document.createElement( 'option' );
			option.value = size;
			option.textContent = size;
			sizeSelect.append( option );
		} );
		if ( product.sizes.length === 1 ) {
			sizeSelect.value = product.sizes[ 0 ];
		}

		galleryButton.replaceChildren();
		dots.replaceChildren();
		[ { file: product.file, alt: product.name + ' photo' } ].forEach( function ( productImage, index ) {
			const image = document.createElement( 'img' );
			const dot = document.createElement( 'button' );

			image.className = 'gallery-image' + ( index === 0 ? ' is-active' : '' );
			image.src = imageFolder + productImage.file;
			image.alt = productImage.alt;
			image.loading = index === 0 ? 'eager' : 'lazy';
			image.setAttribute( 'aria-hidden', String( index !== 0 ) );
			galleryButton.append( image );

			dot.className = 'gallery-dot' + ( index === 0 ? ' is-active' : '' );
			dot.type = 'button';
			dot.setAttribute( 'aria-label', 'Photo ' + ( index + 1 ) );
			dot.setAttribute( 'aria-current', String( index === 0 ) );
			dots.append( dot );
		} );
	}
}() );
