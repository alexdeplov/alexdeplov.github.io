+++
title = 'Why Layout Evolution Matters in UI Design'
date = 2023-02-08T20:41:08+02:00
draft = false
featured = true
author = "Alexander Deplov"
+++

While researching old operating systems I decided to try an experiment and re-created old UIs with modern components. Here we have File Viewer from NeXTSTEP operating system.

### NeXTSTEP window, old layout, old UI components:

![](images/image1.webp)

### Same layout of the NeXTSTEP, but rebuilt with modern UI components:

![](images/image2.webp)

Here we can quickly notice few problems with old layout :

1. It’s unclear what first row do. I still can’t say for sure, seems like a favorites

2. Second row uses for navigation, but selection of the Preview.app is duplicating selection inside of the folder

3. Navigation uses horizontal scroll, but folder content uses vertical

4. Vertically almost half of the windows is taken by favs and navigation rows

After rebuilding it with modern components, we still have all these problems. Yes, the app icons look interesting, but the whole window is not really usable. It’s fair to say that this approach does nothing to improve the UI.

### Modern layout, modern UI components:

![](images/image3.webp)

### Modern layout, but rebuilt with old UI components: 

![](images/image4.webp)

Now I have recreated the modern layout using the old UI components for comparison. Now it's clear that this approach works better because we can clearly see where users are, where favorites are, a direction for sidebar and content. And the overall use of window space is now better, especially when we need that window in the horizontal space of a screen itself.

This experiment highlights why layout evolution matters just as much as component design in UI development. While modern components can enhance visual appeal, they don’t automatically solve usability issues rooted in outdated layouts. Conversely, applying a modern layout with old components still improves clarity and functionality, proving that thoughtful spatial organization is key to effective UI design. It’s not just about how things look, but how they work together to guide the user intuitively through the interface.