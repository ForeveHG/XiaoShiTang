//http://food.boohee.com/fb/v1/foods/selayou/brief? //食物对比页面
//http://food.boohee.com/fb/v1/search?page=1&q=水&order_asc=asc&order_by=calory&health_mode=1 搜索用
let typeList = [
    {title:'主食类',group:1,img:require('../img/foodtype/food_type_main_course.png')},
    {title:'肉蛋类',group:2,img:require('../img/foodtype/fod_type_meet.png')},
    {title:'奶类',group:3,img:require('../img/foodtype/food_type_milk.png')},
    {title:'水果,蔬菜类',group:4,img:require('../img/foodtype/food_type_fruit.png')},
    {title:'坚果,大豆类',group:5,img:require('../img/foodtype/food_type_soybean.png')},
    {title:'饮料类',group:6,img:require('../img/foodtype/food_type_drank.png')},
    {title:'油脂类',group:7,img:require('../img/foodtype/food_type_oil.png')},
    {title:'调味品',group:8,img:require('../img/foodtype/food_type_season.png')},
    {title:'零食，点心及冷饮',group:9,img:require('../img/foodtype/food_type_snacks.png')},
    {title:'其他',group:10,img:require('../img/foodtype/food_type_other.png')},
    {title:'菜肴',group:11,img:require('../img/foodtype/food_type_main_course.png')},
];

export default {
    typeList : typeList,
}