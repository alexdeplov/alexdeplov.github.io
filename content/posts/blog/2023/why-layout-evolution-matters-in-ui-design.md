+++
title = 'Why Layout Evolution Matters in UI Design'
date = 2023-02-08T20:41:08+02:00
draft = false
featured = true
author = "Alexander Deplov"
+++
## Introduction

While researching old operating systems I decided to try an experiment and re-created old UIs with modern components. Here we have File Viewer from NeXTSTEP operating system (left screenshot).

![](images/1.png)

### Old layout by modern UI components

Here we can quickly notice few problems with old layout :

1. It’s unclear what first row do. I still can’t say for sure, seems like a favorites

2. Second row uses for navigation, but selection of the Preview.app is duplicating selection inside of the folder

3. Navigation uses horizontal scroll, but folder content uses vertical

4. Vertically almost half of the windows is taken by favs and navigation rows

After rebuilding it with modern components (right screenshot), we still have all these problems. Yes, the app icons look interesting, but the whole window is not really usable. It’s fair to say that this approach does nothing to improve the UI.

### Modern layout by old UI components

Now I have recreated the modern layout using the old UI components for comparison (right screenshot below). Now it’s clear that this approach works better because we can clearly see where users are currently, where favourites are, a direction for sidebar and content. And the overall use of window space is now better, especially when we need that window into horizontal space of a screen itself.

![](images/2.png)