+++
title = "How to Disable Uinavigationbar Shadow in Ios 9 Swift"
date = 2015-07-21T09:31:28+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++

*Easiest way to remove UINavigationBar bottom 1px border.*

This trick can be applied to iOS 8 and iOS 7. The UINavigationBar bottom border is an 1px shadow. According to the [documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UINavigationBar_Class/#//apple_ref/occ/instp/UINavigationBar/shadowImage) to remove it you have to provide UIImage. But we’re going to create an empty UIImage.

### In viewDidAppear:

```
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated) 

    let img = UIImage()
    navigationController?.navigationBar.shadowImage = img
    navigationController?.navigationBar.setBackgroundImage(img, for: .default)
}

```
![](images/1.jpg)

### Result:

![](images/2.jpg)

If you want to change background color to the navigationBar, do this:

![](images/3.jpg)

### Result:

![](images/4.jpg)

This technique was used in our new version (currently in development) of [Anchor Pointer: GPS compass for iPhone](https://itunes.apple.com/us/app/anchor-pointer-gps-compass/id791684332?mt=8).

![](images/5.jpg)
