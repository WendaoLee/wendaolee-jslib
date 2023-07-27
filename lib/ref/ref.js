/**
 * 一个引用容器。它里面包含指向所包裹的对象的引用。
 * <br>
 * 使用时，需要通过.ref获取引用，而后通过.ins对实际引用对象进行相关改动。
 * 如要取值，应当调用.val属性获取纯净值。
 * 例:let a = new ref(3);a.ref.ins = 999;console.log(a.val) -> 999
 * 
 * @method bind 将引用绑定到Object原型链上，之后可以在其他地方通过静态方法getRef(name)直接获取到本引用实例进行复用。请注意，name是唯一的。请确保您的命名空间不会发生冲突问题。
 * @method getRef 静态方法，从原型链上获得储存的引用。
 * @returns this
 */
export class ref {
  #instance
  /**
   * 传递要引用的对象。支持基本类型。
   * @param {*} instance 
   * @returns 
   */
  constructor(instance) {
    Object.prototype.hasOwnProperty('__jslibOfWendaolee__')?null:Object.prototype.__jslibOfWendaolee__ = {}
    this.#instance = {ins:instance,val:null};
    Object.defineProperty(this.#instance, 'val', {
      get: this.#getVal.bind(this), // 使用 getVal 方法作为 getter
    });
    return this
  }

  /**
   * 将引用容器绑定到Object原型链上，之后可以在其他地方通过静态方法getRef(name)直接获取到本引用容器实例进行复用。
   * 请注意，name是唯一的。请确保您的命名空间不会发生冲突问题。
   * 如要销毁本实例，可通过delete运算符结合静态类方法ref.getRef进行销毁
   * @param {String} name 引用实例的命名 
   * @returns this
   */
  bind(name){
    Object.prototype.__jslibOfWendaolee__[name] = this
    return this
  }

  /**
   * 对该属性进行取值getter操作将获取实际引用对象的引用。
   * 您还需要通过调用.ins进行相关值的修改。
   * 如let typeRef = new ref('233');let ref = typeRef.ref;ref.ins = "444"
   */
  get ref(){
    return this.#instance;
  }

  /**
   * 对该属性进行赋值setter操作将变更容器的引用，使其指向另一个对象。
   * 请注意。这个使用方式会使得原本指向的实际引用对象失去指向从而导致GC销毁。
   */
  set ref(instance){
    this.#instance = {ins:instance,val:null};
    Object.defineProperty(this.#instance, 'val', {
      get: this.#getVal.bind(this), // 使用 getVal 方法作为 getter
    });
  }

  /**
   * 获取实际引用对象的纯净值。
   * 纯净值的意思是，对返回值的任何修改都不会影响到实际引用对象本身。
   * 你无法修改val属性。对它的任何赋值操作都是无效的。
   */
  get val(){
    const pure_type = ['symbol','number','string','boolean','undefined']
    if (pure_type.includes(typeof this.#instance.ins)){
      return this.#instance.ins
    }
    if(this.#instance.ins === null){
      return null
    }
    return Object.assign({},this.#instance.ins)
  }

  #getVal() {
    return this.val; // 直接返回 val 的值
  }

  /**
   * 获取引用容器
   * @param {String} name 引用容器名
   * @returns {ref} 对应的引用容器
   */
  static getRef(name){
    return Object.prototype.__jslibOfWendaolee__[name]
  }
}