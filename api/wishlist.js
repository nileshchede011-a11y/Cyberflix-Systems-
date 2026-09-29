import { dbRequest, currentUser, send } from './_db.js';
export default async function handler(req,res){
  try{
    const user=await currentUser(req); if(!user) return send(res,401,{error:'Login required'});
    if(req.method==='GET') return send(res,200,{items:await dbRequest(`wishlists?user_id=eq.${user.id}&select=product_id,product&order=created_at.desc`)});
    if(req.method==='POST'){
      const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
      if(!b.product?.id) return send(res,400,{error:'Product required'});
      const existing=await dbRequest(`wishlists?user_id=eq.${user.id}&product_id=eq.${encodeURIComponent(b.product.id)}&select=id&limit=1`);
      if(existing.length) await dbRequest(`wishlists?user_id=eq.${user.id}&product_id=eq.${encodeURIComponent(b.product.id)}`,{method:'DELETE'});
      else await dbRequest('wishlists',{method:'POST',body:JSON.stringify([{user_id:user.id,product_id:String(b.product.id),product:b.product}])});
      return send(res,200,{ok:true});
    }
    return send(res,405,{error:'Method not allowed'});
  }catch(e){return send(res,500,{error:e.message});}
}
