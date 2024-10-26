const Category = require("../Models/Category");
const SubCategory = require("../Models/SubCategory");

exports.createCategory = async(req,res)=>{
    try{
        const {id, categoryName , description , tags} = req.body;
        if(!categoryName){
            return res.status(422).json({status:false,message:"categoryName is required!"})
        }
        if(!description){
            return res.status(422).json({status:false,message:"description is required!"})
        }
        if(!tags){
            return res.status(422).json({status:false,message:"tags is required!"})
        }
        let newCategory;
        if(!id){
        const check_duplicate = await Category.findOne({categoryName: categoryName});
        if(check_duplicate){
            if(check_duplicate.is_active === true){
                return res.status(400).json({ status: false, message: "Category already Exists!" });
            }else{
                newCategory = await Category.findByIdAndUpdate(check_duplicate._id, {categoryName,
                    description,
                    tags, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null});
                return res
                .status(200)
                .json({ status: true, message: `New Category ${id ? 'updated' : 'added'} successfully`, data: newCategory });
            }
        }
        newCategory = new Category({
          categoryName,
          description,
          tags,
          is_active: true,
          addedBy: req.user.userId
        });
        await newCategory.save();
       }else{
        const check_duplicate = await Category.findOne({categoryName: categoryName, _id: { $ne: id }});
        // console.log("check duplicate: ", check_duplicate)
        if(check_duplicate) return res.status(400).json({ status: false, message: "Category already Exists!" });
        newCategory = await Category.findByIdAndUpdate(id, {categoryName,
                 description, tags, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null}, {new: true});
       }
        return res
          .status(200)
          .json({ status: true, message: `New Category ${id ? 'updated' : 'added'} successfully`, data: {_id: newCategory?._id, title: newCategory?.title, } });

        // const NewCategory = await Category.create({
        //     categoryName,
        //     description,
        //     tags,
        //     addedBy: req?.user?.userId
        // })
        // return res.status(200).json({status:true,message:"Category created successfully",data:NewCategory})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,mesage:"internal server error"})
    }
}

// get category by id 

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if category ID is provided
    if (!id) {
      return res.status(400).json({ status: false, message: "Category ID is required!" });
    }

    // Fetch category by ID
    const category = await Category.findById(id);

    // If no category found, return 404
    if (!category) {
      return res.status(404).json({ status: false, message: "Category not found!" });
    }

    // Success response with category data
    return res.status(200).json({ status: true, message: "Category fetched successfully", data: category });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// create subCategory
exports.createSubCategory = async(req,res)=>{
    try{
        const{id, categoryId,subCategoryName,description,tags} = req.body;
        if(!categoryId){
            return res.status(422).json({status:false,mesasge:"categoryId is required!"})
        }
        if(!subCategoryName){
            return res.status(422).json({status:false,message:"subCategoryName is required!"})
        }
        if(!description){
            return res.status(422).json({status:false,message:"description is required!"})
        }
        if(!tags){
            return res.status(422).json({status:false,message:"tags is required!"})
        }

        let newSubCategory;
        if(!id){
        const check_duplicate = await SubCategory.findOne({categoryId: categoryId, subCategoryName: subCategoryName});
        if(check_duplicate){
            if(check_duplicate.is_active === true){
                return res.status(400).json({ status: false, message: "SubCategory already Exists!" });
            }else{
                newSubCategory = await SubCategory.findByIdAndUpdate(check_duplicate._id, {categoryId,subCategoryName,
                    description,
                    tags, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null});
                return res
                .status(200)
                .json({ status: true, message: `New SubCategory ${id ? 'updated' : 'added'} successfully`, data: newSubCategory });
            }
        }
        newSubCategory = new SubCategory({
          categoryId,
          subCategoryName,
          description,
          tags,
          is_active: true,
          addedBy: req.user.userId
        });
        await newSubCategory.save();
       }else{
        const check_duplicate = await SubCategory.findOne({categoryId:categoryId,subCategoryName: subCategoryName, _id: { $ne: id }});
        // console.log("check duplicate: ", check_duplicate)
        if(check_duplicate) return res.status(400).json({ status: false, message: "SubCategory already Exists!" });
        newSubCategory = await SubCategory.findByIdAndUpdate(id, {categoryId, subCategoryName,
                 description, tags, is_active: true, addedBy: req.user.userId,deletedBy: null, deletedAt: null}, {new: true});
       }
        return res
          .status(200)
          .json({ status: true, message: `New SubCategory ${id ? 'updated' : 'added'} successfully`, data: {_id: newSubCategory?._id, title: newSubCategory?.title, } });


        // const newsubcategory = await SubCategory.create({
        //     categoryId,
        //     subCategoryName,
        //     description,
        //     tags,
        //     addedBy: req?.user?.userId
        // })
        // return res.status(200).json({status:true,message:"Sub Category created successfully!",data:newsubcategory})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error!!"})
    }
}



// get subcategory by id 
exports.getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find subcategory by ID
        const subCategory = await SubCategory.findById(id);
       
        // Check if subcategory exists
        if (!subCategory) {
            return res.status(404).json({ status: false, message: "Subcategory not found!" });
        }

        // Return subcategory data
        return res.status(200).json({ status: true, message: "SubCategory fetched successfully!", data: subCategory });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate if category ID is provided
      if (!id) {
        return res.status(400).json({ status: false, message: "Category ID is required!" });
      }
  
      // Fetch category by ID
      const category = await Category.findById(id);
  
      // If no category found, return 404
      if (!category) {
        return res.status(404).json({ status: false, message: "Category not found!" });
      }
      if (category.is_active === false) {
          return res.status(400).json({ status: false, message: "Category already deleted!" });
        }
  
      // Success response with category data
      const updateCategory = await Category.findByIdAndUpdate(id, {is_active: false, deletedBy: req.user.userId, deletedAt: Date()});
      return res.status(200).json({ status: true, message: "Category deleted successfully" });
  
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: false, message: "Something went wrong. We are looking into it." });
    }
  };

exports.deleteSubCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate if category ID is provided
      if (!id) {
        return res.status(400).json({ status: false, message: "SubCategory ID is required!" });
      }
  
      // Fetch category by ID
      const subCategory = await SubCategory.findById(id);
  
      // If no subCategory found, return 404
      if (!subCategory) {
        return res.status(404).json({ status: false, message: "SubCategory not found!" });
      }
      if (subCategory.is_active === false) {
          return res.status(400).json({ status: false, message: "SubCategory already deleted!" });
        }
  
      // Success response with category data
      const updateSubCategory = await SubCategory.findByIdAndUpdate(id, {is_active: false, deletedBy: req.user.userId, deletedAt: Date()});
      return res.status(200).json({ status: true, message: "SubCategory deleted successfully" });
  
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: false, message: "Something went wrong. We are looking into it." });
    }
  };  
  
  exports.getCategory = async(req, res)=>{
      try {
          const {search, is_active=true, per_page=10 , page=1} = req?.query;
  
          // Find all category with pagination
          let condition = {};
          condition.is_active = is_active;
          if(search){
              condition["$or"] = [ {categoryName: {$regex: `${search}`, $options: 'i'}
                     }
                   ];
          }
          const getList = await Category.find(
                condition,
              {categoryName: true, description: true, tags: true,is_active: true}
          )
          //  .populate({path:'addedBy', select:'name'})
          //  .populate({path:'deletedBy', select:'name'})
          .skip((parseInt(page)-1) * parseInt(per_page))
          .limit(parseInt(per_page))
          ;
          const totalCategory = await Category.countDocuments(search ? {
            $or : [ {categoryName: {$regex: `${search}`, $options: 'i'}
               },
             ],
             is_active: is_active
         } : {
             is_active: is_active
         });
      
          res.send({status: true, message: 'Category List fetched successfully', pagination: {
              totalRows: totalCategory,
              totalPages: Math.ceil(totalCategory/per_page),
              currentPage: parseInt(page),
          },data: getList});
      } catch (error) {
          console.log('Error in getting category: ', error);
          res.status(500).json({
              status: false,
              message: 'Something went wrong. We are looking into it.',
              error: error.message,
          });
      }
  }

  exports.getSubCategory = async(req, res)=>{
    try {
        const {search,categoryId, is_active=true, per_page=10 , page=1} = req?.query;

        // Find all subCategory with pagination
        let condition = {};
        condition.is_active = is_active;
        if(categoryId){
            condition.categoryId = categoryId;
        }
        if(search){
            condition["$or"] = [ {subCategoryName: {$regex: `${search}`, $options: 'i'}
                   }
                 ];
        }

        const getList = await SubCategory.find(
            condition,
            {categoryId: true, subCategoryName: true, description: true, tags: true, is_active: true}
        )
        .populate({path: 'categoryId', select: 'categoryName description tags ', match: { is_active: true }})
        //  .populate({path:'addedBy', select:'name'})
        //  .populate({path:'deletedBy', select:'name'})
        .skip((parseInt(page)-1) * parseInt(per_page))
        .limit(parseInt(per_page))
        ;
        const totalSubCategory = await SubCategory.countDocuments(condition);
    
        res.send({status: true, message: 'SubCategory List fetched successfully', pagination: {
            totalRows: totalSubCategory,
            totalPages: Math.ceil(totalSubCategory/per_page),
            currentPage: parseInt(page),
        },data: getList});
    } catch (error) {
        console.log('Error in getting subCategory: ', error);
        res.status(500).json({
            status: false,
            message: 'Something went wrong. We are looking into it.',
            error: error.message,
        });
    }
}