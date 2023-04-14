const nav = document.querySelector('.navigation');
const navLink = document.querySelectorAll('.navigation .nav-link');
const productList = document.querySelector('.product-list');
const cardText = document.querySelectorAll('.card-text');
const showMore = document.querySelectorAll('.show-more');
const countItems = document.querySelector('.product-list__items-text');
const changeThemeButton = document.querySelector('#flexSwitchCheckChecked');

const loremText =
  'lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo expedita illum cumque ea unde officiis veniam voluptatum! Iste recusandae, repudiandae beatae ratione laboriosam nostrum ipsadolore odit quod suscipit autem.';

nav.addEventListener('click', navigationHandlerClick);

function navigationHandlerClick(e) {
  if (e.target.matches('.nav-link')) {
    navLink.forEach((element) => {
      if (element.classList.contains('active')) {
        element.classList.remove('active');
        e.target.classList.add('active');
      }
    });
  }
}

async function getCountItems() {
  const res = await fetch('https://picsum.photos/v2/list?page=1&limit=10000')
    .then((res) => res.json())
    .then((data) => data);
  countItems.innerText = `${res.length} items`;
}

getCountItems();

let countOfCards = 2;
const cardObserver = new IntersectionObserver(([entry], observe) => {
  if (entry.isIntersecting) {
    observe.unobserve(entry.target);
    getData(countOfCards++);
  }
}, {});

async function getData(page = 1) {
  const results = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=10`
  )
    .then((response) => response.json())
    .then((data) => data);

  results.forEach(({ author, download_url, url }) => {
    productList.insertAdjacentHTML(
      'beforeend',
      `<li class="card">
        <a href="${url}" class="nav-link ratio " style="--bs-aspect-ratio: 66%;">
          <img
            load="lazy"
            src="${download_url}"
            class="card-img-top"
            alt="${author}"
          />
        </a>
        <div class="card-body d-flex flex-column py-3 px-0">
          <h4 class="card-title fw-bold mb-1 lh-base px-4" >${author}</h4>
          <p class="card-text less mb-2 px-4" >
            <span>
              ${loremText
                .split(' ')
                .slice(0, Math.floor(Math.random() * 25) + 5)
                .join(' ')} 
            </span>
          </p>
          <button type="button" class="show-more mr-auto nav-link px-4 fw-bold">Show more...</button>
          <div class="card-footer d-flex align-items-center bg-transparent mt-auto pb-0 pt-3">
            <button
              type="button"
              class="card-footer__button-save nav-link rounded-3 py-2 px-3 fw-bold"
              >Save to collection
            </button>
            <a href="#" class="card-footer__button-share btn btn-outline-dark rounded-3 py-2 px-3 fw-bold">Share</a>
          </div>
        </div>
      </li>`
    );
  });

  const lastCard = document.querySelector('.card:last-child');
  if (lastCard) {
    cardObserver.observe(lastCard);
  }

  const updatedCardText = document.querySelectorAll('.card-text');
  calcRowCount([...updatedCardText].slice((page - 1) * 10, page * 10));
}

getData();

function calcRowCount(element) {
  element?.forEach((item) => {
    let lineHeight = parseInt(
      window.getComputedStyle(item).getPropertyValue('line-height')
    );
    let itemHeight = item.firstElementChild.offsetHeight;
    let numRows = Math.round(itemHeight / lineHeight);

    if (numRows > 2) {
      item.style.height = `${lineHeight * 2}px`;

      item.nextElementSibling.classList.add('show');
    }

    item.nextElementSibling.addEventListener('click', (e) => {
      if (e.target.innerText === 'Show more...') {
        item.style = '';
        item.classList.remove('less');
        e.target.innerText = 'Show less...';
      } else {
        item.style.height = `${lineHeight * 2}px`;
        item.classList.add('less');
        e.target.innerText = 'Show more...';
      }
    });
  });
}

calcRowCount();

changeThemeButton.addEventListener('click', darkMode);
function darkMode() {
  const body = document.querySelector('.body');
  const wasDarkMode = localStorage.getItem('darkMode') === 'true';

  localStorage.setItem('darkMode', !wasDarkMode);
  body.classList.toggle('dark-mode', !wasDarkMode);
}

document.addEventListener('DOMContentLoaded', onLoad);
function onLoad() {
  let getCheck = localStorage.getItem('darkMode') === 'true';
  changeThemeButton.checked = getCheck;

  document.body.classList.toggle(
    'dark-mode',
    localStorage.getItem('darkMode') === 'true'
  );
}
