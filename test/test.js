var fs = require('fs');
var Spritesmith = require('../src/index.js');
//var image = require("imageinfo"); 

//获取本地图片路径
function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            readFileList(path + itm + "/", filesList)
        } else {
            filesList.push(__dirname + '/staticFile/' + itm);
        }
    })
};
var getFiles = {  
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    }
};

//格式化一下
function formatStr(obj){
    var str = "";
    var Str = "";
    Object.keys(obj).forEach(function (key) {
        str = key + ' {' + '\n'
            + '   background-position:-' + obj[key]['x'] + 'px ' + '-'+obj[key]['y'] + 'px; ' + '\n'
            + '   width:' + obj[key]['width'] + 'px;' + '\n'
            + '   height:' + obj[key]['height'] + 'px;' + '\n'
            + '};' + '\n';
        Str += str
    });
    return Str
}

var list = getFiles.getFileList('./test/staticFile/');
Spritesmith.run({
    src: list,
    padding: 20,
    // algorithm: 'top-down',
}, function handleResult(err, result) {
    if (err) {
        throw err;
    };
    fs.writeFileSync(__dirname + '/outputFile/sprites.png', result.image);
    result.coordinates, result.properties;
    var data = result.coordinates
    var obj = Object.keys(data).reduce((newData, key) => {
        let newKey = key.replace("F:\\demoSpace\\spritsTest\\test/staticFile/", ".");
        newKey = newKey.replace(".png", "")
        newData[newKey] = data[key]
        return newData
    }, {});
    
    var Str = formatStr(obj);
    // console.log(Str)
    fs.writeFileSync(__dirname + '/outputFile/sprites.css', Str);
    fs.writeFileSync(__dirname + '/outputFile/sprites.txt', JSON.stringify(obj, null, '\t'));
});