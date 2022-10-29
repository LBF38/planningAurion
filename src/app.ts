require('dotenv').config();
const moment = require('moment');
var axios = require('axios');
var start = moment("2022-10-01");
var end = moment("2022-10-31");
var calendarResponse;

// var data = JSON.stringify({
//   "params": {
//     "date_debut": start.format("YYYY-MM-DD"),
//     "date_fin": end.format("YYYY-MM-DD"),
//   }
// });

var config = {
  method: 'GET',
  url: 'https://formation.ensta-bretagne.fr/mobile/mon_planning',
  headers: {
    'Authorization': 'Bearer ' + process.env.AURION_TOKEN,
    // 'Content-Type': 'application/json',
  },
  params: {
    "date_debut": start.format("YYYY-MM-DD"),
    "date_fin": end.format("YYYY-MM-DD"),
  },
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });