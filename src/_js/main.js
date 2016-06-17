//= plugins.js

(function($){

  if ($('.carousel-wrap').hasClass('-slick')) {
    $('.carousel-wrap').slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 5,
      slidesToScroll: 2,
      responsive: [
        {
          breakpoint: 999,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 674,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  if ($('.product-colors__slider').hasClass('-slick')) {
    $('.product-colors__slider').slick({
      dots: false,
      infinite: true,
      speed: 400,
      slidesToShow: 4,
      slidesToScroll: 2,
      prevArrow: $('.product-colors__prev'),
      nextArrow: $('.product-colors__next'),
      variableWidth: true,
      responsive: [
        {
          breakpoint: 999,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 674,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  $('.carousel__prev').click(function () {
    $(this).closest('.carousel-container').find('.carousel-wrap').slick('slickPrev');
  });

  $('.carousel__next').click(function () {
    $(this).closest('.carousel-container').find('.carousel-wrap').slick('slickNext');
  });

  if ($('.collection-slider__wrap').hasClass('-slick')) {
    $('.collection-slider__wrap').slick({
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      autoplay: true,
      fade: true,
      cssEase: 'linear'
    });
  }

  if ($('.top-slider__container').hasClass('-slick')) {
    $('.top-slider__container').slick({
      dots: false,
      infinite: true,
      speed: 500,
      autoplay: true,
      fade: true,
      cssEase: 'linear',
      prevArrow: $('.top-slider__prev'),
      nextArrow: $('.top-slider__next')
    });
  }



  if ($('.category-slider__container').hasClass('-slick')) {
    $('.category-slider__container').slick({
      dots: false,
      prevArrow: $ ('.category-slider__prev'),
      nextArrow: $ ('.category-slider__next'),
      slidesToShow: 3,
      centerMode: true,
      centerPadding: '',
      variableWidth: true,
      adaptiveHeight: true
    });
  }


})(jQuery);