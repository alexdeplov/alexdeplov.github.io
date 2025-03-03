+++
title = "How to Deselect Selected UITableView Cell"
date = 2016-04-06T12:22:56+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++

You have UITableView with customized cells style, selection color, etc. When you tap on the cell, slide to another VC and came back, your cell still selected. Really annoing. Here is how to fix that.

```swift
override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)

    if let selectedIndexPath = tableView.indexPathForSelectedRow {
        tableView.deselectRow(at: selectedIndexPath, animated: true)
    }
}

```

![](images/1.jpg)