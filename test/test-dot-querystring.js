var dotQuerystring = require('../lib/dot-querystring');

describe('dotQuerystring.parse', function(){
  it('shold ignore left-hand only', function(){
    dotQuerystring.parse('aaa').should.eql({});
  });

  it('shold parse object', function(){
    dotQuerystring.parse('aaa=bbb').should.eql({'aaa' : 'bbb'});
  });

  it('shold parse array', function(){
    dotQuerystring.parse('0=bbb&1=ccc').should.eql(['bbb', 'ccc']);
  });

  it('shold use type of appeared first', function(){
    dotQuerystring.parse('0=1&a=2').should.eql(['1']);
    dotQuerystring.parse('a=2&0=1').should.eql({a : '2'});
  });

  it('should skip empty array indexes', function(){
    dotQuerystring.parse('3=3').should.eql([,,,'3']);
  });

  it('should parse nested', function(){
    dotQuerystring.parse('a.b.c=1&a.b.d=2').should.eql({a : {b : {c : '1', d : '2'}}});
    dotQuerystring.parse('a.0.a=1&a.0.b=2&a.1.a=3&a.1.b=4').should.eql({a : [{a : '1', b : '2'}, {'a' : '3', 'b' : '4'}]});
  });
});

describe('dotQuerystring.flatten', function(){
  it('should flatten object', function(){
    dotQuerystring.flatten({a : {b : 1, c : 2}}).should.eql({'a.b' : 1, 'a.c' : 2});
  });

  it('should flatten array', function(){
    dotQuerystring.flatten([1,2,3]).should.eql({'0' : 1, '1' : 2, '2' : 3});
  });

  it('should flatten nested', function(){
    dotQuerystring.flatten({
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
});


describe('dotQuerystring.stringify', function(){
  it('should stringify basic objects', function(){
    dotQuerystring.stringify({a : 1}).should.eql('a=1');
    dotQuerystring.stringify({a : 'あ'}).should.eql('a=%E3%81%82');
  });

  it('should stringify basic array', function(){
    dotQuerystring.stringify([1,2,3,4,5]).should.eql('0=1&1=2&2=3&3=4&4=5');
    dotQuerystring.stringify(['あ','い']).should.eql('0=%E3%81%82&1=%E3%81%84');
  });

  it('should stringify nested object', function(){
    dotQuerystring.stringify({
      a : 12345,
      b : {
        c : 'hoge',
        d : ['a', 'b']
      }
    }).should.eql('a=12345&b.c=hoge&b.d.0=a&b.d.1=b');
  });
});