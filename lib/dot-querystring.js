(function(){
  var dotQs, prevDotQs, _this = this;

  dotQs = {
  };

  prevDotQs = this.dotQs;

  //// cross-browser compatiblity functions ////

  var toString = Object.prototype.toString;
  var nativeIsArray = Array.isArray;

  var isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  var isObject = function(obj) {
    return obj === Object(obj);
  };

  var _forEach = function (obj, iterator) {
    if( isArray(obj)){
      var arr = obj;
      if (arr.forEach) {
        arr.forEach(iterator);
        return;
      }
      for (var i = 0; i < arr.length; i += 1) {
        iterator(arr[i], i, arr);
      }
    }else{
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator( obj[key], key, obj);
        }
      }
    }
  };

  var _reduce = function (arr, iterator, memo) {
    if (arr.reduce) {
      return arr.reduce(iterator, memo);
    }
    _forEach(arr, function (x, i, a) {
      memo = iterator(memo, x, i, a);
    });
    return memo;
  };

  ///

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = dotQs;
  } else {
    dotQs.noConflict = function() {
      _this.dotQs = prevDotQs;
      return dotQs;
    };
    this.dotQs = dotQs;
  }

  var notint = /[^0-9]/;
  dotQs.parse = function(str){
    if(str === null || str === ''){
      return {};
    }

    return _reduce(String(str).split('&'),function(ret, pair){
      try{
        pair = decodeURIComponent(pair.replace(/\+/g, ' '));
      } catch(e) {
        // ignore
      }
      var epos = pair.indexOf('=');
      var key , value;
      if(epos == -1 ){
        // key only
        return {base : {}};
      }else{
        key = pair.substring(0, epos);
        value = pair.substring(epos + 1);
      }

      var store = function(key,  base){
        var dpos = key.indexOf('.');
        var baseKey, remainKey;
          if(dpos == -1){
            baseKey = key;
            remainKey = null;
          }else{
            baseKey = key.substring(0, dpos);
            remainKey = key.substring(dpos + 1);
          }

        // store object
        if(!notint.test(baseKey)){
          // it's array
          if(base && !isArray(base)){
            // skip if base is not array
            return base;
          }
          var index = parseInt(baseKey, 10);
          base = base || [];
          if(remainKey == null){
            if(value === ''){
              base[index] = null;
            }else{
              base[index] = value;
            }
          }else{
            base[index] = store(remainKey, base[index]);
          }
          return base;
        }else{
          // it's object
          if(base && isArray(base)){
            // skip if base is array
            return base;
          }
          base = base || {};
          if(remainKey == null){
            if(value === ''){
              base[baseKey] = null;
            }else{
              base[baseKey] = value;
            }
          }else{
            base[baseKey] = store(remainKey, base[baseKey]);
          }
          return base;
        }
      };
      ret.base = store(key, ret.base);
      return ret;
    },{base : null}).base;
  };

  var flatten = dotQs.flatten = function(obj){
    if(!isArray(obj) && !isObject(obj) ){
      return true;
    }

    var slot = [];
      var updateSlot = function(obj){
        var i;
        for(i = 0; i < slot.length; i++){
          if(slot[i] === obj){
            return false;
          }
        }
        slot.push(obj);
        return true;
      };
      var ret = {};
      var _dump = function(obj, prefix){
        if(!isArray(obj) && !isObject(obj) ){
          if(!prefix){
            throw obj + "is not object or array";
          }
          ret[prefix] = obj;
          return;
        }

        if(isArray(obj)){
          // it's array
          _forEach(obj, function(obj, i){
            if(!updateSlot(obj)){
              throw new Error('object has circular references');
            }
            _dump(obj, prefix ? prefix + "." + i : "" + i);
          });
        }else{
          // it's object
          _forEach(obj, function(obj, key){
            if(!updateSlot(obj)){
              throw new Error('object has circular references');
            }
            _dump(obj, prefix ? prefix + "." + key : "" + key);
          });
        }
      };

    _dump(obj, null);
    return ret;
  };

  dotQs.stringify = function(obj){
    var flats = flatten(obj);
    var _buf = [];
    _forEach(flats, function(val, key){
      _buf.push(''+ encodeURIComponent(key) + '=' + encodeURIComponent(val));
    });
    return _buf.join('&');
  };
})();