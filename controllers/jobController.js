import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrHandler from "../middlewares/error.js";
import { Job } from "../models/jobschema.js";

export const getalljobs =catchAsyncError(async(req,res,next)=>{
    const jobs=await Job.find({expired:false});
    res.json({
        status:true,
        jobs,
    });
});

export const  postjob=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next (new ErrHandler("Munna your role is to see the jobs not to create the jobs!"),400);
    }

    const {title,description,category,country,city,location,fixedSalary,salaryfrom,salaryto,expried,jobPostedOn}=req.body;

    if(!title||!description||!category||!country||!city||!location){
        return  next (new ErrHandler("Munna please complete the form"),400);
    }

    if((!salaryfrom||!salaryto)&&!fixedSalary){
        return next (new ErrHandler("You left to fill range salary or fixed salary"),400);
    }

    if(salaryfrom&&salaryto&&fixedSalary){
        return next (new ErrHandler("You can't fill both range salary and fixed salary"),400);
    }

    const postedBy=req.user._id;

   const job= await Job.create({title,description,category,country,city,location,fixedSalary,salaryfrom,salaryto,expried,jobPostedOn,postedBy});

   res.status(200).json({
    success:true,
    message:"job posted",
    job
   });
});

export const getmyjob=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return  next (new ErrHandler("Munna your role is to see the jobs not to see which job you created the jobs!"),400);
    }

    
    const myjobs=await Job.find({postedBy:req.user._id});
    res.status(200).json({
        success:true,
        message:"your created jobs are:",
        myjobs
    });
});


export const updateJob=catchAsyncError(async (req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next (new ErrHandler("Munna, your role is to view jobs, not to update them!"),400);
    }

    const {id}=req.params;
    let job = await Job.findById(id);
    if(!job){ 
      return next(new ErrHandler("Job not found",404));
    }
    job=await Job.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        message:"successfully updated",
        job,
    });
});
export const deletethejob=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next (new ErrHandler("Munna, your role is to view jobs, not to delete them!"),400);
    }

    const {id}=req.params;
    let job = await Job.findById(id);
    if(!job){ 
      return next(new ErrHandler("Job not found",404));
    }
    await job.deleteOne();
    res.status(200).json({
        success:true,
        message:"successfully deleted",
        job,
    });

})