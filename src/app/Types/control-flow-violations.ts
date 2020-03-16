interface ViolationEntry {
  transition: String
  cost: number
}

export interface ControlFlowViolations {
  modelTable: Set<ViolationEntry>
  logTable: Set<ViolationEntry>
}