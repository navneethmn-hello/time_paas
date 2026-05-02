const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    const community = await Community.create({
      name,
      description,
      tags,
      admins: [req.user.id],
      members: [req.user.id],
    });
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinCommunity = async (req, res) => {
   try {
     const community = await Community.findById(req.params.id);
     if(!community) return res.status(404).json({ message: 'Community not found' });

     if(!community.members.includes(req.user.id)) {
         community.members.push(req.user.id);
         await community.save();
     }
     res.json(community);
   } catch(error) {
       res.status(500).json({ error: error.message });
   }
}
