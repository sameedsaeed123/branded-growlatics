/**
 * Provider Compare Carousel Initialization
 */
(function() {
   // Wait for DOM to be ready
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initProviderCarousel);
   } else {
      initProviderCarousel();
   }
   
   function initProviderCarousel() {
      var providerCarousel = document.querySelector('.tp-provider-compare__slider');
      if (!providerCarousel) return;
      
      var providerSwiper = new Swiper('.tp-provider-compare__slider', {
         slidesPerView: 1,
         spaceBetween: 30,
         loop: true,
         autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
         },
         speed: 800,
         effect: 'slide',
         grabCursor: true,
         breakpoints: {
            320: {
               slidesPerView: 1,
               spaceBetween: 15
            },
            576: {
               slidesPerView: 1,
               spaceBetween: 20
            },
            768: {
               slidesPerView: 2,
               spaceBetween: 25
            },
            992: {
               slidesPerView: 2,
               spaceBetween: 30
            },
            1200: {
               slidesPerView: 3,
               spaceBetween: 30
            },
            1400: {
               slidesPerView: 3,
               spaceBetween: 35
            }
         },
         navigation: {
            nextEl: '.tp-provider-compare__nav-next',
            prevEl: '.tp-provider-compare__nav-prev',
         },
         pagination: {
            el: '.tp-provider-compare__pagination',
            clickable: true,
            dynamicBullets: true
         },
         on: {
            init: function() {
               // Add active class to center slide on init
               updateActiveCard(this);
            },
            slideChange: function() {
               updateActiveCard(this);
            }
         }
      });
      
      function updateActiveCard(swiper) {
         // Remove active class from all cards
         var cards = document.querySelectorAll('.tp-provider-compare__card');
         cards.forEach(function(card) {
            card.classList.remove('active');
         });
         
         // Add active class to center slide (or first visible on mobile)
         var activeSlide = swiper.slides[swiper.activeIndex];
         if (activeSlide) {
            var card = activeSlide.querySelector('.tp-provider-compare__card');
            if (card) {
               card.classList.add('active');
            }
         }
         
         // On desktop with multiple slides visible, highlight center slide
         if (window.innerWidth >= 1200 && swiper.slides.length > 0) {
            var centerIndex = Math.floor(swiper.slides.length / 2);
            var centerSlide = swiper.slides[swiper.activeIndex];
            if (centerSlide) {
               var centerCard = centerSlide.querySelector('.tp-provider-compare__card');
               if (centerCard) {
                  centerCard.classList.add('active');
               }
            }
         }
      }
      
      // Pause autoplay on hover
      var sliderWrapper = document.querySelector('.tp-provider-compare__slider-wrapper');
      if (sliderWrapper) {
         sliderWrapper.addEventListener('mouseenter', function() {
            providerSwiper.autoplay.stop();
         });
         sliderWrapper.addEventListener('mouseleave', function() {
            providerSwiper.autoplay.start();
         });
      }
      
      // Handle window resize for better responsiveness
      var resizeTimer;
      window.addEventListener('resize', function() {
         clearTimeout(resizeTimer);
         resizeTimer = setTimeout(function() {
            providerSwiper.update();
            updateActiveCard(providerSwiper);
         }, 250);
      });
   }
})();

