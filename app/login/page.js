"use client";
import { useState } from "react";
import Link from "next/link";
export default function Login(){
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const login=()=>{ if(email&&pass){ localStorage.setItem("ominix_user",email); location.href="/"; } else alert("Fill fields"); };
  return(
    <div style={{minHeight:"100vh",background:"black",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#111",padding:"30px",borderRadius:"15px",width:"90%",maxWidth:"400px",border:"1px solid #333"}}>
        <h2 style={{color:"gold",fontSize:"28px",fontWeight:"bold"}}>Login to OMINIX v4</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",marginTop:"20px",padding:"12px",background:"#222",borderRadius:"8px",border:"1px solid #444",color:"white"}}/>
        <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"100%",marginTop:"10px",padding:"12px",background:"#222",borderRadius:"8px",border:"1px solid #444",color:"white"}}/>
        <button onClick={login} style={{width:"100%",marginTop:"20px",padding:"12px",background:"gold",color:"black",borderRadius:"8px",fontWeight:"bold"}}>Login</button>
        <p style={{marginTop:"15px",textAlign:"center"}}>No account? <Link href="/signup" style={{color:"gold"}}>Sign up</Link></p>
      </div>
    </div>
  )
  }
