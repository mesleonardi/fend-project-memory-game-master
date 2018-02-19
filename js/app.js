/*
 * Create a list that holds all of your cards
 */

let figures = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
	opened = [],
	combinaded = 0,
	moves = 0,
	$deck = $('.deck'),
	$scorePanel = $('#score-panel'),
	$movimentNumbers = $('.moves'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	delay = 600,
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	totalOfCards = figures.length / 2,
	starnumber3 = 8,
	starnumber2 = 16,
	starnumber1 = 24;



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Game - Start 
function initGame() {
	var cards = shuffle(figures);
	$deck.empty();
	combinaded = 0;
	moves = 0;
	$movimentNumbers.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append(`<li class="card"><i class="fa fa-${cards[i]}"></i></li>`)
	}
	addCardListener();

	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	initTime();
};




// Set Rating and final Score
function setRating(moves) {
	var rating = 3;
	if (moves > starnumber3 && moves < starnumber2) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > starnumber2 && moves < starnumber1) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > starnumber1) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// Final Game - informatiom 
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game - information
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure?',
		text: "Your progress will be Lost!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Restart Game!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
});

var addCardListener = function () {

	// Virando as cartas
	$deck.find('.card').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('combinaded')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

		// Comparando as cartas 
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('combinaded animated infinite rubberBand');
				setTimeout(function () {
					$deck.find('.combinaded').removeClass('open show animated infinite rubberBand');
				}, delay);
				combinaded++;
			} else {
				$deck.find('.open').addClass('notcombinaded animated infinite wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notcombinaded animated infinite wobble');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$movimentNumbers.html(moves);
		}

		// Ganhando o jogo
		if (totalOfCards === combinaded) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 600);
		}
	});
};

// Add timer
function initTime() {
    currentTimer = setInterval(function () {
        second++
        $timer.text(`${second}`)
    }, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

initGame();