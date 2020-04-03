(function () {
  // new 變數
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + `/api/v1/movies/`
  const POSTER_URL = BASE_URL + '/posters/'
  //建立容器
  const data = []
  //要做渲染
  const dataPanel = document.getElementById('data-panel')
  // 搜尋用
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  //計算頁數
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  let paginationData = []

  //分頁用
  const modeSelector = document.querySelector('#mode-selector')
  //用於modeConditionCard or modeConditionList
  let modeCondition = "modeConditionCard"
  //當前頁面
  let nowPage = "1"
  //nowData
  let nowData = []

  //......................................................................

  //   write your code here 
  //索取API
  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      // console.log(response.data.results)
      // console.log(data)
      // console.log(data.length)
      getTotalPages(data)
      // displayDataList(data)
      let paginationData = []

    })
    .catch((err) => console.log(err))

  //datapanel的監聽器
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      // console.log(event.target)
      // console.log(event.target.dataset.id)  // modify here
      showMovie(event.target.dataset.id)  // modify here


    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search form submit event
  //searchForm的監聽器
  searchForm.addEventListener('submit', event => {
    // 讓動作停下來
    event.preventDefault()
    // console.log('click!')
    let input = searchInput.value
    let results = data.filter(
      // movie => movie.title === input
      movie => movie.title.toLowerCase().includes(input)
    )
    console.log(results)
    // displayDataList(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      //紀錄轉換的頁數
      nowPage = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })


  // listen to mode selector
  modeSelector.addEventListener("click", function (e) {
    if (e.target.matches("#mode-card")) {
      modeCondition = "modeConditionCard";
      // 轉換時以目前頁數進行轉換，而不是回到第1頁
      getPageData(nowPage, nowData);
    } else if (e.target.matches("#mode-list")) {
      modeCondition = "modeConditionList";
      // 轉換時以目前頁數進行轉換，而不是回到第1頁
      getPageData(nowPage, nowData);
    }
  });


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }




  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `

    })
    dataPanel.innerHTML = htmlContent


  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //加入我的最愛清單
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }



})()





