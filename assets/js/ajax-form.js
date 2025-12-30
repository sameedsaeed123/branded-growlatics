$(function() {

	// Get the form.
	var form = $('#contact-form');

	// Get the messages div.
	var formMessages = $('.ajax-response');

	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Always prevent the browser default to avoid page reloads; EmailJS handler will still run for EmailJS forms
		e.preventDefault();
		var action = $(form).attr('action') || '';
		// If this form is configured to use EmailJS, skip the built-in ajax contact handler so the EmailJS handler runs
		if ($(form).data('emailjs-service')) {
			// EmailJS submit handler will handle sending and messaging
			return;
		}
		// If the form posts to FormSubmit, submit using FormSubmit AJAX endpoint so we can show inline success/error
		if (action.indexOf('formsubmit.co') !== -1) {
			var $submitBtn = $(form).find('button[type="submit"]');
			var originalBtnHtml = $submitBtn.html();
			$submitBtn.prop('disabled', true).text('Sending...');
			var fd = new FormData(form[0]);
			// build FormSubmit AJAX url
			var ajaxUrl = action.replace(/\/+$/, '');
			if (ajaxUrl.indexOf('/ajax/') === -1) {
				ajaxUrl = ajaxUrl.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
			}
			$.ajax({
				type: 'POST',
				url: ajaxUrl,
				data: fd,
				contentType: false,
				processData: false,
				dataType: 'json',
				headers: { 'Accept': 'application/json' }
			})
			.done(function(data) {
				var msg = (data && data.message) ? data.message : 'Thanks! Your message was sent.';
				showEmailJsMessage($(form), msg);
				// Clear the form inputs
				$(form)[0].reset();
			})
			.fail(function(jqXHR) {
				var errMsg = 'Oops! An error occured and your message could not be sent.';
				if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
					errMsg = jqXHR.responseJSON.message;
				} else if (jqXHR && jqXHR.responseText) {
					errMsg = jqXHR.responseText;
				}
				var $m = $(form).next('.ajax-response');
				if ($m.length === 0) {
					$m = $('<p class="ajax-response"></p>');
					$(form).after($m);
				}
				$m.removeClass('success').addClass('error').text(errMsg);
			})
			.always(function() {
				$submitBtn.prop('disabled', false).html(originalBtnHtml);
			});
			return false;
		}

		// If the form posts to Web3Forms, submit via JSON to their API and show inline success/error
		if (action.indexOf('api.web3forms.com') !== -1) {
			var $submitBtn = $(form).find('button[type="submit"]');
			var originalBtnHtml = $submitBtn.html();
			$submitBtn.prop('disabled', true).text('Sending...');
			var fd = new FormData(form[0]);
			var obj = {};
			fd.forEach(function(value, key) { obj[key] = value; });
			fetch(action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(obj)
			})
			.then(function(res) { return res.json(); })
			.then(function(data) {
				var msg = (data && (data.message || data.success && data.message)) ? data.message : 'Thanks! Your message was sent.';
				showEmailJsMessage($(form), msg);
				$(form)[0].reset();
			})
			.catch(function(err) {
				console.error('Web3Forms error', err);
				showEmailJsError('Failed to send message.');
			})
			.finally(function() {
				$submitBtn.prop('disabled', false).html(originalBtnHtml);
			});
			return false;
		}

		// Stop the browser from submitting the form for normal AJAX handler.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			var msg = response || 'Thanks! Your message was sent.';
			showEmailJsMessage($(form), msg);

			// Clear the form.
			$('#contact-form input,#contact-form textarea').val('');
		})
		.fail(function(data) {
			var errMsg = (data && data.responseText) ? data.responseText : 'Oops! An error occured and your message could not be sent.';
			var $m = $(form).next('.ajax-response');
			if ($m.length === 0) {
				$m = $('<p class="ajax-response"></p>');
				$(form).after($m);
			}
			$m.removeClass('success').addClass('error').text(errMsg);
		});
	});

	// EmailJS client-side send for forms with data-emailjs-service
	function loadEmailJs(userId, callback) {
		if (window.emailjs) {
			if (userId) window.emailjs.init(userId);
			return callback && callback();
		}
		var s = document.createElement('script');
		s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
		s.onload = function() {
			if (userId && window.emailjs) window.emailjs.init(userId);
			callback && callback();
		};
		document.body.appendChild(s);
	}

	$('form[data-emailjs-service]').each(function() {
		var $f = $(this);
		// ensure EmailJS initialized when form first used
		$f.on('submit', function(e) {
			e.preventDefault();
			var service = $f.data('emailjs-service');
			var template = $f.data('emailjs-template');
			var user = $f.data('emailjs-user');
			var $btn = $f.find('button[type="submit"]');
			var originalBtn = $btn.html();
			$btn.prop('disabled', true).text('Sending...');

			loadEmailJs(user, function() {
				if (!window.emailjs) {
					showEmailJsError('Email service unavailable.');
					return;
				}
				emailjs.sendForm(service, template, $f[0])
				.then(function() {
					showEmailJsMessage($f, 'Thanks! Your message was sent.');
					$f[0].reset();
				})
				.catch(function(err) {
					console.error('EmailJS error', err);
					showEmailJsError('Failed to send message.');
				})
				.finally(function() {
					$btn.prop('disabled', false).html(originalBtn);
				});
			});
		});
	});

	// Handle any footer/site forms that post to FormSubmit so they submit via AJAX and show inline messages
	$('form[action*="formsubmit.co"]').not('#contact-form').each(function() {
		var $ff = $(this);
		$ff.on('submit', function(e) {
			e.preventDefault();
			var action = $ff.attr('action') || '';
			var $btn = $ff.find('button[type="submit"], .tp-btn-subscribe');
			var originalBtn = $btn.html();
			$btn.prop('disabled', true).text('Sending...');
			var fd = new FormData($ff[0]);
			var ajaxUrl = action.replace(/\/+$/, '');
			if (ajaxUrl.indexOf('/ajax/') === -1) {
				ajaxUrl = ajaxUrl.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
			}
			$.ajax({
				type: 'POST',
				url: ajaxUrl,
				data: fd,
				contentType: false,
				processData: false,
				dataType: 'json',
				headers: { 'Accept': 'application/json' }
			})
			.done(function(data) {
				var msg = (data && data.message) ? data.message : 'Thanks! Your message was sent.';
				showEmailJsMessage($ff, msg);
				$ff[0].reset();
			})
			.fail(function(jqXHR) {
				var errMsg = 'Oops! An error occured and your message could not be sent.';
				if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
					errMsg = jqXHR.responseJSON.message;
				} else if (jqXHR && jqXHR.responseText) {
					errMsg = jqXHR.responseText;
				}
				var $m = $ff.next('.ajax-response');
				if ($m.length === 0) {
					$m = $('<p class="ajax-response"></p>');
					$ff.after($m);
				}
				$m.removeClass('success').addClass('error').text(errMsg);
			})
			.always(function() {
				$btn.prop('disabled', false).html(originalBtn);
			});
		});
	});

	// Handle footer/site newsletter forms that post to Web3Forms API
	$('form[action*="api.web3forms.com"]').not('#contact-form').each(function() {
		var $ff = $(this);
		$ff.on('submit', function(e) {
			e.preventDefault();
			var action = $ff.attr('action') || '';
			var $btn = $ff.find('button[type="submit"], .tp-btn-subscribe');
			var originalBtn = $btn.html();
			$btn.prop('disabled', true).text('Sending...');
			var fd = new FormData($ff[0]);
			var obj = {};
			// validate terms checkbox when present
			var $agree = $ff.find('input[name="agree_terms"]');
			if ($agree.length && !$agree.prop('checked')) {
				var $m = $ff.next('.ajax-response');
				if ($m.length === 0) { $m = $('<p class="ajax-response"></p>'); $ff.after($m); }
				$m.removeClass('success').addClass('error').text('Please agree to the terms and policies.');
				$btn.prop('disabled', false).html(originalBtn);
				return;
			}
			fd.forEach(function(value, key) { obj[key] = value; });
			fetch(action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(obj)
			})
			.then(function(res) { return res.json(); })
			.then(function(data) {
				var defaultMsg = 'Thanks! Your request was sent.';
				var msg = defaultMsg;
				if (obj.subject && obj.subject === 'Newsletter Signup') {
					msg = 'Form submitted successfully!';
				} else if (data && (data.message || (data.success && data.message))) {
					msg = data.message || msg;
				}
				showEmailJsMessage($ff, msg);
				$ff[0].reset();
			})
			.catch(function(err) {
				console.error('Web3Forms error', err);
				var $m = $ff.next('.ajax-response');
				if ($m.length === 0) {
					$m = $('<p class="ajax-response"></p>');
					$ff.after($m);
				}
				$m.removeClass('success').addClass('error').text('Failed to send message.');
			})
			.finally(function() {
				$btn.prop('disabled', false).html(originalBtn);
			});
		});
	});

	function showEmailJsMessage($form, msg) {
		var $m = $form.next('.ajax-response');
		if ($m.length === 0) {
			$m = $('<p class="ajax-response"></p>');
			$form.after($m);
		}
		$m.removeClass('error').addClass('success').text(msg);
	}

	function showEmailJsError(msg) {
		// show a global message near contact form if available, else alert
		var $m = $('.ajax-response').first();
		if ($m.length) {
			$m.removeClass('success').addClass('error').text(msg);
		} else {
			alert(msg);
		}
	}

});
