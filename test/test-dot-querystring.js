if(typeof dotQs === 'undefined'){
  dotQs = require('../lib/dot-querystring');
}

describe('dotQs.parse', function(){
  it('shold ignore left-hand only', function(){
    dotQs.parse('aaa').should.eql({});
  });

  it('shold parse object', function(){
    dotQs.parse('aaa=bbb').should.eql({'aaa' : 'bbb'});
  });

  it('shold parse object(when the key begins with number)', function(){
    dotQs.parse('111aaa=bbb').should.eql({'111aaa' : 'bbb'});
  });

  it('shold parse array', function(){
    dotQs.parse('0=bbb&1=ccc').should.eql(['bbb', 'ccc']);
  });

  it('shold use type of appeared first', function(){
    dotQs.parse('0=1&a=2').should.eql(['1']);
    dotQs.parse('a=2&0=1').should.eql({a : '2'});
  });

  it('should skip empty array indexes', function(){
    dotQs.parse('3=3').should.eql([,,,'3']);
  });

  it('should decode keys', function(){
    dotQs.parse('%E3%81%82=3').should.eql({'あ' : '3'});
  });

  it('should parse nested', function(){
    dotQs.parse('a.b.c=1&a.b.d=2').should.eql({a : {b : {c : '1', d : '2'}}});
    dotQs.parse('a.0.a=1&a.0.b=2&a.1.a=3&a.1.b=4').should.eql({a : [{a : '1', b : '2'}, {'a' : '3', 'b' : '4'}]});
  });
});

describe('dotQs.flatten', function(){
  it('should flatten object', function(){
    dotQs.flatten({a : {b : 1, c : 2}}).should.eql({'a.b' : 1, 'a.c' : 2});
  });

  it('should flatten array', function(){
    dotQs.flatten([1,2,3]).should.eql({'0' : 1, '1' : 2, '2' : 3});
  });

  it('should flatten nested', function(){
    dotQs.flatten({
      a : 12345,
      b : {
        c : 'hoge',
        d : ['a', 'b']
      }
    }).should.eql({
      'a' : 12345,
      'b.c' : 'hoge',
      'b.d.0'  : 'a',
      'b.d.1'  : 'b'
    });
  });

  it('should detect circular references', function(){
    (function(){
      var foo = {a : 1 };
      foo.foo = foo;
      dotQs.flatten(foo);
    }).should.throw();

    (function(){
      var foo = {a : 1, b : [1,2,3]};
      foo.b.push(foo);
      dotQs.flatten(foo);
    }).should.throw();
  });
});

describe('dotQs.stringify', function(){
  it('should stringify basic objects', function(){
    dotQs.stringify({a : 1}).should.eql('a=1');
    dotQs.stringify({a : 'あ'}).should.eql('a=%E3%81%82');
  });

  it('should stringify basic array', function(){
    dotQs.stringify([1,2,3,4,5]).should.eql('0=1&1=2&2=3&3=4&4=5');
    dotQs.stringify(['あ','い']).should.eql('0=%E3%81%82&1=%E3%81%84');
  });

  it('should stringify nested object', function(){
    dotQs.stringify({
      a : 12345,
      b : {
        c : 'hoge',
        d : ['a', 'b'],
        'あいうえお' : 3
      }
    }).should.eql('a=12345&b.c=hoge&b.d.0=a&b.d.1=b&b.%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A=3');
  });
});