export interface InitialMapping {
  classifiers: Set<String>
  defaultClassifier: String
  nameList: Set<String>
  resourceList: Set<String>
  transitionNames: Map<String, Set<String>>
}