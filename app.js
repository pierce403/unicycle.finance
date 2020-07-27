let uniswapData = [];

let uniswapDays = [];
let seriesNames = [];
let thisDate = new Date();
for(let x=0;x<14;++x)
{
    uniswapDays.unshift(thisDate.getMonth()+1+"/"+thisDate.getDate());
    thisDate.setDate(thisDate.getDate() - 1);
}

let scope;
let displayedCount=0;

doGraphQL();

angular.module("app", ["chart.js"]).controller("LineCtrl", function ($scope) {
    scope=$scope;
    $scope.labels = uniswapDays;
    $scope.series = seriesNames;
    $scope.data = uniswapData;
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }, {
        yAxisID: 'y-axis-2'
    }];
    $scope.options = {
        scales: {
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
});

function doGraphQL() {
    let rightnow = Math.round(new Date().getTime()/1000);
    let today = rightnow - rightnow%86400;
    
    var query = `query {
        pairDayDatas(first: 10, where:{date:`+today+`}, orderBy:dailyVolumeUSD, orderDirection:desc) {
            pairAddress
            token0{
                symbol
              }
              token1{
                symbol
              }
        }
    }`;

    fetch('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
            })
        })
        .then(r => r.json())
        //.then(data => console.log('data returned:', data));
        .then(function (data) {
            console.log('data returned:', data);

            uniswapData[0] = [];
            console.log(data);
            for (entry in data['data']['pairDayDatas']) {
                let token0 = data['data']['pairDayDatas'][entry]['token0']['symbol'];
                let token1 = data['data']['pairDayDatas'][entry]['token1']['symbol'];
                seriesNames.push(token0+'/'+token1);
                console.log(token0+'/'+token1)
                getProfits(data['data']['pairDayDatas'][entry]['pairAddress'],entry,token0+'/'+token1);
                console.log("addr is "+data['data']['pairDayDatas'][entry]['pairAddress']);
            }
        }).then(function () {
            //scope.$apply();
        });
}

function getProfits(addr,number) {
    var query = `query {
            pairDayDatas(where:{pairAddress: "`+addr+`"}, orderBy:date, orderDirection:desc, first:14)
              {
                id
                date
                dailyVolumeUSD
                reserveUSD
                token0{
                    symbol
                  }
                  token1{
                    symbol
                  }
              }
            }
      `;

    fetch('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
            })
        })
        .then(r => r.json())
        //.then(data => console.log('data returned:', data));
        .then(function (data) {
            console.log('data returned:', data);

            try
            {
            let token0 = data['data']['pairDayDatas'][entry]['token0']['symbol'];
            let token1 = data['data']['pairDayDatas'][entry]['token1']['symbol'];
            console.log("pair: "+token0+'/'+token1);
            }
            catch(err)
            {
                console.log(err);
            }
            //uniswapDays=[];

            uniswapData[number] = [];
            for (entry in data['data']['pairDayDatas']) {
                let vol = data['data']['pairDayDatas'][entry]['dailyVolumeUSD'];
                let liq = data['data']['pairDayDatas'][entry]['reserveUSD'];
                let ryr = vol*0.003/liq*100*365 // relative yearly returns;
                console.log(ryr);
                uniswapData[number].unshift(ryr);
            }

            console.log(uniswapData[number].length);
            // pad some zeroes for the really new stuff
            while(uniswapData[number].length<14)uniswapData[number].unshift(0);

        }).then(function () {
            //scope.$apply();
            displayedCount++;
            if(displayedCount===uniswapData.length)
            {
                scope.$apply();
            }
        });
}