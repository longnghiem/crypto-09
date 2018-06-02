let fetched_data;
let sorted_state = "";
let filtered_coins;
const input_search = document.getElementById('input-search');
const table_body = document.getElementById('table-body');
fetch('https://api.coinmarketcap.com/v1/ticker/?limit=2000')
  .then(function(response) {
    return response.json(); //method .json() convert json to javascript. and also it returns another promise
  })
  .then(function(data) { //therefore we have to use another .then, to deal with the promise
    fetched_data = filtered_coins = data;
    sortHandle("rank") //async
  })
  .catch((error)=>{ //optional
    console.log('there is an error: '+ error)
  })


//building the DOM according to the data
function render(display_coins) {
  table_body.innerHTML = "";
  display_coins.forEach((coin) => {
    renderItem(coin);
  });
  document.getElementById('number-of-coins').innerHTML = display_coins.length;
}

function renderItem(coin){
  const coin_as_a_table_row = document.createElement("tr");
  coin_as_a_table_row.classList.add('table-row');

  const name = document.createElement("td");
  name.innerText = coin.name;
  name.classList.add('coin-name');

  const price = document.createElement("td");
  price.innerText = coin.price_usd;

  const rank = document.createElement("td");
  rank.innerText = coin.rank;

  const change = document.createElement("td");
  change.innerText = coin.percent_change_24h;
  (Number(change.innerText) >= 0)
    ? change.classList.add('increase')
    : change.classList.add('decrease')

  coin_as_a_table_row.append(name);
  coin_as_a_table_row.append(price);
  coin_as_a_table_row.append(rank);
  coin_as_a_table_row.append(change);
  table_body.append(coin_as_a_table_row);
};
// SEARCH FUNCTION: listening to keyup event of input
function onInputChange (e){
  filtered_coins = fetched_data.filter(coin =>{
    return coin.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
  })
  sortHandle(sorted_state);
}

//SORT FUNCTION
function sortHandle(type){
  let column = document.getElementById(type);
  if (sorted_state !== type) {
    if (isNaN(filtered_coins[0][type])) {
      filtered_coins.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });
    } else {
      filtered_coins.sort((a,b)=>{
        return a[type] - b[type];
      })
    }
    Array.from(document.getElementsByClassName("arrow")).forEach(function(child) {
      child.classList.remove("hidden");
    });
    column.childNodes.forEach(function(child) {
      if(child.className == "arrow up-arrow") {
        child.classList.add("hidden");
      }
    });
  } else {
    filtered_coins = filtered_coins.reverse();
    document.querySelectorAll("#" + type + " .arrow").forEach(function(child) {
      if(child.classList.contains("hidden")) {
        child.classList.remove("hidden");
      } else {
        child.classList.add("hidden");
      }
    });
  }
  sorted_state = type;
  render(filtered_coins);
}


// function sortHandleNumber(type){
//   if (sorted_state !== type) {
//     filtered_coins.sort((a,b)=>{
//       return a[type] - b[type];
//     })
//   }
//   else {
//     filtered_coins = filtered_coins.reverse();
//   }
//   sorted_state = type;
//   render(filtered_coins);
// }
//
// document.querySelector('.down-arrow').classList.add('hidden')
// function sortHandleString() {
//   if (sorted_state !== "name") {
//     filtered_coins.sort((a, b) => {
//       let nameA = a.name.toUpperCase();
//       let nameB = b.name.toUpperCase();
//       if (nameA < nameB) {
//         return -1;
//       } else {
//         return 1;
//       }
//     });
//   } else {
//     filtered_coins = filtered_coins.reverse();
//   }
//   sorted_state = "name";
//   render(filtered_coins);
//   document.querySelector('.up-arrow').classList.toggle('hidden')
//   document.querySelector('.down-arrow').classList.toggle('hidden')
// }
