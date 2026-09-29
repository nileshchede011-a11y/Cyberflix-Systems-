import { dbReady, send } from './_db.js';
export default function handler(req,res){ send(res,200,{ok:true,service:'Cyberflix Systems API',database:dbReady()?'configured':'not-configured'}); }
