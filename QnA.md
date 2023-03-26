How long did this assignment take?
> Hard to say, but around 5-6 hours. I low-key picked at it for a few days / evenings.

What was the hardest part?
> Setting up a working test library is always kind of tricky - getting mocks and spying working correctly. The bootstrapping library I used to set up the project included Mocha and Chai, where I'm more familiar with Jest, so there was a bit of a learning curve.

Did you learn anything new?
> I had never set up JWT authentication before, so that was a nice lesson.

Is there anything you would have liked to implement but didn't have the time to?
> Lots.
> - It's unfortunate that the testing setup hits the 'production' database - I'd like to have set up a testing database that sets up and tears down with the tests and manages persistence easily. All my tests hit the actual DB and have to set up and clear it manually - it would be much cleaner to use a system of fixtures to avoid repeating myself.

> - The tests on the Users endpoints are lacking - I only tested the happy path. I ran out of time. Would have liked to test input validation, mocking out database errors, JWT errors, etc.

> - The logging is lacking. The bootstrapped project had a logger set up, but I didn't use it to save time.

What are the security holes (if any) in your system? If there are any, how would you fix them?
> - The server is not running over HTTPS - I would use Express's built in options to use an SSL certificate.

> - The `/signup` endpoint is not authenticated. Especially with no throttling or rate limiting implemented, the signup endpoint could be exploited to fill our database with junk users.

> - The `GET /users` endpoint does not implement any kind of paging. If the database were to grow meaningfully, trying to return all those users would become a problem.

Do you feel that your skills were well tested?
> I do! It was a fair test. In the future, Dapper Labs might consider creating a barebones application skeleton so candidates don't have to spend time on project configuration, but I can see the appeal of testing candidates on that side of things too.