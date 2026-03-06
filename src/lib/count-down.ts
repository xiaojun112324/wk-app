/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/**
 * 倒计时功能
 * @param {number} cdTime 倒计时时间
 * @param {number} tickTime 倒计时间隔时间，默认1秒
 * @param {function} startCall 开始倒计时
 * @param {function} tickCall 倒计时中回调
 * @param {function} endCall 倒计时结束
 */
class CountDown {
  cdFlag: number = -1 // 倒计时标识
  opt: any = {} // 配置项
  tickTime: number = 1 // 倒计时间隔时间，默认1秒
  pauseFlag: boolean = false
  pauseTime: number = 0
  cdTime: number = 5
  isCounting: boolean = false // 是否倒计时中
  animationDuration: number = 5000 // 动画总时长，默认5秒
  animationFrameId: any

  constructor(opt?: any) {
    if (opt) {
      this.opt = opt
      this.start(opt)
    }
  }

  start(opt: any): void {
    this.opt = opt
    this.reset()
    this._doCallback(opt.startCall)
    this.isCounting = true
    // this.animateTickCall(0) // 调用动画回调函数，初始进度为 0
    this._doCallback(this.opt.tickCall)
    this.cdFlag = setInterval(() => {
      this.doFun()
    }, this.tickTime * 1000)
  }

  addCdTime(num: number): void {
    this.cdTime += num
  }

  stop(): void {
    this.isCounting = false

    clearInterval(this.cdFlag as number)
    cancelAnimationFrame(this.animationFrameId)
    this._doCallback(this.opt.endCall)
  }

  pause(): void {
    this.pauseFlag = true
    this.pauseTime = 0
  }

  continue(): void {
    this.pauseFlag = false
  }

  reset(): void {
    clearInterval(this.cdFlag as number)
    this.cdTime = this.opt.cdTime || 5
    this.animationDuration = this.cdTime * 1000
    this.tickTime = this.opt.tickTime || 1
    this.pauseFlag = false
    this.isCounting = false
    this.pauseTime = 0
  }

  _doCallback(callback: any): void {
    if (callback && typeof callback === 'function') {
      callback(this)
    }
  }

  private doFun(): void {
    if (this.pauseFlag) {
      return
    }
    this.cdTime--
    this.pauseTime++
    this._doCallback(this.opt.tickCall)

    if (this.cdTime === 0) {
      this.stop()
    }
  }

  private animateTickCall(progress: number): void {
    if (this.pauseFlag || progress >= 1) {
      return
    }

    const startTime = performance.now()
    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - startTime
      const remainingTime = this.animationDuration - elapsedTime // 剩余时间，单位毫秒
      const newProgress = Math.min(1 - remainingTime / this.animationDuration, 1) // 计算新的进度

      // 仅当新进度大于旧进度时才更新
      if (newProgress > progress) {
        this._doCallback(this.opt.animateTickCall(newProgress * 100 > 99.6 ? 1 : newProgress))
        progress = newProgress
      }

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate)
      }
    }

    this.animationFrameId = requestAnimationFrame(animate)
  }
}

export default CountDown
