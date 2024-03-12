import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobschema.js";

export const employerGetAllApplication=catchAsyncError(async(req,res,next)=>{
  const {role}=req.user;

  if(role==="Job Seeker"){
    return next(new ErrHandler("munna, you are not a employer to see that"),404);
  }

  const {_id}=req.user;

  const allApplication = await Application.find({'employerID.user':_id});

res.json({
    success:true,
    "message":"ALL Application",
    allApplication
})
});

export const JobSeekerGetAllApplication=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
  
    if(role==="Employer"){
      return next(new ErrHandler("Munna,you are not a Job Seeker to access that!"),404);
    }
  
    const {_id}=req.user;
  
    const allApplication = await Application.find({'applicantID.user':_id});
  
  res.json({
      success:true,
      "message":"ALL Application",
      allApplication
  })
  });

  export const JobSeekerDeleteApplication=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
  
    if(role==="Employer"){
      return next(new ErrHandler("Munna,you are not a Job Seeker to access that!"),404);
    }
  
    const {id}=req.params;
  
    const application = await Application.findById(id);
   
if(!application){
    return next (new ErrHandler("Application not found"),404);
}
await application.deleteOne();
  res.json({
      success:true,
      "message":"Application deleted successfully",
      application
  });
  });

  export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;

    if(role==="Employer"){
        return next(new ErrHandler("Munna,you are not a Job Seeker to   apply in that!"),404);
      }
   
if(!(req.files)||Object.keys(req.files).length===0){
    return next(new ErrHandler("Resume File Required"));
}
        const {resume}=req.files;
const allowFormat=["image/png","image/jpeg","image/webp"];

if(!allowFormat.includes(resume.mimetype)){
    return next(new ErrHandler("Invalid file type.Please upload your resume in png,jpg or webp",404));
}

 const cloudinaryResponse =await cloudinary.uploader.upload(resume.tempFilePath);

 if(!cloudinaryResponse||cloudinaryResponse.error){
    console.error("cloudinary error:",cloudinaryResponse.error||"unknown error");
    return next(new ErrHandler("Failed to upload resume.",500));
 }

 const {name,email,coverletter,phone,jobId} = req.body;

 const applicantID={
    user:req.user._id,
    role:"Job Seeker"
 }

 if(!jobId){
    return next(new ErrHandler("Job Not Found!",404));
 }
 const jobdetails=await Job.findById(jobId);



 if(!jobdetails){
    return next(new ErrHandler("Job not found!",404));
 }

 const employerID={
    user:jobdetails.postedBy,
    role:"Employer"
 };

 console.log(employerID);
 if(!name || !email || !coverletter ||!phone || !applicantID || !employerID){
    return next (new ErrHandler("Please fill all field!",404))
 }

 const application=await Application.create({
    name,email,coverletter,phone,applicantID,employerID,jobId,resume:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    },
 });

 res.json({
    success:true,
    message:"Applied Successfully",
    application
 })
  });