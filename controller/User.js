const User = require('../model/User')

exports.createUser = async (req, res) => {
  const user = new User(req.body)
  try{
    const doc = await user.save();
    res.status(201).json(doc);
  }catch(err){
    res.status(400).json(err);
  }
};
// exports.fetchAllUser = async (req, res) => {
//   let query = User.find({});
//   let totalProductsQuery = Product.find({});

//   if(req.query.category){
//     query =  query.find({category:req.query.category});
//     totalProductsQuery = totalProductsQuery.find({category:req.query.category});

//   }
//   if(req.query.brand){
//     query =  query.find({brand:req.query.brand});
//     totalProductsQuery = totalProductsQuery.find({brand:req.query.brand});

//   }
//   if(req.query._sort && req.query._order){
//     query =  query.sort({[req.query._sort]:req.query._order});   

//   }

//   const totalDocs = await totalProductsQuery.count().exec();
  
//   if(req.query._page && req.query._per_page){ 
//     const pageSize = req.query._per_page;
//     const page = req.query._page;
//     query =  query.skip(pageSize*(page-1)).limit(pageSize);
//   } 
//   try{
//     const docs = await query.exec();
//     res.set('X-Total-Count',totalDocs);
//     res.set('Access-Control-Expose-Headers', 'X-Total-Count');     
//     res.status(200).json(docs);
//   }catch(err){
//     res.status(400).json(err);
//   }
// };
exports.fetchUserById = async (req, res) => {
  const {id} = req.params;
  
  try{
    const user = await User.findById(id,'name email id')    
    res.status(200).json(user);
  }catch(err){
    res.status(400).json(err);
  }
};
exports.updateUser = async (req, res) => {
  const {id} = req.params;
  
  try{
    const user = await User.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(user);
  }catch(err){
    res.status(400).json(err);
  }
};
