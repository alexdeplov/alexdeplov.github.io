+++
title = "How to Dismiss Modal View Form Sheet Controller in Swift"
date = 2015-11-25T17:01:15+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++
When storyboard segue presentation mode set to Form Sheet you can add simple code to hide its ViewController tap on background. You don't need Done button. Of course this trick is for iPad app only, because on iPhone Form Sheet will cover all screen size.

![](images/1.jpg)

This code works well in Swift, iOS 9:

```
class ViewController: UIViewController, UIGestureRecognizerDelegate {
    var tapBGGesture: UITapGestureRecognizer!
    
    override func viewDidAppear(animated: Bool) {
        tapBGGesture = UITapGestureRecognizer(target: self, action: "settingsBGTapped:")
        tapBGGesture.delegate = self
        tapBGGesture.numberOfTapsRequired = 1
        tapBGGesture.cancelsTouchesInView = false
        self.view.window!.addGestureRecognizer(tapBGGesture)
    }
    
    func settingsBGTapped(sender: UITapGestureRecognizer) {
        if sender.state == UIGestureRecognizerState.Ended {
            guard let presentedView = presentedViewController?.view else {
                return
            }
            
            if !CGRectContainsPoint(presentedView.bounds, sender.locationInView(presentedView)) {
                self.dismissViewControllerAnimated(true, completion: { () -> Void in
                })
            }
        }
    }
    
    func gestureRecognizer(gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWithGestureRecognizer otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
    override func viewWillDisappear(animated: Bool) {
        self.view.window!.removeGestureRecognizer(tapBGGesture)
    }
}

```