angular.module('purchases',[])
.controller('MainCtrl', [
    '$scope','$http', function($scope,$http) {
        $scope.items = [];
        $scope.list = [];
        $scope.getAll = function() {
            return $http.get('/orders').success(function(data){
                angular.copy(data, $scope.items);
            });
        };
        $scope.getAll();
        $scope.create = function(item) {
            return $http.post('/orders', item).success(function(data){
                $scope.items.push(data);
            });
        };
        $scope.purchase = function() {
            console.log("In purchase");
            angular.forEach($scope.items, function(value,key){
                if(value.selected) {
                    $scope.order(value);
                    $scope.list.push(value);
                }
            });
        };
        $scope.order = function(item) {
            return $http.put('/orders/' + item._id + '/order')
            .success(function(data){
                console.log("order worked");
                item.orders += 1;
            });
        };
        
        $scope.addItem = function(Product) {
            var newObj = {Name:$scope.form_Name, Price: $scope.formPrice, URL: $scope.formURL, orders:0};
            $scope.create(newObj);
            $scope.form_Name= '';
            $scope.formPrice= '';
            $scope.formURL= '';
        };
        
        $scope.incrementOrders = function(item) {
            $scope.order(item);
        };
        
        $scope.delete = function(item) {
            console.log("Deleting Item " + item.Name + " ID "+ item._id+ " Price "+ item.Price+ " URL "+ item.URL);
            $http.delete('/orders/' + item._id).success(function(data){
                console.log("delete worked");
            });
            $scope.getAll();
        };
    }
]);