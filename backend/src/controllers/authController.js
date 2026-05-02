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

    let payload;
    if (isMockLogin) {
      payload = {
        sub: idToken.split('_')[1],
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

    const userSnapshot = await User.where('googleId', '==', googleId).limit(1).get();
    let user;
    let isNewUser = false;

    if (userSnapshot.empty) {
      const emailSnapshot = await User.where('email', '==', email).limit(1).get();
      if (!emailSnapshot.empty) {
        return res.status(400).json({ message: 'Email already used by another account.' });
      }

      const newUser = {
        googleId,
        email,
        username,
        universityEmail: null,
        isVerified: false,
        universityName: 'Unknown University',
        bio: '',
        languagePreference: 'en',
        isAnonymous: false,
        friends: [],
        createdAt: new Date().toISOString()
      };
      
      const docRef = await User.add(newUser);
      user = { id: docRef.id, ...newUser };
      isNewUser = true;
    } else {
      user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
    }

    const token = jwt.sign(
      { id: user.id, isNewUser },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
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
    const docRef = User.doc(req.user.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ message: 'User not found' });

    const updates = {};
    if (universityEmail) updates.universityEmail = universityEmail;
    if (universityName) updates.universityName = universityName;
    if (bio !== undefined) updates.bio = bio;
    if (languagePreference) updates.languagePreference = languagePreference;
    if (isAnonymous !== undefined) updates.isAnonymous = isAnonymous;

    if (universityEmail && universityEmail.endsWith('.edu')) {
      updates.isVerified = true;
    } else if (universityEmail) {
       updates.isVerified = false;
    }

    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const doc = await User.doc(req.user.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'User not found' });
    
    const user = { id: doc.id, ...doc.data() };
    
    if (user.friends && user.friends.length > 0) {
      const friendSnapshots = await Promise.all(
        user.friends.map(friendId => User.doc(friendId).get())
      );
      user.friends = friendSnapshots
        .filter(f => f.exists)
        .map(f => ({
          id: f.id,
          username: f.data().username,
          universityName: f.data().universityName
        }));
    } else {
      user.friends = [];
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
