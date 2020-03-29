var companyOneObj,companyOneObj;

window.onload = function () {

 var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
var companyOneName,companyTwoName;
var companyOneTicker, companyTwoTicker;
var oneDone=0, twoDone=0;
	$.getJSON("mapping.json", function(res) {
  for (i = 0; i<res.Records.length; i++){
	
	 if (res.Records[i].Name.toLowerCase().includes(data.companyOne.toLowerCase().split("+", 1)) && !oneDone){
		oneDone = 1;
		companyOneName = res.Records[i].Name;	
		companyOneTicker = res.Records[i].Ticker;
	 }
	else if (res.Records[i].Ticker.toLowerCase().includes(data.companyOne.toLowerCase()) && !oneDone) {
		oneDone = 1;
		companyOneName = res.Records[i].Name;
		companyOneTicker = res.Records[i].Ticker;
		}
	if (res.Records[i].Name.toLowerCase().includes(data.companyTwo.toLowerCase().split("+", 1)) && !twoDone ){
		twoDone = 1;
		companyTwoName = res.Records[i].Name;
		companyTwoTicker = res.Records[i].Ticker;
	 }
	else if (res.Records[i].Ticker.toLowerCase().includes(data.companyTwo.toLowerCase()) && !twoDone) {
		twoDone = 1;
		companyTwoName = res.Records[i].Name;
		companyTwoTicker = res.Records[i].Ticker;
	}
  }
  
  if (companyOneName != null && companyTwoName != null) {
	document.getElementById('cname').innerHTML = companyOneName + " vs " + companyTwoName;
	document.getElementById("navBar").style.visibility = "visible";
document.getElementById('logo').src = "https://logo.clearbit.com/"+data.companyOne.toLowerCase().split("+", 1)+".com";
	document.getElementById('logo2').src = "https://logo.clearbit.com/"+data.companyTwo.toLowerCase().split("+", 1)+".com";
	getData(companyOneTicker,companyTwoTicker);
  }else {
	console.log("Invalid user input");
	  
	window.history.back();
  }
});

}
function getData(companyOne,companyTwo){
	var apiOne = "https://www.quandl.com/api/v3/datasets/WIKI/"+companyOne+".json?rows=7&api_key=dBzpDKhzBgcGovsMFx-f";
	var apiTwo = "https://www.quandl.com/api/v3/datasets/WIKI/"+companyTwo+".json?rows=7&api_key=dBzpDKhzBgcGovsMFx-f";
	var xmlhttp = new XMLHttpRequest();
	var xmlhttp2 = new XMLHttpRequest();
	var resp;
	var resp2;
	
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){	
		resp = JSON.parse(xmlhttp.responseText);

		xmlhttp2.onreadystatechange = function(){
		if (xmlhttp2.readyState == XMLHttpRequest.DONE && xmlhttp2.status == 200){	
		resp2 = JSON.parse(xmlhttp2.responseText);
		
		document.getElementById('highhighTitle').innerHTML = "Stock High/Low Comparison Over The Past Week";
		
		// 7 day high lows soon to be 7 day high vs high
			var canvas = document.getElementById('highhigh');
			var data = {
			labels: [resp.dataset.data[0][0], resp.dataset.data[1][0], resp.dataset.data[2][0],resp.dataset.data[3][0],resp.dataset.data[4][0],resp.dataset.data[5][0],resp.dataset.data[6][0],],
			datasets: [
        {
            label: companyOne + " High",
            backgroundColor: "rgba(38,36,39,0.8)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(38,36,32,0.7)",
            hoverBorderColor: "rgba(38,36,32,1)",
            data: [resp.dataset.data[0][2], resp.dataset.data[1][2], resp.dataset.data[2][2],resp.dataset.data[3][2],resp.dataset.data[4][2],resp.dataset.data[5][2],resp.dataset.data[6][2]],
        },
		 {
            label: companyTwo + " High" ,
            backgroundColor: "rgba(38,36,39,0.2)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(38,36,32,0.4)",
            hoverBorderColor: "rgba(38,36,32,1)",
			data: [resp2.dataset.data[0][2], resp2.dataset.data[1][2], resp2.dataset.data[2][2],resp2.dataset.data[3][2],resp2.dataset.data[4][2],resp2.dataset.data[5][2],resp2.dataset.data[6][2]],
     		},
			      {
            label: companyOne + " Low",
            backgroundColor: "rgba(38,36,39,0.8)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(38,36,32,0.7)",
            hoverBorderColor: "rgba(38,36,32,1)",
            data: [resp.dataset.data[0][3], resp.dataset.data[1][3], resp.dataset.data[2][3],resp.dataset.data[3][3],resp.dataset.data[4][3],resp.dataset.data[5][3],resp.dataset.data[6][3]],
			},
		 {
            label: companyTwo + " Low" ,
            backgroundColor: "rgba(38,36,39,0.2)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(38,36,32,0.4)",
            hoverBorderColor: "rgba(38,36,32,1)",
			 data: [resp2.dataset.data[0][3], resp2.dataset.data[1][3], resp2.dataset.data[2][3],resp2.dataset.data[3][3],resp2.dataset.data[4][3],resp2.dataset.data[5][3],resp2.dataset.data[6][3]],
			}
		
			]
		};
			var option = {
				responsive: true,
				animation: {
				duration:2000
			}

		};
		var highhighgraph = Chart.Bar(canvas,{
			
			data:data,
			options:option
			});
		
		// volumeCompare
		document.getElementById('volumeTitle').innerHTML = "Stock Volume Over The Past Week";
			
		var canvas2 = document.getElementById('volume');
		var data2 = {
			labels: [resp.dataset.data[0][0], resp.dataset.data[1][0], resp.dataset.data[2][0],resp.dataset.data[3][0],resp.dataset.data[4][0],resp.dataset.data[5][0],resp.dataset.data[6][0]],
			datasets: [
        {
            label: companyOne + " Volume",
            backgroundColor: "rgba(38,36,39,0.8)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(38,36,32,0.7)",
            hoverBorderColor: "rgba(38,36,32,1)",
            data: [resp.dataset.data[0][12], resp.dataset.data[1][12], resp.dataset.data[2][12],resp.dataset.data[3][12],resp.dataset.data[4][12],resp.dataset.data[5][12],resp.dataset.data[6][12]],
        },
	   {
            label: companyTwo + " Volume",
			backgroundColor: "rgba(38,36,39,0.2)",
            borderColor: "rgba(38,36,36,1)",
            borderWidth: 2,
            backgroundColor: "rgba(38,36,39,0.2)",
            borderColor: "rgba(38,36,36,1)",
            data: [resp2.dataset.data[0][12], resp2.dataset.data[1][12], resp2.dataset.data[2][12],resp2.dataset.data[3][12],resp2.dataset.data[4][12],resp2.dataset.data[5][12],resp2.dataset.data[6][12]],
        }
			]
					};
			option = {
				responsive: true,
				animation: {
				duration:2000
			}

	};
		var linegraph = Chart.Line(canvas2,{
			data:data2,
			options:option
		});
		document.getElementById('lastDayTitle').innerHTML = "Stock Prices Over The Last Day";
	
		// 
		var lastdaygraph = document.getElementById("lastday").getContext("2d");
		var data3 = {
			labels: [companyOne + " " + resp.dataset.column_names[1], companyTwo + " " + resp2.dataset.column_names[1]
			,companyOne + " " + resp.dataset.column_names[2],companyTwo + " " + resp2.dataset.column_names[2],
			companyOne + " " + resp.dataset.column_names[3],companyTwo + " " + resp2.dataset.column_names[3],
			companyOne + " " + resp.dataset.column_names[4],companyTwo + " " + resp2.dataset.column_names[4]],
			datasets: [{
			label: "in USD",
			data: [resp.dataset.data[0][1],resp2.dataset.data[0][1], resp.dataset.data[0][2],resp2.dataset.data[0][2], resp.dataset.data[0][3],resp2.dataset.data[0][3], resp.dataset.data[0][4],resp2.dataset.data[0][4]],
			backgroundColor: ["#111111","#d3d3d3", "#111111","#d3d3d3","#111111","#d3d3d3","#111111","#d3d3d3"],
			hoverBackgroundColor: ["#333333","#333333","#333333","#333333"]
			}]
		};

		var lastdaychart = new Chart(lastdaygraph, {
			type: 'horizontalBar',
			data: data3,
			options: {
			scales: {
            xAxes: [{
                ticks: {					
                }
            }],
            yAxes: [{
            	stacked: true
            }]
			}
		}
	});
		
		
		
		
		
		
		
		
		
		
		
		
		}}
	xmlhttp2.open("GET", apiTwo, true);
	xmlhttp2.send();
	}}
	
	xmlhttp.open("GET", apiOne, true);
	xmlhttp.send();
	


}

