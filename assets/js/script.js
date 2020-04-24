const maskURL = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=';
const input = document.getElementById('input');
const button = document.getElementById('button');
const list = document.getElementById('list');
const googleMap = document.getElementById('googleMap');
var map;
var jsonData;

// Initialize googleMap
function initMap() {
  // center coordinate of Korea
  var centerofKorea = { lat: 35.95, lng: 128.24 };
  // set center of the map at centerofKorea.
  map = new google.maps.Map(googleMap, {
    zoom: 7,
    center: centerofKorea
  });
}

// button이 눌렸을때 동작
function getInputData() {
  $(list).empty(); // list 데이터 삭제하는 이유?
  var addr = "";
  if (input.value == "") {
    addr = "부산광역시 금정구 구서동";
  } else {
    addr = input.value;
  }
  var queryURL = maskURL + addr;
  var data = sendHttpRequest('GET', queryURL);
}

var sendHttpRequest = (method, url) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.responseType = 'json' // json 형식의 데이터를 가져온다.
  xhr.onload = () => {
    const data = xhr.response;
    const stores = data.stores; // data에서 key가 stores인 것만 가져온다.
    jsonData = stores;
    addList(stores);
    addMarker(stores);
  };
  xhr.send();
};

function addList(jsonObject) {
  for (var i = 0; i < jsonObject.length; ++i) {
    var temp = document.createElement("ul");
    temp.setAttribute("style", "padding:0; margin:0;");

    var color = "";
    if(jsonObject[i].remain_stat=="plenty") color = "list-group-item-success";
    else if(jsonObject[i].remain_stat=="some") color = "list-group-item-warning";
    else if(jsonObject[i].remain_stat=="few") color = "list-group-item-danger";
    else if(jsonObject[i].remain_stat=="empty") color = "list-group-item-dark";
    else color = "list-group-item-light";

    temp.innerHTML = "<li class='list-group-item "+color+"' style='width:300px; float: left;'>" + jsonObject[i].name + "</li>";
    temp.innerHTML += "<button type='button' class='btn btn-light' style='width:100px; float: left;' id='moreinfoBtn"+i+"'>상세정보</button>";
    temp.innerHTML += "<button type='button' class='btn btn-light' style='width:100px; float: left;' id='locationBtn"+i+"'>위치</button>";
    list.appendChild(temp);

    var moreinfoBtn = document.getElementById('moreinfoBtn'+i);
    moreinfoBtn.addEventListener('click', getMoreInfo);
    var locationBtn = document.getElementById('locationBtn'+i);
    locationBtn.addEventListener('click', changeLocation);
  }
}

function getMoreInfo(){
  var index = $(this).parent().index();
  window.alert("이름: "+jsonData[index].name
  +"\n주소: "+jsonData[index].addr
  +"\n입고시간: "+jsonData[index].stock_at
  +"\n판매처 유형: "+getType(jsonData[index].type)
  +"\n식별코드: "+jsonData[index].code);
}

function getType(typecode){
  var type = "";
  if(typecode=="01") type="약국";
  else if(typecode=="02") type="우체국";
  else type="농협";

  return type;
}

function changeLocation(){
  var index = $(this).parent().index();
  var center = { lat: jsonData[index].lat, lng: jsonData[index].lng };
	map.panTo(center);
  map.setZoom(19);
}

function addMarker(jsonObject) {
  // 첫번째 약국을 지도의 중심으로 변경한다.
  var center = { lat: jsonObject[0].lat, lng: jsonObject[0].lng };
  map.panTo(center);
  map.setZoom(15);
  // 약국 위치를 지도에 마커로 추가
  for (var i = 0; i < jsonObject.length; ++i) {
    var places = { lat: jsonObject[i].lat, lng: jsonObject[i].lng };
    var marker = new google.maps.Marker({
      position: places,
      map: map,
      label: jsonObject[i].name
    });
  }
}

button.addEventListener('click', getInputData);
