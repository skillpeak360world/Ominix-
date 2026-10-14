export async function GET(){
  // Simple auth - returns no user for now, but fixes the build
  // Later you can connect real login with JWT
  return Response.json({user: null, loggedIn: false, message:"Ominix auth ready - login system can be added"});
}

export async function POST(req){
  const {email} = await req.json();
  return Response.json({user:{email, name:"Ominix User"}, token:"demo-token"});
}
