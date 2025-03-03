+++
title = "How to Create Delegate in Swift"
date = 2017-05-30T10:42:43+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++
1. In class that send the data create protocol:

```swift
protocol BackButtonActionDelegate {
    func pressFinished(){}
}
```

2. Inside this class:

```swift
class BackButton: SKNode {
    var delegate: BackButtonActionDelegate?
}
```

3. Inside the class send the data, run the delegate message when needed:

```swift
delegate?.pressFinished()
```

Inside another class, that received data, add delegate:

```swift
class OptionsWindow: SKNode, BackButtonActionDelegate {

}
```

Add same function from sender:

```swift
func pressFinished() {
    print("delegate triggered")
}
```

Inside another class, that received data, in viewDidLoad() add:

```swift
backButton.delegate = self
```

Done.