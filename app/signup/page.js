"use client";
import { useState } from "react";
import Link from "next/link";

export default function Signup(){
  const [email,setEmail]=useState(""); 
  const [pass,setPass]=useState("");

  const signup=()=>{
    if(email && pass){
      localStorage.setItem("ominix_user", email);
      window.location.href="/";
    } else alert("Fill all fields");
  };

  return(
    <div style={{minHeight:"100vh",background:"black",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#111",padding:"30px",borderRadius:"15px",width:"90%",maxWidth:"400px",border:"1px solid #333"}}>
        <h2 style={{fontSize:"28px",fontWeight:"bold",background:"linear-gradient(90deg,gold,purple)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Join OMINIX v4</h2>
        
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",marginTop:"20px",padding:"12px",background:"#222",borderRadius:"8px",border:"1px solid #444",color:"white"}}/>
        
        <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"100%",marginTop:"10px",padding:"12px",background:"#222",borderRadius:"8px",border:"1px solid #444",color:"white"}}/>
        
        <button onClick={signup} style={{width:"100%",marginTop:"20px",padding:"12px",background:"linear-gradient(90deg,gold,purple)",color:"white",borderRadius:"8px",fontWeight:"bold"}}>Create Account</button>
        
        <p style={{marginTop:"15px",textAlign:"center"}}>Have account? <Link href="/login" style={{color:"gold"}}>Login</Link></p>
      </div>
    </div>
  )
                                                                                               }
