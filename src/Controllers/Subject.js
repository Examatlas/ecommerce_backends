const Subject = require("../Models/Subject");

exports.addSubject = async(req,res)=>{
    try {
        const { id,title } = req?.body;
    
        if (!title) {
          return res
            .status(400)
            .json({ status: false, message: "Title is required" });
        }
        let newSubject;
        if(!id){
        const check_duplicate = await Subject.findOne({title: title});
        if(check_duplicate){
            if(check_duplicate.is_active === true){
                return res.status(400).json({ status: false, message: "Subject already Exists!" });
            }else{
                 newSubject = await Subject.findByIdAndUpdate(check_duplicate._id, {title: title, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null});
                return res
                .status(200)
                .json({ status: true, message: `New Subject ${id ? 'updated' : 'added'} successfully`, data: newSubject });
            }
        }
         newSubject = new Subject({
          title,
          is_active: true,
          addedBy: req.user.userId
        });
        await newSubject.save();
       }else{
        const check_duplicate = await Subject.findOne({title: title, _id: { $ne: id }});
        // console.log("check duplicate: ", check_duplicate)
        if(check_duplicate) return res.status(400).json({ status: false, message: "Subject already Exists!" });
         newSubject = await Subject.findByIdAndUpdate(id, {title: title, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null}, {new: true});
       }
        return res
          .status(200)
          .json({ status: true, message: `New Subject ${id ? 'updated' : 'added'} successfully`, data: {_id: newSubject?._id, title: newSubject?.title, } });
      } catch (error) {
        console.log(error.message,"error")
        return res
          .status(500)
          .json({ status: false,error, message: "Something went wrong. We are looking into it." });
      }
}



exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if subject ID is provided
    if (!id) {
      return res.status(400).json({ status: false, message: "Subject ID is required!" });
    }

    // Fetch subject by ID
    const subject = await Subject.findById(id);

    // If no subject found, return 404
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found!" });
    }
    if (subject.is_active === false) {
        return res.status(400).json({ status: false, message: "Subject already deleted!" });
      }

    // Success response with subject data
    const updateSubject = await Subject.findByIdAndUpdate(id, {is_active: false, deletedBy: req.user.userId, deletedAt: Date()});
    return res.status(200).json({ status: true, message: "Subject deleted successfully" });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, message: "Something went wrong. We are looking into it." });
  }
};

exports.getSubject = async(req, res)=>{
    try {
        const {search, is_active=true, per_page=10 , page=1} = req?.query;
        // Find all subject with pagination
        const getList = await Subject.find(
           search ? {
               $or : [ {title: {$regex: `${search}`, $options: 'i'}
                  },
                ],
                is_active: is_active
            } : {
                is_active: is_active
            },
            {title: true, is_active: true}
        )
        //  .populate({path:'addedBy', select:'name'})
        //  .populate({path:'deletedBy', select:'name'})
        .skip((parseInt(page)-1) * parseInt(per_page))
        .limit(parseInt(per_page));
        
        const totalSubject = await Subject.countDocuments(search ? {
          $or : [ {title: {$regex: `${search}`, $options: 'i'}
             },
           ],
           is_active: is_active
       } : {
           is_active: is_active
       });
    
        res.send({status: true, message: 'Subject List fetched successfully', pagination: {
            totalRows: totalSubject,
            totalPages: Math.ceil(totalSubject/per_page),
            currentPage: parseInt(page),
        },data: getList});
    } catch (error) {
        console.log('Error in getting subject: ', error);
        res.status(500).json({
            status: false,
            message: 'Something went wrong. We are looking into it.',
            error: error.message,
        });
    }
}

