+++
title = "Personal Project for 11 Years: Anchor Pointer – GPS Compass for iOS"
date = 2024-07-04T21:52:14+02:00
draft = true
featured = true
+++

### Project goal

In 2013 I decided to release my first iOS app. On this way I asked my brother-developer to help me with this project. The goal was to try to create a unique navigation app using GPS as a core technology with one big advantage, it can work without internet connection by reading GPS signal directly from satellites. It could be handy for people who are traveling and not willing to buy another SIM card just to have an internet connection. Or people who use iPhone in a natural area, far away from cell towers.

### Researching target audiences

Since the app was unique in the market, there was no direct access to the target audience, it was unknown. Instead, I assumed that the target audience would be the same as most active iOS users during that period: young, active people in the 25-35 age range.

As it turns out, this assumption was wrong. I'll explain why in the [Mistakes](#mistakes) section.

### Process

I usually start with a competitive analysis. It's important to understand what's happening in the market. In 2013 there wasn't much. Google Maps was the leader, other apps like TomTom or Waze were built on the map navigation concept and wasn't direct competitor. Apple released Apple Maps in 2012 and it was also a classic map navigation app. 

So instead, I focused on the core use case, which I described as:
> A navigation tool that guides you to a specific location by providing both direction and distance. It works much like asking a passerby for directions - they might point in a certain direction and say, "The library is that way, about 500 meters ahead.

From a jobs-to-be-done perspective, the core use cases for this navigation app were defined as
- Finding your way back. Users could mark their starting point (e.g., a parked car, campground, or hotel) and use the app to navigate back to it without relying on an Internet connection or detailed maps.
- Explore unfamiliar areas: Travelers or hikers can set points of interest and navigate between them in areas without cellular coverage or detailed maps.
- Connect with others: Users could share location coordinates and use the app to find each other in crowded or unfamiliar places without having to describe landmarks or rely on cellular data. This task was defined as a separate feature called "Meet Friend".
- Later, I added "Park Car" because most of our audience, especially from the United States, were car owners. The Park Car feature was also defined as a separate feature so that users could have quick access. 

After defining the use cases, I started building the basic screens and defining the navigation architecture. I also decided that the entry point should be simple and as clear as possible. When opening the app, the user should see only a few buttons that can answer a simple question: what do you want to do now? So the main screen was built around these 4 components:
1. Save location
2. List of locations
3. Meet Friend
4. Park Car

After a few iterations, I found the perfect balance of easy-to-use navigation and clear structure. 

### Development

At the same time, I helped my brother to test the prototype to make sure that the technology of GPS triangulation works. He prepared a technical prototype, and we spent hours of walking by testing the concept. Along the way, the Meet Friend feature was tested on a huge field, and later between buildings. During these tests I realized that the idea works, the technical implementation also works well, so we can continue. 

It was important to release the app so that we could polish it later by collecting user feedback and analytics.

### Results

We released Anchor Pointer in November 2013. Since then it has been downloaded 732K times by people around the globe. 

The app was polished with many iterations after the initial release. It received App Store Editors' Note. 
> Wherever life takes us, we'll find our way back with Anchor Pointer. It's the compass reinvented with walking directions, navigation bookmarks, and an easy parked car locator - all in a friendly design. We save time and stress by sharing our whereabouts with friends and syncing saved locations across devices. For treks through nature or across town, Anchor Pointer fits like a good pair of shoes.

And reviewed by The Next Web (USA), Engadget (USA), Financial Review (Australia) and many others. User reviews are mostly positive. 4.6 out of 5, 2.2K reviews.

### Mistakes

**App Store Screenshots direction was unknown**\
Since we were building a multitool in the beginning, it wasn't clear how to promote it well. What should I show in App Store screenshots? What should I put in the description? 

At first I made the mistake of showing almost everything without a clear direction of what the app is about. Later, when I found an answer to what exactly is the target audience and how do they use the app, I changed the screenshots and improved the install rate.

**Not all people can speak English**\
After running countless amount of screenshots A/B test, I found that in some countries amount of language speaking people is low, not all can read app description or understand App Store screenshots text. Imagine a billboard with all the letters you don't understand - can it be successful? This is what it looks like for people who can't read English. So after this discovery I used analytics to find the most popular countries and created localized version of screenshots and description. For the top 10 we also did app localization. 

**Target audience is different from what I originally thought**\
To find the target audience, I set up a Google Form with questions about age, gender, location and others to learn more about our users. In terms of implementation, it was super easy - standard iOS notification was shown to everyone who opened the app on the 2nd day of usage with a question to participate in the research. In a short period of time, I collected 437 responses, which was enough to define a user profile.

It turns out that the majority of our users are not young people at all. It's 50 - 69+. 
44% of our users use it for parking and finding a car. 

After that, I improved the app's font size and contrast to improve the experience for older people. We also added support for Dynamic Type. 

### Learnings

- App Store reviews, support emails, social network mentions - the best source to keep your hand on user feedback. Since we were a two-man team, I was not only designing, but also answering all support emails and App Store reviews. I found that it helped me as a designer to stay in touch with users and not just rely on analytics. 
- Pricing is not a static thing. I have found that the only way to [shake up zero downloads on the App Store](http://localhost:1313/posts/blog/2024/how-to-shake-up-zero-downloads-on-app-store/) is to tweak the price. 
- App analytics is the way to optimize the business. At some point I added mobile analytics to track every button press and screen visit. It helps to answer the question of what feature people aren't using. I found out that some screens were never opened by the user. In this case there are only two answers why: or people don't need it, or they don't know it exists. Both possibilities can be improved by interface tweaks.


During my 11 years on the App Store, I learned a lot about ADS, user research, the development process, code, business, and other areas that ultimately helped me become a better designer. 


