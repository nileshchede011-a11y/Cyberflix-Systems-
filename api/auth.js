import { dbRequest, hashPassword, verifyPassword, token, cookie, currentUser, send } from './_db.js';
export default async function handler(req,res) {
  try {
    const action = req.query?.action || 'me';
    if (req.method === 'GET' && action === 'me') return send(res,200,{user:await currentUser(req)});
    if (req.method !== 'POST') return send(res,405,{error:'Method not allowed'});
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (action === 'register') {
      const {name,email,mobile,password}=body;
      if (!name || !email || !password) return send(res,400,{error:'Name, email and password are required'});
      const exists=await dbRequest(`users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id&limit=1`);
      if (exists.length) return send(res,409,{error:'Email already registered'});
      const rows=await dbRequest('users',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify([{name,email:email.toLowerCase(),mobile:mobile||null,password_hash:hashPassword(password)}])});
      const user=rows[0]; const t=token();
      await dbRequest('sessions',{method:'POST',body:JSON.stringify([{token:t,user_id:user.id,expires_at:new Date(Date.now()+30*864e5).toISOString()}])});
      return send(res,201,{user:{id:user.id,name:user.name,email:user.email,mobile:user.mobile}}, {'Set-Cookie':cookie('cfx_session',encodeURIComponent(t))});
    }
    if (action === 'login') {
      const {email,password}=body; if(!email||!password) return send(res,400,{error:'Email and password are required'});
      const rows=await dbRequest(`users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id,name,email,mobile,password_hash&limit=1`); const user=rows[0];
      if(!user || !verifyPassword(password,user.password_hash)) return send(res,401,{error:'Invalid email or password'});
      const t=token(); await dbRequest('sessions',{method:'POST',body:JSON.stringify([{token:t,user_id:user.id,expires_at:new Date(Date.now()+30*864e5).toISOString()}])});
      return send(res,200,{user:{id:user.id,name:user.name,email:user.email,mobile:user.mobile}}, {'Set-Cookie':cookie('cfx_session',encodeURIComponent(t))});
    }
    if (action === 'logout') { const t=(await currentUser(req)) && req.headers.cookie?.match(/cfx_session=([^;]+)/)?.[1]; if(t) await dbRequest(`sessions?token=eq.${encodeURIComponent(decodeURIComponent(t))}`,{method:'DELETE'}); return send(res,200,{ok:true},{'Set-Cookie':cookie('cfx_session','',0)}); }
    return send(res,400,{error:'Unknown auth action'});
  } catch(e){ return send(res,500,{error:e.message}); }
}
