let uniswapData = [
    [65, 59, 80, 81, 56, 55, 40]
]

let scope;

doGraphQL();

angular.module("app", ["chart.js"]).controller("LineCtrl", function ($scope) {
    scope=$scope;
    $scope.labels = ["M", "T", "W", "Th", "F", "Sa", "S", "M", "T", "W", "Th", "F", "Sa", "S"];
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
        exchangeDayDatas(where:{exchangeAddress: "0x97dec872013f6b5fb443861090ad931542878126"}, orderBy:date, orderDirection:desc, first:14)
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
            uniswapData[0] = [];
            for (entry in data['data']['exchangeDayDatas']) {
                console.log(data['data']['exchangeDayDatas'][entry]['ethVolume']);
                uniswapData[0][entry] = data['data']['exchangeDayDatas'][entry]['ethVolume']
            }
        }).then(function () {
            scope.$apply();
        });
}