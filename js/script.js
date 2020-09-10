let tabUsers = null;
let tabFavorites = null;

let allUsers = [];
let favoriteUsers = [];

window.addEventListener('load', () => {
  tabUsers = document.querySelector('#tabUsers');
  tabFavorites = document.querySelector('#tabFavorites');
  busca = document.querySelector('#busca');
  countUsers = document.querySelector('#countUsers');
  countFavUsers = document.querySelector('#countFavUsers');
  totalAge = document.querySelector('#totalAge');
  totalFavAge = document.querySelector('#totalFavAge');
  avgTotalAgeAvg = document.querySelector('#avgTotalAgeAvg');
  divtotalMasc = document.querySelector('#divtotalMasc');
  numberFormat = Intl.NumberFormat('pt-BR');
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfottps://restcountries.eu/rest/v2/all'
  );
  const json = await res.json();
  allUsers = json.results.map((user) => {
    const { login, name, dob, picture, gender } = user;

    return {
      id: login.uuid,
      first_name: name.first,
      last_name: name.last,
      age: dob.age,
      photo: picture.thumbnail,
      full_name: name.first + ' ' + name.last,
      gender,
    };
  });

  render();
}

function render() {
  renderNonFavorites();
  renderFavorites();
  renderSummary();
  handleUsersButtons();
}

busca.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    allUsers = allUsers.filter((user) => {
      var google = event.target.value.toLowerCase();

      return user.full_name.toLowerCase().indexOf(google) != -1;
    });
    render();
  }
});

function renderSummary() {
  countUsers.textContent = allUsers.length;
  countFavUsers.textContent = favoriteUsers.length;

  const totalAgeSum = allUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const totalAgeAvg =
    allUsers.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0) / allUsers.length;

  const totalMasc = allUsers.reduce((accumulator, current) => {
    console.log(current);
    return current.gender === 'male' ? accumulator + 1 : accumulator;
  }, 0);

  totalAge.textContent = formatNumber(totalAgeSum);
  avgTotalAgeAvg.textContent = formatNumber(totalAgeAvg);
  divtotalMasc.textContent = formatNumber(totalMasc);
}

function renderNonFavorites() {
  // testar o event aqui no rendernonfavorites para filtrar os usuários pela letra do nome

  let usersHTML = '<div>';

  allUsers.forEach((user) => {
    const { id, first_name, last_name, age, photo } = user;

    const countryHTML = `
      <div class='user'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn">+</a>
        </div>
        <div>
          <img src="${photo}" >
        </div>
        <div>
          <ul>
            <li>${first_name} ${last_name}, ${age} anos</li>
          </ul>
        </div>
      </div>  
    `;

    usersHTML += countryHTML;
  });

  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteUsers.forEach((user) => {
    const { id, first_name, last_name, age, photo } = user;

    const favoriteUsersHTML = `
    <div class='user'>
    <div>
      <a id="${id}" class="waves-effect waves-light btn">+</a>
    </div>
    <div>
      <img src="${photo}" >
    </div>
    <div>
      <ul>
        <li>${first_name} ${last_name}, ${age} anos</li>
      </ul>
    </div>
  </div>  
`;

    favoritesHTML += favoriteUsersHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function handleUsersButtons() {
  const userButtons = Array.from(tabUsers.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  userButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const userToAdd = allUsers.find((user) => user.id === id);

  favoriteUsers = [...favoriteUsers, userToAdd];

  favoriteUsers.sort((a, b) => {
    a_full_name = a.first_name + ' ' + a.last_name;
    b_full_name = b.first_name + ' ' + b.last_name;
    return a_full_name.localeCompare(b_full_name);
  });

  allUsers = allUsers.filter((user) => user.id !== id);

  render();
}

function removeFromFavorites(id) {
  const userToRemove = favoriteUsers.find((user) => user.id === id);

  allUsers = [...allUsers, userToRemove];

  favoriteUsers.sort((a, b) => {
    a_full_name = a.first_name + ' ' + a.last_name;
    b_full_name = b.first_name + ' ' + b.last_name;
    return a_full_name.localeCompare(b_full_name);
  });

  favoriteUsers = favoriteUsers.filter((user) => user.id !== id);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
