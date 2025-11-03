+++
title = "Two Data-Driven Methods to Identify Your Target Audience Age"
date = 2024-07-29T13:13:53+02:00
aliases = ["/posts/blog/2024/two-data-driven-methods-to-identify-your-target-audience-age-as-a-product-designer/"]
draft = false
featured = false
author = "Alexander Deplov"
+++
Knowing your target audience is critical to creating a product that truly resonates with your users. By understanding their age (as an example), you can tailor the user experience, features, and even your marketing messages to their specific needs and preferences. This personalization not only increases engagement, but also contributes to the overall success of your product.

As a product designer, if you can't define your users, it's like trying to shoot a target blindfolded. You need to know their ages, preferences, and behaviors in order to design a product that fits them like a glove. 

In this article, we'll explore two data-driven methods that can help you uncover the age of your target audience and make informed design decisions that lead to a more successful product:

- By using Google Forms
- By using Apple Search ADS

### How to find target audience age by Google Forms

1. Create a Google Form and set up a document with question you want to know, such as age.
2. Set up a range 16-24, 25-34, 35-44, 45-54, 55-64, 65+
![](images/1.webp)
3. Click on Preview to see the result 
![](images/5.webp)
4. Copy the URL of this page 
5. In iOS create UIAlertView with “Would you like to participate in UX or marketing research?
6. Add the URL to the SFSafariViewController attached to the “Participate” button

Now sit and wait. After some time, when you collect the data, you will be able to read the result.

![](images/2.webp)

### How to find target audience age by Apple Search ADS Advanced

This one is more interesting for me because you can see the demand and you can be more specific about users location, and other info. It's not necessary should be Apple Search ADS, it can be any other service. But the core idea is to split it by age in the root of your ad, so you can see what age responds the most to your ADS.

- Create a new AD group for the same range 16-24, 25-34, 35-44, 45-54, 55-64, 65+.
![](images/4.webp)

At some point, when you have enough data, you can do the next two things:
1. Compare the ADS age range with the Google Form to see the coloring 
2. Turn off ADS range that has big amount of clicks but less amount of sales. It means that these are target audience. That's how you can optimize your ads to keep only the ones that perform better. 
![](images/3.webp)

I used both techniques when building [Anchor Pointer GPS Compass for iOS](https://interfacecraft.online/posts/portfolio/navigating_success_11_years_of_innovation_with_anchor_pointer_gps_compass/). Initially, I imagined that our target audience was a teenager, it turned out to be 50 - 69+.

By using this method you can create gather most of the important data about your users, not only an age. 


