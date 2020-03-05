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

export class Parameters {
  threads: { min: number, max: number, defaultValue: number}
  fitness: { min: number, max: number, defaultValue: number}
  searchSpace: { min: number, max: number, defaultValue: number}
  
}