+++
title = "How to Change UIlabel Line Height in Swift"
date = 2016-03-30T16:53:11+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++

![](images/1.jpg)

```
@IBOutlet weak var myLabel: UILabel!

let textForLabel = """
Lorem Ipsum is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,  when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into 
electronic typesetting, remaining essentially unchanged.
"""

let paragraphStyle = NSMutableParagraphStyle()
// Line height size
paragraphStyle.lineSpacing = 1.4

let attrString = NSMutableAttributedString(string: textForLabel)
attrString.addAttribute(.paragraphStyle, 
                        value: paragraphStyle, 
                        range: NSRange(location: 0, length: attrString.length))

myLabel.attributedText = attrString
myLabel.textAlignment = .center
```

### Result:

![](images/2.gif)