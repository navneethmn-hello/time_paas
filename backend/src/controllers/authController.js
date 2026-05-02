const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const isMockLogin =
      process.env.NODE_ENV !== 'production' &&
      process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here' &&
      typeof idToken === 'string' &&
      idToken.startsWith('mock_');

    // Verify Google Token (In MVP without true client ID, we can optionally bypass verification for testing)
    // For now, we will assume idToken contains a payload if starting without real google client ID.
    let payload;
    if (isMockLogin) {
      // Mock logic for easy local testing
      payload = {
        sub: idToken.split('_')[1], // mock_12345 -> 12345
        email: idToken.split('_')[1] + '@gmail.com',
        name: 'Mock User ' + idToken.split('_')[1]
      };
    } else {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    const { sub: googleId, email, name: username } = payload;

    let user = await User.findOne({ googleId });
    let isNewUser = false;

    if (!user) {
      // Check if email already exists with different googleId
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Email already used by another account.' });
      }

      user = await User.create({
        googleId,
        email,
        username,
        // Wait for them to supply universityEmail in another step
      });
      isNewUser = true;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, isNewUser },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        universityEmail: user.universityEmail,
        isVerified: user.isVerified,
        languagePreference: user.languagePreference,
        isAnonymous: user.isAnonymous
      },
      isNewUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { universityEmail, universityName, bio, languagePreference, isAnonymous } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (universityEmail) user.universityEmail = universityEmail;
    if (universityName) user.universityName = universityName;
    if (bio !== undefined) user.bio = bio;
    if (languagePreference) user.languagePreference = languagePreference;
    if (isAnonymous !== undefined) user.isAnonymous = isAnonymous;

    // AI Email Verification Mock
    if (universityEmail && universityEmail.endsWith('.edu')) {
      user.isVerified = true; // Automatically verify .edu for MVP
    } else if (universityEmail) {
       user.isVerified = false; // Need mock AI verification
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username universityName');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
