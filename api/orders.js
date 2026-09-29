import { dbRequest, currentUser, send } from './_db.js';
export default async function handler(req,res){
  try{
    const user=await currentUser(req); if(!user) return send(res,401,{error:'Login required'});
    if(req.method==='GET'){
      const rows=await dbRequest(`orders?user_id=eq.${user.id}&select=id,order_id,customer,items,total,payment_method,status,created_at&order=created_at.desc`);
      return send(res,200,{orders:rows});
    }
    if(req.method==='POST'){
      const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
      if(!b.items?.length) return send(res,400,{error:'Cart is empty'});
      const orderId=b.orderId || `CFX-${Date.now()}`;
      const rows=await dbRequest('orders',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify([{user_id:user.id,order_id:orderId,customer:b.customer||{},items:b.items,total:b.total,payment_method:b.paymentMethod,status:'Confirmed'}])});
      return send(res,201,{order:rows[0]});
    }
    return send(res,405,{error:'Method not allowed'});
  }catch(e){return send(res,500,{error:e.message});}
}
