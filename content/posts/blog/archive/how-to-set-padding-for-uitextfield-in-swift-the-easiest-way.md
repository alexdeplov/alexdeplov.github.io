+++
title = "How to Set Padding for UITextField in Swift, the Easiest Way"
date = 2015-02-16T09:11:49+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++

Of course, you also need to add a top and a bottom paddings, but this can be achieved through autolayout height size of the textfield. Result: left padding for UITextField placeholder and text:

![](images/1.jpg)

```swift
import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var myTextField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()

        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 15, height: myTextField.frame.height))
        myTextField.leftView = paddingView
        myTextField.leftViewMode = .always 
    }
}

```

![](images/2.jpg)

We used this technique in our new Taskler app, but without big indent.

![](images/3.jpg)