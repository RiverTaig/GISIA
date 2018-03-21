define(["esri/geometry/Point","esri/units", "esri/geometry/Circle","js/base"],function (Point,Units,Circle,Base ) {
    var privateValue = 0;
    return {
        circle: function(){
            var circle = new Circle({
                geodesic: false,
                center: new Point(123,234),
                radius: 5280,
                radiusUnit: Units.FEET
            });
            return circle.center.x.toString();
        },

        increment: function () {
            let y = Base;
            y.helloWorld();
            privateValue++;
        },

        decrement: function () {
            privateValue--;
        },

        getValue: function () {
            return privateValue;
        }
    };
});