function $num2str(num, length){
    var str = num + "";
    for(var i = 0, l = length - str.length; i < l; i++){
        str = "0" + str;
    }
    return str;
}
function $getProp(obj, pchain){
    if(arguments.length === 1){
        pchain = obj;
        obj = window;
    }
    var pAry = pchain.split(".");
    for(var i = 0, l = pAry.length; i < l; i++){
        obj = obj[pAry[i]];
        if(i < l-1 && (obj === null || typeof obj !== "object")){
            obj = undefined;
            break;
        }
    }
    return obj;
}
function $compile(options){
    if(typeof options === "string"){
        var o = {data : arguments[1], format : ["{#", "#}"]};
        o[!/\w/.test(options) ? "str" : "tmplId"] = options;
        options = o;
        o = null;
    }
    var tmplId= options.tmplId || options.id;
    if(!tmplId && !options.str){
        return false;
    }
    var compile = arguments.callee,
        str = options.str,
        data = options.data,
        dom = options.dom,
        format = options.format || ["<%", "%>"];
    var fn;
    if(tmplId){
        if(!compile[tmplId]){
            compile[tmplId] = compile({
                str : document.getElementById(tmplId).innerHTML,
                format : format,
                dom : dom
            });
        }
        fn = compile[tmplId];
    }else{
        var left = format[0], right = format[1];
        fn = new Function("obj", "var p=[];with(obj){p.push('" +
        str.replace(/[\r\t\n]/g, " ")
            .split(left).join("\t")
            .replace(new RegExp("((^|"+ right +")[^\\t]*)'", "g"), "$1\r")
            .replace(new RegExp("\t=(.*?)"+right, "g"), "',$1,'")

            .split("\t").join("');")
            .split(right).join("p.push('")
            .split("\r").join("\\'")+ "');}return p.join('');");
    }
    if(data){
        if(dom && ("innerHTML" in dom)){
            dom.innerHTML = fn(data);
            return dom;
        }
        return fn(data);
    }else{
        return fn;
    }
}