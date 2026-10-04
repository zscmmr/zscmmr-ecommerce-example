( function () {
	const image = document.querySelector( '[data-moment-image]' );
	const eyebrow = document.querySelector( '[data-moment-eyebrow]' );
	const title = document.querySelector( '[data-moment-title]' );
	const description = document.querySelector( '[data-moment-description]' );
	const error = document.querySelector( '[data-moment-error]' );

	if ( ! image || ! eyebrow || ! title || ! description || ! error ) {
		return;
	}

	const momentNumber = new URLSearchParams( window.location.search ).get( 'moment' ) || '1';

	if ( ! /^[1-4]$/.test( momentNumber ) ) {
		error.textContent = 'This moment could not be found. Please return to the gallery and choose another moment.';
		error.hidden = false;
		image.hidden = true;
		return;
	}

	const label = 'Moment ' + momentNumber.padStart( 2, '0' );
	image.src = 'moment-images/moment' + momentNumber + '.png';
	image.alt = 'ZSCMMR ' + label.toLowerCase();
	eyebrow.textContent = 'Moment · ZSCMMR';
	title.textContent = label;
	document.title = label + ' · ZSCMMR Gallery';
	description.textContent = 'A moment from the ZSCMMR visual archive.';
}() );
