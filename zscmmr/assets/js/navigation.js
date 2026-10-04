( function () {
	const button = document.querySelector( '.menu-toggle' );
	const navigation = document.querySelector( '.primary-navigation' );

	if ( ! button || ! navigation ) {
		return;
	}

	button.addEventListener( 'click', function () {
		const isExpanded = button.getAttribute( 'aria-expanded' ) === 'true';
		button.setAttribute( 'aria-expanded', String( ! isExpanded ) );
		navigation.classList.toggle( 'is-open', ! isExpanded );
	} );
}() );
