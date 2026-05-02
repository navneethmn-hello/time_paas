const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    
    const newCommunity = {
      name,
      description,
      tags: tags || [],
      admins: [req.user.id],
      members: [req.user.id],
      createdAt: new Date().toISOString()
    };

    const docRef = await Community.add(newCommunity);
    res.status(201).json({ id: docRef.id, ...newCommunity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const snapshot = await Community.get();
    const communities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinCommunity = async (req, res) => {
   try {
     const commRef = Community.doc(req.params.id);
     const doc = await commRef.get();
     
     if(!doc.exists) return res.status(404).json({ message: 'Community not found' });
     
     const community = doc.data();
     let members = community.members || [];

     if(!members.includes(req.user.id)) {
         members.push(req.user.id);
         await commRef.update({ members });
     }
     
     res.json({ id: doc.id, ...community, members });
   } catch(error) {
       res.status(500).json({ error: error.message });
   }
};
