
Here's some videos showcasing the website!
#### BarberDemo Desktop
---
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)
<iframe width="560" height="315" src="https://www.youtube.com/embed/iJajXseyBHE?si=T8Z7yYOypbVOBs_g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### BarberDemo Mobile
---
[![BarberDemo Mobile Youtube](https://img.youtube.com/vi/7ahjOYiF5yY/0.jpg)](https://www.youtube.com/watch?v=7ahjOYiF5yY)

## Background  
---  
The goal for this project was for me to build a website front to back to show potential clients I'm capable of releasing a modern, full stack web application. Before this project, my professional experience mostly consisted of aging technologies, and making changes to an already existing application. 

Wanting to work as a freelance web developer, I felt I needed proof that I could work with a modern tech stack. I also wanted to prove that I could bring a web application from design to production. I ended up choosing the MERN stack, and you can visit the site at https://zpete.dev !

## Design  
---  
For this portfolio application's requirements, I wanted to make a responsive frontend that made RESTful API calls to a backend that was connected to a database. Given my experience writing JavaScript, and my past experiences with React and Node.js, I chose the MERN stack to deliver on these requirements. The application would be a barbershop's landing page with scheduling capabilities.

For the frontend, I used TailwindCSS to power most of the styling for my website. I chose this framework to speed up the development process, since you can easily adjust the styles inline as you code HTML. 

For the backend, I went with Node.js and Express.js, and a Mongo Database. These technologies have a lot of support for each other, and the setup was simple. For my middleware, I added CORS, Helmet (security headers), JWT tokens, a Rate Limiter, and a Data Validator for backend server security. I hashed passwords and encrypted email addresses for safe data storage. I also setup database security to prevent unauthorized access.

For designing the layouts, I used Figma. Below is the Figma design with placeholder images. The beta version of the site was dog themed to keep things fun :)

![BarberEase](https://github.com/zpete-dev/BarberEase/assets/30848428/4dd152a7-668f-492d-9d09-876969c03fba)

I used Docker to package the frontend, backend, and database. This was to simplify the process of installing the application on another machine when the time came.

For bringing the application to production, I chose Cloudflare as a host for its performance and security benefits. AWS LightSail acted as the VPS to host the application. I also added Caddy to the VPS to act as a reverse proxy for my Docker stack and to automatically renew SSL certificates.  
## Problems  
---  
Being my first full stack application that I brought to live servers, I had several gaps in my knowledge of what it took to complete it. My largest time loss was due to me assuming I could design a web page layout on the fly and skip using Figma for wireframes. I could not... I had to do a lot of backtracking and lost a lot of time, when I should have done the wireframes before I ever went into my IDE.

Other minor problems I ran into were related to my not fully knowing how to plan out building an app from scratch. I used ChatGPT-4 as a coding assistant to help me get through these problems. I am not exaggerating when I say ChatGPT saved me well over 100 hours of development time.   
## Results  
---  
I was very pleased with the results, and I was able to achieve what I originally set out to do. This MERN stack app has a fully responsive frontend that is working on mobile. I went through many iterations making animations look fluid so that a potential user would have a seamless experience browsing the site. This website will stay up and running securely for the time being, with lots of security measures protecting it from attacks.

With some additional minor changes, I believe many small businesses would be very pleased with this site. Don't take my word for it, though; you can visit the site and see for yourself! Visit https://zpete.dev and tell me what you think @ zpete.dev@gmail.com

Thank You!!!
