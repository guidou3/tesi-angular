export class SliderParams {
  min: number 
  max: number 
  defaultValue: number
  step: number

  constructor(min:number, max:number, defaultValue: number, step:number) {
    this.min = min
    this.max = max
    this.defaultValue = defaultValue
    this.step = step
  }
}