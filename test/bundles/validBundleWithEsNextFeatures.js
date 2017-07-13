webpackJsonp([0],[function(t,e,r){
  async function asyncFn() {
    return await Promise.resolve(1);
  }

  const arrowFn = arg => arg * 2;

  function* generatorFn() {
    yield 1;
  }

  class TestClass {
    static staticMethod() {}
    constructor() {}
    testMethod() {}
  }

  for (const i of [1, 2, 3]) {
    console.log(i);
  }

  let obj = {
    ['a' + 'b']: 1,
    func() {}
  };

  const [var1, var2] = [1, 2];
}]);
