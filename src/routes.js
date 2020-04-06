import { Router } from 'express';


const router = new Router();

router.get('/',(request,response)=>{
  return response.json({message:"Hello OmniStack"});
});

export default router;