var companyName, companySrc, companyTicker, resp;
window.onload = function () {
	var url = document.location.href
		, params = url.split('?')[1].split('&')
		, data = {}
		, tmp;
	for (var i = 0, l = params.length; i < l; i++) {
		tmp = params[i].split('=');
		data[tmp[0]] = tmp[1];
	}
	$.getJSON("mapping.json", function (res) {
		
		for (i = 0; i < res.Records.length; i++) {
			if (res.Records[i].Name.toLowerCase().includes(data.company.toLowerCase().split("+", 1))) {
				companyTicker = res.Records[i].Ticker;
				companyName = res.Records[i].Name;
				companySrc = "https://logo.clearbit.com/" + res.Records[i].Name.split(" ", 1) + ".com";
				break;
			}
			else if (res.Records[i].Ticker.toLowerCase().includes(data.company.toLowerCase())) {
				companyTicker = res.Records[i].Ticker;
				companyName = res.Records[i].Name;
				companySrc = "https://logo.clearbit.com/" + res.Records[i].Name.split(" ", 1) + ".com";
				break;
			}
		}
		if (companyName != null) {
			document.getElementsByClassName('search')[0].value = companyName;
			document.getElementById('cname').innerHTML = companyName;
			document.getElementById('companyOne').value = companyName;
			document.getElementById("CompareWith").style.visibility = "visible";
			document.getElementById("navBar").style.visibility = "visible";
			document.getElementById('logo').src = companySrc;
			getData(companyTicker);
			getNews(companyName.toLowerCase());
		}
		else {
			console.log("Invalid Option");
			window.history.back();
		}
	});
}

function getData(company) {
	var api = "https://www.quandl.com/api/v3/datasets/WIKI/" + company + ".json?&api_key=dBzpDKhzBgcGovsMFx-f";
	var xmlhttp = new XMLHttpRequest();
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
			resp = JSON.parse(xmlhttp.responseText);
			//["Date","Open","High","Low","Close","Volume","Ex-Dividend","Split Ratio","Adj. Open","Adj. High","Adj. Low","Adj. Close","Adj. Volume"]
			//7 day high/low
			document.getElementById('highlowTitle').innerHTML = "Stock High/Low Comparison Over The Past Week";
			var canvas = document.getElementById('highlow');
			var data = {
				labels: [resp.dataset.data[6][0], resp.dataset.data[5][0], resp.dataset.data[4][0], resp.dataset.data[3][0], resp.dataset.data[2][0], resp.dataset.data[1][0], resp.dataset.data[0][0]]
				, datasets: [
					
				{
						label: "Average"
						, type:'line'
						, backgroundColor: "rgba(56, 40, 160,0.1)"
						, borderColor: "rgba(56, 40, 160,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(56, 40, 160,0.7)"
						, hoverBorderColor: "rgba(56, 40, 160,1)"
						, data: [(resp.dataset.data[6][3] + resp.dataset.data[6][2])/2, (resp.dataset.data[5][3] + resp.dataset.data[5][2])/2,(resp.dataset.data[4][3] + resp.dataset.data[4][2])/2,(resp.dataset.data[3][3] + resp.dataset.data[3][2])/2,(resp.dataset.data[2][3] + resp.dataset.data[2][2])/2,(resp.dataset.data[1][3] + resp.dataset.data[1][2])/2,(resp.dataset.data[0][3]+ resp.dataset.data[0][2])/2]
        , },
					{
						label: "High"
						, backgroundColor: "rgba(74, 102, 68,1)"
						, borderColor: "rgba(74, 102, 68,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(74, 102, 68,0.7)"
						, hoverBorderColor: "rgba(74, 102, 68,1)"
						, data: [resp.dataset.data[6][2], resp.dataset.data[5][2], resp.dataset.data[4][2], resp.dataset.data[3][2], resp.dataset.data[2][2], resp.dataset.data[1][2], resp.dataset.data[0][2]]
        , }
					, {
						label: "Low"
						, backgroundColor: "rgba(239, 82, 67, 1)"
						, borderColor: "rgba(239, 82, 67,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(239, 82, 67,0.7)"
						, hoverBorderColor: "rgba(239, 82, 67,1)"
						, data: [resp.dataset.data[6][3], resp.dataset.data[5][3], resp.dataset.data[4][3], resp.dataset.data[3][3], resp.dataset.data[2][3], resp.dataset.data[1][3], resp.dataset.data[0][3]]
				, }
			
			]
			};
			var option = {
				responsive: true
				, animation: {
					duration: 2000
				}
			};
			var highlowgraph = Chart.Bar(canvas, {
				data: data
				, options: option
			});
			document.getElementById('volumeTitle').innerHTML = "Stock Volume Over The Past Week";
			//7 day volume
			var canvas2 = document.getElementById('volume');
			var data2 = {
				labels: [resp.dataset.data[6][0], resp.dataset.data[5][0], resp.dataset.data[4][0], resp.dataset.data[3][0], resp.dataset.data[2][0], resp.dataset.data[1][0], resp.dataset.data[0][0]]
				, datasets: [
					{
						label: "Volume"
						, backgroundColor: "rgba(56, 40, 160,0.8)"
						, borderColor: "rgba(56, 40, 160,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(56, 40, 160,0.7)"
						, hoverBorderColor: "rgba(56, 40, 160,1)"
						, data: [resp.dataset.data[6][12], resp.dataset.data[5][12], resp.dataset.data[4][12], resp.dataset.data[3][12], resp.dataset.data[2][12], resp.dataset.data[1][12], resp.dataset.data[0][12]]
        , }

			]
			};
			option = {
				responsive: true
				, animation: {
					duration: 2000
				}
			};
			
			document.getElementById('lastDayTitle').innerHTML = "Stock Prices Over The Last Day";
			var linegraph = Chart.Line(canvas2, {
				data: data2
				, options: option
			});
			//
			//7 day close
			var slope = (resp.dataset.data[0][11] - resp.dataset.data[14][4])/13;
			if (slope < 0){
				slope = slope * -1;
			}
			else{
				slope = slope + 1;
			}
			var canvas3 = document.getElementById('adjclose');
			var data3 = {
				labels: [resp.dataset.data[14][0], resp.dataset.data[13][0]
			, resp.dataset.data[12][0], resp.dataset.data[11][0]
			, resp.dataset.data[10][0], resp.dataset.data[9][0]
			, resp.dataset.data[8][0], resp.dataset.data[7][0]
			, resp.dataset.data[6][0], resp.dataset.data[5][0]
			, resp.dataset.data[4][0], resp.dataset.data[3][0]
			, resp.dataset.data[2][0], resp.dataset.data[1][0]
			, resp.dataset.data[0][0]]
				, datasets: [
					{
						label: "Close price"
						, backgroundColor: "rgba(0,0,0,0)"
						, borderColor: "rgba(255, 2, 15,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(255, 2, 15,0.7)"
						, hoverBorderColor: "rgba(255, 2, 15,0.6)"
						, data: [resp.dataset.data[14][4], resp.dataset.data[13][4]
			, resp.dataset.data[12][4], resp.dataset.data[11][4]
			, resp.dataset.data[10][4], resp.dataset.data[9][4]
			, resp.dataset.data[8][4], resp.dataset.data[7][4]
			, resp.dataset.data[6][4], resp.dataset.data[5][4]
			, resp.dataset.data[4][4], resp.dataset.data[3][4]
			, resp.dataset.data[2][4], resp.dataset.data[1][4], resp.dataset.data[0][4]]
        , }
					, {
						label: "Adj Close price"
						, backgroundColor: "rgba(255,255,255,0)"
						, borderColor: "rgba(13, 68, 66,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(13, 68, 66,0.7)"
						, hoverBorderColor: "rgba(13, 68, 66,1)"
						, data: [resp.dataset.data[14][11], resp.dataset.data[13][11]
			, resp.dataset.data[12][11], resp.dataset.data[11][11]
			, resp.dataset.data[10][11], resp.dataset.data[9][11]
			, resp.dataset.data[8][11], resp.dataset.data[7][11]
			, resp.dataset.data[6][11], resp.dataset.data[5][1]
			, resp.dataset.data[4][11], resp.dataset.data[3][11]
			, resp.dataset.data[2][11], resp.dataset.data[1][11], resp.dataset.data[0][11]]
        , }
		, {
						label: "Adj Close price Slope"
						, backgroundColor: "rgba(255,255,255,0)"
						, borderColor: "rgba(43, 168, 66,1)"
						, borderWidth: 2
						, hoverBackgroundColor: "rgba(43, 168, 66,0.7)"
						, hoverBorderColor: "rgba(43, 68, 66,1)"
						, data: [resp.dataset.data[14][11], resp.dataset.data[14][11]+slope
			, resp.dataset.data[14][11]+slope*2, resp.dataset.data[14][11]+slope*3
			, resp.dataset.data[14][11]+slope*4, resp.dataset.data[14][11]+slope*5
			, resp.dataset.data[14][11]+slope*6, resp.dataset.data[14][11]+slope*7
			, resp.dataset.data[14][11]+slope*8, resp.dataset.data[14][11]+slope*9
			, resp.dataset.data[14][11]+slope*10, resp.dataset.data[14][11]+slope*11
			, resp.dataset.data[14][11]+slope*12, resp.dataset.data[14][11]+slope*13, resp.dataset.data[14][11]+slope*14]
        , }

			]
			};
			option = {
				responsive: true
				, animation: {
					duration: 2000
				}
				
			};
			
			var linegraph2 = Chart.Line(canvas3, {
				data: data3
				, options: option
			});
			//
			document.getElementById('open').innerHTML = resp.dataset.data[0][1];
			document.getElementById('high').innerHTML = resp.dataset.data[0][2];
			document.getElementById('low').innerHTML = resp.dataset.data[0][3];
			document.getElementById('close').innerHTML = resp.dataset.data[0][4];
			var lastdaygraph = document.getElementById("lastday").getContext("2d");
			var data3 = {
				labels: [resp.dataset.column_names[1], resp.dataset.column_names[2], resp.dataset.column_names[3], resp.dataset.column_names[4]]
				, datasets: [{
					label: "in USD"
					, data: [resp.dataset.data[0][1], resp.dataset.data[0][2], resp.dataset.data[0][3], resp.dataset.data[0][4]]
					, backgroundColor: ["#fc7c05", "#fc7c05", "#fc7c05", "#fc7c05"]
					, hoverBackgroundColor: ["#ff9635", "#ff9635", "#ff9635", "#ff9635"]
			}]
			};
			var lastdaychart = new Chart(lastdaygraph, {
				type: 'horizontalBar'
				, data: data3
				, options: {
					scales: {
						xAxes: [{
							ticks: {}
            }]
						, yAxes: [{
							stacked: true
            }]
					}
				}
			});
			var summary;
			var change = (resp.dataset.data[6][3] - resp.dataset.data[5][3] - resp.dataset.data[4][3] - resp.dataset.data[3][3] - resp.dataset.data[2][3] - resp.dataset.data[1][3] - resp.dataset.data[0][3])
			if (change > 0) {
				summmary = "The average change in stock for the past seven days is" + change + ", therefore increasing";
			}
			else {
				summmary = "The average change in stock for the past seven days is" + change + ", therefore decreasing";
			}
			//document.getElementById("summary").innerHTML = summary;
			var percep=Perceptron();
			if(percep){
				if(percep==0)
					document.getElementById("perceptronTitle").innerHTML = "Tomorrows stock predictor: May be a larger change in stock price tomorrow";
				else if(percep==1)
					document.getElementById("perceptronTitle").innerHTML="Tomorrows stock predictor: May be a larger change in stock price tomorrow";
				else
					document.getElementById("perceptronTitle").innerHTML="There is no prediction at this time";
			}
		}
	}
	xmlhttp.open("GET", api, true);
	xmlhttp.send();
}

function getNews(company) {
	var api = "https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=microsoft&count=10&offset=0&mkt=en-us&safeSearch=Moderate";
	var xmlhttp = new XMLHttpRequest();
	var apiKey = "{467a8fea8f8a459282c5d078084ffd6c}";
	var xmlhttp2 = new XMLHttpRequest();
	var resp;
	$(function () {
		var params = {
			// Request parameters
			"q": company.toString() + "stock"
			, "count": "10"
			, "offset": "0"
			, "mkt": "en-us"
			, "safeSearch": "Moderate"
		, };
		$.ajax({
			url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params)
			, beforeSend: function (xhrObj) {
				// Request headers
				xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "467a8fea8f8a459282c5d078084ffd6c");
			}
			, type: "GET"
			, // Request body
			data: "{body}"
		, }).done(function (data) {
			for (i = 0; i < 6; i++) {
				var url = "\"" + data.value[i].url + "\"";
				var name = data.value[i].name;
				var date = data.value[i].datePublished;
				if (data.value[i].image != null) {
					var imgUrl = data.value[i].image.thumbnail.contentUrl;
					document.getElementsByTagName("section")[i].innerHTML += "<img src=" + imgUrl + " class='news' alt='image'><br>"
				}
				else{
					document.getElementsByTagName("section")[i].innerHTML += "<img src=" + companySrc + " class='news' alt='image'><br>"

				}
				var description = data.value[i].description;
				document.getElementsByTagName("section")[i].innerHTML += "<a  href=" + url + "><p class='ind' id='title'>" + name + "</p></a>"
				document.getElementsByTagName("section")[i].innerHTML += "<p id='desc'>" + description + "</p>";
				document.getElementsByTagName("section")[i].innerHTML += "<p class='date'>" + date + "</p>";
			}
		}).fail(function () {
			//alert("Could not load news articles");
		});
	});
}

function Perceptron() {
    var MAX_ITER = 100;
    var LEARNING_RATE = 0.1;
    var NUM_INSTANCES = 100;
    var theta = 0;
	
    
        var x = new Array(NUM_INSTANCES);
        var y = new Array(NUM_INSTANCES);
        var z = new Array(NUM_INSTANCES);
        var outputs = new Array(NUM_INSTANCES);
        
        for (var i1 = 0; i1 < (NUM_INSTANCES / 2) ; i1++) {
            x[i1] = resp.dataset.data[i1][1];
            y[i1] = resp.dataset.data[i1][2];
            z[i1] = resp.dataset.data[i1][3];
            outputs[i1] = 1;
            //document.write(x[i1] + "\t" + y[i1] + "\t" + outputs[i1]);
        }
        for (var i2 = 50; i2 < (NUM_INSTANCES) ; i2++) {
            x[i2] = resp.dataset.data[i2][1];
            y[i2] = resp.dataset.data[i2][2];
            z[i2] = resp.dataset.data[i2][3];
            outputs[i2] = 1;
            //document.write(x[i2] + "\t" + y[i2] + "\t" + outputs[i2]);
        }
        var weights = new Array(4);
        var localError;
        var globalError;
        var i;
        var p;
        var iteration;
        var output;

        weights[0] = randomNumber(0, 1);
        weights[1] = randomNumber(0, 1);
        weights[2] = randomNumber(0, 1);
        weights[3] = randomNumber(0, 1);
//alert("a");
        iteration = 0;
        do {
            iteration++;
            globalError = 0;
            for (p = 0; p < NUM_INSTANCES;p++){
                output = calculateOutput(theta, weights, x[p], y[p], z[p]);
                localError = outputs[p] - output;
                weights[0] += LEARNING_RATE * localError * x[p];
                weights[1] += LEARNING_RATE * localError * y[p];
                weights[2] += LEARNING_RATE * localError * z[p];
                weights[3] += LEARNING_RATE * localError;
                globalError += (localError * localError);
            }
            //document.write("Iteration " + iteration + " : RMSE  " + Math.sqrt(globalError / NUM_INSTANCES));

        } while (globalError !== 0 && iteration <= MAX_ITER);
        //document.write("\n=======\nDecision boundary equation:");
        //document.write(weights[0] + "*x + " + weights[1] + "*y +  " + weights[2] + "*z + " + weights[3] + " = 0");
        for (var j = 0; j < 10; j++) {
            var x1 = randomNumber(-10, 10);
            var y1 = randomNumber(-10, 10);
            var z1 = randomNumber(-10, 10);
            output = calculateOutput(theta, weights, x1, y1, z1);
            //console.log("\n=======\nNew Random Point:");
            //console.log("x = " + x1 + ",y = " + y1 + ",z = " + z1);
            //console.log("class = " + output);
        }
		return output;
    
}
function randomNumber(min,max){
    var d = min + Math.random() * (max - min);
    //var s = ('' + d);
    //var x = javaemul.internal.DoubleHelper.parseDouble(s);
    return d;
}
function calculateOutput(theta, weights,x,y,z){
    var sum = x* weights[0] + y*weights[1]+z*weights[2]+weights[3];
    return (sum>=theta)?1:0;
}
//getData();
