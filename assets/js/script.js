const input1 = document.getElementById('input1');
const btn1 = document.getElementById('button1');
const maskURL = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=';
const mylist = document.getElementById('mylist');
var jsonData;

const sendHttpRequest = (method, url) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.responseType = 'json'
  xhr.onload = () => {
    const data = xhr.response;
    const stores = data.stores;
    jsonData = stores;
    addList(stores);
  };
  xhr.send();
};

function addList(jsonObject) {
  for (var i = 0; i < jsonObject.length; ++i) {
    var temp = document.createElement("div");
    temp.setAttribute("style", "padding:0; margin:0;");
    temp.setAttribute("class", "list-group");
    //temp.setAttribute("id","name"+i)
    temp.innerHTML = "<ul class='list-group-item active' id='name"+i+"'>" + jsonObject[i].name + "</ul>";
    //temp.innerHTML = "<li class='list-group-item active' id='name"+i+"'>" + jsonObject[i].name + "</li>";
    //temp.innerHTML = "<li class='list-group-item active'>" + jsonObject[i].name + "</li>";
    mylist.appendChild(temp);
    temp.addEventListener('click', getIndex);
  }
}

function getIndex() {
  var index = $(this).index();
  //console.log(index);
  var parent = document.getElementById("name"+index);
  $(parent).children().remove();
  var temp = document.createElement("li");
  temp.innerHTML = "<li class='list-group-item'>" + jsonData[index].addr + "</li>";
  temp.innerHTML += "<li class='list-group-item'>"+ jsonData[index].code+"</li>";
  temp.innerHTML += "<li class='list-group-item'>"+ jsonData[index].lat+"</li>";
  temp.innerHTML += "<li class='list-group-item'>"+ jsonData[index].lng+"</li>";
  parent.appendChild(temp);
}

function button1() {
  $(mylist).empty();
  jsonData = null;
  var input = "";
  if (input1.value != "") {
    input = input1.value;
  } else {
    input = "부산광역시 금정구";
  }
  var url = maskURL + input;
  var data = sendHttpRequest('GET', encodeURI(url));
}

btn1.addEventListener('click', button1);
