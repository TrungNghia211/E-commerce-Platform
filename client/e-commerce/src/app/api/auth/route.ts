export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;
  if (!sessionToken) {
    return Response.json(
      { message: "The session token is not received" },
      {
        status: 400,
      }
    );
  }
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly`,
    },
  });
}
