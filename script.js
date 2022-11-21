
const sliderModule = (() => {
  const scripts = [
    '//code.jquery.com/jquery-1.11.0.min.js',
    '//code.jquery.com/jquery-migrate-1.2.1.min.js',
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" ,
    "http://gallery.wemakefab.ru/slick/slick.min.js",
    "http://gallery.wemakefab.ru/js/select2/select2.min.js"
  ];

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      let script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = function () {
        resolve(url);
      };
      script.onerror = function () {
        reject(url);
      };
      document.body.appendChild(script);
    });
  }

  function initialization(title, date, tegId, event ) {
    const promises = [];
    scripts.forEach(function (url) {
      promises.push(loadScript(url));
    });

    Promise.all(promises)
      .then(function () {
        GoSliader(title, date, tegId, event);
      })
      .catch(function (script) {
        console.log(script + ' failed to load');
      });
  }

  function GoSliader(title = null, date = null, tegId, event) 
{

  const $head = `
  <link rel="stylesheet" href="http://gallery.wemakefab.ru/slick/slick-theme.css">
  <link rel="stylesheet" href="http://gallery.wemakefab.ru/slick/slick.css">
  <link href="http://gallery.wemakefab.ru/js/select2/select2.min.css" rel="stylesheet" />
  <link href="http://gallery.wemakefab.ru/style.css" rel="stylesheet" type="text/css"></link>`;

  const $sliderContainer = `
    <div class="slider-section">
    <div class="container">
      <h1>${title}<span id="d-year"></span></h1>
    </div>
    <div class="years">
      <span class="years-placeholder">Выбрать год</span>
      <select name="" id="selectYear" class="js-example-basic-single"></select>
    </div>
    <div class="slider-block">
      <div class="container" id="slider-container">
      </div>
    </div>
  </div>`;

  $('head').append($head);
  $('#' + tegId).append($sliderContainer);

  let state = null;
  if(date) {
    if(Array.isArray(date)) {
      var selectedYear = Math.max(date);
    } else {
      var selectedYear = date;
    }
  } else {
    var selectedYear = '';
  }

  const params = `event=${event}`;

  // const urlParams = new URLSearchParams(window.location.search);
  // const params = urlParams.has('event') ? `?event=${urlParams.get('event')}` : '';

  const $targetContainer = $('#slider-container');

  async function getData() {
    try {
      const config = {
        method: 'GET',
        mode: 'no-cors',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        },
        credentials: 'same-origin',
      };
      const paramYear = typeof selectedYear !== 'undefined' && selectedYear !== null ? `&yer=${selectedYear}` : '';
      const response = await axios(`http://gallery.wemakefab.ru/path.php?${params}${paramYear}`, config);
      const { data } = response;
      // console.log(data);
      state = data;
    }  catch (error) {
      console.log(error, 'eeor');
    }
  };

  getData().then(() => {
    renderOptions();
  });

  function renderOptions() {
    if (state === null) return;
    const $select = $('#selectYear');

    if(date) {
      if(Array.isArray(date)) {
        var options = date?.map(item => `<option value=${item}>${item}</option>`);
      } else {
        console.log(date);

        var options = `<option value=${date}>${date}</option>`;
      }
    } else {
      var options = state.yers?.map(item => `<option value=${item}>${item}</option>`);
    }

    $select.append(options);

    $select.val(state.yer).trigger('change');
  }

  $('#slider').slick({
    centerMode: true,
    autoplay: true,
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: false,
          centerMode: false,
          dots: true
        }
      }
    ]
  });

  $('#selectYear').change(event => {

    selectedYear = $(event.currentTarget).val();
    console.log(selectedYear);

    // let $dSelect = $('#d-year');
    // $dSelect.html(selectedYear);

    getData().then(() => {
      let $sliderItems = $('<div class="slider" id="slider"></div>');

      for (let i = 0; i < state.url.length; i++) {
        $sliderItems.append(`<div><img src=${state.url[i]} /></div>`);
      }

      $targetContainer.html($sliderItems);

      $('#slider').slick({
        centerMode: true,
        autoplay: true,
        slidesToShow: 1,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              arrows: false,
              centerMode: false,
              dots: true
            }
          }
        ]
      });

      $('#slider').slick('refresh');

    });

  });

  $('.js-example-basic-single').select2();
}

  return {
    initialization,
  };
})();

