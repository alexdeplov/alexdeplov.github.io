+++
title = "How to Make Custom UINavigationController Back Button Image Without Title (Swift)"
date = 2015-07-21T09:39:55+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++
The easiest way to customize navigation controller back button.

By default back button looks like this:

![](images/1.jpg)

We are going to make it looks like Instagram back button (without text):

![](images/2.jpg)

I quickly redraw the button in the Sketch and add into Assets:

![](images/3.jpg)

Storyboard looks like this:

![](images/4.jpg)

### In the ViewController.swift write:

```
override func viewDidLoad() {
    super.viewDidLoad()

    if let backButtonImage = UIImage(named: "backButton") {  
        navigationController?.navigationBar.backIndicatorImage = backButtonImage
        navigationController?.navigationBar.backIndicatorTransitionMaskImage = backButtonImage
    }

    navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: .plain, target: nil, action: nil)
}

```

![](images/5.jpg)

Result:

![](images/6.jpg)

This technique used in our new version (currently in development) of [Anchor Pointer: GPS compass for iPhone](https://itunes.apple.com/us/app/anchor-pointer-gps-compass/id791684332?mt=8).

![](images/7.jpg)