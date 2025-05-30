require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');
const taskRoutes = require('./routes/tasksRoute');
const categoryRoutes = require('./routes/categoriesRoute');

const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration to allow all origins and specific headers/methods
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key', 'Authorization']
};

// Middleware setup
app
  .use(bodyParser.json())
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(cors(corsOptions))
  .use('/', require('./routes/index.js'));

// Configure Passport GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      // Fallback if displayName is missing
      if (!profile.displayName) {
        profile.displayName = profile.username;
      }
      console.log('GitHub Profile:', profile);
      return done(null, profile);
    }
  )
);

// Passport session serialization — determines what data is stored in session cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Passport session deserialization — retrieves user info from session cookie
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Root route — shows login status and username if logged in
app.get('/', (req, res) => {
  const user = req.session.user;
  res.send(user ? `Logged in as ${user.displayName || user.username}` : 'Logged Out');
});

// GitHub OAuth callback route
app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// API routes for tasks and categories
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// Serve Swagger API documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Connect to database then start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
