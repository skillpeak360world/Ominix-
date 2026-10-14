"use client";
import { useEffect } from "react";
export default function Logout(){
  useEffect(()=>{
    localStorage.removeItem("ominix_user");
    window.location.href="/login";
  },[]);
  return <div style={{minHeight:"100vh",background:"black",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>Logging out...</div>
}
