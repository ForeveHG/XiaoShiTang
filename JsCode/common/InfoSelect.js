//性别
let userSex = ['男','女','未知'];
//年龄
let userAge = [];
for(let i = 10; i<=100; i++){
    userAge.push(i+'岁');
}
//身高
let userHeight = [];
for(let i = 140;i<=230;i++){
    userHeight.push(i+'CM');
}
//体重
let userWeight = [];
let userWeight1 = [];
let userWeight2 = [];
for(let i = 30;i<150;i++){
    userWeight1.push(i);
}
for(let j = 0;j<10;j++){
    userWeight2.push('.'+j+'KG');
}
userWeight.push(userWeight1,userWeight2);
export default {
    userSex: userSex,
    userAge: userAge,
    userHeight: userHeight,
    userWeight: userWeight,
}