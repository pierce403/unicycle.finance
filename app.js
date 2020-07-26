let uniswapData = [];

let uniswapDays = [];//=["1/22", "1/23", "1/24", "1/25", "1/26", "1/27", "1/28", "1/29", "2/1", "2/2", "2/3", "2/4", "2/5", "2/6"];
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
    $scope.series = ['Series A', 'Series B'];
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
    var query = `query {
        exchangeDayDatas(where:{date: 1583452800}, orderBy:ethVolume, orderDirection:desc, first:12)
                  {
                    exchangeAddress
                  }
                }
      `;

    fetch('https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap', {
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
            for (entry in data['data']['exchangeDayDatas']) {
                getProfits(data['data']['exchangeDayDatas'][entry]['exchangeAddress'],entry);
                console.log("addr is "+data['data']['exchangeDayDatas'][entry]['exchangeAddress']);
            }
        }).then(function () {
            //scope.$apply();
        });
}

function getProfits(addr,number) {
    var query = `query {
        exchangeDayDatas(where:{exchangeAddress: "`+addr+`"}, orderBy:date, orderDirection:desc, first:14)
          {
            id
            date
            ethVolume
            ethBalance
          }
        }
      `;

    fetch('https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap', {
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

            console.log("awesome");
            //uniswapDays=[];

            uniswapData[number] = [];
            for (entry in data['data']['exchangeDayDatas']) {
                let vol = data['data']['exchangeDayDatas'][entry]['ethVolume'];
                let liq = data['data']['exchangeDayDatas'][entry]['ethBalance']*2;
                let ryr = vol*0.003/liq*100*365 // relative yearly returns;
                console.log(ryr);
                uniswapData[number].unshift(ryr);
            }
        }).then(function () {
            //scope.$apply();
            displayedCount++;
            if(displayedCount===uniswapData.length)
            {
                scope.$apply();
            }
        });
}