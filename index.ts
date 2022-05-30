addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request: Request): Promise<Response> {
  if (request.method != "POST") {
    return new Response("You need to POST", { status: 400 });
  }

  let contactReq: {
    name?: string;
    email?: string;
    message?: string;
    checkText?: string;
  } = {};
  try {
    const formData = await request.formData();
    for (const entry of formData.entries()) {
      contactReq[entry[0]] = entry[1];
    }
  } catch (e) {
    console.log(e);
    return new Response(e.message, { status: 400 });
  }

  if(!contactReq) return new Response("missing req body", { status: 400 });
  if(!contactReq.name) return new Response("missing name", { status: 400 });
  if(!contactReq.email) return new Response("missing email", { status: 400 });
  if(!contactReq.message) return new Response("missing message", { status: 400 });
  if(!contactReq.checkText) return new Response("missing checkText", { status: 400 });
  if(!/^[a-z]{5}$/.test(contactReq.checkText)) return new Response("check text in wrong format", { status: 400 });

  await CONTACT_FORM.put(
    new Date().toLocaleString("de"),
    JSON.stringify({
      name: contactReq.name,
      email: contactReq.email,
      message: contactReq.message,
    })
  );

  return new Response("danke!");
}
