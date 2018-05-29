export default class Promise {
  constructor (executor) {
    this.status = 'panding'
    this.value = undefined
    this.reason = undefined

    this.onResolveCallback = []
    this.onRejectCallback = []

    const resolve = (data) => {
      if (this.status === 'panding') {
        this.value = data
        this.status = 'fulfilled'
        while (this.onResolveCallback.length) {
          this.onResolveCallback.shift()()
        }
      }
    }

    const reject = (reason) => {
      if (this.status === 'panding') {
        this.reason = reason
        this.status = 'rejected'
        while (this.onRejectCallback.length) {
          this.onRejectCallback.shift()()
        }
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled = value => value, onRejected = reason => { throw reason }) {
    if (this.status === 'fulfilled') {
      const promise2 = new Promise((resolve, reject) => {
        try {
          const x = onFulfilled(this.value)
          resolveExecutor(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      })
      return promise2
    }
    if (this.status === 'rejected') {
      const promise2 = new Promise((resolve, reject) => {
        try {
          const x = onRejected(this.reason)
          resolveExecutor(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      })
      return promise2
    }
    if (this.status === 'panding') {
      this.onResolveCallback.push(() => {
        const promise2 = new Promise((resolve, reject) => {
          try {
            const x = onFulfilled(this.value)
            resolveExecutor(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
        return promise2
      })
      this.onRejectCallback.push(() => {
        const promise2 = new Promise((resolve, reject) => {
          try {
            const x = onRejected(this.reason)
            resolveExecutor(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
        return promise2
      })
    }
    const resolveExecutor = (promise2, x, resolve, reject) => {
      if (promise2 === x) {
        return reject(new TypeError('不能循环引用'))
      }
      if (x instanceof Promise) {
        x.then(resolve, reject)
      }
      if (typeof x === 'object' || typeof x === 'function') {
        let then
        let called = false
        try {
          then = x.then
        } catch (err) {
          reject(err)
        }
        if (then) {
          const resolvePromise = (y) => {
            !called && resolveExecutor(promise2, y, resolve, reject)
            called = called === false
          }
          const rejectPromise = (r) => {
            !called && reject(r)
            called = called === false
          }
          try {
            then.call(this, resolvePromise, rejectPromise)
          } catch (err) {
            !called && reject(err)
            called = called === false
          }
        } else {
          resolve(x)
        }
      } else {
        resolve(x)
      }
    }
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  static resolve (value) {
    return new Promise(resolve => {
      resolve(value)
    })
  }

  static reject (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static all (promises) {
    return new Promise((resolve, reject) => {
      const length = promises.length
      const resolveArray = []
      while (promises.length) {
        promises.shift().then((value) => {
          resolveArray.push(value)
          if (resolveArray.length === length) {
            resolve(resolveArray)
          }
        })
      }
    })
  }

  static race (promises) {
    return new Promise((resolve, reject) => {
      while (promises.length) {
        promises.shift().then(value => value ? resolve(value) : null)
      }
    })
  }
}
